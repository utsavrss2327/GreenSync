# Deployment Guide

## Local Development

### 1. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

### 2. Backend (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Database & Storage (AWS)
Ensure you have created an Amazon RDS PostgreSQL instance and an Amazon S3 bucket. Add your database connection string and AWS credentials to the `.env` file in the backend directory.

## Production Deployment

### Frontend on AWS Amplify
1. Connect your GitHub repository to AWS Amplify in the AWS Console.
2. Select the `frontend` root directory and Next.js as the framework.
3. Configure the `NEXT_PUBLIC_API_URL` environment variable pointing to the deployed backend URL.
4. Click Deploy.

### Backend on AWS App Runner
1. Create a new AWS App Runner service.
2. Connect the GitHub repository and specify the `backend` directory.
3. Set the build command: `pip install -r requirements.txt`.
4. Set the start command: `uvicorn main:app --host 0.0.0.0 --port 8080`.
5. Add necessary Environment Variables (RDS URL, S3 Keys, Copernicus API Keys).
