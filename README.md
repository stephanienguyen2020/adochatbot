# 🤖 MarginFi AI Assistant

An intelligent chatbot designed to help users navigate MarginFi's platform and understand DeFi concepts. Powered by GPT-4 and RAG (Retrieval Augmented Generation), this AI assistant provides context-aware, real-time responses with a sleek, modern interface.

> **📝 Note:** RAG (Retrieval Augmented Generation) enhances the AI's responses by pulling relevant information from MarginFi's documentation in real-time. This means the chatbot provides accurate, up-to-date answers specific to MarginFi's platform, rather than relying solely on GPT-4's general knowledge.

## 🎯 Problem Statement

Currently, MarginFi's website has limited search capabilities:

- Search is restricted to FAQ pages only
- Requires exact keyword matching
- Limited support for natural language questions
- New users struggle to find basic information about MarginFi
- Difficult for beginners to understand DeFi concepts

## 💡 Solution

Our AI Chatbot addresses these challenges by providing:

- Natural language understanding with MarginFi-specific context
- Real-time, conversational responses
- RAG-powered accurate information about MarginFi and DeFi
- Beginner-friendly explanations
- Instant access to platform navigation help

## ✨ Features

### 🎨 Modern UI & Design

- **Sleek Interface**: Built with modern design principles
- **Responsive Layout**: Adapts perfectly to any device
- **Smooth Animations**: Polished user interactions
- **Custom Theming**: Matches MarginFi's brand identity

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

- **GPT-4 + RAG Integration**: Context-aware responses using MarginFi's documentation
- **Real-Time Streaming**: Instant response generation
- **Server-Sent Events**: Efficient data transmission
- **Modern Stack**: Next.js 14, TypeScript, Tailwind CSS
- **Responsive Design**: Works seamlessly on all devices
- **Accessibility**: WCAG 2.1 compliant

## 🚀 Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
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
   - Add your OpenAI API key to `.env.local`:

```bash
OPENAI_API_KEY=your_api_key_here
```

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

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: OpenAI GPT-4 with RAG
- **UI Components**: Custom modern components

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts    # API endpoint for chat
│   └── page.tsx            # Main page
├── components/
│   ├── FloatingChatbot.tsx # Main chat interface
│   ├── Message.tsx         # Message component
│   └── ui/                 # UI components
├── hooks/
│   └── useChat.ts          # Chat logic and state management
└── types/
    └── global.d.ts         # TypeScript declarations
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
