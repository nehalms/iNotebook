# iNotebook - Secure and Interactive Note Management

This repository contains the source code for iNotebook, a secure and interactive note management application. It is built with the MERN stack (MongoDB, Express.js, React.js, and Node.js) and offers robust features for managing notes, games, user history, and encryption.

---

## Features

- **Secure Note Management**: Add, edit, and delete notes with built-in encryption for secure data storage.
- **User Authentication**: Full authentication and authorization system with login, signup, and password recovery.
- **Games Integration**: Interactive games such as Tic-Tac-Toe and Four-in-Row, enhancing user engagement.
- **Admin Dashboard**: Comprehensive admin portal to manage user data, game statistics, and analytics.
- **Image Editing Tools**: Features like image enhancement, rounding corners, and generating background images.
- **Real-Time Messaging**: Encryption and decryption of user messages for secure communication.
- **Interactive Loading Screens**: Customizable loaders and spinners to improve user experience.

---

## Project Structure

### Backend
```
backend/
├── api/                   # APIs for handling requests
│   └── index.js
├── Services/              # Helper services
│   ├── getEmailHtml.js
│   ├── imagesService.js
│   └── Email.js
├── models/                # Database models
│   ├── Keys.js
│   ├── UserHistory.js
│   ├── User.js
│   ├── Notes.js
│   ├── LoginHistory.js
│   └── GameDetails.js
├── routes/                # API routes
│   ├── message.js
│   ├── game.js
│   ├── AesEncryption.js
│   ├── notes.js
│   ├── EmailController.js
│   ├── data.js
│   ├── auth.js
│   └── imagesController.js
├── middleware/            # Middleware for request handling
│   ├── decrypt.js
│   └── fetchuser.js
├── db.js                  # Database connection
├── package.json           # Node.js dependencies
├── vercel.json            # Deployment configuration for Vercel
└── uploads/               # Directory for file uploads
```

### Frontend
```
iNotebook_frontEnd/
├── public/                # Static assets
│   ├── manifest.json
│   ├── index.html
│   └── robots.txt
├── src/                   # React source code
│   ├── context/           # Context API for state management
│   │   └── notes/
│   │       ├── NoteState.js
│   │       └── noteContext.js
│   ├── components/        # UI components
│   │   ├── Auth/          # Authentication components
│   │   │   ├── Forgot_.js
│   │   │   ├── Signup.js
│   │   │   └── Login.js
│   │   ├── Notes/         # Notes management
│   │   │   ├── Addnote.js
│   │   │   ├── NoteItem.js
│   │   │   └── Notes.js
│   │   ├── Games/         # Games components
│   │   │   ├── Menu.js
│   │   │   ├── Tic_tac_toe.js
│   │   │   └── FrInRow.js
│   │   ├── Admin/         # Admin dashboard components
│   │   │   ├── DashBoard.js
│   │   │   ├── UserNotesData.js
│   │   │   ├── GameStats.js
│   │   │   └── Analytics.js
│   │   ├── Images/        # Image editing components
│   │   └── Utils/         # Utility components
├── App.js                 # Root React component
├── App.css                # Styling for the app
└── index.js               # Entry point for React
```

---

## Installation

### Prerequisites
- Node.js
- MongoDB
- Vercel CLI (optional for deployment)

### Backend Setup
1. **Navigate to the Backend Directory**:
   ```bash
   cd backend
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Start the Backend Server**:
   ```bash
   npm start
   ```

### Frontend Setup
1. **Navigate to the Frontend Directory**:
   ```bash
   cd iNotebook_frontEnd
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Start the Frontend Server**:
   ```bash
   npm start
   ```

### Running the Application
Access the application in your browser at `http://localhost:3000/`.

---

## Deployment

This application can be deployed using platforms like [Vercel](https://vercel.com/) or any other cloud hosting service. Ensure the backend and frontend are correctly configured before deployment.

---

## Future Enhancements

- Integration of advanced analytics for admin.
- Adding real-time collaboration for note editing.
- Improving the UI/UX with modern design trends.
