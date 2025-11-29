# 🌙 MoodMate API (Node.js/Express)

This is the RESTful API for the MoodMate mobile application, designed to help users track their emotions, receive personalized support (quotes and scriptures), and manage their profiles securely using Firebase Authentication.

## Key Technologies
* **Backend:** Node.js, Express
* **Database:** MongoDB Atlas (via Mongoose)
* **Documentation:** Swagger / OpenAPI 3.0

## API Endpoints (Summary)

| Resource | Method | Description | Authentication |
| :--- | :--- | :--- | :--- |
| `/api/content/emotions` | GET | Retrieves all static emotional content and support material. | None |
| `/api-docs` | GET | Interactive Swagger documentation. | None |

## Getting Started

1.  **Clone the repository:** `git clone [YourRepoURL]`
2.  **Install dependencies:** `npm install`
3.  **Setup Environment:** Configure the `.env` file with `MONGO_URI`.
4.  **Run:** `node server.js`
