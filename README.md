# B-BOT - 부산 청년 지원 챗봇 (Frontend)

부산시 청년들을 위한 공간 정보 및 프로그램 제공 챗봇 'B-BOT'의 프론트엔드 프로젝트입니다. 사용자가 챗봇과 실시간으로 대화할 수 있는 반응형 웹 인터페이스를 제공합니다.

---

## 주요 기능 (Features)

### 🤖 **채팅 시스템**

- **실시간 채팅 인터페이스**: 사용자와 챗봇 간의 메시지를 실시간으로 주고받는 UI
- **영구적인 대화 기록**: 익명 ID를 기반으로 각 사용자의 대화 내용을 서버 DB에 저장 및 조회
- **다중 채팅 세션**: 여러 대화를 동시에 관리하고 전환 가능
- **마크다운 렌더링**: 굵은 글씨, 목록, 하이퍼링크 등 챗봇의 답변을 서식 있는 텍스트로 표시

### 🗺️ **부산 청년공간 지도**

- **인터랙티브 지도**: 부산 16개 구/군별 청년공간 위치 시각화
- **지역별 필터링**: 특정 지역 클릭 시 해당 지역 청년공간 정보 제공
- **실시간 데이터 연동**: 백엔드에서 가져온 청년공간 데이터를 지도에 실시간 반영

### 🎨 **사용자 경험**

- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 화면 크기에 최적화
- **다크모드 지원**: 라이트/다크 테마 전환 기능
- **동적 사이드바**: 화면 크기에 따라 자동으로 접고 펴지는 사이드바
- **직관적한 UX**: 카카오톡 스타일의 메시지 말풍선, 삭제 확인 기능 등

### ⚡ **성능 최적화**

- **컴포넌트 기반 아키텍처**: 재사용 가능한 작은 컴포넌트들로 구성
- **커스텀 훅**: 상태 관리 로직의 재사용성 극대화
- **CSS 모듈화**: 기능별로 분리된 스타일시트로 유지보수성 향상

---

## 기술 스택 (Tech Stack)

- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: CSS3 (CSS Variables, Flexbox, Grid, Media Queries)
- **API Client**: Axios
- **Markdown Renderer**: `react-markdown`
- **State Management**: React Hooks (useState, useEffect, Custom Hooks)

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

```
src/
├── assets/                     # 정적 리소스
│   └── bot-profile.png        # 봇 프로필 이미지
│
├── components/                 # UI 컴포넌트
│   ├── chat/                  # 채팅 관련 컴포넌트
│   │   ├── ChatInput.jsx      # 메시지 입력 컴포넌트
│   │   ├── ChatWindow.jsx     # 메인 채팅 창
│   │   ├── MessageBubble.jsx  # 개별 메시지 말풍선
│   │   ├── ThinkingIndicator.jsx # 봇 응답 대기 표시
│   │   └── WelcomeScreen.jsx  # 첫 방문자 환영 화면
│   │
│   ├── sidebar/               # 사이드바 관련 컴포넌트
│   │   ├── Sidebar.jsx        # 메인 사이드바
│   │   └── ChatHistoryItem.jsx # 채팅 기록 아이템
│   │
│   ├── map/                   # 지도 관련 컴포넌트
│   │   ├── BusanMap.jsx       # 부산 지도 컴포넌트
│   │   └── RegionButtons.jsx  # 지역 선택 버튼들
│   │
│   └── ui/                    # 공통 UI 컴포넌트
│       ├── CustomMarkdown.jsx # 마크다운 렌더러
│       ├── MainMenuButtons.jsx # 메인 메뉴 버튼들
│       └── QuickLinks.jsx     # 외부 링크 버튼들
│
├── hooks/                     # 커스텀 훅
│   ├── useDarkMode.js         # 다크모드 상태 관리
│   └── useSidebarState.js     # 사이드바 상태 관리
│
├── styles/                    # 스타일시트
│   ├── variables.css          # CSS 변수 (다크모드, 색상 등)
│   ├── globals.css            # 전역 스타일
│   ├── responsive.css         # 반응형 미디어 쿼리
│   └── components/            # 컴포넌트별 스타일
│       ├── chat.css          # 채팅 관련 스타일
│       ├── sidebar.css       # 사이드바 스타일
│       ├── ui.css            # UI 컴포넌트 스타일
│       └── map.css           # 지도 컴포넌트 스타일
│
├── utils/                     # 유틸리티 함수
│   ├── constants.js           # 상수 정의 (메뉴, 지역 데이터 등)
│   └── helpers.js             # 헬퍼 함수들
│
└── App.jsx                    # 메인 애플리케이션 컴포넌트
```

---

## 주요 컴포넌트 설명 (Component Overview)

### 📱 **App.jsx**

- 애플리케이션의 최상위 컴포넌트
- 전역 상태 관리 (채팅 목록, 활성 채팅, 사용자 설정)
- 백엔드 API 통신 처리

### 💬 **ChatWindow**

- 메인 채팅 인터페이스
- 메시지 목록 렌더링 및 스크롤 관리
- 메뉴 버튼 및 입력 컴포넌트 포함

### 📋 **Sidebar**

- 채팅 세션 목록 관리
- 새 채팅 생성 및 기존 채팅 삭제
- 다크모드 토글 버튼

### 🗺️ **BusanMap**

- 부산시 청년공간 지도 시각화
- SVG 기반 인터랙티브 지도
- 지역별 클릭 이벤트 처리

---

## 개발 가이드 (Development Guide)

### 🎨 **스타일링 시스템**

- CSS Variables를 활용한 일관된 디자인 시스템
- 다크모드 자동 전환을 위한 테마 변수 관리
- 모바일 우선 반응형 디자인

### 🔧 **상태 관리**

- React Hooks 기반 상태 관리
- 커스텀 훅을 통한 로직 재사용
- localStorage를 활용한 사용자 설정 영속화

### 📦 **컴포넌트 설계 원칙**

- 단일 책임 원칙 (Single Responsibility)
- 재사용 가능한 작은 컴포넌트들
- Props를 통한 느슨한 결합

---

## 배포 (Deployment)

### 프로덕션 빌드

```bash
npm run build
```

### 미리보기

```bash
npm run preview
```

---

## 기여하기 (Contributing)

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 라이선스 (License)

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

---

## 연락처 (Contact)

프로젝트 관련 문의사항이 있으시면 언제든지 연락해주세요.

**Project Link**: [GitHub Repository URL]