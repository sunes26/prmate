import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PRmate — 한국어 AI 코드 리뷰',
  description:
    'GitHub PR이 열리면 자동으로 한국어로 코드 리뷰 코멘트를 게시합니다. 우아한형제들, 카카오, 네이버 등 국내 대기업 컨벤션 프리셋 11종 내장.',
  keywords: [
    '한국어 코드 리뷰', 'AI 코드 리뷰', 'GitHub Actions', 'CodeRabbit 한국어',
    'PR 자동 리뷰', 'Claude 코드 리뷰', '카카오 컨벤션', '우아한형제들 컨벤션',
    '네이버 코딩 스타일', 'SK 코딩 컨벤션', 'LG 코딩 가이드',
  ],
  authors: [{ name: 'PRmate Team', url: 'https://prmate.dev' }],
  metadataBase: new URL('https://prmate.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'PRmate — 한국어 AI 코드 리뷰',
    description: '우아한형제들·카카오·네이버 컨벤션 프리셋 11종 내장. 5분 설치, 베타 기간 무료.',
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
    description: '우아한형제들·카카오·네이버 컨벤션 프리셋 11종 내장.',
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
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    reviewCount: '1',
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
    code: `language: ko
convention: kakao       # woowa | kakao | naver | sk | lg | nhn | coupang | line | toss | custom
review_level: standard  # strict | standard | relaxed
model: sonnet           # sonnet | haiku`,
  },
  {
    step: '4',
    title: 'PR 오픈 → 자동 리뷰 🎉',
    desc: 'PR 열면 2~3분 내 한국어 리뷰 코멘트가 자동 게시됩니다.',
    code: null,
  },
];

const PLANS = [
  { name: 'Free', price: '₩0', period: '/월', target: '개인 개발자', prLimit: '월 30개', features: ['기본 한국어 리뷰', '기본 컨벤션'], highlight: false },
  { name: 'Starter', price: '₩9,900', period: '/월', target: '소규모팀 (5인↓)', prLimit: '월 100개', features: ['프리셋 컨벤션', '.yml 설정', 'GitHub Actions'], highlight: false },
  { name: 'Team', price: '₩29,000', period: '/월', target: '스타트업 (10인↓)', prLimit: '월 300개', features: ['전체 기능', 'Slack 알림', '우선 지원'], highlight: true },
  { name: 'Growth', price: '₩59,000', period: '/월', target: '성장팀 (20인↓)', prLimit: '무제한', features: ['전체 기능', 'PIPA 체크', 'PM 대시보드'], highlight: false },
];

const FAQ = [
  { q: '코드가 서버에 저장되나요?', a: '아니요. Zero Data Retention 정책을 적용하여 코드는 메모리에서 처리 후 즉시 삭제됩니다. PR diff만 추출하여 분석하며, 전체 레포지토리에 접근하지 않습니다.' },
  { q: 'CodeRabbit과 무엇이 다른가요?', a: 'CodeRabbit은 한국어 설정을 지원한다고 명시하지만, 실제로는 영어 리뷰가 나오는 경우가 많습니다. PRmate는 처음부터 한국어 리뷰를 위해 설계되었으며, 우아한형제들/카카오/네이버 컨벤션 프리셋을 기본 제공합니다.' },
  { q: '어떤 언어를 지원하나요?', a: 'JavaScript, TypeScript, Python, Java, Go, Kotlin, Rust, Ruby 등 주요 언어를 지원합니다. 한국어/영어 혼용 코드베이스도 지원합니다.' },
  { q: '설치하는 데 얼마나 걸리나요?', a: 'GitHub Actions YAML 파일 하나를 복사+붙여넣기하면 됩니다. 5분 이내에 첫 리뷰를 받을 수 있습니다.' },
  { q: '베타 기간 중 무료인가요?', a: '네, 현재 베타 기간 중에는 무료로 이용할 수 있습니다. 베타 피드백을 주시면 유료 전환 시 혜택을 드립니다.' },
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
        <div className="inline-block bg-blue-900/40 text-blue-300 text-sm px-3 py-1 rounded-full mb-6 border border-blue-700/50">
          🚀 베타 오픈 — 무료로 시작하기
        </div>
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          PR 리뷰, <span className="text-blue-400">이제 한국어로</span>
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          GitHub PR이 열리면 자동으로 <strong className="text-gray-200">한국어</strong>로 코드 리뷰
          코멘트를 게시합니다. 우아한형제들·카카오·네이버 컨벤션 프리셋 내장.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="https://github.com/sunes26/prmate#5분-설치" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            무료로 시작하기
          </a>
          <a href="https://github.com/sunes26/prmate" className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-8 py-3 rounded-lg font-semibold transition-colors border border-gray-700">
            GitHub 보기 →
          </a>
        </div>
      </section>

      {/* Pain Points */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-3">이미 많은 개발자들이 겪고 있는 문제</h2>
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

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">4단계로 시작 (5분)</h2>
        <div className="grid gap-8">
          {STEPS.map(({ step, title, desc, code }) => (
            <div key={step} className="flex gap-6 items-start">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-lg shrink-0">{step}</div>
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
      <section className="max-w-5xl mx-auto px-6 py-16" id="pricing">
        <h2 className="text-2xl font-bold text-center mb-10">가격 플랜</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {PLANS.map((plan) => (
            <div key={plan.name} className={`rounded-xl p-6 border ${plan.highlight ? 'bg-blue-900/30 border-blue-600' : 'bg-gray-900 border-gray-800'}`}>
              {plan.highlight && <div className="text-blue-400 text-xs font-semibold mb-2 uppercase tracking-wide">추천</div>}
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-3">{plan.target}</p>
              <div className="text-3xl font-bold mb-1">{plan.price}<span className="text-base font-normal text-gray-400">{plan.period}</span></div>
              <p className="text-gray-500 text-sm mb-4">{plan.prLimit} PR</p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm text-gray-300 flex items-center gap-2">
                    <span className="text-green-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <a href="https://github.com/sunes26/prmate#5분-설치" className={`block text-center py-2 rounded-lg text-sm font-semibold transition-colors ${plan.highlight ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-200'}`}>
                시작하기
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-16" id="faq">
        <h2 className="text-2xl font-bold text-center mb-10">자주 묻는 질문</h2>
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
        <h2 className="text-3xl font-bold mb-4">지금 바로 시작하세요</h2>
        <p className="text-gray-400 mb-8">베타 기간 중 무료. 설치 5분.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="https://github.com/sunes26/prmate#5분-설치" className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-lg font-semibold text-lg transition-colors">
            무료로 시작하기
          </a>
          <a href="https://github.com/marketplace/actions/prmate" className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-10 py-4 rounded-lg font-semibold text-lg border border-gray-700 transition-colors">
            Marketplace →
          </a>
        </div>
        <p className="text-gray-600 text-sm mt-6">한국 개발자를 위해, 한국 개발자가 만든 코드 리뷰 도구</p>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-900 bg-gray-950 py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <div className="text-gray-500">
            © 2026 PRmate. MIT License.
          </div>
          <div className="flex gap-6 text-gray-400">
            <a href="https://github.com/sunes26/prmate" className="hover:text-gray-200">GitHub</a>
            <a href="https://github.com/sunes26/prmate/issues" className="hover:text-gray-200">Issues</a>
            <a href="https://github.com/sunes26/prmate/discussions" className="hover:text-gray-200">Discussions</a>
            <a href="https://github.com/sunes26/prmate/blob/master/LICENSE" className="hover:text-gray-200">라이선스</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
