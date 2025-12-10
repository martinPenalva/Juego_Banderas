#!/usr/bin/env python3
"""Convierte OIG1.jpg a iconos PWA y genera base64"""

from PIL import Image
import base64
import io

# Leer la imagen original
img = Image.open('OIG1.jpg')

# Generar iconos en diferentes tamaños
sizes = [192, 512]

print("// Iconos generados desde OIG1.jpg:")
print()

for size in sizes:
    # Redimensionar manteniendo aspecto
    resized = img.resize((size, size), Image.Resampling.LANCZOS)
    
    # Convertir a RGBA si es necesario
    if resized.mode != 'RGBA':
        resized = resized.convert('RGBA')
    
    # Guardar en buffer
    buf = io.BytesIO()
    resized.save(buf, 'PNG')
    
    # Convertir a base64
    b64 = base64.b64encode(buf.getvalue()).decode()
    
    print(f"const ICON_{size}_BASE64 = 'data:image/png;base64,{b64}';")
    print()

# También generar el favicon SVG como data URI
svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><image href="data:image/jpeg;base64,{0}" width="512" height="512"/></svg>'''
with open('OIG1.jpg', 'rb') as f:
    jpg_b64 = base64.b64encode(f.read()).decode()
    svg_with_image = svg_content.format(f'data:image/jpeg;base64,{jpg_b64}')
    svg_b64 = base64.b64encode(svg_with_image.encode()).decode()
    print(f"const SVG_ICON_BASE64 = 'data:image/svg+xml;base64,{svg_b64}';")

