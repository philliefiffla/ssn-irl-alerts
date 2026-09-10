(() => {
  const SESSION = "bQJTDhLf84";
  const SOUND_URL = "https://philliefiffla.github.io/ssn-irl-alerts/bro.mp3";

  const audio = new Audio(SOUND_URL);
  audio.preload = "auto";

  let audioUnlocked = false;

  function unlockAudio() {
    if (audioUnlocked) return;

    audio.play()
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
        audioUnlocked = true;
        console.log("IRL audio unlocked");
      })
      .catch(() => {});
  }

  document.addEventListener("click", unlockAudio, { once: true });
  document.addEventListener("touchstart", unlockAudio, { once: true });

  function playAlert() {
    audio.currentTime = 0;
    audio.play().catch(err => {
      console.log("IRL alert audio blocked:", err);
    });
  }

  const socket = new WebSocket(
    "wss://io.socialstream.ninja/join/" + SESSION + "/9/10"
  );

  socket.addEventListener("open", () => {
    console.log("IRL alert websocket connected");
  });

  socket.addEventListener("message", event => {
    if (!event.data) return;

    let data;

    try {
      data = JSON.parse(event.data);
    } catch {
      data = event.data;
    }

    const text =
      typeof data === "string"
        ? data
        : JSON.stringify(data);

    if (text.includes("IRL_KOFI_ALERT")) {
      console.log("Ko-fi alert received");
      playAlert();
    }
  });
})();
