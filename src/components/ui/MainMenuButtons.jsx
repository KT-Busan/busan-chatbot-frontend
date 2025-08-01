import React from 'react';
import {MAIN_MENU} from '../../utils/constants';

const MainMenuButtons = ({onButtonClick}) => {
    return (
        <div className="main-menu-container">
            {MAIN_MENU.map((item, index) => (
                <button
                    key={index}
                    className="main-menu-btn"
                    onClick={() => onButtonClick(item)}
                >
                    <span>{item}</span>
                </button>
            ))}
        </div>
    );
};

export default MainMenuButtons;