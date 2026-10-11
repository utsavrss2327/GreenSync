import sqlite3
import json
import math
import os
from datetime import datetime, timedelta

DB_PATH = os.path.join(os.path.dirname(__file__), "greensync.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Create saplings table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS saplings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        species TEXT NOT NULL,
        common_name TEXT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        polygon TEXT NOT NULL,
        photo_url TEXT,
        planted_at TEXT NOT NULL,
        age_months INTEGER NOT NULL,
        status TEXT NOT NULL,
        latest_index TEXT DEFAULT 'N/A',
        latest_score REAL DEFAULT 0.0,
        carbon_estimate REAL DEFAULT 0.0,
        created_at TEXT NOT NULL
    );
    """)

    # Create audits table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sapling_id INTEGER NOT NULL,
        audit_milestone INTEGER NOT NULL,
        index_used TEXT NOT NULL,
        nir REAL NOT NULL,
        red REAL NOT NULL,
        score REAL NOT NULL,
        threshold REAL DEFAULT 0.35,
        audit_passed BOOLEAN NOT NULL,
        delta_from_baseline REAL DEFAULT 0.0,
        vegetation_health TEXT NOT NULL,
        notes TEXT,
        audit_date TEXT NOT NULL,
        badge_hash TEXT,
        FOREIGN KEY (sapling_id) REFERENCES saplings(id)
    );
    """)

    conn.commit()

    # Seed with initial realistic plots if empty
    cursor.execute("SELECT COUNT(*) as count FROM saplings")
    count = cursor.fetchone()["count"]
    if count == 0:
        seed_initial_data(cursor)
        conn.commit()

    conn.close()

def calculate_carbon_estimate(species: str, age_months: int) -> float:
    """
    Algorithmic carbon sequestration estimation in metric tons.
    Model: species_annual_rate * (age_months / 12) * survival_biomass_factor
    """
    species_rates = {
        "Eucalyptus": 0.025,  # ~25 kg/tree/year
        "Neem": 0.020,        # ~20 kg/tree/year
        "Bamboo": 0.035,      # High rapid growth ~35 kg/cluster/year
        "Oak": 0.015,         # Slow growing ~15 kg/tree/year
        "Teak": 0.022,        # ~22 kg/tree/year
        "Default": 0.018
    }
    rate = species_rates.get(species, species_rates["Default"])
    years = max(age_months / 12.0, 0.1)
    # Estimated plot size (~50-100 trees per registered polygon plot)
    plot_trees = 60
    return round(rate * years * plot_trees, 2)

def seed_initial_data(cursor):
    now = datetime.now()

    plots = [
        {
            "species": "Eucalyptus",
            "common_name": "Eucalyptus Tereticornis",
            "lat": 28.7041,
            "lng": 77.1025,
            "planted_at": (now - timedelta(days=370)).isoformat(),
            "age_months": 12,
            "status": "Verified",
            "latest_index": "NDVI",
            "latest_score": 0.74,
            "photo_url": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
            "audit_milestone": 12,
            "nir": 0.78,
            "red": 0.12,
            "score": 0.74,
            "passed": True,
            "index_used": "NDVI",
            "health": "Thriving Canopy"
        },
        {
            "species": "Neem",
            "common_name": "Azadirachta Indica",
            "lat": 28.7055,
            "lng": 77.1042,
            "planted_at": (now - timedelta(days=185)).isoformat(),
            "age_months": 6,
            "status": "Verified",
            "latest_index": "MSAVI2",
            "latest_score": 0.58,
            "photo_url": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80",
            "audit_milestone": 6,
            "nir": 0.62,
            "red": 0.22,
            "score": 0.58,
            "passed": True,
            "index_used": "MSAVI2",
            "health": "Vigorous Vegetative Growth"
        },
        {
            "species": "Bamboo",
            "common_name": "Bambusa Tulda",
            "lat": 28.7070,
            "lng": 77.1010,
            "planted_at": (now - timedelta(days=92)).isoformat(),
            "age_months": 3,
            "status": "Pending 3-month audit",
            "latest_index": "N/A",
            "latest_score": 0.0,
            "photo_url": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80",
            "audit_milestone": None
        },
        {
            "species": "Oak",
            "common_name": "Quercus Leucotrichophora",
            "lat": 28.7025,
            "lng": 77.1060,
            "planted_at": (now - timedelta(days=75)).isoformat(),
            "age_months": 2,
            "status": "Pending 3-month audit",
            "latest_index": "N/A",
            "latest_score": 0.0,
            "photo_url": "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80",
            "audit_milestone": None
        },
        {
            "species": "Teak",
            "common_name": "Tectona Grandis",
            "lat": 28.7082,
            "lng": 77.1075,
            "planted_at": (now - timedelta(days=190)).isoformat(),
            "age_months": 6,
            "status": "Verified",
            "latest_index": "MSAVI2",
            "latest_score": 0.52,
            "photo_url": "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=80",
            "audit_milestone": 6,
            "nir": 0.59,
            "red": 0.25,
            "score": 0.52,
            "passed": True,
            "index_used": "MSAVI2",
            "health": "Healthy Soil-Adjusted Growth"
        }
    ]

    for p in plots:
        lat, lng = p["lat"], p["lng"]
        polygon = [
            [lat - 0.0003, lng - 0.0004],
            [lat + 0.0003, lng - 0.0004],
            [lat + 0.0003, lng + 0.0004],
            [lat - 0.0003, lng + 0.0004]
        ]
        carbon = calculate_carbon_estimate(p["species"], p["age_months"])

        cursor.execute("""
        INSERT INTO saplings (
            species, common_name, latitude, longitude, polygon, 
            photo_url, planted_at, age_months, status, 
            latest_index, latest_score, carbon_estimate, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            p["species"], p["common_name"], lat, lng, json.dumps(polygon),
            p["photo_url"], p["planted_at"], p["age_months"], p["status"],
            p["latest_index"], p["latest_score"], carbon, now.isoformat()
        ))

        sapling_id = cursor.lastrowid

        if p.get("audit_milestone"):
            cursor.execute("""
            INSERT INTO audits (
                sapling_id, audit_milestone, index_used, nir, red,
                score, threshold, audit_passed, delta_from_baseline,
                vegetation_health, notes, audit_date, badge_hash
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                sapling_id, p["audit_milestone"], p["index_used"],
                p["nir"], p["red"], p["score"], 0.35, p["passed"],
                round(p["score"] - 0.15, 3), p["health"],
                f"Automated verification passed at {p['audit_milestone']} month milestone using Sentinel-2 {p['index_used']}.",
                (now - timedelta(days=5)).isoformat(),
                f"GS-CERT-{sapling_id}-{int(now.timestamp())}"
            ))

init_db()
