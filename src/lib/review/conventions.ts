import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { Convention } from '../config/schema';

export interface ConventionRuleset {
  name: string;
  description: string;
  rules: string[];
}

// ═══════════════════════════════════════════════════════════════
// 기본 (클린 코드 범용)
// ═══════════════════════════════════════════════════════════════

const DEFAULT_CONVENTION: ConventionRuleset = {
  name: '기본',
  description: '클린 코드 범용 원칙 (Robert C. Martin 기반)',
  rules: [
    '함수는 한 가지 일만 해야 한다 (단일 책임 원칙).',
    '함수 길이는 50줄 이하를 권장한다.',
    '변수명은 의도를 명확히 드러내야 한다.',
    '매직 넘버 사용을 금지하고 상수로 추출한다.',
    '중복 코드를 제거하고 재사용을 추구한다 (DRY 원칙).',
    '깊은 중첩(4단계 이상)을 피한다.',
    '함수 인자는 3개 이하를 권장한다.',
    '사이드 이펙트를 최소화하고 순수 함수를 지향한다.',
    '예외 처리를 명시적으로 구현한다.',
    '테스트 가능한 코드를 작성한다.',
  ],
};

// ═══════════════════════════════════════════════════════════════
// 우아한형제들 (techblog.woowahan.com)
// ═══════════════════════════════════════════════════════════════

const WOOWA_CONVENTION: ConventionRuleset = {
  name: '우아한형제들',
  description: '우아한형제들 Java/Kotlin 코딩 가이드',
  rules: [
    '클래스는 PascalCase, 메서드/변수는 camelCase, 상수는 UPPER_SNAKE_CASE.',
    '패키지 구조는 계층형 아키텍처 (controller, service, repository, domain).',
    'public 메서드에 JavaDoc 작성을 권장한다.',
    'Optional 반환형을 적극 활용하여 null을 지양한다.',
    '한국어 주석을 권장한다 (도메인 용어 명확히).',
    '메서드 길이는 15줄 이하를 권장한다.',
    '인터페이스는 구현체와 명확히 분리한다 (Impl 접미사 금지).',
    'Stream API 사용 시 가독성을 우선한다 (복잡하면 for-loop 사용).',
    '생성자 주입을 기본으로 사용한다 (필드 주입 지양).',
    'Entity에는 setter 대신 의미 있는 변경 메서드를 사용한다.',
    'Lombok @Data 지양, 필요한 어노테이션만 선택.',
    '테스트는 Given-When-Then 구조로 작성한다.',
  ],
};

// ═══════════════════════════════════════════════════════════════
// 카카오 (tech.kakao.com)
// ═══════════════════════════════════════════════════════════════

const KAKAO_CONVENTION: ConventionRuleset = {
  name: '카카오',
  description: '카카오 Java/Kotlin 코딩 컨벤션',
  rules: [
    '들여쓰기는 4 spaces, 탭 금지.',
    '중괄호는 K&R 스타일 (같은 줄).',
    '한 줄은 최대 120자.',
    '인터페이스 이름에 I 접두사 금지.',
    'var 남용 지양, 명시적 타입 선언 권장 (Kotlin은 제외).',
    '클래스는 단일 책임 원칙(SRP) 준수.',
    '불필요한 주석 지양 — 코드 자체가 문서가 되어야 한다.',
    '빈 줄로 관련 코드 블록 구분.',
    'null 반환 금지 — Optional, 빈 컬렉션, 또는 예외 던지기.',
    '예외는 명시적으로 처리 (swallow 금지).',
    'Kotlin에선 data class 적극 활용.',
    'Coroutine 사용 시 scope 관리 명확히.',
  ],
};

// ═══════════════════════════════════════════════════════════════
// 네이버 (NAVER Hackday Java 코딩 컨벤션)
// ═══════════════════════════════════════════════════════════════

const NAVER_CONVENTION: ConventionRuleset = {
  name: '네이버',
  description: '네이버 Java 코딩 컨벤션 (NAVER Hackday 기반)',
  rules: [
    '들여쓰기 4 spaces.',
    '한 줄 최대 120자.',
    '후행 공백(trailing whitespace) 금지.',
    '@Override 어노테이션 필수.',
    '블록 중첩 최대 4단계.',
    'PascalCase/camelCase 엄격 적용.',
    'import 와일드카드(*) 금지.',
    '한 파일에 하나의 top-level 클래스만.',
    '삼항 연산자는 단순한 경우에만.',
    'switch 문에 default 절 필수.',
    'public 필드 금지 — getter/setter 사용.',
    '익명 클래스보다 람다 식 선호.',
  ],
};

// ═══════════════════════════════════════════════════════════════
// SK (SK C&C / SKT)
// ═══════════════════════════════════════════════════════════════

