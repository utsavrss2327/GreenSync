# GreenSync — Official Hackathon Submission

---

## 1. Short Writeup (Form Submission Content)

### Project Title
**GreenSync — Satellite & Geotagged Tree Plantation Autonomous Verification System**

### Tagline / One-liner
An autonomous verification portal solving corporate afforestation "greenwashing" by pairing geotagged mobile photos with Copernicus Sentinel-2 satellite spectral indices (MSAVI2 & NDVI)—with zero ongoing human touch.

---

### The Problem
Corporate ESG programs and non-profits pour billions of dollars into tree plantation campaigns. However, up to **80% of planted saplings die within the first year** due to neglect, drought, or grazing. Because field audits require expensive, corruptible physical inspections, companies either never re-verify their plots or fall victim to greenwashing—planting for a photo-op and abandoning the land. Furthermore, fraudsters frequently upload downloaded internet photos or re-photograph old trees to claim carbon credits.

### The Build
GreenSync eliminates greenwashing by connecting ground truth with space-based Earth observation:
1. **Anti-Spoofing Ground Truth (FR-1):** Volunteers register newly planted saplings using a mobile capture interface. The backend extracts raw camera EXIF metadata (`DateTimeOriginal` and `GPSLatitude/Longitude`), matching it against browser sensor telemetry within 10 km to reject spoofed web downloads.
2. **Interactive Afforestation Explorer (FR-5):** A geospatial Leaflet explorer maps registered polygons against Copernicus Sentinel-2 satellite imagery, plotting vegetative vitality scores and carbon tonnage.
3. **Automated Longitudinal Growth Audit Engine (FR-2 & FR-3):** A backend scheduled cron audit automatically re-inspects polygons at **3, 6, and 12-month** milestones. 
   - *Scientific Innovation:* Young saplings (Months 1–6) expose high bare soil that skews traditional NDVI. GreenSync algorithmically applies **MSAVI2 (Modified Soil-Adjusted Vegetation Index)** with dynamic inductive L-factor adjustments, switching to standard **NDVI** at 12 months upon canopy closure.
4. **Carbon Sequestration Estimator (FR-6):** Built on **IPCC Tier 2 Good Practice Guidance for LULUCF**, modeling species allometric curves (Bamboo, Eucalyptus, Teak, Neem, Oak), below-ground root ratios ($R = 0.24$), and verified audit survival rates to project multi-year carbon offsets.
5. **Verifiable Digital Badges (FR-4):** Dual-verified plots receive immutable certificates signed with **SHA-256 cryptographic hashes**, verifiable via our public auditor portal.

### Where AWS Fits
AWS powers the foundational data lifecycle and cloud infrastructure of GreenSync:
- **Amazon S3 (`greensync-photos-utsav`):** Stores and serves high-resolution geotagged sapling photos with encrypted object storage, maintaining an immutable visual audit trail.
- **Amazon RDS (PostgreSQL with PostGIS):** Manages relational geospatial schemas, storing plantation bounding box polygons, spatial geometries, and time-stamped audit records.
- **AWS App Runner / Elastic Beanstalk:** Hosts the containerized Python FastAPI backend, handling automated cron audits and satellite band queries.
- **AWS Amplify:** Deploys and distributes the Next.js frontend with global edge CDN caching.

---

## 2. Demo Video Script (Under 3 Minutes: ~2 min 40 sec)

> **Important Video Rules:**
> - Upload as **Public** or **Unlisted** on YouTube.
> - Verify the link opens in an incognito/signed-out window before submitting.
> - **Judges only grade what is visually shown on screen.** Follow the visual cues below closely.

