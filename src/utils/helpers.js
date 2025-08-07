// 익명 사용자 ID 생성 및 관리 함수
export const getAnonymousId = () => {
    let anonymousId = localStorage.getItem('anonymousId');
    if (!anonymousId) {
        anonymousId = `user_${crypto.randomUUID()}`;
        localStorage.setItem('anonymousId', anonymousId);
    }
    return anonymousId;
};

export const generateChatId = () => `chat_${Date.now()}`;

// 🔥 수정: GitHub Pages에서 올바른 백엔드 URL 사용
export const getBackendUrl = () => {
    const hostname = window.location.hostname;
    console.log(`🔍 현재 호스트: ${hostname}`);

    // GitHub Pages 또는 배포 환경에서는 항상 Render 백엔드 사용
    if (hostname.includes('github.io') || hostname.includes('kt-busan.github.io')) {
        console.log('🌐 GitHub Pages - Render 백엔드 사용');
        return 'https://b-bot-backend.onrender.com';
    }

    // 로컬 개발 환경
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        console.log('🏠 로컬 개발 환경');
        return 'http://localhost:5001';
    }

    // 기본값: 프로덕션 백엔드
    console.log('🌐 기본 프로덕션 환경');
    return 'https://b-bot-backend.onrender.com';
};

export const removeMarker = (text) => {
    return text.replace(/\[[\w_]+\]/g, '');
};

export const isMobileDevice = () => {
    return window.innerWidth <= 768;
};

export const getSidebarVisibility = (isMobile, isCollapsed) => {
    return isMobile ? !isCollapsed : true;
};

export const classNames = (...classes) => {
    return classes.filter(Boolean).join(' ');
};

export const generateChatTitle = (message, maxLength = 30) => {
    if (!message) return '새로운 대화';
    return message.length > maxLength
        ? message.substring(0, maxLength) + '...'
        : message;
};

export const sortChatsByLatest = (chats) => {
    return Object.entries(chats).sort((a, b) => {
        const timeA = parseInt(a[0].split('_')[1]) || 0;
        const timeB = parseInt(b[0].split('_')[1]) || 0;
        return timeB - timeA;
    });
};

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