const SK_CONVENTION: ConventionRuleset = {
  name: 'SK',
  description: 'SK/SKT Java 코딩 가이드',
  rules: [
    '들여쓰기 4 spaces, UTF-8 인코딩.',
    '클래스는 PascalCase, 메서드/변수는 camelCase, 상수는 UPPER_SNAKE_CASE.',
    '파일 최대 1000줄, 메서드 최대 50줄 권장.',
    '주석은 Why를 설명 (What은 코드로 충분).',
    '@Deprecated 사용 시 사유와 대체 API 명시.',
    'Spring 서비스는 인터페이스 + 구현체 분리 권장.',
    'Lombok 사용 시 @Getter/@Setter 대신 명시적 접근자 선호.',
    '의존성 주입은 생성자 주입 필수.',
    '로깅은 SLF4J 사용, 적절한 레벨(ERROR/WARN/INFO/DEBUG) 구분.',
    'API 응답은 일관된 형식 (code, message, data).',
    '날짜/시간은 java.time 패키지 (java.util.Date 금지).',
    '단위 테스트 커버리지 70% 이상 목표.',
  ],
};

// ═══════════════════════════════════════════════════════════════
// LG CNS
// ═══════════════════════════════════════════════════════════════

const LG_CONVENTION: ConventionRuleset = {
  name: 'LG',
  description: 'LG CNS Java 엔지니어링 가이드',
  rules: [
    '들여쓰기 4 spaces.',
    '클래스 이름은 명사/명사구, 메서드 이름은 동사/동사구.',
    '상수는 static final UPPER_SNAKE_CASE.',
    '접근 제어자는 가장 제한적 수준 (private 우선).',
    'public API는 명확한 JavaDoc 필수.',
    '예외 클래스 이름은 Exception으로 끝남 (e.g., UserNotFoundException).',
    'Checked Exception 남용 지양.',
    'final 키워드 적극 활용 (불변성 보장).',
    'equals/hashCode 오버라이드 시 둘 다 구현.',
    '비즈니스 로직에 한국어 변수명 금지 (도메인 용어는 영문).',
    '민감정보(비밀번호, 토큰)는 로그에 남기지 않음.',
    'Test 클래스는 테스트 대상 클래스명 + "Test" 접미사.',
  ],
};

// ═══════════════════════════════════════════════════════════════
// NHN / NHN Cloud
// ═══════════════════════════════════════════════════════════════

const NHN_CONVENTION: ConventionRuleset = {
  name: 'NHN',
  description: 'NHN/NHN Cloud Java 코딩 컨벤션',
  rules: [
    '들여쓰기 4 spaces.',
    '한 줄 최대 120자.',
    '클래스/인터페이스: PascalCase, 메서드/변수: camelCase, 상수: UPPER_SNAKE_CASE.',
    '패키지명은 모두 소문자.',
    '메서드 길이는 30줄 이하 권장.',
    '중괄호 필수 (한 줄 if도 중괄호).',
    '예외를 무시하는 빈 catch 블록 금지.',
    '정적 분석 도구(SonarQube, SpotBugs) 경고 zero 목표.',
    '스레드 안전성 주의 — 공유 가변 상태 최소화.',
    'CHECKSTYLE 설정 준수.',
    'REST API는 일관된 URL 규칙 (명사 복수형).',
    '로그 메시지는 구조화된 형태 (key=value) 선호.',
  ],
};

// ═══════════════════════════════════════════════════════════════
// 쿠팡 (medium.com/coupang-engineering)
// ═══════════════════════════════════════════════════════════════

const COUPANG_CONVENTION: ConventionRuleset = {
  name: '쿠팡',
  description: '쿠팡(Coupang) 엔지니어링 가이드',
  rules: [
    '영어 명명 원칙 (한글 변수명 절대 금지).',
    '메서드 이름은 행동 명시 (verb + noun: getUserById, fetchOrderList).',
    '클래스는 단일 책임, 인터페이스는 분리 원칙 (ISP).',
    'Null-safety 철저 — Optional 또는 @Nullable/@NotNull 명시.',
    '검증은 Bean Validation (@Valid, @NotNull, @Size) 활용.',
    '트랜잭션 범위 최소화 (@Transactional 범위 좁게).',
    'DB 쿼리 N+1 문제 주의 (fetch join 또는 batch size 설정).',
    '외부 API 호출은 타임아웃/재시도/회로차단기 필수 (Resilience4j).',
    '글로벌 변수 및 상태 금지.',
    'Logger는 클래스별로 @Slf4j 또는 LoggerFactory.getLogger(Class.class).',
    '비동기 처리는 CompletableFuture 또는 Reactive (Reactor).',
    '테스트는 Mock 남용 금지 — 통합 테스트도 균형있게.',
  ],
};

// ═══════════════════════════════════════════════════════════════
// LINE (engineering.linecorp.com)
// ═══════════════════════════════════════════════════════════════

