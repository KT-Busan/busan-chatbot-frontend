import React from 'react';
import CustomMarkdown from '../ui/CustomMarkdown';
import ThinkingIndicator from './ThinkingIndicator';
import SpaceReservation from './SpaceReservation';
import botProfileImage from '../../assets/bot-profile.png';

const MessageBubble = ({message, onButtonClick, spacesData}) => {
    const {sender, text, isThinking} = message;

    // 청년 공간 예약에 대한 봇 응답인지 확인
    const isSpaceReservationBotResponse = sender === 'bot' &&
        text && text.includes('청년 공간 예약') &&
        text.includes('부산시에는 다양한 청년을 위한 공간이 존재합니다');

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
                    ) : isSpaceReservationBotResponse ? (
                        // 청년 공간 예약 봇 응답일 때 전용 컴포넌트 표시
                        <SpaceReservation onButtonClick={onButtonClick}/>
                    ) : (
                        <CustomMarkdown
                            onButtonClick={onButtonClick}
                            spacesData={spacesData}
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