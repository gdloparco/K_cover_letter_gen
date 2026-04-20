# Kate — Cover Letter Generator

Kate is a web app that generates personalised, professional cover letters. You provide the company details, job description, and your resume — Kate analyses the company's values, matches them to your pre-written paragraph library, and assembles a tailored cover letter ready to download as a PDF.

---

## How it works

1. **Step 1 — Company & Role**: enter the company name, website URL, and paste the job description
2. **Step 2 — Your Details**: enter your name, email, phone, the role you're applying for, and upload your CV (PDF or DOCX)
3. **Generate**: Kate runs the following pipeline in the backend:
   - Extracts plain text from your resume (Python scraper)
   - Extracts company values from the job description (local LLM via Ollama)
   - Scrapes the company website for further values (Python scraper)
   - Assembles a full cover letter using your personal paragraph library and the extracted context (local LLM)
4. **Result**: read the letter on screen, copy it to clipboard, or download it as a formatted PDF

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Backend | Go 1.22, Gin framework |
| Scraper & resume parsing | Python 3, Flask, BeautifulSoup4, pdfminer.six, python-docx |
| LLM | Ollama (local) — default model: `llama3.2` |
| PDF generation | jsPDF (client-side) |
| Containerisation | Docker, Docker Compose |

---

## Project structure

```
2-Kate/
├── backend/              # Go API server (Gin)
│   ├── main.go
│   ├── .env.example
│   └── src/
│       ├── controllers/  # HTTP handlers
│       ├── models/       # Request/response types
│       ├── routes/       # Route registration
│       ├── services/     # Business logic (LLM, scraper, cover letter assembly)
│       ├── errors/       # Error helpers
│       └── env/          # Env loader
├── frontend/             # Next.js app
│   ├── app/
│   │   ├── page.tsx          # Landing page
│   │   ├── assembler/        # 2-step form (company + applicant)
│   │   ├── result/           # Cover letter output + PDF download
│   │   ├── about/
│   │   └── contact/
│   ├── components/
│   │   ├── CompanyDetailsForm.tsx
│   │   ├── ApplicantInfoForm.tsx
│   │   └── CoverLetterOutput.tsx
│   ├── utils/
│   │   └── send-company-data.ts
│   └── .env.example
├── scraper/              # Python Flask microservice
│   ├── app.py            # /get-company-values and /extract-resume endpoints
│   ├── lib/
│   │   ├── company_data_repository.py
│   │   ├── company_data.py
│   │   └── resume_extractor.py
│   └── .env.example
├── data/
│   └── bulletpoints.json # Personal paragraph library used in cover letter assembly
├── docs/
│   ├── bulletpoints.md   # Source/reference for bulletpoints.json
│   └── deployment.md     # Deployment guide
└── docker-compose.yml    # Local development
```

---

## Local development setup

### Prerequisites

- [Go 1.22+](https://go.dev/dl/)
- [Node.js 18+](https://nodejs.org/)
- [Python 3.11+](https://www.python.org/)
- [Ollama](https://ollama.com/) — for the local LLM
- [Docker](https://www.docker.com/) — optional, for running everything in containers

---

### 1. Clone and configure environment files

```bash
git clone https://github.com/gdloparco/2-Kate.git
cd 2-Kate
```

Copy the example env files and fill in your values:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp scraper/.env.example scraper/.env
```

**`backend/.env`**
```env
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
SCRAPER_URL=http://localhost:8085
BULLETPOINTS_PATH=../data/bulletpoints.json
```

**`frontend/.env`**
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8083
MY_EMAIL=your@gmail.com
MY_PASSWORD=your_gmail_app_password
NODE_ENV=development
```

**`scraper/.env`**
```env
PYTHON_SCRAPER_PORT=8085
```

---

### 2. Start Ollama

Install Ollama from [ollama.com](https://ollama.com), then:

```bash
ollama serve           # starts the Ollama server on localhost:11434
ollama pull llama3.2   # download the model (one-time, ~2GB)
```

> The first generation request will be slow (30–60s) while the model loads into memory. Subsequent requests are faster.

---

### 3. Start the Python scraper

```bash
cd scraper
python3 -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Scraper runs on `http://localhost:8085`.

---

### 4. Start the Go backend

```bash
cd backend
go run main.go
```

Backend runs on `http://localhost:8082` (mapped to `8083` via Docker or accessed directly).

---

### 5. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

---

### Running with Docker Compose

To run all services together:

```bash
docker-compose up
```

> On first run the scraper container installs Python dependencies — this takes about a minute. Subsequent starts are fast.

Services will be available at:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8083`
- Scraper: `http://localhost:8085`

**Note:** Ollama must still run on the host machine. Inside Docker the backend reaches it via `host.docker.internal:11434` (see `docker-compose.yml` comments).

---

## Customising the paragraph library

The cover letter assembly uses paragraphs from `data/bulletpoints.json`. Each entry has:

```json
{
  "theme": "Continuous Learning",
  "category": "Superhook",
  "tags": ["Superhook", "Continuous Learning"],
  "text": "<Company Value> - I believe that..."
}
```

**Categories:**
- `Superhook` — opens a paragraph by directly referencing a specific company value. Use `<Company Value>` and `<Company Name>` as placeholders; the LLM replaces them with real content.
- `General` — standalone belief/value paragraphs
- `Background` — paragraphs referencing specific past experience

To add your own paragraphs, edit `data/bulletpoints.json` directly.

---

## API endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/formdata/cover-letter` | Main endpoint — multipart form with resume file, returns cover letter |
| `POST` | `/formdata/company` | Extract company values only (no cover letter assembly) |

### `POST /formdata/cover-letter`

Accepts `multipart/form-data`:

| Field | Type | Required |
|---|---|---|
| `company_name` | string | yes |
| `company_website_url` | string | yes |
| `job_description` | string | yes |
| `applicant_name` | string | yes |
| `applicant_email` | string | yes |
| `applicant_phone` | string | yes |
| `applicant_role` | string | yes |
| `resume` | file (PDF/DOCX) | yes |

Response:
```json
{
  "cover_letter": {
    "company_name": "Acme Corp",
    "applicant_name": "Jane Smith",
    "applicant_role": "Software Engineer",
    "cover_letter_text": "Dear Hiring Manager,\n\n..."
  }
}
```

---

## Deployment

See [docs/deployment.md](docs/deployment.md) for a full guide on deploying Kate to production (Railway, Fly.io, or a VPS).
