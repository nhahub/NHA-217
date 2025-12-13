# Nova Shop

## Overview

Nova Shop is an e-commerce application built with **React** and **Tailwind CSS** for the frontend, and a backend service to manage products and users.
It provides a smooth shopping experience for users and a management interface for administrators.
Users can browse, search, filter products, and manage their carts, while admins can manage products, categories, and users.

---

## Features

### User Features

* Browse products with details
* Search and filter products by category and price
* Add products to cart
* User authentication (login and register)

### Admin Features

* Admin dashboard to manage products and categories
* Add, edit, and delete products
* View registered users
* Control product availability

---

## Project Structure

```
nova-shop/
│── front/             # React frontend
│── back/              # Backend service (API, database connections)
│── docker-compose/    # Docker setup and configuration
│── README.md
```

---

## Requirements

* Node.js v18 or higher
* npm v9 or higher
* Git
* Docker (if using docker-compose)

---

## Installation & Run

1. Clone the repository:

```bash
git clone https://github.com/your-username/nova-shop.git
```

2. Navigate to the project folder:

```bash
cd nova-shop
```

3. Install frontend dependencies:

```bash
cd front
npm install
```

4. Install backend dependencies:

```bash
cd ../back
npm install
```

5. Start the development servers (frontend and backend separately) or use Docker:

```bash
docker-compose up
```

6. Open the app in your browser:

```
http://localhost:5173
```

---

## Technologies Used

* **Frontend:** React, Tailwind CSS, React Router
* **Backend:** Node.js, Express, Database (MongoDB/PostgreSQL)
* **DevOps:** Docker, Docker Compose
* **Tools:** Git & GitHub, VS Code
