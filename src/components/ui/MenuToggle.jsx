import React from 'react';

const MenuToggle = ({open, onToggle}) => {
    const handleClick = (e) => {
        onToggle();
        setTimeout(() => {
            if (e.target && e.target.blur) {
                e.target.blur();
            }
        }, 100);
    };

    const handleTouchEnd = (e) => {
        setTimeout(() => {
            if (e.target && e.target.blur) {
                e.target.blur();
            }
        }, 100);
    };

    return (
        <button
            type="button"
            className="menu-toggle-btn"
            onClick={handleClick}
            onTouchEnd={handleTouchEnd}
            aria-expanded={open}
            aria-controls="main-menu-group"
        >
            <span>{open ? 'B-BOT 메뉴 숨기기 ▲' : 'B-BOT 메뉴 열기 ▼'}</span>
        </button>
    );
};

export default MenuToggle;