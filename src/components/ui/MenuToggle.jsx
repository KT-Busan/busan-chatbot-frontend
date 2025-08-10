import React from 'react';

const MenuToggle = ({open, onToggle}) => {
    return (
        <div className="menu-toggle-container">
            <button
                type="button"
                className="menu-toggle-btn"
                onClick={onToggle}
                aria-expanded={open}
                aria-controls="main-menu-group"
            >
                <span>{open ? 'B-BOT 메뉴 숨기기 ▲' : 'B-BOT 메뉴 열기 ▼'}</span>
            </button>
        </div>
    );
};

export default MenuToggle;