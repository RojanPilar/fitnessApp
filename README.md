# RojanFit — Full-Stack Activity Analytics & SaaS Tracking Dashboard

A high-fidelity, secure full-stack fitness tracking application and interactive analytics dashboard built with an enterprise MVC architecture and a clean, dark-mode SaaS editorial visual layout.

## Tech Stack
* **Frontend Framework:** Vue.js (Single Page Architecture)
* **UI Grid Components:** Element UI Filters
* **Backend Runtime:** Node.js & Express.js (MVC Pattern)
* **Database Layer:** MongoDB Relational Schema Mapping
* **Authentication Pipeline:** JSON Web Tokens (JWT) & Axios State Sync
* **Deployment Platform:** Vercel PaaS

## Key Features Built
* **Secure Authentication Architecture:** Form authorization gates with custom backend token validation routines to isolate and safeguard distinct user profiles.
* **Dynamic Analytics Engine:** A highly responsive tracking dashboard calculating real-time mathematical state changes for total logged workouts, completed tasks, and percentage metrics.
* **Complete Data CRUD Pipelines:** Inline interactive session containers built with clean input schemas, duration tracking logs, and active Edit, Complete, and Delete data actions.
* **Production Route Optimization:** Deployed entirely on an active decoupled stack with strict routing configurations to prevent 404 container shifts across viewports.

## Secured Demo Testing Credentials
Reviewers can access the live administrative and dashboard interfaces using the following sandbox profile data:
* **Admin Login/Email:** `admin123@mail.com`
* **Admin Password:** `admin123`

## Installation & Local Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com
   cd fitness-app
   ```
2. **Install core dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment infrastructure:**
   Create a `.env` file in your root folder and define your database credentials:
   ```env
   PORT=5000
   MONGODB_URI="your_mongodb_atlas_connection_string"
   JWT_SECRET="your_secure_jwt_token_secret"
   ```
4. **Launch the local development environment:**
   ```bash
   npm run dev
   ```
