(() => {

  const ALERT_MARKER = "IRL_KOFI_ALERT";
  const SOUND_URL = "https://philliefiffla.github.io/ssn-irl-alerts/bro.mp3";

  const audio = new Audio(SOUND_URL);
  audio.preload = "auto";

  function playAlert() {
    audio.currentTime = 0;

    audio.play().catch(error => {
      console.log("Alert-Sound konnte nicht abgespielt werden:", error);
    });
  }

  function containsAlertMarker(data) {
    try {
      if (typeof data === "string") {
        return data.includes(ALERT_MARKER);
      }

      return JSON.stringify(data).includes(ALERT_MARKER);

    } catch (e) {
      return false;
    }
  }

  if (typeof window.processInput === "function") {

    const originalProcessInput = window.processInput;

    window.processInput = function(data) {

      if (containsAlertMarker(data)) {
        console.log("IRL Ko-fi Alert erkannt");
        playAlert();

        // Nachricht NICHT an SSN weiterreichen
        // Dadurch erscheint sie nicht im Chat
        // und SSN kann keinen eigenen Beep dafür auslösen.
        return;
      }

      return originalProcessInput.apply(this, arguments);
    };

    console.log("IRL Alert-System aktiv");

  } else {
    console.log("processInput wurde nicht gefunden");
  }

})();
