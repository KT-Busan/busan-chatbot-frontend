# B-BOT - 부산 청년 지원 챗봇 (Frontend)

부산시 청년들을 위한 정책 및 일자리 정보 제공 챗봇 'B-BOT'의 프론트엔드 프로젝트입니다. 사용자가 챗봇과 실시간으로 대화할 수 있는 반응형 웹 인터페이스를 제공합니다.

---

## 주요 기능 (Features)

- **실시간 채팅 인터페이스**: 사용자와 챗봇 간의 메시지를 실시간으로 주고받는 UI
- **영구적인 대화 기록**: 익명 ID를 기반으로 각 사용자의 대화 내용을 서버 DB에 저장 및 조회
- **동적인 초기 화면**: 첫 방문 시에는 환영 메시지와 메뉴를, 대화 중에는 채팅 내역을 표시
- **사전 정의 메뉴**: 자주 묻는 질문과 주요 기능을 버튼으로 제공하여 빠른 접근성 확보
- **반응형 사이드바**: 화면 비율과 너비에 따라 자동으로 접고 펴지는 사이드바
- **직관적인 UX**: 카카오톡 스타일의 메시지 말풍선, 삭제 확인 기능 등 사용자 편의 기능
- **마크다운 렌더링**: 굵은 글씨, 목록, 하이퍼링크 등 챗봇의 답변을 서식 있는 텍스트로 표시

---

## 기술 스택 (Tech Stack)

- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: CSS3 (Flexbox, Grid, Media Queries)
- **API Client**: Axios
- **Markdown Renderer**: `react-markdown`

---

## 시작하기 (Getting Started)

로컬 환경에서 이 프로젝트를 설정하고 실행하는 방법입니다.

### 1. 전제 조건 (Prerequisites)

- Node.js 18.x 이상
- npm 또는 yarn
- Git

### 2. 설치 및 실행 (Installation & Running)

1. **레포지토리 클론:**
   ```bash
   git clone <YOUR_REPOSITORY_URL>
   cd busan-chatbot-frontend
   ```

2. **의존성 패키지 설치:**
   ```bash
   npm install
   ```

3. **개발 서버 실행:**
   > **중요:** 실행 전에 반드시 백엔드 서버가 먼저 켜져 있어야 합니다.
   ```bash
   npm run dev
   ```

- 애플리케이션은 `http://localhost:5173` 에서 실행됩니다.

---

## 폴더 구조 (Folder Structure)

src/
├── assets/ # 이미지 파일 (챗봇 프로필 등)
├── components/ # 재사용 가능한 UI 컴포넌트
│ ├── ChatInput.jsx
│ ├── ChatWindow.jsx
│ └── Sidebar.jsx
├── App.css # 전역 스타일시트
└── App.jsx # 메인 애플리케이션 컴포넌트 (상태 관리)
