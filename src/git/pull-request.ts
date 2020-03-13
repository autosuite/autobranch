import * as octokit from "@octokit/rest";
import * as github from "@actions/github";
import * as core from "@actions/core";

/**
 * The name of the base branch to be PR'd into.
 */
const BASE_BRANCH_NAME: string = "master";

/**
 * Create a WIP pull request opened by the issue's assignee.
 *
 * @param toolkit The Octokit toolkit.
 * @param issueResponse A response object retrieved after GET-ing an Issue.
 * @param branchName The name of the branch.
 */
export async function createPullRequest(
  toolkit: octokit.Octokit,
  issueResponse: octokit.Octokit.IssuesGetResponse,
  branchName: string
) {
  core.info(`Creating PR for: \`${branchName}\`.`);

  return toolkit.pulls.create({
    repo: github.context.issue.repo,

    /* Source and target. */

    head: branchName,
    base: BASE_BRANCH_NAME,

    /* From the Issue. */

    title: issueResponse.title,
    draft: true,
    owner: issueResponse.assignee.login,
    body: `Closes #${issueResponse.number}.`
  }).then((response: octokit.Octokit.Response<octokit.Octokit.PullsCreateResponse>) => response.data);
}
