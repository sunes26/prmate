import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보 처리방침',
  description: 'PRmate 개인정보 처리방침',
};

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold mb-2">개인정보 처리방침</h1>
        <p className="text-gray-500 text-sm mb-12">최종 수정일: 2026년 4월 17일</p>

        <div className="space-y-10 text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">1. 개요</h2>
            <p>
              PRmate(이하 &quot;서비스&quot;)는 GitHub Pull Request에 대한 한국어 AI 코드 리뷰를 제공합니다.
              본 방침은 서비스 이용 과정에서 수집·처리되는 정보의 범위와 방법을 설명합니다.
            </p>
            <p className="mt-3">
              PRmate는 <strong className="text-white">BYOK(Bring Your Own Key)</strong> 방식으로 동작합니다.
              사용자가 직접 Anthropic API 키를 제공하며, PRmate는 해당 키를 서버에 저장하지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">2. 수집하는 정보</h2>
            <div className="space-y-4">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
                <h3 className="font-semibold text-gray-200 mb-2">수집하지 않는 정보</h3>
                <ul className="space-y-1 text-sm">
                  <li>• 소스 코드 원문 (PR diff는 메모리에서 처리 후 즉시 삭제)</li>
                  <li>• Anthropic API 키 (GitHub Secrets에 저장, PRmate 서버 미경유)</li>
                  <li>• GitHub 개인 액세스 토큰 (워크플로우 실행 중에만 사용, 저장 없음)</li>
                  <li>• PR 내용, 코드 리뷰 결과</li>
                </ul>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
                <h3 className="font-semibold text-gray-200 mb-2">수집하는 정보</h3>
                <ul className="space-y-1 text-sm">
                  <li>• <strong className="text-gray-200">서비스 이용 통계</strong>: Vercel Analytics를 통해 랜딩페이지 방문 수, 페이지뷰 등 집계 데이터 (개인 식별 불가)</li>
                  <li>• <strong className="text-gray-200">문의 이메일</strong>: 사용자가 직접 연락할 경우에 한해 이메일 주소 및 문의 내용</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">3. GitHub Actions 실행 환경</h2>
            <p>
              PRmate는 GitHub Actions 워크플로우로 실행됩니다. 실행 과정에서:
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>• PR diff는 GitHub API를 통해 워크플로우 실행 환경(GitHub의 서버)에서 메모리로 읽혀 처리됩니다.</li>
              <li>• 처리된 diff는 Anthropic API로 전송되며, Anthropic의 Zero Data Retention 정책에 따라 저장되지 않습니다.</li>
              <li>• PRmate 자체 서버는 존재하지 않으며, 모든 처리는 GitHub Actions 워크플로우 내에서 완결됩니다.</li>
              <li>• 전체 레포지토리에는 접근하지 않으며, 변경된 파일의 diff만 추출합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">4. 제3자 서비스</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-gray-500 shrink-0 mt-0.5">•</span>
                <div>
                  <strong className="text-gray-200">Anthropic API</strong>: PR diff가 리뷰 생성을 위해 전송됩니다.
                  Anthropic의 <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">개인정보 처리방침</a> 및 API Zero Data Retention 정책이 적용됩니다.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gray-500 shrink-0 mt-0.5">•</span>
                <div>
                  <strong className="text-gray-200">GitHub</strong>: PR 정보 조회 및 코멘트 게시에 GitHub API를 사용합니다.
                  GitHub의 <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">개인정보 처리방침</a>이 적용됩니다.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gray-500 shrink-0 mt-0.5">•</span>
                <div>
                  <strong className="text-gray-200">Vercel Analytics</strong>: 랜딩페이지 방문 통계 수집에 사용됩니다.
                  개인 식별 정보 없이 집계 데이터만 수집됩니다.
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">5. 정보 보유 기간</h2>
            <p>
              PRmate는 사용자의 소스 코드, PR 내용, 리뷰 결과를 보유하지 않습니다.
              문의 이메일의 경우 문의 처리 완료 후 1년 이내 삭제합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">6. 쿠키 및 트래킹</h2>
            <p>
              PRmate 랜딩페이지는 서비스 개선 목적의 익명 방문 통계 수집에 Vercel Analytics를 사용합니다.
              개인을 식별하는 쿠키는 사용하지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">7. 이용자의 권리</h2>
            <p>이용자는 다음 권리를 행사할 수 있습니다:</p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>• 수집된 개인정보의 열람 요청</li>
              <li>• 개인정보 수정 또는 삭제 요청</li>
              <li>• 개인정보 처리 정지 요청</li>
            </ul>
            <p className="mt-3 text-sm">
              권리 행사는 아래 문의처로 연락해 주세요. 요청 접수 후 10영업일 이내 처리합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">8. 개인정보 보호책임자</h2>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 text-sm">
              <p><strong className="text-gray-200">서비스명</strong>: PRmate</p>
              <p className="mt-1"><strong className="text-gray-200">이메일</strong>: <a href="mailto:oceancode0321@gmail.com" className="text-blue-400 hover:underline">oceancode0321@gmail.com</a></p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">9. 방침 변경</h2>
            <p>
              본 방침은 법령 변경 또는 서비스 변경에 따라 업데이트될 수 있습니다.
              변경 시 본 페이지 상단의 &quot;최종 수정일&quot;을 갱신하며, 중요한 변경의 경우 GitHub Discussions를 통해 공지합니다.
            </p>
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
