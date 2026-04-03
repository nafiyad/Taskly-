# Taskly — AI-Powered Task Management App

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com)
[![OpenAI](https://img.shields.io/badge/OpenAI_API-412991?style=flat&logo=openai&logoColor=white)](https://openai.com)

> An AI-powered task management application that uses the OpenAI API for intelligent task prioritization and automated categorization.

## Features

- **AI Task Prioritization** — Integrates OpenAI API to analyze tasks and suggest priority ordering
- **Automated Categorization** — LLM-powered automatic tagging and organization of tasks
- **Real-time Sync** — Supabase backend for real-time data synchronization
- **Authentication** — Secure user authentication with JWT tokens
- **Responsive UI** — Clean React frontend with TypeScript

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js, REST API |
| Database | Supabase (PostgreSQL) |
| AI | OpenAI API (GPT) |
| Auth | JWT Authentication |

## Getting Started

```bash
# Clone the repository
git clone https://github.com/nafiyad/Taskly-.git
cd Taskly-

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your OPENAI_API_KEY and Supabase credentials

# Run the development server
npm run dev
```

## Author

**Nafiyad Adane** — [nafiyad.ca](https://nafiyad.ca) · [LinkedIn](https://www.linkedin.com/in/nafiyad-adane-g-041a04200/) · [GitHub](https://github.com/nafiyad)
