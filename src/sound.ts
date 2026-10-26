type SoundName =
  "card" | "dice" | "coin" | "success" | "fail" | "shop" | "click";

let context: AudioContext | null = null;
let noiseBuffer: AudioBuffer | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!context) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return null;
      context = new Ctor();
    }
    if (context.state === "suspended") void context.resume();
    return context;
  } catch {
    return null;
  }
}

function tone(
  ctx: AudioContext,
  frequency: number,
  start: number,
  duration: number,
  volume: number,
  type: OscillatorType = "sine",
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function getNoise(ctx: AudioContext): AudioBuffer {
  if (noiseBuffer) return noiseBuffer;
  const buffer = ctx.createBuffer(
    1,
    Math.floor(ctx.sampleRate * 0.12),
    ctx.sampleRate,
  );
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }
  noiseBuffer = buffer;
  return buffer;
}

function clack(ctx: AudioContext, at: number, volume: number) {
  const source = ctx.createBufferSource();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  source.buffer = getNoise(ctx);
  filter.type = "bandpass";
  filter.frequency.value = 900 + Math.random() * 500;
  filter.Q.value = 0.9;
  gain.gain.setValueAtTime(volume, at);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.09);
  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start(at);
}

export function playSound(name: SoundName) {
  const ctx = audio();
  if (!ctx) return;
  const now = ctx.currentTime + 0.01;
  try {
    switch (name) {
      case "click":
        tone(ctx, 660, now, 0.045, 0.025, "triangle");
        break;
      case "card":
        clack(ctx, now, 0.16);
        tone(ctx, 220, now + 0.02, 0.09, 0.03, "triangle");
        break;
      case "dice":
        for (let i = 0; i < 4; i += 1)
          clack(ctx, now + i * 0.045 + Math.random() * 0.02, 0.1 - i * 0.015);
        break;
      case "coin":
        tone(ctx, 1046, now, 0.1, 0.05, "triangle");
        tone(ctx, 1568, now + 0.07, 0.13, 0.04, "triangle");
        break;
      case "shop":
        tone(ctx, 523, now, 0.12, 0.045);
        tone(ctx, 659, now + 0.1, 0.16, 0.04);
        break;
      case "success":
        [523, 659, 784, 1046].forEach((freq, i) =>
          tone(ctx, freq, now + i * 0.085, 0.35, 0.065, "triangle"),
        );
        tone(ctx, 1568, now + 0.36, 0.5, 0.035);
        break;
      case "fail":
        tone(ctx, 196, now, 0.28, 0.06, "sawtooth");
        tone(ctx, 146, now + 0.14, 0.4, 0.045, "triangle");
        break;
      default:
        break;
    }
  } catch {
    /* audio is a garnish, not a requirement */
  }
}
