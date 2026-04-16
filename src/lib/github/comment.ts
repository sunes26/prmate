import { Octokit } from '@octokit/rest';

const PRMATE_HEADER = '<!-- prmate-bot -->';

// ─── Inline 코멘트 타입 (Week 4-1) ─────────────────────────────
export interface InlineComment {
  path: string;
  line: number;
  body: string;
  side?: 'LEFT' | 'RIGHT';  // diff hunk 방향
}

export type ReviewState = 'APPROVE' | 'REQUEST_CHANGES' | 'COMMENT';

// ───────────────────────────────────────────────────────────────
// 일반 코멘트 (PR 대화창에 게시)
// ───────────────────────────────────────────────────────────────

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
  commentId?: number,
  customBody?: string  // Week 2-2: 에러 타입별 메시지
): Promise<void> {
  const fallback = `## ⚠️ PRmate 오류

리뷰 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.

문제가 지속되면 [이슈를 등록](https://github.com/sunes26/prmate/issues)해 주세요.`;

  const body = `${PRMATE_HEADER}\n${customBody ?? fallback}`;

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

// ───────────────────────────────────────────────────────────────
// Inline 코멘트 (Week 4-1: 특정 코드 라인에 직접 코멘트)
// ───────────────────────────────────────────────────────────────

/**
 * PR에 inline 리뷰 코멘트를 일괄 게시합니다.
 * GitHub API `pulls.createReview` 사용.
 */
export async function postInlineReview(
  octokit: Octokit,
  owner: string,
  repo: string,
  pullNumber: number,
  inlineComments: InlineComment[],
  body: string = '🤖 PRmate 라인별 리뷰'
): Promise<void> {
  if (inlineComments.length === 0) return;

  try {
    await octokit.pulls.createReview({
      owner,
      repo,
      pull_number: pullNumber,
      body,
      event: 'COMMENT',
      comments: inlineComments.map((c) => ({
        path: c.path,
        line: c.line,
        side: c.side ?? 'RIGHT',
        body: c.body,
      })),
    });
  } catch (err) {
    // Inline 코멘트 실패는 일반 리뷰에 영향 없어야 함
    console.warn(
      `[PRmate] Inline 코멘트 게시 실패 (일반 리뷰는 정상 게시됨): ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }
}

// ───────────────────────────────────────────────────────────────
// Review State 제출 (Week 4-2: Approve / Request Changes)
// ───────────────────────────────────────────────────────────────

/**
 * PR에 Approval / Request Changes 상태를 제출합니다.
 * 주의: 본인 PR에는 못 씀 (GitHub 정책)
 */
export async function submitReviewState(
  octokit: Octokit,
  owner: string,
  repo: string,
  pullNumber: number,
  state: ReviewState,
  message?: string
): Promise<void> {
  const stateBody: Record<ReviewState, string> = {
    APPROVE: '✅ **PRmate 승인** — 자동 리뷰 기준으로 통과했습니다.',
    REQUEST_CHANGES: '⚠️ **PRmate 수정 요청** — 위험 수준의 이슈가 발견되었습니다.',
    COMMENT: 'ℹ️ PRmate 코멘트',
  };

  try {
    await octokit.pulls.createReview({
      owner,
      repo,
      pull_number: pullNumber,
      body: message ?? stateBody[state],
      event: state,
    });
  } catch (err) {
    console.warn(
      `[PRmate] Review 상태 제출 실패 (GitHub 제약일 수 있음): ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }
}
