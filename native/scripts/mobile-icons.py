"""Regenera los iconos nativos desde el icono existente. Requiere Pillow."""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[2]
source = Image.open(root / 'icon-512.png').convert('RGBA')
for density, size in [('mdpi', 48), ('hdpi', 72), ('xhdpi', 96), ('xxhdpi', 144), ('xxxhdpi', 192)]:
    directory = root / 'android/app/src/main/res' / ('mipmap-' + density)
    directory.mkdir(parents=True, exist_ok=True)
    for name in ['ic_launcher.png', 'ic_launcher_round.png']:
        source.resize((size, size), Image.Resampling.LANCZOS).save(directory / name)
    # Adaptive icons keep the existing logo in their central safe zone.
    canvas = Image.new('RGBA', (size * 9 // 4, size * 9 // 4), (0, 0, 0, 0))
    logo = source.resize((size, size), Image.Resampling.LANCZOS)
    offset = (canvas.width - size) // 2
    canvas.alpha_composite(logo, (offset, offset))
    canvas.save(directory / 'ic_launcher_foreground.png')

ios_icon = Image.new('RGB', (1024, 1024), '#f7f7f7')
logo = source.resize((1024, 1024), Image.Resampling.LANCZOS)
ios_icon.paste(logo, mask=logo.getchannel('A'))
ios_icon.save(root / 'ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png')

# Replace template splash graphics while preserving their native dimensions.
for p in (root / 'android/app/src/main/res').glob('drawable*/splash.png'):
    with Image.open(p) as old:
        canvas = Image.new('RGB', old.size, '#f7f7f7')
    width = min(canvas.size) // 4
    logo = source.resize((width, width), Image.Resampling.LANCZOS)
    canvas.paste(logo, ((canvas.width-width)//2, (canvas.height-width)//2), logo)
    canvas.save(p)
for p in (root / 'ios/App/App/Assets.xcassets/Splash.imageset').glob('*.png'):
    with Image.open(p) as old:
        canvas = Image.new('RGB', old.size, '#f7f7f7')
    width = min(canvas.size) // 5
    logo = source.resize((width, width), Image.Resampling.LANCZOS)
    canvas.paste(logo, ((canvas.width-width)//2, (canvas.height-width)//2), logo)
    canvas.save(p)
print('Iconos y pantallas de inicio de Banderas preparados.')
