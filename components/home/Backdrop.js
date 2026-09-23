'use client';
import { useEffect, useRef } from 'react';

/* A barely-there wash of light behind the whole page: large, slow, domain-warped simplex
   blobs in the foreground colour at a few percent, with a static grain so the gradient
   never bands. It has no edges or dots of its own, so the frame's hairlines and markers
   stay the only lines on the page.

   Nothing here touches the load: the canvas is empty markup until the page has fully
   loaded and the browser is idle, it renders at a quarter of the pixels (one texel per
   2px cell, smoothed back up by the browser), is capped at 30fps, and stops whenever it
   is off screen or the tab is hidden. Reduced motion gets a single still frame. */

const CELL = 2;

const FRAME_MS = 1000 / 30;

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const FRAG = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uTime;
uniform vec4 uColor;

// 3D simplex noise by Ian McEwan, Ashima Arts. MIT License.
// https://github.com/ashima/webgl-noise
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

// Static per-pixel hash, used as grain so the faint gradient never bands.
float hash(vec2 p){p=fract(p*vec2(.1031,.103));p+=dot(p,p.yx+33.33);return fract((p.x+p.y)*p.x);}

void main(){
  vec2 frag=gl_FragCoord.xy;
  vec2 uv=frag/max(uRes.x,uRes.y);
  float t=uTime*.02;

  // Large, slow, domain-warped blobs of light: shape without any edges.
  vec2 q=vec2(snoise(vec3(uv*.9,t)),snoise(vec3(uv*.9+7.3,t)));
  float n=snoise(vec3(uv*1.2+q*.6,t*1.3))*.5+.5;
  n=smoothstep(.2,1.,n);

  float grain=hash(frag)-.5;
  gl_FragColor=vec4(uColor.rgb,1.)*clamp(n*uColor.a+grain*.012,0.,1.);
}`;

function readColor() {
  const style = getComputedStyle(document.documentElement);
  const hex = style.getPropertyValue('--fg').trim().replace('#', '');
  const n = parseInt(hex.length === 3 ? hex.replace(/./g, '$&$&') : hex, 16);
  const dark = document.documentElement.dataset.theme === 'dark';
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255, dark ? 0.06 : 0.035];
}

function compile(gl, type, src) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  return shader;
}

function start(canvas) {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: false, premultipliedAlpha: true, powerPreference: 'low-power' });
  if (!gl) return () => {};

  const program = gl.createProgram();
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.bindAttribLocation(program, 0, 'p');
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return () => {};
  gl.useProgram(program);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, 'uRes');
  const uTime = gl.getUniformLocation(program, 'uTime');
  const uColor = gl.getUniformLocation(program, 'uColor');

  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // A random start so every visit shows a different part of the field.
  const offset = Math.random() * 1000;
  const t0 = performance.now();
  let raf = 0;
  let last = 0;
  let visible = true;

  const draw = (now) => {
    gl.uniform1f(uTime, offset + (now - t0) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const loop = (now) => {
    raf = requestAnimationFrame(loop);
    if (now - last < FRAME_MS) return;
    last = now;
    draw(now);
  };

  const run = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    if (still) draw(t0);
    else if (visible && !document.hidden) raf = requestAnimationFrame(loop);
  };

  const resize = () => {
    const w = Math.max(1, Math.ceil(canvas.clientWidth / CELL));
    const h = Math.max(1, Math.ceil(canvas.clientHeight / CELL));
    if (canvas.width === w && canvas.height === h) return;
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
    gl.uniform2f(uRes, w, h);
    if (still) draw(t0);
  };

  const recolor = () => {
    gl.uniform4fv(uColor, readColor());
    if (still) draw(t0);
  };

  resize();
  recolor();
  run();
  canvas.style.opacity = '1';

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    run();
  });
  io.observe(canvas);
  const mo = new MutationObserver(recolor);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  document.addEventListener('visibilitychange', run);

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    mo.disconnect();
    document.removeEventListener('visibilitychange', run);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
}

export default function Backdrop() {
  const ref = useRef(null);

  useEffect(() => {
    let stop = () => {};
    let idle = 0;
    let timer = 0;
    const idleCb = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
    const cancelIdle = window.cancelIdleCallback || clearTimeout;

    // Wait for load, then a beat, then an idle slot, so none of it lands in the page's critical path.
    const schedule = () => {
      timer = setTimeout(() => {
        idle = idleCb(() => (stop = start(ref.current)), { timeout: 2000 });
      }, 1200);
    };
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });

    return () => {
      window.removeEventListener('load', schedule);
      clearTimeout(timer);
      cancelIdle(idle);
      stop();
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <canvas ref={ref} className="size-full opacity-0 transition-opacity duration-[2000ms]" />
    </div>
  );
}
