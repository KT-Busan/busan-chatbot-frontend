import React, {useState} from 'react';

// 채팅 입력 컴포넌트 - 사용자 메시지 입력 및 전송 처리
function ChatInput({onSendMessage, disabled = false}) {
    const [input, setInput] = useState(''); // 입력 필드의 현재 값 상태

    // 폼 제출 처리 함수(Enter 키 또는 전송 버튼 클릭 시)
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
                    {disabled ? '생각 중...' : '전송'} {/* 상태에 따른 버튼 텍스트 변경 */}
                </button>
            </form>
        </div>
    );
}

export default ChatInput;