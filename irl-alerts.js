(() => {
  const SESSION = "bQJTDhLf84";
  const SOUND_URL = "https://philliefiffla.github.io/ssn-irl-alerts/bro.mp3";

  const audio = new Audio(SOUND_URL);
  audio.preload = "auto";

  // Audio auf iPhone/Safari einmal freischalten
  function unlockAudio() {
    audio.muted = true;

    audio.play().then(() => {
      audio.pause();
      audio.currentTime = 0;
      audio.muted = false;
      console.log("IRL Audio freigeschaltet");
    }).catch(() => {
      audio.muted = false;
    });
  }

  document.addEventListener("touchstart", unlockAudio, { once: true });
  document.addEventListener("click", unlockAudio, { once: true });

  function playAlert() {
    audio.currentTime = 0;

    audio.play().catch(err => {
      console.log("Sound blockiert:", err);
    });
  }

  function connect() {
    const socket = new WebSocket("wss://io.socialstream.ninja:443");

    socket.onopen = () => {
      socket.send(JSON.stringify({
        join: SESSION,
        out: 3,
        in: 4
      }));

      console.log("IRL WebSocket verbunden");
    };

    socket.onmessage = event => {
      console.log("IRL empfangen:", event.data);

      if (event.data && event.data.includes("IRL_KOFI_ALERT")) {
        playAlert();
      }
    };

    socket.onclose = () => {
      setTimeout(connect, 2000);
    };
  }

  connect();
})();
