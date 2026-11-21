# RE Post | 청춘교환

**서로의 청춘에 답장을 보내는 가족 간 추억 교환 서비스**

RE Post는 가족이 서로의 과거를 알아가고, 추억과 감상을 주고받으며 하나의 이야기를 완성하는 웹 서비스입니다.

가족 구성원별로 책을 만들고, 각 책에 챕터를 추가할 수 있습니다. 챕터에 담긴 미션을 수행하고 서로 감상을 남기면, 두 사람의 이야기를 함께 열람할 수 있습니다.

본 저장소는 **RE Post의 프론트엔드**를 담당하며 React, TypeScript, Vite를 기반으로 개발되었습니다.

## 1. 주요 기능

### 가족별 책 생성 및 초대

- 엄마, 아빠, 할머니, 할아버지, 언니 등 가족 관계 선택
- 직접 관계명을 입력하는 사용자 정의 관계 추가
- 선택한 가족을 초대하기 위한 링크 화면 제공
- 초대 링크 복사 및 완료 안내
- 홈 화면에서 가족별 책 확인

### 챕터 관리

- 가족별 책에 속한 챕터 목록 조회 화면
- 챕터별 제목과 진행 상태 표시
- 새로운 챕터 생성 및 목록 추가
- 챕터별 미션 및 열람 상태 구분

### 미션 수행 및 감상 작성

- 홈 화면에서 미션 목록과 진행 상태 확인
- 챕터별 미션 상세 조회
- 미션 수행 후 감상 작성 및 저장
- 저장된 감상 수정
- 상대방의 감상 제출을 기다리는 대기 상태 표시

### 추억 열람

- 양쪽의 이야기가 준비된 챕터 열람
- 챕터 오프닝 화면 제공
- 서로의 이야기와 감상을 순서대로 확인
- 챕터 상태에 따른 열람 가능 여부 제어

## 2. 기술 스택

| 구분 | 기술 |
| --- | --- |
| Language | TypeScript 6 |
| UI Library | React 19 |
| Build Tool | Vite 8 |
| Routing | React Router DOM 7 |
| Styling | CSS, CSS Variables |
| Font | SUIT Variable |
| Code Quality | ESLint |
| Deployment | Vercel |
| Backend Integration | REST API, Fetch API, Cookie-based Session |

## 3. 프로젝트 구조

아래는 실제 저장소에서 확인한 주요 디렉터리 및 파일을 기준으로 정리한 구조입니다.

```text
frontend/
├── src/
│   ├── app/
│   │   └── AppRouter.tsx
│   │
│   ├── components/
│   │   ├── PageHeader.tsx
│   │   └── StatusBar.tsx
│   │
│   ├── features/
│   │   ├── missions/
│   │   │   ├── api.ts
│   │   │   ├── HomeMissions.tsx
│   │   │   ├── MissionDetail.tsx
│   │   │   └── assets/
│   │   │
│   │   └── chapter-reading/
│   │       ├── ChapterReadingFlow.tsx
│   │       └── chapter-reading.css
│   │
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── InvitationScreen.tsx
│   │   ├── RelationshipScreen.tsx
│   │   ├── RelationshipInputScreen.tsx
│   │   ├── ChapterListScreen.tsx
│   │   └── ChapterCreateScreen.tsx
│   │
│   ├── styles/
│   │   └── tokens.css
│   │
│   ├── types/
│   │   ├── invite.ts
│   │   └── chapter.ts
│   │
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
│
├── AGENTS.md
├── README.md
├── package.json
├── vercel.json
└── vite.config.ts
```

### 디렉터리별 역할

| 디렉터리 | 역할 |
| --- | --- |
| `app/` | React Router를 이용한 애플리케이션 라우팅 |
| `components/` | 여러 화면에서 사용하는 공통 UI 컴포넌트 |
| `features/` | 미션, 챕터 열람 등 기능 단위 코드 |
| `screens/` | 홈, 관계 선택, 초대, 챕터 목록 등 화면 컴포넌트 |
| `styles/` | 공통 디자인 토큰 및 스타일 변수 |
| `types/` | 기능별 TypeScript 타입 정의 |

## 4. 화면 및 라우팅 구조

애플리케이션은 `src/main.tsx`에서 `BrowserRouter`를 설정하고, `src/app/AppRouter.tsx`에서 주요 경로를 관리합니다.

| 경로 | 화면 | 설명 |
| --- | --- | --- |
| `/` | `HomeScreen` | 홈, 책장, 미션 및 가족 초대 진입 |
| `/books/:bookId` | `ChapterListScreen` | 선택한 책의 챕터 목록 |
| `/books/:bookId/chapters/new` | `ChapterCreateScreen` | 새로운 챕터 생성 |

