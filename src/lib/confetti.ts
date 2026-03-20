import confetti from "canvas-confetti";

const colors = [
  "#26ccff",
  "#a25afd",
  "#ff5e7e",
  "#88ff5a",
  "#fcff42",
  "#ffa62d",
  "#ff36ff",
];

/**
 * Fireworks-style confetti for major victories (Game Win)
 */
export const fireworkConfetti = () => {
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 9999,
    colors,
    scalar: 0.5,
  };

  const randomInRange = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const interval: any = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // Since they fall down, start them higher than random
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
};

/**
 * Side bursts for level-up or correct answers
 */
export const sideConfetti = () => {
  const end = Date.now() + 0.5 * 1000;

  (function frame() {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.75 },
      colors: colors,
      zIndex: 9999,
      scalar: 0.5,
      gravity: 2,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.75 },
      colors: colors,
      zIndex: 9999,
      scalar: 0.5,
      gravity: 2,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
};

/**
 * Simple pop at a specific location
 */
export const popConfetti = (x = 0.5, y = 0.5) => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x, y },
    colors: colors,
    zIndex: 9999,
  });
};
