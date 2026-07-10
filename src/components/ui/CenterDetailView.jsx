import React, {useState, useEffect} from 'react';
import { fetchBusanYouth } from '../../api';
import ErrorState from './ErrorState';

const CenterDetailView = ({centerName, onButtonClick}) => {
    const [rentalSpaces, setRentalSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (centerName) {
            loadRentalSpaces();
        }
    }, [centerName]);

    const loadRentalSpaces = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetchBusanYouth();

            if (response.data && response.data.success && response.data.data) {
                const allSpaces = response.data.data;

                const centerSpaces = allSpaces.filter(space =>
                    space.parent_facility === centerName
                );

                setRentalSpaces(centerSpaces);
            } else {
                throw new Error('대여공간 데이터 형식 오류');
            }

        } catch (error) {
            console.error('❌ 대여공간 데이터 로드 실패:', error);
            setError(`대여공간 데이터 로드 실패: ${error.message}`);
            setRentalSpaces([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSpaceClick = (space) => {
        const formatSpaceDetail = (space) => {
            let detail = `🏢 ${space.parent_facility} - ${space.space_name}\n\n`;

            if (space.introduction) {
                detail += `${space.introduction}\n\n`;
            }

            detail += `📍 위치 : ${space.location}\n`;
            detail += `👥 인원 : `;

            if (space.capacity_min && space.capacity_max) {
                detail += `최소 ${space.capacity_min}명 ~ 최대 ${space.capacity_max}명\n`;
            } else if (space.capacity_max) {
                detail += `최대 ${space.capacity_max}명\n`;
            } else if (space.capacity_min) {
                detail += `최소 ${space.capacity_min}명\n`;
            } else {
                detail += `인원 제한 없음\n`;
            }

            if (space.eligibility) {
                detail += `🎯 지원 대상 : ${space.eligibility}\n`;
            }

            if (space.features) {
                detail += `🧰 특징 : ${space.features}\n`;
            }

            if (space.link) {
                const linkUrl = Array.isArray(space.link) ? space.link[0] : space.link;
                if (linkUrl) {
                    detail += `🔗 링크 : [자세히 보기](${linkUrl})\n`;
                }
            }

            if (space.keywords && space.keywords.length > 0) {
                const formattedKeywords = formatKeywords(space.keywords).join(', ');
                detail += `🏷️ 사용 가능한 키워드 : ${formattedKeywords}\n`;
            }

            return detail;
        };

        const detailMessage = formatSpaceDetail(space);
        onButtonClick(detailMessage, true);
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
            <div className="center-detail-loading">
                <div className="loading-spinner"></div>
                <p>🔄 {centerName}의 대여 가능한 공간을 불러오는 중...</p>
            </div>
        );
    }

    if (error) {
        return <ErrorState message={error} onRetry={loadRentalSpaces}/>;
    }

    const renderSpaceGrid = (spaces) => (
        <div className="rental-spaces-grid">
            {spaces.map((space, index) => (
                <div
                    key={index}
                    className="rental-space-card"
                    onClick={() => handleSpaceClick(space)}
                >
                    <div className="rental-space-card-header">
                        <h4 className="space-name">{space.space_name}</h4>
                        {space.capacity_max && (
                            <div className="capacity-badge">
                                👥 {space.capacity_min ? `${space.capacity_min}-` : ''}
                                {space.capacity_max}명
                            </div>
                        )}
                    </div>

                    <div className="rental-space-card-content">
                        {space.keywords && space.keywords.length > 0 ? (
                            <div className="space-keywords">
                                {formatKeywords(space.keywords).map((keyword, idx) => (
                                    <span key={idx} className="keyword-tag-small">
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <div className="space-keywords">
                                <span className="keyword-tag-small" style={{opacity: 0.5}}>키워드 없음</span>
                            </div>
                        )}
                    </div>

                    <div className="rental-space-card-footer">
                        <span className="space-click-hint">클릭하여 상세보기 →</span>
                    </div>
                </div>
            ))}
        </div>
    );

    // space_type이 없는 기존 데이터는 대관 공간으로 취급해 기존 화면과 동일하게 노출
    const rentalOnly = rentalSpaces.filter(space => space.space_type !== 'open_use');
    const openUseOnly = rentalSpaces.filter(space => space.space_type === 'open_use');

    return (
        <div className="center-detail-view">
            {rentalOnly.length > 0 && (
                <>
                    <div className="rental-spaces-header">
                        <hr className="header-divider"/>
                        <h3>{centerName} - 대관 가능 공간</h3>
                    </div>
                    {renderSpaceGrid(rentalOnly)}
                </>
            )}

            {openUseOnly.length > 0 && (
                <>
                    <div className="rental-spaces-header">
                        <hr className="header-divider"/>
                        <h3>{centerName} - 상시 이용 가능 공간</h3>
                    </div>
                    {renderSpaceGrid(openUseOnly)}
                </>
            )}

            {rentalSpaces.length === 0 && (
                <>
                    <div className="rental-spaces-header">
                        <hr className="header-divider"/>
                        <h3>{centerName} - 대여 가능한 공간</h3>
                    </div>
                    <p style={{textAlign: 'center', color: 'var(--text-secondary)'}}>
                        현재 등록된 대여 가능한 공간이 없습니다.
                    </p>
                </>
            )}
        </div>
    );
};

export default CenterDetailView;