(() => {
  const ALERT_TEXT = "IRL_KOFI_ALERT";
  const SOUND_URL =
    "https://philliefiffla.github.io/ssn-irl-alerts/bro.mp3";

  const audio = new Audio(SOUND_URL);
  audio.preload = "auto";
  audio.volume = 1.0;

  // Mobile Browser für spätere Audiowiedergabe "freischalten"
  const unlockAudio = () => {
    audio.play()
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
      })
      .catch(() => {});
  };

  document.addEventListener("click", unlockAudio, { once: true });
  document.addEventListener("touchstart", unlockAudio, { once: true });

  let lastTrigger = 0;

  function triggerAlert() {
    const now = Date.now();

    // verhindert Mehrfachauslösung derselben DOM-Änderung
    if (now - lastTrigger < 1500) return;
    lastTrigger = now;

    audio.currentTime = 0;
    audio.play().catch((err) => {
      console.warn("IRL Alert sound could not be played:", err);
    });
  }

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        const text = node.innerText || node.textContent || "";

        if (text.includes(ALERT_TEXT)) {
          triggerAlert();

          // Technische Trigger-Nachricht aus dem Chat entfernen
          node.style.display = "none";
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log("SSN IRL alerts loaded");
})();
