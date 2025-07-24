
import React, { useState, useCallback } from 'react';
import { Category, Impact, MarketItem, TooltipData } from './types';
import { INITIAL_MARKET_ITEMS, CATEGORY_CONFIG } from './constants';
import RadarChart from './components/RadarChart';
import { getAIInsight } from './services/geminiService';
import EditableField from './components/EditableField';

// --- Type for CDN libraries ---
declare var XLSX: any;
declare var html2canvas: any;
declare var jspdf: any;

// --- Helper function to parse spreadsheet data ---
const parseSheetData = (json: any[]): MarketItem[] => {
    return json.map((row, index) => {
        // Normalize keys to lowercase to be more forgiving
        const lowerRow: any = {};
        for (const key in row) {
            lowerRow[key.toLowerCase()] = row[key];
        }

        if (!lowerRow.id || !lowerRow.text || !lowerRow.category || !lowerRow.impact) {
            throw new Error(`Row ${index + 2} is missing required columns (id, text, category, impact).`);
        }
        
        const category = Object.values(Category).find(c => c.toLowerCase() === lowerRow.category.toLowerCase());
        const impact = Object.values(Impact).find(i => i.toLowerCase() === lowerRow.impact.toLowerCase());

        if (!category || !impact) {
             throw new Error(`Row ${index + 2} has invalid category or impact values.`);
        }

        return {
            id: Number(lowerRow.id),
            text: String(lowerRow.text),
            category,
            impact,
        };
    });
};


// --- Helper Components defined in the same file for simplicity ---

interface AIInsightModalProps {
    item: MarketItem | null;
    insight: string;
    isLoading: boolean;
    onClose: () => void;
}

const AIInsightModal: React.FC<AIInsightModalProps> = ({ item, insight, isLoading, onClose }) => {
    if (!item) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold font-bitter text-[#003d4f]">AI Insight</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
                </div>
                <div className="mb-4 p-4 bg-gray-50 border-l-4 border-[#003d4f] rounded-r-md">
                    <p className="font-semibold text-gray-800">{item.text}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-2 inline-block ${CATEGORY_CONFIG[item.category].color} text-white`}>
                        {item.category}
                    </span>
                </div>
                <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap">
                    {isLoading ? (
                        <div className="flex items-center justify-center p-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003d4f]"></div>
                            <p className="ml-4 text-gray-500">Generating insight...</p>
                        </div>
                    ) : (
                        <p>{insight}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

interface CategoryListProps {
    category: Category;
    items: MarketItem[];
    onItemClick: (item: MarketItem) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ category, items, onItemClick }) => {
    if (!items || items.length === 0) return null;
    
    const config = CATEGORY_CONFIG[category];
    
    return (
        <div className="w-full">
            <h2 className={`font-bitter text-3xl font-bold mb-4 pb-2 border-b-4 ${config.borderColor} ${config.textColor}`}>
                {config.label}
            </h2>
            <ul className="space-y-4">
                {items.sort((a,b) => a.id - b.id).map(item => (
                    <li key={item.id} className="flex items-start group cursor-pointer" onClick={() => onItemClick(item)}>
                        <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white font-medium text-sm mr-4 mt-0.5 ${config.color} group-hover:scale-110 transition-transform`}>
                            {item.id}
                        </div>
                        <p className="text-gray-700 leading-relaxed group-hover:text-[#003d4f] transition-colors">{item.text}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};


interface TooltipProps {
    data: TooltipData | null;
}

const Tooltip: React.FC<TooltipProps> = ({ data }) => {
    if (!data) return null;
    return (
        <div
            className="fixed bg-[#003d4f] bg-opacity-95 text-white text-sm rounded-md px-3 py-2 max-w-xs z-[100] pointer-events-none transition-opacity duration-200"
            style={{ left: data.x + 15, top: data.y + 15 }}
        >
            {data.content}
        </div>
    );
};


// --- The Main App Component ---

