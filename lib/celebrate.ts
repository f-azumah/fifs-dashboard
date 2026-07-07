import confetti from "canvas-confetti";

const CHIME_NOTES = [523.25, 659.25, 783.99]; // C5, E5, G5

function playCompletionSound() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    CHIME_NOTES.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const start = now + i * 0.08;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.15, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.35);
    });
  } catch {
    // AudioContext unavailable or blocked — skip sound silently
  }
}

export function celebrateCompletion() {
  confetti({
    particleCount: 60,
    spread: 70,
    startVelocity: 35,
    scalar: 0.9,
    colors: ["#ADA0CB", "#7FB2A6", "#FFFEFC"],
    origin: { y: 0.7 },
  });
  playCompletionSound();
}