홈 화면 내부에서는 `App.tsx`의 상태를 이용해 다음 화면으로 전환합니다.

```text
홈
 ├── 새 책 만들기
 │    ├── 가족 관계 선택
 │    ├── 직접 관계 입력
 │    └── 초대 링크 화면
 │
 ├── 내 책장
 │    └── 챕터 목록
 │         └── 챕터 생성
 │
 └── 미션 목록
      └── 미션 상세
           ├── 감상 작성 및 수정
           └── 챕터 열람
```

챕터 열람 기능은 `ChapterReadingFlow`에서 담당합니다.

## 5. 시작하기

### 사전 요구 사항

- Node.js 및 npm
- Git

### 저장소 클론

```bash
git clone https://github.com/11thNeoHackathon/frontend.git
cd frontend
```

### 의존성 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

개발 서버 실행 후 터미널에 표시되는 로컬 주소로 접속합니다.

### 기타 명령어

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | Vite 개발 서버 실행 |
| `npm run build` | TypeScript 검사 및 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 로컬 미리보기 |
| `npm run lint` | ESLint 검사 |

## 6. 백엔드 API 연동

프론트엔드는 REST API를 통해 챕터 및 미션 데이터를 조회하고 저장합니다.

API 요청 및 응답 형식은 백엔드 Swagger 명세를 기준으로 관리합니다.

### API 요청 예시

```typescript
const response = await fetch('/api/v1/participants/me', {
  credentials: 'include',
})
```

### 세션 인증

- 세션 쿠키를 이용해 사용자를 식별합니다.
- API 요청 시 `credentials: 'include'`를 사용합니다.
- 인증된 세션에서는 참여자 정보를 조회할 수 있습니다.
- 세션이 없는 요청은 `401 SESSION_REQUIRED` 응답을 받을 수 있습니다.

### 배포 환경의 API 연결

Vercel의 `vercel.json`에서 `/api/v1/*` 요청을 백엔드 HTTPS API로 전달하도록 설정되어 있습니다.

프론트엔드에서는 배포 환경에서도 상대 경로를 사용합니다.

```typescript
fetch('/api/v1/chapters/1', {
  credentials: 'include',
})
```

로컬 개발 환경에서 API를 호출할 때는 별도의 프록시 설정 또는 백엔드 접근 환경이 필요할 수 있습니다.

## 7. 주요 사용자 시나리오

### 시나리오 0. 첫 접속

새 브라우저에서 참여자 세션이 없는 상황 → 닉네임을 입력해 등록한다 → 세션 확인 후 홈의 책과 미션을 조회한다. 기존 참여자는 닉네임 입력 없이 홈으로 이동한다.

### 시나리오 1. 가족 초대

```text
홈 화면
  → 새 책 만들기
  → 가족 관계 선택
  → 초대 링크 화면
  → 링크 복사
  → 가족에게 공유
```

### 시나리오 2. 새로운 챕터 만들기

```text
홈 화면
  → 내 책장에서 책 선택
  → 챕터 목록 확인
  → 챕터 추가
  → 챕터 제목 입력
  → 생성된 챕터 확인
```

### 시나리오 3. 미션 수행

```text
홈 화면
  → 도착한 미션 확인
  → 미션 상세 열기
  → 감상 작성
  → 감상 저장
  → 상대방의 감상 대기
```

### 시나리오 4. 서로의 추억 열람

```text
두 사람의 감상 제출 완료
  → 챕터 열람 가능
  → 챕터 오프닝
  → 서로의 이야기 확인
  → 서로의 감상 확인
```

## 8. 개발 협업 규칙

본 프로젝트는 프론트엔드와 백엔드가 공통 사용자 시나리오를 기준으로 기능을 개발합니다.

개발 시 다음 원칙을 따릅니다.

1. 구현할 사용자 시나리오를 먼저 정의합니다.
2. API가 필요한 기능은 Swagger의 요청 및 응답 명세를 확인합니다.
3. 기존 화면 및 기능에 미치는 영향을 확인한 후 구현합니다.
4. 정상 동작과 관련 예외 상황을 검증합니다.
5. Pull Request에 구현 내용과 실제 검증 결과를 기록합니다.

자세한 작업 규칙은 [AGENTS.md](./AGENTS.md)를 참고합니다.

## 9. 관련 저장소

- [Frontend Repository](https://github.com/11thNeoHackathon/frontend)
- [Backend Repository](https://github.com/11thNeoHackathon/backend)
- [공통 시연 시나리오](https://github.com/11thNeoHackathon/backend/blob/main/docs/시연%20시나리오.md)

---

**RE Post — 서로의 청춘에 답장을 보내다.**
