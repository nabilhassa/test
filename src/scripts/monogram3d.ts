// Interactive 3D "MN" monogram with the ringed planet from the XMotion logo.
// Neon copper edges + bloom, a star field, and rotation that follows the pointer.
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

type Pt = [number, number];

// A thick straight bar between two points, as a 2D polygon
function band(a: Pt, b: Pt, t: number): Pt[] {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  const nx = (-dy / len) * (t / 2);
  const ny = (dx / len) * (t / 2);
  return [
    [a[0] + nx, a[1] + ny],
    [b[0] + nx, b[1] + ny],
    [b[0] - nx, b[1] - ny],
    [a[0] - nx, a[1] - ny],
  ];
}

// Monogram pieces in a 0–100 grid (x right, y up), modelled on the logo
const PIECES: Pt[][] = [
  // Chevron (top "V" of the M)
  [[0, 100], [13, 100], [50, 72], [87, 100], [100, 100], [50, 59]],
  // Outer left bar
  [[0, 0], [8, 0], [8, 86], [0, 86]],
  // Outer right bar
  [[92, 0], [100, 0], [100, 86], [92, 86]],
  // Inner left bar + notch
  [[18, 0], [26, 0], [26, 56], [18, 56]],
  [[11, 44], [15, 44], [15, 56], [11, 56]],
  // N diagonal
  band([24, 58], [90, 5], 10),
];

export function initMonogram(canvas: HTMLCanvasElement, opts: { bg: string; mobile: boolean; reduced: boolean }) {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  } catch {
    return null;
  }
  const bg = new THREE.Color(opts.bg);
  renderer.setClearColor(bg, 1);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, opts.mobile ? 1.5 : 2));
  renderer.toneMapping = THREE.NoToneMapping;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
  camera.position.set(0, 0, 7.2);

  const COPPER = new THREE.Color('#ff7a2f');
  const COPPER_LIGHT = new THREE.Color('#ffb27a');
  const TEAL = new THREE.Color('#22d3c5');

  // ---- Monogram ----
  const logo = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color: '#0d0809', metalness: 0.9, roughness: 0.45, emissive: COPPER, emissiveIntensity: 0.03 });
  const edgeMat = new THREE.LineBasicMaterial({ color: COPPER_LIGHT.clone().multiplyScalar(4), toneMapped: false });
  for (const piece of PIECES) {
    const shape = new THREE.Shape(piece.map(([x, y]) => new THREE.Vector2((x - 50) / 38, (y - 50) / 38)));
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.28, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.02, bevelSegments: 2 });
    geo.translate(0, 0, -0.14);
    logo.add(new THREE.Mesh(geo, bodyMat));
    logo.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 30), edgeMat));
  }

  // ---- Planet with ring (centre of the logo) ----
  const planet = new THREE.Group();
  planet.position.set(0.08, -0.12, 0.42);
  const sphereGeo = new THREE.SphereGeometry(0.36, 64, 64);
  const sphereMat = new THREE.ShaderMaterial({
    uniforms: { uRim: { value: COPPER.clone().multiplyScalar(1.3) }, uBase: { value: new THREE.Color('#2a0a0a') } },
    vertexShader: `varying vec3 vN; varying vec3 vV;
      void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `uniform vec3 uRim; uniform vec3 uBase; varying vec3 vN; varying vec3 vV;
      void main(){ float f = pow(1.0 - max(dot(vN, vV), 0.0), 2.6); float light = max(dot(vN, normalize(vec3(-0.5,0.7,0.6))), 0.0);
      vec3 c = uBase * (0.35 + 0.9*light) + uRim * f; gl_FragColor = vec4(c, 1.0); }`,
  });
  planet.add(new THREE.Mesh(sphereGeo, sphereMat));
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.62, 0.012, 8, 160),
    new THREE.MeshBasicMaterial({ color: COPPER_LIGHT.clone().multiplyScalar(2), toneMapped: false }),
  );
  ring.rotation.set(1.25, 0.35, 0);
  planet.add(ring);
  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(0.74, 0.006, 8, 160),
    new THREE.MeshBasicMaterial({ color: TEAL.clone().multiplyScalar(1.6), toneMapped: false, transparent: true, opacity: 0.7 }),
  );
  ring2.rotation.set(1.25, 0.35, 0);
  planet.add(ring2);
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

  // ---- Lights ----
  scene.add(new THREE.AmbientLight('#4a3a5a', 0.25));
  const key = new THREE.PointLight(COPPER, 6, 12);
  key.position.set(2.5, 2, 3);
  scene.add(key);
  const fill = new THREE.PointLight(TEAL, 4, 12);
  fill.position.set(-3, -1.5, 2.5);
  scene.add(fill);

  // ---- Post-processing (bloom = the neon glow) ----
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), opts.mobile ? 0.7 : 0.8, 0.12, 0.72);
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
    planet.rotation.y = t * 0.4;
    ring.rotation.z = t * 0.25;
    ring2.rotation.z = -t * 0.18;
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
