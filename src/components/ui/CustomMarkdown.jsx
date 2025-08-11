import React from 'react';
import ReactMarkdown from 'react-markdown';
import BusanMap from '../map/BusanMap';
import KeywordButtons from '../ui/KeywordButtons';
import ProgramRegionButtons from '../ui/ProgramRegionButtons';
import SpaceDetailSearch from '../ui/SpaceDetailSearch';

const CustomMarkdown = ({children, onButtonClick, spacesData, anonymousId}) => {
    if (!children) return null;

    if (children.includes('[REGION_MAP]')) {
        return (
            <BusanMap
                onRegionClick={onButtonClick}
                spacesData={spacesData}
            />
        );
    }

    if (children.includes('[KEYWORD_BUTTONS]')) {
        return (
            <KeywordButtons onButtonClick={onButtonClick}/>
        );
    }

    if (children.includes('[PROGRAM_REGIONS]')) {
        return (
            <ProgramRegionButtons onButtonClick={onButtonClick}/>
        );
    }

    if (children.includes('[SPACE_DETAIL_SEARCH]')) {
        return (
            <SpaceDetailSearch
                onButtonClick={onButtonClick}
                anonymousId={anonymousId}
            />
        );
    }

    if (children.includes('[SHOW_ADDITIONAL_RANDOM]')) {
        const contentWithoutMarker = children.replace('[SHOW_ADDITIONAL_RANDOM]', '');

        return (
            <div className="custom-markdown">
                <ReactMarkdown
                    components={{
                        a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer"/>
                    }}
                >
                    {contentWithoutMarker}
                </ReactMarkdown>

                {/* 랜덤 추천 */}
                <div className="markdown-additional-random-section">
                    <p className="markdown-additional-random-text">
                        💡 다른 랜덤 공간이 궁금하시다면?
                    </p>
                    <div style={{display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap'}}>
                        <button
                            className="markdown-additional-random-btn"
                            onClick={() => onButtonClick('✨ 랜덤 추천')}
                        >
                            🎲 다시 랜덤 추천
                        </button>
                        <button
                            className="markdown-additional-random-btn"
                            onClick={() => onButtonClick('청년 공간 상세')}
                        >
                            🔄 새로 검색하기
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (children.includes('[SHOW_CONDITIONAL_SEARCH_BUTTONS]')) {
        const contentWithoutMarker = children.replace('[SHOW_CONDITIONAL_SEARCH_BUTTONS]', '');

        return (
            <div className="custom-markdown">
                <ReactMarkdown
                    components={{
                        a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer"/>
                    }}
                >
                    {contentWithoutMarker}
                </ReactMarkdown>

                {/* 조건별 검색 결과 후 랜덤 추천 버튼 섹션 */}
                <div className="markdown-additional-random-section">
                    <p className="markdown-additional-random-text">
                        💡 다른 공간을 보고싶다면?
                    </p>
                    <div style={{display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap'}}>
                        <button
                            className="markdown-additional-random-btn"
                            onClick={() => onButtonClick('✨ 랜덤 추천')}
                        >
                            🎲 랜덤 추천
                        </button>
                        <button
                            className="markdown-additional-random-btn"
                            onClick={() => onButtonClick('청년 공간 상세')}
                        >
                            🔄 새로 검색하기
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="custom-markdown">
            <ReactMarkdown
                components={{
                    a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer"/>
                }}
            >
                {children}
            </ReactMarkdown>
        </div>
    );
};

export default CustomMarkdown;