# CreditSea Assignment - MERN Application

## 1. Objective

Build a MERN stack application for uploading, parsing, storing, and reporting on Experian credit XML files. The app will allow users to upload XML files, extract credit report data, save it in MongoDB, and display comprehensive reports in a React frontend.

- Upload XML credit reports
- Parse and store credit data
- Display summary and detailed reports

https://github.com/user-attachments/assets/58a5b8c2-0dc4-4ea2-86d1-458a43a63511
---


## 2. High-Level Architecture

**Frontend:**  
- React (with React Router for navigation, Vite)
- Fetches/upload data via RESTful API

**Backend:**  
- Node.js + Express
- Handles file upload (multer memory storage), XML parsing, data storage, and data retrieval

**Database:**  
- MongoDB (via Mongoose ODM)
- Stores extracted credit report data

**File Upload:**  
- Multer middleware for file processing

**XML Parsing:**  
- xml2js for parsing XML to JS objects

---

## 3. Data Model (MongoDB Schema)

### CreditReport
- **basicDetails:**  
  - name: String (Full name of applicant)
  - mobilePhone: String
  - pan: String
  - creditScore: Number
- **reportSummary:**  
  - totalAccounts: Number  
  - activeAccounts: Number  
  - closedAccounts: Number  
  - currentBalance: Number  
  - securedAmount: Number  
  - unsecuredAmount: Number  
  - last7DaysEnquiries: Number
- **creditAccounts:** Array of objects  
  - accountNumber: String  
  - bankName: String   
  - currentBalance: Number  
  - overdueAmount: Number  
  - address: String
- **createdAt:** Date (auto)

---

## 4. Installation

**1. Clone the repository**
```bash
git clone https://github.com/abhis12github/creditsea.git
cd creditsea
```
**2. Backend Setup**
```bash 
cd server
npm install
```
Create a .env file in the server folder with the following variables: 
```bash
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
```
Start the backend server:
```bash
node index.js
```
**3. Frontend Setup:**
```bash
cd ../client
npm install
```
Create a .env file in the client folder with:
```bash
VITE_API_URL=http://localhost:5000/api/v1
```
Start the frontend development server:
```bash
npm run dev
```


## 5. API Specification

### 5.1 File Upload

- **Endpoint:** `POST /api/v1/reports`
- **Request:** Multipart/form-data, field name `file`, accepts `.xml`
- **Response:**  
  - `200 OK` with upload confirmation and parsed data summary  
  - `400 Bad Request` if no file/invalid format  
  - `500 Internal Server Error` on parse/persist errors

### 5.2 Data Retrieval

- **Endpoint:** `GET /api/v1/reports`
    - **Request:** None
    - **Response:** Array of credit report summaries

- **Endpoint:** `GET /api/v1/reports/:id`
    - **Request:** Credit report ID
    - **Response:** Detailed report data

---

## 6. UI/UX Design

### Pages

- **Upload Page:**  
  - File input for XML  
  - Displays upload status

- **Reports List:**  
  - Displays all uploaded reports  
  - Shows a table with name, score, and link to details

- **Report Details:**  
  - Sections for Basic Details, Report Summary, Credit Accounts  
  - Table for account info

### Navigation

- /: Upload
- /reports: Reports List
- /reports/{id}: Report Details
---

## 7. Error Handling & Validation

- Backend:
  - Validate file type/size
  - Graceful error responses (HTTP status + message)
  - Logging (console)

- Frontend:
  - Show error messages for upload failures
  - Validate file before upload

---

## 8. Testing Strategy
- **Frontend:**
  - Render tests for UI components (React Testing Library + Vitest)
  - Upload form interaction tests, file type & size tests


### Running Tests

#### Frontend
```bash
cd client
npm test
```
---

## 9. Deployment

- Frontend: Vercel (VITE_API_URL points to backend URL)
- Backend: Render (PORT, MONGO_URI)


## 10. Future Enhancements

- User authentication for uploads
- Pagination/filtering for reports
- Export reports to PDF/CSV
- Cloud storage

---

## Authors

- [Abhishek Anand](https://github.com/abhis12github)





