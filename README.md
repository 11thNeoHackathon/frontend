# 청춘교환 프론트엔드

가족이 관계별 책에 추억을 쓰고 미션과 감상을 주고받는 React·TypeScript·Vite 프론트엔드입니다.

## 개발 기준

공통 작업 절차는 [AGENTS.md](AGENTS.md)를 따릅니다. 화면에서 사용하는 요청과 응답은 백엔드 Swagger를 기준으로 합니다. 계약이 비어 있으면 필요한 필드를 제안하고, 임시 데이터로 확인한 화면은 연동 점검 시 구분합니다.

## 요청 예시

> 홈에서 보낸 미션의 상태와 상대가 남긴 감상을 확인할 수 있게 해줘.

엄마가 보낸 미션은 자녀가 열어보거나 ‘나중에 하기’를 눌러도 수행 대기로 표시합니다. 자녀가 감상을 제출한 뒤 엄마가 홈을 다시 열면 수행 완료가 표시되고, 항목을 누르면 그 감상이 열립니다. 아빠의 To-do에는 이 미션이 보이지 않아야 합니다. [공통 시연 시나리오 3~5단계](https://github.com/11thNeoHackathon/backend/blob/main/docs/%EC%8B%9C%EC%97%B0%20%EC%8B%9C%EB%82%98%EB%A6%AC%EC%98%A4.md)

## 현재 구현 시나리오

- 홈에서 새 책 추가를 누른다 → 가족 관계를 하나 선택하고 초대 링크를 만든다 → 선택한 가족용 초대 링크 화면과 3초 복사 완료 토스트가 표시된다.
- 가족 선택 화면에서 관계 추가 `+`를 누른다 → 관계를 직접 입력한다 → 등록한 관계가 선택된 가족 카드로 표시되고 초대 링크를 만들 수 있다.
- 초대 링크 복사에 성공하면 완료 안내가, 클립보드 권한 등으로 실패하면 실패 안내가 표시된다.
- 초대 화면에서 완료한 뒤 새 책 만들기를 다시 시작하면 이전 관계가 선택되지 않은 초기 상태로 표시된다.
- 홈의 내 보관함에서 책을 누른다 → 엽서 목록의 추가 버튼을 누른다 → 챕터 이름을 입력해 새 엽서를 목록에 추가한다.

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
