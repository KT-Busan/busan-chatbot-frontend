import React from 'react';
import botProfileImage from '../../assets/bot-profile.png';

const WelcomeScreen = () => {
    return (
        <div className="welcome-screen">
            <img src={botProfileImage} alt="B-BOT Profile" className="welcome-profile-pic"/>
            <strong className="gradient-text">B-BOT</strong>
            <span className="gradient-text">For the Youth in Busan</span>
            <p className="welcome-subtitle">
                부산 16개 구·군에 흩어진 청년공간·프로그램 정보,<br/>
                이제 한 곳에서 대화로 바로 찾아보세요! 🚀
            </p>
        </div>
    );
};

export default WelcomeScreen;