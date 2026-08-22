import trimesh, numpy as np, math
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/models/avatar-base.glb'
OUT.parent.mkdir(parents=True, exist_ok=True)
scene=trimesh.Scene()

# helpers

def mat_translate(x=0,y=0,z=0):
    M=np.eye(4); M[:3,3]=[x,y,z]; return M

def mat_scale(x=1,y=1,z=1):
    M=np.eye(4); M[0,0]=x; M[1,1]=y; M[2,2]=z; return M

def rot_x(a):
    c,s=math.cos(a),math.sin(a); return np.array([[1,0,0,0],[0,c,-s,0],[0,s,c,0],[0,0,0,1]],float)

def rot_y(a):
    c,s=math.cos(a),math.sin(a); return np.array([[c,0,s,0],[0,1,0,0],[-s,0,c,0],[0,0,0,1]],float)

def rot_z(a):
    c,s=math.cos(a),math.sin(a); return np.array([[c,-s,0,0],[s,c,0,0],[0,0,1,0],[0,0,0,1]],float)

def add(name, mesh, transform=None):
    m=mesh.copy()
    if transform is not None: m.apply_transform(transform)
    # Give every part a small neutral material. Viewer overrides color.
    try: m.visual.material = trimesh.visual.material.SimpleMaterial(diffuse=[180,180,180,255], name=name+'_mat')
    except Exception: pass
    scene.add_geometry(m, geom_name=name, node_name=name)

sphere=lambda sub=2: trimesh.creation.icosphere(subdivisions=sub, radius=1.0)
box=lambda ext: trimesh.creation.box(extents=ext)
cyl=lambda r,h,sec=16: trimesh.creation.cylinder(radius=r,height=h,sections=sec)
cone=lambda r,h,sec=16: trimesh.creation.cone(radius=r,height=h,sections=sec)

# Body proportions centered around origin, feet at y=0
add('Skin_Head', sphere(3), mat_translate(0,3.05,0) @ mat_scale(.62,.72,.58))
add('Skin_Ear_L', sphere(2), mat_translate(-.62,3.05,0) @ mat_scale(.12,.18,.12))
add('Skin_Ear_R', sphere(2), mat_translate(.62,3.05,0) @ mat_scale(.12,.18,.12))
add('Skin_Neck', cyl(.20,.34,16), mat_translate(0,2.35,0) @ rot_x(math.pi/2))
# torso/hips
add('BaseOutfit_Torso', sphere(2), mat_translate(0,1.78,0) @ mat_scale(.67,.78,.36))
add('BaseOutfit_Hips', sphere(2), mat_translate(0,1.12,0) @ mat_scale(.52,.40,.30))
# arms and hands
for side,x,sgn in [('L',-.73,-1),('R',.73,1)]:
    add(f'BaseOutfit_Arm_{side}', cyl(.19,.92,14), mat_translate(x,1.72,0) @ rot_z(sgn*math.radians(11)))
    add(f'Skin_Hand_{side}', sphere(2), mat_translate(x+sgn*.08,1.18,0) @ mat_scale(.18,.20,.16))
# legs boots
for side,x in [('L',-.28),('R',.28)]:
    add(f'BaseOutfit_Leg_{side}', cyl(.22,.88,14), mat_translate(x,.68,0) @ rot_x(math.pi/2))
    add(f'Boot_{side}', box([.42,.30,.64]), mat_translate(x,.12,.10))
# face
for side,x in [('L',-.22),('R',.22)]:
    add(f'EyeWhite_{side}', sphere(2), mat_translate(x,3.16,.52) @ mat_scale(.12,.15,.07))
    add(f'Iris_{side}', sphere(2), mat_translate(x,3.15,.58) @ mat_scale(.055,.075,.035))
    add(f'Brow_{side}', box([.23,.045,.035]), mat_translate(x,3.36,.56) @ rot_z(math.radians(3 if side=='L' else -3)))
add('Skin_Nose', sphere(2), mat_translate(0,3.02,.57) @ mat_scale(.07,.10,.06))
# smile as thin box segments
add('Mouth', box([.28,.035,.03]), mat_translate(0,2.84,.57))
# chest mark / accent
add('Accent_Chest', cyl(.13,.025,18), mat_translate(0,1.82,.38))

