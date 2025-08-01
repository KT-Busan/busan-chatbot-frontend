import React from 'react';
import botProfileImage from '../../assets/bot-profile.png';

const WelcomeScreen = () => {
    return (
        <div className="welcome-screen">
            <img src={botProfileImage} alt="B-BOT Profile" className="welcome-profile-pic"/>
            <strong className="gradient-text">B-BOT</strong>
            <span className="gradient-text">For the Youth in Busan</span>
            <p className="welcome-subtitle">
                안녕하세요! 부산 청년 공간을 알리는 B-BOT입니다!<br/>
                청년 공간 관련 궁금하신 내용을 무엇이든 물어보세요! 🚀
            </p>
        </div>
    );
};

export default WelcomeScreen;