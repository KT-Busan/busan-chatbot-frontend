import React, {useState, useEffect} from 'react';
import {BUSAN_REGIONS} from '../../utils/constants';

const BusanMap = ({onRegionClick, spacesData}) => {
    const [hoveredRegion, setHoveredRegion] = useState(null);
    const [regions, setRegions] = useState(BUSAN_REGIONS);

    useEffect(() => {
        if (spacesData && spacesData.length > 0) {
            const updatedRegions = {...BUSAN_REGIONS};

            Object.keys(updatedRegions).forEach(region => {
                updatedRegions[region].count = 0;
            });

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
        <div className="busan-map-container enlarged">
            <div className="map-header">
                <h3>🗺️ 부산 청년 공간 지도</h3>
                <p>지도에서 원하는 구/군을 클릭하거나, 아래 목록에서 선택해보세요.</p>
                <p>각 지역별 청년공간 개수를 한눈에 확인할 수 있어요!</p>
            </div>

            <div className="map-wrapper">
                <svg
                    className="busan-map-svg enlarged"
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

            {/* 지역 목록 */}
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