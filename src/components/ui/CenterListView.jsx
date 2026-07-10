import React, {useState, useEffect} from 'react';
import { fetchCacheData, fetchKeywordData } from '../../api';
import ErrorState from './ErrorState';

const CenterListView = ({onButtonClick}) => {
    const [centersData, setCentersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadCentersData();
    }, []);

    const loadCentersData = async () => {
        setLoading(true);
        setError(null);

        try {
            let centersResponse = null;
            let keywordResponse = null;
            const retries = 3;

            for (let i = 0; i < retries; i++) {
                try {
                    const responses = await Promise.all([fetchCacheData(), fetchKeywordData()]);
                    centersResponse = responses[0];
                    keywordResponse = responses[1];
                    break;
                } catch (apiError) {
                    console.error(`❌ API 호출 실패 (시도 ${i + 1}):`, apiError);
                    if (i === retries - 1) throw apiError;
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            if (centersResponse?.data?.success && keywordResponse?.data?.success) {
                const centers = centersResponse.data.data || [];
                const keywords = keywordResponse.data.data || [];

                const mergedCenters = centers.map(center => {
                    const keywordInfo = keywords.find(k => k.parent_facility === center.name);
                    return {
                        ...center,
                        introduction: keywordInfo?.introduction || '부산 청년들을 위한 다양한 활동을 지원하는 공간입니다.',
                        keywords: keywordInfo?.keywords || []
                    };
                });

                setCentersData(mergedCenters);
            } else {
                throw new Error('센터 데이터 형식 오류 또는 API 응답 실패');
            }

        } catch (error) {
            console.error('❌ 센터 데이터 로드 실패:', error);
            setError(`센터 데이터 로드 실패: ${error.message}`);
            setCentersData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCenterClick = (centerName) => {
        const message = `${centerName} 상세보기`;
        onButtonClick(message, false);
    };

    const formatKeywords = (keywords) => {
        if (!keywords) return [];

        if (typeof keywords === 'string') {
            return [keywords.replace(/[[\]]/g, '').trim()];
        }

        if (!Array.isArray(keywords)) {
            console.warn('keywords is not an array:', keywords);
            return [];
        }

        return keywords.map(keyword => {
            if (typeof keyword === 'string') {
                return keyword.replace(/[[\]]/g, '').trim();
            }
            return keyword;
        });
    };

    if (loading) {
        return (
            <div className="center-list-loading">
                <div className="loading-spinner"></div>
                <p>🔄 부산 청년 센터 정보를 불러오는 중...</p>
            </div>
        );
    }

    if (error) {
        return <ErrorState message={error} onRetry={loadCentersData}/>;
    }

    return (
        <div className="center-list-view">
            <div className="center-list-header">
                <h3>🏢 부산 청년 센터 전체보기</h3>
                <p>총 <b>{centersData.length}개</b>의 청년 센터가 있습니다.</p>
                <p>원하는 센터를 클릭하면 상세 정보와 대여 가능한 공간을 확인할 수 있어요!</p>
            </div>

            <div className="centers-grid">
                {centersData.map((center, index) => (
                    <div
                        key={index}
                        className="center-card"
                        onClick={() => handleCenterClick(center.name)}
                    >
                        <div className="center-card-header">
                            <h4 className="center-name">{center.name}</h4>
                            <div className="center-region-badge">{center.region}</div>
                        </div>

                        <div className="center-card-content">
                            <p className="center-introduction">
                                {center.introduction && center.introduction.length > 80
                                    ? center.introduction.substring(0, 80) + "..."
                                    : center.introduction || "부산 청년들을 위한 다양한 활동을 지원하는 공간입니다."}
                            </p>

                            {center.keywords && center.keywords.length > 0 ? (
                                <div className="center-keywords">
                                    {formatKeywords(center.keywords).map((keyword, idx) => (
                                        <span key={idx} className="keyword-tag">
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <div className="center-keywords">
                                    <span className="keyword-tag" style={{opacity: 0.5}}>키워드 없음</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="center-list-footer">
                <p className="usage-tip">
                    💡 <b>사용법:</b> 원하는 센터 카드를 클릭하면 상세 정보와 대여 가능한 공간들을 확인할 수 있습니다!
                </p>
            </div>
        </div>
    );
};

export default CenterListView;