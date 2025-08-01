import React from 'react';

const ThinkingIndicator = () => {
    return (
        <div className="thinking-indicator">
            <span>B-BOT이 생각하고 있어요</span>
            <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    );
};

export default ThinkingIndicator;