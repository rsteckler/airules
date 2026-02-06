import React, { useState, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import { OrbDisplay } from './OrbDisplay';
import { MoonIcon, CircleIcon, ZapIcon, ShuffleIcon, ChevronDownIcon, ChevronUpIcon } from './icons';

function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function generateHarmoniousPalette(mode) {
  const orbHue = Math.random() * 360;
  const baseSat = 70 + Math.random() * 25;
  const baseLit = 55 + Math.random() * 20;

  const modes = ['complementary', 'analogous'];
  const selectedMode = mode || modes[Math.floor(Math.random() * modes.length)];

  let ringHue;
  let cometHue;

  if (selectedMode === 'complementary') {
    ringHue = orbHue + 180;
    cometHue = orbHue + 180;
  } else {
    ringHue = orbHue + 40;
    cometHue = orbHue + 80;
  }

  return {
    orbPrimary: hslToHex(orbHue, baseSat, baseLit),
    orbSecondary: hslToHex(orbHue + 25, baseSat - 5, baseLit + 8),
    orbTertiary: hslToHex(orbHue - 25, baseSat - 10, baseLit - 5),
    glow: hslToHex(orbHue, Math.min(baseSat + 15, 100), Math.min(baseLit + 15, 85)),
    ringPrimary: hslToHex(ringHue, baseSat, baseLit + 5),
    ringSecondary: hslToHex(ringHue + 30, baseSat - 10, baseLit - 10),
    cometPrimary: hslToHex(cometHue, baseSat + 10, Math.min(baseLit + 20, 90)),
    cometSecondary: hslToHex(cometHue + 30, baseSat, baseLit),
  };
}

function randomConfig() {
  const palette = generateHarmoniousPalette();
  return {
    orbPrimaryColor: palette.orbPrimary,
    orbSecondaryColor: palette.orbSecondary,
    orbTertiaryColor: palette.orbTertiary,
    glowColor: palette.glow,
    ringPrimaryColor: palette.ringPrimary,
    ringSecondaryColor: palette.ringSecondary,
    cometPrimaryColor: palette.cometPrimary,
    cometSecondaryColor: palette.cometSecondary,
    glowPulseFrequency: 5 + Math.random() * 5,
    heartbeatFrequency: 6 + Math.random() * 4,
    animationScale: 0.5,
    blobiness: Math.random() * 0.2,
    blobinessSpeed: 0.4 + Math.random() * 1.2,
    ringCount: Math.floor(1 + Math.random() * 6),
    ringWobble: Math.random(),
    ringSpinUniformity: Math.random(),
    cometCount: Math.floor(1 + Math.random() * 5),
    cometTailLength: 0.4 + Math.random() * 0.6,
    sparkliness: 0.1 + Math.random() * 0.9,
    size: 350,
  };
}

const SLEEP_COLOR = '#888888';
const SLEEP_SPEED = 0.03;
const TURBO_SPEED = 1;
const TURBO_SPARKLE = 1;
const TRANSITION_DURATION = 500;

function lerp(start, end, t) {
  return start + (end - start) * t;
}

function lerpColor(startHex, endHex, t) {
  const start = {
    r: parseInt(startHex.slice(1, 3), 16),
    g: parseInt(startHex.slice(3, 5), 16),
    b: parseInt(startHex.slice(5, 7), 16),
  };
  const end = {
    r: parseInt(endHex.slice(1, 3), 16),
    g: parseInt(endHex.slice(3, 5), 16),
    b: parseInt(endHex.slice(5, 7), 16),
  };
  const r = Math.round(lerp(start.r, end.r, t));
  const g = Math.round(lerp(start.g, end.g, t));
  const b = Math.round(lerp(start.b, end.b, t));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function ColorPicker({ label, value, onChange }) {
  return (
    <div className="orb-control-row">
      <span className="orb-control-label">{label}</span>
      <div className="orb-control-inputs">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="orb-color-input"
        />
        <span className="orb-color-hex">{value}</span>
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, step = 0.01, onChange }) {
  return (
    <div className="orb-control-row">
      <span className="orb-control-label">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="orb-slider"
      />
      <span className="orb-slider-value">
        {Number.isInteger(step) ? value : value.toFixed(2)}
      </span>
    </div>
  );
}

export const Orb = forwardRef(function Orb(
  {
    initialConfig,
    showControls = false,
    showStateButtons = false,
    className = '',
    onStateChange,
  },
  ref
) {
  const [config, setConfig] = useState(() => initialConfig || randomConfig());
  const [showParams, setShowParams] = useState(true);
  const [orbState, setOrbState] = useState('idle');

  const configRef = useRef(config);
  configRef.current = config;

  const idleConfigRef = useRef(null);
  const animationRef = useRef(null);

  const animateTransition = useCallback(
    (targetConfig, newState, duration = TRANSITION_DURATION, onComplete) => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      const startConfig = { ...configRef.current };
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const t = Math.min(elapsed / duration, 1);
        const easeT = t * (2 - t);

        const newConfig = { ...startConfig };

        if (targetConfig.orbPrimaryColor) {
          newConfig.orbPrimaryColor = lerpColor(startConfig.orbPrimaryColor, targetConfig.orbPrimaryColor, easeT);
        }
        if (targetConfig.orbSecondaryColor) {
          newConfig.orbSecondaryColor = lerpColor(startConfig.orbSecondaryColor, targetConfig.orbSecondaryColor, easeT);
        }
        if (targetConfig.orbTertiaryColor) {
          newConfig.orbTertiaryColor = lerpColor(startConfig.orbTertiaryColor, targetConfig.orbTertiaryColor, easeT);
        }
        if (targetConfig.glowColor) {
          newConfig.glowColor = lerpColor(startConfig.glowColor, targetConfig.glowColor, easeT);
        }
        if (targetConfig.ringPrimaryColor) {
          newConfig.ringPrimaryColor = lerpColor(startConfig.ringPrimaryColor, targetConfig.ringPrimaryColor, easeT);
        }
        if (targetConfig.ringSecondaryColor) {
          newConfig.ringSecondaryColor = lerpColor(startConfig.ringSecondaryColor, targetConfig.ringSecondaryColor, easeT);
        }
        if (targetConfig.cometPrimaryColor) {
          newConfig.cometPrimaryColor = lerpColor(startConfig.cometPrimaryColor, targetConfig.cometPrimaryColor, easeT);
        }
        if (targetConfig.cometSecondaryColor) {
          newConfig.cometSecondaryColor = lerpColor(startConfig.cometSecondaryColor, targetConfig.cometSecondaryColor, easeT);
        }
        if (targetConfig.animationScale !== undefined) {
          newConfig.animationScale = lerp(startConfig.animationScale, targetConfig.animationScale, easeT);
        }
        if (targetConfig.sparkliness !== undefined) {
          newConfig.sparkliness = lerp(startConfig.sparkliness, targetConfig.sparkliness, easeT);
        }

        setConfig(newConfig);

        if (t < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          onComplete?.();
        }
      };

      animationRef.current = requestAnimationFrame(animate);
      setOrbState(newState);
      onStateChange?.(newState);
    },
    [onStateChange]
  );

  const sleep = useCallback(() => {
    if (orbState === 'sleep') return;
    if (orbState === 'idle') {
      idleConfigRef.current = { ...configRef.current };
    }
    animateTransition(
      {
        orbPrimaryColor: SLEEP_COLOR,
        orbSecondaryColor: SLEEP_COLOR,
        orbTertiaryColor: SLEEP_COLOR,
        glowColor: SLEEP_COLOR,
        ringPrimaryColor: SLEEP_COLOR,
        ringSecondaryColor: SLEEP_COLOR,
        cometPrimaryColor: SLEEP_COLOR,
        cometSecondaryColor: SLEEP_COLOR,
        animationScale: SLEEP_SPEED,
      },
      'sleep'
    );
  }, [orbState, animateTransition]);

  const idle = useCallback(() => {
    if (orbState === 'idle' || !idleConfigRef.current) return;
    animateTransition(idleConfigRef.current, 'idle', TRANSITION_DURATION, () => {
      idleConfigRef.current = null;
    });
  }, [orbState, animateTransition]);

  const turbo = useCallback(() => {
    if (orbState === 'turbo') return;
    if (orbState === 'idle') {
      idleConfigRef.current = { ...configRef.current };
    }
    const turboConfig = { animationScale: TURBO_SPEED, sparkliness: TURBO_SPARKLE };
    if (orbState === 'sleep' && idleConfigRef.current) {
      animateTransition(idleConfigRef.current, 'idle', 250, () => {
        animateTransition(turboConfig, 'turbo', 250);
      });
    } else {
      animateTransition(turboConfig, 'turbo');
    }
  }, [orbState, animateTransition]);

  const randomize = useCallback(() => {
    const newConfig = randomConfig();
    newConfig.size = configRef.current.size;
    setConfig(newConfig);
    idleConfigRef.current = null;
    setOrbState('idle');
    onStateChange?.('idle');
  }, [onStateChange]);

  useImperativeHandle(
    ref,
    () => ({
      sleep,
      idle,
      turbo,
      randomize,
      getState: () => orbState,
      getConfig: () => configRef.current,
      setConfig: (newConfig) => {
        setConfig((prev) => ({ ...prev, ...newConfig }));
      },
    }),
    [sleep, idle, turbo, randomize, orbState]
  );

  const updateConfig = useCallback((key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className={`orb ${className}`.trim()}>
      <div className="orb__wrapper">
        <OrbDisplay config={config} />

        {showControls && (
          <div className="orb-controls">
            <button
              type="button"
              className="orb-controls-toggle"
              onClick={() => setShowParams(!showParams)}
            >
              Parameters
              {showParams ? <ChevronUpIcon size={14} /> : <ChevronDownIcon size={14} />}
            </button>
            {showParams && (
              <div className="orb-controls-body">
                <div className="orb-control-group">
                  <div className="orb-control-group-title">Colors</div>
                  <ColorPicker label="Orb Primary" value={config.orbPrimaryColor} onChange={(v) => updateConfig('orbPrimaryColor', v)} />
                  <ColorPicker label="Orb Secondary" value={config.orbSecondaryColor} onChange={(v) => updateConfig('orbSecondaryColor', v)} />
                  <ColorPicker label="Orb Tertiary" value={config.orbTertiaryColor} onChange={(v) => updateConfig('orbTertiaryColor', v)} />
                  <ColorPicker label="Glow" value={config.glowColor} onChange={(v) => updateConfig('glowColor', v)} />
                  <ColorPicker label="Ring Primary" value={config.ringPrimaryColor} onChange={(v) => updateConfig('ringPrimaryColor', v)} />
                  <ColorPicker label="Ring Secondary" value={config.ringSecondaryColor} onChange={(v) => updateConfig('ringSecondaryColor', v)} />
                  <ColorPicker label="Comet Primary" value={config.cometPrimaryColor} onChange={(v) => updateConfig('cometPrimaryColor', v)} />
                  <ColorPicker label="Comet Secondary" value={config.cometSecondaryColor} onChange={(v) => updateConfig('cometSecondaryColor', v)} />
                </div>
                <div className="orb-control-group">
                  <div className="orb-control-group-title">Animation</div>
                  <Slider label="Glow Pulse" value={config.glowPulseFrequency} min={5} max={10} onChange={(v) => updateConfig('glowPulseFrequency', v)} />
                  <Slider label="Heartbeat" value={config.heartbeatFrequency} min={6} max={10} onChange={(v) => updateConfig('heartbeatFrequency', v)} />
                  <Slider label="Speed" value={config.animationScale} min={0.01} max={1} onChange={(v) => updateConfig('animationScale', v)} />
                </div>
                <div className="orb-control-group">
                  <div className="orb-control-group-title">Blobiness</div>
                  <Slider label="Amount" value={config.blobiness} min={0} max={0.2} onChange={(v) => updateConfig('blobiness', v)} />
                  <Slider label="Speed" value={config.blobinessSpeed} min={0.1} max={3} onChange={(v) => updateConfig('blobinessSpeed', v)} />
                </div>
                <div className="orb-control-group">
                  <div className="orb-control-group-title">Rings</div>
                  <Slider label="Count" value={config.ringCount} min={1} max={6} step={1} onChange={(v) => updateConfig('ringCount', v)} />
                  <Slider label="Wobble" value={config.ringWobble} min={0} max={1} onChange={(v) => updateConfig('ringWobble', v)} />
                  <Slider label="Spin Uniform" value={config.ringSpinUniformity} min={0} max={1} onChange={(v) => updateConfig('ringSpinUniformity', v)} />
                </div>
                <div className="orb-control-group">
                  <div className="orb-control-group-title">Comets</div>
                  <Slider label="Count" value={config.cometCount} min={1} max={5} step={1} onChange={(v) => updateConfig('cometCount', v)} />
                  <Slider label="Tail Length" value={config.cometTailLength} min={0.4} max={1} onChange={(v) => updateConfig('cometTailLength', v)} />
                </div>
                <div className="orb-control-group">
                  <div className="orb-control-group-title">Other</div>
                  <Slider label="Sparkliness" value={config.sparkliness} min={0.1} max={1} onChange={(v) => updateConfig('sparkliness', v)} />
                  <Slider label="Size" value={config.size} min={100} max={500} step={10} onChange={(v) => updateConfig('size', v)} />
                </div>
              </div>
            )}
          </div>
        )}

        {showStateButtons && (
          <div className="orb-state-buttons">
            <button
              type="button"
              onClick={sleep}
              disabled={orbState === 'sleep'}
              className={`orb-state-btn ${orbState === 'sleep' ? 'orb-state-btn--active' : ''}`}
            >
              <MoonIcon size={14} /> Sleep
            </button>
            <button
              type="button"
              onClick={idle}
              disabled={orbState === 'idle'}
              className={`orb-state-btn ${orbState === 'idle' ? 'orb-state-btn--active' : ''}`}
            >
              <CircleIcon size={14} /> Idle
            </button>
            <button
              type="button"
              onClick={turbo}
              disabled={orbState === 'turbo'}
              className={`orb-state-btn orb-state-btn--turbo ${orbState === 'turbo' ? 'orb-state-btn--active' : ''}`}
            >
              <ZapIcon size={14} /> Turbo
            </button>
            <button type="button" onClick={randomize} className="orb-state-btn">
              <ShuffleIcon size={14} /> Randomize
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default Orb;
