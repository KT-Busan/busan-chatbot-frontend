// 익명 사용자 ID 생성 및 관리 함수
export const getAnonymousId = () => {
    let anonymousId = localStorage.getItem('anonymousId');
    if (!anonymousId) {
        anonymousId = `user_${crypto.randomUUID()}`;
        localStorage.setItem('anonymousId', anonymousId);
    }
    return anonymousId;
};

// 채팅 ID 생성 함수 (타임스탬프 기반)
export const generateChatId = () => `chat_${Date.now()}`;

// 환경에 따른 백엔드 URL 동적 설정 함수
export const getBackendUrl = () => {
    // 🚀 개발 중에는 이 줄 사용 (로컬 백엔드 연결)
    // return 'http://localhost:5001';

    // 🌐 프로덕션 배포 시에는 위 줄을 주석처리하고 아래 코드 사용
    const hostname = window.location.hostname;
    console.log(`🔍 현재 호스트: ${hostname}`);

    // 로컬 환경 감지 (개발용)
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        console.log('🏠 로컬 개발 환경');
        return 'http://localhost:5001';
    }

    // 프로덕션 환경 (배포용)
    console.log('🌐 프로덕션 환경');
    return 'https://b-bot-backend.onrender.com';
};

// 텍스트에서 마커([MARKER_NAME])를 제거하는 함수
export const removeMarker = (text) => {
    return text.replace(/\[[\w_]+\]/g, '');
};

// 디바이스 타입 감지
export const isMobileDevice = () => {
    return window.innerWidth <= 768;
};

// 사이드바 표시 여부 결정
export const getSidebarVisibility = (isMobile, isCollapsed) => {
    return isMobile ? !isCollapsed : true;
};

// CSS 클래스 조건부 결합
export const classNames = (...classes) => {
    return classes.filter(Boolean).join(' ');
};

// 메시지 타이틀 생성 (첫 메시지 기준)
export const generateChatTitle = (message, maxLength = 30) => {
    if (!message) return '새로운 대화';
    return message.length > maxLength
        ? message.substring(0, maxLength) + '...'
        : message;
};

// 채팅 정렬 (최신순)
export const sortChatsByLatest = (chats) => {
    return Object.entries(chats).sort((a, b) => {
        const timeA = parseInt(a[0].split('_')[1]) || 0;
        const timeB = parseInt(b[0].split('_')[1]) || 0;
        return timeB - timeA;
    });
};

// 로컬스토리지 안전 접근
export const safeLocalStorage = {
    getItem: (key) => {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.warn('LocalStorage getItem failed:', error);
            return null;
        }
    },
    setItem: (key, value) => {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.warn('LocalStorage setItem failed:', error);
        }
    },
    removeItem: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.warn('LocalStorage removeItem failed:', error);
        }
    }
};