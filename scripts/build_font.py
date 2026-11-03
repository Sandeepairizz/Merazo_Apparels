import os
from fontTools import subset

font_path = "Anybody-var.ttf"
out_dir = os.path.join("public", "fonts")
os.makedirs(out_dir, exist_ok=True)
woff2_path = os.path.join(out_dir, "anybody-var.woff2")

options = subset.Options()
options.flavor = "woff2"
options.layout_features = ["*"]

font = subset.load_font(font_path, options)
subsetter = subset.Subsetter(options=options)
text_to_keep = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?:;\"'‘’“”/\\-_+=#%*@()[]{}|~`®—–→·£$€ "
subsetter.populate(text=text_to_keep)
subsetter.subset(font)

font.flavor = "woff2"
subset.save_font(font, woff2_path, options)

size_kb = os.path.getsize(woff2_path) / 1024
print(f"Successfully generated {woff2_path} ({size_kb:.1f} KB)")

