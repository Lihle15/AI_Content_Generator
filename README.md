# LOPE-LEE | AI Content Studio

A full-stack web app that generates social posts, emails, blog outlines and ad copy with AI. Pick a content type, tone and platform, enter a topic, and get ready-to-use copy in seconds.

## Features

- **Controlled generation:** choose content type, tone, platform and topic
- **Formatted output:** results render as Markdown (headings, emphasis, lists), and the copy button keeps the raw text
- **Generation history:** the latest 50 results are saved in the browser, and each one can be reopened, deleted or cleared
- **Light and dark themes:** follows the system preference and remembers your choice
- **Responsive UI** with loading skeletons, error feedback and accessible focus states
- **Mock mode:** runs without an API key and returns sample content, so the app can be tried locally straight away

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, Tailwind CSS, React Markdown, Lucide React |
| Backend | Python 3.10+, FastAPI, Uvicorn, Pydantic, python-dotenv |
| AI | OpenAI Python SDK with any OpenAI-compatible provider (tested with OpenRouter) |

## Project Structure

```text
AI_Content_Generator/
├── backend/
│   ├── generator.py         # Prompt construction and AI/mock generation
│   ├── main.py              # FastAPI app, CORS, validation and API route
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── index.html
│   ├── package.json
│   └── src/
│       ├── App.jsx          # Main UI and interaction logic
│       ├── index.css        # Theme, layout and component styles
│       └── main.jsx         # React entry point
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+

### 1. Backend

From the project root, create and activate a virtual environment, then install the dependencies.

Windows (PowerShell):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
```

macOS / Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

Start the API:

```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

### 3. Connect an AI provider (optional)

Without an API key the app returns mock content. To use a real model, create `backend/.env`:

```dotenv
OPENAI_API_KEY=your_api_key
OPENAI_BASE_URL=https://openrouter.ai/api/v1   # optional
OPENAI_MODEL=openrouter/free                   # optional
```

> **Security:** `.env` is listed in `.gitignore` and must never be committed. The frontend never handles the API key, because the backend reads it from the environment.

## API

`POST /api/generate`

Request:

```json
{
  "topic": "A launch campaign for a premium skincare line",
  "content_type": "Social Post",
  "tone": "Conversational",
  "platform": "Instagram"
}
```

Response:

```json
{
  "content": "Generated content"
}
```

CORS is enabled for `localhost:5173` and `127.0.0.1:5173`.

## Quality Checks

```bash
cd frontend
npm run lint
npm run build
```

## What I Learned

- Designing a small REST API with FastAPI and validating input with Pydantic
- Connecting a React frontend to a Python backend
- Prompt construction for different content types, tones and platforms
- Keeping API keys server-side, with a mock fallback for local development

## Author

Built by [Thembelihle (Lihle) Molope](https://github.com/Lihle15) as part of the CAPACITI AI Bootcamp.
