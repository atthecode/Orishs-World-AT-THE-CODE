#!/usr/bin/env python3
"""Generate the owned Orish's World Explorer GLB without paid services.

The output is a genuine multi-mesh glTF 2.0 character designed for the existing
local WebGL renderer. Geometry is authored procedurally so it remains editable,
repeatable and free of third-party runtime dependencies.
"""
from __future__ import annotations

import json, math, struct
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "models" / "explorer-premium-v1.glb"
parts: list[tuple[str, np.ndarray, np.ndarray, np.ndarray]] = []


def add(name, verts, norms, faces):
    parts.append((name, np.asarray(verts, np.float32), np.asarray(norms, np.float32), np.asarray(faces, np.uint32).reshape(-1)))


def sphere(name, center, radii, seg=24, rings=16):
    c=np.array(center,float); r=np.array(radii,float); v=[]; n=[]
    for iy in range(rings+1):
        p=math.pi*iy/rings; sp,cp=math.sin(p),math.cos(p)
        for ix in range(seg):
            t=2*math.pi*ix/seg; q=np.array([sp*math.cos(t),cp,sp*math.sin(t)])
            v.append(c+q*r); nn=q/np.maximum(r,1e-6); n.append(nn/np.linalg.norm(nn))
    f=[]
    for iy in range(rings):
        for ix in range(seg):
            a=iy*seg+ix; b=iy*seg+(ix+1)%seg; d=(iy+1)*seg+ix; e=(iy+1)*seg+(ix+1)%seg
            f += [a,d,b,b,d,e]
    add(name,v,n,f)


def cylinder(name, a, b, radius, seg=16, squash=(1,1)):
    a=np.array(a,float); b=np.array(b,float); axis=b-a; length=np.linalg.norm(axis); w=axis/length
    ref=np.array([0.,1.,0.]) if abs(w[1])<.88 else np.array([1.,0.,0.])
    u=np.cross(w,ref); u/=np.linalg.norm(u); vv=np.cross(w,u)
    verts=[]; norms=[]
    for p in (a,b):
        for i in range(seg):
            t=2*math.pi*i/seg; radial=u*math.cos(t)*squash[0]+vv*math.sin(t)*squash[1]
            verts.append(p+radial*radius); norms.append(radial/np.linalg.norm(radial))
    faces=[]
    for i in range(seg):
        j=(i+1)%seg; faces += [i,seg+i,j,j,seg+i,seg+j]
    add(name,verts,norms,faces)


def capsule(name,a,b,radius,seg=18):
    cylinder(name,a,b,radius,seg)
    sphere(name+"_A",a,(radius,radius,radius),seg,10)
    sphere(name+"_B",b,(radius,radius,radius),seg,10)


def tube(name, points, radius, seg=12):
    for i in range(len(points)-1):
        cylinder(f"{name}_{i:02d}",points[i],points[i+1],radius,seg)
    sphere(name+"_Tip",points[-1],(radius*1.04,)*3,seg,8)


def box(name, center, size):
    cx,cy,cz=center; sx,sy,sz=[x/2 for x in size]
    verts=[]; norms=[]; faces=[]
    sides=[((1,0,0),[(sx,-sy,-sz),(sx,-sy,sz),(sx,sy,sz),(sx,sy,-sz)]),
           ((-1,0,0),[(-sx,-sy,sz),(-sx,-sy,-sz),(-sx,sy,-sz),(-sx,sy,sz)]),
           ((0,1,0),[(-sx,sy,-sz),(sx,sy,-sz),(sx,sy,sz),(-sx,sy,sz)]),
           ((0,-1,0),[(-sx,-sy,sz),(sx,-sy,sz),(sx,-sy,-sz),(-sx,-sy,-sz)]),
           ((0,0,1),[(-sx,-sy,sz),(-sx,sy,sz),(sx,sy,sz),(sx,-sy,sz)]),
           ((0,0,-1),[(sx,-sy,-sz),(sx,sy,-sz),(-sx,sy,-sz),(-sx,-sy,-sz)])]
    for normal,quad in sides:
        base=len(verts); verts += [(cx+x,cy+y,cz+z) for x,y,z in quad]; norms += [normal]*4; faces += [base,base+1,base+2,base,base+2,base+3]
    add(name,verts,norms,faces)


