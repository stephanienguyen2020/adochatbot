# 🤖 Andromeda AI Assistant

An intelligent chatbot designed to help users navigate Andromeda's platform and understand DeFi concepts. Powered by GPT-4 and RAG (Retrieval Augmented Generation), this AI assistant provides context-aware, real-time responses with a sleek, modern interface.

> **📝 Note:** RAG (Retrieval Augmented Generation) enhances the AI's responses by pulling relevant information from Andromeda's documentation in real-time. This means the chatbot provides accurate, up-to-date answers specific to Andromeda's platform, rather than relying solely on GPT-4's general knowledge.

## 🎯 Demo

https://github.com/user-attachments/assets/26dc3620-5383-459f-b945-7f8c4e629273

## 🎯 Problem Statement

Currently, Andromeda's website has limited search capabilities:

- Search is restricted to FAQ pages only
- Requires exact keyword matching
- Limited support for natural language questions
- New users struggle to find basic information about Andromeda
- Difficult for beginners to understand DeFi concepts

## 💡 Solution

My AI Chatbot addresses these challenges by providing:

- Natural language understanding with Andromeda-specific context
- Real-time, conversational responses
- RAG-powered accurate information about Andromeda and DeFi
- Beginner-friendly explanations
- Instant access to platform navigation help

## ✨ Features

### 🎨 Modern UI & Design

- **Sleek Interface**: Built with modern design principles
- **Responsive Layout**: Adapts perfectly to any device
- **Smooth Animations**: Polished user interactions
- **Custom Theming**: Matches Andromeda's brand identity

### 🎯 User-Focused Interface

- **Floating Chat Window**: Easy access from any page
- **Context-Aware Responses**: Understands user's knowledge level
- **Suggested Questions**: Common queries for new users
- **Dark/Light Mode**: Toggle between dark and light themes
- **File Attachments**: Share files through the paperclip icon
- **Message Actions**: Edit and copy message content
- **Expandable Window**: Toggle between compact and full-screen modes

### ⚡ Real-Time Assistance

- **Live Streaming**: See answers as they're being generated
- **Interactive Guidance**: Step-by-step help for complex tasks
- **Voice Input**: Speak your questions naturally

## 🛠️ Technical Features

- **GPT-4 + RAG Integration**: Context-aware responses using Andromeda's documentation
- **Real-Time Streaming**: Instant response generation
- **Server-Sent Events**: Efficient data transmission
- **Modern Stack**: Next.js 14, TypeScript, Tailwind CSS
- **Responsive Design**: Works seamlessly on all devices
- **Accessibility**: WCAG 2.1 compliant

## 🚀 Technology Stack

![Next.js](https://img.shields.io/badge/Next.js%2014-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![OpenAI](https://img.shields.io/badge/GPT--4-412991?style=for-the-badge&logo=openai&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-3178C6?style=for-the-badge&logo=chainlink&logoColor=white)

### Development Tools

![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)

### AI & Data

![OpenAI Embeddings](https://img.shields.io/badge/OpenAI%20Embeddings-412991?style=for-the-badge&logo=openai&logoColor=white)
![Vector Store](https://img.shields.io/badge/Vector%20Store-000000?style=for-the-badge&logo=database&logoColor=white)
![RAG](https://img.shields.io/badge/RAG-FF6B6B?style=for-the-badge&logo=buffer&logoColor=white)

## 📁 Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/andromeda-chatbot
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up your environment variables:
   - Copy `.env.sample` to `.env.local`
   - Add your API keys to `.env.local`:

```bash
OPENAI_API_KEY=your_api_key_here
LANGCHAIN_API_KEY=your_langchain_api_key_here
```

> **Note:** The LangChain API key is required for tracing and monitoring your RAG pipeline. You can get it from [LangSmith](https://smith.langchain.com/).

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 💻 Technology Stack

![Next.js](https://img.shields.io/badge/Next.js%2014-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![OpenAI](https://img.shields.io/badge/GPT--4-412991?style=for-the-badge&logo=openai&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-3178C6?style=for-the-badge&logo=chainlink&logoColor=white)

### Development Tools

![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)

### AI & Data

![OpenAI Embeddings](https://img.shields.io/badge/OpenAI%20Embeddings-412991?style=for-the-badge&logo=openai&logoColor=white)
![Vector Store](https://img.shields.io/badge/Vector%20Store-000000?style=for-the-badge&logo=database&logoColor=white)
![RAG](https://img.shields.io/badge/RAG-FF6B6B?style=for-the-badge&logo=buffer&logoColor=white)

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       ├── route.ts    # API endpoint for chat
│   │       └── prompts.ts  # System and response guidelines
│   └── page.tsx            # Main page
├── components/
│   ├── FloatingChatbot.tsx # Main chat interface
│   ├── Message.tsx         # Message component
│   ├── ThinkingDots.tsx    # Loading animation component
│   └── ui/                 # UI components
├── hooks/
│   └── useChat.ts          # Chat logic and state management
├── lib/
│   ├── documentLoader.ts   # RAG document loading utilities
│   ├── ragChain.ts        # LangChain RAG implementation
│   ├── vectorstore.ts     # Vector storage for embeddings
│   └── utils.ts           # Shared utility functions
└── types/
    └── global.d.ts         # TypeScript declarations
```

## 🚀 Future Enhancements & Roadmap

### 🔍 Enhanced RAG Capabilities

- **Dynamic Web Scraping**: Fetch real-time data from Andromeda's documentation website
- **Link Processing**: Extract and understand content from shared URLs during conversations
- **PDF Document Support**: Process uploaded PDF documents for context-aware responses
- **Multi-Source Integration**: Combine information from multiple documentation sources
- **Advanced Vector Storage**:
  - Replace MemoryStore with MongoDB Atlas Search for better scalability
  - Improved semantic search capabilities
  - Persistent storage for embeddings
  - Better handling of large document collections

### 🤖 Advanced AI Features

- **Multi-Agent System**:

  - Specialized agents for different tasks (technical support, DeFi education, etc.)
  - Agent collaboration for complex queries
  - Automatic agent selection based on user needs

- **Enhanced Learning**:
  - Learn from user interactions to improve responses
  - Build a knowledge base of common queries and solutions
  - Adaptive response style based on user preferences

### 🛠️ Technical Improvements

- **Performance Optimization**:

  - Faster response times through caching
  - Improved context retrieval algorithms
  - Better memory management for long conversations

- **Integration Features**:
  - Direct wallet connection support
  - Real-time market data integration
  - Transaction simulation capabilities

### 👥 User Experience

- **Personalization**:

  - User preference remembering
  - Customizable UI themes
  - Saved conversation history

- **Accessibility**:
  - Enhanced screen reader support
  - Keyboard navigation improvements
  - Multi-language support

> **Note:** This roadmap is dynamic and will be updated based on user feedback and platform needs.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
