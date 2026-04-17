// ═══════════════════════════════════════════════════════════════
// PRmate 알림 전송 (Slack & Discord Incoming Webhooks)
// ═══════════════════════════════════════════════════════════════

import type { NotificationConfig, SlackNotification } from './config/schema.js';
import type { ErrorInfo } from './github/errors.js';
import type { ReviewResult } from './review/engine.js';

export type NotificationEvent = 'review_completed' | 'review_failed';

export interface NotificationContext {
  repo: string;
  prNumber: number;
  prUrl: string;
  filesReviewed?: number;
  result?: ReviewResult;
  errorInfo?: ErrorInfo;
}

// ─── Slack ────────────────────────────────────────────────────────

async function sendSlackNotification(
  webhookUrl: string,
  event: NotificationEvent,
  ctx: NotificationContext,
  slackConfig: SlackNotification,
): Promise<void> {
  const isError = event === 'review_failed';
  const emoji = isError ? '🚨' : '✅';
  const title = isError ? `${emoji} PRmate 리뷰 실패` : `${emoji} PRmate 리뷰 완료`;
  const mention = slackConfig.mention ? `<${slackConfig.mention}> ` : '';

  const blocks: unknown[] = [
    {
      type: 'header',
      text: { type: 'plain_text', text: title },
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*저장소*\n${ctx.repo}` },
        { type: 'mrkdwn', text: `*PR*\n<${ctx.prUrl}|#${ctx.prNumber}>` },
      ],
    },
  ];

  if (!isError && ctx.filesReviewed !== undefined && ctx.result) {
    blocks.push({
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*분석 파일*\n${ctx.filesReviewed}개` },
        {
          type: 'mrkdwn',
          text: `*비용*\n$${ctx.result.costUSD.toFixed(4)} (₩${ctx.result.costKRW.toLocaleString('ko-KR')})`,
        },
      ],
    });
  }

  if (isError && ctx.errorInfo) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*오류 유형:* \`${ctx.errorInfo.type}\`\n${ctx.errorInfo.message}`,
      },
    });
  }

  blocks.push({
    type: 'actions',
    elements: [
      {
        type: 'button',
        text: { type: 'plain_text', text: 'PR 보기 →', emoji: true },
        url: ctx.prUrl,
        style: isError ? 'danger' : 'primary',
      },
    ],
  });

  const body = {
    text: `${mention}${title} — ${ctx.repo} #${ctx.prNumber}`,
    blocks,
  };

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Slack 응답 오류 ${response.status}: ${text}`);
  }
}

// ─── Discord ──────────────────────────────────────────────────────

async function sendDiscordNotification(
  webhookUrl: string,
  event: NotificationEvent,
  ctx: NotificationContext,
): Promise<void> {
  const isError = event === 'review_failed';
  const color = isError ? 0xe74c3c : 0x4ada8c; // red or PRmate green
  const title = isError ? '🚨 PRmate 리뷰 실패' : '✅ PRmate 리뷰 완료';

  const fields: { name: string; value: string; inline: boolean }[] = [
    { name: '저장소', value: ctx.repo, inline: true },
    { name: 'PR', value: `[#${ctx.prNumber}](${ctx.prUrl})`, inline: true },
  ];

  if (!isError && ctx.filesReviewed !== undefined) {
    fields.push({ name: '분석 파일', value: `${ctx.filesReviewed}개`, inline: true });
  }

  if (!isError && ctx.result) {
    fields.push({
      name: '비용',
      value: `$${ctx.result.costUSD.toFixed(4)} (₩${ctx.result.costKRW.toLocaleString('ko-KR')})`,
      inline: true,
    });
  }

  if (isError && ctx.errorInfo) {
    fields.push({
      name: '오류 유형',
      value: `\`${ctx.errorInfo.type}\``,
      inline: true,
    });
    fields.push({
      name: '오류 내용',
      value: ctx.errorInfo.message,
      inline: false,
    });
  }

  const embed: Record<string, unknown> = {
    title,
    url: ctx.prUrl,
    color,
    fields,
    timestamp: new Date().toISOString(),
    footer: { text: 'PRmate — 한국어 AI 코드 리뷰' },
  };

  const body = {
    username: 'PRmate',
    embeds: [embed],
  };

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Discord 응답 오류 ${response.status}: ${text}`);
  }
}

// ─── 공통 진입점 ─────────────────────────────────────────────────

/**
 * 환경변수 이름으로 실제 webhook URL 조회.
 * .prmate.yml의 webhook_url_secret 값 = GitHub Actions secret 이름
 */
function resolveWebhookUrl(secretName: string | undefined): string | undefined {
  if (!secretName) return undefined;
  return process.env[secretName];
}

/**
 * 설정된 채널로 알림 전송.
 * 전송 실패는 warn만 출력하고 메인 플로우를 중단하지 않음.
 */
export async function sendNotifications(
  config: NotificationConfig | undefined,
  event: NotificationEvent,
  ctx: NotificationContext,
): Promise<void> {
  if (!config) return;

  const tasks: Promise<void>[] = [];

  // ── Slack ──
  if (config.slack?.on_events?.includes(event)) {
    const url = resolveWebhookUrl(config.slack.webhook_url_secret);
    if (url) {
      tasks.push(
        sendSlackNotification(url, event, ctx, config.slack).catch((err: unknown) => {
          console.warn(
            `[PRmate] ⚠ Slack 알림 전송 실패: ${err instanceof Error ? err.message : String(err)}`,
          );
        }),
      );
    } else {
      console.warn(
        `[PRmate] ⚠ Slack webhook URL을 찾을 수 없음 (secret 이름: '${config.slack.webhook_url_secret}')`,
      );
    }
  }

  // ── Discord ──
  if (config.discord?.on_events?.includes(event)) {
    const url = resolveWebhookUrl(config.discord.webhook_url_secret);
    if (url) {
      tasks.push(
        sendDiscordNotification(url, event, ctx).catch((err: unknown) => {
          console.warn(
            `[PRmate] ⚠ Discord 알림 전송 실패: ${err instanceof Error ? err.message : String(err)}`,
          );
        }),
      );
    } else {
      console.warn(
        `[PRmate] ⚠ Discord webhook URL을 찾을 수 없음 (secret 이름: '${config.discord.webhook_url_secret}')`,
      );
    }
  }

  await Promise.all(tasks);
}
