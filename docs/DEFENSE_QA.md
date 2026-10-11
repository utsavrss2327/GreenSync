# Defense Q&A: GreenSync Technical Justifications

This document prepares the team for technical questions and architectural scrutiny from hackathon judges, technical evaluators, and carbon credit auditors.

---

## 1. How do you prevent "spoofing" (e.g., uploading an old photo or an internet image)?
We implemented a strict multi-layered anti-spoofing pipeline:
1. **Raw EXIF Binary Extraction:** The backend uses `exifread` to inspect raw binary metadata headers before any image processing:
   - `GPS GPSLatitude` & `GPS GPSLatitudeRef`
   - `GPS GPSLongitude` & `GPS GPSLongitudeRef`
   - `EXIF DateTimeOriginal`
2. **Hardware Geolocation Cross-Validation:** The backend computes the geometric distance between the photo's embedded EXIF coordinates and the device's hardware browser coordinates. If the deviation exceeds the threshold (~0.1° / 10km) or if the photo is stripped of GPS tags (typical of downloaded web images), the submission is blocked with an `Anti-Spoofing Blocked` error.
3. **Demo Resilience:** For presentation or evaluation on desktop computers lacking hardware GPS, a dedicated "Simulate Live Mobile Camera EXIF" flag can be toggled without bypassing the core architecture.

---

## 2. Why use MSAVI2 for early audits instead of standard NDVI?
This is our primary scientific innovation:
- **The Soil Distortion Problem:** During months 1–6, saplings have small foliage areas, leaving large amounts of bare soil exposed. Bare earth has high red reflectance and low near-infrared reflectance, which severely drags down standard NDVI $(NIR - Red) / (NIR + Red)$, producing false negative survival results.
- **The MSAVI2 Solution:** **Modified Soil-Adjusted Vegetation Index (MSAVI2)** replaces the static soil line parameter $L$ with an inductive calculation:
  $$\text{MSAVI2} = \frac{2 \cdot \text{NIR} + 1 - \sqrt{(2 \cdot \text{NIR} + 1)^2 - 8(\text{NIR} - \text{Red})}}{2}$$
- **Automatic Transition:** GreenSync uses MSAVI2 for the 3 and 6-month audits, automatically transitioning to standard NDVI at 12 months once tree canopy closure masks the soil background.

---

## 3. Isn't Sentinel-2's 10m spatial resolution too coarse for individual saplings?
Sentinel-2 has a 10m spatial resolution on Bands 2, 3, 4, and 8.
- **Plot-Level Polygons:** Corporate afforestation programs plant in contiguous clusters or polygons (e.g. 50m × 50m plots containing 50–100 trees), not isolated single trees in isolation.
- **Spectral Aggregation:** At 10m resolution, a 50m × 50m polygon encompasses 25 discrete Sentinel-2 pixels. An established plantation causes a statistically significant increase in near-infrared surface reflectance (Band 8: 842nm) compared to bare earth baseline imagery.
- **Cost & Scale:** Commercial 30cm satellites (e.g., WorldView) charge prohibitive per-sq-km fees. Sentinel-2 is completely free through Copernicus, provides global coverage, and has a 5-day revisit time, making autonomous recurring audits cost-free.

---

## 4. How do you handle cloud cover during satellite passes?
Optical sensors cannot penetrate cloud cover. We mitigate this through:
1. **Scene Cloud Masking:** Sentinel-2 Level-2A products include a Scene Classification Map (SCL) and cloud probability band. Our API filters out acquisitions with cloud cover $>20\%$.
2. **Temporal Windowing:** Sentinel-2 has a 5-day revisit time with both Sentinel-2A and 2B constellations. Over a 30-day milestone window around an audit date, the satellite makes approximately 6 passes over the target coordinates. The algorithm automatically queries the cloud-free composite closest to the milestone date.

---

## 5. How is Carbon Sequestration mathematically calculated?
GreenSync follows the **IPCC Tier 2 Good Practice Guidance for LULUCF**:
1. **Above-Ground Biomass (AGB):** Calculated using species-specific annual dry matter accumulation rates $G$ (e.g. Bamboo: 38 kg/yr, Eucalyptus: 28 kg/yr, Teak: 24 kg/yr, Neem: 21 kg/yr) multiplied by plantation age and agro-ecological regional factors.
2. **Below-Ground Biomass (BGB):** Factored in using standard root-to-shoot expansion ratios ($R = 0.24$), representing root carbon.
   $$\text{Total Biomass} = \text{AGB} \cdot (1 + R)$$
3. **Carbon & $\text{CO}_2$ Conversion:**
   $$\text{Carbon (kg)} = \text{Total Biomass} \cdot 0.47$$
   $$\text{CO}_2\text{e (t)} = \frac{\text{Carbon (kg)} \cdot (44 / 12) \cdot \text{Surviving Trees}}{1000}$$
4. **Audit Gating:** Only trees verified by the longitudinal satellite audit pass rate contribute to the official carbon credit tally.

---

## 6. How does the Verification Badge prevent greenwashing fraud?
- **Dual Data Harmonization:** Badges are issued only when ground truth (time-stamped on-site photo) and satellite truth (positive vegetative index delta) agree.
- **Cryptographic Immutability:** Each certificate generates a SHA-256 hash incorporating plot coordinates, milestone date, species, and raw sensor readings:
  $$\text{Hash} = \text{SHA256}(\text{"GREENSYNC-CERT-"} + \text{PlotID} + \text{Milestone} + \text{Score} + \text{Timestamp})$$
- **Public Auditability:** Corporate sponsors and certification bodies can verify any hash on the public `/certificates` verifier without trusting internal databases.
