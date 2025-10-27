# Eventr - Event Management System

A modern event management application built with React, TypeScript, and Vite. Eventr allows users to create, manage, and RSVP to events.

## Features

- **User Authentication**: Register, login, and manage user sessions
- **Event Management**: Create, edit, and delete events
- **RSVP System**: Allow users to RSVP to events with status (Going, Maybe, Not Going)
- **Dashboard**: View events you've created and events you're attending
- **Responsive Design**: Works on mobile, tablet, and desktop devices

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: TailwindCSS, Shadcn/UI
- **Routing**: React Router
- **Mock Backend**: Mock Service Worker (MSW)
- **State Management**: React Context API
- **Form Handling**: React Hooks
- **Notifications**: Custom Toast Component

## Project Structure

```
eventr-demo/
├── public/              # Static assets
├── src/
│   ├── api/             # API and mock data setup
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── pages/           # Application pages
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Helper utilities
│   ├── App.tsx          # Main application component
│   ├── index.css        # Global styles
│   └── main.tsx         # Application entry point
├── .eslintrc.cjs        # ESLint configuration
├── .prettierrc          # Prettier configuration
├── package.json         # Project dependencies
├── postcss.config.js    # PostCSS configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/eventr-demo.git
   cd eventr-demo
   ```

2. Install dependencies
   ```
   npm install
   # or
   yarn
   ```

3. Start the development server
   ```
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Authentication

- Register a new account or use one of the demo accounts:
  - Regular User: `user@example.com` / `password123`
  - Admin User: `admin@example.com` / `password123`

### Creating Events

1. Log in to your account
2. Navigate to the Dashboard
3. Click "Create Event"
4. Fill in the event details and submit

### RSVP to Events

1. Browse events on the home page
2. Click on an event to view details
3. Use the RSVP buttons to indicate your attendance status

## Development

### Mock Backend

This project uses Mock Service Worker (MSW) to simulate a backend API. All data is stored in localStorage for persistence between sessions.

### Adding New Features

1. Define types in `src/types/`
2. Add API handlers in `src/api/handlers.ts`
3. Create components in `src/components/`
4. Add pages in `src/pages/`
5. Update routes in `src/App.tsx`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Shadcn/UI](https://ui.shadcn.com/)
- [Mock Service Worker](https://mswjs.io/)