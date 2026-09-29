# AI Content Generator

A modern, consumer-ready AI Content Generator web application featuring an ultra-clean, dark glassmorphism aesthetic (inspired by Dreamina and Midjourney). Built with a FastAPI backend and a React + Tailwind CSS frontend.

---

## Features

- **Dark Glassmorphism Interface**: Deep slate/black palette, translucent floating cards (`backdrop-blur`), and subtle borders.
- **Prompt-First Hero Section**: Prominent central input box designed for fast content generation.
- **Customizable Selector Pills**: Fine-tune outputs by Content Type, Tone, and Target Platform.
- **One-Click Actions**: Formatted output preview card featuring instant copy-to-clipboard functionality.
- **Smart Fallback Engine**: Works out of the box with dynamic mock generation if no OpenAI API key is supplied.
- **Zero-Emoji Professional Design**: Sleek, clean UI tailored for consumer SaaS workflows.

---

## Tech Stack

- **Backend**: Python 3.10+, FastAPI, Uvicorn, Pydantic, OpenAI Python SDK
- **Frontend**: React 18+, Vite, Tailwind CSS, Lucide React

---

## Project Structure

```text
ai-content-generator/
│
├── backend/
│   ├── .env.example          # Environment variables template
│   ├── generator.py          # AI engine and mock fallback logic
│   ├── main.py               # FastAPI application, CORS, and routing
│   └── requirements.txt      # Python dependencies
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── vite.config.js
    └── src/
        ├── App.jsx           # Main UI implementation
        ├── index.css         # Tailwind directives and glassmorphism utilities
        └── main.jsx          # React entry point
