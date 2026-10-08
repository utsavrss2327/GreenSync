# GreenSync Backend (FastAPI)

## Running Locally

1. Create a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

## Endpoints
- `POST /api/onboard-sapling`: Accepts an image (with EXIF), species, and device GPS. Validates location and saves a polygon.
- `POST /api/audit`: Triggers an automated satellite check (MSAVI2 for <=6 months, NDVI for >6 months).
