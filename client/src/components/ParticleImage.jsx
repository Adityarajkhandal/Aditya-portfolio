import { useEffect, useRef } from 'react';
import './ParticleImage.css';

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

const ParticleImage = ({
  src,
  alt = 'Particle portrait',
  dotSpacing = 4,
  minDotSize = 1.0,
  maxDotSize = 2.4,
  crossSize = 4,
  crossThreshold = 0.72,
  colorDim = 'rgba(100, 255, 218, 0.28)',
  colorMid = 'rgba(100, 255, 218, 0.55)',
  colorBright = 'rgba(100, 255, 218, 0.88)',
  colorHighlight = 'rgba(100, 255, 218, 1)',
  scatter = 200,
  gatherDuration = 1800,
  stagger = 500,
  pointerRepel = 45,
  repelRadius = 110,
  idleDrift = 0.4,
  glow = true,
  className = '',
  style,
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return undefined;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return undefined;

    let dots = [];
    let animationFrame = null;
    let resizeFrame = null;
    let buildId = 0;
    let gathering = false;
    let gatherStart = 0;
    let reducedMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    let width = 0;
    let height = 0;

    // Direct pointer tracking — no smoothing for instant response
    const pointer = {
      active: false,
      x: 0,
      y: 0,
    };

    const startGather = () => {
      if (!dots.length) return;
      const now = performance.now();
      const spread = reducedMotion ? 0 : scatter;

      dots.forEach(dot => {
        const angle = dot.seed * Math.PI * 2;
        const distance = spread * (0.35 + dot.seed * 0.75);
        dot.x = dot.targetX + Math.cos(angle) * distance + (dot.seed - 0.5) * spread * 0.5;
        dot.y = dot.targetY + Math.sin(angle) * distance + (dot.seed - 0.5) * spread * 0.5;
        dot.startX = dot.x;
        dot.startY = dot.y;
        dot.delay = reducedMotion ? 0 : dot.seed * stagger;
      });

      gatherStart = now;
      gathering = true;
    };

    // Pre-bucket dots by luminance group for batch rendering
    const colorGroups = {
      highlight: [],
      bright: [],
      mid: [],
      dim: [],
    };

    const bucketDots = () => {
      colorGroups.highlight = [];
      colorGroups.bright = [];
      colorGroups.mid = [];
      colorGroups.dim = [];

      dots.forEach(dot => {
        if (dot.luminance > crossThreshold) {
          colorGroups.highlight.push(dot);
        } else if (dot.luminance > 0.5) {
          colorGroups.bright.push(dot);
        } else if (dot.luminance > 0.25) {
          colorGroups.mid.push(dot);
        } else {
          colorGroups.dim.push(dot);
        }
      });
    };

    const render = now => {
      ctx.clearRect(0, 0, width, height);

      let complete = true;
      const pActive = pointer.active && !reducedMotion && pointerRepel > 0 && repelRadius > 0;
      const px = pointer.x;
      const py = pointer.y;
      const repelR2 = repelRadius * repelRadius;
      const follow = reducedMotion ? 1 : 0.45; // Much faster follow for responsiveness
      const t = now * 0.001;

      // Update all dot positions first
      for (let i = 0, len = dots.length; i < len; i++) {
        const dot = dots[i];
        let baseX = dot.targetX;
        let baseY = dot.targetY;

        if (gathering) {
          const local =
            (now - gatherStart - dot.delay) /
            Math.max(1, reducedMotion ? 1 : gatherDuration);
          const progress = clamp(local, 0, 1);
          const eased = easeOutCubic(progress);
          baseX = dot.startX + (dot.targetX - dot.startX) * eased;
          baseY = dot.startY + (dot.targetY - dot.startY) * eased;
          if (progress < 1) complete = false;
          dot._progress = progress;
        } else {
          dot._progress = 1;
          if (!reducedMotion && idleDrift > 0) {
            baseX += Math.sin(t * 0.7 + dot.seed * 8) * idleDrift * 0.5;
            baseY += Math.cos(t * 0.6 + dot.seed * 12) * idleDrift * 0.5;
          }
        }

        // Pointer repel — optimized with squared distance check
        if (pActive) {
          const dx = baseX - px;
          const dy = baseY - py;
          const dist2 = dx * dx + dy * dy;
          if (dist2 > 0 && dist2 < repelR2) {
            const dist = Math.sqrt(dist2);
            const force = Math.pow(1 - dist / repelRadius, 2) * pointerRepel;
            const invDist = 1 / dist;
            baseX += dx * invDist * force;
            baseY += dy * invDist * force;
          }
        }

        dot.x += (baseX - dot.x) * follow;
        dot.y += (baseY - dot.y) * follow;
      }

      // Batch render by color group — minimizes fillStyle changes
      ctx.globalAlpha = 1;

      // Dim dots
      ctx.fillStyle = colorDim;
      for (let i = 0, len = colorGroups.dim.length; i < len; i++) {
        const dot = colorGroups.dim[i];
        const alpha = clamp(0.25 + dot._progress * 0.75, 0, 1);
        ctx.globalAlpha = alpha;
        const size = minDotSize + (maxDotSize - minDotSize) * (dot.luminance / 0.5) * 0.4;
        ctx.fillRect(dot.x - size * 0.5, dot.y - size * 0.5, size, size);
      }

      // Mid dots
      ctx.fillStyle = colorMid;
      for (let i = 0, len = colorGroups.mid.length; i < len; i++) {
        const dot = colorGroups.mid[i];
        const alpha = clamp(0.25 + dot._progress * 0.75, 0, 1);
        ctx.globalAlpha = alpha;
        const size = minDotSize + (maxDotSize - minDotSize) * ((dot.luminance - 0.25) / 0.75);
        ctx.fillRect(dot.x - size * 0.5, dot.y - size * 0.5, size, size);
      }

      // Bright dots
      ctx.fillStyle = colorBright;
      for (let i = 0, len = colorGroups.bright.length; i < len; i++) {
        const dot = colorGroups.bright[i];
        const alpha = clamp(0.25 + dot._progress * 0.75, 0, 1);
        ctx.globalAlpha = alpha;
        const size = minDotSize + (maxDotSize - minDotSize) * ((dot.luminance - 0.25) / 0.75);
        ctx.fillRect(dot.x - size * 0.5, dot.y - size * 0.5, size, size);
      }

      // Highlight dots — cross/star shapes (no shadowBlur for performance)
      ctx.fillStyle = colorHighlight;
      for (let i = 0, len = colorGroups.highlight.length; i < len; i++) {
        const dot = colorGroups.highlight[i];
        const alpha = clamp(0.25 + dot._progress * 0.75, 0, 1);
        ctx.globalAlpha = alpha;
        const cs = crossSize * (0.7 + dot.luminance * 0.4);
        const hw = 0.7;
        // Horizontal arm
        ctx.fillRect(dot.x - cs * 0.5, dot.y - hw, cs, hw * 2);
        // Vertical arm
        ctx.fillRect(dot.x - hw, dot.y - cs * 0.5, hw * 2, cs);
      }

      ctx.globalAlpha = 1;

      if (gathering && complete) {
        gathering = false;
      }

      animationFrame = window.requestAnimationFrame(render);
    };

    const ensureRenderLoop = () => {
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    const sampleImage = async () => {
      const currentBuild = ++buildId;
      const rect = container.getBoundingClientRect();
      width = Math.floor(rect.width);
      height = Math.floor(rect.height);

      if (width <= 0 || height <= 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Load image
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      });

      if (currentBuild !== buildId) return;

      // Calculate dimensions — fit image into container, centered
      const imgAspect = img.width / img.height;
      const containerAspect = width / height;
      let drawWidth, drawHeight, offsetX, offsetY;

      if (imgAspect > containerAspect) {
        drawHeight = height * 0.95;
        drawWidth = drawHeight * imgAspect;
      } else {
        drawWidth = width * 0.95;
        drawHeight = drawWidth / imgAspect;
      }
      offsetX = (width - drawWidth) / 2;
      offsetY = (height - drawHeight) / 2;

      // Draw to offscreen canvas
      const offscreen = document.createElement('canvas');
      const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
      if (!offCtx) return;

      offscreen.width = Math.floor(drawWidth);
      offscreen.height = Math.floor(drawHeight);
      offCtx.drawImage(img, 0, 0, offscreen.width, offscreen.height);

      const imageData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
      const pixels = imageData.data;
      const newDots = [];
      const step = Math.max(2, Math.floor(dotSpacing));

      // Sample on a strict grid
      for (let y = 0; y < offscreen.height; y += step) {
        for (let x = 0; x < offscreen.width; x += step) {
          const idx = (y * offscreen.width + x) * 4;
          const r = pixels[idx];
          const g = pixels[idx + 1];
          const b = pixels[idx + 2];
          const a = pixels[idx + 3];

          // Luminance
          const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

          // Filter: skip transparent pixels AND near-white pixels (background)
          // Alpha < 30 = transparent background
          // Luminance > 0.92 with high alpha = white/near-white background
          if (a < 30) continue;
          if (luminance > 0.92 && a > 200) continue;
          if (luminance < 0.05) continue;

          const index = newDots.length;
          const seed = ((index * 9301 + 49297) % 233280) / 233280;
          const angle = seed * Math.PI * 2;
          const dist = (reducedMotion ? 0 : scatter) * (0.35 + seed * 0.75);
          const sx = offsetX + x + Math.cos(angle) * dist + (seed - 0.5) * scatter * 0.5;
          const sy = offsetY + y + Math.sin(angle) * dist + (seed - 0.5) * scatter * 0.5;

          newDots.push({
            x: reducedMotion ? offsetX + x : sx,
            y: reducedMotion ? offsetY + y : sy,
            startX: sx,
            startY: sy,
            targetX: offsetX + x,
            targetY: offsetY + y,
            luminance,
            seed,
            delay: seed * stagger,
            _progress: 0,
          });
        }
      }

      dots = newDots;
      bucketDots();

      pointer.x = width / 2;
      pointer.y = height / 2;

      if (reducedMotion) {
        dots.forEach(dot => {
          dot.x = dot.targetX;
          dot.y = dot.targetY;
          dot.startX = dot.targetX;
          dot.startY = dot.targetY;
          dot.delay = 0;
          dot._progress = 1;
        });
        gathering = false;
      } else {
        const now = performance.now();
        gatherStart = now;
        gathering = true;
      }

      ensureRenderLoop();
    };

    const queueSample = () => {
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(sampleImage);
    };

    // Direct pointer tracking — no smoothing, instant response
    const handlePointerMove = event => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const reduceMotionQuery = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    );
    const handleReduceMotionChange = event => {
      reducedMotion = event.matches;
      sampleImage();
    };

    reduceMotionQuery?.addEventListener('change', handleReduceMotionChange);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerleave', handlePointerLeave);

    const resizeObserver = new ResizeObserver(queueSample);
    resizeObserver.observe(container);
    sampleImage();

    return () => {
      buildId += 1;
      resizeObserver.disconnect();
      reduceMotionQuery?.removeEventListener('change', handleReduceMotionChange);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);

      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
      if (resizeFrame !== null) window.cancelAnimationFrame(resizeFrame);
    };
  }, [
    src,
    dotSpacing,
    minDotSize,
    maxDotSize,
    crossSize,
    crossThreshold,
    colorDim,
    colorMid,
    colorBright,
    colorHighlight,
    scatter,
    gatherDuration,
    stagger,
    pointerRepel,
    repelRadius,
    idleDrift,
    glow,
  ]);

  return (
    <div
      ref={containerRef}
      className={`particle-image ${className}`}
      style={style}
      aria-label={alt}
    >
      <canvas
        ref={canvasRef}
        className="particle-image__canvas"
        aria-hidden="true"
      />
      <span className="particle-image__sr">{alt}</span>
    </div>
  );
};

export default ParticleImage;
