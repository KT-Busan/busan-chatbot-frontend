import React, {useState, useEffect} from 'react';
import axios from 'axios';
import '../../styles/components/space-detail-search.css';

const SpaceDetailSearch = ({onButtonClick, anonymousId}) => {
    // 기존 예약 기능 상태들
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedCapacity, setSelectedCapacity] = useState('');
    const [selectedPurpose, setSelectedPurpose] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState(null);
    const [showConditions, setShowConditions] = useState(false);

    // 새로 추가: 상세 보기 기능 상태들
    const [mode, setMode] = useState('reservation'); // 'reservation' 또는 'detail'
    const [spacesData, setSpacesData] = useState([]);
    const [filteredSpaces, setFilteredSpaces] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [detailSelectedRegion, setDetailSelectedRegion] = useState('전체');
    const [loading, setLoading] = useState(false);

    const regions = [
        '중구', '서구', '동구', '영도구', '부산진구', '동래구', '연제구', '금정구',
        '북구', '사상구', '사하구', '강서구', '남구', '해운대구', '수영구', '기장군'
    ];

    const capacities = [
        {value: '1-2명', icon: '👤', label: '1–2명'},
        {value: '3-6명', icon: '👥', label: '3–6명'},
        {value: '7명이상', icon: '👨‍👩‍👧‍👦', label: '7명 이상'},
        {value: '상관없음', icon: '❓', label: '상관없음'}
    ];

    const purposes = [
        {value: '스터디/회의', icon: '📝', label: '스터디/회의'},
        {value: '교육/강연', icon: '🎤', label: '교육/강연'},
        {value: '커뮤니티', icon: '👥', label: '커뮤니티'},
        {value: '진로/창업', icon: '🚀', label: '진로/창업'},
        {value: '문화/창작', icon: '🎨', label: '문화/창작'},
        {value: '작업/창작실', icon: '🛠', label: '작업/창작실'},
        {value: '휴식/놀이', icon: '🧘', label: '휴식/놀이'},
        {value: '행사/이벤트', icon: '🎪', label: '행사/이벤트'}
    ];

    // 상세 모드일 때 데이터 로드
    useEffect(() => {
        if (mode === 'detail') {
            loadSpacesData();
        }
    }, [mode]);

    // 상세 모드 검색 및 필터링
    useEffect(() => {
        if (mode === 'detail') {
            let filtered = spacesData;

            // 지역 필터
            if (detailSelectedRegion !== '전체') {
                filtered = filtered.filter(space => space.location === detailSelectedRegion);
            }

            // 검색어 필터
            if (searchTerm) {
                filtered = filtered.filter(space =>
                    (space.space_name && space.space_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (space.parent_facility && space.parent_facility.toLowerCase().includes(searchTerm.toLowerCase()))
                );
            }

            setFilteredSpaces(filtered);
        }
    }, [spacesData, searchTerm, detailSelectedRegion, mode]);

    const loadSpacesData = async () => {
        setLoading(true);
        try {
            // 백엔드 API 호출로 변경
            const response = await axios.get('/api/spaces/busan-youth');
            if (response.data && response.data.success) {
                setSpacesData(response.data.data || []);
                setFilteredSpaces(response.data.data || []);
                console.log(`✅ ${response.data.count}개 청년공간 데이터 로드 완료`);
            } else {
                throw new Error('API 응답 형식 오류');
            }
        } catch (error) {
            console.error('데이터 로드 오류:', error);
            setSpacesData([]);
            setFilteredSpaces([]);

            // 백엔드 연결 실패 시 프론트엔드 fallback
            try {
                console.log('🔄 Fallback: JSON 파일에서 직접 로드 시도...');
                const fallbackResponse = await fetch('/config/spaces_busan_youth.json');
                if (fallbackResponse.ok) {
                    const result = await fallbackResponse.json();
                    if (result.spaces_busan_youth) {
                        setSpacesData(result.spaces_busan_youth || []);
                        setFilteredSpaces(result.spaces_busan_youth || []);
                        console.log(`✅ Fallback으로 ${result.spaces_busan_youth.length}개 데이터 로드`);
                    }
                }
            } catch (fallbackError) {
                console.error('Fallback도 실패:', fallbackError);
            }
        } finally {
            setLoading(false);
        }
    };

    // 조건별 검색 기능
    const handleSearch = async () => {
        if (!selectedRegion && !selectedCapacity && !selectedPurpose) {
            alert('지역, 인원, 이용 목적 중 하나는 반드시 선택해주세요.');
            return;
        }

        const finalAnonymousId = anonymousId || `temp_user_${Date.now()}`;

        setShowConditions(true);
        setIsSearching(true);
        setSearchResults(null);

        try {
            // 조건을 문자열로 조합하여 백엔드에 전송
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

            // 백엔드 API 호출
            const response = await axios.post('/api/chat', requestData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('📥 백엔드 응답:', response.data);

            if (response.data && response.data.reply) {
                // 검색 결과를 봇 응답으로 표시하기 위해 특별한 형태로 전송
                // 사용자 메시지는 보내지 않고, 봇 응답만 직접 표시
                const botResponseMessage = {
                    sender: 'bot',
                    text: response.data.reply
                };

                // 부모 컴포넌트로 봇 응답을 직접 전달
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

            let errorMessage = '검색 중 오류가 발생했습니다.';
            if (error.response?.status === 400) {
                errorMessage = `요청 데이터 오류 (400): ${error.response.data.error || '알 수 없는 오류'}`;
            } else if (error.response?.status === 500) {
                errorMessage = '서버 내부 오류가 발생했습니다.';
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
            const response = await axios.post('/api/chat', {
                message: '✨ 랜덤 추천',
                anonymousId: anonymousId,
                chatId: `random_${Date.now()}` // 임시 채팅 ID
            });

            if (response.data && response.data.reply) {
                // 랜덤 추천 결과를 채팅으로 전송
                onButtonClick(response.data.reply);

                setSearchResults({
                    success: true,
                    message: '랜덤 추천 결과를 채팅으로 전송했습니다!',
                    isRandom: true
                });
                setShowConditions(false); // 랜덤 추천 시에는 조건 숨김
            } else {
                throw new Error('랜덤 추천 응답을 받지 못했습니다.');
            }

        } catch (error) {
            console.error('랜덤 추천 중 오류:', error);
            setSearchResults({
                success: false,
                message: '랜덤 추천 중 오류가 발생했습니다. 다시 시도해주세요.',
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
    };

    // 새로 추가: 상세 정보 포맷팅
    const formatSpaceDetail = (space) => {
        const parent_facility = space.parent_facility || '정보없음';
        const space_name = space.space_name || '정보없음';
        const location = space.location || '정보없음';
        const introduction = space.introduction || '정보없음';
        const eligibility = space.eligibility || '정보없음';
        const features = space.features || '정보없음';
        const link = Array.isArray(space.link) ? space.link[0] : space.link || '정보없음';

        // 인원 정보 포맷팅
        let capacity_info = "인원 제한 없음";
        if (space.capacity_min && space.capacity_max) {
            capacity_info = `최소 ${space.capacity_min}명 ~ 최대 ${space.capacity_max}명`;
        } else if (space.capacity_max) {
            capacity_info = `최대 ${space.capacity_max}명`;
        } else if (space.capacity_min) {
            capacity_info = `최소 ${space.capacity_min}명`;
        }

        return `**1️⃣ ${parent_facility} – ${space_name}**
${introduction}
• 📍 **위치 :** ${location}
• 👥 **인원 :** ${capacity_info}
• **지원 대상 :** ${eligibility}
• 🧰 **특징 :** ${features}
${link !== '정보없음' ? `• 🔗 **링크 :** ${link}` : ''}`;
    };

    // 새로 추가: 공간 클릭 시 상세 정보를 채팅으로 전송
    const handleSpaceClick = (space) => {
        const detailMessage = formatSpaceDetail(space);
        onButtonClick(detailMessage);
    };

    // 지역 목록 생성 (상세 모드용)
    const detailRegions = mode === 'detail' ?
        ['전체', ...new Set(spacesData.map(space => space.location))].sort() : [];

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

            {/* 예약 모드 (기존 기능) */}
            {mode === 'reservation' && (
                <>
                    <div className="search-header">
                        <h3>💬 청년 공간 조건별 검색</h3>
                        <p>아래 조건을 선택하여 나에게 딱 맞는 청년 공간을 찾을 수 있어요!</p>
                        <p>대관 가능 여부와 링크도 함께 확인할 수 있어요.</p>
                    </div>

                    {!showConditions && !searchResults && (
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
                                <button
                                    className="random-recommend-btn"
                                    onClick={handleRandomRecommendation}
                                    disabled={isSearching}
                                >
                                    ✨ 랜덤 추천
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

            {/* 상세 모드 (새로 추가) */}
            {mode === 'detail' && (
                <>
                    <div className="search-header">
                        <h3>🏢 부산 청년 공간 상세 정보</h3>
                        <p>원하는 공간을 클릭하면 상세 정보를 확인할 수 있습니다!</p>
                        {spacesData.length > 0 && (
                            <p className="data-count">총 <strong>{spacesData.length}개</strong>의 청년 공간 정보</p>
                        )}
                    </div>

                    {loading ? (
                        <div className="loading">
                            <p>🔄 청년 공간 데이터를 불러오는 중...</p>
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
                                        {detailRegions.map(region => (
                                            <option key={region} value={region}>{region}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* 검색 결과 */}
                            <div className="spaces-list">
                                {filteredSpaces.length > 0 ? (
                                    <div className="spaces-grid">
                                        {filteredSpaces.map((space, index) => (
                                            <div
                                                key={index}
                                                className="space-card"
                                                onClick={() => handleSpaceClick(space)}
                                            >
                                                <div className="space-card-header">
                                                    <h4>{space.parent_facility}</h4>
                                                    <span className="space-name">{space.space_name}</span>
                                                </div>
                                                <div className="space-card-content">
                                                    <p className="space-location">📍 {space.location}</p>
                                                    <p className="space-intro-short">{space.introduction?.slice(0, 80)}...</p>
                                                    {space.keywords && (
                                                        <div className="space-keywords">
                                                            {space.keywords.slice(0, 3).map((keyword, idx) => (
                                                                <span key={idx} className="keyword-tag">{keyword}</span>
                                                            ))}
                                                        </div>
                                                    )}
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