| Timestamp | Visual / Screen Action | Spoken Script (Voiceover) |
|---|---|---|
| **0:00 – 0:20** | **Show Landing Page (`http://localhost:3000`)**<br>Scroll down slowly past the headline, live metrics ribbon (300 Trees, 3.44 tons CO₂), and navigation cards. | *"Every year, billions are spent on corporate tree plantation drives. But up to 80% of those saplings die within months, hidden behind greenwashing and zero follow-up. Welcome to GreenSync—the autonomous verification portal that combines mobile geotagged field data with European Space Agency Sentinel-2 satellite imagery to prove trees planted today actually become forests tomorrow—with zero human touch."* |
| **0:20 – 0:50** | **Click "Register Sapling" (`/onboard`)**<br>1. Click *"Auto-Fill Sample"* (Bamboo, Delhi coordinates).<br>2. Highlight the *"Simulate Live Mobile Camera EXIF"* anti-spoofing toggle.<br>3. Click *"Register & Initialize Baseline"*.<br>4. Show the verified confirmation card with plot ID and coordinates. | *"It starts on the ground. A field volunteer registers a new sapling. To prevent fraud, our FastAPI backend parses the raw binary EXIF headers directly from the camera photo, matching embedded GPS coordinates against device hardware sensors. Downloaded web photos or spoofed locations are blocked instantly. Once verified, the high-res photo archives to Amazon S3, and a 50-meter monitoring polygon is registered in our database."* |
| **0:50 – 1:15** | **Click "Afforestation Explorer" (`/explorer`)**<br>1. Zoom in on the Leaflet map.<br>2. Toggle the layer control from Street Map to **Sentinel-2 / Satellite (ESRI)**.<br>3. Click on a plot polygon (e.g., Plot #1 Eucalyptus or Plot #2 Neem) to reveal the rich popup with photo thumbnail, MSAVI2 score, and carbon stock. | *"Next, our public Afforestation Explorer renders all registered plots in real time. We can toggle between base maps and Sentinel-2 satellite imagery overlays. Clicking any polygon reveals its photo proof, age, current vegetative health score, and live carbon sequestration tonnage."* |
| **1:15 – 1:55** | **Click "Growth Audit Dashboard" (`/audits`)**<br>1. Scroll past the 3/6/12M milestone counters.<br>2. Highlight the scientific explainer banner (*Why MSAVI2 vs NDVI*).<br>3. Find a pending plot (e.g. Bamboo or Oak) and click **"Run 3M Audit"**.<br>4. Show the Satellite Re-Verification Receipt modal with raw bands (NIR: 0.63, Red: 0.21), the MSAVI2 score, and the SHA-256 hash. | *"Now the core innovation: the Longitudinal Growth Audit Dashboard. Traditional audits require expensive physical inspections. GreenSync automates this entirely using backend satellite queries at 3, 6, and 12 months.<br><br>Notice our scientific edge: young saplings expose heavy bare soil, which breaks standard NDVI. GreenSync algorithmically uses MSAVI2 with dynamic soil adjustment for months 1 through 6, then automatically transitions to NDVI once canopy closure occurs at month 12.<br><br>Let's run an audit live: with one click, our engine queries the Copernicus Sentinel-2 multispectral bands, calculates the index, verifies the threshold, updates the carbon stock, and issues an immutable cryptographic hash."* |
| **1:55 – 2:20** | **Click "Carbon" (`/carbon`)**<br>1. Select "Bamboo", then "Teak".<br>2. Move the **Tree Count** slider to 500 and **Plantation Age** to 24 Months.<br>3. Move the **Satellite Verified Survival Rate** slider.<br>4. Point to the dynamic tCO₂e counter and the real-world equivalencies (car km avoided, phone charges, flight hours). | *"For corporate sponsors and carbon certification bodies, GreenSync features an IPCC Tier 2 Carbon Sequestration Estimator. By adjusting tree species, plantation age, and verified satellite survival rates, auditors can model exact biomass accumulation—factoring in above-ground wood and below-ground root ratios—with multi-year trajectories and real-world equivalencies."* |
| **2:20 – 2:40** | **Click "Badges" (`/certificates`)**<br>1. Show the luxury certificate card with the ESA Copernicus Sentinel-2 seal and QR code.<br>2. Copy the SHA-256 hash.<br>3. Paste it into the **Public Credential Verifier** search bar at the top and click *"Validate Hash"* to demonstrate real-time verification. | *"Finally, verified plots receive an immutable digital certificate. Complete with a SHA-256 cryptographic signature, QR code, and audit trail, CSR auditors can paste any certificate hash into our Public Credential Verifier to independently validate compliance for carbon credit issuance."* |
| **2:40 – 2:55** | **Return to Overview (`/`) or show full architecture diagram**<br>Deliver closing takeaway. | *"Powered by Amazon S3 for photo archives, AWS for scalable backend computing, and Sentinel-2 for autonomous space observation, GreenSync turns greenwashing into verifiable climate action. Thank you!"* |
