import React, {useState} from 'react';

function ChatInput({onSendMessage, disabled = false}) {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (disabled || !input.trim()) return;

        onSendMessage(input.trim());
        setInput('');
    };

    return (
        <div className="chat-input-container">
            <form onSubmit={handleSubmit} className="chat-input-form">
                {/* 메시지 입력 필드 */}
                <input
                    type="text"
                    className="chat-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                        disabled
                            ? "B-BOT이 생각하고 있어요..."
                            : "부산 청년 공간에 대해 무엇이든 물어보세요..."
                    }
                    disabled={disabled}
                />
                {/* 전송 버튼 */}
                <button
                    type="submit"
                    className={`send-button ${disabled ? 'disabled' : ''}`}
                    disabled={disabled}
                >
                    {disabled ? '생각 중...' : '전송'}
                </button>
            </form>

            {/* 경고 문구 */}
            <div className="chat-warning">
                <p>B-BOT은 실수를 할 수 있습니다. 응답을 다시 한 번 확인해주세요.</p>
            </div>
        </div>
    );
}

export default ChatInput;