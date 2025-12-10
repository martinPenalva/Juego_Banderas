#!/usr/bin/env python3
"""Genera iconos en base64 para incrustar en HTML"""

from PIL import Image, ImageDraw
import base64
import io

def create_icon_base64(size):
    """Crea un icono y lo devuelve como base64"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Gradiente de fondo
    for y in range(size):
        ratio = y / size
        r = int(102 + (118 - 102) * ratio)
        g = int(126 + (75 - 126) * ratio)
        b = int(234 + (162 - 234) * ratio)
        draw.rectangle([(0, y), (size, y+1)], fill=(r, g, b, 255))
    
    # Máscara de bordes redondeados
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    radius = int(size * 0.2)
    mask_draw.rounded_rectangle([(0, 0), (size, size)], radius=radius, fill=255)
    
    # Aplicar máscara
    output = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    output.paste(img, (0, 0), mask)
    draw = ImageDraw.Draw(output)
    
    # Bandera
    center_x = size // 2
    center_y = size // 2
    flag_width = int(size * 0.6)
    flag_height = int(size * 0.4)
    pole_width = int(size * 0.08)
    
    # Asta
    pole_x = center_x - flag_width // 2 - pole_width
    draw.rectangle(
        [(pole_x, center_y - flag_height // 2),
         (pole_x + pole_width, center_y + flag_height // 2)],
        fill=(139, 115, 85, 255)
    )
    
    # Franjas
    flag_x = center_x - flag_width // 2
    flag_y = center_y - flag_height // 2
    stripe_height = flag_height // 3
    
    draw.rectangle([(flag_x, flag_y), (flag_x + flag_width, flag_y + stripe_height)], fill=(220, 20, 60, 255))
    draw.rectangle([(flag_x, flag_y + stripe_height), (flag_x + flag_width, flag_y + stripe_height * 2)], fill=(255, 255, 255, 255))
    draw.rectangle([(flag_x, flag_y + stripe_height * 2), (flag_x + flag_width, flag_y + flag_height)], fill=(30, 144, 255, 255))
    
    # Borde
    draw.rectangle([(flag_x, flag_y), (flag_x + flag_width, flag_y + flag_height)], outline=(0, 0, 0, 51), width=2)
    
    # Aplicar máscara final
    final = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    final.paste(output, (0, 0), mask)
    
    # Convertir a base64
    buf = io.BytesIO()
    final.save(buf, 'PNG')
    return base64.b64encode(buf.getvalue()).decode()

# Generar iconos
icon_192 = create_icon_base64(192)
icon_512 = create_icon_base64(512)

# SVG del favicon
svg_icon = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#667eea;stop-opacity:1" /><stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" /></defs><rect width="512" height="512" fill="url(#bg)" rx="100"/><text x="256" y="320" font-size="280" text-anchor="middle" fill="white" font-family="Arial">🏳️</text></svg>'''
svg_base64 = base64.b64encode(svg_icon.encode()).decode()

print(f"// Iconos generados:")
print(f"const ICON_192_BASE64 = 'data:image/png;base64,{icon_192}';")
print(f"const ICON_512_BASE64 = 'data:image/png;base64,{icon_512}';")
print(f"const SVG_ICON_BASE64 = 'data:image/svg+xml;base64,{svg_base64}';")

