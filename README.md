# GreenSync

**Satellite & Geotagged Tree Plantation Verification System**

## 📖 Overview
GreenSync is a transparent verification portal designed to track genuine afforestation and combat "greenwashing" in corporate and NGO tree plantation initiatives. By combining geotagged, time-stamped mobile sapling photos with the European Space Agency (Sentinel-2) satellite NDVI vegetation indices, we ensure that trees planted today grow into forests tomorrow.

## 🚀 Key Features
- **Geotagged Sapling Onboarding:** Register trees with high-res photos, GPS, species, and timestamp.
- **Automated Longitudinal Growth Audit:** Scheduled backend tasks automatically re-verify at 3, 6, and 12-month intervals without human intervention.
- **Satellite Vegetation Cross-Check:** Open Sentinel-2 imagery API is queried to compute NDVI and MSAVI2 (for early-stage saplings) over the plantation area.
- **Verification Badge:** Immutable digital verification certificate after successful sapling and NDVI audits.
- **Interactive Afforestation Explorer:** Leaflet/Mapbox map displaying verified plots with before/after satellite overlays.
- **Carbon Sequestration Estimator:** Algorithmic model estimating metric tons of CO2 sequestered.

## 🛠 Tech Stack
- **Frontend:** Next.js, Tailwind CSS, Leaflet.js / react-leaflet
- **Backend:** Python FastAPI, Rasterio
- **Database & Storage:** Amazon RDS (PostgreSQL + PostGIS), Amazon S3
- **External API:** Copernicus Data Space Ecosystem / Sentinel Hub API
- **Deployment:** AWS Amplify (Frontend), AWS App Runner (Backend)

## 📂 Documentation Artifacts
As part of the hackathon requirements, the following documentation artifacts are provided:
- [Planning](docs/PLANNING.md): Target personas, core requirements, and architecture plan.
- [Progress](docs/PROGRESS.md): Hackathon timeline and development milestones.
- [Deployment](docs/DEPLOYMENT.md): Guide to running the project locally and in production.
- [Defense QA](docs/DEFENSE_QA.md): Anti-spoofing validation logic, edge cases, and Q&A.

## 🏃 Getting Started (Coming Soon)
We are currently in the planning phase. The Next.js frontend and FastAPI backend instructions will be added here shortly.
