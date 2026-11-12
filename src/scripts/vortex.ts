// Hero "vortex": tens of thousands of GPU particle-streaks spiralling around the iris of the eye key visual.
// Adapted from a Three.js vortex reference: spiral filaments around a hollow ring (the camera lens),
// brightness pulses racing outward, slow auto-spin, bloom glow. Fitted exactly into the iris of the eye.
// Recoloured to the MNH XMotion palette and pinned to the iris position in the hero image.
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

// Measured on the eye artwork (1792 × 2400 px): iris centre (908, 1197), camera-lens radius 290 px,
// iris rim radius 505 px, eye opening (between the lids) ±345 px. All as fractions of the image width.
const EYE = { x: 908 / 1792, y: 1197 / 2400, lens: 290 / 1792, iris: 505 / 1792, open: 345 / 1792 };

const hexToVec3 = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

const CONFIG = {
  coreRadius: 15 * (290 / 505), // hollow ring = exactly the camera-lens edge (maxRadius = iris rim)
  maxRadius: 15,
  radialExpo: 1.75,
  swirl: 0.8,
  spread: 0.89,
  depth: 1.2,
  streamSpeed: 5.2,
  pulseFreq: 8,
  coreFall: 0.02,
  twinkleSpeed: 2.75,
  flipSpeed: 4,
  glyphMix: 0.12,
  pointSize: 3.1,
  coreBoost: 3.0,
  brightness: 1.7,
  saturation: 0.56,
  digitSharp: 1.2,
  haloAmt: 0.8,
  haloFalloff: 1,
  coreColor: '#9ff5ec', // bright teal at the lens edge
  strandColor: '#4fd9d0', // the iris' own teal
  sparkColor: '#ff9a5a', // copper sparks like the iris rim
  autoSpin: 0.32, // faster churn
  waveSpeed: 1.6, // strands ripple and wave
  curlAmp: 0.55, // organic braiding flow (from the reference)
  breathe: 0.035, // the whole ring gently pulses in and out
};

const VERT = /* glsl */ `
attribute float aAngle; attribute float aFil; attribute float aS; attribute float aSeed; attribute float aGlyph;
uniform float iTime, uAlpha;
uniform vec2 uRes;
uniform float uCoreR, uMaxR, uExpo, uSwirl, uSpread, uDepth, uWave, uCurl, uBreathe;
uniform float uStreamSpeed, uPulseFreq, uCoreFall, uTwinkle, uFlipSpeed, uGlyphMix, uSize, uCoreBoost, uBright, uSat;
uniform vec3 uCore, uStrand, uSpark;
varying vec3 vCol; varying float vBright; varying float vGlyph; varying float vDigit;
#define TAU 6.2831853
float hash(float n){ return fract(sin(n) * 43758.5453123); }
vec3 flow(vec3 p, float t){
  vec3 q = p;
  q.x += 0.9 * sin(t + 1.7 * p.y);
  q.y += 0.9 * cos(t + 1.7 * p.z);
  q.z += 0.9 * sin(t + 1.7 * p.x);
  q.x += 0.5 * cos(t * 1.3 + 2.9 * q.z);
  q.z += 0.5 * sin(t * 1.1 + 2.9 * q.y);
  return q - p;
}
void main(){
  float s = aS;
  float radius = uCoreR + (uMaxR - uCoreR) * pow(s, uExpo);
  radius *= 1.0 + uBreathe * sin(iTime * 1.4 + aFil * 6.2831) * s;
  float ang = aAngle + uSwirl * radius * (0.6 + 0.4 * aFil);
  ang += sin(s * 6.0 + aFil * 30.0 + iTime * uWave) * uSpread * (0.25 + 0.75 * s);
  vec3 pos = vec3(cos(ang), sin(ang), 0.0) * radius;
  pos.z = (aFil - 0.5) * uDepth * (0.4 + radius * 0.12);
  vec3 fp = pos * 0.05 + vec3(0.0, 0.0, aFil * 12.0);
  vec3 f = flow(fp, iTime * 0.35) * uCurl * (0.2 + 1.3 * s);
  pos.xy += f.xy;
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);

  float coreGlow = exp(-radius * radius * uCoreFall);
  float pulse = 0.5 + 0.5 * sin(TAU * uPulseFreq * s - iTime * uStreamSpeed + aFil * 6.0);
  float tw = 0.7 + 0.3 * sin(iTime * uTwinkle + aSeed * 40.0);
  float tip = smoothstep(1.0, 0.72, s);
  vBright = (0.22 + 0.95 * coreGlow) * (0.45 + 0.75 * pulse) * tw * tip * uBright * uAlpha;

  float hue = fract(aFil * 1.7 + s * 0.35);
  vec3 rainbow = 0.5 + 0.5 * cos(TAU * (hue + vec3(0.0, 0.33, 0.67)));
  vec3 spark = mix(uSpark, rainbow, uSat);
  vec3 col = mix(uStrand, spark, step(0.72, aSeed) * (0.4 + 0.6 * uSat));
  col = mix(col, uCore, coreGlow * 0.85);
  vCol = col;

  float tick = floor(iTime * uFlipSpeed + aGlyph * 7.0);
  vGlyph = step(0.5, hash(aGlyph * 91.7 + tick * 13.3));
  vDigit = (aSeed < uGlyphMix) ? 1.0 : 0.0;

  float size = uSize * (0.55 + uCoreBoost * coreGlow) * (0.7 + 0.6 * pulse);
  gl_PointSize = clamp(size * uRes.y / 1000.0 / -mv.z, 1.0, 64.0);
  gl_Position = projectionMatrix * mv;
}`;

