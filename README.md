# Market Context Radar

<img width="3232" height="1818" alt="market-context-radar (2)" src="https://github.com/user-attachments/assets/57eef510-d735-47cc-ab3f-638ff4f7acc9" />


An interactive radar chart application to visualize market context data, featuring dynamic uploads from CSV/XLSX files, AI-powered insights via the Gemini API, and presentation-ready exports.

## Features

-   **Interactive Radar Chart:** Visualizes data points across four key categories (Buyer Behavior, Technology, Macro Environment, Competition) and three impact levels (Near-term, Medium-term, Longer-term).
-   **Dynamic Data Loading:** Easily upload your own market data using a CSV or XLSX file to dynamically generate and update the chart.
-   **AI-Powered Insights:** Click on any data point in the chart or lists to get a concise strategic analysis from Google's Gemini AI, focusing on risks and opportunities.
-   **Editable Content:** The main title and subtitle of the chart are editable directly in the UI, allowing for full customization before export.
-   **Presentation-Ready Exports:** Download the current view as a high-quality PNG or a landscape PDF. The desktop view maintains a 16:9 aspect ratio, perfect for direct use in slides.
-   **Fully Responsive:** The layout is optimized for a great user experience on desktop, tablet, and mobile devices.

## Data Format

To load your own data, you must provide a CSV or XLSX file with the following four columns:

-   `id`: A unique number for each item.
-   `text`: The description of the market trend or item.
-   `category`: The category the item belongs to.
-   `impact`: The expected time-to-impact for the item.

### Column Values

-   The **`category`** column must contain one of the following values (case-insensitive):
    -   `Buyer behavior`
    -   `Technology`
    -   `Macro environment`
    -   `Competition`
-   The **`impact`** column must contain one of the following values (case-insensitive):
    -   `Near-term`
    -   `Medium-term`
    -   `Longer-term`

## Setup and Running

### Prerequisites

-   A modern web browser (e.g., Chrome, Firefox, Safari, Edge).
-   A Google AI API key for the Gemini API.

### Running the Application

1.  Since this is a client-side application built with static files, you can simply open the `index.html` file in your web browser.
2.  For the AI features to work, the application must be hosted on a server (even a simple local one) where environment variables can be set.

### API Key Configuration

The application requires a Google Gemini API key to generate AI insights. This key must be available as an environment variable named `API_KEY`.

**Important:** The application code is designed to read this key directly from the environment (`process.env.API_KEY`). **Do not hardcode your API key into the source files.** The hosting environment is responsible for providing this variable to the application at runtime.

## Technologies Used

-   **Frontend:** React, TypeScript
-   **Styling:** Tailwind CSS
-   **AI:** Google Gemini API (`@google/genai`)
-   **File Parsing:** [SheetJS (xlsx)](https://sheetjs.com/)
-   **Exporting:** [html2canvas](https://html2canvas.hertzen.com/), [jsPDF](https://github.com/parallax/jsPDF)
