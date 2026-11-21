# El objeto de la home, hecho de codigo, renderizado en Blender.
#
# Es el logo de FS Orbit construido con caracteres de codigo en 3D
# (JetBrains Mono, extruidos): cuatro orbitas, el circulo central con "FS",
# el anillo exterior y una nube de codigo tenue alrededor, con profundidad
# de campo. Cada cuadro se calcula aqui mismo, sin keyframes.
#
#   0-29     intro: el codigo disperso se arma como el logo (se ve una vez)
#   30-77    loop: el logo gira y el codigo corre por las orbitas
#   78-113   se aplana en 9 cajas grises identicas (la plantilla)
#   114-149  las cajas se desordenan y se arman como un layout a medida
#   150-185  el codigo forma un monitor; la web dibuja el caso en la pantalla
#   186-209  el monitor vuelve a ser el logo (y sigue el loop)
#
# Uso (Blender 5.2):
#   blender -b -P scripts/blender/orbita.py -- <carpeta_png> <screen.json> [lado_px] [desde] [hasta]
import json
import math
import os
import random
import sys

import bpy
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Matrix, Vector

argv = sys.argv[sys.argv.index('--') + 1 :] if '--' in sys.argv else []
OUT = argv[0] if len(argv) > 0 else os.path.abspath('frames')
SCREEN_JSON = argv[1] if len(argv) > 1 else os.path.abspath('screen.json')
SIDE = int(argv[2]) if len(argv) > 2 else 1000
F_FROM = int(argv[3]) if len(argv) > 3 else 0
F_TO = int(argv[4]) if len(argv) > 4 else 209

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.normpath(os.path.join(HERE, '..', '..', '..', 'FSOrbit Contenido', 'brand', 'fonts'))

random.seed(7)
N = 400  # caracteres que forman las figuras
DUST_SEED = 18  # x8 = caracteres de la nube de fondo
GLYPHS = '{}<>/;=()[]:.+*&|!?#$_%@~abcdefghijklmnopqrstuvwxyz0123456789'

CYAN = (0.0, 0.92, 0.97)
SOFT = (0.42, 0.97, 1.0)
DEEP = (0.02, 0.36, 0.38)
BONE = (0.86, 0.93, 0.93)
LEAD = (0.22, 0.25, 0.26)

# ---------------------------------------------------------------- escena
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
for engine in ('BLENDER_EEVEE', 'BLENDER_EEVEE_NEXT'):
    try:
        scene.render.engine = engine
        break
    except TypeError:
        continue
scene.render.resolution_x = SIDE
scene.render.resolution_y = SIDE
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGB'
scene.render.film_transparent = False
try:
    scene.eevee.taa_render_samples = 64
except AttributeError:
    pass
try:
    scene.view_settings.view_transform = 'Standard'
except TypeError:
    pass

world = bpy.data.worlds.new('negro')
world.use_nodes = True
world.node_tree.nodes['Background'].inputs[0].default_value = (0, 0, 0, 1)
scene.world = world

CAM_D = 9.5
cam_data = bpy.data.cameras.new('cam')
cam_data.lens = 85
cam_data.dof.use_dof = True
cam_data.dof.focus_distance = CAM_D
cam_data.dof.aperture_fstop = 1.2
cam = bpy.data.objects.new('cam', cam_data)
scene.collection.objects.link(cam)
scene.camera = cam


def place_camera(yaw, pitch):
    """Camara en orbita alrededor del origen, mirando al centro."""
    x = CAM_D * math.sin(yaw) * math.cos(pitch)
    y = -CAM_D * math.cos(yaw) * math.cos(pitch)
    z = CAM_D * math.sin(pitch)
    cam.location = (x, y, z)
    direction = Vector((0, 0, 0)) - Vector((x, y, z))
    cam.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()


place_camera(0, 0)

