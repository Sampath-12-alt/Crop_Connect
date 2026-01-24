# 🌾 CropConnect - Farmer-to-Buyer Crop Trading Platform

**CropConnect** is a full-stack web application that connects **farmers** with **buyers** to facilitate transparent and location-based crop trade. It includes real-time map interactions, buyer requests, and clean UI interfaces tailored for each user type.

--> https://crop-connect-t0qz.onrender.com/
---

## 🚀 Features

- 👩‍🌾 Separate Dashboards for Farmers & Buyers  
- 📍 Location-Based Matching using Mapbox GL JS  
- ✅ Send/Receive Crop Purchase Requests  
- 🔐 User Authentication (Register/Login/Logout)  
- 🗺️ Interactive Map with Custom Markers  
- 📦 Request Management System for Farmers  
- 🎨 Styled with Flexbox, Responsive UI  

---

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript, EJS  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB with Mongoose  
- **Map Integration**: Mapbox GL JS  
- **Authentication**: Express-session and Passport  
- **Templating Engine**: EJS  

---

## 🧑‍💻 Getting Started

### 1. **Clone the repo**:
**git clone https://github.com/Sampath-12-alt/Crop_Connect.git
cd cropconnect

### **2. Install dependencies:**
npm install
---
3. Create .env file:
bash
Copy
touch .env
Paste the following in your .env file:

env
Copy
DB_URL=your_mongo_db_connection_string
MAP_TOKEN=your_mapbox_access_token
SESSION_SECRET=your_secret_key

----

4. Run the development server:
 node app.js

----

5. Visit the app:
Open your browser and go to:
http://localhost:8080

---

🔐 Authentication Flow
Passwords are hashed securely (bcrypt recommended)

Session-based login/logout handled with express-session

User roles: Farmer / Buyer

📂 Folder Structure

cropconnect/
├── models/              # Mongoose models (Farmer, Buyer, Request)
├── public/              # Static files (images, stylesheets)
│   └── images/
├── utils/               # Middleware or helper functions
├── views/               # EJS templates
│   └── partials/        # Header, footer, etc.
├── .env                 # Environment variables (not committed)
├── server.js            # Main server entry point
└── README.md            # Project documentation**

---

## 👨‍💻 Author

**Sampath Chiluka**  
GitHub: [@Sampath-12-alt](https://github.com/Sampath-12-alt)

