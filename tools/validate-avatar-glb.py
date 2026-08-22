from pathlib import Path
import json, struct, sys

root=Path(__file__).resolve().parents[1]
p=root/'assets/models/avatar-base.glb'
b=p.read_bytes()
assert len(b) >= 20
magic, version, total = struct.unpack_from('<III', b, 0)
assert magic == 0x46546C67, 'missing glTF magic'
assert version == 2, f'expected GLB 2.0, got {version}'
assert total == len(b), 'header length mismatch'
off=12; chunks={}
while off < len(b):
    length, ctype = struct.unpack_from('<II', b, off); off += 8
    chunks[ctype] = b[off:off+length]; off += length
assert 0x4E4F534A in chunks and 0x004E4942 in chunks, 'JSON/BIN chunks required'
tree=json.loads(chunks[0x4E4F534A].decode('utf-8').rstrip(' \x00'))
names={n.get('name','') for n in tree.get('nodes',[])}
required=['Skin_Head','BaseOutfit_Torso','Accent_Chest','Hair_afro_0','Hair_braids_cap','Hair_locs_cap','Hair_curls_0','Hair_waves_0','Hair_straight_cap','Outfit_explorer_Pack','Outfit_scientist_Coat_L','Outfit_space_Pack','Outfit_chef_Apron','Outfit_artist_Scarf']
missing=[x for x in required if x not in names]
assert not missing, f'missing nodes: {missing}'
print(f'PASS GLB2 {len(b)} bytes, {len(tree.get("nodes",[]))} nodes, {len(tree.get("meshes",[]))} meshes')
