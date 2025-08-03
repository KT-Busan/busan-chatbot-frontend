import React, {useState} from 'react';

const SpaceDetailSearch = ({onButtonClick}) => {
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedCapacity, setSelectedCapacity] = useState('');
    const [selectedPurpose, setSelectedPurpose] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState(null);
    const [showConditions, setShowConditions] = useState(false);

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

    const handleSearch = async () => {
        if (!selectedRegion && !selectedCapacity && !selectedPurpose) {
            alert('지역, 인원, 이용 목적 중 하나는 반드시 선택해주세요.');
            return;
        }

        setShowConditions(true);
        setIsSearching(true);
        setSearchResults(null);

        // 3초 후 검색 결과 표시 (실제로는 백엔드 API 호출)
        setTimeout(() => {
            // 예시 데이터
            const mockResults = [
                {
                    id: 1,
                    name: '부산청년센터',
                    type: '회의실',
                    location: '부산진구 중앙대로 708',
                    capacity: '최대 12명',
                    features: '스터디 및 회의 적합 | 빔프로젝터, 화이트보드 구비 | 무료',
                    link: 'https://young.busan.go.kr'
                },
                {
                    id: 2,
                    name: '해운대청년공간',
                    type: '스터디룸',
                    location: '해운대구 해운대로 570',
                    capacity: '최대 8명',
                    features: '스터디 및 모임 적합 | 개인사물함, 와이파이 구비 | 유료(시간당 5,000원)',
                    link: 'https://example.com/haeundae'
                },
                {
                    id: 3,
                    name: '사상청년창작소',
                    type: '창작공간',
                    location: '사상구 광장로 12',
                    capacity: '최대 15명',
                    features: '창작 및 워크샵 적합 | 3D프린터, 레이저커터 구비 | 유료(일일 10,000원)',
                    link: 'https://example.com/sasang'
                }
            ];

            setSearchResults(mockResults);
            setIsSearching(false);
        }, 3000);
    };

    const handleRandomRecommendation = () => {
        // 랜덤 추천 기능 (백엔드에서 랜덤 공간 1개 받아올 예정)
        const randomSpace = {
            id: 99,
            name: '금정청년허브',
            type: '다목적룸',
            location: '금정구 부산대학로 63번길 2',
            capacity: '최대 20명',
            features: '다목적 활동 적합 | 음향시설, 빔프로젝터 구비 | 무료',
            link: 'https://example.com/geumjeong'
        };

        setSearchResults([randomSpace]);
        setShowConditions(false);
    };

    const resetSearch = () => {
        setSelectedRegion('');
        setSelectedCapacity('');
        setSelectedPurpose('');
        setShowConditions(false);
        setSearchResults(null);
        setIsSearching(false);
    };

    return (
        <div className="space-detail-search">
            <div className="search-header">
                <h3>💬 청년 공간 상세 검색</h3>
                <p>아래 조건을 선택하여 나에게 딱 맞는 청년 공간을 찾을 수 있어요!</p>
                <p>대관 가능 여부와 링크도 함께 확인할 수 있어요.</p>
            </div>

            {!showConditions && !searchResults && (
                <div className="search-filters-container">
                    {/* 지역 선택 */}
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

                    {/* 인원 선택 */}
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

                    {/* 이용 목적 선택 */}
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

                    {/* 검색 버튼 */}
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

            {/* 선택된 조건 및 검색 중 상태 */}
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

            {/* 검색 결과 */}
            {searchResults && (
                <div className="search-results">
                    <div className="results-header">
                        <h4>📌 총 {searchResults.length}개의 공간을 찾았어요!</h4>
                    </div>

                    <div className="results-list">
                        {searchResults.map((space, index) => (
                            <div key={space.id} className="result-item">
                                <div className="space-header">
                                    <h5>{index + 1}️⃣ {space.name} – {space.type}</h5>
                                </div>
                                <div className="space-details">
                                    <p>• 📍 위치 : {space.location}</p>
                                    <p>• 👥 인원 : {space.capacity}</p>
                                    <p>• 🧰 특징 : {space.features}</p>
                                    <p>• 🔗 링크 : <a href={space.link} target="_blank"
                                                   rel="noopener noreferrer">{space.link}</a></p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="recommendation-section">
                        <p>다른 공간을 보고싶다면?</p>
                        <button
                            className="random-recommend-btn"
                            onClick={handleRandomRecommendation}
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
        </div>
    );
};

export default SpaceDetailSearch;