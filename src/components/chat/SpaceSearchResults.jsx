import React from 'react';

const SpaceSearchResults = ({results, onClose, onButtonClick}) => {
    // API 응답 데이터 구조에 맞게 수정
    const {data: searchResults, count, searchConditions} = results;
    const {capacity, equipment, type} = searchConditions;

    return (
        <div className="space-search-results">
            <div className="results-header">
                <h3>🔍 검색 결과</h3>
                <button className="close-btn" onClick={onClose}>×</button>
            </div>

            <div className="search-summary">
                <p><strong>검색 조건:</strong></p>
                <ul>
                    <li><strong>인원수:</strong> {capacity}</li>
                    {equipment && equipment.length > 0 && (
                        <li><strong>구비물품:</strong> {equipment.join(', ')}</li>
                    )}
                    {type && (
                        <li><strong>구분:</strong> {type}</li>
                    )}
                </ul>
            </div>

            {count === 0 ? (
                <div className="no-results">
                    <p>조건에 맞는 공간을 찾을 수 없습니다.</p>
                    <p>다른 조건으로 검색해보세요.</p>
                    <button className="retry-btn" onClick={onClose}>
                        <span>다시 검색하기</span>
                    </button>
                </div>
            ) : (
                <div className="results-content">
                    <p className="results-count">
                        <strong>다음 조건에 맞는 결과입니다! ({count}개)</strong>
                    </p>

                    {searchResults.map((result, index) => (
                        <div key={index} className="result-item">
                            <h4 className="space-name">
                                {result.spaceName}
                                {result.spaceRegion && <span className="space-region"> [{result.spaceRegion}]</span>}
                            </h4>

                            {result.spaceAddress && (
                                <p className="space-address">📍 {result.spaceAddress}</p>
                            )}

                            {result.spaceContact && (
                                <p className="space-contact">📞 {result.spaceContact}</p>
                            )}

                            <div className="facility-info">
                                <h5>• {result.facility.name}</h5>
                                <div className="facility-details">
                                    <div className="detail-row">
                                        <span className="detail-label">인원:</span>
                                        <span className="detail-value">{result.facility.capacity}</span>
                                    </div>

                                    <div className="detail-row">
                                        <span className="detail-label">종류:</span>
                                        <span className="detail-value">{result.facility.type}</span>
                                    </div>

                                    <div className="detail-row">
                                        <span className="detail-label">구비 물품:</span>
                                        <span className="detail-value">{result.facility.equipment}</span>
                                    </div>

                                    <div className="detail-row">
                                        <span className="detail-label">가격:</span>
                                        <span className="detail-value">{result.facility.price}</span>
                                    </div>

                                    {result.facility.notice && result.facility.notice !== "없음" && (
                                        <div className="detail-row">
                                            <span className="detail-label">공지 사항:</span>
                                            <span className="detail-value">{result.facility.notice}</span>
                                        </div>
                                    )}

                                    {result.targetUsers && (
                                        <div className="detail-row">
                                            <span className="detail-label">이용 대상:</span>
                                            <span className="detail-value">{result.targetUsers}</span>
                                        </div>
                                    )}

                                    {result.bookingLink && result.bookingLink !== "없음" && (
                                        <div className="detail-row">
                                            <span className="detail-label">예약 사이트:</span>
                                            <a
                                                href={result.bookingLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rental-link"
                                            >
                                                예약하러 가기 →
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="results-actions">
                        <button className="retry-btn" onClick={onClose}>
                            <span>다른 조건으로 검색하기</span>
                        </button>
                        <button
                            className="main-menu-btn"
                            onClick={() => onButtonClick('지역별 확인하기')}
                        >
                            <span>지역별로 찾아보기</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpaceSearchResults;