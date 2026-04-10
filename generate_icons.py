#!/usr/bin/env python3
"""
generate_icons.py — HidroSmart PWA Icon Generator
Gera todos os ícones necessários para PWA (mobile + desktop + splash)
Requer: pip install Pillow

Uso:
  python generate_icons.py            # Gera a partir do SVG embutido
  python generate_icons.py icon.png   # Gera a partir de uma imagem existente
"""

import os, sys
from PIL import Image, ImageDraw, ImageFont

SIZES = [72, 96, 128, 144, 152, 192, 384, 512]
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), 'icons')

SPLASH_SIZES = [
    (640, 1136),   # iPhone 5
    (750, 1334),   # iPhone 6/7/8
    (828, 1792),   # iPhone XR
    (1125, 2436),  # iPhone X/XS
    (1242, 2208),  # iPhone 6+/7+/8+
    (1242, 2688),  # iPhone XS Max
    (1536, 2048),  # iPad
    (1668, 2224),  # iPad Pro 10.5
    (2048, 2732),  # iPad Pro 12.9
]

PRIMARY   = (0, 94, 192)   # #005EC0
SECONDARY = (0, 178, 255)  # #00B2FF
BG        = (238, 245, 252) # #EEF5FC


def make_base_icon(size: int) -> Image.Image:
    """Desenha o ícone HidroSmart: fundo azul + gota d'água estilizada"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    pad   = size * 0.08
    r     = (size - 2 * pad) / 2
    cx, cy = size / 2, size / 2

    # Círculo de fundo com gradiente simulado (dois círculos)
    draw.ellipse([pad, pad, size - pad, size - pad], fill=PRIMARY)
    inner_r = r * 0.92
    ix = cx - inner_r
    iy = cy - inner_r
    draw.ellipse([ix, iy, cx + inner_r, cy + inner_r],
                 fill=(0, 110, 210))

    # Gota d'água (path manual)
    s = size / 64  # escala base
    drop_pts = []
    import math
    # Topo da gota (ponta)
    tx, ty = cx, cy - 18 * s
    # Corpo arredondado
    for deg in range(0, 361, 5):
        rad = math.radians(deg)
        rx_ = 9 * s
        ry_ = 12 * s
        bx  = cx + rx_ * math.sin(rad)
        by  = cy + 4 * s + ry_ * (-math.cos(rad))
        if deg == 0:
            # liga topo com lado direito
            drop_pts.append((tx, ty))
        drop_pts.append((bx, by))

    draw.polygon(drop_pts, fill=(255, 255, 255, 230))

    # Reflexo brilhante na gota
    refl_r = 2.5 * s
    draw.ellipse([cx - 4*s - refl_r, cy - 2*s - refl_r,
                  cx - 4*s + refl_r, cy - 2*s + refl_r],
                 fill=(255, 255, 255, 160))

    return img


def save_icons(source_img=None):
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    for sz in SIZES:
        if source_img:
            ico = source_img.copy().convert('RGBA')
            ico = ico.resize((sz, sz), Image.LANCZOS)
        else:
            ico = make_base_icon(sz)
        path = os.path.join(OUTPUT_DIR, f'icon-{sz}.png')
        ico.save(path, 'PNG', optimize=True)
        print(f'  ✓ {path}')

    # favicon 32x32 e 16x16
    for sz in (16, 32):
        if source_img:
            ico = source_img.copy().convert('RGBA').resize((sz, sz), Image.LANCZOS)
        else:
            ico = make_base_icon(sz)
        path = os.path.join(OUTPUT_DIR, f'favicon-{sz}.png')
        ico.save(path, 'PNG')
        print(f'  ✓ {path}')

    # ICO para Windows (favicon.ico)
    favicon_path = os.path.join(os.path.dirname(__file__), 'favicon.ico')
    ico16 = make_base_icon(16) if not source_img else source_img.copy().convert('RGBA').resize((16, 16), Image.LANCZOS)
    ico32 = make_base_icon(32) if not source_img else source_img.copy().convert('RGBA').resize((32, 32), Image.LANCZOS)
    ico16.save(favicon_path, format='ICO', sizes=[(16, 16), (32, 32)])
    print(f'  ✓ {favicon_path}')

    # Apple touch icon (180x180)
    sz = 180
    if source_img:
        apple = source_img.copy().convert('RGBA').resize((sz, sz), Image.LANCZOS)
    else:
        apple = make_base_icon(sz)
    apple_path = os.path.join(os.path.dirname(__file__), 'apple-touch-icon.png')
    apple.save(apple_path, 'PNG')
    print(f'  ✓ {apple_path}')


def save_splash_screens(source_img=None):
    splash_dir = os.path.join(os.path.dirname(__file__), 'splash')
    os.makedirs(splash_dir, exist_ok=True)

    icon_sz = 192
    if source_img:
        icon = source_img.copy().convert('RGBA').resize((icon_sz, icon_sz), Image.LANCZOS)
    else:
        icon = make_base_icon(icon_sz)

    for w, h in SPLASH_SIZES:
        img = Image.new('RGBA', (w, h), BG)
        draw = ImageDraw.Draw(img)

        # Fundo com gradiente suave (simulado)
        for y in range(h):
            t = y / h
            r_ = int(PRIMARY[0] + (BG[0] - PRIMARY[0]) * t * 0.35)
            g_ = int(PRIMARY[1] + (BG[1] - PRIMARY[1]) * t * 0.35)
            b_ = int(PRIMARY[2] + (BG[2] - PRIMARY[2]) * t * 0.35)
            draw.line([(0, y), (w, y)], fill=(r_, g_, b_))

        # Centraliza ícone
        ix = (w - icon_sz) // 2
        iy = (h - icon_sz) // 2 - 30
        img.paste(icon, (ix, iy), icon)

        # Nome do app abaixo do ícone
        try:
            font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', int(w * 0.06))
        except Exception:
            font = ImageFont.load_default()

        txt = 'HidroSmart'
        bbox = draw.textbbox((0, 0), txt, font=font)
        tw = bbox[2] - bbox[0]
        tx = (w - tw) // 2
        ty = iy + icon_sz + 24
        draw.text((tx, ty), txt, fill=(255, 255, 255), font=font)

        fname = f'splash-{w}x{h}.png'
        img.save(os.path.join(splash_dir, fname), 'PNG', optimize=True)
        print(f'  ✓ splash/{fname}')


if __name__ == '__main__':
    src = None
    if len(sys.argv) > 1 and os.path.isfile(sys.argv[1]):
        print(f'Usando imagem fonte: {sys.argv[1]}')
        src = Image.open(sys.argv[1]).convert('RGBA')

    print('\n📦 Gerando ícones PWA...')
    save_icons(src)

    print('\n🖼️  Gerando splash screens iOS...')
    save_splash_screens(src)

    print('\n✅ Todos os assets gerados com sucesso!')
    print(f'   Ícones  → ./icons/')
    print(f'   Splash  → ./splash/')
    print(f'   Favicon → ./favicon.ico')
    print(f'   Apple   → ./apple-touch-icon.png')
