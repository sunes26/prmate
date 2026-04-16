import Anthropic from '@anthropic-ai/sdk';
import { ModelTier } from './config/schema';

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY 환경 변수가 설정되지 않았습니다.');
}

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ═══════════════════════════════════════════════════════════════
// 모델 식별자 매핑 (Week 2-4 — 티어 기반 선택)
// ═══════════════════════════════════════════════════════════════

/**
 * 모델 티어 → 실제 모델 ID 매핑
 * CLAUDE_MODEL 환경변수로 전체 오버라이드 가능 (날짜 고정 버전용)
 */
const MODEL_IDS: Record<ModelTier, string> = {
  opus: 'claude-opus-4-6',
  sonnet: 'claude-sonnet-4-6',
  haiku: 'claude-haiku-4-5-20251001',
};

/**
 * 모델 티어별 가격 (per 1M tokens, USD)
 * 2026-04 Anthropic 공식 가격표 기준
 */
interface ModelPricing {
  input: number;
  output: number;
  cacheWrite: number;
  cacheRead: number;
}

const MODEL_PRICING: Record<ModelTier, ModelPricing> = {
  opus: { input: 15, output: 75, cacheWrite: 18.75, cacheRead: 1.5 },
  sonnet: { input: 3, output: 15, cacheWrite: 3.75, cacheRead: 0.3 },
  haiku: { input: 0.8, output: 4, cacheWrite: 1, cacheRead: 0.08 },
};

export function resolveModelId(tier: ModelTier): string {
  // 환경변수 오버라이드 우선 (날짜 고정 버전 핀닝용)
  if (process.env.CLAUDE_MODEL) {
    return process.env.CLAUDE_MODEL;
  }
  return MODEL_IDS[tier];
}

export function getModelPricing(tier: ModelTier): ModelPricing {
  return MODEL_PRICING[tier];
}

/**
 * 토큰 사용량을 USD 비용으로 변환
 */
export function calculateCost(
  tier: ModelTier,
  usage: {
    inputTokens: number;
    outputTokens: number;
    cacheCreationTokens: number;
    cacheReadTokens: number;
  }
): { usd: number; krw: number } {
  const p = MODEL_PRICING[tier];
  const usd =
    (usage.inputTokens * p.input +
      usage.outputTokens * p.output +
      usage.cacheCreationTokens * p.cacheWrite +
      usage.cacheReadTokens * p.cacheRead) /
    1_000_000;
  const krw = Math.round(usd * 1350); // 2026-04 환율 근사치
  return { usd, krw };
}

// ═══════════════════════════════════════════════════════════════
// 호환성을 위한 기본 export (기존 코드 호환)
// ═══════════════════════════════════════════════════════════════

/** @deprecated config.model에서 resolveModelId(config.model) 사용 권장 */
export const MODEL = resolveModelId('sonnet');

export const MAX_TOKENS = 4096;

/**
 * Claude API 요청 타임아웃 (밀리초).
 * - 기본값 90초: 대형 PR(diff 10파일 이상)도 여유있게 처리 가능
 * - PRMATE_TIMEOUT_MS 환경변수로 오버라이드 가능
 */
function parseTimeout(): number {
  const raw = process.env.PRMATE_TIMEOUT_MS;
  if (!raw) return 90_000;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) return 90_000;
  return parsed;
}

export const TIMEOUT_MS = parseTimeout();
