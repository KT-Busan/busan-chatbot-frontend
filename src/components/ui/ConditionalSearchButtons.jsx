import React, {useState} from 'react';
import { sendChatMessage } from '../../api';

const ConditionalSearchButtons = ({onButtonClick, anonymousId}) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleRandomRecommendation = async () => {
        setIsLoading(true);
        try {
            const finalAnonymousId = anonymousId || `temp_user_${Date.now()}`;
            const response = await sendChatMessage('✨ 랜덤 추천', finalAnonymousId, `random_${Date.now()}`);

            if (response.data?.reply) {
                onButtonClick(response.data.reply, true);
            }
        } catch (error) {
            console.error('랜덤 추천 중 오류:', error);
            onButtonClick('랜덤 추천 중 오류가 발생했습니다. 다시 시도해주세요.', true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewSearch = () => {
        onButtonClick('[SPACE_CONDITION_SEARCH]', true);
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
