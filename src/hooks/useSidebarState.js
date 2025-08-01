import {useState, useEffect} from 'react';
import {BREAKPOINTS} from '../utils/constants';

// 사이드바 상태 관리 커스텀 훅 (반응형 처리 포함)
export const useSidebarState = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // 윈도우 크기 변경 감지 및 반응형 처리
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const newIsMobile = width <= BREAKPOINTS.MOBILE;
            setIsMobile(newIsMobile);

            // PC에서 1200px 미만이면 사이드바 자동 접기
            if (width < BREAKPOINTS.DESKTOP && width > BREAKPOINTS.MOBILE) {
                setIsSidebarCollapsed(true);
            } else if (width >= BREAKPOINTS.DESKTOP) {
                setIsSidebarCollapsed(false);
            }
        };

        handleResize(); // 초기 실행
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    return {
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isMobile,
        toggleSidebar
    };
};