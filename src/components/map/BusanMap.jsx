import React, {useState, useEffect} from 'react';
import {BUSAN_REGIONS} from '../../utils/constants';

const BusanMap = ({onRegionClick, spacesData}) => {
    const [hoveredRegion, setHoveredRegion] = useState(null);
    const [regions, setRegions] = useState(BUSAN_REGIONS);

    // 실제 크롤링 데이터로 지역별 개수 업데이트
    useEffect(() => {
        if (spacesData && spacesData.length > 0) {
            const updatedRegions = {...BUSAN_REGIONS};

            // 각 지역별 청년공간 개수 초기화
            Object.keys(updatedRegions).forEach(region => {
                updatedRegions[region].count = 0;
            });

            // 각 지역별 청년공간 개수 계산
            spacesData.forEach(space => {
                const region = space.region;
                if (updatedRegions[region]) {
                    updatedRegions[region].count++;
                }
            });

            setRegions(updatedRegions);
        }
    }, [spacesData]);

    const handleRegionClick = (regionName) => {
        onRegionClick(regionName);
    };

    return (
        <div className="busan-map-container">
            <div className="map-header">
                <h3>🗺️ 부산 청년공간 지도</h3>
                <p>지역을 클릭하면 해당 지역의 청년공간을 확인할 수 있어요!</p>
            </div>

            <div className="map-wrapper">
                <svg
                    className="busan-map-svg"
                    viewBox="0 0 410 400"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* 배경 바다색 */}
                    <rect width="410" height="400" fill="#e6f3ff" opacity="0.3"/>

                    {/* 각 지역별 폴리곤 */}
                    {Object.entries(regions).map(([regionName, data]) => (
                        <g key={regionName}>
                            <polygon
                                points={data.coords}
                                fill={hoveredRegion === regionName ? '#ffebf0' : '#f0f8ff'}
                                stroke={hoveredRegion === regionName ? '#ff6b9d' : '#4a90e2'}
                                strokeWidth="1.5"
                                className="region-polygon"
                                onMouseEnter={() => setHoveredRegion(regionName)}
                                onMouseLeave={() => setHoveredRegion(null)}
                                onClick={() => handleRegionClick(regionName)}
                            />

                            <text
                                x={data.center.x + (data.textOffset?.x || 0)}
                                y={data.center.y + (data.textOffset?.y || 0)}
                                textAnchor="middle"
                                fontSize={data.fontSize}
                                fontWeight="600"
                                fill="#2d3748"
                                className="region-name-text"
                            >
                                {regionName}
                            </text>
                        </g>
                    ))}

                    {/* 호버 툴팁 */}
                    {hoveredRegion && (
                        <g className="hover-tooltip">
                            <rect
                                x={regions[hoveredRegion].center.x + 15}
                                y={regions[hoveredRegion].center.y - 25}
                                width="35"
                                height="20"
                                fill="rgba(0, 0, 0, 0.8)"
                                stroke="white"
                                strokeWidth="1"
                                rx="4"
                            />
                            <text
                                x={regions[hoveredRegion].center.x + 32.5}
                                y={regions[hoveredRegion].center.y - 12}
                                textAnchor="middle"
                                fontSize="11"
                                fontWeight="bold"
                                fill="white"
                            >
                                {regions[hoveredRegion].count}개
                            </text>
                        </g>
                    )}
                </svg>
            </div>

            {/* 범례 */}
            <div className="map-legend">
                <div className="legend-item">
                    <div className="legend-circle small"></div>
                    <span>0-2개</span>
                </div>
                <div className="legend-item">
                    <div className="legend-circle medium"></div>
                    <span>3-5개</span>
                </div>
                <div className="legend-item">
                    <div className="legend-circle large"></div>
                    <span>6개 이상</span>
                </div>
            </div>

            {/* 지역 목록 (클릭 가능) - 가나다순 4x4 배열 */}
            <div className="regions-grid">
                {Object.entries(regions)
                    .sort(([a], [b]) => a.localeCompare(b, 'ko-KR'))
                    .map(([regionName, data]) => (
                        <button
                            key={regionName}
                            className={`region-button ${hoveredRegion === regionName ? 'hovered' : ''}`}
                            onClick={() => handleRegionClick(regionName)}
                            onMouseEnter={() => setHoveredRegion(regionName)}
                            onMouseLeave={() => setHoveredRegion(null)}
                        >
                            <span className="region-name">{regionName}</span>
                            <span className="region-count">{data.count}개</span>
                        </button>
                    ))}
            </div>
        </div>
    );
};

export default BusanMap;