def torus_arc(name, center, major, minor, start, end, axis="z", steps=12, seg=10):
    pts=[]
    cx,cy,cz=center
    for i in range(steps+1):
        t=start+(end-start)*i/steps
        if axis=="z": pts.append((cx+major*math.cos(t),cy+major*math.sin(t),cz))
        else: pts.append((cx+major*math.cos(t),cy,cz+major*math.sin(t)))
    tube(name,pts,minor,seg)


def build_body():
    # Head and face: childlike but anatomically coherent.
    sphere("Skin_Head",(0,2.82,.02),(.56,.68,.50),28,20)
    sphere("Skin_Ear_L",(-.57,2.83,.01),(.12,.19,.09),18,12); sphere("Skin_Ear_R",(.57,2.83,.01),(.12,.19,.09),18,12)
    sphere("Skin_Nose",(0,2.78,.49),(.105,.14,.10),18,12)
    sphere("Skin_Neck",(0,2.20,0),(.20,.24,.19),18,12)
    # Eyes, pupils, brows and layered lips.
    for side,x in (("L",-.205),("R",.205)):
        sphere(f"EyeWhite_{side}",(x,2.99,.455),(.16,.105,.055),22,14)
        sphere(f"Iris_{side}",(x,2.985,.508),(.064,.064,.025),18,12)
        sphere(f"Pupil_{side}",(x,2.985,.528),(.025,.027,.012),14,10)
        torus_arc(f"Brow_{side}",(x,3.18,.49),.155,.025,.22,math.pi-.22,"z",10,8)
    torus_arc("Mouth",(0,2.60,.512),.18,.028,math.pi+.23,2*math.pi-.23,"z",14,8)
    torus_arc("Mouth_SmileHighlight",(0,2.615,.532),.12,.012,math.pi+.35,2*math.pi-.35,"z",10,7)

    # Tailored jacket and trousers.
    sphere("BaseOutfit_Torso",(0,1.72,0),(.58,.66,.36),24,16)
    sphere("BaseOutfit_Hips",(0,1.14,0),(.47,.28,.32),22,14)
    box("Accent_JacketZip",(0,1.78,.365),(.045,1.02,.035))
    torus_arc("Accent_Collar_L",(-.19,2.16,.34),.26,.035,3.35,4.56,"z",8,8)
    torus_arc("Accent_Collar_R",(.19,2.16,.34),.26,.035,4.86,6.07,"z",8,8)
    sphere("Accent_MissionPatch",(-.34,1.84,.345),(.12,.12,.025),16,10)

    # Articulated limbs with natural bends.
    arms={"L":[(-.47,2.02,0),(-.72,1.60,.04),(-.62,1.18,.13)],"R":[(.47,2.02,0),(.72,1.60,.04),(.62,1.18,.13)]}
    for side,p in arms.items():
        capsule(f"BaseOutfit_UpperArm_{side}",p[0],p[1],.17)
        capsule(f"BaseOutfit_Forearm_{side}",p[1],p[2],.145)
        sphere(f"Skin_Hand_{side}",p[2],(.16,.20,.12),18,12)
        s=-1 if side=="L" else 1
        for i in range(4):
            x=p[2][0]+s*(-.09+.06*i); capsule(f"Skin_Finger_{side}_{i}",(x,p[2][1]-.10,.15),(x,p[2][1]-.27,.16),.025,10)
        capsule(f"Skin_Thumb_{side}",(p[2][0]-s*.10,p[2][1]-.03,.13),(p[2][0]-s*.17,p[2][1]-.14,.14),.032,10)
    for side,x in (("L",-.25),("R",.25)):
        capsule(f"BaseOutfit_Leg_{side}",(x,1.06,0),(x,.35,.015),.19,20)
        sphere(f"Boot_{side}",(x,.16,.13),(.25,.17,.38),22,14)
        box(f"Accent_ShoeStripe_{side}",(x,.18,.49),(.28,.055,.035))
    # Backpack and straps.
    sphere("Outfit_explorer_Pack",(0,1.72,-.37),(.43,.57,.19),22,14)
    tube("Accent_PackStrap_L",[(-.35,2.08,.23),(-.48,1.68,.29),(-.35,1.28,.25)],.035,10)
    tube("Accent_PackStrap_R",[(.35,2.08,.23),(.48,1.68,.29),(.35,1.28,.25)],.035,10)
    box("Outfit_explorer_Belt",(0,1.18,.31),(.84,.09,.08))


