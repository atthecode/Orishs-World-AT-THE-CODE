(() => {
  'use strict';

  const MODEL_URL = './assets/models/avatar-base.glb';
  const statusText = {
    loading: 'Loading local 3D model…',
    ready: 'Real 3D • local GLB',
    fallback: '3D unavailable • safe fallback active'
  };

  const DEFAULT_STATE = {
    skin: '#805141', hair: 'afro', hairColor: '#17120f', outfit: 'explorer', accent: '#17d7e8', angle: -8
  };

  let host, canvas, gl, program, parts = [], state = {...DEFAULT_STATE};
  let projection = ident(), view = ident(), raf = 0, ready = false, reducedMotion = false;
  let pose = 'idle', poseUntil = 0, poseStarted = 0, lastCapture = '';
  const POSE_DURATIONS = {wave:2200, celebrate:1900, power:1700, idle:0};
  let positionLoc, normalLoc, mvpLoc, modelLoc, colorLoc, cameraLoc;
  const camera = [0, 2.08, 7.2];

  function setStatus(kind) {
    const el = document.getElementById('avatar3DStatus');
    if (!el) return;
    el.textContent = statusText[kind] || kind;
    el.dataset.state = kind;
  }

  function init() {
    host = document.getElementById('avatarViewport');
    if (!host) return;
    reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
    canvas = document.createElement('canvas');
    canvas.className = 'avatar-webgl-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.setAttribute('data-renderer', 'at-the-code-webgl-glb');
    host.prepend(canvas);
    gl = canvas.getContext('webgl2', {alpha:true, antialias:true, premultipliedAlpha:true, preserveDrawingBuffer:true, powerPreference:'high-performance'});
    if (!gl) return fallback('WebGL2 is not supported on this device.');

    try {
      program = makeProgram(VERT, FRAG);
      positionLoc = gl.getAttribLocation(program, 'aPosition');
      normalLoc = gl.getAttribLocation(program, 'aNormal');
      mvpLoc = gl.getUniformLocation(program, 'uMVP');
      modelLoc = gl.getUniformLocation(program, 'uModel');
      colorLoc = gl.getUniformLocation(program, 'uColor');
      cameraLoc = gl.getUniformLocation(program, 'uCamera');
      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.CULL_FACE);
      gl.cullFace(gl.BACK);
      gl.clearColor(0,0,0,0);
      setStatus('loading');
      bindResize();
      loadGLB(MODEL_URL).then(onModel).catch(err => fallback(err?.message || 'Could not load local 3D model.'));
    } catch (err) {
      fallback(err?.message || 'Could not start the 3D renderer.');
    }
  }

  async function loadGLB(url) {
    const res = await fetch(url, {cache:'force-cache'});
    if (!res.ok) throw new Error(`3D model returned ${res.status}`);
    const buffer = await res.arrayBuffer();
    return parseGLB(buffer);
  }

  function parseGLB(buffer) {
    const dv = new DataView(buffer);
    if (dv.getUint32(0, true) !== 0x46546c67) throw new Error('Not a valid GLB file.');
    if (dv.getUint32(4, true) !== 2) throw new Error('Only GLB 2.0 is supported in this prototype.');
    let off = 12, json = null, bin = null;
    while (off < buffer.byteLength) {
      const len = dv.getUint32(off, true), type = dv.getUint32(off + 4, true); off += 8;
      const chunk = buffer.slice(off, off + len); off += len;
      if (type === 0x4E4F534A) json = JSON.parse(new TextDecoder().decode(chunk).replace(/\u0000+$/,'').trim());
      if (type === 0x004E4942) bin = chunk;
    }
    if (!json || !bin) throw new Error('GLB is missing its JSON or binary chunk.');
    return {json, bin};
  }

  function onModel({json, bin}) {
    parts = [];
    const nodes = json.nodes || [], meshes = json.meshes || [];
    const roots = (json.scenes?.[json.scene || 0]?.nodes || []).slice();
    const world = ident();
    roots.forEach(i => walkNode(i, world));

    function walkNode(index, parentMatrix) {
      const node = nodes[index] || {};
      const local = nodeMatrix(node);
      const worldMatrix = mul(parentMatrix, local);
      if (Number.isInteger(node.mesh) && meshes[node.mesh]) {
        const mesh = meshes[node.mesh];
        (mesh.primitives || []).forEach((primitive, primitiveIndex) => {
          if (primitive.mode !== undefined && primitive.mode !== 4) return;
          const posIndex = primitive.attributes?.POSITION;
          if (!Number.isInteger(posIndex) || !Number.isInteger(primitive.indices)) return;
          const positions = accessorData(json, bin, posIndex);
          const normals = Number.isInteger(primitive.attributes?.NORMAL) ? accessorData(json, bin, primitive.attributes.NORMAL) : null;
          const indices = accessorData(json, bin, primitive.indices);
          const part = createPart(node.name || mesh.name || `mesh-${node.mesh}-${primitiveIndex}`, positions, normals, indices, worldMatrix);
          parts.push(part);
        });
      }
      (node.children || []).forEach(child => walkNode(child, worldMatrix));
    }

    if (!parts.length) throw new Error('The local GLB contained no drawable character meshes.');
    ready = true;
    host.classList.add('webgl-ready');
    setStatus('ready');
    if (window.__orishAvatarState) state = {...state, ...window.__orishAvatarState};
    renderOnce();
    if (!reducedMotion) loop();
    window.dispatchEvent(new CustomEvent('orish-avatar:3d-ready', {detail:{parts:parts.length, model:MODEL_URL}}));
  }

  function accessorData(json, bin, accessorIndex) {
    const a = json.accessors[accessorIndex], bv = json.bufferViews[a.bufferView];
    if (!a || !bv) throw new Error('GLB accessor is invalid.');
    const offset = (bv.byteOffset || 0) + (a.byteOffset || 0);
    const components = {SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT4:16}[a.type] || 1;
    const length = a.count * components;
    const ctor = componentCtor(a.componentType);
    if (bv.byteStride && bv.byteStride !== ctor.BYTES_PER_ELEMENT * components) {
      const out = new ctor(length), dv = new DataView(bin);
      const read = componentReader(a.componentType);
      for (let i=0;i<a.count;i++) for (let c=0;c<components;c++) out[i*components+c] = read(dv, offset + i*bv.byteStride + c*ctor.BYTES_PER_ELEMENT);
      return out;
    }
    return new ctor(bin.slice(offset, offset + length * ctor.BYTES_PER_ELEMENT));
  }

  function componentCtor(type) {
    return ({5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array})[type] || Float32Array;
  }
  function componentReader(type) {
    return ({
      5120:(d,o)=>d.getInt8(o), 5121:(d,o)=>d.getUint8(o), 5122:(d,o)=>d.getInt16(o,true),
      5123:(d,o)=>d.getUint16(o,true), 5125:(d,o)=>d.getUint32(o,true), 5126:(d,o)=>d.getFloat32(o,true)
    })[type] || ((d,o)=>d.getFloat32(o,true));
  }

  function createPart(name, positions, normals, indices, nodeMatrixValue) {
    const vao = gl.createVertexArray(); gl.bindVertexArray(vao);
    const pbo = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, pbo); gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLoc); gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
    const nbo = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, nbo); gl.bufferData(gl.ARRAY_BUFFER, normals || makeFlatNormals(positions, indices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(normalLoc); gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
    const ibo = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    gl.bindVertexArray(null);
    const indexType = indices instanceof Uint32Array ? gl.UNSIGNED_INT : indices instanceof Uint16Array ? gl.UNSIGNED_SHORT : gl.UNSIGNED_BYTE;
    return {name, vao, count:indices.length, indexType, nodeMatrix:nodeMatrixValue};
  }

  function makeFlatNormals(positions, indices) {
    const out = new Float32Array(positions.length);
    for (let i=0;i<indices.length;i+=3) {
      const ia=indices[i]*3, ib=indices[i+1]*3, ic=indices[i+2]*3;
      const ax=positions[ia], ay=positions[ia+1], az=positions[ia+2];
      const ux=positions[ib]-ax, uy=positions[ib+1]-ay, uz=positions[ib+2]-az;
      const vx=positions[ic]-ax, vy=positions[ic+1]-ay, vz=positions[ic+2]-az;
      let nx=uy*vz-uz*vy, ny=uz*vx-ux*vz, nz=ux*vy-uy*vx; const l=Math.hypot(nx,ny,nz)||1; nx/=l;ny/=l;nz/=l;
      [ia,ib,ic].forEach(j=>{out[j]+=nx;out[j+1]+=ny;out[j+2]+=nz;});
    }
    for(let i=0;i<out.length;i+=3){const l=Math.hypot(out[i],out[i+1],out[i+2])||1;out[i]/=l;out[i+1]/=l;out[i+2]/=l;}
    return out;
  }

  function renderOnce(time=0) {
    if (!ready || !gl || document.hidden) return;
    resize();
    if (pose !== 'idle' && poseUntil && time >= poseUntil) { pose='idle'; poseUntil=0; poseStarted=0; }
    const bob = reducedMotion ? 0 : Math.sin(time * 0.0022) * 0.025;
    const breathe = reducedMotion ? 1 : 1 + Math.sin(time * 0.0018) * 0.0045;
    let modelBase = mul(translate(0,bob,0), rotateY((Number(state.angle)||0) * Math.PI/180));
    modelBase = mul(modelBase, scale(breathe,1,breathe));
    const pv = mul(projection, view);
    gl.viewport(0,0,canvas.width,canvas.height); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); gl.useProgram(program);
    gl.uniform3fv(cameraLoc, camera);
    for (const part of parts) {
      if (!visible(part.name)) continue;
      const animated = mul(animationTransform(part.name, time), part.nodeMatrix);
      const model = mul(modelBase, animated);
      const mvp = mul(pv, model);
      gl.uniformMatrix4fv(mvpLoc, false, mvp);
      gl.uniformMatrix4fv(modelLoc, false, model);
      gl.uniform3fv(colorLoc, rgb(colorFor(part.name)));
      gl.bindVertexArray(part.vao);
      gl.drawElements(gl.TRIANGLES, part.count, part.indexType, 0);
    }
    gl.bindVertexArray(null);
  }

  function animationTransform(name, time) {
    if (reducedMotion) return ident();
    const t=time/1000, deg=Math.PI/180;
    let m=ident();
    const headPart = name.startsWith('Skin_Head') || name.startsWith('Skin_Ear') || name.startsWith('Skin_Nose') || name.startsWith('EyeWhite_') || name.startsWith('Iris_') || name.startsWith('Brow_') || name === 'Mouth' || name.startsWith('Hair_') || name.startsWith('Outfit_chef_Hat');
    if (headPart) {
      const sway=Math.sin(t*0.78)*0.8*deg;
      m=mul(aroundPivot([0,2.42,0], rotateZ(sway)),m);
    }
    if (name.startsWith('EyeWhite_') || name.startsWith('Iris_')) {
      const phase=(time%4300)/4300;
      const blink=phase>0.94 ? Math.sin(((phase-.94)/.06)*Math.PI) : 0;
      if (blink>0) {
        const x=name.endsWith('_L')?-.22:.22;
        m=mul(aroundPivot([x,3.16,.54], scale(1,Math.max(.08,1-blink*.92),1)),m);
      }
    }
    const isLeftArm=name==='BaseOutfit_Arm_L'||name==='Skin_Hand_L';
    const isRightArm=name==='BaseOutfit_Arm_R'||name==='Skin_Hand_R';
    const idleSwing=Math.sin(t*1.18)*1.8*deg;
    if (isLeftArm) m=mul(aroundPivot([-.73,2.12,0],rotateZ(idleSwing)),m);
    if (isRightArm) m=mul(aroundPivot([.73,2.12,0],rotateZ(-idleSwing)),m);

    if (pose !== 'idle') {
      const elapsed=Math.max(0,time-poseStarted), duration=Math.max(1,(poseUntil||time)-poseStarted);
      const envelope=Math.sin(Math.min(1,elapsed/duration)*Math.PI);
      if (pose==='wave' && isRightArm) {
        const wave=(108 + Math.sin(t*8.5)*12)*deg*envelope;
        m=mul(aroundPivot([.73,2.12,0],rotateZ(wave)),m);
      } else if (pose==='celebrate') {
        if (isLeftArm) m=mul(aroundPivot([-.73,2.12,0],rotateZ(-118*deg*envelope)),m);
        if (isRightArm) m=mul(aroundPivot([.73,2.12,0],rotateZ(118*deg*envelope)),m);
        if (headPart) m=mul(aroundPivot([0,2.42,0],rotateZ(Math.sin(t*5)*2.5*deg*envelope)),m);
      } else if (pose==='power') {
        if (isLeftArm) m=mul(aroundPivot([-.73,2.12,0],rotateZ(18*deg*envelope)),m);
        if (isRightArm) m=mul(aroundPivot([.73,2.12,0],rotateZ(-18*deg*envelope)),m);
        if (name==='BaseOutfit_Torso'||name==='BaseOutfit_Hips'||name.startsWith('Outfit_')) m=mul(aroundPivot([0,1.2,0],scale(1+0.025*envelope,1+0.018*envelope,1+0.025*envelope)),m);
      }
    }
    return m;
  }

  function setPose(next='idle', duration) {
    const allowed=['idle','wave','celebrate','power'];
    pose=allowed.includes(next)?next:'idle';
    const now=performance.now(); poseStarted=now;
    poseUntil=pose==='idle'?0:now+(Number(duration)||POSE_DURATIONS[pose]||1800);
    renderOnce(now);
    window.dispatchEvent(new CustomEvent('orish-avatar:pose-change',{detail:{pose}}));
  }

  function capture() {
    if (!ready || !canvas) return '';
    try {
      renderOnce(performance.now());
      lastCapture=canvas.toDataURL('image/png');
      return lastCapture;
    } catch (err) {
      console.warn('[Orish Avatar 3D] Could not capture local avatar preview.', err);
      return '';
    }
  }

  function loop(t=0) {
    cancelAnimationFrame(raf);
    const tick = time => { renderOnce(time); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
  }

  function visible(name) {
    if (name.startsWith('Hair_')) return name.startsWith(`Hair_${state.hair}_`);
    if (name.startsWith('Outfit_')) return name.startsWith(`Outfit_${state.outfit}_`);
    if (name === 'Accent_FloorMarker') return false;
    return true;
  }

  function colorFor(name) {
    if (name.startsWith('Skin_')) return state.skin;
    if (name.startsWith('Hair_') || name.startsWith('Brow_')) return state.hairColor;
    if (name.startsWith('EyeWhite_')) return '#f9fbff';
    if (name.startsWith('Iris_')) return '#3a241c';
    if (name === 'Mouth') return '#6f3341';
    if (name.startsWith('Boot_')) return '#06101e';
    if (name.startsWith('Accent_')) return state.accent;
    if (name.startsWith('BaseOutfit_')) return '#0d263d';
    if (name.startsWith('Outfit_scientist_Coat')) return '#e8f4f4';
    if (name.startsWith('Outfit_scientist_Badge')) return state.accent;
    if (name.startsWith('Outfit_chef_Apron') || name.startsWith('Outfit_chef_Hat')) return '#f3f2e9';
    if (name.startsWith('Outfit_artist_Scarf')) return state.accent;
    if (name.startsWith('Outfit_artist_Pouch')) return '#8f5d35';
    if (name.startsWith('Outfit_explorer_Belt')) return state.accent;
    if (name.startsWith('Outfit_explorer_Pack')) return '#3b2b2a';
    if (name.startsWith('Outfit_space_')) return name.includes('Collar') ? state.accent : '#152d4a';
    return state.accent;
  }

  function update(next) {
    state = {...state, ...(next || {})};
    if (ready && reducedMotion) renderOnce(performance.now());
  }

  function bindResize() {
    view = lookAt(camera, [0,2.05,0], [0,1,0]);
    const ro = new ResizeObserver(() => { resize(); renderOnce(performance.now()); });
    ro.observe(host);
    window.addEventListener('orientationchange', () => setTimeout(()=>{resize();renderOnce(performance.now());},100));
  }

  function resize() {
    if (!canvas || !host) return;
    const r = host.getBoundingClientRect(); const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w=Math.max(1,Math.round(r.width*dpr)), h=Math.max(1,Math.round(r.height*dpr));
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;canvas.style.width=`${r.width}px`;canvas.style.height=`${r.height}px`;projection=perspective(31*Math.PI/180,r.width/Math.max(1,r.height),.1,50);}
  }

  function fallback(message) {
    ready=false; host?.classList.remove('webgl-ready'); host?.classList.add('webgl-fallback'); setStatus('fallback');
    const note=document.getElementById('avatar3DNote'); if(note) note.textContent=`${message} The original AT THE CODE fallback character is still usable.`;
    console.warn('[Orish Avatar 3D]', message);
  }

  function makeProgram(vsSource, fsSource) {
    const p=gl.createProgram(), vs=shader(gl.VERTEX_SHADER,vsSource), fs=shader(gl.FRAGMENT_SHADER,fsSource);
    gl.attachShader(p,vs);gl.attachShader(p,fs);gl.linkProgram(p);
    if(!gl.getProgramParameter(p,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p)||'3D shader link failed');
    return p;
  }
  function shader(type, source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s)||'3D shader compile failed');return s;}
  function rgb(hex){const h=(hex||'#17d7e8').replace('#','');const n=parseInt(h.length===3?h.split('').map(x=>x+x).join(''):h,16);return [((n>>16)&255)/255,((n>>8)&255)/255,(n&255)/255];}

  function ident(){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);}
  function mul(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++){o[c*4+r]=a[0*4+r]*b[c*4+0]+a[1*4+r]*b[c*4+1]+a[2*4+r]*b[c*4+2]+a[3*4+r]*b[c*4+3];}return o;}
  function translate(x,y,z){const m=ident();m[12]=x;m[13]=y;m[14]=z;return m;}
  function rotateY(a){const c=Math.cos(a),s=Math.sin(a);return new Float32Array([c,0,-s,0,0,1,0,0,s,0,c,0,0,0,0,1]);}
  function rotateZ(a){const c=Math.cos(a),s=Math.sin(a);return new Float32Array([c,s,0,0,-s,c,0,0,0,0,1,0,0,0,0,1]);}
  function scale(x,y,z){const m=ident();m[0]=x;m[5]=y;m[10]=z;return m;}
  function aroundPivot(pivot, transform){return mul(mul(translate(pivot[0],pivot[1],pivot[2]),transform),translate(-pivot[0],-pivot[1],-pivot[2]));}
  function perspective(fovy,aspect,near,far){const f=1/Math.tan(fovy/2),nf=1/(near-far);return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]);}
  function lookAt(eye,target,up){const z=norm(sub(eye,target)),x=norm(cross(up,z)),y=cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]);}
  function sub(a,b){return [a[0]-b[0],a[1]-b[1],a[2]-b[2]];} function dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];}
  function cross(a,b){return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];} function norm(v){const l=Math.hypot(...v)||1;return v.map(x=>x/l);}
  function nodeMatrix(node){if(node.matrix?.length===16)return new Float32Array(node.matrix);let m=ident();if(node.translation)m=mul(m,translate(...node.translation));if(node.rotation){const[x,y,z,w]=node.rotation;const xx=x*x,yy=y*y,zz=z*z,xy=x*y,xz=x*z,yz=y*z,wx=w*x,wy=w*y,wz=w*z;m=mul(m,new Float32Array([1-2*(yy+zz),2*(xy+wz),2*(xz-wy),0,2*(xy-wz),1-2*(xx+zz),2*(yz+wx),0,2*(xz+wy),2*(yz-wx),1-2*(xx+yy),0,0,0,0,1]));}if(node.scale){const s=ident();s[0]=node.scale[0];s[5]=node.scale[1];s[10]=node.scale[2];m=mul(m,s);}return m;}

  const VERT=`#version 300 es\nprecision highp float;\nin vec3 aPosition;\nin vec3 aNormal;\nuniform mat4 uMVP;\nuniform mat4 uModel;\nout vec3 vNormal;\nout vec3 vWorld;\nvoid main(){vec4 world=uModel*vec4(aPosition,1.0);vWorld=world.xyz;vNormal=mat3(uModel)*aNormal;gl_Position=uMVP*vec4(aPosition,1.0);}`;
  const FRAG=`#version 300 es\nprecision highp float;\nin vec3 vNormal;\nin vec3 vWorld;\nuniform vec3 uColor;\nuniform vec3 uCamera;\nout vec4 outColor;\nvoid main(){vec3 n=normalize(vNormal);vec3 l=normalize(vec3(-0.55,0.9,0.75));float d=max(dot(n,l),0.0);vec3 v=normalize(uCamera-vWorld);float rim=pow(1.0-max(dot(n,v),0.0),2.2);vec3 col=uColor*(0.48+0.62*d)+vec3(0.10,0.18,0.22)*rim;outColor=vec4(col,1.0);}`;

  window.addEventListener('orish-avatar:update', e => update(e.detail));
  window.addEventListener('DOMContentLoaded', init, {once:true});
  window.addEventListener('orish-avatar:pose', e => setPose(e.detail?.pose || 'idle', e.detail?.duration));
  window.OrishAvatar3D = {update, setPose, capture, get pose(){return pose;}, get ready(){return ready;}, get lastCapture(){return lastCapture;}, modelUrl:MODEL_URL};
})();
