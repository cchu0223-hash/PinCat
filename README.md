# PinCat — Design Terminology Clipboard

A weekly journal-style app for design inspiration. Paste screenshots → AI generates design terminology tags.

## Setup

### Prerequisites
- Node.js 20+
- PostgreSQL
- Gemini API key

### Database
```bash
createdb pincat
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL and GEMINI_API_KEY
npm install
npm run db:push
```

### Backend
```bash
cd backend
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173
