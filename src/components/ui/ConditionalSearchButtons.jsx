import React, {useState} from 'react';
import axios from 'axios';

const ConditionalSearchButtons = ({onButtonClick, anonymousId}) => {
    const [isLoading, setIsLoading] = useState(false);

    const getBackendUrl = () => {
        const hostname = window.location.hostname;
        if (hostname.includes('github.io') || hostname.includes('kt-busan.github.io')) {
            return 'https://b-bot-backend.onrender.com';
        }
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:5001';
        }
        return 'https://b-bot-backend.onrender.com';
    };

    const handleRandomRecommendation = async () => {
        setIsLoading(true);
        try {
            const finalAnonymousId = anonymousId || `temp_user_${Date.now()}`;
            const backendUrl = getBackendUrl();

            const response = await axios.post(`${backendUrl}/api/chat`, {
                message: '✨ 랜덤 추천',
                anonymousId: finalAnonymousId,
                chatId: `random_${Date.now()}`
            }, {
                headers: {'Content-Type': 'application/json'},
                timeout: 30000,
            });

            if (response.data && response.data.reply) {
                onButtonClick('__BOT_RESPONSE__' + response.data.reply);
            }
        } catch (error) {
            console.error('랜덤 추천 중 오류:', error);
            onButtonClick('__BOT_RESPONSE__랜덤 추천 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewSearch = () => {
        onButtonClick('__BOT_RESPONSE__[SPACE_CONDITION_SEARCH]');
    };

    return (
        <div className="markdown-additional-random-section">
            <p className="markdown-additional-random-text">💡 다른 공간을 보고싶다면?</p>
            <div style={{display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap'}}>
                <button
                    className="markdown-additional-random-btn"
                    onClick={handleRandomRecommendation}
                    disabled={isLoading}
                >
                    🎲 랜덤 추천
                </button>

                <button
                    className="markdown-additional-random-btn"
                    onClick={handleNewSearch}
                >
                    🔄 새로 검색하기
                </button>
            </div>
        </div>
    );
};

export default ConditionalSearchButtons;