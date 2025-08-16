import {useState, useEffect} from 'react';

const BREAKPOINTS = {
    MOBILE: 768,
    TABLET: 1199,
    DESKTOP: 1200
};

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
                if (window.innerWidth >= BREAKPOINTS.DESKTOP && !sessionStorage.getItem('sidebar-manually-collapsed')) {
                    setIsSidebarCollapsed(false);
                }
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        const newCollapsedState = !isSidebarCollapsed;
        setIsSidebarCollapsed(newCollapsedState);

        if (window.innerWidth >= BREAKPOINTS.DESKTOP) {
            if (newCollapsedState) {
                sessionStorage.setItem('sidebar-manually-collapsed', 'true');
            } else {
                sessionStorage.removeItem('sidebar-manually-collapsed');
            }
        }
    };

    return {
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isMobile,
        toggleSidebar
    };
};