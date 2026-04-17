import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용약관',
  description: 'PRmate 이용약관',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 font-sans">
      {/* 헤더 */}
      <div className="border-b border-gray-900">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <a href="/" className="text-gray-400 hover:text-gray-200 text-sm transition-colors">
            ← PRmate 홈
          </a>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-2">이용약관</h1>
        <p className="text-gray-500 text-sm mb-12">최종 수정일: 2026년 4월 17일</p>

        <div className="space-y-10 text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">1. 총칙</h2>
            <p>
              본 약관은 PRmate(이하 &quot;서비스&quot;)의 이용에 관한 조건과 절차를 규정합니다.
              서비스를 이용함으로써 본 약관에 동의한 것으로 간주합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">2. 서비스 설명</h2>
            <p>
              PRmate는 GitHub Actions 기반의 AI 코드 리뷰 도구입니다. 사용자가 GitHub 레포지토리에
              워크플로우 파일을 추가하면, Pull Request 생성 시 자동으로 한국어 코드 리뷰 코멘트를 게시합니다.
            </p>
            <p className="mt-3">
              서비스는 <strong className="text-white">BYOK(Bring Your Own Key)</strong> 방식으로 제공됩니다.
              AI 리뷰 생성에 필요한 Anthropic API 비용은 사용자 본인의 API 키로 직접 결제되며,
              PRmate 이용료와 별개입니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">3. 베타 서비스 안내</h2>
            <div className="bg-blue-900/20 border border-blue-700/40 rounded-lg p-5 text-sm">
              <p className="text-blue-300 font-semibold mb-2">현재 베타 서비스 운영 중 (2026년 5월 말 정식 출시 예정)</p>
              <ul className="space-y-1 text-gray-300">
                <li>• 베타 기간 중 모든 유료 기능을 무료로 이용할 수 있습니다.</li>
                <li>• 서비스 기능, 가격, 정책은 정식 출시 전 변경될 수 있습니다.</li>
                <li>• 베타 기간 중 예고 없이 서비스가 일시 중단될 수 있습니다.</li>
                <li>• 베타 기간은 서비스 준비 상황에 따라 <strong className="text-yellow-300">조기 종료될 수 있습니다.</strong></li>
                <li>• 베타 기간 중 <a href="https://github.com/prmate/prmate" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">GitHub 레포지토리 (github.com/prmate/prmate)</a>에 Star를 누른 계정은 정식 출시 후 50% 할인 혜택을 받을 수 있습니다 (별도 공지). Star 누른 시점이 베타 종료일 이전이어야 하며, GitHub 계정 기준으로 확인합니다.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">4. 이용자 의무</h2>
            <ul className="space-y-2 text-sm">
              <li>• 본인 소유 또는 사용 권한이 있는 레포지토리에만 서비스를 사용해야 합니다.</li>
              <li>• Anthropic API 키는 본인이 직접 발급받아 사용하며, 키의 보안 관리 책임은 이용자에게 있습니다.</li>
              <li>• 서비스를 악용하거나 GitHub Actions 리소스를 과도하게 소비하는 방식으로 사용해서는 안 됩니다.</li>
              <li>• 타인의 레포지토리에 무단으로 본 서비스를 설치하거나 실행해서는 안 됩니다.</li>
              <li>• 관련 법령 및 GitHub 이용약관을 준수해야 합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">5. AI 리뷰의 한계</h2>
            <p>
              PRmate의 코드 리뷰는 AI가 생성한 참고 의견입니다. 다음 사항에 유의하세요:
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>• AI 리뷰는 보조적 수단이며, 전문 개발자의 판단을 대체하지 않습니다.</li>
              <li>• 리뷰 내용의 정확성을 보장하지 않으며, 오탐(false positive) 또는 미탐(false negative)이 발생할 수 있습니다.</li>
              <li>• AI 리뷰를 근거로 한 코드 변경, 배포, 보안 결정의 책임은 이용자에게 있습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">6. 지식재산권</h2>
            <p>
              PRmate 소스코드는 MIT 라이선스로 공개되어 있습니다 (
              <a href="https://github.com/prmate/prmate" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                github.com/prmate/prmate
              </a>
              ).
            </p>
            <p className="mt-3">
              서비스 로고, 브랜드명 &quot;PRmate&quot;, 랜딩페이지 디자인에 대한 권리는 PRmate에 귀속됩니다.
              이용자가 제출한 코드에 대한 권리는 이용자에게 있으며, PRmate는 리뷰 생성 목적 외에 이를 사용하지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">7. 서비스 변경 및 중단</h2>
            <p>
              PRmate는 서비스의 내용을 변경하거나 운영을 일시 중단·종료할 수 있습니다.
              중요한 변경 또는 서비스 종료 시 최소 30일 전에 GitHub Discussions 또는 이메일을 통해 공지합니다.
              단, 불가피한 사정(법적 요구, 보안 위협 등)이 있을 경우 즉시 중단될 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">8. 면책 조항</h2>
            <p>
              PRmate는 다음과 같은 경우에 대해 책임을 지지 않습니다:
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>• AI 리뷰 결과의 오류로 인한 코드 품질 문제 또는 손해</li>
              <li>• GitHub Actions 실행 환경의 문제로 인한 서비스 장애</li>
              <li>• Anthropic API 장애 또는 정책 변경으로 인한 서비스 중단</li>
              <li>• 이용자의 API 키 유출로 인한 피해</li>
              <li>• 베타 서비스 특성상 발생하는 기능 변경, 데이터 손실</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">9. 준거법 및 분쟁 해결</h2>
            <p>
              본 약관은 대한민국 법률에 따라 해석되고 적용됩니다.
              서비스 이용과 관련한 분쟁이 발생할 경우 상호 협의를 통해 해결하며,
              협의가 이루어지지 않을 경우 서울중앙지방법원을 관할 법원으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">10. 문의</h2>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 text-sm">
              <p><strong className="text-gray-200">서비스명</strong>: PRmate</p>
              <p className="mt-1">
                <strong className="text-gray-200">이메일</strong>:{' '}
                <a href="mailto:oceancode0321@gmail.com" className="text-blue-400 hover:underline">
                  oceancode0321@gmail.com
                </a>
              </p>
              <p className="mt-1">
                <strong className="text-gray-200">GitHub</strong>:{' '}
                <a href="https://github.com/prmate/prmate/discussions" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                  github.com/prmate/prmate/discussions
                </a>
              </p>
            </div>
          </section>

        </div>
      </article>

      <footer className="border-t border-gray-900 py-6 px-6 text-center text-gray-600 text-sm">
        © 2026 PRmate ·{' '}
        <a href="/privacy" className="hover:text-gray-400">개인정보 처리방침</a>
        {' '}·{' '}
        <a href="/terms" className="hover:text-gray-400">이용약관</a>
      </footer>
    </main>
  );
}
