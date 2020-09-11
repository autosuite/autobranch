import * as core from '@actions/core';
import * as octokit from '@octokit/rest';
import * as github from "@actions/github";

/**
 * The key name for the GitHub secret access token.
 */
const GITHUB_TOKEN_INPUT_KEY: string = "github_token";

/**
 * The maximum number of words in an issue title.
 */
const SHORTENED_WORD_COUNT: number = 3;


/**
 * Create a branch with using the toolkit with the given branch name.
 *
 * @param toolkit The Octokit toolkit.
 * @param branchName The branch's name.
 */
async function createBranch(
    toolkit: octokit.Octokit, branchName: string
): Promise<octokit.Octokit.GitCreateRefResponse> {
  core.info(`Creating branch: \`${branchName}\`.`);

  return toolkit.git.createRef({
    ref: `refs/heads/${branchName}`,
    sha: github.context.sha,
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
  }).then(
      (response: octokit.Octokit.Response<octokit.Octokit.GitCreateRefResponse>) => response.data
  );
}


/**
 * From a long title, shorten to a lowercase_snake_case and remove all non-alphabetical characters.
 *
 * @param title The GitHub Issue's title.
 */
async function shortenTitle(title: string): Promise<string> {
  return title.toLowerCase()
      .replace(/[^A-Za-z ]/gi, "")
      .split(" ")
      .slice(0, SHORTENED_WORD_COUNT)
      .join("-");
}


/**
 * Determine a branch name from the GitHub context.
 *
 * @param issueTitle The issue's title.
 */
async function determineBranchName(issueTitle: string): Promise<string> {
  return `issue/${github.context.issue.number}-${await shortenTitle(issueTitle)}`;
}


/**
 * Fetch the Issue's title. The response of this should be await-ed and cached.
 *
 * @param toolkit The Octokit toolkit.
 */
async function getIssueContents(toolkit: octokit.Octokit): Promise<octokit.Octokit.IssuesGetResponse> {
  const issueOwner: string = github.context.issue.owner;
  const issueRepo: string = github.context.issue.repo;

  return await toolkit.issues.get({
    owner: issueOwner,
    repo: issueRepo,
    issue_number: github.context.issue.number
  }).then((response: octokit.Octokit.Response<octokit.Octokit.IssuesGetResponse>) => response.data);
}


async function run() {
  try {
    /* Initialize the GitHub/Octokit toolkit. */

    const toolkit: octokit.Octokit = new octokit.Octokit({"auth": core.getInput(GITHUB_TOKEN_INPUT_KEY)});

    /* Gather and cache. */

    const issueResponse: octokit.Octokit.IssuesGetResponse = await getIssueContents(toolkit);
    const branchName: string = await determineBranchName(issueResponse.title);

    /* Open the branch from the branch name. */

    await createBranch(toolkit, branchName);
} catch (error) {
    core.setFailed(error.message);
  }
}

run().then(() => {});
