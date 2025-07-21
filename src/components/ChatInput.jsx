// src/components/ChatInput.jsx

import React, { useState } from 'react';

function ChatInput({ onSendMessage }) {
    const [input, setInput] = useState(''); // 👈 1. 입력값을 저장할 state

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    return (
        <div className="chat-input-container">
            <form onSubmit={handleSubmit} className="chat-input-form">
                <input
                    type="text"
                    className="chat-input"
                    value={input} // 👈 2. input의 값을 항상 state와 일치시킴
                    onChange={(e) => setInput(e.target.value)} // 👈 3. 글자가 바뀔 때마다 state를 업데이트
                    placeholder="부산 청년 지원 전문가에게 무엇이든 물어보세요..."
                />
                <button type="submit" className="send-button">
                    전송
                </button>
            </form>
        </div>
    );
}

export default ChatInput;