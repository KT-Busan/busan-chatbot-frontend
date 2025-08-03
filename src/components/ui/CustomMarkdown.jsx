import React from 'react';
import ReactMarkdown from 'react-markdown';
import BusanMap from '../map/BusanMap';
import KeywordButtons from '../ui/KeywordButtons';
import ProgramRegionButtons from '../ui/ProgramRegionButtons';
import SpaceDetailSearch from '../ui/SpaceDetailSearch';
import {removeMarker} from '../../utils/helpers';

const CustomMarkdown = ({children, onButtonClick, spacesData}) => {
    // children이 없으면 null 반환
    if (!children) return null;

    // 행정구역별 확인하기 마커 확인 및 지도 컴포넌트 표시
    if (children.includes('[REGION_MAP]')) {
        return (
            <BusanMap
                onRegionClick={onButtonClick}
                spacesData={spacesData}
            />
        );
    }

    // 키워드별 확인하기 마커 확인 및 키워드 버튼들 표시
    if (children.includes('[KEYWORD_BUTTONS]')) {
        return (
            <KeywordButtons onButtonClick={onButtonClick}/>
        );
    }

    // 프로그램 지역 선택 마커 확인 및 지역 버튼들 표시
    if (children.includes('[PROGRAM_REGIONS]')) {
        return (
            <ProgramRegionButtons onButtonClick={onButtonClick}/>
        );
    }

    // 청년 공간 상세 검색 마커 확인 및 상세 검색 컴포넌트 표시
    if (children.includes('[SPACE_DETAIL_SEARCH]')) {
        return (
            <SpaceDetailSearch onButtonClick={onButtonClick}/>
        );
    }

    // 마커가 없는 경우 기본 마크다운 렌더링
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