# Hair variants, all geometry loaded; viewer selects one group.
# afro cluster
for i,(x,y,z,s) in enumerate([
    (-.38,3.72,0,.30),(0,3.86,0,.34),(.38,3.72,0,.30),(-.54,3.48,0,.25),(.54,3.48,0,.25),(-.18,3.58,.35,.27),(.18,3.58,.35,.27),(0,3.54,-.32,.28)
]): add(f'Hair_afro_{i}', sphere(2), mat_translate(x,y,z) @ mat_scale(s,s*.9,s))
# braids cap + hanging braids
add('Hair_braids_cap', sphere(2), mat_translate(0,3.55,-.03) @ mat_scale(.58,.34,.56))
for i,x in enumerate([-.46,-.30,-.14,.14,.30,.46]):
    add(f'Hair_braids_{i}', cyl(.045,.70,10), mat_translate(x,3.18,-.18) @ rot_x(math.pi/2))
    add(f'Hair_braids_bead_{i}', sphere(1), mat_translate(x,2.84,-.18) @ mat_scale(.07,.07,.07))
# locs
add('Hair_locs_cap', sphere(2), mat_translate(0,3.56,-.03) @ mat_scale(.59,.34,.56))
for i,(x,z,l) in enumerate([(-.52,.05,.72),(-.38,.15,.85),(-.22,.20,.92),(.22,.20,.92),(.38,.15,.85),(.52,.05,.72)]):
    add(f'Hair_locs_{i}', cyl(.065,l,10), mat_translate(x,3.18,z) @ rot_x(math.pi/2))
# curls cluster
for i,(x,y,z,s) in enumerate([(-.46,3.60,.02,.24),(-.20,3.72,.10,.25),(.08,3.74,.10,.24),(.36,3.64,.06,.24),(-.54,3.38,.02,.20),(.52,3.38,.02,.20)]):
    add(f'Hair_curls_{i}', sphere(2), mat_translate(x,y,z) @ mat_scale(s,s,s))
# waves smooth cap
add('Hair_waves_0', sphere(3), mat_translate(0,3.55,-.08) @ mat_scale(.60,.36,.57))
# straight cap + side sheets
add('Hair_straight_cap', sphere(2), mat_translate(0,3.55,-.07) @ mat_scale(.60,.32,.57))
add('Hair_straight_L', box([.18,.95,.18]), mat_translate(-.50,3.02,-.03) @ rot_z(math.radians(-5)))
add('Hair_straight_R', box([.18,.95,.18]), mat_translate(.50,3.02,-.03) @ rot_z(math.radians(5)))

# Outfit-specific accessories
# explorer
add('Outfit_explorer_Pack', box([.72,.68,.22]), mat_translate(0,1.72,-.42))
add('Outfit_explorer_Belt', box([1.02,.10,.42]), mat_translate(0,1.18,.02))
# scientist coat panels
add('Outfit_scientist_Coat_L', box([.45,1.15,.10]), mat_translate(-.25,1.68,.36))
add('Outfit_scientist_Coat_R', box([.45,1.15,.10]), mat_translate(.25,1.68,.36))
add('Outfit_scientist_Badge', box([.16,.12,.03]), mat_translate(.27,1.94,.43))
# space pack + collar
add('Outfit_space_Pack', box([.80,.78,.28]), mat_translate(0,1.70,-.46))
add('Outfit_space_Collar', trimesh.creation.torus(major_radius=.34, minor_radius=.06, major_sections=18, minor_sections=8), mat_translate(0,2.23,0) @ rot_x(math.pi/2))
# chef apron + hat
add('Outfit_chef_Apron', box([.75,.90,.06]), mat_translate(0,1.62,.40))
add('Outfit_chef_HatBase', cyl(.42,.18,16), mat_translate(0,3.78,0) @ rot_x(math.pi/2))
for i,x in enumerate([-.24,0,.24]): add(f'Outfit_chef_HatPuff_{i}', sphere(2), mat_translate(x,4.02,0) @ mat_scale(.28,.25,.28))
# artist scarf + pouch
add('Outfit_artist_Scarf', trimesh.creation.torus(major_radius=.29, minor_radius=.045, major_sections=18, minor_sections=8), mat_translate(0,2.18,.02) @ rot_x(math.pi/2))
add('Outfit_artist_Pouch', box([.28,.28,.16]), mat_translate(.48,1.12,.25) @ rot_z(math.radians(-10)))

# Ground marker hidden by viewer if desired
add('Accent_FloorMarker', cyl(.62,.02,32), mat_translate(0,-.05,0) @ rot_x(math.pi/2))

# Export
from trimesh.exchange import gltf
blob=gltf.export_glb(scene, include_normals=True)
OUT.write_bytes(blob)
print('wrote', OUT, len(blob))
