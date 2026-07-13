export const resumeData = {
  name: "Rahul AP",
  location: "Kerala, India",
  hero: {
    navName1: "Rahul",
    navName2: "Ap",
    role1: "Full-Stack Developer",
    role2: "Generative AI Engineer",
    exp: "2",
    bio: "Engineering next-gen interfaces and intelligent systems with full-stack architecture and GenAI. Based in Kerala, India.",
    name: "rahulap",
    skills1: "TypeScript",
    skills2: "GenAI",
    skills3: "Angular",
    passion: "Web/AI"
  },
  contact: {
    phone: "7593968596",
    email: "itsrahulap@gmail.com",
    linkedin: "https://linkedin.com/in/itsrahulap",
    github: "https://github.com/zccott",
    cv: "https://drive.google.com/file/d/1WqyF7vXloG6jidydJj4gme-qcfczkyEB/view?usp=sharing"
  },
  education: [
    {
      institution: "Kerala Government Polytechnic College",
      degree: "Diploma in Computer Engineering",
      year: "2021–2024",
    },
  ],
  experience: [
    {
      company: "AOT Technologies",
      role: "Software Engineer",
      year: "2024–Present",
      description: [
        "Worked across frontend + backend for Canadian healthcare platforms.",
        "Angular + MUI + reusable UI components.",
        "Integrated REST APIs for user onboarding & appointment systems.",
        "Implemented NgRx/RxJS application-wide state.",
        "AI fax automation using Python + OpenAI/Gemini + Temporal.",
        "Real-time SOAP note tool using FastAPI + WebSockets + Twilio + Whisper.",
      ],
    },
    {
      company: "Nexus Technologies",
      role: "Intern",
      year: "2023–2024",
      description: [
        "Healthcare mobile app (Find doctors by symptoms).",
        "Designed UX/UI screens.",
        "AI symptom analysis feature.",
        "Flutter cross-platform development.",
      ],
    },
  ],
  projects: [
    {
      title: "EnvScope",
      subtitle: "Context-Aware Frontend Security & Secret Detection Engine",
      summary: "A Chrome extension that scans live JavaScript bundles for exposed secrets, combining regex and AST analysis to catch high-risk leaks with low false positives.",
      tech: [
        "JavaScript",
        "TypeScript",
        "Chrome Extensions API",
        "AST (Acorn)",
        "Regex Engine",
        "Web APIs"
      ],
      description: [
        "Built a context-aware frontend security scanner that detects exposed credentials, tokens, and environment configurations directly from client-side JavaScript bundles",
        "Implements hybrid analysis using regex-based pattern matching combined with AST parsing to identify secrets embedded in code structures and runtime values",
        "Detects high-risk exposures such as JWT tokens, API keys, database URIs, and third-party integration keys with intelligent classification and severity scoring",
        "Reduces false positives using advanced filtering techniques including base64 noise elimination, source trust weighting, and contextual key-value analysis",
        "Groups and deduplicates findings while distinguishing between first-party and third-party sources for accurate security insights",
        "Provides structured output with risk categorization (high, medium, info) and supports clean reporting for security analysis and debugging",
        "Designed as a lightweight Chrome extension with no backend dependency, enabling real-time analysis of live web applications"
      ],
      github: "https://github.com/itsrahulap/EnvScope"
    },
    {
      title: "TestPilot",
      subtitle: "Intelligent Bug Detection & Telemetry Chrome Extension",
      summary: "A silent telemetry layer for web apps that captures console errors, failed requests, and performance metrics in real time, with no backend required.",
      tech: [
        "JavaScript",
        "Chrome Extensions API",
        "Web APIs",
        "Performance API"
      ],
      description: [
        "Built a production-grade Chrome extension that acts as a silent telemetry layer for modern web applications",
        "Captures console errors, warnings, failed network requests, and unhandled promise rejections in real time",
        "Monitors performance metrics such as load time and API latency directly within the browser",
        "Detects potential bugs, security risks, and performance bottlenecks without requiring a backend service",
        "Designed for lightweight, client-side monitoring with minimal performance overhead"
      ],
      github: "https://github.com/itsrahulap/TestPilot"
    },
    {
      title: "AskSQLAI",
      subtitle: "Schema-Aware Natural Language to SQL Generation Engine",
      summary: "Converts plain-English questions into safe, executable SQL by introspecting the live database schema, with layered guardrails against hallucinated tables or columns.",
      tech: [
        "React (Vite)",
        "TypeScript",
        "FastAPI",
        "PostgreSQL",
        "Gemini 2.5 Flash",
        "Gemini (Google ADK)",
        "Python"
      ],
      description: [
        "Built a schema-aware Text-to-SQL system that converts natural language questions into safe, executable SQL queries",
        "Uses live database schema introspection to prevent hallucinated tables or columns during SQL generation",
        "Enforces strict read-only execution through layered safeguards including prompt constraints, SQL validation, and database-level permissions",
        "Generates human-readable explanations alongside SQL queries to ensure transparency and trust",
        "Executes queries against a real PostgreSQL database and returns honest results without fabricating data when tables are empty",
        "Designed with a clean FastAPI architecture separating schema loading, SQL generation, validation, and execution"
      ],
      github: "https://github.com/itsrahulap/AskSQLAI"
    },
    {
      title: "MeetlyAI",
      subtitle: "AI-Powered Meeting Notes, Decisions & Action Items Generator",
      summary: "Turns raw meeting transcripts into structured summaries, decisions, and owned action items using strict JSON-schema-enforced prompting.",
      tech: [
        "React (Vite)",
        "TypeScript",
        "FastAPI",
        "Gemini 2.5 Flash",
        "Gemini (Google ADK)",
        "Python"
      ],
      description: [
        "Built an AI-powered meeting intelligence tool that converts raw meeting transcripts into structured summaries, decisions, and action items",
        "Uses strict JSON schema enforcement and controlled prompting to generate deterministic, machine-consumable outputs",
        "Extracts actionable tasks with ownership and priority to support real-world business workflows",
        "Designed as a stateless FastAPI service without vector databases or persistence, optimized for one-shot analysis"
      ],
      github: "https://github.com/itsrahulap/MeetlyAI"
    },
    {
      title: "SearchlyAI",
      subtitle: "Session-Based AI Search Engine using RAG over Documents & Web",
      summary: "A full RAG pipeline for semantic Q&A over uploaded documents and web pages, using FAISS vector search and Gemini responses grounded strictly in retrieved context.",
      tech: [
        "React (Vite)",
        "TypeScript",
        "FastAPI",
        "FAISS",
        "Gemini 2.5 Flash",
        "Gemini (Google ADK)",
        "Python"
      ],
      description: [
        "Built a session-based AI search engine enabling semantic question answering over uploaded documents and static web pages",
        "Implements a complete Retrieval-Augmented Generation (RAG) pipeline including text extraction, chunking, embeddings, and vector similarity search",
        "Uses FAISS for efficient vector search with configurable chunk size, overlap, and similarity thresholds",
        "Generates grounded AI responses using Gemini constrained strictly to retrieved context to prevent hallucinations",
        "Supports PDF and TXT document ingestion along with static web URL ingestion, with graceful handling of JavaScript-rendered pages",
        "Designed with a stateless FastAPI backend and session-isolated vector stores to support multiple users without a traditional database"
      ],
      github: "https://github.com/itsrahulap/SearchlyAI"
    },
    {
      title: "SemanticFeed",
      subtitle: "AI-Powered Tech News Aggregation & Deduplication Platform",
      summary: "Aggregates tech news from multiple sources, deduplicates related articles into unified stories, and generates concise AI summaries via scheduled background jobs.",
      tech: [
        "React (Vite)",
        "TypeScript",
        "Redux",
        "FastAPI",
        "PostgreSQL",
        "Gemini (Google ADK)",
        "Gemini 2.5 Flash",
        "Python"
      ],
      description: [
        "Built an AI-powered tech news aggregation platform ingesting articles from multiple global and Indian sources",
        "Implements rule-based and semantic deduplication to cluster related articles into unified stories",
        "Generates concise AI summaries per story using efficient batch-based Gemini processing",
        "Supports full article content ingestion with fallback to headlines when content is unavailable",
        "Automates background ingestion via scheduled cron jobs with incremental database updates",
        "Exposes a single feed API returning deduplicated stories with sources, timestamps, and AI summaries"
      ],
      github: "https://github.com/itsrahulap/SemanticFeed"
    },
    {
      title: "QueryDoc",
      subtitle: "Retrieval-Augmented Document Q&A System",
      summary: "A secure RAG chat system for a single uploaded PDF, supporting multi-question conversations with session-isolated vector storage and no stored credentials.",
      tech: [
        "React (Vite)",
        "TypeScript",
        "FastAPI",
        "FAISS",
        "Gemini (Google ADK)",
        "Python"
      ],
      description: [
        "Built a secure Retrieval-Augmented Generation (RAG) system to chat with uploaded documents",
        "Implements vector-based semantic search using FAISS with Gemini embeddings",
        "Supports multi-question conversational querying over a single uploaded PDF",
        "Session-based multi-user isolation without authentication or API key storage",
        "Modern single-page UI with API-key-first flow, document upload, and chat interface",
        "Clear separation of vector storage and chunk metadata for accurate context grounding"
      ],
      github: "https://github.com/itsrahulap/QueryDoc"
    },
    {
      title: "AI-Powered SOAP Note Generator",
      subtitle: "Multi-Agent Medical Assistant",
      summary: "A multi-agent pipeline that extracts structured clinical data from patient conversations and generates guideline-backed, safety-checked SOAP notes.",
      tech: ["Python", "Google ADK", "Gemini 2.5 Flash Lite", "Google Search Tool", "InMemoryRunner"],
      description: [
        "Multi-agent pipeline for medical intake and SOAP note creation",
        "Extracts structured clinical data from conversations",
        "Fetches guideline evidence via Google Search Tool",
        "Generates clinically accurate SOAP notes with safety checks",
        "Fully runnable Kaggle project",
      ],
      link: "https://www.kaggle.com/code/itsrahulap/multi-agent-medical-intake-soap-note-generator",
    },
    {
      title: "Readme Creator",
      subtitle: "AI-Powered README Generator",
      summary: "A web app for building structured, professional READMEs from templates, with live markdown preview and Gemini-powered content optimization.",
      tech: ["React", "Redux", "Gemini", "Material-UI"],
      description: [
        "Web app for creating structured, professional README files",
        "Pre-designed templates with live markdown preview",
        "Gemini-powered content optimization using API key",
        "Add, edit, and reorder README sections with real-time updates",
      ],
      github: "https://github.com/itsrahulap/readmeGenerator",
    },
    {
      title: "Gemini PDF Analyzer",
      subtitle: "Streamlit + GenAI Resume Parsing Tool",
      summary: "Extracts and parses resume PDFs into structured JSON, then generates a polished first-person summary using a selectable Gemini model.",
      tech: ["Streamlit", "Python", "Gemini 1.5 Flash/Pro"],
      description: [
        "Extracts resume text using PyPDF2",
        "Parses resume into detailed structured JSON",
        "Generates professional first-person summary with Gemini",
        "Supports multiple model selection (Flash / Pro)",
        "Clean UI with real-time feedback",
      ],
      github: "https://github.com/itsrahulap/ResumeParserAI",
    },
    {
      title: "EasyDiagno",
      subtitle: "AI-Powered Symptom Checker",
      summary: "A cross-platform symptom-checking app with a chatbot interface, ML-based diagnosis, and a hospital locator with specialization filters.",
      tech: ["Flutter", "Firebase", "Python", "ML"],
      description: [
        "AI-powered symptom checker with chatbot interface",
        "Hospital locator with specialization filters",
        "User & hospital authentication using Firebase",
        "Admin module for managing hospitals and approvals",
        "ML-based diagnosis model integrated via Python API",
      ],
      github: "https://github.com/itsrahulap/EasyDiagno",
    },
    {
      title: "Streamify",
      subtitle: "Full Stack Chat App",
      summary: "A full-stack real-time messaging and video chat app supporting 100+ concurrent users, with screen sharing and image sharing built in.",
      tech: ["React", "Express", "WebRTC"],
      description: [
        "Real-time messaging + video chat",
        "100+ concurrent users",
        "Stream API integration",
        "Screen sharing + image sharing",
      ],
      github: "https://github.com/itsrahulap/streamify",
    },
  ],
  skills: {
    frontend: ["React", "Angular", "TypeScript", "JavaScript (ES6+)", "SCSS", "HTML5", "CSS3"],
    backend: ["Node.js", "Express", "FastAPI", "Python", "PostgreSQL", "MongoDB", "REST APIs"],
    state: ["NgRx", "NGXS", "RxJS", "Redux Toolkit"],
    ai_tools: [
      "GitHub Copilot",
      "ChatGPT",
      "Gemini CLI / AI Studio",
      "Cloud Code (AI-assisted development)",
      "Antigravity (AI dev tool)"
    ],
    ai: ["OpenAI", "Gemini", "Google ADK", "LangChain", "Whisper", "LLM Prompt Engineering"],
    tools: ["Docker", "Temporal", "Git", "Cypress", "Postman", "PyPDF2", "BeautifulSoup"],
    realtime: ["WebSockets", "WebRTC", "Twilio"],
    design: ["Figma", "UI/UX"]
  }

};
