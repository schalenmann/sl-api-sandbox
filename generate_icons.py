#!/usr/bin/env python3
"""
Generate PWA icons for SL Departure App
Creates simple icons with SL blue background and train emoji
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False

import os

def create_simple_icon(size, filename):
    """Create a simple icon using basic shapes if PIL is not available"""
    # For now, create a simple SVG that can be converted later
    svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg width="{size}" height="{size}" viewBox="0 0 {size} {size}" xmlns="http://www.w3.org/2000/svg">
    <!-- SL Blue background -->
    <rect width="{size}" height="{size}" fill="#0078bf" rx="{size//8}"/>
    
    <!-- White circle background for emoji -->
    <circle cx="{size//2}" cy="{size//2}" r="{size//3}" fill="white" opacity="0.9"/>
    
    <!-- Train text (simplified) -->
    <text x="{size//2}" y="{size//2 + size//12}" 
          font-family="Arial, sans-serif" 
          font-size="{size//3}" 
          fill="#0078bf" 
          text-anchor="middle"
          dominant-baseline="middle">🚇</text>
    
    <!-- SL text at bottom -->
    <text x="{size//2}" y="{size - size//8}" 
          font-family="Arial, sans-serif" 
          font-size="{size//8}" 
          font-weight="bold"
          fill="white" 
          text-anchor="middle"
          dominant-baseline="middle">SL</text>
</svg>'''
    
    with open(f'icons/{filename}.svg', 'w') as f:
        f.write(svg_content)
    
    print(f"📱 Created SVG icon: icons/{filename}.svg ({size}x{size})")

def create_pil_icon(size, filename):
    """Create icon using PIL if available"""
    # Create image with SL blue background
    img = Image.new('RGBA', (size, size), '#0078bf')
    draw = ImageDraw.Draw(img)
    
    # Add rounded corners
    corner_radius = size // 8
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([(0, 0), (size, size)], corner_radius, fill=255)
    
    # Apply mask for rounded corners
    output = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    output.paste(img, (0, 0))
    output.putalpha(mask)
    
    # Add white circle background
    circle_radius = size // 3
    circle_center = (size // 2, size // 2)
    draw = ImageDraw.Draw(output)
    draw.ellipse([
        (circle_center[0] - circle_radius, circle_center[1] - circle_radius),
        (circle_center[0] + circle_radius, circle_center[1] + circle_radius)
    ], fill=(255, 255, 255, 230))
    
    # Try to add text
    try:
        font_size = size // 4
        font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", font_size)
    except:
        try:
            font = ImageFont.load_default()
        except:
            font = None
    
    if font:
        # Add "SL" text
        text = "SL"
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        text_x = (size - text_width) // 2
        text_y = circle_center[1] - text_height // 2
        
        draw.text((text_x, text_y), text, fill='#0078bf', font=font)
    
    # Save PNG
    output.save(f'icons/{filename}')
    print(f"📱 Created icon: icons/{filename} ({size}x{size})")

def main():
    """Generate all required PWA icons"""
    print("🎨 Generating PWA icons for SL Departure App...")
    
    # Icon sizes required for PWA
    sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512]
    
    os.makedirs('icons', exist_ok=True)
    
    for size in sizes:
        filename = f"icon-{size}x{size}.png"
        
        if PIL_AVAILABLE:
            create_pil_icon(size, filename)
        else:
            # Create SVG version if PIL not available
            create_simple_icon(size, f"icon-{size}x{size}")
    
    if not PIL_AVAILABLE:
        print("\n💡 Note: PIL (Pillow) not available, created SVG icons instead.")
        print("   To convert to PNG, install Pillow: pip install Pillow")
        print("   Or use online SVG to PNG converters")
    
    print(f"\n✅ Generated {len(sizes)} icon sizes")
    print("📱 Your PWA is now ready for installation on mobile devices!")

if __name__ == "__main__":
    main()
