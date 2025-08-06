import React from 'react';
import CustomMarkdown from '../ui/CustomMarkdown';
import ThinkingIndicator from './ThinkingIndicator';
import botProfileImage from '../../assets/bot-profile.png';

const MessageBubble = ({message, onButtonClick, spacesData, anonymousId}) => {
    const {sender, text, isThinking} = message;

    return (
        <div className={`message ${sender === 'user' ? 'user-message' : 'bot-message'}`}>
            <div className="message-content">
                {/* 봇 메시지일 때만 프로필 이미지 표시 */}
                {sender === 'bot' && (
                    <img src={botProfileImage} alt="Bot Profile" className="message-profile-pic"/>
                )}
                <div className="message-bubble">
                    {/* 생각 중 상태 또는 일반 메시지 렌더링 */}
                    {isThinking ? (
                        <ThinkingIndicator/>
                    ) : (
                        <CustomMarkdown
                            onButtonClick={onButtonClick}
                            spacesData={spacesData}
                            anonymousId={anonymousId}
                        >
                            {text}
                        </CustomMarkdown>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;