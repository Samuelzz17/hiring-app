# Hiring App (AI-Powered ATS)

A modern Next.js Applicant Tracking System (ATS) empowered by Firebase and Google GenAI. This application streamlines the recruitment process by providing an interactive dashboard for managing candidate pipelines, combined with AI-driven capabilities to automatically extract candidate data from resumes (PDF/DOCX) and score candidate fit using Genkit.

## Features

- **Next.js App Router**: Optimized, SEO-friendly, and highly performant UI using React 19 and Next.js 15.
- **Firebase Integration**: 
  - **Firestore**: For real-time candidate and job database management.
  - **Firebase Storage**: For secure resume/CV document handling.
- **AI-Powered Workflows (Genkit + Google GenAI)**:
  - Automatically parse uploaded resumes to extract structured candidate details.
  - Compute candidate fit scores automatically against job descriptions.
- **Modern UI Components**: Built using Radix UI and Tailwind CSS for an accessible, beautiful, and highly responsive interface.
- **Dashboard & Pipelines**: Job tracking boards for candidates across various stages of the recruitment workflow.

## Technology Stack

- **Framework**: Next.js 15.5 (React 19)
- **Styling**: Tailwind CSS + Radix UI Primitives (shadcn-like architecture)
- **Backend Infrastructure**: Firebase (Firestore, Storage, Web SDK, Admin SDK)
- **AI Orchestration**: Firebase Genkit (`@genkit-ai/google-genai`)
- **Document Emulation**: `pdf-parse` & `mammoth` (DOCX)

## Getting Started

### Prerequisites

- Node.js 20 or later
- A Firebase Project
- A Google Gemini API Key

### 1. Clone the repository

```bash
git clone https://github.com/Samuelzz17/hiring-app.git
cd hiring-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the sample environment file to create your own local configuration:

```bash
cp .env.example .env
```

Open `.env` and fill in your Firebase configuration and Gemini API Key:

```env
GEMINI_API_KEY="your_gemini_api_key_here"

# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="hiring-app-4679d.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="hiring-app-4679d"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="hiring-app-4679d.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="..."
```

### 4. Running the Development Server

Start the Next.js development server:

```bash
npm run dev
```

Visit [http://localhost:9002](http://localhost:9002) in your browser.

### 5. Running AI Genkit UI (Optional)

If you are modifying or testing the AI prompting and document extraction flows, you can run the Genkit Developer UI:

```bash
npm run genkit:dev
```

## Deployment

The repository is pre-configured to be deployed natively on Firebase. Before deploying for the first time, you can initialize Firebase Hosting:

```bash
firebase init hosting
```

And then deploy:

```bash
firebase deploy
```