def build_hair():
    # Shoulder-length locs: individually modelled, parted and tapered.
    sphere("Hair_locs_Scalp",(0,3.22,-.01),(.55,.31,.48),28,16)
    roots=[]
    for row,(y,z,count,spread) in enumerate([(3.42,.02,7,.42),(3.34,-.20,8,.50),(3.22,-.34,8,.53)]):
        for i in range(count):
            x=-spread+2*spread*(i/(count-1)); roots.append((x,y,z,row,i))
    for k,(x,y,z,row,i) in enumerate(roots):
        side=1 if x>=0 else -1
        endx=x+side*(.08+.10*row); endy=2.36-(k%3)*.05; endz=.03-.05*row
        pts=[(x,y,z),(x+side*.05,y-.25,z+.04),(x+side*.10,y-.55,z+.03),(endx,endy,endz)]
        tube(f"Hair_locs_Loc_{k:02d}",pts,.043+(k%2)*.006,10)
        if k%5==0: cylinder(f"Accent_LocCuff_{k:02d}",pts[-2],pts[-1],.054,10)

    # Rounded afro.
    sphere("Hair_afro_Base",(0,3.34,-.03),(.61,.43,.53),28,18)
    for k in range(18):
        t=2*math.pi*k/18; x=.52*math.cos(t); z=-.02+.38*math.sin(t); y=3.37+.10*math.sin(t*2)
        sphere(f"Hair_afro_Curl_{k:02d}",(x,y,z),(.16,.17,.15),16,10)

    # Beaded braids with neat scalp rows.
    for k,x in enumerate(np.linspace(-.43,.43,9)):
        tube(f"Hair_braids_Row_{k:02d}",[(x,3.44,.02),(x*.9,3.25,-.25),(x*1.12,2.83,-.31),(x*1.20,2.40,-.04)],.027,9)
        for j,coly in enumerate((2.67,2.54,2.42)):
            sphere(f"Hair_braids_Bead_{k:02d}_{j}",(x*1.18,coly,-.05),(.042,.055,.042),10,8)

    # Round curls, constructed as ringlets.
    sphere("Hair_curls_Base",(0,3.30,-.06),(.56,.33,.49),24,14)
    for k in range(20):
        t=2*math.pi*k/20; center=(.49*math.cos(t),3.30+.12*math.sin(2*t),-.02+.38*math.sin(t))
        torus_arc(f"Hair_curls_Ring_{k:02d}",center,.105,.038,0,2*math.pi,"z",12,8)

    # Close waves as a fitted, layered cap.
    sphere("Hair_waves_Cap",(0,3.25,-.02),(.555,.295,.49),28,16)
    for k in range(5):
        torus_arc(f"Hair_waves_Line_{k}",(0,3.30-k*.055,.42-k*.015),.34-k*.025,.012,.15,math.pi-.15,"z",16,7)

    # Straight side-swept layered hair.
    sphere("Hair_straight_Cap",(0,3.29,-.05),(.57,.33,.50),26,16)
    for k,x in enumerate(np.linspace(-.50,.48,14)):
        sweep=.18*(1-(x+.5)); tube(f"Hair_straight_Layer_{k:02d}",[(x,3.46,-.01),(x+sweep,3.18,.32),(x+sweep*.6,2.63,.16)],.038,10)


def build_outfits():
    # Real geometry additions for named outfit families.
    box("Outfit_scientist_Coat",(0,1.69,.37),(.93,1.05,.055)); box("Outfit_scientist_Badge",(.28,1.91,.415),(.18,.12,.025))
    torus_arc("Outfit_space_Collar",(0,2.12,.10),.38,.075,.05,math.pi-.05,"z",16,10)
    box("Outfit_space_ChestPanel",(0,1.71,.385),(.44,.25,.06))
    sphere("Outfit_chef_Apron",(0,1.62,.39),(.42,.53,.055),20,14)
    sphere("Outfit_chef_Hat",(0,3.62,-.02),(.47,.30,.40),22,14)
    tube("Outfit_artist_Scarf",[(-.34,2.10,.26),(0,1.98,.42),(.34,2.10,.26)],.06,12)
    sphere("Outfit_artist_Pouch",(.39,1.16,.31),(.17,.20,.10),18,12)


