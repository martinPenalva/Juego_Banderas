#!/usr/bin/env python3
"""
Script para generar iconos PNG para PWA
Requiere: pip install Pillow
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    import os
except ImportError:
    print("Instalando Pillow...")
    os.system("pip install Pillow")
    from PIL import Image, ImageDraw, ImageFont
    import os

def create_icon(size):
    """Crea un icono PNG del tamaño especificado"""
    # Crear imagen con fondo transparente
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Crear gradiente de fondo (simulado con rectángulos)
    # Color inicial: #667eea (102, 126, 234)
    # Color final: #764ba2 (118, 75, 162)
    for y in range(size):
        # Calcular color interpolado
        ratio = y / size
        r = int(102 + (118 - 102) * ratio)
        g = int(126 + (75 - 126) * ratio)
        b = int(234 + (162 - 234) * ratio)
        draw.rectangle([(0, y), (size, y+1)], fill=(r, g, b, 255))
    
    # Dibujar bordes redondeados (máscara)
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    radius = int(size * 0.2)
    mask_draw.rounded_rectangle([(0, 0), (size, size)], radius=radius, fill=255)
    
    # Aplicar máscara
    output = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    output.paste(img, (0, 0), mask)
    
    # Dibujar bandera
    center_x = size // 2
    center_y = size // 2
    flag_width = int(size * 0.6)
    flag_height = int(size * 0.4)
    pole_width = int(size * 0.08)
    
    # Asta de la bandera (marrón)
    pole_x = center_x - flag_width // 2 - pole_width
    draw.rectangle(
        [(pole_x, center_y - flag_height // 2),
         (pole_x + pole_width, center_y + flag_height // 2)],
        fill=(139, 115, 85, 255)  # #8B7355
    )
    
    # Bandera con franjas
    flag_x = center_x - flag_width // 2
    flag_y = center_y - flag_height // 2
    stripe_height = flag_height // 3
    
    # Franja superior (roja)
    draw.rectangle(
        [(flag_x, flag_y),
         (flag_x + flag_width, flag_y + stripe_height)],
        fill=(220, 20, 60, 255)  # #DC143C
    )
    
    # Franja media (blanca)
    draw.rectangle(
        [(flag_x, flag_y + stripe_height),
         (flag_x + flag_width, flag_y + stripe_height * 2)],
        fill=(255, 255, 255, 255)  # Blanco
    )
    
    # Franja inferior (azul)
    draw.rectangle(
        [(flag_x, flag_y + stripe_height * 2),
         (flag_x + flag_width, flag_y + flag_height)],
        fill=(30, 144, 255, 255)  # #1E90FF
    )
    
    # Borde de la bandera
    draw.rectangle(
        [(flag_x, flag_y),
         (flag_x + flag_width, flag_y + flag_height)],
        outline=(0, 0, 0, 51),  # Negro semi-transparente
        width=2
    )
    
    # Aplicar máscara final
    final = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    final.paste(output, (0, 0), mask)
    
    return final

def main():
    """Genera los iconos necesarios"""
    sizes = [192, 512]
    
    print("Generando iconos PWA...")
    for size in sizes:
        print(f"Generando icon-{size}.png...")
        icon = create_icon(size)
        filename = f"icon-{size}.png"
        icon.save(filename, 'PNG')
        print(f"✓ {filename} creado exitosamente")
    
    print("\n¡Todos los iconos generados!")
    print("Los archivos icon-192.png e icon-512.png están listos para usar.")

if __name__ == "__main__":
    main()

