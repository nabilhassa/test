// Interactive 3D "MN" monogram with the ringed planet from the XMotion logo.
// Neon copper edges + bloom, a star field, and rotation that follows the pointer.
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

import { pieces, order, SIZE, planet as P } from '../data/monogram';

// Monogram units → 3D units (centre of the mark at the origin, y up)
const U = 380;
const to3 = (x: number, y: number) => new THREE.Vector2((x - SIZE.w / 2) / U, (SIZE.h / 2 - y) / U);

export function initMonogram(canvas: HTMLCanvasElement, opts: { bg: string; mobile: boolean; reduced: boolean }) {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  } catch {
    return null;
  }
  const bg = new THREE.Color(opts.bg);
  // The clear colour is encoded again by the output pass, so pre-convert it once more to match the page exactly
  renderer.setClearColor(bg.clone().convertSRGBToLinear(), 1);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, opts.mobile ? 1.5 : 2));
  renderer.toneMapping = THREE.NoToneMapping;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
  camera.position.set(0, 0, 7.2);

  const COPPER = new THREE.Color('#ff7a2f');
  const COPPER_LIGHT = new THREE.Color('#ffb27a');
  const TEAL = new THREE.Color('#22d3c5');

  // ---- Monogram: dark stone body + glowing gold outline ----
  const GOLD = new THREE.Color('#ffbe6a');
  const logo = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color: '#1b1820', metalness: 0.25, roughness: 0.85, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
  const edgeMat = new THREE.LineBasicMaterial({ color: GOLD.clone().multiplyScalar(2.8), toneMapped: false });
  for (const k of order) {
    const shape = new THREE.Shape(pieces[k].map(([x, y]) => to3(x, y)));
    const depth = 0.22;
    const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
    // the crossbar/diagonal shape sits slightly behind, so the inner bar passes in front of it (like the logo)
    geo.translate(0, 0, -depth / 2 + (k === 'wedge' ? -0.07 : 0));
    logo.add(new THREE.Mesh(geo, bodyMat));
    logo.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 20), edgeMat));
  }

  // ---- Planet with rings (from the logo) ----
  const planet = new THREE.Group();
  const pc = to3(P.cx, P.cy);
  planet.position.set(pc.x, pc.y, 0.3);
  const sphereGeo = new THREE.SphereGeometry(P.r / U, 64, 64);
  const sphereMat = new THREE.ShaderMaterial({
    uniforms: { uRim: { value: COPPER.clone().multiplyScalar(1.1) }, uBase: { value: new THREE.Color('#2b1418') }, uDeep: { value: new THREE.Color('#0d1424') } },
    vertexShader: `varying vec3 vN; varying vec3 vV; varying vec3 vP;
      void main(){ vP = position; vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `uniform vec3 uRim; uniform vec3 uBase; uniform vec3 uDeep; varying vec3 vN; varying vec3 vV; varying vec3 vP;
      void main(){
        float f = pow(1.0 - max(dot(vN, vV), 0.0), 2.4);
        float light = max(dot(vN, normalize(vec3(0.6,0.5,0.6))), 0.0);
        vec3 base = mix(uDeep, uBase, smoothstep(-0.4, 0.5, vP.x + 0.3*vP.y));
        float bands = 0.5 + 0.5*sin(vP.y*22.0 + vP.x*6.0);
        base *= 0.85 + 0.25*bands;
        vec3 c = base * (0.35 + 0.8*light) + uRim * f * 0.55;
        gl_FragColor = vec4(c, 1.0);
      }`,
  });
  planet.add(new THREE.Mesh(sphereGeo, sphereMat));

  // Ring system: tilted like the logo (front of the ring passes over the lower-left of the planet)
  const ringTilt = new THREE.Group();
  ringTilt.rotation.set(-Math.acos(P.ring.ry / P.ring.rx), 0, (-P.ring.angle * Math.PI) / 180, 'ZYX');
  planet.add(ringTilt);
  const R = P.ring.rx / U;
  const rings: THREE.Mesh[] = [];
  [[0.94, 0.004, 0.45], [1, 0.008, 0.9], [1.05, 0.004, 0.6], [1.11, 0.003, 0.35]].forEach(([k, tube, op]) => {
    const m = new THREE.Mesh(
      new THREE.TorusGeometry(R * k, tube, 8, 200),
      new THREE.MeshBasicMaterial({ color: GOLD.clone().multiplyScalar(1.6), toneMapped: false, transparent: true, opacity: op }),
    );
    rings.push(m);
    ringTilt.add(m);
  });
  // sparkling dust on the ring
  const RD = opts.mobile ? 260 : 600;
  const rdPos = new Float32Array(RD * 3);
  for (let i = 0; i < RD; i++) {
    const a = Math.random() * Math.PI * 2;
    const rr = R * (0.9 + Math.random() * 0.25);
    rdPos.set([Math.cos(a) * rr, Math.sin(a) * rr, (Math.random() - 0.5) * 0.03], i * 3);
  }
  const ringDustGeo = new THREE.BufferGeometry();
  ringDustGeo.setAttribute('position', new THREE.BufferAttribute(rdPos, 3));
  logo.add(planet);
  scene.add(logo);

  // ---- Star dust ----
  const COUNT = opts.mobile ? 500 : 1400;
  const pos = new Float32Array(COUNT * 3);
  const col = new Float32Array(COUNT * 3);
  const palette = [COPPER, COPPER_LIGHT, TEAL, new THREE.Color('#d63ba8'), new THREE.Color('#ffffff')];
  for (let i = 0; i < COUNT; i++) {
    const r = 1.6 + Math.random() * 4.5;
    const a = Math.random() * Math.PI * 2;
    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 5;
    pos[i * 3 + 2] = Math.sin(a) * r - 1.5;
    const c = palette[Math.floor(Math.random() * palette.length)];
    col.set([c.r, c.g, c.b], i * 3);
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  dustGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const dot = document.createElement('canvas');
  dot.width = dot.height = 64;
  const g = dot.getContext('2d')!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.3, 'rgba(255,255,255,.5)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const dust = new THREE.Points(
    dustGeo,
    new THREE.PointsMaterial({ size: 0.04, opacity: 0.8, map: new THREE.CanvasTexture(dot), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
  );
  scene.add(dust);
  const ringDust = new THREE.Points(
    ringDustGeo,
    new THREE.PointsMaterial({ size: 0.035, map: dust.material.map, color: GOLD.clone().multiplyScalar(2), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }),
  );
  ringTilt.add(ringDust);

  // ---- Lights ----
  scene.add(new THREE.AmbientLight('#4a3a5a', 0.25));
  const key = new THREE.PointLight(COPPER, 3, 12);
  key.position.set(2.5, 2, 3);
  scene.add(key);
  const fill = new THREE.PointLight('#6a7cff', 2, 12);
  fill.position.set(-3, -1.5, 2.5);
  scene.add(fill);

  // ---- Post-processing (bloom = the neon glow) ----
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), opts.mobile ? 0.7 : 0.8, 0.12, 0.85);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  // Pointer + scroll influence
  const target = { x: 0, y: 0 };
  const cur = { x: 0, y: 0 };
  const onPointer = (e: PointerEvent) => {
    target.x = (e.clientX / window.innerWidth) * 2 - 1;
    target.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener('pointermove', onPointer, { passive: true });

  const t0 = performance.now();
  let visible = false;
  let raf = 0;
  const frame = () => {
    const t = (performance.now() - t0) / 1000;
    cur.x += (target.x - cur.x) * 0.05;
    cur.y += (target.y - cur.y) * 0.05;
    const r = canvas.getBoundingClientRect();
    const scrollP = (r.top + r.height / 2) / window.innerHeight - 0.5; // -0.5..0.5 while on screen
    logo.rotation.y = Math.sin(t * 0.35) * 0.35 + cur.x * 0.55 + scrollP * 0.6;
    logo.rotation.x = Math.sin(t * 0.27) * 0.08 + cur.y * 0.3;
    logo.position.y = Math.sin(t * 0.8) * 0.06;
    planet.children[0].rotation.y = t * 0.3;
    ringDust.rotation.z = t * 0.12;
    rings.forEach((r, i) => (r.rotation.z = t * (0.05 + i * 0.03)));
    dust.rotation.y = t * 0.03;
    composer.render();
    if (visible && !opts.reduced) raf = requestAnimationFrame(frame);
  };

  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    cancelAnimationFrame(raf);
    if (visible) frame();
  });
  io.observe(canvas);
  frame();
  return () => {
    io.disconnect();
    ro.disconnect();
    window.removeEventListener('pointermove', onPointer);
    renderer.dispose();
  };
}
