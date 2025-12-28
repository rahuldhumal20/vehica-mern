# 🚗 Vehica – Smart Vehicle Recommendation System

Vehica is a full-stack MERN application that helps users discover vehicles across multiple categories using  
**ratings, reviews, and a score-based recommendation engine**.  
It provides meaningful insights to users before making a vehicle purchase decision.

---

## 🌐 Live Demo

🔗 **Frontend:** https://vehica-recommendation.netlify.app  
🔗 **Backend API:** https://vehica-mern.onrender.com/api  

> ⚠️ Note: Backend is deployed on free-tier hosting and may take a few seconds to wake up on first request.

---

## 🔥 Features

- Category-wise vehicle browsing (Cars, Bikes, Scooty, Trucks)
- Score-based vehicle recommendations
- Search and price-range filtering
- User ratings (0–5 stars) with automatic average rating calculation
- User reviews with authentication
- Similar vehicle suggestions based on category and attributes
- Secure user authentication using JWT
- Admin dashboard to add, update, and delete vehicle data
- RESTful API architecture

---
## 📱 Responsive Design
The application features a responsive UI that works seamlessly across desktop and mobile browsers, providing an optimal user experience on different screen sizes.


## 🛠️ Tech Stack

### Frontend
- React (Vite)
- JavaScript
- HTML, CSS
- Bootstrap
- Axios

### Backend
- Node.js
- Express.js
- REST APIs

### Database
- MongoDB Atlas

### Authentication
- JSON Web Tokens (JWT)

---

## 📊 Recommendation Logic

Vehicles are recommended using a **weighted scoring algorithm** based on:

- User ratings (highest weight)
- Vehicle mileage
- Price affordability
- Category relevance

Higher-scoring vehicles are prioritized to help users make informed decisions.

---

## ⚙️ Environment Setup

### Backend (`server/.env`)
