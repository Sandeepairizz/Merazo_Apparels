import os
import numpy as np
from PIL import Image

def remove_white_bg(img_path, out_path, tol=12):
    img = Image.open(img_path).convert("RGBA")
    data = np.array(img, dtype=np.float32)
    
    # White background mask
    # Background is near (255, 255, 255)
    r, g, b = data[:, :, 0], data[:, :, 1], data[:, :, 2]
    
    # Distance to pure white
    dist = np.sqrt((255 - r)**2 + (255 - g)**2 + (255 - b)**2)
    
    # Alpha ramp
    alpha = np.clip((dist - tol) / (35.0 - tol) * 255.0, 0, 255)
    
    # Protect body interior using flood fill from outer borders
    from scipy.ndimage import binary_dilation
    
    # Outer white region
    is_outer_white = dist < 25
    # Mask out edges
    data[:, :, 3] = alpha
    
    out = Image.fromarray(np.uint8(data), mode="RGBA")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    out.save(out_path, "WEBP", quality=90)
    print(f"Saved: {out_path}")

print("Script template ready")

