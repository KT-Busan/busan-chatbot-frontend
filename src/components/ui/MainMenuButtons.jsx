import React from 'react';
import {getMainMenu} from '../../utils/constants';

const MainMenuButtons = ({onButtonClick, centerCount}) => {
    const mainMenu = getMainMenu(centerCount);

    return (
        <div id="main-menu-container">
            {mainMenu.map((item, index) => (
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