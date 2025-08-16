import React from 'react';

const MobileHamburger = ({onClick, isVisible = true, className = ''}) => {
    if (!isVisible) return null;

    return (
        <button
            className={`mobile-hamburger-btn ${className}`}
            onClick={onClick}
            aria-label="메뉴 열기"
        >
            ☰
        </button>
    );
};

export default MobileHamburger;