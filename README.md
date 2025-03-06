# iNotebook - Secure and Interactive Note Management

This repository contains the source code for iNotebook, a secure and interactive note management application. It is built with the MERN stack (MongoDB, Express.js, React.js, and Node.js) and offers robust features for managing notes, games, user history, and encryption.

---

## Features

- **User Authentication**: Full authentication and authorization system with login, signup, and password recovery.
- **Secure Note Management**: Add, edit, and delete notes with built-in encryption for secure data storage.
- **Task Management**: Create, update, and track tasks with an organized to-do list system.
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
│   ├── Email.js
│   ├── getEmailHtml.js
│   ├── imagesService.js
│   └── permissionsService.js
├── models/                # Database models
│   ├── Folder.js
│   ├── GameDetails.js
│   ├── Keys.js
│   ├── LoginHistory.js
│   ├── Notes.js
│   ├── Task.js
│   ├── User.js
│   └── UserHistory.js
├── routes/                # API routes
│   ├── AesEncryption.js
│   ├── EmailController.js
│   ├── auth.js
│   ├── data.js
│   ├── game.js
│   ├── imagesController.js
│   ├── message.js
│   ├── notes.js
│   ├── permissionsController.js
│   └── tasks.js
├── middleware/            # Middleware for request handling
│   ├── checkPermission.js
│   ├── decrypt.js
│   └── fetchuser.js
├── db.js                  # Database connection
├── package.json           # Node.js dependencies
├── vercel.json            # Deployment configuration for Vercel
├── .gitignore             # Git ignore file
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
│   │   ├── auth_state/
│   │   │   ├── AuthState.js
│   │   │   └── authContext.js
│   │   ├── notes/
│   │   │   ├── NoteState.js
│   │   │   └── noteContext.js
│   │   └── tasks/
│   │       ├── TaskState.js
│   │       └── taskContext.js
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
│   │   │   ├── FrInRow.js
│   │   │   └── images/
│   │   ├── Admin/         # Admin dashboard components
│   │   │   ├── DashBoard.js
│   │   │   ├── UserNotesData.js
│   │   │   ├── GameStats.js
│   │   │   ├── Analytics.js
│   │   │   └── Permissions.js
│   │   ├── Images/        # Image editing components
│   │   │   ├── Enhance.js
│   │   │   ├── GenerativeBackground.js
│   │   │   ├── ImageEditor.js
│   │   │   ├── RotateImage.js
│   │   │   ├── RoundCorners.js
│   │   │   ├── Shapen.js
│   │   │   ├── TryIt.js
│   │   │   ├── inputNumber.css
│   │   │   └── StaticImages/
│   │   ├── Messages/      # Encrypted messaging components
│   │   │   └── Encrypt_Decrypt_Msg.js
│   │   ├── ToDoLists/     # Task and folder management
│   │   │   ├── Folders/
│   │   │   │   ├── AddFolder.js
│   │   │   │   ├── Folder.js
│   │   │   │   └── FolderItem.js
│   │   │   └── Tasks/
│   │   │       ├── AddTask.js
│   │   │       ├── TaskInfo.js
│   │   │       ├── TaskItem.js
│   │   │       └── Tasks.js
│   ├── App.js             # Root React component
│   ├── App.css            # Styling for the app
│   ├── index.js           # Entry point for React
└── .gitignore             # Git ignore file
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
