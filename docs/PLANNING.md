# Planning: GreenSync - Satellite & Geotagged Tree Plantation Verification System

## 1. Project Overview
GreenSync is an advanced verification portal designed to solve the "greenwashing" problem in corporate afforestation programs. By combining geotagged, time-stamped mobile sapling photos with European Space Agency (Sentinel-2) satellite NDVI vegetation indices, the system guarantees a transparent and verifiable record of tree plantation.

## 2. Target Personas
- **Environmental NGOs:** To track plantation progress and survival rates.
- **Corporate CSR Auditors:** To verify the impact of funds invested in afforestation.
- **Carbon Credit Certification Bodies:** To accurately certify and issue carbon credits based on verified data.

## 3. Core Functional Requirements (FRs)

### FR-1: Geotagged Sapling Onboarding
- **Description:** Volunteers upload a high-resolution photo of the newly planted sapling along with species name.
- **Implementation:** Mobile-friendly Next.js form that captures device GPS coordinates and timestamp upon photo capture.

### FR-2: Automated Longitudinal Growth Audit (Zero Human Touch)
- **Description:** Fully automated re-verification at 3, 6, and 12-month intervals.
- **Implementation:** Instead of volunteers returning to the field, a backend Cron Job automatically triggers at these intervals. It initiates the satellite cross-check (FR-3) for the plantation polygon, eliminating ongoing operational costs and human error.

### FR-3: Satellite Vegetation Index Cross-Check (NDVI & MSAVI2)
- **Description:** Compute vegetation indices over the plantation polygon to algorithmically verify survival.
- **Implementation:** Backend Python FastAPI queries the Copernicus Data Space Ecosystem (or Sentinel Hub API).
  - Uses **MSAVI2 (Modified Soil-Adjusted Vegetation Index)** for early-stage (3-6 months) verification because young saplings have high soil exposure, which confuses standard NDVI.
  - Formula (MSAVI2): `(2 * NIR + 1 - sqrt((2 * NIR + 1)^2 - 8 * (NIR - Red))) / 2`
  - Uses standard **NDVI** for late-stage (12+ months) when canopy covers the soil.
  - Compares index deltas (current vs. planting baseline) and factors in local seasonality to automatically issue a "Pass/Fail" for the audit.

### FR-4: Afforestation Verification Badge
- **Description:** Issues an immutable digital certificate.
- **Implementation:** Generated dynamically (PDF/image or blockchain-style hash) when both conditions are met: (1) Sapling audit photos are verified and (2) Satellite NDVI shows a positive trend.

### FR-5: Interactive Afforestation Explorer
- **Description:** Public-facing map.
- **Implementation:** Uses Next.js + Leaflet.js / React-Leaflet to render plantation plots (polygons). Includes toggleable before-and-after satellite overlays.

### FR-6: Carbon Sequestration Estimator
- **Description:** Estimates CO2 sequestered.
- **Implementation:** Mathematical model on the backend factoring in: Tree Species, Age (current date - planting date), and generic biomass expansion factors.

## 4. Non-Functional Requirements
- **Anti-spoofing validation:** The backend extracts EXIF data from the uploaded images using a Python library (e.g., `exifread` or `Pillow`) and cross-references the GPS/Timestamp with the form submission data.
- **Interactive Geospatial Rendering:** Fast, smooth polygon rendering using GeoJSON format.

## 5. Technology Stack & Free Resources
- **Frontend:** Next.js (React), TailwindCSS, Leaflet.js (via react-leaflet), Turf.js (for polygon operations).
- **Backend:** Python FastAPI, Rasterio (for geospatial data manipulation).
- **Database:** Amazon RDS (PostgreSQL with PostGIS extension) to store geospatial polygons and sapling records securely.
- **Photo Storage:** Amazon S3 to store uploaded sapling images.
- **Satellite Data Provider:** Copernicus Data Space Ecosystem API (Free) or Sentinel Hub (Free trial/Developer tier) for fetching NDVI data.
- **Hosting:** AWS Amplify (Frontend) and AWS App Runner or EC2 (Backend).

## 6. Development Phases

**Phase 1: Foundation (Hours 1-6)**
- Initialize Next.js and FastAPI projects.
- Setup Amazon RDS (PostgreSQL) schema for Saplings, Polygons, and Audits, and configure Amazon S3 for image uploads.
- Implement FR-1: Sapling onboarding form with EXIF extraction on the backend.

**Phase 2: Geospatial & UI (Hours 7-14)**
- Implement FR-5: Public Map Explorer using Leaflet to display registered saplings/polygons.
- Build UI for FR-2: Dashboard for the 3/6/12 month growth audits.

**Phase 3: Satellite Integration (Hours 15-24)**
- Implement FR-3: Integrate Sentinel-2 API in FastAPI. Fetch NDVI values based on polygon coordinates and time ranges.
- Implement FR-6: Build the Carbon Sequestration logic.

**Phase 4: Certification & Polish (Hours 25-32)**
- Implement FR-4: Generate Verification Badge.
- Final testing, UI/UX polish (ensure glassmorphism/modern styling), and documentation generation (README, PROGRESS, DEPLOYMENT, DEFENSE_QA).
