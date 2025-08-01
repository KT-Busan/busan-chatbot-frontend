import {useState, useEffect} from 'react';
import {safeLocalStorage} from '../utils/helpers';

// 다크모드 상태 관리 커스텀 훅
export const useDarkMode = () => {
    // 로컬스토리지에서 다크모드 설정 불러오기 (기본값: false)
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = safeLocalStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : false;
    });

    // 다크모드 상태 변경 시 로컬스토리지 저장 및 CSS 테마 적용
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