# LOPE-LEE | AI Content Studio

LOPE-LEE is a React and FastAPI content-generation studio for creating polished social posts, blog outlines, emails, and ad copy. Choose a content type, tone, and platform, then send a topic to the AI generation API.

## Features

- Warm editorial Rosee Studio-inspired interface with responsive light and dark themes.
- LOPE-LEE branding with a Lucide heart mark and a single AI Content Studio badge.
- Content generation controls for type, tone, platform, and topic.
- Markdown-rendered generated content with headings, emphasis, and visible ordered or unordered lists.
- Copy-to-clipboard support that preserves the raw generated text.
- Loading skeletons, error feedback, and accessible focus states.
- Persistent generation history stored locally in the browser.
- History entries can be reopened, deleted individually, or cleared with confirmation.
- History cards keep their date and delete control contained and aligned inside each card.
- Theme preference remembers the user's choice and defaults to the system preference.
- Warm, readable dark-mode selected pills and history pills with responsive card stacking.
- Mock generation fallback when no API key is configured.

The generation workflow, error handling, loading state, copy behavior, and API contract were preserved while the frontend was redesigned. The duplicate hero eyebrow was removed so the `AI CONTENT STUDIO` label appears only in the top-right badge.

## Tech Stack

- **Backend:** Python 3.10+, FastAPI, Uvicorn, Pydantic, OpenAI Python SDK, python-dotenv
- **Frontend:** React, Vite, Tailwind CSS, React Markdown, Lucide React
- **AI provider:** OpenAI-compatible API configuration, including OpenRouter
- **Fonts:** Inter for interface text and Cormorant Garamond for editorial headings

## Project Structure

```text
AI_Content_Generator/
├── backend/
│   ├── .env                
│   ├── generator.py         # Prompt construction and AI/mock generation
│   ├── main.py              # FastAPI app, CORS, validation, and API route
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── index.html           # Page metadata, title, and font imports
│   ├── package.json         # Frontend scripts and dependencies
│   └── src/
│       ├── App.jsx          # Main application and interaction logic
│       ├── index.css        # Theme, layout, responsive, and component styles
│       └── main.jsx         # React entry point
└── README.md
```

## Configuration

Create `backend/.env` for a real provider:

```dotenv
OPENAI_API_KEY=your_api_key
OPENAI_BASE_URL=https://openrouter.ai/api/v1
OPENAI_MODEL=openrouter/free
```

`OPENAI_BASE_URL` and `OPENAI_MODEL` are optional. Without an API key, the backend returns mock content so the application can still be run locally.

Never commit `.env` files or API keys. Rotate any key that has been exposed publicly.

The frontend stores browser-only preferences under these local-storage keys:

- `forgeai-history` for the latest 50 successful generations
- `forgeai-theme` for the selected light or dark theme

## Run Locally

From the project root, create and activate the virtual environment, then install backend dependencies:

```powershell
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
```

Start the backend in one terminal:

```powershell
cd backend
python -m uvicorn main:app --reload --port 8000
```

Start the frontend in another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. The frontend calls `POST http://localhost:8000/api/generate` with:

```json
{
    "topic": "A launch campaign for a premium skincare line",
    "content_type": "Social Post",
    "tone": "Conversational",
    "platform": "Instagram"
}
```

The API returns:

```json
{
    "content": "Generated content"
}
```

The backend accepts both `localhost:5173` and `127.0.0.1:5173` through CORS. The frontend does not send API keys directly; provider credentials are read by the backend from the environment.

## Validation

```powershell
cd frontend
npm run lint
npm run build
```

## Git History

The current feature work is represented by these commits on `main`:

```text
ef011b3 fix: remove duplicate hero eyebrow
9d255ba feat: complete LOPE-LEE AI content studio
```
