import * as core from "@actions/core";
import * as octokit from "@octokit/rest";
import * as github from "@actions/github";

import {shortenTitle} from "./issue";

/**
 * Determine a branch name from the GitHub context.
 *
 * @param issueTitle The issue's title.
 */
export async function determineBranchName(issueTitle: string): Promise<string> {
  return `issue/${github.context.issue.number}-${await shortenTitle(issueTitle)}`;
}

/**
 * Create a branch with using the toolkit with the given branch name.
 *
 * @param toolkit The Octokit toolkit.
 * @param branchName The branch's name.
 */
export async function createBranch(
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
