import {useState, useEffect} from 'react';
import {safeLocalStorage} from '../utils/helpers';

// 다크모드 상태 관리
export const useDarkMode = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = safeLocalStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        safeLocalStorage.setItem('darkMode', JSON.stringify(isDarkMode));

        if (isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }, [isDarkMode]);

    return [isDarkMode, setIsDarkMode];
};