const FRAG = /* glsl */ `
uniform sampler2D uGlyphTex;
uniform float uDigitSharp, uHaloAmt, uHaloFall;
varying vec3 vCol; varying float vBright; varying float vGlyph; varying float vDigit;
void main(){
  vec2 pc = gl_PointCoord;
  float d = length(pc - 0.5);
  float halo = pow(max(0.0, 1.0 - d * 2.0), uHaloFall) * uHaloAmt;
  float mask = halo;
  if (vDigit > 0.5) {
    vec2 guv = vec2((pc.x + vGlyph) * 0.5, pc.y);
    float g = texture2D(uGlyphTex, guv).r;
    mask = halo * 0.45 + g * uDigitSharp;
  }
  if (mask <= 0.001) discard;
  gl_FragColor = vec4(vCol * vBright * mask, 1.0);
}`;

function buildFilaments(filaments: number, perFilament: number) {
  const N = filaments * perFilament;
  const aAngle = new Float32Array(N);
  const aFil = new Float32Array(N);
  const aS = new Float32Array(N);
  const aSeed = new Float32Array(N);
  const aGlyph = new Float32Array(N);
  let k = 0;
  for (let f = 0; f < filaments; f++) {
    const ang = Math.random() * Math.PI * 2;
    const filSeed = Math.random();
    for (let p = 0; p < perFilament; p++) {
      aAngle[k] = ang;
      aFil[k] = filSeed;
      aS[k] = perFilament > 1 ? p / (perFilament - 1) : 0;
      aSeed[k] = Math.random();
      aGlyph[k] = Math.random();
      k++;
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(N * 3), 3));
  g.setAttribute('aAngle', new THREE.Float32BufferAttribute(aAngle, 1));
  g.setAttribute('aFil', new THREE.Float32BufferAttribute(aFil, 1));
  g.setAttribute('aS', new THREE.Float32BufferAttribute(aS, 1));
  g.setAttribute('aSeed', new THREE.Float32BufferAttribute(aSeed, 1));
  g.setAttribute('aGlyph', new THREE.Float32BufferAttribute(aGlyph, 1));
  return g;
}

