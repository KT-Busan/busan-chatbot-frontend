import {useState, useEffect} from 'react';
import {BREAKPOINTS} from '../utils/constants';

export const useSidebarState = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const newIsMobile = width <= BREAKPOINTS.MOBILE;
            setIsMobile(newIsMobile);

            if (width < BREAKPOINTS.DESKTOP && width > BREAKPOINTS.MOBILE) {
                setIsSidebarCollapsed(true);
            } else if (width >= BREAKPOINTS.DESKTOP) {
                setIsSidebarCollapsed(false);
            }
        };

        handleResize();
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