export default function App() {
    const [marketItems, setMarketItems] = useState<MarketItem[]>(INITIAL_MARKET_ITEMS);
    const [tooltip, setTooltip] = useState<TooltipData | null>(null);
    const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);
    const [aiInsight, setAiInsight] = useState('');
    const [isInsightLoading, setIsInsightLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // State for editable title and subtitle
    const [title, setTitle] = useState("Market Context Radar");
    const [subtitle, setSubtitle] = useState("Today's environment reflects both effects from an economic slowdown, as well as opportunities and risks driven by AI.");

    // State for PDF and PNG downloads
    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
    const [isDownloadingPng, setIsDownloadingPng] = useState(false);
    
    const groupedItems = marketItems.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {} as Record<Category, MarketItem[]>);

    const handleItemClick = useCallback(async (item: MarketItem) => {
        setSelectedItem(item);
        setIsInsightLoading(true);
        setAiInsight('');
        const insight = await getAIInsight(item.text);
        setAiInsight(insight);
        setIsInsightLoading(false);
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setError(null);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json: any[] = XLSX.utils.sheet_to_json(worksheet);
                const parsedItems = parseSheetData(json);
                setMarketItems(parsedItems);
            } catch (err) {
                console.error("File parsing error:", err);
                setError(err instanceof Error ? err.message : "An unknown error occurred during file processing.");
            } finally {
                setLoading(false);
            }
        };
        reader.onerror = () => {
            setError("Failed to read the file.");
            setLoading(false);
        }
        reader.readAsBinaryString(file);
        event.target.value = ''; // Reset file input
    };

    const getCanvas = async () => {
        const content = document.getElementById('pdf-content');
        if (!content) {
            throw new Error("Content area to capture not found!");
        }
        return await html2canvas(content, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            backgroundColor: '#ffffff', // Use a white background for the export
            windowWidth: content.scrollWidth,
            windowHeight: content.scrollHeight,
        });
    }

    const handleDownloadPng = async () => {
        setIsDownloadingPng(true);
        try {
            const canvas = await getCanvas();
            const imgData = canvas.toDataURL('image/png');
            
            const link = document.createElement('a');
            link.href = imgData;
            link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
        } catch (error) {
            console.error("Error generating PNG:", error);
            setError(error instanceof Error ? error.message : "Could not generate PNG.");
        } finally {
            setIsDownloadingPng(false);
        }
    };

    const handleDownloadPdf = async () => {
        setIsDownloadingPdf(true);
        try {
            const canvas = await getCanvas();
            const imgData = canvas.toDataURL('image/png');

            const pdf = new jspdf.jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4',
            });

            const pageMargin = 15;
            const pdfPageWidth = pdf.internal.pageSize.getWidth();
            const pdfPageHeight = pdf.internal.pageSize.getHeight();
            
            const contentWidth = pdfPageWidth - pageMargin * 2;
            const contentHeight = pdfPageHeight - pageMargin * 2;

            const imgRatio = canvas.width / canvas.height;
            let finalImgWidth = contentWidth;
            let finalImgHeight = finalImgWidth / imgRatio;

            if (finalImgHeight > contentHeight) {
                finalImgHeight = contentHeight;
                finalImgWidth = finalImgHeight * imgRatio;
            }
            
            const xPos = pageMargin + (contentWidth - finalImgWidth) / 2;
            const yPos = pageMargin + (contentHeight - finalImgHeight) / 2;

            pdf.addImage(imgData, 'PNG', xPos, yPos, finalImgWidth, finalImgHeight);
            
            pdf.save(`${title.replace(/\s+/g, '-').toLowerCase()}.pdf`);

        } catch (error) {
            console.error("Error generating PDF:", error);
            setError(error instanceof Error ? error.message : "Could not generate PDF.");
        } finally {
            setIsDownloadingPdf(false);
        }
    };
    
    const Spinner = () => (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );

    return (
        <div className="min-h-screen text-[#333] p-4 sm:p-8 flex flex-col items-center">
            
            <div className="w-full max-w-7xl mx-auto mb-8 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-8 gap-y-8 items-start">
                    <div>
                        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
                            Import Data
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#003d4f] file:text-white hover:file:bg-[#005f79] cursor-pointer"
                        />
                         <p className="mt-1 text-xs text-gray-500">File must contain: 'id', 'text', 'category', 'impact'.</p>
                    </div>

                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">
                            Export View
                        </label>
                        <div className="flex space-x-2">
                            <button
                                onClick={handleDownloadPdf}
                                disabled={isDownloadingPdf || isDownloadingPng}
                                className="w-full flex items-center justify-center px-4 py-2 bg-[#003d4f] text-white font-semibold rounded-lg shadow-sm hover:bg-[#005f79] disabled:bg-gray-400 disabled:cursor-wait transition-colors"
                            >
                                 {isDownloadingPdf ? <><Spinner /> Downloading...</> : 'Download PDF'}
                            </button>
                             <button
                                onClick={handleDownloadPng}
                                disabled={isDownloadingPng || isDownloadingPdf}
                                className="w-full flex items-center justify-center px-4 py-2 bg-[#003d4f] text-white font-semibold rounded-lg shadow-sm hover:bg-[#005f79] disabled:bg-gray-400 disabled:cursor-wait transition-colors"
                            >
                                {isDownloadingPng ? <><Spinner /> Downloading...</> : 'Download PNG'}
                            </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Download as a landscape PDF or a single PNG image.</p>
                    </div>
                </div>
            </div>

             {loading && <div className="text-lg font-semibold text-[#003d4f] my-4">Processing data...</div>}
             {error && <div className="text-lg font-semibold text-red-600 bg-red-100 border border-red-600 p-4 rounded-md my-4 w-full max-w-7xl mx-auto">{error}</div>}

            <div id="pdf-content" className="w-full bg-white p-6 sm:p-10 rounded-lg flex flex-col items-center lg:aspect-video">
                <header className="text-center mb-8 flex flex-col items-center w-full">
                    <EditableField
                        as="h1"
                        value={title}
                        onSave={setTitle}
                        containerClassName="font-bitter font-bold text-4xl sm:text-5xl text-[#003d4f]"
                        inputClassName="font-bitter font-bold text-4xl sm:text-5xl text-[#003d4f] bg-transparent border-b-2 border-gray-400 focus:outline-none w-full text-center"
                    />
                     <EditableField
                        as="p"
                        value={subtitle}
                        onSave={setSubtitle}
                        containerClassName="mt-2 text-base sm:text-lg text-gray-600 max-w-3xl"
                        inputClassName="mt-2 text-base sm:text-lg text-gray-600 bg-transparent border-b-2 border-gray-400 focus:outline-none w-full text-center max-w-3xl"
                    />
                </header>
                
                <main className="w-full max-w-[1400px] mx-auto mt-8 lg:grid lg:grid-cols-[minmax(0,_1fr)_minmax(0,_1.5fr)_minmax(0,_1fr)] lg:gap-x-12">
                    {/* --- Left Column (Desktop) --- */}
                    <div className="hidden lg:flex flex-col gap-y-10 pt-8">
                        <CategoryList category={Category.Buyer} items={groupedItems[Category.Buyer]} onItemClick={handleItemClick} />
                        <CategoryList category={Category.Macro} items={groupedItems[Category.Macro]} onItemClick={handleItemClick} />
                    </div>

                    {/* --- Center Column (Radar) --- */}
                    <div className="flex items-center justify-center">
                        <RadarChart items={marketItems} onBubbleClick={handleItemClick} setTooltip={setTooltip} />
                    </div>

                    {/* --- Right Column (Desktop) --- */}
                    <div className="hidden lg:flex flex-col gap-y-10 pt-8">
                        <CategoryList category={Category.Technology} items={groupedItems[Category.Technology]} onItemClick={handleItemClick} />
                        <CategoryList category={Category.Competition} items={groupedItems[Category.Competition]} onItemClick={handleItemClick} />
                    </div>

                    {/* --- Lists for Mobile / Tablet --- */}
                    <div className="lg:hidden mt-16 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                        <CategoryList category={Category.Buyer} items={groupedItems[Category.Buyer]} onItemClick={handleItemClick} />
                        <CategoryList category={Category.Technology} items={groupedItems[Category.Technology]} onItemClick={handleItemClick} />
                        <CategoryList category={Category.Macro} items={groupedItems[Category.Macro]} onItemClick={handleItemClick} />
                        <CategoryList category={Category.Competition} items={groupedItems[Category.Competition]} onItemClick={handleItemClick} />
                    </div>
                </main>
            </div>
            
            <Tooltip data={tooltip} />

            <AIInsightModal
                item={selectedItem}
                insight={aiInsight}
                isLoading={isInsightLoading}
                onClose={() => setSelectedItem(null)}
            />
        </div>
    );
}