const LINE_CONVENTION: ConventionRuleset = {
  name: 'LINE',
  description: 'LINE 엔지니어링 멀티언어 가이드',
  rules: [
    '코드는 글로벌 개발자가 이해할 수 있도록 영어로 작성.',
    '언어별 공식 스타일 가이드 우선 (Google Java Style, PEP 8, rustfmt 등).',
    'Public API는 하위 호환성 유지 — Breaking change 시 deprecation 기간 필수.',
    'i18n/l10n 고려 — 하드코딩된 문자열 금지.',
    '로그는 구조화된 JSON 형태 권장.',
    '의존성은 최신 안정 버전, 보안 패치 신속 반영.',
    'Microservice 간 통신은 gRPC 또는 명확한 REST 규약.',
    'Cache 전략 명시 (TTL, invalidation).',
    '시간대는 UTC 기본, 클라이언트 표시 시에만 로컬 변환.',
    'Feature flag로 점진적 롤아웃.',
    '모니터링/메트릭 필수 (Prometheus 등).',
    '민감정보 암호화 및 접근 감사 로그.',
  ],
};

// ═══════════════════════════════════════════════════════════════
// 토스 (toss.tech, Slash 컨퍼런스)
// ═══════════════════════════════════════════════════════════════

const TOSS_CONVENTION: ConventionRuleset = {
  name: '토스',
  description: '토스(Toss) TypeScript/React 프론트엔드 가이드',
  rules: [
    'TypeScript strict mode 필수.',
    'any 타입 금지 — unknown 후 narrowing.',
    '컴포넌트는 Named Export 선호 (default export 지양).',
    'Props 인터페이스는 컴포넌트명 + "Props" 접미사.',
    'React.FC 사용 지양 — function declaration 또는 const.',
    '상태는 최소로 — 파생 가능하면 계산.',
    '비동기는 React Query / SWR 등 데이터 페칭 라이브러리 활용.',
    '훅은 use 접두사 + camelCase.',
    '유틸 함수는 순수 함수 (pure function)로.',
    '매직 스트링 대신 as const union 타입.',
    'CSS-in-JS는 팀 규칙에 따라 (Emotion/Styled / Linaria).',
    '접근성(a11y) 속성 필수 — aria-label, role 등.',
    '에러 바운더리로 UI 붕괴 방지.',
    '비용 관련(결제, 송금) 코드는 추가 검증 계층 필수.',
  ],
};

// ═══════════════════════════════════════════════════════════════
// 프리셋 맵
// ═══════════════════════════════════════════════════════════════

const PRESETS: Record<Exclude<Convention, 'custom'>, ConventionRuleset> = {
  default: DEFAULT_CONVENTION,
  woowa: WOOWA_CONVENTION,
  kakao: KAKAO_CONVENTION,
  naver: NAVER_CONVENTION,
  sk: SK_CONVENTION,
  lg: LG_CONVENTION,
  nhn: NHN_CONVENTION,
  coupang: COUPANG_CONVENTION,
  line: LINE_CONVENTION,
  toss: TOSS_CONVENTION,
};

// ═══════════════════════════════════════════════════════════════
// 커스텀 컨벤션 로더 (Week 3-7)
// ═══════════════════════════════════════════════════════════════

export function loadCustomConvention(filePath: string): ConventionRuleset {
  const workspace = process.env.GITHUB_WORKSPACE ?? process.cwd();
  const fullPath = resolve(workspace, filePath);

  if (!existsSync(fullPath)) {
    console.warn(`[PRmate] 커스텀 컨벤션 파일 없음: ${fullPath} → 기본 사용`);
    return DEFAULT_CONVENTION;
  }

  try {
    const content = readFileSync(fullPath, 'utf-8');
    return {
      name: '팀 커스텀',
      description: `팀 자체 컨벤션 (${filePath})`,
      rules: [content],
    };
  } catch (err) {
    console.warn(
      `[PRmate] 커스텀 컨벤션 로드 실패: ${
        err instanceof Error ? err.message : err
      } → 기본 사용`
    );
    return DEFAULT_CONVENTION;
  }
}

// ═══════════════════════════════════════════════════════════════
// 공개 API
// ═══════════════════════════════════════════════════════════════

export function getConventionRuleset(
  convention: Convention,
  customFile?: string
): ConventionRuleset {
  if (convention === 'custom') {
    if (!customFile) {
      console.warn(
        '[PRmate] convention: custom 선택되었으나 convention_file 미지정 → 기본 사용'
      );
      return DEFAULT_CONVENTION;
    }
    return loadCustomConvention(customFile);
  }
  return PRESETS[convention] ?? DEFAULT_CONVENTION;
}

export function formatConventionForPrompt(ruleset: ConventionRuleset): string {
  if (ruleset.name === '팀 커스텀') {
    return `### ${ruleset.name} 컨벤션\n\n${ruleset.rules[0]}`;
  }
  const rules = ruleset.rules.map((r, i) => `${i + 1}. ${r}`).join('\n');
  return `### ${ruleset.name} 코딩 컨벤션\n\n${rules}`;
}

export function listConventions(): string[] {
  return Object.keys(PRESETS).concat(['custom']);
}
