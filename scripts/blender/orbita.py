# El objeto de la home, hecho de codigo, renderizado en Blender.
#
# 240 caracteres de codigo en 3D (JetBrains Mono, extruidos) mas cuatro
# orbitas finas. Cada cuadro se calcula aqui mismo, sin keyframes: es un
# recorrido de 180 cuadros que la web reproduce con el scroll.
#
#   0-23     atomo del logo girando 45 grados (loop perfecto: 4 orbitas)
#   24-59    el atomo se aplana en 9 cajas grises identicas (la plantilla)
#   60-95    las cajas se desordenan y se arman como un layout a medida
#   96-131   el codigo forma un monitor; la web dibuja el caso en la pantalla
#   132-155  el monitor vuelve a ser atomo
#   156-179  atomo girando (loop) hasta el final de la pagina
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
F_TO = int(argv[4]) if len(argv) > 4 else 179

HERE = os.path.dirname(os.path.abspath(__file__))
FONT = os.path.normpath(os.path.join(HERE, '..', '..', '..', 'FSOrbit Contenido', 'brand', 'fonts', 'JetBrainsMono-Bold.ttf'))

random.seed(7)
N = 240
GLYPHS = '{}<>/;=()[]:.+*&|!?#$_%@~abcdefghijklmnopqrstuvwxyz0123456789'

CYAN = (0.0, 0.92, 0.97)
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
    scene.eevee.taa_render_samples = 48
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

cam_data = bpy.data.cameras.new('cam')
cam_data.lens = 85
cam = bpy.data.objects.new('cam', cam_data)
cam.location = (0, -9.5, 0)
cam.rotation_euler = (math.pi / 2, 0, 0)
scene.collection.objects.link(cam)
scene.camera = cam

light_data = bpy.data.lights.new('luz', type='AREA')
light_data.energy = 260
light_data.size = 4
light = bpy.data.objects.new('luz', light_data)
light.location = (-3, -5, 4)
light.rotation_euler = (math.radians(55), 0, math.radians(-30))
scene.collection.objects.link(light)


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


glyph_mat = make_material('codigo', 2.2)
ring_mat = make_material('orbita', 1.4)

font = bpy.data.fonts.load(FONT) if os.path.exists(FONT) else None

# ------------------------------------------------------------ caracteres
tiles = []
for i in range(N):
    cu = bpy.data.curves.new(f'g{i}', type='FONT')
    cu.body = random.choice(GLYPHS)
    cu.size = 0.13
    cu.extrude = 0.012
    cu.align_x = 'CENTER'
    cu.align_y = 'CENTER'
    if font:
        cu.font = font
    cu.materials.append(glyph_mat)
    ob = bpy.data.objects.new(f'g{i}', cu)
    scene.collection.objects.link(ob)
    tiles.append(
        {
            'ob': ob,
            'glyph': cu.body,
            'seed': random.random(),
            'noise': Vector((random.uniform(-1, 1), random.uniform(-1, 1), random.uniform(-1, 1))),
            'tilt': (random.uniform(-0.25, 0.25), random.uniform(-0.25, 0.25)),
        }
    )

# ---------------------------------------------------------------- orbitas
RING_R = 1.3
RING_ALPHA = 0.42  # inclinacion: elipse como la del logo
BETA = 0.22  # el atomo se inclina un poco hacia la camara

atom_rig = bpy.data.objects.new('atomo', None)
atom_rig.rotation_mode = 'YXZ'
scene.collection.objects.link(atom_rig)
rings = []
for k in range(4):
    bpy.ops.mesh.primitive_torus_add(major_radius=RING_R, minor_radius=0.0065, major_segments=160, minor_segments=8)
    t = bpy.context.active_object
    t.rotation_mode = 'XYZ'
    t.rotation_euler = (RING_ALPHA, k * math.pi / 4, 0)
    t.data.materials.append(ring_mat)
    t.color = (*DEEP, 1)
    t.parent = atom_rig
    rings.append(t)


def atom_rot(spin):
    return Matrix.Rotation(BETA, 4, 'X') @ Matrix.Rotation(spin, 4, 'Y')


# ----------------------------------------------------------- poses base
def ring_point(k, t):
    p = Vector((RING_R * math.cos(t), RING_R * math.sin(t), 0))
    p = Matrix.Rotation(RING_ALPHA, 4, 'X') @ p
    return Matrix.Rotation(k * math.pi / 4, 4, 'Y') @ p


