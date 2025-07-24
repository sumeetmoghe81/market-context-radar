export enum Category {
    Macro = "Macro environment",
    Competition = "Competition",
    Buyer = "Buyer behavior",
    Technology = "Technology",
}

export enum Impact {
    Near = "Near-term",
    Medium = "Medium-term",
    Long = "Longer-term",
}

export interface MarketItem {
    id: number;
    text: string;
    category: Category;
    impact: Impact;
    position?: { top: string; left: string };
}

export interface TooltipData {
    content: string;
    x: number;
    y: number;
}

export interface HistoryCheckpoint {
  name: string;
  timestamp: Date;
  items: MarketItem[];
}
