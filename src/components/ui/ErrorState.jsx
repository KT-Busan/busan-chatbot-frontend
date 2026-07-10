import React from 'react';

// 목록/상세 데이터 로딩 실패 시 공통으로 쓰는 에러 상태 컴포넌트.
// 실패해도 첫 화면(WelcomeScreen)으로 돌려보내지 않고, 재시도 버튼으로 같은 자리에서 복구할 수 있게 한다.
const ErrorState = ({message, onRetry, retryLabel = '다시 시도'}) => {
    return (
        <div className="error-state">
            <p className="error-state-message">❌ {message}</p>
            {onRetry && (
                <button onClick={onRetry} className="retry-btn error-state-retry-btn">
                    🔄 {retryLabel}
                </button>
            )}
        </div>
    );
};

export default ErrorState;
