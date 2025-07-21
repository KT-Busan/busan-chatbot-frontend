import React, { useState } from 'react';

function ChatInput({ onSendMessage }) {
    const [input, setInput] = useState('');

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
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
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