# Defense Q&A

This document anticipates technical questions judges may ask and provides the rationale behind our architectural and technical decisions.

## 1. How do you prevent "spoofing" (e.g., uploading an old photo or a photo from the internet)?
We implemented a multi-layered anti-spoofing validation on the backend:
- **EXIF Metadata Extraction:** We extract the original DateTimeOriginal and GPSLatitude/GPSLongitude from the photo's EXIF data.
- **Cross-Validation:** We compare the EXIF GPS location with the device GPS location sent from the frontend. If the distance exceeds a certain threshold (e.g., 50 meters) or the timestamp is not from the current day, the submission is rejected.
- **Format Verification:** We reject photos stripped of EXIF data, forcing volunteers to capture directly from their camera.

## 2. Why Sentinel-2 for NDVI?
Sentinel-2 provides high-resolution (10m/pixel) multispectral imagery specifically designed for vegetation and land cover monitoring. Because its data is openly provided by the Copernicus program, it is cost-effective (free) and offers a revisit time of 5 days, which is perfect for our 3, 6, and 12-month audit intervals.

## 3. How do you estimate Carbon Sequestration?
While an exact calculation requires on-the-ground biomass measurements, we provide an **algorithmic estimate** based on industry standards. We factor in:
1.  **Tree Species:** Fast-growing species (e.g., Bamboo, Eucalyptus) have different sequestration curves than slow-growing hardwoods (e.g., Oak).
2.  **Age of Sapling:** Calculated from the onboarding timestamp.
3.  **Survival Status:** Only trees that pass the longitudinal growth audits contribute to the final tally.

## 4. How does the Verification Badge work?
The Verification Badge acts as an immutable certificate. It is only issued when two independent data sources align:
1.  **Ground Truth:** The volunteer successfully uploads the 3/6/12-month re-verification photos.
2.  **Satellite Truth:** The Sentinel-2 NDVI index for the specific plantation polygon shows a positive delta (indicating healthy vegetation growth).

## 5. What happens if it's cloudy when the satellite passes over?
Optical satellite imagery like Sentinel-2 cannot penetrate clouds. To mitigate this, our backend query logic searches for the "least cloudy" image within a 30-day window around the audit date, using cloud cover metadata filtering provided by the Sentinel API.
