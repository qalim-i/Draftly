# Draftly

A block-based editor combined with aesthetics and Calendar integration. Create, organize, and manage your notes with a beautiful, minimalist interface.

## Features

### 📝 Block-Based Editor
- **Notion-like Editing**: Create text, headings, and lists using blocks.
- **Slash Commands**: Type `/` to open a menu and transform blocks.
- **Markdown Shortcuts**: Support for `- ` (bulleted list), `1. ` (numbered list), and more.
- **Keyboard Navigation**: Move between blocks seamlessly with arrow keys.

### 📅 Calendar Integration
- **Clean Design**: Minimal calendar interface optimized for productivity.
- **Agenda View**: View daily events alongside the calendar grid.
- **Sync Capable**: Stubbed functionality to sync events to Google Calendar.

### 🎨 Theming & Customization
- **Dark Mode**: Optimized "Absolute Black" (`#000000`) theme.
- **Settings Modal**: Toggle themes and preferences via a dedicated settings UI.
- **CSS Variables**: Extensive use of variables for consistent design tokens.

### 📱 Responsive Layout
- **Mobile Support**: 
  - Sidebar collapses on small screens.
  - Hamburger menu toggle.
  - Touch-friendly interactions.

## Tech Stack
- **Framework**: React + Vite
- **Styling**: Vanilla CSS + CSS Modules
- **State Management**: React Context (Theme) & Local State

## Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2. **Build for Production**
    ```bash
    npm run build
    ``` 

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

## Usage Tips
- **Toggle Theme**: Click "Settings" in the sidebar footer -> Select Theme.
- **Mobile Menu**: On screens < 768px, use the ☰ button in the top-left to access navigation.
