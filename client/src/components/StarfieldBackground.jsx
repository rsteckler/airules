import React, { useRef, useEffect } from 'react';

const STAR_COUNT = 80;
const BASE_SPEED = 0.15;
const MIN_SIZE = 0.5;
const MAX_SIZE = 1.5;
const GLOW_RADIUS = 3;

function pickStarColor() {
  const n = Math.random();
  if (n < 0.5) return { r: 255, g: 255, b: 255 };   // 50% white
  if (n < 0.7) return { r: 255, g: 220, b: 100 };   // 20% yellow
  if (n < 0.85) return { r: 255, g: 80, b: 80 };    // 15% red
  return { r: 100, g: 180, b: 255 };                // 15% blue
}

function initStars(width, height) {
  return Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE),
    speed: BASE_SPEED * (0.5 + Math.random() * 0.5),
    opacity: 0.3 + Math.random() * 0.5,
    color: pickStarColor(),
  }));
}

export function StarfieldBackground() {
  const canvasRef = useRef(null);
  const starsRef = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      starsRef.current = initStars(w, h);
    };

    setSize();
    window.addEventListener('resize', setSize);

    const render = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);

      const bgGradient = ctx.createLinearGradient(0, 0, 0, h);
      bgGradient.addColorStop(0, '#000000');
      bgGradient.addColorStop(1, '#040404');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, w, h);

      const stars = starsRef.current;
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.x -= s.speed;
        if (s.x < -GLOW_RADIUS * 2) s.x = w + GLOW_RADIUS * 2;

        const { r, g, b } = s.color;
        const glowRadius = GLOW_RADIUS * (0.5 + s.size);
        const gradient = ctx.createRadialGradient(
          s.x, s.y, 0,
          s.x, s.y, glowRadius
        );
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${s.opacity * 0.5})`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${s.opacity * 0.06})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(s.x, s.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', setSize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="starfield-bg" aria-hidden />;
}
