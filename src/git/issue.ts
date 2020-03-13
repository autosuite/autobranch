import * as octokit from "@octokit/rest";
import * as github from "@actions/github";

/**
 * The maximum number of words in an issue title.
 */
const SHORTENED_WORD_COUNT: number = 3;

/**
 * From a long title, shorten to a lowercase_snake_case and remove all non-alphabetical characters.
 *
 * @param title The GitHub Issue's title.
 */
export async function shortenTitle(title: string): Promise<string> {
  return title.toLowerCase()
    .replace(/[^A-Za-z ]/gi, "")
    .split(" ")
    .slice(SHORTENED_WORD_COUNT)
    .join("-");
}

/**
 * Fetch the Issue's title. The response of this should be await-ed and cached.
 *
 * @param toolkit The Octokit toolkit.
 */
export async function getIssueContents(toolkit: octokit.Octokit): Promise<octokit.Octokit.IssuesGetResponse> {
  const issueOwner: string = github.context.issue.owner;
  const issueRepo: string = github.context.issue.repo;

  return await toolkit.issues.get({
    owner: issueOwner,
    repo: issueRepo,
    issue_number: github.context.issue.number
  }).then((response: octokit.Octokit.Response<octokit.Octokit.IssuesGetResponse>) => response.data);
}
