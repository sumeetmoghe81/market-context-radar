
import { Category, Impact, MarketItem } from './types';

export const INITIAL_MARKET_ITEMS: MarketItem[] = [
  // Buyer behavior
  { id: 1, text: "There is a growing demand for 'digital twin' technology in the manufacturing and logistics sectors.", category: Category.Buyer, impact: Impact.Long },
  { id: 12, text: "B2B clients are demanding greater transparency and proven ESG compliance from their technology vendors.", category: Category.Buyer, impact: Impact.Medium },
  { id: 15, text: "Decision-making power for IT purchases is shifting from central CIOs to line-of-business leaders.", category: Category.Buyer, impact: Impact.Medium },
  { id: 16, text: "The 'right to repair' movement is starting to influence hardware design and long-term support models.", category: Category.Buyer, impact: Impact.Medium },
  { id: 18, text: "Consumers show increasing preference for subscription-based software models over one-time purchases.", category: Category.Buyer, impact: Impact.Near },
  { id: 22, text: "The 'creator economy' is driving demand for new mobile-first content creation and monetization tools.", category: Category.Buyer, impact: Impact.Near },
  { id: 25, text: "Customers now expect seamless omnichannel experiences across web, mobile, and physical touchpoints.", category: Category.Buyer, impact: Impact.Near },

  // Technology
  { id: 2, text: "The 'metaverse' continues to be a major long-term R&D investment area for all major tech giants.", category: Category.Technology, impact: Impact.Long },
  { id: 5, text: "Decentralized identity (DID) using blockchain is gaining traction for more secure user authentication.", category: Category.Technology, impact: Impact.Medium },
  { id: 8, text: "Quantum computing breakthroughs pose a future risk and opportunity to current encryption standards.", category: Category.Technology, impact: Impact.Long },
  { id: 10, text: "The widespread rollout of 5G is enabling new classes of real-time, high-bandwidth applications.", category: Category.Technology, impact: Impact.Near },
  { id: 13, text: "Recent advances in battery technology are making portable enterprise devices more powerful and long-lasting.", category: Category.Technology, impact: Impact.Near },
  { id: 23, text: "Generative AI is beginning to automate complex creative, engineering, and software development tasks.", category: Category.Technology, impact: Impact.Near },

  // Macro environment
  { id: 3, text: "Shifting data residency laws (e.g., GDPR, LGPD) require investment in localized data centers.", category: Category.Macro, impact: Impact.Long },
  { id: 6, text: "Geopolitical instability in key regions is leading to a marked increase in state-sponsored cybersecurity threats.", category: Category.Macro, impact: Impact.Long },
  { id: 17, text: "Global supply chain disruptions continue to affect hardware availability and increase costs.", category: Category.Macro, impact: Impact.Near },
  { id: 19, text: "Rising interest rates are making capital for large-scale technology projects more expensive to secure.", category: Category.Macro, impact: Impact.Near },
  { id: 20, text: "Persistent labor shortages in specialized IT roles are driving up wages and recruitment costs.", category: Category.Macro, impact: Impact.Near },
  { id: 24, text: "High fluctuations in currency exchange rates are impacting the profitability of international projects.", category: Category.Macro, impact: Impact.Near },

  // Competition
  { id: 4, text: "Legacy players in our industry are slow to adopt cloud-native architectures, creating a market opportunity.", category: Category.Competition, impact: Impact.Long },
  { id: 7, text: "The rapid rise of low-code/no-code platforms is empowering non-technical users to build applications.", category: Category.Competition, impact: Impact.Long },
  { id: 9, text: "TechCorp' acquires 'InnovateAI', consolidating the AI platform market and reducing partner options.", category: Category.Competition, impact: Impact.Medium },
  { id: 11, text: "New privacy-focused browsers are gaining significant market share, impacting the ad-tech industry.", category: Category.Competition, impact: Impact.Long },
  { id: 14, text: "A new wave of startups is using a 'product-led growth' model, disrupting traditional enterprise sales cycles.", category: Category.Competition, impact: Impact.Medium },
  { id: 21, text: "Open-source alternatives to our core product are becoming more robust and commercially viable.", category: Category.Competition, impact: Impact.Near },
];


export const CATEGORY_CONFIG = {
  [Category.Macro]: { color: "bg-[#47a1ad]", textColor: "text-[#47a1ad]", borderColor: "border-[#47a1ad]", label: "Macro environment", angleRange: [190, 260], quadrantLabelPosition: "bottom-5 left-5" },
  [Category.Competition]: { color: "bg-[#F2617a]", textColor: "text-[#F2617a]", borderColor: "border-[#F2617a]", label: "Competition", angleRange: [280, 350], quadrantLabelPosition: "bottom-5 right-5 text-right" },
  [Category.Buyer]: { color: "bg-[#cc850a]", textColor: "text-[#cc850a]", borderColor: "border-[#cc850a]", label: "Buyer behavior", angleRange: [100, 170], quadrantLabelPosition: "top-5 left-5" },
  [Category.Technology]: { color: "bg-[#6b9e78]", textColor: "text-[#6b9e78]", borderColor: "border-[#6b9e78]", label: "Technology", angleRange: [10, 80], quadrantLabelPosition: "top-5 right-5 text-right" },
};

export const IMPACT_CONFIG = {
  [Impact.Near]: { radiusRange: [5, 16], label: "Near-term impact" },
  [Impact.Medium]: { radiusRange: [18, 32], label: "Medium-term impact" },
  [Impact.Long]: { radiusRange: [35, 49], label: "Longer-term impact" },
};
