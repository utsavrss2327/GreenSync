import os
import exifread
import math
import uuid
import boto3
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Load AWS credentials from .env
load_dotenv()

app = FastAPI(title="GreenSync API", version="1.0.0")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SaplingRecord(BaseModel):
    species: str
    latitude: float
    longitude: float
    timestamp: str

def convert_to_degrees(value):
    """Helper to convert GPS coordinates to degrees in float."""
    d, m, s = value.values
    return float(d.num) / float(d.den) + (float(m.num) / float(m.den)) / 60 + (float(s.num) / float(s.den)) / 3600

@app.get("/")
def read_root():
    return {"message": "Welcome to GreenSync API"}

@app.post("/api/onboard-sapling")
async def onboard_sapling(
    species: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    file: UploadFile = File(...)
):
    """
    FR-1: Geotagged Sapling Onboarding
    Validates EXIF data from the uploaded image against the provided device GPS.
    """
    if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG/PNG allowed.")

    # Read image bytes to extract EXIF
    contents = await file.read()
    
    # Save temporarily to parse EXIF (exifread needs a file-like object)
    temp_filename = f"temp_{file.filename}"
    with open(temp_filename, "wb") as f:
        f.write(contents)
    
    with open(temp_filename, "rb") as f:
        tags = exifread.process_file(f)
        
    # Upload to Amazon S3
    bucket_name = os.getenv("AWS_BUCKET_NAME")
    s3_url = ""
    try:
        s3 = boto3.client(
            's3',
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
            region_name=os.getenv("AWS_DEFAULT_REGION")
        )
        unique_filename = f"{uuid.uuid4()}_{file.filename}"
        s3.upload_file(
            temp_filename, 
            bucket_name, 
            unique_filename,
            ExtraArgs={'ContentType': file.content_type}
        )
        s3_url = f"https://{bucket_name}.s3.{os.getenv('AWS_DEFAULT_REGION')}.amazonaws.com/{unique_filename}"
        print(f"Successfully uploaded to S3: {s3_url}")
    except Exception as e:
        print(f"Error uploading to S3: {e}")

    os.remove(temp_filename)

    # Strict EXIF validation for Hackathon
    if 'GPS GPSLatitude' not in tags or 'GPS GPSLongitude' not in tags:
        raise HTTPException(
            status_code=400, 
            detail="Spoofing detected: No GPS metadata found in the photo. Please take a live photo instead of downloading one."
        )
    
    lat_tags = tags['GPS GPSLatitude']
    lon_tags = tags['GPS GPSLongitude']
    lat_ref = tags.get('GPS GPSLatitudeRef')
    lon_ref = tags.get('GPS GPSLongitudeRef')

    exif_lat = convert_to_degrees(lat_tags)
    if lat_ref and lat_ref.values[0] != 'N':
        exif_lat = -exif_lat
        
    exif_lon = convert_to_degrees(lon_tags)
    if lon_ref and lon_ref.values[0] != 'E':
        exif_lon = -exif_lon

    # Anti-spoofing threshold (must be within ~10km / 0.1 degrees)
    lat_diff = abs(exif_lat - latitude)
    lon_diff = abs(exif_lon - longitude)
    
    if lat_diff > 0.1 or lon_diff > 0.1:
        raise HTTPException(
            status_code=400, 
            detail=f"Spoofing detected: Image location (EXIF) does not match your device location. Diff: {lat_diff:.4f}"
        )

    # Generate a dummy polygon around the coordinate for satellite processing
    polygon = [
        [longitude - 0.0001, latitude - 0.0001],
        [longitude + 0.0001, latitude - 0.0001],
        [longitude + 0.0001, latitude + 0.0001],
        [longitude - 0.0001, latitude + 0.0001],
        [longitude - 0.0001, latitude - 0.0001]
    ]

    return {
        "status": "success",
        "message": "Sapling verified and boarded successfully.",
        "data": {
            "species": species,
            "verified_latitude": exif_lat,
            "verified_longitude": exif_lon,
            "polygon": polygon,
            "timestamp": datetime.now().isoformat(),
            "photo_url": s3_url
        }
    }

@app.post("/api/audit")
async def trigger_audit(latitude: float, longitude: float, months_elapsed: int):
    """
    FR-2 & FR-3: Automated Satellite Vegetation Index Cross-Check.
    Calculates MSAVI2 for early stage, NDVI for late stage.
    """
    # Mocking Copernicus API Response for Hackathon
    # In a real scenario, we'd use rasterio to parse Sentinel-2 GeoTIFFs or the Sentinel Hub API
    
    print(f"Triggering satellite query for coordinates {latitude}, {longitude}...")
    
    if months_elapsed <= 6:
        # Early Stage: Use MSAVI2
        # MSAVI2 = (2 * NIR + 1 - sqrt((2 * NIR + 1)^2 - 8 * (NIR - Red))) / 2
        # Mocking band values (healthy young plant)
        nir = 0.6
        red = 0.2
        msavi2 = (2 * nir + 1 - math.sqrt((2 * nir + 1)**2 - 8 * (nir - red))) / 2
        index_used = "MSAVI2"
        score = msavi2
    else:
        # Late Stage: Use NDVI
        # NDVI = (NIR - Red) / (NIR + Red)
        nir = 0.8
        red = 0.1
        ndvi = (nir - red) / (nir + red)
        index_used = "NDVI"
        score = ndvi

    return {
        "status": "success",
        "audit_passed": True if score > 0.3 else False,
        "index_used": index_used,
        "score": round(score, 3),
        "message": f"Automated audit passed using {index_used} index."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
