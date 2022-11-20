const { Octokit } = require('@octokit/action');

const octokit = new Octokit();

const getAuthor = (payload) => {
  return payload?.issue?.user?.login || payload?.pull_request?.user?.login || null;
};

const isCommunityContributor = async (owner, repo, username) => {
  if (!username) return false;

  const {
    data: { permission },
  } = await octokit.rest.repos.getCollaboratorPermissionLevel({
    owner,
    repo,
    username,
  });

  return permission === 'read' || permission === 'none';
};

const addLabel = async (label, owner, repo, issueNumber) => {
  await octokit.rest.issues.addLabels({
    owner,
    repo,
    issue_number: issueNumber,
    labels: [label],
  });
};

const start = async () => {
  const payload = require(process.env.GITHUB_EVENT_PATH);
  const username = getAuthor(payload);
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
  const { number } = payload?.issue || payload?.pull_request;

  const isCommunityUser = await isCommunityContributor(owner, repo, username);
  console.log('::set-output name=is-community::%s', isCommunityUser ? 'yes' : 'no');

  if (isCommunityUser) {
    await addLabel('community', owner, repo, number);
  }
};

start();