# Pose A (sin giro global): 4 orbitas x 48 caracteres + nucleo simetrico.
pose_a = []
color_a = []
per_ring = 48
for i in range(N):
    if i < 4 * per_ring:
        k, j = divmod(i, per_ring)
        pose_a.append(ring_point(k, 2 * math.pi * j / per_ring))
        color_a.append(CYAN if k % 2 == 0 else DEEP)
core = []
rng = random.Random(3)
for _ in range(6):
    r = 0.28 * rng.random() ** 0.6
    th, ph = rng.uniform(0, 2 * math.pi), rng.uniform(-1, 1)
    core.append(Vector((r * math.sqrt(1 - ph * ph) * math.cos(th), r * math.sqrt(1 - ph * ph) * math.sin(th), r * ph)))
for c in range(8):
    for p in core:
        pose_a.append(Matrix.Rotation(c * math.pi / 4, 4, 'Y') @ p)
        color_a.append(BONE)
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
for i in range(N):
    box = i % 9
    nth = i // 9
    cx = ((box % 3) - 1) * (BW + GAP)
    cz = (1 - box // 3) * (BH + GAP)
    x0, z0 = cx - BW / 2, cz - BH / 2
    if nth < 18:
        x, z = rect_point(x0, z0, x0 + BW, z0 + BH, nth / 18)
    else:
        x, z = rect_point(x0 + 0.1, z0 + 0.28, x0 + 0.42, z0 + 0.5, (nth - 18) / 9)
    pose_b.append(Vector((x, 0, z)))
    color_b.append(LEAD)

# Pose C: el layout a medida. Piezas desiguales, a distinta profundidad.
crng = random.Random(11)


def line(x0, x1, z, y):
    return lambda u: Vector((x0 + (x1 - x0) * u, y, z + crng.uniform(-0.02, 0.02)))


def box_(x0, z0, x1, z1, y):
    return lambda u: Vector((*rect_point(x0, z0, x1, z1, u)[:1], y, rect_point(x0, z0, x1, z1, u)[1]))


def circle(cx, cz, r, y):
    return lambda u: Vector((cx + r * math.cos(2 * math.pi * u), y, cz + r * math.sin(2 * math.pi * u)))


PARTS = [
    (26, line(-1.45, 0.25, 0.95, -0.35), BONE),
    (19, line(-1.45, -0.25, 0.72, -0.35), BONE),
    (34, box_(0.55, -0.25, 1.45, 1.05, 0.25), DEEP),
    (22, circle(0.55, -0.35, 0.32, -0.5), CYAN),
    (14, line(-1.45, 0.05, 0.42, 0), CYAN),
    (13, line(-1.45, -0.1, 0.28, 0), CYAN),
    (11, line(-1.45, -0.35, 0.14, 0), CYAN),
    (16, box_(-1.45, -0.3, -0.75, -0.1, -0.45), CYAN),
    (18, box_(-1.45, -1.0, -0.6, -0.65, 0.1), DEEP),
    (32, box_(-0.45, -1.0, 1.45, -0.65, 0.1), DEEP),
]
# Se reparten los 240 caracteres entre las piezas, sin relleno suelto.
total = sum(p[0] for p in PARTS)
counts = [round(p[0] * N / total) for p in PARTS]
counts[0] += N - sum(counts)
pose_c, color_c = [], []
for count, (_, fn, col) in zip(counts, PARTS):
    for j in range(count):
        pose_c.append(fn((j + 0.5) / count))
        color_c.append(col)
crng.shuffle(idx := list(range(N)))
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
for i in range(N):
    if i < 196:
        x, z = rect_point(ox0, oz0, ox1, oz1, i / 196)
        pose_d.append(Vector((x, 0, z)))
        color_d.append(CYAN)
    elif i < 216:
        u = (i - 196) / 20
        pose_d.append(Vector((-0.06 + 0.12 * (u > 0.5), 0, oz0 - 0.05 - 0.38 * ((u * 2) % 1))))
        color_d.append(DEEP)
    else:
        u = (i - 216) / 24
        pose_d.append(Vector((-0.6 + 1.2 * u, 0, oz0 - 0.47)))
        color_d.append(DEEP)

screen_data = bpy.data.meshes.new('pantalla')
screen_data.from_pydata(
    [(-SCREEN_W / 2, 0.03, SCREEN_Z - SCREEN_H / 2), (SCREEN_W / 2, 0.03, SCREEN_Z - SCREEN_H / 2), (SCREEN_W / 2, 0.03, SCREEN_Z + SCREEN_H / 2), (-SCREEN_W / 2, 0.03, SCREEN_Z + SCREEN_H / 2)],
    [],
    [(0, 1, 2, 3)],
)
screen = bpy.data.objects.new('pantalla', screen_data)
screen_mat = make_material('pantalla', 0.6)
screen_data.materials.append(screen_mat)
screen.color = (0.012, 0.024, 0.026, 1)
scene.collection.objects.link(screen)


# ------------------------------------------------------------- recorrido
def smooth(x):
    x = min(1.0, max(0.0, x))
    return x * x * (3 - 2 * x)


def lerp_v(a, b, t):
    return a + (b - a) * t


def lerp_c(a, b, t):
    return tuple(a[i] + (b[i] - a[i]) * t for i in range(3))


def atom_pose(spin):
    R = atom_rot(spin)
    return [R @ p for p in pose_a]


A0 = atom_pose(0.0)
POSES = {'A': (A0, color_a), 'B': (pose_b, color_b), 'C': (pose_c, color_c), 'D': (pose_d, color_d)}
SEGMENTS = [  # (desde, hasta, pose inicial, pose final, desorden)
    (24, 59, 'A', 'B', 0.25),
    (60, 95, 'B', 'C', 0.65),
    (96, 131, 'C', 'D', 0.35),
    (132, 155, 'D', 'A', 0.3),
]


def state(frame):
    """Posicion, color, glifo 'x' y visibilidades para un cuadro."""
    if frame < 24 or frame >= 156:
        base = 0 if frame < 24 else 156
        spin = (frame - base) / 24 * (math.pi / 4)
        return atom_pose(spin), color_a, [False] * N, spin, 1.0, 0.0
    for f0, f1, pa, pb, amp in SEGMENTS:
        if f0 <= frame <= f1:
            t = (frame - f0) / (f1 - f0)
            (Pa, Ca), (Pb, Cb) = POSES[pa], POSES[pb]
            pos, col, same = [], [], []
            for i, tile in enumerate(tiles):
                lt = smooth((t - tile['seed'] * 0.3) / 0.7)
                p = lerp_v(Pa[i], Pb[i], lt) + tile['noise'] * (math.sin(lt * math.pi) * amp)
                pos.append(p)
                col.append(lerp_c(Ca[i], Cb[i], lt))
                gray_from = pa == 'B'
                gray_to = pb == 'B'
                same.append((gray_from and lt < 0.5) or (gray_to and lt >= 0.5))
            rings_on = 1 - smooth(t / 0.4) if pa == 'A' else (smooth((t - 0.6) / 0.4) if pb == 'A' else 0.0)
            screen_on = smooth((t - 0.65) / 0.3) if pb == 'D' else (1 - smooth(t / 0.3) if pa == 'D' else 0.0)
            return pos, col, same, 0.0, rings_on, screen_on
    raise ValueError(frame)


def apply(frame):
    pos, col, same, spin, rings_on, screen_on = state(frame)
    for i, tile in enumerate(tiles):
        ob = tile['ob']
        ob.location = pos[i]
        ob.rotation_euler = (math.pi / 2 + tile['tilt'][0], tile['tilt'][1], 0)
        ob.color = (*col[i], 1)
        body = 'x' if same[i] else tile['glyph']
        if ob.data.body != body:
            ob.data.body = body
    atom_rig.rotation_euler = (BETA, spin, 0)
    s = max(rings_on, 0.0001)
    atom_rig.scale = (s, s, s)
    for r in rings:
        r.hide_render = rings_on < 0.01
    ss = max(screen_on, 0.0001)
    screen.scale = (ss, 1, ss)
    screen.location = (0, 0, SCREEN_Z * (1 - ss))
    screen.hide_render = screen_on < 0.01


# --------------------------------------------- pantalla del monitor -> JSON
# Donde cae la pantalla en el cuadro (0-1, origen arriba a la izquierda).
apply(131)
bpy.context.view_layer.update()
corners = [Vector((-SCREEN_W / 2, 0, SCREEN_Z - SCREEN_H / 2)), Vector((SCREEN_W / 2, 0, SCREEN_Z + SCREEN_H / 2))]
proj = [world_to_camera_view(scene, cam, c) for c in corners]
rect = {
    'x': round(proj[0].x, 4),
    'y': round(1 - proj[1].y, 4),
    'w': round(proj[1].x - proj[0].x, 4),
    'h': round(proj[1].y - proj[0].y, 4),
    'screenFrom': 120,
    'screenTo': 140,
    'frames': 180,
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
