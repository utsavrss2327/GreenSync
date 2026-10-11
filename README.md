# GreenSync

**Satellite & Geotagged Tree Plantation Autonomous Verification System**

[![Status: Complete](https://img.shields.io/badge/Status-Complete-emerald.svg)](https://github.com)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js_16_Turbopack-black.svg)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_Python_3.13-009688.svg)](https://fastapi.tiangolo.com)
[![Sentinel-2](https://img.shields.io/badge/Constellation-Copernicus_Sentinel--2-blue.svg)](https://dataspace.copernicus.eu)

---

## 📖 Overview
**GreenSync** is an autonomous verification portal designed to eliminate "greenwashing" in corporate afforestation and ESG carbon-offset programs. By combining raw EXIF camera metadata with the European Space Agency (ESA) Copernicus Sentinel-2 multispectral vegetation index algorithms, GreenSync creates an unforgeable, transparent record of tree plantation and longitudinal survival—with **zero ongoing human touch**.

---

## 🚀 Key Functional Requirements (FRs)

### 🌱 FR-1: Geotagged Sapling Onboarding
- Volunteers capture field photos with device GPS sensors.
- Backend extracts raw EXIF `GPSLatitude`, `GPSLongitude`, and timestamps to verify that the photo was captured live on-site, rejecting downloaded or spoofed images.
- Images are archived on Amazon S3 and plots are registered in the geospatial ledger.

### 🛰️ FR-2: Automated Longitudinal Growth Audit (Zero Human Touch)
- Scheduled backend cron jobs re-verify plantation polygons at **3, 6, and 12-month** milestones.
- Eliminates ongoing operational inspection costs and human inspection fraud.

### 🔬 FR-3: Satellite Vegetation Index Cross-Check (MSAVI2 & NDVI)
- **Early Stage (Months 1–6):** Uses **MSAVI2 (Modified Soil-Adjusted Vegetation Index)** with dynamic inductive L-factor adjustment. Young saplings have high bare-soil exposure, which distorts standard NDVI.
  $$\text{MSAVI2} = \frac{2 \cdot \text{NIR} + 1 - \sqrt{(2 \cdot \text{NIR} + 1)^2 - 8(\text{NIR} - \text{Red})}}{2}$$
- **Late Stage (Month 12+):** Transitions seamlessly to standard **NDVI** once tree canopy closure is achieved.
  $$\text{NDVI} = \frac{\text{NIR} - \text{Red}}{\text{NIR} + \text{Red}}$$
- Compares spectral index deltas against planting baselines to algorithmically certify survival.

### 🛡️ FR-4: Afforestation Verification Badges & Digital Certificates
- Issues verifiable digital credentials certified with **SHA-256 cryptographic hashes**.
- Includes public validator tool where corporate CSR auditors and carbon certification bodies can paste any badge hash to verify authenticity.

### 🗺️ FR-5: Interactive Afforestation Explorer
- Public-facing Leaflet.js geospatial map rendering registered plantation polygons.
- Toggle between Sentinel-2 Satellite imagery (ESRI World Imagery) and Street Map overlays with dynamic vegetative health scores.

### 🌲 FR-6: Carbon Sequestration Estimator
- Built on **IPCC Tier 2 Good Practice Guidance for LULUCF**.
- Factors in species allometric growth rates, below-ground root-to-shoot ratios ($R = 0.24$), and verified audit survival rates.
- Generates 1, 3, 5, 10, and 20-year carbon trajectories and environmental equivalencies (car km avoided, smartphone charges).

---

## 🛠️ Architecture & Tech Stack

- **Frontend:** Next.js (App Router, Turbopack), React 19, Tailwind CSS, Leaflet.js / React-Leaflet, Lucide Icons.
- **Backend:** Python FastAPI, SQLite Database, Boto3, ExifRead, NumPy, Uvicorn.
- **Satellite Data Provider:** European Space Agency (ESA) Copernicus Sentinel-2 Multispectral Instrument (MSI) Level-2A BOA.
- **Cloud Storage:** Amazon S3 (Bucket: `greensync-photos-utsav`).

---

## 🏃 Running the Application Locally

### 1. Start the FastAPI Backend
```bash
cd backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
API docs available at: `http://localhost:8000/docs`

### 2. Start the Next.js Frontend
```bash
cd frontend
npm run dev
```
Web portal available at: `http://localhost:3000`

---

## 🌐 Application Routes

| Route | Feature Description |
|---|---|
| `/` | **Overview**: Project introduction, live telemetry ribbon, scientific explainer. |
| `/explorer` | **FR-5 Afforestation Explorer**: Interactive Leaflet map with satellite layers and plot polygons. |
| `/audits` | **FR-2 Growth Audit Dashboard**: Scheduled 3/6/12M audits, spectral triggers, and immutable logs. |
| `/carbon` | **FR-6 Carbon Estimator**: Interactive IPCC Tier 2 calculator with species sliders and trajectories. |
| `/certificates`| **FR-4 Verification Badges**: Digital certificate gallery, luxury printable credential, and hash validator. |
| `/onboard` | **FR-1 Sapling Onboarding**: Mobile camera registration with anti-spoofing EXIF validation. |

---

## 📂 Documentation Artifacts
- [Planning (PLANNING.md)](docs/PLANNING.md): Target personas, core requirements, and architecture plan.
- [Progress (PROGRESS.md)](docs/PROGRESS.md): Hackathon timeline and development milestones.
- [Deployment (DEPLOYMENT.md)](docs/DEPLOYMENT.md): Guide to running the project locally and in production.
- [Defense QA (DEFENSE_QA.md)](docs/DEFENSE_QA.md): Anti-spoofing validation logic, scientific decisions, and judge Q&A.
