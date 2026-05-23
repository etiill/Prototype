# Professional Prototype

## Project Overview
This repository contains a full-stack web application with a decoupled architecture. It consists of a React single-page application (SPA) frontend and a Laravel 12 API backend. 

## Key Directories
- **`client/`**: Contains the React SPA frontend.
- **`server/`**: Contains the Laravel API backend.

## Tech Stack
### Frontend (`client/`)
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS, Radix UI (accessible components), Emotion
- **State/Data:** Axios (HTTP client), React Hook Form
- **Language:** TypeScript

### Backend (`server/`)
- **Framework:** Laravel 12 (PHP 8.2+)
- **Authentication:** Laravel Sanctum (API token authentication)
- **Database:** SQLite (default configured, see `database/database.sqlite`)

## Building and Running

### Frontend
Navigate to the `client` directory:
```bash
cd client
npm install
npm run dev
```

### Backend
Navigate to the `server` directory:
```bash
cd server
composer install
npm install
composer run dev
```
*(Note: `composer run dev` in the backend uses concurrently to run `php artisan serve`, queue listener, and Vite simultaneously).*

## Development Conventions
- **API Communication:** The frontend communicates with the backend via RESTful APIs. Authentication is handled using tokens provided by Laravel Sanctum.
- **UI Components:** The frontend heavily utilizes Radix UI primitives for accessible, unstyled components, which are then styled using Tailwind CSS (consistent with the `components/ui/` structure).
- **Backend Structure:** Follows standard Laravel conventions with Models, Controllers (API namespace), Requests, and Resources.