def coalesce_parts():
    """Merge authored sub-parts into mobile-friendly named draw groups."""
    global parts
    rules=[
        "Hair_locs","Hair_afro","Hair_braids","Hair_curls","Hair_waves","Hair_straight",
        "Accent_LocCuff","Accent_PackStrap","Accent_Collar","Skin_Head","Skin_Ear_L","Skin_Ear_R",
        "Skin_Nose","Skin_Neck","EyeWhite_L","EyeWhite_R","Iris_L","Iris_R","Pupil_L","Pupil_R",
        "Brow_L","Brow_R","Mouth_SmileHighlight","Mouth","BaseOutfit_Torso","BaseOutfit_Hips",
        "BaseOutfit_UpperArm_L","BaseOutfit_UpperArm_R","BaseOutfit_Forearm_L","BaseOutfit_Forearm_R",
        "Skin_Hand_L","Skin_Hand_R","Skin_Finger_L","Skin_Finger_R","Skin_Thumb_L","Skin_Thumb_R",
        "BaseOutfit_Leg_L","BaseOutfit_Leg_R","Boot_L","Boot_R","Accent_ShoeStripe_L","Accent_ShoeStripe_R",
        "Accent_JacketZip","Accent_MissionPatch","Outfit_explorer_Pack","Outfit_explorer_Belt",
        "Outfit_scientist_Coat","Outfit_scientist_Badge","Outfit_space_Collar","Outfit_space_ChestPanel",
        "Outfit_chef_Apron","Outfit_chef_Hat","Outfit_artist_Scarf","Outfit_artist_Pouch"
    ]
    def key(name):
        for r in rules:
            if name.startswith(r): return r
        return name
    groups={}
    for name,v,n,f in parts:
        k=key(name); groups.setdefault(k,[]).append((v,n,f))
    merged=[]
    for k,chunks in groups.items():
        vo=[]; no=[]; fo=[]; off=0
        for v,n,f in chunks:
            vo.append(v); no.append(n); fo.append(f+off); off+=len(v)
        merged.append((k,np.concatenate(vo),np.concatenate(no),np.concatenate(fo)))
    parts=merged


def pack_glb(path: Path):
    blob=bytearray(); views=[]; accessors=[]; meshes=[]; nodes=[]
    def align4():
        while len(blob)%4: blob.append(0)
    def put(arr,target):
        align4(); offset=len(blob); raw=arr.tobytes(); blob.extend(raw)
        views.append({"buffer":0,"byteOffset":offset,"byteLength":len(raw),"target":target}); return len(views)-1
    for name,verts,norms,indices in parts:
        pv=put(verts.astype('<f4'),34962); nv=put(norms.astype('<f4'),34962)
        use16=int(indices.max(initial=0))<65536; idx=indices.astype('<u2' if use16 else '<u4'); iv=put(idx,34963)
        pacc=len(accessors); accessors.append({"bufferView":pv,"componentType":5126,"count":len(verts),"type":"VEC3","min":verts.min(0).tolist(),"max":verts.max(0).tolist()})
        nacc=len(accessors); accessors.append({"bufferView":nv,"componentType":5126,"count":len(norms),"type":"VEC3"})
        iacc=len(accessors); accessors.append({"bufferView":iv,"componentType":5123 if use16 else 5125,"count":len(idx),"type":"SCALAR"})
        meshes.append({"name":name,"primitives":[{"attributes":{"POSITION":pacc,"NORMAL":nacc},"indices":iacc,"mode":4}]})
        nodes.append({"name":name,"mesh":len(meshes)-1})
    doc={"asset":{"version":"2.0","generator":"AT THE CODE owned procedural character pipeline"},"scene":0,"scenes":[{"name":"Explorer","nodes":list(range(len(nodes)))}],"nodes":nodes,"meshes":meshes,"buffers":[{"byteLength":len(blob)}],"bufferViews":views,"accessors":accessors,"extras":{"character":"explorer-01","quality":"premium-v1","openPipeline":True,"prototype":False}}
    js=json.dumps(doc,separators=(',',':')).encode(); js+=b' ' *((4-len(js)%4)%4); align4()
    total=12+8+len(js)+8+len(blob)
    out=struct.pack('<III',0x46546C67,2,total)+struct.pack('<II',len(js),0x4E4F534A)+js+struct.pack('<II',len(blob),0x004E4942)+blob
    path.parent.mkdir(parents=True,exist_ok=True); path.write_bytes(out)
    return {"path":str(path),"bytes":len(out),"meshes":len(meshes),"vertices":sum(len(p[1]) for p in parts),"triangles":sum(len(p[3])//3 for p in parts)}


if __name__ == "__main__":
    build_body(); build_hair(); build_outfits(); coalesce_parts(); report=pack_glb(OUT)
    print(json.dumps(report,indent=2))
