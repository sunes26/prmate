import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PRmate — 한국어 AI 코드 리뷰',
  description:
    'GitHub PR이 열리면 자동으로 한국어로 코드 리뷰 코멘트를 게시합니다. 우아한테크코스, 네이버 Hackday, 토스 Frontend Fundamentals 등 공식 공개 자료 기반 컨벤션 프리셋 내장.',
  keywords: [
    '한국어 코드 리뷰', 'AI 코드 리뷰', 'GitHub Actions', 'CodeRabbit 한국어',
    'PR 자동 리뷰', 'Claude 코드 리뷰',
    '우아한테크코스 스타일 가이드', '네이버 Hackday Java', '토스 Frontend Fundamentals',
    'Google Java Style', 'Checkstyle',
  ],
  authors: [{ name: 'PRmate Team', url: 'https://prmate.dev' }],
  metadataBase: new URL('https://prmate.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'PRmate — 한국어 AI 코드 리뷰',
    description: '우아한테크코스 · 네이버 Hackday · 토스 Frontend Fundamentals 공식 컨벤션 내장. 5분 설치, 베타 기간 무료.',
    type: 'website',
    url: 'https://prmate.dev',
    siteName: 'PRmate',
    locale: 'ko_KR',
    images: [
      {
        url: '/og-image',
        width: 1200,
        height: 630,
        alt: 'PRmate — 한국어 AI 코드 리뷰',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PRmate — 한국어 AI 코드 리뷰',
    description: '국내 대기업 컨벤션 11종 내장. 5분 설치.',
    images: ['/og-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// JSON-LD Schema.org 구조화 데이터
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'PRmate',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Linux, macOS, Windows (via GitHub Actions)',
  description: 'GitHub PR을 한국어로 자동 리뷰하는 AI 도구. 국내 대기업 컨벤션 11종 내장.',
  url: 'https://prmate.dev',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'KRW',
    description: '베타 기간 무료',
  },
  softwareVersion: '1.0.0',
};

const PAIN_POINTS = [
  {
    source: 'turtle0204.tistory (2025.09)',
    quote: '"config 적용 안 되서 자꾸 영어로 말함"',
  },
  {
    source: 'velog 사용기 (2025.11)',
    quote: '"경험상 영어로 받는 것이 문맥상 조금 더 정확"',
  },
  {
    source: 'Google 자동 생성 답변',
    quote: '"코드래빗 한국어 안 됨 해결 방법" — 대량 검색으로 Google이 직접 답변 제시',
  },
];

const CONVENTIONS = [
  {
    value: 'default',
    label: '기본',
    desc: '클린 코드 범용 원칙 (Robert C. Martin)',
    lang: '모든 언어',
    source: null,
    badge: '무료',
  },
  {
    value: 'woowa',
    label: '우아한테크코스',
    desc: 'Google Java Style + 들여쓰기 4, 한 줄 120자 등 4개 차이점',
    lang: 'Java',
    source: 'github.com/woowacourse/woowacourse-docs',
    badge: '무료',
  },
  {
    value: 'naver',
    label: '네이버 Hackday',
    desc: 'Checkstyle XML 포함 공식 문서 · K&R · UTF-8 · LF · import 순서 명시',
    lang: 'Java',
    source: 'naver.github.io/hackday-conventions-java',
    badge: '무료',
  },
  {
    value: 'toss',
    label: '토스 Frontend Fundamentals',
    desc: '가독성·예측가능성·응집도·결합도 4대 원칙 (변경하기 쉬운 코드)',
    lang: 'TypeScript/JavaScript',
    source: 'frontend-fundamentals.com',
    badge: '무료',
  },
  {
    value: 'custom',
    label: '팀 커스텀',
    desc: '.md 파일로 자체 규칙 주입 — 팀 내부 컨벤션 완벽 지원',
    lang: '-',
    source: null,
    badge: '무료',
  },
];

const FEATURES = [
  {
    icon: '🇰🇷',
    title: '처음부터 한국어 설계',
    desc: '번역체 없는 자연스러운 한국어. "음슴체" 아닌 실제 리뷰어 톤.',
  },
  {
    icon: '🏢',
    title: '공식 공개 컨벤션 5종',
    desc: '우아한테크코스 · 네이버 Hackday · 토스 Frontend Fundamentals + 커스텀 파일 (추정 규칙 없음).',
  },
  {
    icon: '🔒',
    title: 'Zero Data Retention',
    desc: '코드 서버 미저장. 메모리 처리 후 즉시 삭제. diff만 추출.',
  },
  {
    icon: '🛡️',
    title: '비밀 자동 마스킹',
    desc: 'API 키 / 토큰 / 비밀번호 자동 [REDACTED]. 실수 유출 방지.',
  },
  {
    icon: '💰',
    title: '비용 완전 공개',
    desc: '리뷰마다 USD + KRW 비용 표시. Prompt Caching으로 50~90% 절감.',
  },
  {
    icon: '🎛️',
    title: '세밀한 커스터마이즈',
    desc: 'Kill switch, 모델 선택, 파일 타입별 규칙, Dry-run, 영어 혼용.',
  },
  {
    icon: '📍',
    title: 'Inline 라인별 코멘트',
    desc: '전체 요약 + 특정 라인 직접 코멘트 (GitHub 네이티브 API).',
  },
  {
    icon: '✅',
    title: 'Approve / Request Changes',
    desc: '위험 수준 기반 자동 판정. 수동 리뷰 수준의 명확한 시그널.',
  },
  {
    icon: '🇰🇷',
    title: 'PIPA 체크 모드',
    desc: '한국 개인정보보호법 위반 패턴 전용 스캔. 민감정보 누출 예방.',
  },
  {
    icon: '🔐',
    title: '보안 전용 스캐너',
    desc: 'SQL Injection, XSS, SSRF 등 보안 취약점만 집중 분석 모드.',
  },
  {
    icon: '📦',
    title: '대형 PR 자동 청킹',
    desc: '8+ 파일 변경 시 자동 분할 호출. 타임아웃 걱정 없음.',
  },
  {
    icon: '🎓',
    title: '팀 스타일 학습',
    desc: '.prmate/style-guide.md로 팀만의 규칙 주입. 팀 컬러 반영.',
  },
];

const STEPS = [
  {
    step: '1',
    title: 'API 키 등록',
    desc: 'console.anthropic.com에서 키 발급 후, 레포 Settings → Secrets에 ANTHROPIC_API_KEY 등록.',
    code: null,
  },
  {
    step: '2',
    title: '워크플로우 파일 추가',
    desc: '.github/workflows/review.yml 파일을 추가합니다.',
    code: `name: PR 코드 리뷰
on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]
permissions:
  pull-requests: write
  contents: read
jobs:
  review:
    if: github.event.pull_request.draft == false
    runs-on: ubuntu-latest
    steps:
      - uses: sunes26/prmate@v1
        with:
          anthropic_api_key: \${{ secrets.ANTHROPIC_API_KEY }}`,
  },
  {
    step: '3',
    title: '(선택) 컨벤션 설정',
    desc: '.prmate.yml로 팀 컨벤션 커스터마이즈 (없으면 기본값 사용).',
    code: `enabled: true
language: ko
convention: naver       # default | woowa | naver | toss | custom
review_level: standard  # strict | standard | relaxed
model: sonnet           # sonnet | haiku | opus
mode: full              # full | summary | security | pipa`,
  },
  {
    step: '4',
    title: 'PR 오픈 → 자동 리뷰 🎉',
    desc: 'PR 열면 2~3분 내 한국어 리뷰 코멘트가 자동 게시됩니다.',
    code: null,
  },
];

const PLANS = [
  {
    name: 'Free',
    price: '₩0',
    period: '/월',
    target: '개인 개발자',
    prLimit: '월 30개',
    features: ['공식 컨벤션 5종 전체', '한국어 리뷰', '비밀 마스킹', 'Kill switch'],
    highlight: false,
  },
  {
    name: 'Starter',
    price: '₩9,900',
    period: '/월',
    target: '소규모팀 (5인↓)',
    prLimit: '월 100개',
    features: ['Custom 프롬프트', '파일 타입별 규칙', '모델 선택 (sonnet/haiku/opus)', 'Dry-run', '혼용 언어'],
    highlight: false,
  },
  {
    name: 'Team',
    price: '₩29,000',
    period: '/월',
    target: '스타트업 (10인↓)',
    prLimit: '월 300개',
    features: ['Starter 전체', 'Inline 코멘트', 'Approve/Changes 자동', '팀 스타일 학습', 'Slack/Discord 알림'],
    highlight: true,
  },
  {
    name: 'Growth',
    price: '₩59,000',
    period: '/월',
    target: '성장팀 (20인↓)',
    prLimit: '무제한',
    features: ['Team 전체', 'PIPA 체크 모드', '보안 전용 스캐너', '대형 PR 청킹', '우선 지원'],
    highlight: false,
  },
];

// 실제 PRmate가 PR #1에서 생성한 리뷰 샘플
const REVIEW_SAMPLE = `## 📋 PR 요약
example.ts에 의도적으로 리뷰 포인트를 심은 테스트 PR입니다. Jest 경로 수정과
Claude 모델 ID 업데이트를 포함합니다.

## ✅ 잘된 점
- package.json의 Jest 경로를 .bin/jest → jest/bin/jest.js로 수정한 것은
  크로스 플랫폼 호환성 개선의 올바른 접근입니다.
- TIMEOUT_MS에 30_000처럼 숫자 구분자를 사용해 가독성을 높인 부분이 좋습니다.

## 🔍 리뷰 코멘트

### [위험] 에러 처리 없는 비동기 함수
fetchUser는 네트워크 오류나 HTTP 에러 응답을 전혀 처리하지 않습니다.
res.ok 확인 없이 바로 res.json()을 호출하면 조용히 잘못된 데이터를 반환합니다.

\`\`\`diff
  async function fetchUser(id: number): Promise<User> {
    const res = await fetch(\`/api/users/\${id}\`);
+   if (!res.ok) {
+     throw new Error(\`사용자 조회 실패: \${res.status}\`);
+   }
    return res.json();
  }
\`\`\`

### [제안] 매직 넘버 상수 추출
18이라는 숫자는 "성인 기준 나이"라는 도메인 지식을 숨깁니다.
\`ADULT_AGE_THRESHOLD = 18\`로 추출하면 의도가 명확해집니다.

## 📊 전체 평가
승인 가능하나 fetchUser의 에러 처리는 프로덕션 코드라면 반드시 수정 필요.`;

const FAQ = [
  {
    q: '코드가 서버에 저장되나요?',
    a: '아니요. Zero Data Retention 정책으로 코드는 메모리에서 처리 후 즉시 삭제됩니다. PR diff만 추출하여 분석하며, 전체 레포지토리에 접근하지 않습니다. API 키나 비밀번호는 자동 [REDACTED] 마스킹 처리됩니다.',
  },
  {
    q: 'CodeRabbit과 무엇이 다른가요?',
    a: 'CodeRabbit은 language: ko 설정이 있지만 실제로는 영어 리뷰가 많이 나온다는 불만이 있습니다. PRmate는 처음부터 한국어 리뷰를 위해 설계되었으며, 우아한테크코스 · 네이버 Hackday · 토스 Frontend Fundamentals 등 공식 공개 자료 기반 컨벤션을 내장합니다.',
  },
  {
    q: '왜 카카오·SK·LG·쿠팡·LINE 컨벤션은 없나요?',
    a: '해당 기업들은 공식으로 공개된 코딩 컨벤션 문서가 없습니다. 외부에 공개되지 않은 사내 규칙을 추정해서 제공하는 것은 정직하지 않다고 판단하여 v1.1.0에서 제거했습니다. 팀 내부 규칙이 있다면 convention: custom + convention_file 옵션으로 팀의 .md 파일을 직접 주입하세요.',
  },
  {
    q: '리뷰 비용은 얼마인가요?',
    a: 'PR 1건당 평균 $0.01 ~ $0.05 (₩15~70). Prompt Caching으로 50~90% 절감. 모든 리뷰 코멘트에 정확한 비용을 USD + KRW로 투명하게 표시합니다.',
  },
  {
    q: '어떤 언어를 지원하나요?',
    a: 'JavaScript, TypeScript, Python, Java, Go, Kotlin, Rust, Ruby, Swift, C# 등 주요 언어 전부 지원. 한국어/영어 혼용 코드베이스도 OK (mixed_language 옵션).',
  },
  {
    q: '리뷰가 너무 시끄러우면 어떻게 하나요?',
    a: 'review_level: relaxed 또는 mode: summary로 변경하면 핵심만 지적합니다. 파일 타입별로 다른 규칙 적용도 가능 (rules 옵션). 특정 PR만 스킵하려면 제목에 [skip review] 포함.',
  },
  {
    q: 'AI가 잘못된 지적을 하면요?',
    a: 'Dry-run 모드로 실제 게시 전 결과 확인 가능. 팀 스타일 가이드 (.prmate/style-guide.md)를 작성하면 팀 컨텍스트를 학습하여 정확도 향상. 프리미엄 학습 모드는 Team 플랜부터.',
  },
  {
    q: '설치가 복잡한가요?',
    a: 'YAML 파일 하나를 복사+붙여넣기, 5분 이내 완료. GitHub Action 방식이라 별도 서버 불필요.',
  },
  {
    q: '베타 기간 중 무료인가요?',
    a: '네, 현재 베타 기간 중 모든 기능 무료. 베타 피드백 주시면 유료 전환 시 50% 할인 혜택.',
  },
  {
    q: 'GitHub App으로도 쓸 수 있나요?',
    a: '현재는 GitHub Action 방식만 지원. GitHub App은 Phase 4(2026년 하반기)에 출시 예정. MRR ₩100k 달성 후 착수.',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 font-sans">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-900/40 text-blue-300 text-sm px-4 py-1.5 rounded-full mb-6 border border-blue-700/50">
          <span>🚀</span>
          <span>베타 오픈 — v1.0.0 공개 · 무료</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          PR 리뷰, <span className="text-blue-400">이제 한국어로</span>
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          GitHub PR이 열리면 자동으로 <strong className="text-gray-200">한국어</strong>로 코드 리뷰
          코멘트를 게시합니다.
          <br />
          <strong className="text-gray-200">우아한테크코스 · 네이버 Hackday · 토스 Frontend Fundamentals</strong>{' '}
          등 <span className="underline decoration-blue-500/50">공식 공개</span> 컨벤션 기반.
        </p>
        <div className="flex gap-4 justify-center flex-wrap mb-8">
          <a
            href="https://github.com/sunes26/prmate#5분-설치"
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            무료로 시작하기 (5분)
          </a>
          <a
            href="https://github.com/sunes26/prmate"
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-8 py-3 rounded-lg font-semibold transition-colors border border-gray-700"
          >
            GitHub 보기 →
          </a>
        </div>

        {/* 배지 */}
        <div className="flex gap-2 justify-center flex-wrap text-xs">
          <span className="bg-gray-900 text-gray-400 px-3 py-1 rounded border border-gray-800">
            ✅ Claude Sonnet 4.6
          </span>
          <span className="bg-gray-900 text-gray-400 px-3 py-1 rounded border border-gray-800">
            🔒 Zero Data Retention
          </span>
          <span className="bg-gray-900 text-gray-400 px-3 py-1 rounded border border-gray-800">
            📦 v1.0.0 — 55 tests passing
          </span>
          <span className="bg-gray-900 text-gray-400 px-3 py-1 rounded border border-gray-800">
            💰 월 $3~10/팀 (Claude 비용)
          </span>
        </div>
      </section>

      {/* Pain Points */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-3">
          이미 많은 개발자들이 겪고 있는 문제
        </h2>
        <p className="text-gray-400 text-center mb-10">
          CodeRabbit 한국어 설정 후 실제 개발자들의 반응
        </p>
        <div className="grid gap-4">
          {PAIN_POINTS.map(({ source, quote }) => (
            <div
              key={source}
              className="bg-gray-900 border border-gray-800 rounded-lg p-5"
            >
              <p className="text-gray-200 text-lg mb-2">{quote}</p>
              <p className="text-gray-500 text-sm">— {source}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-5xl mx-auto px-6 py-16" id="features">
        <h2 className="text-3xl font-bold text-center mb-3">왜 PRmate인가?</h2>
        <p className="text-gray-400 text-center mb-10">
          한국 개발자만을 위해 처음부터 설계된 12가지 차별점
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {FEATURES.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-gray-900 border border-gray-800 rounded-lg p-5 hover:border-blue-700/50 transition-colors"
            >
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Conventions */}
      <section className="max-w-5xl mx-auto px-6 py-16" id="conventions">
        <h2 className="text-3xl font-bold text-center mb-3">
          공식 공개 자료 기반 컨벤션 5종
        </h2>
        <p className="text-gray-400 text-center mb-3">
          YAML에서 <code className="text-blue-400 bg-gray-900 px-2 py-0.5 rounded text-sm">convention: 값</code>
          으로 선택
        </p>
        <p className="text-gray-500 text-sm text-center mb-10 max-w-2xl mx-auto">
          ⚠️ 내부 문서로만 존재하는 기업(카카오·SK·LG·쿠팡·LINE 등) 컨벤션은
          &quot;추정 규칙&quot;이 되기 쉬워 제공하지 않습니다. 팀 자체 규칙은 <code className="text-blue-400">custom</code> 옵션으로 `.md` 파일을 직접 주입하세요.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-gray-400 border-b border-gray-800">
              <tr>
                <th className="text-left px-4 py-3">값</th>
                <th className="text-left px-4 py-3">이름</th>
                <th className="text-left px-4 py-3">주요 원칙</th>
                <th className="text-left px-4 py-3">언어</th>
                <th className="text-left px-4 py-3">공식 출처</th>
              </tr>
            </thead>
            <tbody>
              {CONVENTIONS.map(({ value, label, desc, lang, source }) => (
                <tr
                  key={value}
                  className="border-b border-gray-900 hover:bg-gray-900/50"
                >
                  <td className="px-4 py-3">
                    <code className="text-blue-400 bg-gray-900 px-2 py-0.5 rounded">
                      {value}
                    </code>
                  </td>
                  <td className="px-4 py-3 font-semibold">{label}</td>
                  <td className="px-4 py-3 text-gray-400">{desc}</td>
                  <td className="px-4 py-3 text-gray-500">{lang}</td>
                  <td className="px-4 py-3 text-xs">
                    {source ? (
                      <a
                        href={`https://${source}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        {source} ↗
                      </a>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Demo — 실제 리뷰 샘플 */}
      <section className="max-w-4xl mx-auto px-6 py-16" id="demo">
        <h2 className="text-3xl font-bold text-center mb-3">
          실제 PRmate 리뷰 예시
        </h2>
        <p className="text-gray-400 text-center mb-10">
          PR #1에서 PRmate가 실제로 생성한 리뷰 (버전 v1.0.0)
        </p>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 font-mono text-sm overflow-x-auto">
          <pre className="text-gray-200 whitespace-pre-wrap leading-relaxed">
            {REVIEW_SAMPLE}
          </pre>
        </div>
        <p className="text-center text-gray-500 text-xs mt-4">
          → 실제 GitHub PR에 게시된 코멘트 형태로 표시됩니다.
        </p>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-16" id="installation">
        <h2 className="text-3xl font-bold text-center mb-3">4단계로 시작</h2>
        <p className="text-gray-400 text-center mb-10">
          YAML 파일 하나 복사-붙여넣기, 5분 완료
        </p>
        <div className="grid gap-8">
          {STEPS.map(({ step, title, desc, code }) => (
            <div key={step} className="flex gap-6 items-start">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
                {step}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-1">{title}</h3>
                <p className="text-gray-400 mb-3">{desc}</p>
                {code && (
                  <pre className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-sm text-green-300 overflow-x-auto">
                    <code>{code}</code>
                  </pre>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-6 py-16" id="pricing">
        <h2 className="text-3xl font-bold text-center mb-3">가격 플랜</h2>
        <p className="text-gray-400 text-center mb-10">
          베타 기간 중 모든 기능 무료
        </p>
        <div className="grid md:grid-cols-4 gap-4">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl p-6 border flex flex-col ${
                plan.highlight
                  ? 'bg-blue-900/20 border-blue-600 shadow-lg shadow-blue-900/20'
                  : 'bg-gray-900 border-gray-800'
              }`}
            >
              {plan.highlight && (
                <div className="text-blue-400 text-xs font-semibold mb-2 uppercase tracking-wide">
                  ⭐ 추천
                </div>
              )}
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-3">{plan.target}</p>
              <div className="text-3xl font-bold mb-1">
                {plan.price}
                <span className="text-base font-normal text-gray-400">
                  {plan.period}
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-4">{plan.prLimit} PR</p>
              <ul className="space-y-2 mb-6 flex-grow">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="text-sm text-gray-300 flex items-start gap-2"
                  >
                    <span className="text-green-400 shrink-0">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="https://github.com/sunes26/prmate#5분-설치"
                className={`block text-center py-2 rounded-lg text-sm font-semibold transition-colors ${
                  plan.highlight
                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                }`}
              >
                시작하기
              </a>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-500 text-sm mt-6">
          엔터프라이즈 / 커스텀 컨벤션 제작 ·{' '}
          <a
            href="mailto:contact@prmate.dev"
            className="text-blue-400 hover:underline"
          >
            문의하기
          </a>
        </p>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-16" id="faq">
        <h2 className="text-3xl font-bold text-center mb-10">자주 묻는 질문</h2>
        <div className="space-y-6">
          {FAQ.map(({ q, a }) => (
            <div key={q} className="border-b border-gray-800 pb-6">
              <h3 className="font-semibold text-lg mb-2">{q}</h3>
              <p className="text-gray-400 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-20 px-6 border-t border-gray-800">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          지금 바로 시작하세요
        </h2>
        <p className="text-gray-400 mb-8">
          베타 기간 중 무료. 설치 5분. Claude API 키만 있으면 끝.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="https://github.com/sunes26/prmate#5분-설치"
            className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            무료로 시작하기
          </a>
          <a
            href="https://github.com/marketplace/actions/prmate"
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-10 py-4 rounded-lg font-semibold text-lg border border-gray-700 transition-colors"
          >
            Marketplace →
          </a>
        </div>
        <p className="text-gray-600 text-sm mt-6">
          한국 개발자를 위해, 한국 개발자가 만든 코드 리뷰 도구 🇰🇷
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-900 bg-gray-950 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <div className="text-gray-500">
            © 2026 PRmate. MIT License. Made with 🤖 in Seoul.
          </div>
          <div className="flex gap-6 text-gray-400 flex-wrap justify-center">
            <a
              href="https://github.com/sunes26/prmate"
              className="hover:text-gray-200"
            >
              GitHub
            </a>
            <a
              href="https://github.com/sunes26/prmate/releases"
              className="hover:text-gray-200"
            >
              Releases
            </a>
            <a
              href="https://github.com/sunes26/prmate/issues"
              className="hover:text-gray-200"
            >
              Issues
            </a>
            <a
              href="https://github.com/sunes26/prmate/discussions"
              className="hover:text-gray-200"
            >
              Discussions
            </a>
            <a
              href="https://github.com/sunes26/prmate/blob/master/LICENSE"
              className="hover:text-gray-200"
            >
              라이선스
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
