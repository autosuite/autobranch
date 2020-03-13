import * as core from '@actions/core';
import * as octokit from '@octokit/rest';

import {createBranch, determineBranchName} from "./git/branch";
import {getIssueContents} from "./git/issue";
import {createPullRequest} from "./git/pull-request";

/**
 * The key name for the GitHub secret access token.
 */
const GITHUB_TOKEN_INPUT_KEY: string = "github_token";

async function run() {
  try {
    /* Initialize the GitHub/Octokit toolkit. */

    const toolkit: octokit.Octokit = new octokit.Octokit({
      "auth": core.getInput(GITHUB_TOKEN_INPUT_KEY)
    });

    /* Gather and cache. */

    const issueResponse: octokit.Octokit.IssuesGetResponse = await getIssueContents(toolkit);
    const branchName: string = await determineBranchName(issueResponse.title);

    /* Open the branch from the branch name. */

    await createBranch(toolkit, branchName).then(_ => createPullRequest(toolkit, issueResponse, branchName));
} catch (error) {
    core.setFailed(error.message);
  }
}

run().then(() => {});
