import * as core from '@actions/core';
import { Octokit } from '@octokit/rest';
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
async function createBranch(toolkit: Octokit, branchName: string): Promise<Octokit.GitCreateRefResponse> {
  /* Avoid a chained return by calling the branch creation first. */

  const branchCreator: Promise<Octokit.Response<Octokit.GitCreateRefResponse>> = toolkit.git.createRef({
    ref: `refs/heads/${branchName}`,
    sha: github.context.sha,
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
  });

  core.info(`Creating branch: [${branchName}].`);

  return branchCreator.then((response: Octokit.Response<Octokit.GitCreateRefResponse>) => response.data);
}


/**
 * From a long title, shorten to a lowercase_snake_case and remove all non-alphabetical characters.
 *
 * @param title The GitHub Issue's title.
 */
async function shortenTitle(title: string): Promise<string> {
  const lowerCaseTitle: string = title.toLowerCase();
  const cleanedTitle: string = lowerCaseTitle.replace(/[^A-Za-z ]/gi, "");
  const titleWords: string[] = cleanedTitle.split(" ");

  /* Clamp the title words in the return to limit the potential length of the branch title. */

  const clampedTitleWords: string[] = titleWords.slice(0, SHORTENED_WORD_COUNT);

  return clampedTitleWords.join("-");
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
 * Fetch the Issue's title. The response of this should be `await`ed and cached.
 *
 * @param toolkit The Octokit toolkit.
 */
async function getIssueContents(toolkit: Octokit): Promise<Octokit.IssuesGetResponse> {
  /* Avoid a chained return by calling the branch creation first. */

  const issueContentsRetriever: Promise<Octokit.Response<Octokit.IssuesGetResponse>> = toolkit.issues.get({
    owner: github.context.issue.owner,
    repo: github.context.issue.repo,
    issue_number: github.context.issue.number
  });

  return issueContentsRetriever.then((response: Octokit.Response<Octokit.IssuesGetResponse>) => response.data);
}

/**
 * Function to run the GitHub Action.
 */
async function runAction() {
  /* Initialize the GitHub/Octokit toolkit. */

  const toolkit: Octokit = new Octokit({"auth": core.getInput(GITHUB_TOKEN_INPUT_KEY)});

  /* Gather and cache. */

  const issueResponse: Octokit.IssuesGetResponse = await getIssueContents(toolkit);
  const branchName: string = await determineBranchName(issueResponse.title);

  /* Open the branch from the branch name. */

  await createBranch(toolkit, branchName);
}

const actionRunner: Promise<void> = runAction();

/* Promise handlers. */

actionRunner.then(() => {});
actionRunner.catch((reason: any) => {
  const reasonText: string = reason.toString();

  core.setFailed(reasonText);
});
