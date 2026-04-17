import type { Metadata } from 'next';
import CopyButton from '../components/CopyButton';

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
  authors: [{ name: 'PRmate Team', url: 'https://prmate.me' }],
  metadataBase: new URL('https://prmate.me'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'PRmate — 한국어 AI 코드 리뷰',
    description:
      '우아한테크코스 · 네이버 Hackday · 토스 Frontend Fundamentals 공식 컨벤션 내장. 5분 설치, 베타 기간 무료.',
    type: 'website',
    url: 'https://prmate.me',
    siteName: 'PRmate',
    locale: 'ko_KR',
    images: [{ url: '/og-image', width: 1200, height: 630, alt: 'PRmate — 한국어 AI 코드 리뷰' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PRmate — 한국어 AI 코드 리뷰',
    description: '공식 공개 자료 기반 컨벤션 내장. 5분 설치.',
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

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'PRmate',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Linux, macOS, Windows (via GitHub Actions)',
  description: 'GitHub PR을 한국어로 자동 리뷰하는 AI 도구. 공식 컨벤션 5종 내장.',
  url: 'https://prmate.me',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW', description: '베타 기간 무료' },
  softwareVersion: '1.2.2',
};

// ─── 데이터 ──────────────────────────────────────────────────────

const MAIN_YAML = `name: PR 코드 리뷰
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
      - uses: actions/checkout@v4
      - uses: prmate/prmate@v1
        with:
          anthropic_api_key: \${{ secrets.ANTHROPIC_API_KEY }}`;

const CONFIG_YAML = `enabled: true                 # 전체 On/Off (Kill switch)

language: ko                  # ko | en
convention: naver             # default | woowa | naver | toss | custom
review_level: standard        # strict | standard | relaxed

model: sonnet                 # sonnet (권장) | haiku (빠름, 저렴)
mixed_language: false         # 코드는 영어, 설명은 한국어
dry_run: false                # 실제 게시 없이 로그만

max_files_per_pr: 20          # PR당 최대 리뷰 파일 수

exclude_paths:
  - "*.md"
  - "docs/**"
  - "*.lock"
  - "*.test.ts"

# 파일 타입별 세부 규칙
rules:
  - pattern: "src/**/*.ts"
    review_level: strict
  - pattern: "*.spec.ts"
    enabled: false

# 커스텀 프롬프트 주입
custom_prompt: |
  우리 팀은 함수형 프로그래밍 원칙을 중시합니다.
  가변 상태(mutation) 사용을 강하게 지적해주세요.`;

const PAIN_POINTS = [
  { source: 'turtle0204.tistory (2025.09)', quote: '"config 적용 안 되서 자꾸 영어로 말함"' },
  { source: 'velog 사용기 (2025.11)', quote: '"경험상 영어로 받는 것이 문맥상 조금 더 정확"' },
  { source: 'Google 자동 생성 답변', quote: '"코드래빗 한국어 안 됨 해결 방법"' },
];

const COMPARISON = [
  { feature: '한국어 리뷰 품질', prmate: '공식 지원 (번역체 없음)', competitor: '설정 옵션 (실전 영어 많음)', winner: 'prmate' },
  { feature: '한국 IT사 공식 컨벤션', prmate: '우아한/네이버/토스 3종', competitor: '없음', winner: 'prmate' },
  { feature: '비용 투명성', prmate: 'PR마다 USD/KRW 표시', competitor: '구독제', winner: 'prmate' },
  { feature: '가격', prmate: '베타 유료기능 무료 / Starter ₩9,900', competitor: '$15/월 ~', winner: 'prmate' },
  { feature: '커스텀 컨벤션 파일', prmate: '.md 주입 기본 지원', competitor: '제한적', winner: 'prmate' },
  { feature: '설치 난이도', prmate: 'YAML 한 줄 (5분)', competitor: '원클릭 (GitHub App)', winner: 'competitor' },
  { feature: 'Slack · Discord 알림', prmate: '리뷰 즉시 알림 (무료)', competitor: '유료 예약 리포트만', winner: 'prmate' },
  { feature: '원클릭 설치', prmate: '추후 업데이트 예정', competitor: '지원', winner: 'competitor' },
  { feature: 'PIPA (개인정보보호법) 모드', prmate: '있음', competitor: '없음', winner: 'prmate' },
  { feature: 'Zero Data Retention', prmate: '기본 내장', competitor: '엔터프라이즈만', winner: 'prmate' },
];

const USE_CASES = [
  {
    lang: 'Java 백엔드',
    recommend: 'woowa',
    alt: 'naver',
    reason: '우아한테크코스 (Google Java Style 기반 + 4개 커스텀) 또는 Hackday',
    icon: '☕',
  },
  {
    lang: 'TypeScript/React 프론트',
    recommend: 'toss',
    alt: 'default',
    reason: '토스 Frontend Fundamentals 4대 원칙 (가독성·예측가능성·응집도·결합도)',
    icon: '⚛️',
  },
  {
    lang: 'Python / Go / Rust',
    recommend: 'default',
    alt: 'custom',
    reason: '클린 코드 범용 원칙. 팀 규칙이 있다면 custom + .md 파일',
    icon: '🐍',
  },
  {
    lang: '사내 규칙 이미 있음',
    recommend: 'custom',
    alt: 'default',
    reason: '.prmate/our-style.md 파일로 팀 전용 규칙 직접 주입',
    icon: '🏢',
  },
];

const CONVENTIONS = [
  { value: 'default', label: '기본', desc: '클린 코드 범용 원칙 (Robert C. Martin)', lang: '모든 언어', source: null },
  { value: 'woowa', label: '우아한테크코스', desc: 'Google Java Style + 들여쓰기 4, 한 줄 120자 등 4개 차이점', lang: 'Java', source: 'github.com/woowacourse/woowacourse-docs' },
  { value: 'naver', label: '네이버 Hackday', desc: 'Checkstyle XML 포함 공식 문서 · K&R · UTF-8 · LF · import 순서', lang: 'Java', source: 'naver.github.io/hackday-conventions-java' },
  { value: 'toss', label: '토스 Frontend Fundamentals', desc: '가독성·예측가능성·응집도·결합도 4대 원칙', lang: 'TypeScript/JavaScript', source: 'frontend-fundamentals.com' },
  { value: 'custom', label: '팀 커스텀', desc: '.md 파일로 자체 규칙 주입', lang: '-', source: null },
];

const FEATURES = [
  { icon: '🇰🇷', title: '처음부터 한국어 설계', desc: '번역체 없는 자연스러운 한국어. 실제 리뷰어 톤.' },
  { icon: '📖', title: '출처 투명 공개', desc: '모든 컨벤션에 공식 문서 URL. 추정 규칙 없음.' },
  { icon: '🔒', title: 'Zero Data Retention', desc: '코드 서버 미저장. 메모리 처리 후 즉시 삭제.' },
  { icon: '🛡️', title: '비밀 자동 마스킹', desc: 'API 키 / 토큰 / 비밀번호 자동 [REDACTED].' },
  { icon: '💰', title: '비용 완전 공개', desc: '리뷰마다 USD + KRW 표시. Prompt Caching 50~90% 절감.' },
  { icon: '🎛️', title: '세밀한 커스터마이즈', desc: 'Kill switch, 모델 선택, 파일 타입 규칙, Dry-run, 영어 혼용.' },
  { icon: '📍', title: 'Inline 라인별 코멘트', desc: '전체 요약 + 특정 라인 직접 코멘트 (GitHub 네이티브).' },
  { icon: '✅', title: 'Approve / Request Changes', desc: '위험 수준 기반 자동 판정 시그널.' },
  { icon: '🇰🇷', title: 'PIPA 체크 모드', desc: '한국 개인정보보호법 위반 패턴 전용 스캔.' },
  { icon: '🔐', title: '보안 전용 스캐너', desc: 'SQL Injection, XSS, SSRF 등 보안 취약점만 집중.' },
  { icon: '📦', title: '대형 PR 자동 청킹', desc: '8+ 파일 변경 시 자동 분할 호출. 타임아웃 안전.' },
  { icon: '🎓', title: '팀 스타일 학습', desc: '.prmate/style-guide.md로 팀 규칙 주입.' },
  { icon: '🔔', title: 'Slack · Discord 알림', desc: '리뷰 완료/실패 시 팀 채널로 즉시 알림. Webhook URL만 등록하면 끝.' },
];

const BEFORE_AFTER = {
  before: {
    title: '타 도구 (한국어 설정 시)',
    content: `This pull request introduces several improvements to the error handling logic. However, there are a few concerns that should be addressed before merging:

1. The \`fetchUser\` function does not validate the HTTP response status. This could lead to silent failures when the API returns 4xx or 5xx errors.

2. The magic number \`18\` in \`isAdult\` function should be extracted to a constant for better maintainability.

Consider addressing these issues.`,
    notes: ['영어 그대로', '번역체 한국어 혼합', '맥락 어색', '국내 컨벤션 무지'],
  },
  after: {
    title: 'PRmate (v1.2.2)',
    content: `[위험] 에러 처리 없는 비동기 함수

fetchUser는 네트워크 오류나 HTTP 에러 응답(4xx, 5xx)을 전혀 처리하지 않습니다.
res.ok 확인 없이 바로 res.json()을 호출하면, 서버가 에러 응답을 반환해도
조용히 잘못된 데이터를 반환하게 됩니다.

[제안] 매직 넘버 상수 추출

18이라는 숫자는 "성인 기준 나이"라는 도메인 지식을 코드에서 숨깁니다.
상수로 추출하면 의도가 명확해집니다.`,
    notes: ['자연스러운 한국어', '심각도 명시 ([위험]/[권장]/[제안])', '도메인 용어 한국어', '수정 코드 예시 포함'],
  },
};

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
    code: MAIN_YAML,
  },
  {
    step: '3',
    title: '상세 설정 (.prmate.yml)',
    desc: '레포 루트에 .prmate.yml 파일을 만들어 세부 설정합니다. 없으면 기본값이 사용됩니다.',
    code: CONFIG_YAML,
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

const REVIEW_SAMPLE_BODY = `## 📋 PR 요약
example.ts에 의도적으로 리뷰 포인트를 심은 테스트 PR입니다.

## ✅ 잘된 점
- package.json의 Jest 경로를 .bin/jest → jest/bin/jest.js로 수정한 것은
  크로스 플랫폼 호환성 개선의 올바른 접근입니다.
- TIMEOUT_MS에 30_000처럼 숫자 구분자를 사용해 가독성을 높인 부분이 좋습니다.

## 🔍 리뷰 코멘트

### [위험] 에러 처리 없는 비동기 함수
fetchUser는 네트워크 오류나 HTTP 에러 응답을 전혀 처리하지 않습니다.

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
18을 ADULT_AGE_THRESHOLD로 추출하면 의도가 명확해집니다.

## 📊 전체 평가
승인 가능하나 fetchUser의 에러 처리는 반드시 수정 필요.`;

const REVIEW_META = `🤖 PRmate 메타 정보

- 컨벤션: 네이버 Hackday
- 리뷰 레벨: standard
- 모델: claude-sonnet-4-6 (티어: sonnet)
- 사용 토큰: 입력 1,612 / 출력 1,763
- 캐시 생성: 0 토큰
- 💰 비용: $0.0381 / ₩51`;

const FAQ = [
  { q: '코드가 서버에 저장되나요?', a: '아니요. Zero Data Retention 정책으로 코드는 메모리에서 처리 후 즉시 삭제됩니다. PR diff만 추출하여 분석하며, 전체 레포지토리에 접근하지 않습니다. API 키나 비밀번호는 자동 [REDACTED] 마스킹 처리됩니다.' },
  { q: 'CodeRabbit과 무엇이 다른가요?', a: 'CodeRabbit은 language: ko 설정이 있지만 실제로는 영어 리뷰가 많이 나온다는 불만이 있습니다. PRmate는 처음부터 한국어 리뷰를 위해 설계되었으며, 우아한테크코스 · 네이버 Hackday · 토스 Frontend Fundamentals 등 공식 공개 자료 기반 컨벤션을 내장합니다.' },
  { q: '왜 카카오·SK·LG·쿠팡·LINE 컨벤션은 없나요?', a: '해당 기업들은 공식으로 공개된 코딩 컨벤션 문서가 없습니다. 외부에 공개되지 않은 사내 규칙을 추정해서 제공하는 것은 정직하지 않다고 판단하여 v1.1.0에서 제거했습니다. 팀 내부 규칙이 있다면 convention: custom + convention_file 옵션으로 팀의 .md 파일을 직접 주입하세요.' },
  { q: '리뷰 비용은 얼마인가요?', a: 'PR 1건당 평균 $0.01 ~ $0.05 (₩15~70). Prompt Caching으로 50~90% 절감. 모든 리뷰 코멘트에 정확한 비용을 USD + KRW로 투명하게 표시합니다.' },
  { q: '어떤 언어를 지원하나요?', a: 'JavaScript, TypeScript, Python, Java, Go, Kotlin, Rust, Ruby, Swift, C# 등 주요 언어 전부 지원. 한국어/영어 혼용 코드베이스도 OK (mixed_language 옵션).' },
  { q: '리뷰가 너무 시끄러우면 어떻게 하나요?', a: 'review_level: relaxed 또는 mode: summary로 변경하면 핵심만 지적합니다. 파일 타입별로 다른 규칙 적용도 가능 (rules 옵션). 특정 PR만 스킵하려면 제목에 [skip review] 포함.' },
  { q: 'AI가 잘못된 지적을 하면요?', a: 'Dry-run 모드로 실제 게시 전 결과 확인 가능. 팀 스타일 가이드 (.prmate/style-guide.md)를 작성하면 팀 컨텍스트를 학습하여 정확도 향상. 프리미엄 학습 모드는 Team 플랜부터.' },
  { q: '설치가 복잡한가요?', a: 'YAML 파일 하나를 복사+붙여넣기, 5분 이내 완료. GitHub Action 방식이라 별도 서버 불필요.' },
  { q: '베타 기간 중 무료인가요?', a: '네, 베타 기간 중 모든 유료기능 무료입니다. 베타 참여자에게는 정식 출시 후 50% 할인 혜택을 제공할 예정입니다. 피드백은 GitHub Discussions에서 환영합니다.' },
  { q: '월 PR 한도를 초과하면 어떻게 되나요?', a: '베타 기간 중에는 한도 관계없이 모든 기능을 자유롭게 이용하실 수 있습니다. 정식 출시 후에는 한도 초과분이 해당 월 동안 대기 상태가 되며, 다음 달 1일 자동 초기화됩니다. 초과가 잦은 경우 상위 플랜 업그레이드 또는 추가 크레딧 구매로 해결 가능합니다.' },
  { q: '리뷰 완료를 어떻게 알 수 있나요?', a: 'Slack 또는 Discord Webhook URL을 .prmate.yml에 등록하면 리뷰 완료/실패 시 팀 채널로 즉시 알림을 받을 수 있습니다. CodeRabbit 등 경쟁 도구가 유료 플랜에서 예약 리포트 방식으로 제공하는 것과 달리, PRmate는 PR 이벤트 즉시 전송합니다.' },
  { q: 'GitHub App으로도 쓸 수 있나요?', a: '현재는 GitHub Action 방식만 지원. GitHub App은 2026년 하반기 출시 예정입니다.' },
];

const NAV_LINKS = [
  { href: '#features', label: '기능' },
  { href: '#conventions', label: '컨벤션' },
  { href: '#demo', label: '데모' },
  { href: '#installation', label: '설치' },
  { href: '#pricing', label: '가격' },
  { href: '#faq', label: 'FAQ' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ══════════════════════ STICKY NAV ══════════════════════ */}
      <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-900">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 font-bold text-lg">
            <span className="flex w-7 h-7 items-center justify-center rounded-lg bg-gray-900 border border-gray-800 overflow-hidden shrink-0">
              <svg viewBox="0 0 320 360" width="18" height="20">
                <line x1="85" y1="75" x2="160" y2="255" stroke="rgba(59,130,246,0.5)" strokeWidth="22" strokeLinecap="round"/>
                <line x1="235" y1="75" x2="160" y2="255" stroke="rgba(59,130,246,0.5)" strokeWidth="22" strokeLinecap="round"/>
                <circle cx="85"  cy="75"  r="50" fill="#3B82F6" />
                <circle cx="235" cy="75"  r="50" fill="#3B82F6" />
                <circle cx="160" cy="295" r="62" fill="#4ADA8C" />
              </svg>
            </span>
            <span>PRmate</span>
            <span className="text-xs font-normal text-gray-500">v1.2.2</span>
          </a>
          <div className="hidden md:flex items-center gap-6 text-sm">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="text-gray-400 hover:text-gray-100 transition-colors">
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex gap-2">
            <a
              href="https://github.com/prmate/prmate"
              className="text-xs px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-md text-gray-200 border border-gray-700"
            >
              GitHub ★
            </a>
            <a
              href="#installation"
              className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-md text-white font-semibold"
            >
              시작하기
            </a>
          </div>
        </div>
      </nav>

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-900/40 text-blue-300 text-sm px-4 py-1.5 rounded-full mb-6 border border-blue-700/50">
          <span>🚀</span>
          <span>v1.2.2 — 공식 공개 자료 기반 5종만 제공 · 무료 베타</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          PR 리뷰, <span className="text-blue-400">이제 한국어로</span>
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          GitHub PR이 열리면 자동으로 <strong className="text-gray-200">한국어</strong>로 코드 리뷰 코멘트를 게시합니다.
          <br />
          <strong className="text-gray-200">우아한테크코스 · 네이버 Hackday · 토스 Frontend Fundamentals</strong>{' '}
          등 <span className="underline decoration-blue-500/50">공식 공개</span> 컨벤션 기반.
        </p>
        <div className="flex gap-4 justify-center flex-wrap mb-8">
          <a
            href="#installation"
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            무료로 시작하기 (5분)
          </a>
          <a
            href="https://github.com/prmate/prmate"
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-8 py-3 rounded-lg font-semibold transition-colors border border-gray-700"
          >
            GitHub ★ 누르기 →
          </a>
        </div>

        {/* 배지 (정확한 v1.1.0 수치) */}
        <div className="flex gap-2 justify-center flex-wrap text-xs">
          <span className="bg-gray-900 text-gray-400 px-3 py-1 rounded border border-gray-800">
            ✅ Claude Sonnet 4.6
          </span>
          <span className="bg-gray-900 text-gray-400 px-3 py-1 rounded border border-gray-800">
            🔒 Zero Data Retention
          </span>
          <span className="bg-gray-900 text-gray-400 px-3 py-1 rounded border border-gray-800">
            📦 v1.2.2 · 53 tests passing
          </span>
          <span className="bg-gray-900 text-gray-400 px-3 py-1 rounded border border-gray-800">
            📖 100% 공식 자료 기반
          </span>
          <span className="bg-gray-900 text-gray-400 px-3 py-1 rounded border border-gray-800">
            💰 월 $3~10/팀 (Claude 비용)
          </span>
        </div>
      </section>

      {/* ══════════════════════ PAIN POINTS ══════════════════════ */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-3">이미 많은 개발자들이 겪고 있는 문제</h2>
        <p className="text-gray-400 text-center mb-10">CodeRabbit 한국어 설정 후 실제 개발자들의 반응</p>
        <div className="grid gap-4">
          {PAIN_POINTS.map(({ source, quote }) => (
            <div key={source} className="bg-gray-900 border border-gray-800 rounded-lg p-5">
              <p className="text-gray-200 text-lg mb-2">{quote}</p>
              <p className="text-gray-500 text-sm">— {source}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════ 정직성 선언 ══════════════════════ */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/20 border border-blue-700/40 rounded-2xl p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">📖</span>
            <h2 className="text-2xl md:text-3xl font-bold">우린 검증 가능한 것만 약속합니다</h2>
          </div>
          <p className="text-gray-300 mb-6 leading-relaxed">
            많은 AI 코드 리뷰 도구가 &quot;수십 개 컨벤션 지원&quot;을 마케팅합니다. 하지만 상당수는 공식 문서가 없는
            회사의 이름을 빌린 <strong className="text-yellow-300">추정 규칙</strong>입니다. PRmate는 다릅니다.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>v1.1.0에서 한 일</span>
              </h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• 11종 → 5종으로 <strong className="text-white">정직성 정리</strong></li>
                <li>• 모든 컨벤션에 <strong className="text-white">공식 출처 URL 명시</strong></li>
                <li>• 프롬프트에 출처 링크를 <strong className="text-white">Claude에게도 노출</strong></li>
                <li>• 제거된 값 사용 시 <strong className="text-white">친절한 안내 메시지</strong></li>
              </ul>
            </div>

            <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="text-red-400">✗</span>
                <span>하지 않는 일</span>
              </h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• 공개 문서 없는 기업명으로 <strong className="text-white">추정 규칙 마케팅</strong></li>
                <li>• 출처 없는 &quot;우리가 만든 XX 스타일&quot;</li>
                <li>• 사용자 코드 수집/저장</li>
                <li>• 숨겨진 비용 (모든 PR에 정확한 금액 표시)</li>
              </ul>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap pt-4 border-t border-gray-800">
            <span className="text-xs text-gray-400">투명성 수치:</span>
            <span className="text-xs px-2 py-1 bg-gray-900 rounded border border-gray-800">5종 공식 컨벤션</span>
            <span className="text-xs px-2 py-1 bg-gray-900 rounded border border-gray-800">53 테스트</span>
            <span className="text-xs px-2 py-1 bg-gray-900 rounded border border-gray-800">GitHub Public 레포</span>
            <span className="text-xs px-2 py-1 bg-gray-900 rounded border border-gray-800">
              번들 542 KB
            </span>
          </div>
        </div>
      </section>

      {/* ══════════════════════ 비교 테이블 ══════════════════════ */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-3">PRmate vs CodeRabbit</h2>
        <p className="text-gray-400 text-center mb-10">한국 개발자 기준 정직한 비교</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-gray-400 border-b border-gray-800">
              <tr>
                <th className="text-left px-4 py-3">기능</th>
                <th className="text-left px-4 py-3">PRmate</th>
                <th className="text-left px-4 py-3">CodeRabbit</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map(({ feature, prmate, competitor, winner }, i) => (
                <tr key={i} className="border-b border-gray-900 hover:bg-gray-900/50">
                  <td className="px-4 py-3 font-medium text-gray-200">{feature}</td>
                  <td className={`px-4 py-3 ${winner === 'prmate' ? 'text-green-300 font-semibold' : 'text-gray-400'}`}>
                    {winner === 'prmate' && <span className="mr-1">✓</span>}
                    {prmate}
                  </td>
                  <td className={`px-4 py-3 ${winner === 'competitor' ? 'text-blue-300' : 'text-gray-500'}`}>
                    {winner === 'competitor' && <span className="mr-1">✓</span>}
                    {competitor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-gray-500 text-xs text-center mt-4">
          ※ 2026-04 기준. CodeRabbit의 기능은 공개 자료 기반이며 실제 경험과 차이 있을 수 있음.
        </p>
      </section>

      {/* ══════════════════════ Before/After ══════════════════════ */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-3">리뷰 품질 비교</h2>
        <p className="text-gray-400 text-center mb-10">
          동일한 코드에 대한 리뷰 — 타 도구 vs PRmate
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-red-900/40 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-red-300">❌ {BEFORE_AFTER.before.title}</h3>
            </div>
            <pre className="text-sm text-gray-400 whitespace-pre-wrap leading-relaxed mb-4 font-sans">
              {BEFORE_AFTER.before.content}
            </pre>
            <div className="pt-4 border-t border-gray-800">
              <p className="text-xs text-red-400 mb-2">문제:</p>
              <ul className="text-xs text-gray-500 space-y-1">
                {BEFORE_AFTER.before.notes.map((note, i) => (
                  <li key={i}>• {note}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-gray-900 border border-green-800/60 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-green-300">✅ {BEFORE_AFTER.after.title}</h3>
            </div>
            <pre className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed mb-4 font-sans">
              {BEFORE_AFTER.after.content}
            </pre>
            <div className="pt-4 border-t border-gray-800">
              <p className="text-xs text-green-400 mb-2">강점:</p>
              <ul className="text-xs text-gray-500 space-y-1">
                {BEFORE_AFTER.after.notes.map((note, i) => (
                  <li key={i}>• {note}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ FEATURES GRID ══════════════════════ */}
      <section className="max-w-5xl mx-auto px-6 py-16" id="features">
        <h2 className="text-3xl font-bold text-center mb-3">왜 PRmate인가?</h2>
        <p className="text-gray-400 text-center mb-10">12가지 차별점</p>
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

      {/* ══════════════════════ 용도별 선택 가이드 ══════════════════════ */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-3">어떤 컨벤션을 써야 하나요?</h2>
        <p className="text-gray-400 text-center mb-10">상황별 추천 가이드</p>
        <div className="grid md:grid-cols-2 gap-4">
          {USE_CASES.map(({ lang, recommend, alt, reason, icon }) => (
            <div
              key={lang}
              className="bg-gray-900 border border-gray-800 rounded-lg p-5 hover:border-blue-700/50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{icon}</span>
                <h3 className="font-semibold text-lg">{lang}</h3>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-gray-500">추천:</span>
                <code className="text-green-300 bg-gray-950 px-2 py-0.5 rounded text-sm font-semibold">
                  {recommend}
                </code>
                <span className="text-xs text-gray-500">또는</span>
                <code className="text-blue-400 bg-gray-950 px-2 py-0.5 rounded text-sm">{alt}</code>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">{reason}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════ CONVENTIONS TABLE ══════════════════════ */}
      <section className="max-w-5xl mx-auto px-6 py-16" id="conventions">
        <h2 className="text-3xl font-bold text-center mb-3">공식 공개 자료 기반 컨벤션 5종</h2>
        <p className="text-gray-400 text-center mb-3">
          YAML에서 <code className="text-blue-400 bg-gray-900 px-2 py-0.5 rounded text-sm">convention: 값</code> 으로 선택
        </p>
        <p className="text-gray-500 text-sm text-center mb-10 max-w-2xl mx-auto">
          ⚠️ 내부 문서로만 존재하는 기업(카카오·SK·LG·쿠팡·LINE 등) 컨벤션은 &quot;추정 규칙&quot;이 되기 쉬워
          제공하지 않습니다. 팀 자체 규칙은{' '}
          <code className="text-blue-400">custom</code> 옵션으로 `.md` 파일을 직접 주입하세요.
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
                <tr key={value} className="border-b border-gray-900 hover:bg-gray-900/50">
                  <td className="px-4 py-3">
                    <code className="text-blue-400 bg-gray-900 px-2 py-0.5 rounded">{value}</code>
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

      {/* ══════════════════════ DEMO — GitHub 스타일 ══════════════════════ */}
      <section className="max-w-4xl mx-auto px-6 py-16" id="demo">
        <h2 className="text-3xl font-bold text-center mb-3">실제 PRmate 리뷰 예시</h2>
        <p className="text-gray-400 text-center mb-10">
          PR #1에서 PRmate가 실제로 생성한 리뷰 (v1.2.2 · 네이버 Hackday 컨벤션)
        </p>

        {/* GitHub 코멘트 UI 모사 */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden">
          {/* 헤더 */}
          <div className="bg-[#161b22] border-b border-[#30363d] px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 320 360" width="16" height="18">
                  <line x1="85" y1="75" x2="160" y2="255" stroke="rgba(59,130,246,0.5)" strokeWidth="22" strokeLinecap="round"/>
                  <line x1="235" y1="75" x2="160" y2="255" stroke="rgba(59,130,246,0.5)" strokeWidth="22" strokeLinecap="round"/>
                  <circle cx="85"  cy="75"  r="50" fill="#3B82F6" />
                  <circle cx="235" cy="75"  r="50" fill="#3B82F6" />
                  <circle cx="160" cy="295" r="62" fill="#4ADA8C" />
                </svg>
              </div>
            <div className="flex-1">
              <span className="font-semibold text-gray-200">github-actions</span>
              <span className="text-gray-500 text-sm ml-1">bot</span>
              <span className="text-gray-500 text-sm ml-2">commented · 방금 전</span>
            </div>
            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">Bot</span>
          </div>

          {/* 본문 */}
          <div className="p-6 font-sans">
            <pre className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed overflow-x-auto">
              {REVIEW_SAMPLE_BODY}
            </pre>

            {/* 메타 정보 Details */}
            <details className="mt-6 bg-[#161b22] border border-[#30363d] rounded p-3">
              <summary className="cursor-pointer text-gray-400 text-sm font-medium">
                🤖 PRmate 메타 정보
              </summary>
              <pre className="text-xs text-gray-500 mt-3 whitespace-pre-wrap">{REVIEW_META}</pre>
            </details>
          </div>
        </div>

        <p className="text-center text-gray-500 text-xs mt-4">
          ↑ GitHub PR Conversation 탭에 정확히 이렇게 보입니다.
        </p>
      </section>

      {/* ══════════════════════ INSTALLATION ══════════════════════ */}
      <section className="max-w-4xl mx-auto px-6 py-16" id="installation">
        <h2 className="text-3xl font-bold text-center mb-3">4단계로 시작</h2>
        <p className="text-gray-400 text-center mb-10">YAML 파일 하나 복사-붙여넣기, 5분 완료</p>
        <div className="grid gap-8">
          {STEPS.map(({ step, title, desc, code }) => (
            <div key={step} className="flex gap-6 items-start">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
                {step}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold mb-1">{title}</h3>
                <p className="text-gray-400 mb-3">{desc}</p>
                {code && (
                  <div className="relative">
                    <div className="absolute top-3 right-3 z-10">
                      <CopyButton text={code} label="복사" />
                    </div>
                    <pre className="bg-gray-900 border border-gray-800 rounded-lg p-4 pr-24 text-sm text-green-300 overflow-x-auto">
                      <code>{code}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════ BYOK 안내 ══════════════════════ */}
      <section className="max-w-4xl mx-auto px-6 pb-4 pt-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <span className="text-3xl shrink-0">💡</span>
            <div>
              <h3 className="text-xl font-semibold mb-2">PRmate 구독료 = 기능 이용권 (Claude 비용 별도)</h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                PRmate는 <strong className="text-gray-200">BYOK (Bring Your Own Key)</strong> 방식입니다.
                Claude API 비용은 본인의 Anthropic API 키로 직접 결제됩니다 — PRmate 구독료와 완전히 별개입니다.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-950 rounded-lg p-4 border border-gray-800">
                  <p className="text-gray-500 text-xs mb-1">① PRmate 구독료</p>
                  <p className="font-semibold text-gray-200">플랜별 기능 접근 권한</p>
                  <p className="text-gray-500 text-xs mt-1">Free · Starter · Team · Growth</p>
                </div>
                <div className="bg-gray-950 rounded-lg p-4 border border-gray-800">
                  <p className="text-gray-500 text-xs mb-1">② Claude API 비용 (별도 · 본인 키)</p>
                  <p className="font-semibold text-gray-200">PR 1건당 평균 $0.01~0.05</p>
                  <p className="text-gray-500 text-xs mt-1">≈ ₩15~70 · Prompt Caching 50~90% 절감</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ PRICING ══════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 py-16" id="pricing">
        <h2 className="text-3xl font-bold text-center mb-3">가격 플랜</h2>
        <p className="text-gray-400 text-center mb-6">베타 기간 중 모든 유료기능 무료</p>

        {/* 베타 배너 */}
        <div className="max-w-3xl mx-auto bg-blue-900/30 border border-blue-700/50 rounded-xl p-5 mb-10 text-center">
          <p className="text-blue-300 font-semibold mb-1">🚧 2026년 말까지 베타 — 모든 유료기능 무료</p>
          <p className="text-gray-300 text-sm">
            베타 참여 시 정식 출시 후{' '}
            <strong className="text-yellow-300">50% 할인 혜택</strong> 제공 예정
          </p>
        </div>

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
                <div className="text-blue-400 text-xs font-semibold mb-2 uppercase tracking-wide">⭐ 추천</div>
              )}
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-3">{plan.target}</p>
              <div className="text-3xl font-bold mb-1">
                {plan.price}
                <span className="text-base font-normal text-gray-400">{plan.period}</span>
              </div>
              <p className="text-gray-500 text-sm mb-4">{plan.prLimit} PR</p>
              <ul className="space-y-2 mb-6 flex-grow">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-green-400 shrink-0">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#installation"
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
          <a href="mailto:contact@prmate.me" className="text-blue-400 hover:underline">
            문의하기
          </a>
        </p>
      </section>

      {/* ══════════════════════ 투명성 ══════════════════════ */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-3">투명성</h2>
        <p className="text-gray-400 text-center mb-10">모든 코드를 검증할 수 있어야 진짜 신뢰</p>
        <div className="grid md:grid-cols-4 gap-4">
          <a
            href="https://github.com/prmate/prmate"
            className="bg-gray-900 border border-gray-800 rounded-lg p-5 text-center hover:border-blue-700/50 transition-colors"
          >
            <div className="text-2xl mb-2">📦</div>
            <div className="text-sm text-gray-500 mb-1">소스코드</div>
            <div className="font-semibold">GitHub Public</div>
          </a>
          <a
            href="https://github.com/prmate/prmate/tree/master/src/__tests__"
            className="bg-gray-900 border border-gray-800 rounded-lg p-5 text-center hover:border-blue-700/50 transition-colors"
          >
            <div className="text-2xl mb-2">✅</div>
            <div className="text-sm text-gray-500 mb-1">테스트</div>
            <div className="font-semibold">53개 passing</div>
          </a>
          <a
            href="https://github.com/prmate/prmate/releases"
            className="bg-gray-900 border border-gray-800 rounded-lg p-5 text-center hover:border-blue-700/50 transition-colors"
          >
            <div className="text-2xl mb-2">🏷️</div>
            <div className="text-sm text-gray-500 mb-1">릴리스</div>
            <div className="font-semibold">v1.2.2</div>
          </a>
        </div>
      </section>

      {/* ══════════════════════ FAQ ══════════════════════ */}
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

      {/* ══════════════════════ CTA ══════════════════════ */}
      <section className="text-center py-20 px-6 border-t border-gray-800">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">지금 바로 시작하세요</h2>
        <p className="text-gray-400 mb-8">2026년 말까지 베타 — 모든 유료기능 무료. 설치 5분. Claude API 키만 있으면 끝.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="#installation"
            className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            무료로 시작하기
          </a>
          <a
            href="https://github.com/prmate/prmate"
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-10 py-4 rounded-lg font-semibold text-lg border border-gray-700 transition-colors"
          >
            GitHub ★
          </a>
        </div>
        <p className="text-gray-600 text-sm mt-6">한국 개발자를 위해, 한국 개발자가 만든 코드 리뷰 도구 🇰🇷</p>
      </section>

      {/* ══════════════════════ FOOTER ══════════════════════ */}
      <footer className="border-t border-gray-900 bg-gray-950 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <div className="text-gray-500 flex items-center gap-1.5">
            © 2026 PRmate. Made with
            <svg viewBox="0 0 320 360" width="13" height="15" style={{ display: 'inline', verticalAlign: 'middle' }}>
              <line x1="85" y1="75" x2="160" y2="255" stroke="rgba(59,130,246,0.6)" strokeWidth="22" strokeLinecap="round"/>
              <line x1="235" y1="75" x2="160" y2="255" stroke="rgba(59,130,246,0.6)" strokeWidth="22" strokeLinecap="round"/>
              <circle cx="85" cy="75" r="50" fill="#3B82F6" />
              <circle cx="235" cy="75" r="50" fill="#3B82F6" />
              <circle cx="160" cy="295" r="62" fill="#4ADA8C" />
            </svg>
            in Seoul.
          </div>
          <div className="flex gap-6 text-gray-400 flex-wrap justify-center">
            <a href="https://github.com/prmate/prmate" className="hover:text-gray-200">
              GitHub
            </a>
            <a href="https://github.com/prmate/prmate/releases" className="hover:text-gray-200">
              Releases
            </a>
            <a href="https://github.com/prmate/prmate/issues" className="hover:text-gray-200">
              Issues
            </a>
            <a href="https://github.com/prmate/prmate/discussions" className="hover:text-gray-200">
              Discussions
            </a>
            <a href="https://github.com/prmate/prmate/blob/master/CHANGELOG.md" className="hover:text-gray-200">
              Changelog
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
