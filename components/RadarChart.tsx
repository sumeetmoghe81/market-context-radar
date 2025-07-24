
import React, { useState, useEffect } from 'react';
import { Category, Impact, MarketItem, TooltipData } from '../types';
import { CATEGORY_CONFIG, IMPACT_CONFIG } from '../constants';

// --- Helper Functions ---

const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

const calculatePositions = (items: MarketItem[]): MarketItem[] => {
    return items.map(item => {
        // If position is pre-defined from constants.ts, use it.
        if (item.position) {
            return item;
        }

        // Otherwise, calculate a random position for uploaded data.
        const categoryConfig = CATEGORY_CONFIG[item.category];
        const impactConfig = IMPACT_CONFIG[item.impact];

        const angleDegrees = randomInRange(categoryConfig.angleRange[0], categoryConfig.angleRange[1]);
        const angleRadians = angleDegrees * (Math.PI / 180);
        const radius = randomInRange(impactConfig.radiusRange[0], impactConfig.radiusRange[1]);

        // Convert polar to cartesian coordinates. Center is (50, 50).
        // Y-axis is inverted in screen coordinates, so we subtract for top.
        const left = 50 + radius * Math.cos(angleRadians);
        const top = 50 - radius * Math.sin(angleRadians);

        return {
            ...item,
            position: { top: `${top}%`, left: `${left}%` },
        };
    });
};

// --- Child Component ---

interface BubbleProps {
    item: MarketItem;
    onMouseEnter: (e: React.MouseEvent, item: MarketItem) => void;
    onMouseLeave: () => void;
    onClick: (item: MarketItem) => void;
}

const Bubble: React.FC<BubbleProps> = ({ item, onMouseEnter, onMouseLeave, onClick }) => {
    if (!item.position) return null;

    const categoryConfig = CATEGORY_CONFIG[item.category];

    return (
        <div
            className={`bubble absolute w-7 h-7 rounded-full flex items-center justify-center text-white font-medium text-sm cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out hover:scale-125 hover:shadow-lg hover:z-20 ${categoryConfig.color}`}
            style={{ top: item.position.top, left: item.position.left }}
            onMouseEnter={(e) => onMouseEnter(e, item)}
            onMouseLeave={onMouseLeave}
            onClick={() => onClick(item)}
        >
            {item.id}
        </div>
    );
};


// --- Main RadarChart Component ---

interface RadarChartProps {
    items: MarketItem[];
    onBubbleClick: (item: MarketItem) => void;
    setTooltip: React.Dispatch<React.SetStateAction<TooltipData | null>>;
}

const RadarChart: React.FC<RadarChartProps> = ({ items, onBubbleClick, setTooltip }) => {
    const [positionedItems, setPositionedItems] = useState<MarketItem[]>([]);

    useEffect(() => {
        setPositionedItems(calculatePositions(items));
    }, [items]);
    
    const handleBubbleEnter = (e: React.MouseEvent, item: MarketItem) => {
        setTooltip({ content: item.text, x: e.clientX, y: e.clientY });
    };

    const handleBubbleLeave = () => {
        setTooltip(null);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        setTooltip(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
    };
    
    const circleBaseStyle = "absolute rounded-full border-2 border-dashed border-gray-300 box-border top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
    
    return (
        <div className="radar-container w-full max-w-3xl aspect-square mx-auto" onMouseMove={handleMouseMove}>
            <div className="relative w-full h-full">
                {/* Axes */}
                <div className="absolute w-full h-[2px] bg-gray-300 top-1/2 left-0 -translate-y-1/2"></div>
                <div className="absolute h-full w-[2px] bg-gray-300 left-1/2 top-0 -translate-x-1/2"></div>

                {/* Concentric Circles & Labels */}
                <div className={`${circleBaseStyle} w-[100%] h-[100%]`}></div>
                <div className="circle-label absolute bg-[#003d4f] text-white py-1 px-3 rounded-full text-xs font-medium -translate-x-1/2 -translate-y-1/2 whitespace-nowrap top-[2.5%] left-1/2">{IMPACT_CONFIG[Impact.Long].label}</div>
                
                <div className={`${circleBaseStyle} w-[66.66%] h-[66.66%]`}></div>
                <div className="circle-label absolute bg-[#003d4f] text-white py-1 px-3 rounded-full text-xs font-medium -translate-x-1/2 -translate-y-1/2 whitespace-nowrap top-[17%] left-1/2">{IMPACT_CONFIG[Impact.Medium].label}</div>

                <div className={`${circleBaseStyle} w-[33.33%] h-[33.33%]`}></div>
                <div className="circle-label absolute bg-[#003d4f] text-white py-1 px-3 rounded-full text-xs font-medium -translate-x-1/2 -translate-y-1/2 whitespace-nowrap top-[33.33%] left-1/2">{IMPACT_CONFIG[Impact.Near].label}</div>
                
                {/* Quadrant Labels */}
                {Object.values(Category).map(cat => {
                    const config = CATEGORY_CONFIG[cat];
                    return (
                        <div key={cat} className={`quadrant-label absolute font-bitter text-lg font-bold ${config.textColor} ${config.quadrantLabelPosition}`}>
                            {config.label}
                        </div>
                    );
                })}

                {/* Bubbles */}
                {positionedItems.map(item => (
                    <Bubble
                        key={item.id}
                        item={item}
                        onMouseEnter={handleBubbleEnter}
                        onMouseLeave={handleBubbleLeave}
                        onClick={onBubbleClick}
                    />
                ))}
            </div>
        </div>
    );
};

export default RadarChart;
