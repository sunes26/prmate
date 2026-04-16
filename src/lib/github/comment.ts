import { Octokit } from '@octokit/rest';

const PRMATE_HEADER = '<!-- prmate-bot -->';

export async function postPendingComment(
  octokit: Octokit,
  owner: string,
  repo: string,
  pullNumber: number
): Promise<number> {
  const body = `${PRMATE_HEADER}
## 🔍 PRmate 분석 중...

잠시만 기다려 주세요. AI가 코드를 한국어로 리뷰하고 있습니다.`;

  const { data } = await octokit.issues.createComment({
    owner,
    repo,
    issue_number: pullNumber,
    body,
  });

  return data.id;
}

export async function updateComment(
  octokit: Octokit,
  owner: string,
  repo: string,
  commentId: number,
  reviewBody: string
): Promise<void> {
  await octokit.issues.updateComment({
    owner,
    repo,
    comment_id: commentId,
    body: `${PRMATE_HEADER}\n${reviewBody}`,
  });
}

export async function postErrorComment(
  octokit: Octokit,
  owner: string,
  repo: string,
  pullNumber: number,
  commentId?: number
): Promise<void> {
  const body = `${PRMATE_HEADER}
## ⚠️ PRmate 오류

리뷰 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.

문제가 지속되면 [이슈를 등록](https://github.com/sunes26/prmate/issues)해 주세요.`;

  if (commentId) {
    await octokit.issues.updateComment({
      owner,
      repo,
      comment_id: commentId,
      body,
    });
  } else {
    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: pullNumber,
      body,
    });
  }
}

export async function postSkipComment(
  octokit: Octokit,
  owner: string,
  repo: string,
  pullNumber: number,
  reason: string
): Promise<void> {
  await octokit.issues.createComment({
    owner,
    repo,
    issue_number: pullNumber,
    body: `${PRMATE_HEADER}\n> ℹ️ PRmate: ${reason}`,
  });
}
