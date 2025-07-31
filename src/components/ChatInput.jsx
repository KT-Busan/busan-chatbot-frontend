import React, {useState} from 'react';

// 채팅 입력 컴포넌트 - 사용자 메시지 입력 및 전송 처리
function ChatInput({onSendMessage, disabled = false}) {
    const [input, setInput] = useState(''); // 입력 필드의 현재 값 상태

    // 폼 제출 처리 함수 (Enter 키 또는 전송 버튼 클릭 시)
    const handleSubmit = (e) => {
        e.preventDefault(); // 기본 폼 제출 동작 방지
        // disabled 상태이거나 입력값이 없으면 전송하지 않음
        if (disabled || !input.trim()) return;

        onSendMessage(input.trim()); // 앞뒤 공백 제거 후 메시지 전송
        setInput(''); // 입력 필드 초기화
    };

    return (
        <div className="chat-input-container">
            <form onSubmit={handleSubmit} className="chat-input-form">
                {/* 메시지 입력 필드 */}
                <input
                    type="text"
                    className="chat-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)} // 입력값 변경 시 상태 업데이트
                    placeholder={
                        disabled
                            ? "B-BOT이 생각하고 있어요..." // 비활성화 상태일 때 플레이스홀더
                            : "부산 청년 공간에 대해 무엇이든 물어보세요..." // 일반 상태일 때 플레이스홀더
                    }
                    disabled={disabled} // 봇이 응답 중일 때 입력 비활성화
                />
                {/* 전송 버튼 */}
                <button
                    type="submit"
                    className={`send-button ${disabled ? 'disabled' : ''}`} // 상태에 따른 CSS 클래스 적용
                    disabled={disabled} // 봇이 응답 중일 때 버튼 비활성화
                >
                    {disabled ? '생각 중...' : '전송'} {/* 상태에 따른 버튼 텍스트 변경 */}
                </button>
            </form>
        </div>
    );
}

export default ChatInput;