function makeGlyphTexture() {
  const S = 128;
  const cv = document.createElement('canvas');
  cv.width = S * 2;
  cv.height = S;
  const c = cv.getContext('2d')!;
  c.fillStyle = '#fff';
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.font = `bold ${Math.floor(S * 0.82)}px ui-monospace, Menlo, monospace`;
  c.fillText('0', S * 0.5, S * 0.54);
  c.fillText('1', S * 1.5, S * 0.54);
  const tex = new THREE.CanvasTexture(cv);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

export function initVortex(canvas: HTMLCanvasElement, img: HTMLImageElement, opts: { mobile: boolean; startDelay: number }) {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
  } catch {
    return false;
  }
  const dpr = Math.min(window.devicePixelRatio || 1, opts.mobile ? 1.5 : 2);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 1); // black + CSS "screen" blending = only the light shows

  const scene = new THREE.Scene();
  // Orthographic camera in screen pixels: the vortex is drawn flat onto the eye, so it can never drift off it
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  camera.position.set(0, 0, 17);

  const [filaments, perFilament] = opts.mobile ? [140, 160] : [280, 320];
  const mat = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      iTime: { value: 0 },
      uAlpha: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uGlyphTex: { value: makeGlyphTexture() },
      uCoreR: { value: CONFIG.coreRadius },
      uMaxR: { value: CONFIG.maxRadius },
      uExpo: { value: CONFIG.radialExpo },
      uSwirl: { value: CONFIG.swirl },
      uSpread: { value: CONFIG.spread },
      uDepth: { value: CONFIG.depth },
      uWave: { value: CONFIG.waveSpeed },
      uCurl: { value: CONFIG.curlAmp },
      uBreathe: { value: CONFIG.breathe },
      uStreamSpeed: { value: CONFIG.streamSpeed },
      uPulseFreq: { value: Math.round(CONFIG.pulseFreq) },
      uCoreFall: { value: CONFIG.coreFall },
      uTwinkle: { value: CONFIG.twinkleSpeed },
      uFlipSpeed: { value: CONFIG.flipSpeed },
      uGlyphMix: { value: CONFIG.glyphMix },
      uSize: { value: CONFIG.pointSize },
      uCoreBoost: { value: CONFIG.coreBoost },
      uBright: { value: CONFIG.brightness },
      uSat: { value: CONFIG.saturation },
      uDigitSharp: { value: CONFIG.digitSharp },
      uHaloAmt: { value: CONFIG.haloAmt },
      uHaloFall: { value: CONFIG.haloFalloff },
      uCore: { value: hexToVec3(CONFIG.coreColor) },
      uStrand: { value: hexToVec3(CONFIG.strandColor) },
      uSpark: { value: hexToVec3(CONFIG.sparkColor) },
    },
  });
  const points = new THREE.Points(buildFilaments(filaments, perFilament), mat);
  points.frustumCulled = false;
  const group = new THREE.Group();
  group.add(points);
  scene.add(group);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), opts.mobile ? 0.32 : 0.38, 0.3, 0.04);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  // Pin the vortex to where the iris is actually drawn (object-fit: cover + the eye's slow zoom + parallax).
  // Recomputed every frame so it follows the image exactly.
  let W = 0;
  let H = 0;
  let objPos: [number, number] = [0.5, 0.5];
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    if (!W || !H) return;
    renderer.setSize(W, H, false);
    composer.setPixelRatio(dpr);
    composer.setSize(W, H);
    camera.left = -W / 2;
    camera.right = W / 2;
    camera.top = H / 2;
    camera.bottom = -H / 2;
    camera.updateProjectionMatrix();
    mat.uniforms.uRes.value.set(W * dpr, H * dpr);
    const [px, py] = getComputedStyle(img).objectPosition.split(' ').map((v) => parseFloat(v) / 100);
    objPos = [isNaN(px) ? 0.5 : px, isNaN(py) ? 0.5 : py];
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  img.addEventListener('load', resize);

  let lastMask = '';
  const align = () => {
    const rect = canvas.getBoundingClientRect();
    const ir = img.getBoundingClientRect();
    const iw = img.naturalWidth || 1792;
    const ih = img.naturalHeight || 2400;
    const sc = Math.max(ir.width / iw, ir.height / ih);
    const rw = iw * sc;
    const rh = ih * sc;
    const cx = ir.left - rect.left + (ir.width - rw) * objPos[0] + rw * EYE.x;
    const cy = ir.top - rect.top + (ir.height - rh) * objPos[1] + rh * EYE.y;
    group.position.set(cx - W / 2, H / 2 - cy, 0);
    group.scale.setScalar((rw * EYE.iris) / CONFIG.maxRadius);
    // clip to the eye opening (soft edge at the iris rim and the eyelids)
    const rx = rw * EYE.iris;
    const ry = rw * EYE.open;
    const lens = rw * EYE.lens;
    const at = `at ${cx.toFixed(1)}px ${cy.toFixed(1)}px`;
    // layer 1: eye opening (iris rim + lids); layer 2: hole over the camera lens so the monogram stays clean
    const m = `radial-gradient(${rx.toFixed(1)}px ${ry.toFixed(1)}px ${at}, #000 82%, transparent 100%), radial-gradient(circle ${(lens * 1.04).toFixed(1)}px ${at}, transparent 92%, #000 100%)`;
    if (m !== lastMask) {
      const st = canvas.style as CSSStyleDeclaration & { webkitMaskComposite?: string };
      st.maskImage = m;
      st.webkitMaskImage = m;
      st.maskComposite = 'intersect';
      st.webkitMaskComposite = 'source-in';
      lastMask = m;
    }
  };

  const appearStart = performance.now() + opts.startDelay;
  let prevT = performance.now() / 1000;
  let spin = 0;
  let visible = true;
  let raf = 0;
  const frame = () => {
    const t = performance.now() / 1000;
    const dt = Math.min(0.05, t - prevT);
    prevT = t;
    mat.uniforms.iTime.value = t;
    mat.uniforms.uAlpha.value = clamp((performance.now() - appearStart - 300) / 1800, 0, 1);
    spin += dt * CONFIG.autoSpin;
    group.rotation.z = spin;
    align();
    composer.render();
    if (visible) raf = requestAnimationFrame(frame);
  };

  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting && !document.hidden;
    cancelAnimationFrame(raf);
    if (visible) {
      prevT = performance.now() / 1000;
      raf = requestAnimationFrame(frame);
    }
  });
  io.observe(canvas);
  document.addEventListener('visibilitychange', () => {
    visible = !document.hidden && canvas.getBoundingClientRect().bottom > 0;
    cancelAnimationFrame(raf);
    if (visible) raf = requestAnimationFrame(frame);
  });
  return true;
}
