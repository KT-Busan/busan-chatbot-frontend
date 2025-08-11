import React, {useState, useEffect} from 'react';
import axios from 'axios';
import '../../styles/components/space-detail-search.css';

const SpaceDetailSearch = ({onButtonClick, anonymousId}) => {
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedCapacity, setSelectedCapacity] = useState('');
    const [selectedPurpose, setSelectedPurpose] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState(null);
    const [showConditions, setShowConditions] = useState(false);

    const [mode, setMode] = useState('reservation'); // 'reservation' 또는 'detail'
    const [spacesData, setSpacesData] = useState([]);
    const [filteredSpaces, setFilteredSpaces] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [detailSelectedRegion, setDetailSelectedRegion] = useState('전체');
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState(null);

    const [showRandomResult, setShowRandomResult] = useState(false);

    const regions = [
        '강서구', '금정구', '기장군', '남구', '동구', '동래구', '부산진구', '북구',
        '사상구', '사하구', '서구', '수영구', '연제구', '영도구', '중구', '해운대구'
    ];

    const capacities = [
        {value: '1-2명', icon: '👤', label: '1–2명'},
        {value: '3-6명', icon: '👥', label: '3–6명'},
        {value: '7명이상', icon: '👨‍👩‍👧‍👦', label: '7명 이상'},
        {value: '상관없음', icon: '❓', label: '상관없음'}
    ];

    const purposes = [
        {value: '교육/강연', icon: '🎤', label: '교육/강연'},
        {value: '문화/창작', icon: '🎨', label: '문화/창작'},
        {value: '스터디/회의', icon: '📝', label: '스터디/회의'},
        {value: '작업/창작실', icon: '🛠', label: '작업/창작실'},
        {value: '진로/창업', icon: '🚀', label: '진로/창업'},
        {value: '커뮤니티', icon: '👥', label: '커뮤니티'},
        {value: '행사/이벤트', icon: '🎪', label: '행사/이벤트'},
        {value: '휴식/놀이', icon: '🧘', label: '휴식/놀이'}
    ];

    useEffect(() => {
        if (mode === 'detail') {
            loadSpacesData();
        }
    }, [mode]);

    useEffect(() => {
        if (mode === 'detail') {
            let filtered = spacesData;

            if (detailSelectedRegion !== '전체') {
                filtered = filtered.filter(space => space.location === detailSelectedRegion);
            }

            if (searchTerm) {
                filtered = filtered.filter(space =>
                    (space.space_name && space.space_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (space.parent_facility && space.parent_facility.toLowerCase().includes(searchTerm.toLowerCase()))
                );
            }

            setFilteredSpaces(filtered);
        }
    }, [spacesData, searchTerm, detailSelectedRegion, mode]);

    const getBackendUrl = () => {
        const hostname = window.location.hostname;
        console.log('🔍 현재 호스트:', hostname);

        if (hostname.includes('github.io') || hostname.includes('kt-busan.github.io')) {
            console.log('🌐 GitHub Pages - Render 백엔드 사용');
            return 'https://b-bot-backend.onrender.com';
        }

        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            console.log('🏠 로컬 개발 환경');
            return 'http://localhost:5001';
        }

        console.log('🌐 기본 프로덕션 환경');
        return 'https://b-bot-backend.onrender.com';
    };

    const loadSpacesData = async () => {
        setLoading(true);
        setLoadError(null);

        try {
            const backendUrl = getBackendUrl();
            console.log('🔗 백엔드 URL:', backendUrl);

            console.log('📡 백엔드 API 호출 시도...');
            const response = await axios.get(`${backendUrl}/api/spaces/busan-youth`, {
                timeout: 15000
            });

            if (response.data && response.data.success && response.data.data) {
                setSpacesData(response.data.data);
                setFilteredSpaces(response.data.data);
                console.log(`✅ 백엔드에서 ${response.data.count}개 데이터 로드 성공`);
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

    const handleSearch = async () => {
        if (!selectedRegion && !selectedCapacity && !selectedPurpose) {
            alert('지역, 인원, 이용 목적 중 하나는 반드시 선택해주세요.');
            return;
        }

        const finalAnonymousId = anonymousId || `temp_user_${Date.now()}`;

        setShowConditions(true);
        setIsSearching(true);
        setSearchResults(null);
        setShowRandomResult(false);

        try {
            const searchConditions = [];
            if (selectedRegion) searchConditions.push(`지역=${selectedRegion}`);
            if (selectedCapacity) searchConditions.push(`인원=${selectedCapacity}`);
            if (selectedPurpose) searchConditions.push(`목적=${selectedPurpose}`);

            const searchMessage = `조건별 검색: ${searchConditions.join('|')}`;
            const chatId = `search_${Date.now()}`;

            const requestData = {
                message: searchMessage,
                anonymousId: finalAnonymousId,
                chatId: chatId
            };

            console.log('🔍 검색 요청:', searchMessage);

            const isGitHubPages = window.location.hostname.includes('github.io');
            const backendUrl = 'https://b-bot-backend.onrender.com';

            let apiUrl;
            if (isGitHubPages || !window.location.hostname.includes('localhost')) {
                apiUrl = `${backendUrl}/api/chat`;
            } else {
                apiUrl = '/api/chat';
            }

            console.log('📡 사용할 API URL:', apiUrl);

            const response = await axios.post(apiUrl, requestData, {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 30000,
            });

            console.log('📥 백엔드 응답:', response.data);

            if (response.data && response.data.reply) {
                onButtonClick('__BOT_RESPONSE__' + response.data.reply);

                setSearchResults({
                    success: true,
                    message: '검색 결과를 표시했습니다!',
                    conditions: {
                        region: selectedRegion,
                        capacity: selectedCapacity,
                        purpose: selectedPurpose
                    }
                });
            } else {
                throw new Error('검색 응답을 받지 못했습니다.');
            }

        } catch (error) {
            console.error('❌ 검색 중 오류:', error);
            console.error('❌ 요청 URL:', error.config?.url);

            let errorMessage = '검색 중 오류가 발생했습니다.';

            if (error.code === 'ECONNABORTED') {
                errorMessage = '요청 시간이 초과되었습니다. Render 서버가 깨어나는 중일 수 있습니다.';
            } else if (error.response?.status === 404) {
                errorMessage = 'API 엔드포인트를 찾을 수 없습니다. 백엔드 서버를 확인해주세요.';
            } else if (error.response?.status === 500) {
                errorMessage = '서버 내부 오류가 발생했습니다.';
            } else if (!error.response) {
                errorMessage = '백엔드 서버에 연결할 수 없습니다. 서버 상태를 확인해주세요.';
            }

            setSearchResults({
                success: false,
                message: errorMessage,
                conditions: {
                    region: selectedRegion,
                    capacity: selectedCapacity,
                    purpose: selectedPurpose
                }
            });
        } finally {
            setIsSearching(false);
        }
    };

    const handleRandomRecommendation = async () => {
        setIsSearching(true);

        try {
            const finalAnonymousId = anonymousId || `temp_user_${Date.now()}`;

            const isGitHubPages = window.location.hostname.includes('github.io');
            const backendUrl = 'https://b-bot-backend.onrender.com';

            let apiUrl;
            if (isGitHubPages || !window.location.hostname.includes('localhost')) {
                apiUrl = `${backendUrl}/api/chat`;
            } else {
                apiUrl = '/api/chat';
            }

            const response = await axios.post(apiUrl, {
                message: '✨ 랜덤 추천',
                anonymousId: finalAnonymousId,
                chatId: `random_${Date.now()}`
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 30000,
            });

            if (response.data && response.data.reply) {
                onButtonClick('__BOT_RESPONSE__' + response.data.reply);

                setShowRandomResult(true);
                setSearchResults(null);
                setShowConditions(false);
            } else {
                throw new Error('랜덤 추천 응답을 받지 못했습니다.');
            }

        } catch (error) {
            console.error('랜덤 추천 중 오류:', error);

            let errorMessage = '랜덤 추천 중 오류가 발생했습니다.';
            if (error.code === 'ECONNABORTED') {
                errorMessage = '요청 시간이 초과되었습니다. 서버가 준비 중일 수 있습니다.';
            }

            setSearchResults({
                success: false,
                message: errorMessage,
                isRandom: true
            });
        } finally {
            setIsSearching(false);
        }
    };

    const resetSearch = () => {
        setSelectedRegion('');
        setSelectedCapacity('');
        setSelectedPurpose('');
        setShowConditions(false);
        setSearchResults(null);
        setIsSearching(false);
        setShowRandomResult(false);
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

    const sortedDetailRegions = mode === 'detail' ?
        ['전체', ...Array.from(new Set(spacesData.map(space => space.location))).sort((a, b) => a.localeCompare(b, 'ko'))] : [];

    return (
        <div className="space-detail-search">
            {/* 모드 선택 탭 */}
            <div className="mode-tabs">
                <button
                    className={`mode-tab ${mode === 'reservation' ? 'active' : ''}`}
                    onClick={() => setMode('reservation')}
                >
                    🔍 조건별 검색
                </button>
                <button
                    className={`mode-tab ${mode === 'detail' ? 'active' : ''}`}
                    onClick={() => setMode('detail')}
                >
                    📋 전체 공간 보기
                </button>
            </div>

            {/* 조건별 검색 모드 */}
            {mode === 'reservation' && (
                <>
                    <div className="search-header">
                        <h3>💬 청년 공간 조건별 검색</h3>
                        <p>아래 조건을 선택하여 나에게 딱 맞는 청년 공간을 찾을 수 있어요!</p>
                        <p>대관 가능 여부와 링크도 함께 확인할 수 있어요.</p>
                    </div>

                    {!showConditions && !searchResults && !showRandomResult && (
                        <div className="search-filters-container">
                            <div className="filter-section">
                                <label>지역 선택</label>
                                <select
                                    value={selectedRegion}
                                    onChange={(e) => setSelectedRegion(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="">지역 선택</option>
                                    {regions.map(region => (
                                        <option key={region} value={region}>{region}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="filter-section">
                                <label>인원 선택</label>
                                <select
                                    value={selectedCapacity}
                                    onChange={(e) => setSelectedCapacity(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="">인원 선택</option>
                                    {capacities.map(capacity => (
                                        <option key={capacity.value} value={capacity.value}>
                                            {capacity.icon} {capacity.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="filter-section">
                                <label>이용 목적 선택</label>
                                <select
                                    value={selectedPurpose}
                                    onChange={(e) => setSelectedPurpose(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="">목적 선택</option>
                                    {purposes.map(purpose => (
                                        <option key={purpose.value} value={purpose.value}>
                                            {purpose.icon} {purpose.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="filter-section">
                                <button
                                    className="search-detail-btn"
                                    onClick={handleSearch}
                                    disabled={!selectedRegion && !selectedCapacity && !selectedPurpose}
                                >
                                    🔎 검색 결과 보기
                                </button>
                            </div>

                            <div className="filter-section">
                                <button
                                    className="random-recommend-btn-main"
                                    onClick={handleRandomRecommendation}
                                    disabled={isSearching}
                                >
                                    🎲 랜덤 추천
                                </button>
                            </div>
                        </div>
                    )}

                    {showConditions && !searchResults && (
                        <div className="search-status">
                            <div className="selected-conditions">
                                <h4>✅ 선택하신 조건</h4>
                                <ul>
                                    <li>• 지역 : {selectedRegion || '선택하지 않음'}</li>
                                    <li>• 인원 : {selectedCapacity || '선택하지 않음'}</li>
                                    <li>• 목적 : {selectedPurpose || '선택하지 않음'}</li>
                                </ul>
                            </div>

                            {isSearching && (
                                <div className="searching-status">
                                    <div className="loading-spinner"></div>
                                    <p>🔎 조건에 맞는 공간을 찾고 있어요...</p>
                                </div>
                            )}
                        </div>
                    )}

                    {searchResults && (
                        <div className="search-results">
                            <div className="results-header">
                                <h4>{searchResults.success ? '✅ 검색 완료!' : '❌ 검색 실패'}</h4>
                                <p>{searchResults.message}</p>
                            </div>

                            <div className="recommendation-section">
                                <p>다른 공간을 보고싶다면?</p>
                                <div className="action-buttons">
                                    <button
                                        className="random-recommend-btn"
                                        onClick={handleRandomRecommendation}
                                        disabled={isSearching}
                                    >
                                        🎲 랜덤 추천
                                    </button>
                                    <button
                                        className="new-search-btn"
                                        onClick={resetSearch}
                                    >
                                        🔄 새로 검색하기
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {showRandomResult && (
                        <div className="additional-random-section">
                            <p>💡 다른 랜덤 공간이 궁금하시다면?</p>
                            <div style={{display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap'}}>
                                <button
                                    className="additional-random-btn"
                                    onClick={handleRandomRecommendation}
                                    disabled={isSearching}
                                >
                                    🎲 다시 랜덤 추천
                                </button>
                                <button
                                    className="new-search-btn"
                                    onClick={resetSearch}
                                >
                                    🔄 새로 검색하기
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* 전체 공간 보기 모드 */}
            {mode === 'detail' && (
                <>
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
                                        value={detailSelectedRegion}
                                        onChange={(e) => setDetailSelectedRegion(e.target.value)}
                                        className="region-select"
                                    >
                                        {sortedDetailRegions.map(region => (
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
                                    💡 <strong>사용법:</strong> 원하는 공간을 클릭하면 채팅으로 상세 정보가 전송됩니다!
                                </p>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default SpaceDetailSearch;