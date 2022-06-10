const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');
async function run() {
  try {
    const { GITHUB_SHA, GITHUB_TOKEN } = process.env;
    const per_page = 100;
    if (!GITHUB_SHA) {
      core.setFailed('Missing GITHUB_SHA');
      return;
    }
    if (!GITHUB_TOKEN) {
      core.setFailed('Missing GITHUB_TOKEN');
      return;
    }
    const octokit = new GitHub(GITHUB_TOKEN);
    octokit.repos
      .listTags({
        ...context.repo,
        per_page
      })
      .then(({ data: tags }) => {
        tags.forEach(tag => {
          const tagName = tag.name;
          octokit.git.updateRef({
            ...context.repo,
            ref: `tags/${tagName}`,
            sha: GITHUB_SHA
          });
        }).catch(err => {
          console.error("Unable to find commits", err);
        });
      });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
