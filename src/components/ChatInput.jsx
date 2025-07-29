import React, {useState} from 'react';

function ChatInput({onSendMessage, disabled = false}) {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // disabled 상태이거나 입력값이 없으면 전송하지 않음
        if (disabled || !input.trim()) return;

        onSendMessage(input.trim());
        setInput('');
    };

    return (
        <div className="chat-input-container">
            <form onSubmit={handleSubmit} className="chat-input-form">
                <input
                    type="text"
                    className="chat-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                        disabled
                            ? "B-BOT이 생각하고 있어요..."
                            : "부산 청년 지원 전문가에게 무엇이든 물어보세요..."
                    }
                    disabled={disabled}
                />
                <button
                    type="submit"
                    className={`send-button ${disabled ? 'disabled' : ''}`}
                    disabled={disabled}
                >
                    {disabled ? '생각 중...' : '전송'}
                </button>
            </form>
        </div>
    );
}

export default ChatInput;