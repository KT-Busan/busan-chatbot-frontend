import React from 'react';
import {KEYWORD_BUTTONS} from '../../utils/constants';

const KeywordButtons = ({onButtonClick}) => {
    return (
        <div className="keyword-section">
            <div className="keyword-header">
                <h3>🔍 어떤 공간이 있는지 궁금하다면?</h3>
                <p>아래 키워드 버튼을 눌러 내게 딱 맞는 청년 공간을 확인해보세요!</p>
            </div>
            <div className="keyword-grid-4x2">
                {KEYWORD_BUTTONS.map((keyword, index) => (
                    <button
                        key={index}
                        className="keyword-button"
                        onClick={() => onButtonClick(keyword)}
                    >
                        {keyword}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default KeywordButtons;