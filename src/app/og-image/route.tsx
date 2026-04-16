import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #030712 0%, #1e3a8a 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* 상단 배지 */}
        <div
          style={{
            background: 'rgba(30, 58, 138, 0.5)',
            border: '1px solid rgba(59, 130, 246, 0.5)',
            color: '#93c5fd',
            padding: '8px 24px',
            borderRadius: '999px',
            fontSize: '24px',
            marginBottom: '40px',
          }}
        >
          🚀 베타 오픈 — 무료로 시작하기
        </div>

        {/* 메인 제목 */}
        <div
          style={{
            fontSize: '96px',
            fontWeight: 'bold',
            color: '#f3f4f6',
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: '24px',
          }}
        >
          PR 리뷰, <span style={{ color: '#60a5fa' }}>이제 한국어로</span>
        </div>

        {/* 설명 */}
        <div
          style={{
            fontSize: '32px',
            color: '#9ca3af',
            textAlign: 'center',
            maxWidth: '900px',
            lineHeight: 1.4,
          }}
        >
          우아한형제들 · 카카오 · 네이버 · SK · LG · NHN · 쿠팡 · LINE · 토스
        </div>

        {/* 푸터 */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            color: '#6b7280',
            fontSize: '24px',
          }}
        >
          <span style={{ fontSize: '32px' }}>🤖</span>
          <span style={{ fontWeight: 'bold', color: '#e5e7eb' }}>PRmate</span>
          <span>— prmate.dev</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
