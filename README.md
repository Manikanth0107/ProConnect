# ProConnect - Connect without Exaggerations

ProConnect is a professional networking platform designed to connect professionals in a straightforward and meaningful way. Say goodbye to noise and exaggeration, and hello to a genuine social media experience. This platform is built with a robust tech stack, featuring a Next.js frontend and a Node.js backend, to provide a seamless and feature-rich user experience.

## Live Demo

You can access the live application here: [ProConnect](https://pro-connect-three.vercel.app/)

To explore the platform, you can use the following demo credentials:
* **Email**: `demo@gmail.com`
* **Password**: `Demo@1`

## Features

* **User Authentication**: Secure user registration and login functionality.
* **Profile Management**: Users can create and update their professional profiles, including their bio, work experience, and education.
* **Professional Networking**: Users can send, receive, and accept connection requests to build their professional network.
* **Post Creation and Interaction**: Share updates with your network, with support for text and media uploads. Engage with posts through likes and comments.
* **Discover Professionals**: A dedicated section to discover and connect with other professionals on the platform.
* **Downloadable Resumes**: Users can automatically generate and download a PDF version of their profile.
* **Responsive Design**: A clean and modern user interface that is fully responsive and works seamlessly across devices.

## Tech Stack

### Frontend

* **Framework**: [Next.js](https://nextjs.org/)
* **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
* **Styling**: [CSS Modules](https://github.com/css-modules/css-modules)
* **HTTP Client**: [Axios](https://axios-http.com/)
* **UI Components**: [Material-UI](https://mui.com/)
* **Notifications**: [React Toastify](https://fkhadra.github.io/react-toastify/introduction)

### Backend

* **Framework**: [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/)
* **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
* **Authentication**: [bcrypt](https://www.npmjs.com/package/bcrypt) for password hashing
* **File Uploads**: [Multer](https://github.com/expressjs/multer) and [Cloudinary](https://cloudinary.com/) for media storage
* **PDF Generation**: [PDFKit](http://pdfkit.org/) for creating downloadable resumes

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v14 or higher)
* npm or yarn
* MongoDB Atlas account (or a local MongoDB instance)
* Cloudinary account

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/manikanth0107/proconnect.git](https://github.com/manikanth0107/proconnect.git)
    cd proconnect
    ```

2.  **Backend Setup:**
    * Navigate to the `backend` directory:
        ```sh
        cd backend
        ```
    * Install the dependencies:
        ```sh
        npm install
        ```
    * Create a `.env` file and add the following environment variables:
        ```env
        MONGO_URL=<YOUR_MONGODB_CONNECTION_STRING>
        CLOUD_NAME=<YOUR_CLOUDINARY_CLOUD_NAME>
        CLOUD_API_KEY=<YOUR_CLOUDINARY_API_KEY>
        CLOUD_API_SECRET=<YOUR_CLOUDINARY_API_SECRET>
        ```
    * Start the backend server:
        ```sh
        npm run dev
        ```

3.  **Frontend Setup:**
    * Navigate to the `frontend` directory:
        ```sh
        cd frontend
        ```
    * Install the dependencies:
        ```sh
        npm install
        ```
    * Start the frontend development server:
        ```sh
        npm run dev
        ```

The application should now be running on `http://localhost:3000`.

## Project Structure

The project is organized into a `frontend` and a `backend` directory, each with its own modules and components.

### Backend Structure

backend/
├── controllers/      # Request handlers and business logic
├── models/           # Mongoose schemas for the database
├── routes/           # Express routes for different API endpoints
├── middleware/       # Custom middleware functions
├── uploads/          # Local directory for file uploads (if not using Cloudinary)
├── .env              # Environment variables
└── server.js         # The main entry point for the backend server

### Frontend Structure

frontend/
├── src/
│   ├── components/   # Reusable React components
│   ├── config/       # Configuration files (e.g., Redux, Axios)
│   ├── layout/       # Layout components for different page structures
│   ├── pages/        # Next.js pages and API routes
│   └── styles/       # Global styles and CSS modules
├── public/           # Static assets
└── next.config.mjs   # Next.js configuration

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

Project Link: [https://github.com/manikanth0107/proconnect](https://github.com/manikanth0107/proconnect)
