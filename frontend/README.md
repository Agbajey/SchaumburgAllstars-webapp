# Schaumburg Allstars Web Application

A full-stack football club web application built with **React and Node.js/Express** that displays players, fixtures, news, and match highlights.

This project demonstrates **full-stack development, cloud deployment, and DevOps workflows**.

---

# Live Website

https://schaumburgallstarsfc.com

---

# GitHub Repository

https://github.com/Agbajey/SchaumburgAllstars-webapp

---

# Features

- Players page
- Fixtures page
- Club news updates
- Match highlights
- Responsive design (mobile and desktop)
- Custom domain deployment

---

# Tech Stack

- React
- Node.js
- Express
- JavaScript
- Git & GitHub
- Vercel
- Render

---

# Architecture

- Frontend: React
- Hosting: Vercel
- Backend: Node.js / Express
- API Hosting: Render
- Domain: schaumburgallstarsfc.com
- Version Control: GitHub

**Flow:**  
Users → Domain → Vercel (React Frontend) → Render API → Node.js Backend

---

# Architecture Diagram

```mermaid
flowchart TD
    U[Users] --> D[schaumburgallstarsfc.com]
    D --> F[Vercel Frontend<br/>React App]
    F --> B[Render Backend<br/>Node.js / Express API]
    G[GitHub Repository] --> F
    G --> B