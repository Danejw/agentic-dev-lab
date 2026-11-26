const [number, status] = process.argv.slice(2);
const token = process.env.PROJECTS_TOKEN;

async function graphql(query, variables = {}) {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query, variables })
  });

  const result = await response.json();

  if (!response.ok || result.errors) {
    throw new Error(JSON.stringify(result.errors || result.message));
  }

  return result.data;
}

async function main() {
  if (!token || !number || !status) {
    throw new Error("Token, item number and status are required.");
  }

  const data = await graphql(`
    {
      user(login: "Danejw") {
        projectV2(number: 6) {
          id
          fields(first: 100) {
            nodes {
              ... on ProjectV2SingleSelectField {
                id
                name
                options { id name }
              }
            }
          }
          items(first: 100) {
            nodes {
              id
              content {
                ... on Issue {
                  number
                  repository { nameWithOwner }
                }
                ... on PullRequest {
                  number
                  repository { nameWithOwner }
                }
              }
            }
          }
        }
      }
    }
  `);

  const project = data.user.projectV2;
  const field = project.fields.nodes.find(f => f.name === "Status");
  const option = field?.options.find(o => o.name === status);
  const item = project.items.nodes.find(i =>
    i.content?.number === Number(number) &&
    i.content.repository.nameWithOwner === "Danejw/agentic-dev-lab"
  );

  if (!item || !option) {
    throw new Error("Item or status not found.");
  }

  const result = await graphql(`
    mutation($input: UpdateProjectV2ItemFieldValueInput!) {
      updateProjectV2ItemFieldValue(input: $input) {
        projectV2Item {
          fieldValueByName(name: "Status") {
            ... on ProjectV2ItemFieldSingleSelectValue {
              name
            }
          }
        }
      }
    }
  `, {
    input: {
      projectId: project.id,
      itemId: item.id,
      fieldId: field.id,
      value: { singleSelectOptionId: option.id }
    }
  });

  console.log(JSON.stringify(result, null, 2));
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
