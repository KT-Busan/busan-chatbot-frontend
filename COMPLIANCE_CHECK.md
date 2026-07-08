# 컴플라이언스 점검 결과 (busan-chatbot-frontend)

> K-AI Contents Award Track B(솔루션 부문) 출품 전 진행한 보안/규정 점검 기록. 점검일: 2026-07-08.

## 1. 민감정보 노출 점검

- 현재 코드 트리 및 `git log --all -p`(전체 커밋 히스토리) 전수 검색 결과, API 키 등 하드코딩된 민감정보 **없음**.
- `.env` 파일이 커밋된 이력 **없음**. `.env.example`, `.env.production`에는 백엔드 URL(`VITE_BACKEND_URL=https://busan-chatbot-backend.onrender.com`)만 들어있으며, 이는 공개 API 엔드포인트로 민감정보가 아님.

## 2. `.gitignore` 점검

- `.env`, `node_modules`, `dist` 등이 모두 `.gitignore`에 포함되어 있음을 확인. 추가 조치 불필요.

## 3. 개인정보 최소 수집 원칙

- 사용자 식별은 `src/utils/helpers.js`의 `getAnonymousId()`가 `crypto.randomUUID()`로 생성한 값을 브라우저 `localStorage`에 저장하는 방식만 사용. 이름·전화번호·이메일 등 실명 개인정보를 수집/전송하는 코드 **없음**.

## 4. 의존성 취약점 점검 (npm audit)

- `npm audit` 최초 실행 결과 axios(직접 의존성) 포함 총 15건(high 7, moderate 6, low 2) 발견 → `npm audit fix`로 breaking change 없이 전량 해결, 재점검 시 **"found 0 vulnerabilities"** 확인.
- `package.json`의 버전 범위(`^`)는 변경 없음(`package-lock.json`만 갱신). `npm run build` 정상 완료 확인.

## 5. 남은 확인 필요 사항 (사용자 확인 필요)

- GitHub Actions(`deploy.yml`) 실행 로그에 민감정보가 남아있지 않은지 별도 확인 권장(빌드 시 환경변수를 시크릿으로 주입하지 않고 `.env.production` 파일을 저장소에 커밋해 사용하는 구조이므로, 이 파일에는 절대 실제 API 키를 넣지 말 것 — 현재는 공개 URL만 포함되어 있어 안전함).
