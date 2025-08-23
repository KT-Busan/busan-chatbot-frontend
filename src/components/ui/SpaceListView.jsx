import React, {useState, useEffect} from 'react';
import axios from 'axios';
import '../../styles/components/space-detail-search.css';

const SpaceListView = ({onButtonClick, anonymousId}) => {
    const [spacesData, setSpacesData] = useState([]);
    const [filteredSpaces, setFilteredSpaces] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('전체');
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState(null);

    useEffect(() => {
        loadSpacesData();
    }, []);

    useEffect(() => {
        let filtered = spacesData;

        if (selectedRegion !== '전체') {
            filtered = filtered.filter(space => space.location === selectedRegion);
        }

        if (searchTerm) {
            filtered = filtered.filter(space =>
                (space.space_name && space.space_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (space.parent_facility && space.parent_facility.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        setFilteredSpaces(filtered);
    }, [spacesData, searchTerm, selectedRegion]);

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

    const loadSpacesData = async () => {
        setLoading(true);
        setLoadError(null);

        try {
            const backendUrl = getBackendUrl();
            const response = await axios.get(`${backendUrl}/api/spaces/busan-youth`, {
                timeout: 15000
            });

            if (response.data && response.data.success && response.data.data) {
                setSpacesData(response.data.data);
                setFilteredSpaces(response.data.data);
                return;
            } else {
                throw new Error('백엔드 응답 형식 오류');
            }

        } catch (error) {
            console.error('❌ 데이터 로드 실패:', error);
            setLoadError(`데이터 로드 실패: ${error.message}`);
            setSpacesData([]);
            setFilteredSpaces([]);
        } finally {
            setLoading(false);
        }
    };

    const formatSpaceDetail = (space) => {
        const parent_facility = space.parent_facility || '정보없음';
        const space_name = space.space_name || '정보없음';
        const location = space.location || '정보없음';
        const introduction = space.introduction || '정보없음';
        const eligibility = space.eligibility || '정보없음';
        const features = space.features || '정보없음';

        let link_url = '정보없음';
        if (space.link) {
            if (Array.isArray(space.link)) {
                link_url = space.link[0];
            } else {
                link_url = space.link;
            }
        }

        let capacity_info = "인원 제한 없음";
        if (space.capacity_min && space.capacity_max) {
            capacity_info = `최소 ${space.capacity_min}명 ~ 최대 ${space.capacity_max}명`;
        } else if (space.capacity_max) {
            capacity_info = `최대 ${space.capacity_max}명`;
        } else if (space.capacity_min) {
            capacity_info = `최소 ${space.capacity_min}명`;
        }

        let result = `🏢 ${parent_facility} - ${space_name}\n\n`;

        result += `${introduction}\n\n`;

        result += `\u00A0\u00A0📍 위치 : `;
        result += `${location}\n`;

        result += `\u00A0\u00A0👥 인원 : `;
        result += `${capacity_info}\n`;

        result += `\u00A0\u00A0🎯 지원 대상 : `;
        result += `${eligibility}\n`;

        result += `\u00A0\u00A0🧰 특징 : `;
        result += `${features}\n`;

        if (link_url !== '정보없음') {
            result += `\u00A0\u00A0🔗 링크 : `;
            result += `[자세히 보기](${link_url})\n`;
        }

        if (space.keywords && space.keywords.length > 0) {
            result += `\u00A0\u00A0🏷️ 사용 가능한 키워드 : `;
            result += `${space.keywords.join(', ')}\n`;
        }

        return result;
    };

    const handleSpaceClick = (space) => {
        const detailMessage = formatSpaceDetail(space);
        onButtonClick('__BOT_RESPONSE__' + detailMessage);
    };

    const sortedRegions = ['전체', ...Array.from(new Set(spacesData.map(space => space.location))).sort((a, b) => a.localeCompare(b, 'ko'))];

    return (
        <div className="space-detail-search">
            <div className="search-header">
                <h3>🏢 부산 청년 공간 상세 정보</h3>
                <p>원하는 공간을 클릭하면 상세 정보를 확인할 수 있습니다!</p>
                {spacesData.length > 0 && (
                    <p style={{
                        margin: '12px 0',
                        color: 'var(--border-color-hover)',
                        fontSize: '1em',
                        fontWeight: '600'
                    }}>
                        총 <strong>{spacesData.length}개</strong>의 청년 공간이 존재합니다!
                    </p>
                )}
            </div>

            {loading ? (
                <div className="loading">
                    <p>🔄 청년 공간 데이터를 불러오는 중...</p>
                </div>
            ) : loadError ? (
                <div className="loading">
                    <p>❌ {loadError}</p>
                </div>
            ) : (
                <>
                    {/* 검색 및 필터 */}
                    <div className="search-controls">
                        <div className="search-input-group">
                            <input
                                type="text"
                                placeholder="공간명 또는 시설명으로 검색..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>

                        <div className="region-filter">
                            <select
                                value={selectedRegion}
                                onChange={(e) => setSelectedRegion(e.target.value)}
                                className="region-select"
                            >
                                {sortedRegions.map(region => (
                                    <option key={region} value={region}>{region}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* 공간 목록 그리드 */}
                    <div className="spaces-list">
                        {filteredSpaces.length > 0 ? (
                            <div className="spaces-grid-detail">
                                {filteredSpaces.map((space, index) => (
                                    <div
                                        key={index}
                                        className="space-card-detail"
                                        onClick={() => handleSpaceClick(space)}
                                    >
                                        <div className="space-card-detail-header">
                                            <h4 className="space-facility-name">{space.parent_facility}</h4>
                                            <div className="space-region-badge">{space.location}</div>
                                        </div>

                                        <div className="space-card-detail-content">
                                            <h5 className="space-name">{space.space_name}</h5>

                                            {/* 키워드 태그들을 상단에 배치 */}
                                            {space.keywords && space.keywords.length > 0 && (
                                                <div className="space-keywords-detail">
                                                    {space.keywords.map((keyword, idx) => (
                                                        <span key={idx} className="keyword-tag-detail">
                                                            {keyword}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* 공간 소개를 더 간결하게 표시 */}
                                            <p className="space-intro-detail">
                                                {space.introduction && space.introduction.length > 100
                                                    ? space.introduction.substring(0, 100) + "..."
                                                    : space.introduction || "청년들을 위한 다양한 활동을 지원하는 공간입니다."}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-results">
                                <p>🔍 검색 조건에 맞는 공간이 없습니다.</p>
                                <p>다른 검색어나 지역을 선택해보세요.</p>
                            </div>
                        )}
                    </div>

                    <div className="search-footer">
                        <p className="result-count">
                            {filteredSpaces.length !== spacesData.length
                                ? `검색 결과: ${filteredSpaces.length}개 공간`
                                : `전체: ${spacesData.length}개 공간`
                            }
                        </p>
                        <p className="usage-tip">
                            💡 <b>사용법:</b> 원하는 공간을 클릭하면 채팅으로 상세 정보가 전송됩니다!
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

export default SpaceListView;