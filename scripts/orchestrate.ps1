param(
    [Parameter(Mandatory = $true)]
    [string]$Task
)

$ErrorActionPreference = "Stop"

# Protect existing work
if (git status --porcelain --untracked-files=no) {
    throw "Commit your existing tracked changes first."
}

$baseCommit = git rev-parse HEAD

# Create a unique folder for this run's baton files
$runId = [guid]::NewGuid().ToString()
$runDir = Join-Path $env:TEMP "agent-runs\$runId"
New-Item -ItemType Directory -Path $runDir -Force | Out-Null

$planFile = Join-Path $runDir "plan.md"
$implementationFile = Join-Path $runDir "implementation.md"
$reviewFile = Join-Path $runDir "review.md"

Write-Host "Baton directory: $runDir"

# STAGE 1: Planning
Write-Host "`n=== PLANNER ==="

copilot --agent planner --allow-tool=read --silent `
    --prompt "Create a scoped implementation plan for: $Task. Base commit: $baseCommit. Only src/tasks.ts and test/tasks.test.ts may change. Include acceptance criteria. Do not modify files." |
    Tee-Object -FilePath $planFile

if ($LASTEXITCODE -ne 0) {
    throw "Planner failed."
}

$plan = Get-Content $planFile -Raw

if (-not $plan.Trim()) {
    throw "Planning baton is empty."
}

# APPROVAL GATE
$approval = Read-Host "`nApprove this plan? (yes/no)"

if ($approval -ne "yes") {
    Write-Host "Plan rejected. Workflow stopped."
    return
}

if ((git rev-parse HEAD) -ne $baseCommit) {
    throw "Base commit changed. Planning must be repeated."
}

# STAGE 2: Development
Write-Host "`n=== DEVELOPER ==="

copilot --agent developer --silent `
    --allow-tool='read,write(src/tasks.ts),write(test/tasks.test.ts),shell(npm:*)' `
    --deny-tool='shell(git commit),shell(git push)' `
    --prompt "Implement this approved plan. Do not commit or push. Report changes, verification results and outstanding issues. Plan: $plan" |
    Tee-Object -FilePath $implementationFile

if ($LASTEXITCODE -ne 0) {
    throw "Developer failed."
}

# STAGE 3: Deterministic verification
Write-Host "`n=== VERIFICATION ==="

if ((git rev-parse HEAD) -ne $baseCommit) {
    throw "Unexpected commit detected."
}

$changedFiles = @(git diff --name-only HEAD)

$unexpectedFiles = $changedFiles | Where-Object {
    $_ -notin @("src/tasks.ts", "test/tasks.test.ts")
}

if ($unexpectedFiles) {
    throw "Unexpected files modified: $unexpectedFiles"
}

if (-not $changedFiles) {
    Write-Host "No code changes produced. Continuing verification."
}

npm run typecheck

if ($LASTEXITCODE -ne 0) {
    throw "Typecheck failed."
}

npm test

if ($LASTEXITCODE -ne 0) {
    throw "Tests failed."
}

# STAGE 4: Independent review
Write-Host "`n=== REVIEWER ==="

$implementation = Get-Content $implementationFile -Raw
$diff = git diff HEAD | Out-String

copilot --agent reviewer --allow-tool=read --silent `
    --deny-tool='write,shell' `
    --prompt "Independently review the implementation. Inspect the code and tests. Treat the implementation report as a claim, not proof. Do not modify files. End with exactly VERDICT: PASS or VERDICT: CHANGES REQUIRED. Plan: $plan Implementation report: $implementation Actual diff: $diff" |
    Tee-Object -FilePath $reviewFile

if ($LASTEXITCODE -ne 0) {
    throw "Reviewer failed."
}

$review = Get-Content $reviewFile -Raw

if ($review.Trim() -notmatch '(?m)^VERDICT: PASS\s*\z') {
    Write-Host "Review did not pass. Human intervention required."
    return
}

# FINAL APPROVAL GATE
Write-Host "`n=== HUMAN APPROVAL ==="

$approval = Read-Host "Accept the implementation? (yes/no)"

if ($approval -eq "yes") {
    Write-Host "Workflow approved. Ready for manual commit."
} else {
    Write-Host "Workflow rejected. Changes retained for inspection."
}

Write-Host "Baton files saved in: $runDir"
