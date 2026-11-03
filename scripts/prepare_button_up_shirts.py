import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

import numpy as np
from PIL import Image, ImageOps

ARTIFACT_DIR = r"C:\Users\Sandeep Kumar\.gemini\antigravity\brain\0113612f-5cb3-4af9-9506-adc9e65bdcf0"
TRYON_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "images", "tryon")

WOMEN_BASE = os.path.join(TRYON_DIR, "women", "model-oxford.webp")
MEN_BASE = os.path.join(TRYON_DIR, "men", "model-oxford.webp")

# Real product campaign sources
SOURCES = {
    "oxford":   os.path.join(ARTIFACT_DIR, "men_01_1793678926524.jpg"),    # Ivory Oxford
    "poplin":   os.path.join(ARTIFACT_DIR, "men_03_1793679039136.jpg"),    # Black Poplin
    "linen":    os.path.join(ARTIFACT_DIR, "men_02_1793678944745.jpg"),    # Sage/Sand Linen
    "twill":    os.path.join(ARTIFACT_DIR, "men_04_1793679058782.jpg"),    # Twill
    "satin":    os.path.join(ARTIFACT_DIR, "women_01_1793678963448.jpg"),  # Satin
    "chambray": os.path.join(ARTIFACT_DIR, "women_03_1793679079252.jpg"),  # Sky Chambray
}

SHIRTS_INFO = [
    {"id": "oxford",   "tint": None,            "color": "ivory"},
    {"id": "poplin",   "tint": None,            "color": "black"},
    {"id": "linen",    "tint": (100, 115, 95),  "color": "sage"},
    {"id": "twill",    "tint": (25, 38, 55),    "color": "navy"},
    {"id": "satin",    "tint": (75, 25, 35),    "color": "burgundy"},
    {"id": "chambray", "tint": None,            "color": "sky"},
]

def make_clean_shirt_card(src_path, out_card_path, tint=None):
    img = Image.open(src_path).convert("RGB")
    w, h = img.size
    # Crop shirt torso & collar: top 20% to 75%, center 60%
    crop_box = (int(w * 0.22), int(h * 0.25), int(w * 0.78), int(h * 0.75))
    cropped = img.crop(crop_box)
    
    # Isolate shirt from background
    arr = np.array(cropped, dtype=np.float32)
    # Background in product photos is dark charcoal or neutral studio
    # Shirt is the hero object in center
    # Create mask: center region with smooth edges
    cw, ch = cropped.size
    mask = Image.new("L", (cw, ch), 0)
    
    # Elliptical / rounded torso mask
    from PIL import ImageDraw
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([15, 10, cw - 15, ch - 10], radius=40, fill=255)
    
    from PIL import ImageFilter
    mask = mask.filter(ImageFilter.GaussianBlur(radius=8))
    
    rgba = cropped.convert("RGBA")
    rgba.putalpha(mask)
    
    if tint:
        # Subtle tint overlay
        r, g, b, a = rgba.split()
        tint_layer = Image.new("RGBA", rgba.size, (tint[0], tint[1], tint[2], 120))
        rgba = Image.alpha_composite(rgba, tint_layer)
        rgba.putalpha(a)
        
    card = Image.new("RGBA", (800, 800), (0, 0, 0, 0))
    rgba.thumbnail((640, 640), Image.Resampling.LANCZOS)
    ox = (800 - rgba.width) // 2
    oy = (800 - rgba.height) // 2
    card.paste(rgba, (ox, oy), rgba)
    
    os.makedirs(os.path.dirname(out_card_path), exist_ok=True)
    card.save(out_card_path, "WEBP", quality=90)
    print(f"  ✓ Saved shirt card: {out_card_path}")
    return card

def generate_all_cards():
    print("=== PRODUCING REAL SHIRT CUTOUT CARDS ===")
    for s in SHIRTS_INFO:
        sid = s["id"]
        src = SOURCES[sid]
        for gender in ["women", "men"]:
            out_path = os.path.join(TRYON_DIR, gender, f"shirt-{sid}.webp")
            make_clean_shirt_card(src, out_path, s["tint"])

generate_all_cards()
print("\n[SUCCESS] All transparent shirt cutout cards produced!")

