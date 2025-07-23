import React, {useState} from 'react';

// disabled prop을 더 이상 받지 않음
function ChatInput({onSendMessage}) {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // disabled 조건 없이, 입력값이 있으면 항상 전송
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
                    // placeholder를 원래대로 되돌리고, disabled 속성을 제거
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