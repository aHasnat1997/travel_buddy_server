# Travel Buddy Matching

#### ER Diagram : https://app.eraser.io/workspace/8Mo8LicLuRW74UJxbdlu?origin=share

#### Live Link: https://_____.vercel.app/

### 👉 **Technology Stack:**
- **Programming Language:** TypeScript
- **Web Framework:** Express.js
- **Object Relational Mapping (ORM):** Prisma with PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)

### 👉 Steps to run the application locally :
- Clone this repo on your system.
- Run this command in the terminal.
  
  ```
  npm install
  ```
- Add a .env file in the root.
- Define values in .env file. Example:
  
  ```
  PORT
  DATABASE_URL
  ACCESS_TOKEN_SECRET
  ACCESS_TOKEN_EXPIRES_TIME
  REFRESH_TOKEN_SECRET
  REFRESH_TOKEN_EXPIRES_TIME
  ```
- Run this command to run the development version(**TypeScript**)
  
  ```
  npm run dev
  ```
- Finally visit ```http://localhost:PORT/``` and use this application locally.