for name, energy, loc, rot in (
    ('clave', 300, (-3, -5, 4), (55, 0, -30)),
    ('contra', 160, (4, 3, 2), (-60, 0, 140)),
):
    ld = bpy.data.lights.new(name, type='AREA')
    ld.energy = energy
    ld.size = 4
    ld.color = (0.75, 1.0, 1.0)
    lo = bpy.data.objects.new(name, ld)
    lo.location = loc
    lo.rotation_euler = tuple(math.radians(a) for a in rot)
    scene.collection.objects.link(lo)


def make_material(name, strength):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()
    info = nt.nodes.new('ShaderNodeObjectInfo')
    emit = nt.nodes.new('ShaderNodeEmission')
    emit.inputs['Strength'].default_value = strength
    diff = nt.nodes.new('ShaderNodeBsdfDiffuse')
    add = nt.nodes.new('ShaderNodeAddShader')
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    nt.links.new(info.outputs['Color'], emit.inputs['Color'])
    nt.links.new(info.outputs['Color'], diff.inputs['Color'])
    nt.links.new(emit.outputs[0], add.inputs[0])
    nt.links.new(diff.outputs[0], add.inputs[1])
    nt.links.new(add.outputs[0], out.inputs['Surface'])
    return mat


glyph_mat = make_material('codigo', 2.4)
ring_mat = make_material('orbita', 1.6)
dust_mat = make_material('nube', 1.2)

mono = os.path.join(FONTS, 'JetBrainsMono-Bold.ttf')
sans = os.path.join(FONTS, 'Archivo-Bold.ttf')
font_mono = bpy.data.fonts.load(mono) if os.path.exists(mono) else None
font_sans = bpy.data.fonts.load(sans) if os.path.exists(sans) else None


def glyph_object(name, body, size, extrude, mat, font):
    cu = bpy.data.curves.new(name, type='FONT')
    cu.body = body
    cu.size = size
    cu.extrude = extrude
    cu.bevel_depth = extrude * 0.25
    cu.align_x = 'CENTER'
    cu.align_y = 'CENTER'
    if font:
        cu.font = font
    cu.materials.append(mat)
    ob = bpy.data.objects.new(name, cu)
    scene.collection.objects.link(ob)
    return ob


# ------------------------------------------------------------ caracteres
tiles = []
for i in range(N):
    ob = glyph_object(f'g{i}', random.choice(GLYPHS), 0.12, 0.014, glyph_mat, font_mono)
    tiles.append(
        {
            'ob': ob,
            'glyph': ob.data.body,
            'seed': random.random(),
            'bright': random.uniform(0.7, 1.15),
            'noise': Vector((random.uniform(-1, 1), random.uniform(-1, 1), random.uniform(-1, 1))),
            'tilt': (random.uniform(-0.3, 0.3), random.uniform(-0.3, 0.3)),
        }
    )

# Nube de codigo tenue alrededor (simetrica en 8 giros, para el loop).
drng = random.Random(21)
dust_base = []
for _ in range(DUST_SEED):
    r = drng.uniform(1.55, 2.05)
    th = drng.uniform(0, math.pi / 4)
    z = drng.uniform(-1.05, 1.05)
    dust_base.append((r, th, z, drng.choice(GLYPHS), drng.uniform(0.25, 0.6)))
dust = []
for k in range(8):
    for r, th, z, ch, b in dust_base:
        a = th + k * math.pi / 4
        ob = glyph_object(f'd{len(dust)}', ch, 0.1, 0.008, dust_mat, font_mono)
        dust.append({'ob': ob, 'p': Vector((r * math.cos(a), r * math.sin(a), z)), 'b': b})

# ---------------------------------------------------------------- logo
RING_R = 1.3
RING_ALPHA = 0.42  # inclinacion: elipse como la del logo
BETA = 0.22  # el logo se inclina un poco hacia la camara

atom_rig = bpy.data.objects.new('logo', None)
atom_rig.rotation_mode = 'YXZ'
scene.collection.objects.link(atom_rig)
rings = []
for k in range(4):
    bpy.ops.mesh.primitive_torus_add(major_radius=RING_R, minor_radius=0.0065, major_segments=180, minor_segments=8)
    t = bpy.context.active_object
    t.rotation_mode = 'XYZ'
    t.rotation_euler = (RING_ALPHA, k * math.pi / 4, 0)
    t.data.materials.append(ring_mat)
    t.color = (*DEEP, 1)
    t.parent = atom_rig
    rings.append(t)
