import React from 'react';
import BusanMap from '../map/BusanMap';
import SpaceConditionSearch from '../ui/SpaceConditionSearch';
import SpaceListView from '../ui/SpaceListView';
import ProgramRegionButtons from '../ui/ProgramRegionButtons';
import ConditionalSearchButtons from '../ui/ConditionalSearchButtons';
import CenterListView from '../ui/CenterListView';
import CenterDetailView from '../ui/CenterDetailView';

const CustomMarkdown = ({children, onButtonClick, spacesData, anonymousId}) => {
    if (children === '[SPACE_LIST_VIEW]') {
        return <SpaceListView onButtonClick={onButtonClick} anonymousId={anonymousId}/>;
    }

    if (children === '[CENTER_LIST_VIEW]') {
        return <CenterListView onButtonClick={onButtonClick} anonymousId={anonymousId}/>;
    }

    if (children === '[REGION_MAP]') {
        return <BusanMap onRegionClick={onButtonClick} spacesData={spacesData}/>;
    }

    if (children === '[SPACE_CONDITION_SEARCH]') {
        return <SpaceConditionSearch onButtonClick={onButtonClick} anonymousId={anonymousId}/>;
    }

    if (children === '[PROGRAM_REGIONS]') {
        return <ProgramRegionButtons onButtonClick={onButtonClick}/>;
    }

    if (children === '[SHOW_CONDITIONAL_SEARCH_BUTTONS]') {
        return <ConditionalSearchButtons onButtonClick={onButtonClick} anonymousId={anonymousId}/>;
    }

    if (children === '[SHOW_ADDITIONAL_RANDOM]') {
        return <ConditionalSearchButtons onButtonClick={onButtonClick} anonymousId={anonymousId}/>;
    }

    if (typeof children === 'string' && children.startsWith('[CENTER_RENTAL_SPACES:')) {
        const centerName = children.replace('[CENTER_RENTAL_SPACES:', '').replace(']', '');
        return <CenterDetailView centerName={centerName} onButtonClick={onButtonClick} anonymousId={anonymousId}/>;
    }

    if (typeof children === 'string' && children.includes('[SPACE_CONDITION_SEARCH]')) {
        const parts = children.split('[SPACE_CONDITION_SEARCH]');
        return (
            <div>
                {parts[0] && <CustomMarkdown onButtonClick={onButtonClick} spacesData={spacesData}
                                             anonymousId={anonymousId}>{parts[0]}</CustomMarkdown>}
                <SpaceConditionSearch onButtonClick={onButtonClick} anonymousId={anonymousId}/>
                {parts[1] && <CustomMarkdown onButtonClick={onButtonClick} spacesData={spacesData}
                                             anonymousId={anonymousId}>{parts[1]}</CustomMarkdown>}
            </div>
        );
    }

    if (typeof children === 'string' && children.includes('[SHOW_CONDITIONAL_SEARCH_BUTTONS]')) {
        const parts = children.split('[SHOW_CONDITIONAL_SEARCH_BUTTONS]');
        return (
            <div>
                {parts[0] && <CustomMarkdown onButtonClick={onButtonClick} spacesData={spacesData}
                                             anonymousId={anonymousId}>{parts[0]}</CustomMarkdown>}
                <ConditionalSearchButtons onButtonClick={onButtonClick} anonymousId={anonymousId}/>
                {parts[1] && <CustomMarkdown onButtonClick={onButtonClick} spacesData={spacesData}
                                             anonymousId={anonymousId}>{parts[1]}</CustomMarkdown>}
            </div>
        );
    }

    if (typeof children === 'string' && children.includes('[SHOW_ADDITIONAL_RANDOM]')) {
        const parts = children.split('[SHOW_ADDITIONAL_RANDOM]');
        return (
            <div>
                {parts[0] && <CustomMarkdown onButtonClick={onButtonClick} spacesData={spacesData}
                                             anonymousId={anonymousId}>{parts[0]}</CustomMarkdown>}
                <ConditionalSearchButtons onButtonClick={onButtonClick} anonymousId={anonymousId}/>
                {parts[1] && <CustomMarkdown onButtonClick={onButtonClick} spacesData={spacesData}
                                             anonymousId={anonymousId}>{parts[1]}</CustomMarkdown>}
            </div>
        );
    }

    if (typeof children === 'string' && children.includes('[CENTER_RENTAL_SPACES:')) {
        const parts = children.split(/(\[CENTER_RENTAL_SPACES:[^\]]+\])/);
        return (
            <div>
                {parts.map((part, index) => {
                    if (part.startsWith('[CENTER_RENTAL_SPACES:')) {
                        const centerName = part.replace('[CENTER_RENTAL_SPACES:', '').replace(']', '');
                        return <CenterDetailView key={index} centerName={centerName} onButtonClick={onButtonClick}
                                                 anonymousId={anonymousId}/>;
                    } else if (part.trim()) {
                        return <CustomMarkdown key={index} onButtonClick={onButtonClick} spacesData={spacesData}
                                               anonymousId={anonymousId}>{part}</CustomMarkdown>;
                    }
                    return null;
                })}
            </div>
        );
    }

    const processText = (text) => {
        if (typeof text !== 'string') {
            return text;
        }

        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const linkParts = [];
        let lastLinkIndex = 0;
        let linkMatch;

        while ((linkMatch = linkRegex.exec(text)) !== null) {
            if (linkMatch.index > lastLinkIndex) {
                linkParts.push(text.slice(lastLinkIndex, linkMatch.index));
            }

            linkParts.push(
                <a
                    key={`link-${linkMatch.index}`}
                    href={linkMatch[2]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="message-link"
                >
                    {linkMatch[1]}
                </a>
            );

            lastLinkIndex = linkMatch.index + linkMatch[0].length;
        }

        if (lastLinkIndex < text.length) {
            linkParts.push(text.slice(lastLinkIndex));
        }

        const textWithLinks = linkParts.length > 1 ? linkParts : [text];

        const processedParts = [];

        textWithLinks.forEach((part, partIndex) => {
            if (typeof part === 'string') {
                const boldRegex = /\*\*([^*]+)\*\*/g;
                const boldParts = [];
                let lastBoldIndex = 0;
                let boldMatch;

                while ((boldMatch = boldRegex.exec(part)) !== null) {
                    if (boldMatch.index > lastBoldIndex) {
                        boldParts.push(part.slice(lastBoldIndex, boldMatch.index));
                    }

                    boldParts.push(
                        <strong key={`bold-${partIndex}-${boldMatch.index}`}>
                            {boldMatch[1]}
                        </strong>
                    );

                    lastBoldIndex = boldMatch.index + boldMatch[0].length;
                }

                if (lastBoldIndex < part.length) {
                    boldParts.push(part.slice(lastBoldIndex));
                }

                if (boldParts.length > 1) {
                    processedParts.push(...boldParts);
                } else {
                    processedParts.push(part);
                }
            } else {
                processedParts.push(part);
            }
        });

        return processedParts.length > 1 ? processedParts : processedParts[0] || text;
    };

    const lines = children.split('\n');

    return (
        <div className="message-text">
            {lines.map((line, index) => {
                if (line.trim() === '') {
                    return <br key={index}/>;
                }

                if (line.trim() === '---') {
                    return (
                        <hr key={index} style={{
                            border: 'none',
                            borderTop: '1px solid #e1e5e9',
                            margin: '16px 0'
                        }}/>
                    );
                }

                if (line.startsWith('## ')) {
                    return (
                        <h3 key={index} className="message-heading">
                            {processText(line.slice(3))}
                        </h3>
                    );
                }

                if (line.startsWith('# ')) {
                    return (
                        <h2 key={index} className="message-title">
                            {processText(line.slice(2))}
                        </h2>
                    );
                }

                const processedLine = processText(line);

                return (
                    <p key={index}>
                        {processedLine}
                    </p>
                );
            })}
        </div>
    );
};

export default CustomMarkdown;