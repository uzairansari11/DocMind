# DocMind 🧠

![DocMind](https://img.shields.io/badge/Status-Active-success.svg) ![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)

**DocMind** is an intelligent, AI-powered knowledge assistant platform. It allows users to upload documents, organize them into collections, and query their personal knowledge base using a sleek, modern chat interface.

## ✨ Features

- **💬 AI Chat Assistant:** Query your uploaded documents and get intelligent, context-aware answers.
- **📁 Document Management:** Seamlessly upload, view, and manage your files.
- **📚 Collections:** Group related documents into curated collections for focused AI querying.
- **🔐 User Authentication:** Secure login, signup, and user session management.
- **⚙️ Profile Settings:** Customize your user profile and preferences.
- **🎨 Modern UI/UX:** Built with Tailwind CSS and `shadcn/ui` for a beautiful, responsive, and accessible experience.
- **🌗 Dark Mode Support:** Seamless toggling between light and dark themes.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) & Base UI
- **Icons:** [Lucide React](https://lucide.dev/)
- **Data Fetching:** [TanStack React Query](https://tanstack.com/query/latest)

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/uzairansari11/DocMind.git
   cd DocMind
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add any necessary environment variables (e.g., API URLs, Authentication keys).

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the application:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📂 Project Structure

```text
frontend/
├── app/                  # Next.js App Router pages and layouts
│   ├── (app)/            # Authenticated application routes (chat, collections, documents, profile, upload)
│   ├── login/            # Login page
│   └── signup/           # Signup page
├── components/           # Reusable React components
│   ├── ui/               # shadcn/ui components
│   ├── chat/             # Chat interface components
│   ├── workspace/        # Application shell and sidebar
│   └── providers/        # Context providers (Auth, Theme, Query)
├── lib/                  # Utility functions and API integrations
├── hooks/                # Custom React hooks
└── public/               # Static assets
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/uzairansari11/DocMind/issues).

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
