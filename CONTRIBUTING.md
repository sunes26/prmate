# PRmate 기여 가이드

감사합니다! PRmate는 오픈소스입니다. 기여를 환영합니다.

## 기여 방법

### 🐛 버그 제보
[Issues](https://github.com/sunes26/prmate/issues)에 다음 정보 포함:
- 재현 단계
- 예상 동작 vs 실제 동작
- GitHub Actions 로그 (민감 정보 제거 필수)
- `.prmate.yml` 설정 (있다면)

### 💡 기능 제안
[Discussions](https://github.com/sunes26/prmate/discussions)에서 먼저 논의

### 🔧 코드 기여

#### 1. 레포 Fork → Clone
```bash
git clone https://github.com/<your-username>/prmate.git
cd prmate
```

#### 2. 의존성 설치
```bash
npm install
```

#### 3. 개발 & 테스트
```bash
npm test              # Jest 테스트 실행
npm run build:action  # Action 번들 빌드
```

#### 4. PR 열기
- 브랜치명: `feat/xxx`, `fix/xxx`, `docs/xxx`
- 커밋 메시지: Conventional Commits 형식
  - `feat: 새 컨벤션 추가 (카카오뱅크)`
  - `fix: 타임아웃 30초 문제 해결`
  - `docs: README 설치 예시 수정`
- 테스트 추가/업데이트

## 개발 환경

- Node.js 20+
- npm 10+
- Anthropic API 키 (테스트용)

### 로컬 테스트
```bash
# 환경 변수 설정
export ANTHROPIC_API_KEY=sk-ant-...
export GITHUB_TOKEN=ghp_...
export GITHUB_REPOSITORY=owner/repo
export PR_NUMBER=1

# 실행
npx tsx scripts/review.mts
```

## 새 컨벤션 추가하기

1. `src/lib/review/conventions.ts`에 `XXX_CONVENTION` 추가
2. `src/lib/config/schema.ts`의 `Convention` 타입에 추가
3. `VALID_CONVENTIONS`에 추가
4. 테스트 추가: `src/__tests__/conventions.test.ts`
5. README.md 컨벤션 표에 추가
6. PR 생성

## 코딩 스타일

- TypeScript strict mode
- 함수 50줄 이하 권장
- 한국어 주석 OK
- Prettier 자동 포맷 (`npm run format`)

## 리뷰 프로세스

1. 자동 테스트 통과
2. PRmate 자체 리뷰 (자기 자신 리뷰 가능!)
3. 메인테이너 수동 리뷰
4. 머지

## 라이선스

기여하신 코드는 MIT 라이선스로 배포됩니다.
