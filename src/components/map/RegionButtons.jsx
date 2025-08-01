import React from 'react';
import {BUSAN_REGIONS_PROGRAMS} from '../../utils/constants';

const RegionButtons = ({onButtonClick}) => {
    return (
        <div className="sub-buttons-container">
            <div className="sub-buttons-title">📍 지역을 선택해주세요</div>
            <div className="regions-grid-4x4">
                {BUSAN_REGIONS_PROGRAMS.map((region, index) => (
                    <button
                        key={index}
                        className="region-program-button"
                        onClick={() => onButtonClick(region)}
                    >
                        {region}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default RegionButtons;