# Circulos del logo: el exterior y el central (de frente a la camara).
for radius, minor in ((1.62, 0.009), (0.5, 0.008)):
    bpy.ops.mesh.primitive_torus_add(major_radius=radius, minor_radius=minor, major_segments=200, minor_segments=8)
    t = bpy.context.active_object
    t.rotation_euler = (math.pi / 2, 0, 0)
    t.data.materials.append(ring_mat)
    t.color = (*CYAN, 1)
    t.parent = atom_rig
    rings.append(t)

# "FS" en el centro, como en el logo; no gira con el loop.
fs = glyph_object('fs', 'FS', 0.42, 0.05, glyph_mat, font_sans)
fs.rotation_euler = (math.pi / 2, 0, 0)
fs.color = (*SOFT, 1)


def atom_rot(spin):
    return Matrix.Rotation(BETA, 4, 'X') @ Matrix.Rotation(spin, 4, 'Y')


# ----------------------------------------------------------- poses base
def ring_point(k, t):
    p = Vector((RING_R * math.cos(t), RING_R * math.sin(t), 0))
    p = Matrix.Rotation(RING_ALPHA, 4, 'X') @ p
    return Matrix.Rotation(k * math.pi / 4, 4, 'Y') @ p


# Pose A (sin giro global): 4 orbitas + dos circulos alrededor de "FS".
pose_a, color_a = [], []
PER_RING = 74
for k in range(4):
    for j in range(PER_RING):
        pose_a.append(ring_point(k, 2 * math.pi * j / PER_RING))
        color_a.append(CYAN if k % 2 == 0 else SOFT)
rest = N - len(pose_a)  # 104 = 8 * 13: simetrico en giros de 45 grados
for j in range(rest):
    radius = 0.62 if j % 2 == 0 else 0.72
    a = 2 * math.pi * j / rest
    pose_a.append(Vector((radius * math.cos(a), 0, radius * math.sin(a))))
    color_a.append(DEEP if j % 2 else CYAN)
assert len(pose_a) == N


def rect_point(x0, z0, x1, z1, u):
    w, h = x1 - x0, z1 - z0
    d = u * 2 * (w + h)
    if d < w:
        return (x0 + d, z1)
    d -= w
    if d < h:
        return (x1, z1 - d)
    d -= h
    if d < w:
        return (x1 - d, z0)
    return (x0, z0 + (d - w))


