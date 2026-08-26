# 🌾 CropConnect - Farmer-to-Buyer Direct Marketplace

[![Node.js](https://img.shields.io/badge/Node.js-v20.12.2-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v5.1.0-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Mapbox](https://img.shields.io/badge/Mapbox-GL--JS-000000?style=flat-square&logo=mapbox&logoColor=white)](https://www.mapbox.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.style=flat-square)](https://opensource.org/licenses/ISC)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render-46E3B7?style=flat-square&logo=render&logoColor=white)](https://crop-connect-t0qz.onrender.com/)

**CropConnect** is a full-stack web application designed to eliminate intermediaries in agriculture by connecting **farmers** directly with **buyers**. Featuring location-based matching powered by Mapbox GL JS, real-time crop inventory management, and intuitive order request workflows, CropConnect makes produce trade transparent, efficient, and direct.

🌐 **Live Application**: [https://crop-connect-t0qz.onrender.com/](https://crop-connect-t0qz.onrender.com/)

---

## 🌟 Key Features

### 👨‍🌾 Farmer Portal
- **Inventory Management**: Create, update, adjust prices, or remove crop listings in real-time.
- **Request Dashboard**: View incoming purchase requests from buyers with full quantity and pricing breakdowns.
- **Order Fulfilment**: Accept inventory orders and track transaction statuses.

### 🛒 Buyer Portal
- **Geospatial Discovery**: Interactive Mapbox map rendering nearby farmers with custom markers and crop availability.
- **Direct Requests**: Send purchase requests directly to farmers based on quantity and location requirements.
- **Order History**: Track past orders, pending offers, and accepted transactions.

### 📍 GIS & Mapping Capabilities
- **Geocoding API**: Automatic conversion of location strings to geographical coordinates using `@mapbox/mapbox-sdk`.
- **Custom Interactive Map**: Visually locate registered farmers on dynamic vector maps.

### 🔐 Security & Authentication
- **Dual Authentication Strategies**: Dedicated authentication workflows for Farmers (`farmer-local`) and Buyers (`buyer-local`) via Passport.js.
- **Session Store**: Secure MongoDB-backed sessions via `connect-mongo` with session expiration and flash messaging.

---

## 🛠️ Architecture & Tech Stack

```
 ┌─────────────────────────────────────────────────────────────┐
 │                         CropConnect                         │
 └──────────────────────────────┬──────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
 ┌──────────────┐        ┌──────────────┐        ┌──────────────┐
 │   Frontend   │        │   Backend    │        │   Database   │
 ├──────────────┤        ├──────────────┤        ├──────────────┤
 │ EJS / Boiler │        │ Express 5.x  │        │ MongoDB      │
 │ Mapbox GL JS │        │ Node.js 20   │        │ Mongoose ORM │
 │ Vanilla CSS  │        │ Passport.js  │        │ Connect-Mongo│
 └──────────────┘        └──────────────┘        └──────────────┘
```

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Runtime Environment** | Node.js (v20.12.2) | Server-side JavaScript execution environment |
| **Web Framework** | Express.js (v5.1.0) | Web application framework handling routing & middleware |
| **Database** | MongoDB & Mongoose | NoSQL database with object data modeling (ODM) |
| **Templating Engine** | EJS & EJS-Mate | Server-side template rendering with modular layouts |
| **Authentication** | Passport.js & Passport-Local | Dual-strategy authentication for Farmers and Buyers |
| **Session Store** | Express-Session & Connect-Mongo | Session handling persisted in MongoDB Atlas |
| **Maps & Geocoding** | Mapbox GL JS & `@mapbox/mapbox-sdk` | Interactive maps and forward geocoding |
| **Data Validation** | Joi | Schema validation for user inputs and inventory items |

---

## 📂 Project Structure

```
Crop_Connect/
├── config/                  # Configuration files
│   ├── database.js          # MongoDB database connection setup
│   ├── passport.js          # Passport auth strategies (farmer-local, buyer-local)
│   └── index.js             # Configuration export barrel
├── controllers/             # Request handlers (MVC Architecture)
│   ├── auth.controller.js   # Authentication logic
│   ├── farmer.controller.js # Farmer dashboard & inventory operations
│   ├── buyer.controller.js  # Buyer discovery & request submission
│   └── index.js             # Controller export barrel
├── middleware/              # Custom Express middleware
│   ├── index.js             # Role validation & route guard middleware
│   └── middleware.legacy.js # Legacy route handler fallbacks
├── models/                  # Mongoose Schemas & Models
│   ├── User.js              # Base User schema
│   ├── Farmer.js            # Farmer profile schema
│   ├── Buyer.js             # Buyer profile schema
│   ├── Inventory.js         # Crop inventory schema
│   └── Request.js           # Trade request schema
├── routes/                  # Application Routes
│   ├── api.js               # RESTful JSON endpoints (stats, geocoding)
│   ├── auth.js              # Login/Register/Logout routes
│   ├── buyer.js             # Buyer workspace routes
│   ├── farmer.js            # Farmer workspace routes
│   └── index.js             # Main router registry
├── services/                # Business & API Integration Logic
│   ├── request.service.js   # Order transaction processing
│   └── map.service.js       # Mapbox geocoding interface
├── views/                   # EJS View Templates
│   ├── layouts/             # Base layout wrappers (boilerplate)
│   ├── pages/               # Main view pages (home, dashboard, auth)
│   └── partials/            # Reusable UI partials (header, footer, flash alerts)
├── public/                  # Static Assets
│   ├── css/                 # Custom stylesheets
│   └── js/                  # Client-side JavaScript
├── .env                     # Environment variables (Git-ignored)
├── app.js                   # Application entry point
└── package.json             # NPM dependencies & scripts
```

---

## ⚡ RESTful API Endpoints

CropConnect exposes internal JSON API endpoints for data fetching and geocoding:

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/request/:id` | Yes | Retrieves order request details by ID |
| `GET` | `/api/stats` | No | Retrieves global platform transaction statistics |
| `GET` | `/api/coordinates` | No | Converts location query string to Mapbox geo-coordinates |

---

## 🚀 Getting Started

Follow these steps to run CropConnect locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.12.2 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)
- [Mapbox Access Token](https://www.mapbox.com/) (Free tier key for geocoding & interactive maps)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Sampath-12-alt/Crop_Connect.git
   cd Crop_Connect
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```bash
   touch .env
   ```
   Add the following configuration parameters:
   ```env
   # Database Connection String
   ATLASDB_URL=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/cropconnect

   # Mapbox API Token
   MAP_TOKEN=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example_token

   # Session Secret
   SECRET=your_super_secret_session_key

   # Application Port (Optional, defaults to 8080)
   PORT=8080
   ```

4. **Run the Development Server**:
   ```bash
   # Using nodemon for hot-reloading
   npm run dev

   # Or using standard node execution
   npm start
   ```

5. **Access the Application**:
   Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

---

## 🔒 Environment Variables Reference

| Variable | Required | Description |
| :--- | :--- | :--- |
| `ATLASDB_URL` | **Yes** | MongoDB connection string (Atlas or Local MongoDB URI) |
| `MAP_TOKEN` | **Yes** | Mapbox GL public access token for maps & geocoding |
| `SECRET` | **Yes** | Secret string used to sign express-session cookie |
| `PORT` | No | Port on which server runs (Default: `8080`) |
| `NODE_ENV` | No | Application environment (`development` / `production`) |

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve CropConnect:

1. Fork the Repository
2. Create your Feature Branch (`git checkout -b feature/AwesomeFeature`)
3. Commit your Changes (`git commit -m 'Add some AwesomeFeature'`)
4. Push to the Branch (`git checkout -b feature/AwesomeFeature`)
5. Open a Pull Request

---

## 👨‍💻 Author

**Sampath Chiluka**
- GitHub: [@Sampath-12-alt](https://github.com/Sampath-12-alt)

---

## 📄 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).