# Pose B: la plantilla. 3x3 cajas iguales, grises, el mismo caracter.
pose_b, color_b = [], []
BW, BH, GAP = 0.92, 0.6, 0.14
per_box = N // 9
for i in range(N):
    box = i % 9
    nth = i // 9
    cx = ((box % 3) - 1) * (BW + GAP)
    cz = (1 - box // 3) * (BH + GAP)
    x0, z0 = cx - BW / 2, cz - BH / 2
    if nth < 28:
        x, z = rect_point(x0, z0, x0 + BW, z0 + BH, nth / 28)
    elif nth < 38:
        x, z = rect_point(x0 + 0.1, z0 + 0.28, x0 + 0.42, z0 + 0.5, (nth - 28) / 10)
    else:
        x, z = x0 + 0.1 + 0.7 * ((nth - 38) / max(1, per_box - 38)), z0 + 0.12
    pose_b.append(Vector((x, 0, z)))
    color_b.append(LEAD)

# Pose C: el layout a medida. Piezas desiguales, a distinta profundidad.
crng = random.Random(11)


def line(x0, x1, z, y):
    return lambda u: Vector((x0 + (x1 - x0) * u, y, z + crng.uniform(-0.015, 0.015)))


def box_(x0, z0, x1, z1, y):
    def f(u):
        x, z = rect_point(x0, z0, x1, z1, u)
        return Vector((x, y, z))

    return f


def circle(cx, cz, r, y):
    return lambda u: Vector((cx + r * math.cos(2 * math.pi * u), y, cz + r * math.sin(2 * math.pi * u)))


PARTS = [
    (26, line(-1.45, 0.25, 0.95, -0.35), BONE),
    (19, line(-1.45, -0.25, 0.75, -0.35), BONE),
    (34, box_(0.55, -0.25, 1.45, 1.05, 0.25), DEEP),
    (14, box_(0.68, 0.45, 1.32, 0.92, 0.1), SOFT),
    (22, circle(0.55, -0.35, 0.32, -0.5), CYAN),
    (14, line(-1.45, 0.05, 0.45, 0), CYAN),
    (13, line(-1.45, -0.1, 0.31, 0), CYAN),
    (11, line(-1.45, -0.35, 0.17, 0), CYAN),
    (16, box_(-1.45, -0.3, -0.75, -0.08, -0.45), CYAN),
    (18, box_(-1.45, -1.0, -0.6, -0.65, 0.1), DEEP),
    (32, box_(-0.45, -1.0, 1.45, -0.65, 0.1), DEEP),
]
total = sum(p[0] for p in PARTS)
counts = [round(p[0] * N / total) for p in PARTS]
counts[0] += N - sum(counts)
pose_c, color_c = [], []
for count, (_, fn, col) in zip(counts, PARTS):
    for j in range(count):
        pose_c.append(fn((j + 0.5) / count))
        color_c.append(col)
idx = list(range(N))
crng.shuffle(idx)
pose_c = [pose_c[k] for k in idx]
color_c = [color_c[k] for k in idx]
ROT_C = Matrix.Rotation(-0.42, 4, 'Z') @ Matrix.Rotation(-0.08, 4, 'X')
pose_c = [ROT_C @ p for p in pose_c]

# Pose D: un monitor. Pantalla 2.06:1 (como las capturas de los casos).
SCREEN_W = 2.9
SCREEN_H = SCREEN_W / 2.06
SCREEN_Z = 0.22
M = 0.1
ox0, ox1 = -SCREEN_W / 2 - M, SCREEN_W / 2 + M
oz0, oz1 = SCREEN_Z - SCREEN_H / 2 - M, SCREEN_Z + SCREEN_H / 2 + M
pose_d, color_d = [], []
N_FRAME, N_STAND = 312, 40
for i in range(N):
    if i < N_FRAME:
        x, z = rect_point(ox0, oz0, ox1, oz1, i / N_FRAME)
        y = -0.03 if i % 2 else 0.03  # marco con algo de grosor
        pose_d.append(Vector((x, y, z)))
        color_d.append(CYAN if i % 3 else SOFT)
    elif i < N_FRAME + N_STAND:
        u = (i - N_FRAME) / N_STAND
        pose_d.append(Vector((-0.07 + 0.14 * (u > 0.5), 0, oz0 - 0.05 - 0.4 * ((u * 2) % 1))))
        color_d.append(DEEP)
    else:
        u = (i - N_FRAME - N_STAND) / (N - N_FRAME - N_STAND)
        pose_d.append(Vector((-0.7 + 1.4 * u, 0, oz0 - 0.5)))
        color_d.append(DEEP)

screen_data = bpy.data.meshes.new('pantalla')
screen_data.from_pydata(
    [
        (-SCREEN_W / 2, 0.04, SCREEN_Z - SCREEN_H / 2),
        (SCREEN_W / 2, 0.04, SCREEN_Z - SCREEN_H / 2),
        (SCREEN_W / 2, 0.04, SCREEN_Z + SCREEN_H / 2),
        (-SCREEN_W / 2, 0.04, SCREEN_Z + SCREEN_H / 2),
    ],
    [],
    [(0, 1, 2, 3)],
)
screen = bpy.data.objects.new('pantalla', screen_data)
screen_mat = make_material('pantalla', 0.25)
screen_data.materials.append(screen_mat)
screen.color = (0.006, 0.012, 0.013, 1)
scene.collection.objects.link(screen)


# ------------------------------------------------------------- recorrido
def smooth(x):
    x = min(1.0, max(0.0, x))
    return x * x * (3 - 2 * x)


def lerp_v(a, b, t):
    return a + (b - a) * t


def lerp_c(a, b, t):
    return tuple(a[i] + (b[i] - a[i]) * t for i in range(3))


def atom_pose(spin, phase=0.0):
    """Logo con giro `spin` y el codigo avanzando `phase` lugares por la orbita."""
    R = atom_rot(spin)
    out = []
    for k in range(4):
        for j in range(PER_RING):
            out.append(R @ ring_point(k, 2 * math.pi * (j + phase * (1 if k % 2 == 0 else -1)) / PER_RING))
    rest = N - len(out)
    for j in range(rest):
        radius = 0.62 if j % 2 == 0 else 0.72
        a = 2 * math.pi * (j - phase) / rest
        out.append(R @ Vector((radius * math.cos(a), 0, radius * math.sin(a))))
    return out


# Linea de tiempo (cuadros). La web la lee de screen.json.
INTRO = (0, 29)  # el logo se arma desde el codigo disperso (se ve una vez)
LOOP = (30, 77)  # el logo gira y el codigo corre por las orbitas (sin fin)
SEGMENTS = [  # (desde, hasta, pose inicial, pose final, desorden, giro de camara)
    (78, 113, 'A', 'B', 0.3, 0.35),
    (114, 149, 'B', 'C', 0.75, -0.45),
    (150, 185, 'C', 'D', 0.4, 0.3),
    (186, 209, 'D', 'A', 0.35, -0.3),
]
TOTAL = 210
HOLD = 185  # el monitor quieto, con la pantalla lista para la captura

A0 = atom_pose(0.0)
POSES = {'A': (A0, color_a), 'B': (pose_b, color_b), 'C': (pose_c, color_c), 'D': (pose_d, color_d)}

# Puntos de partida del intro: fuera del cuadro, en espiral.
irng = random.Random(5)
intro_from = []
for i in range(N):
    th, ph = irng.uniform(0, 2 * math.pi), irng.uniform(-0.8, 0.8)
    r = irng.uniform(3.0, 4.6)
    intro_from.append(Vector((r * math.cos(th) * math.cos(ph), r * math.sin(ph), r * math.sin(th) * math.cos(ph))))


def bright(cols):
    return [tuple(c * t['bright'] for c in cols[i]) for i, t in enumerate(tiles)]


def state(frame):
    """Todo lo que cambia en un cuadro."""
    s = {'same': [False] * N, 'spin': 0.0, 'logo': 1.0, 'screen': 0.0, 'yaw': 0.0, 'pulse': 1.0, 'dust': 1.0}
    if frame <= INTRO[1]:
        t = (frame - INTRO[0]) / (INTRO[1] - INTRO[0])
        pos, col = [], []
        for i, tile in enumerate(tiles):
            lt = smooth((t - tile['seed'] * 0.35) / 0.65)
            start = Matrix.Rotation((1 - lt) * 1.6, 4, 'Y') @ intro_from[i]
            pos.append(lerp_v(start, A0[i], lt))
            col.append(tuple(c * tile['bright'] for c in lerp_c(DEEP, color_a[i], lt)))
        s.update(pos=pos, col=col, logo=smooth((t - 0.55) / 0.45), yaw=0.3 * (1 - smooth(t)), dust=smooth(t / 0.6))
        return s
    if frame <= LOOP[1]:
        u = (frame - LOOP[0]) / (LOOP[1] - LOOP[0] + 1)
        spin = u * (math.pi / 4)
        s.update(pos=atom_pose(spin, u), col=bright(color_a), spin=spin, pulse=1 + 0.35 * math.sin(2 * math.pi * u))
        return s
    for f0, f1, pa, pb, amp, yaw in SEGMENTS:
        if f0 <= frame <= f1:
            t = (frame - f0) / (f1 - f0)
            (Pa, Ca), (Pb, Cb) = POSES[pa], POSES[pb]
            pos, col, same = [], [], []
            for i, tile in enumerate(tiles):
                lt = smooth((t - tile['seed'] * 0.3) / 0.7)
                p = lerp_v(Pa[i], Pb[i], lt) + tile['noise'] * (math.sin(lt * math.pi) * amp)
                pos.append(p)
                col.append(tuple(c * tile['bright'] for c in lerp_c(Ca[i], Cb[i], lt)))
                same.append((pa == 'B' and lt < 0.5) or (pb == 'B' and lt >= 0.5))
            logo = 1 - smooth(t / 0.4) if pa == 'A' else (smooth((t - 0.6) / 0.4) if pb == 'A' else 0.0)
            scr = smooth((t - 0.65) / 0.3) if pb == 'D' else (1 - smooth(t / 0.3) if pa == 'D' else 0.0)
            s.update(pos=pos, col=col, same=same, logo=logo, screen=scr, yaw=yaw * math.sin(math.pi * t) ** 2)
            return s
    raise ValueError(frame)


def apply(frame):
    s = state(frame)
    for i, tile in enumerate(tiles):
        ob = tile['ob']
        ob.location = s['pos'][i]
        ob.rotation_euler = (math.pi / 2 + tile['tilt'][0], tile['tilt'][1], 0)
        ob.color = (*s['col'][i], 1)
        body = 'x' if s['same'][i] else tile['glyph']
        if ob.data.body != body:
            ob.data.body = body
    R = Matrix.Rotation(s['spin'], 4, 'Z')
    for d in dust:
        d['ob'].location = R @ d['p']
        d['ob'].rotation_euler = (math.pi / 2, 0, 0)
        d['ob'].color = (*(c * d['b'] * s['dust'] for c in DEEP), 1)
        d['ob'].hide_render = s['dust'] < 0.02
    atom_rig.rotation_euler = (BETA, s['spin'], 0)
    k = max(s['logo'], 0.0001)
    atom_rig.scale = (k, k, k)
    for r in rings:
        r.hide_render = s['logo'] < 0.01
    fs.scale = (k, k, k)
    fs.hide_render = s['logo'] < 0.01
    fs.color = (*(min(1.0, c * s['pulse']) for c in SOFT), 1)
    ss = max(s['screen'], 0.0001)
    screen.scale = (ss, 1, ss)
    screen.location = (0, 0, SCREEN_Z * (1 - ss))
    screen.hide_render = s['screen'] < 0.01
    place_camera(s['yaw'], 0.0)


# --------------------------------------------- pantalla del monitor -> JSON
# Donde cae la pantalla en el cuadro (0-1, origen arriba a la izquierda) y
# la linea de tiempo que usa src/seq/sequence.js.
apply(HOLD)
bpy.context.view_layer.update()
corners = [Vector((-SCREEN_W / 2, 0, SCREEN_Z - SCREEN_H / 2)), Vector((SCREEN_W / 2, 0, SCREEN_Z + SCREEN_H / 2))]
proj = [world_to_camera_view(scene, cam, c) for c in corners]
rect = {
    'x': round(proj[0].x, 4),
    'y': round(1 - proj[1].y, 4),
    'w': round(proj[1].x - proj[0].x, 4),
    'h': round(proj[1].y - proj[0].y, 4),
    'screenFrom': HOLD - 5,
    'screenTo': HOLD + 5,
    'hold': HOLD,
    'frames': TOTAL,
    'intro': list(INTRO),
    'loop': list(LOOP),
    'segments': [[f0, f1] for f0, f1, *_ in SEGMENTS],
}
with open(SCREEN_JSON, 'w', encoding='utf-8') as fh:
    json.dump(rect, fh)
print('[orbita] pantalla', rect)

# ----------------------------------------------------------------- render
os.makedirs(OUT, exist_ok=True)
for f in range(F_FROM, F_TO + 1):
    scene.frame_set(f)
    apply(f)
    scene.render.filepath = os.path.join(OUT, f'f_{f:03d}.png')
    bpy.ops.render.render(write_still=True)
    print(f'[orbita] cuadro {f}')
