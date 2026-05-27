function moveRandomEl(elm) {
  elm.style.position = "absolute";
  elm.style.top = Math.floor(Math.random() * 90 + 5) + "%";
  elm.style.left = Math.floor(Math.random() * 90 + 5) + "%";
}

document.addEventListener("DOMContentLoaded", function () {
  const moveRandom = document.querySelector("#move-random");
  if (moveRandom) {
    moveRandom.addEventListener("mouseenter", function (e) {
      moveRandomEl(e.target);
    });
  }

  const yesLinks = document.querySelectorAll('a[href="yes.html"]');
  if (yesLinks.length > 0) {
    yesLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        try {
          sessionStorage.setItem("playMaya", "1");
        } catch (err) {
          // Ignore storage errors and continue.
        }
        e.preventDefault();
        window.location.href = link.getAttribute("href");
      });
    });
  }

  let yesAudio = null;
  let yesAudioLoaded = false;
  const yesAudioSrc = "./maya01.mp3";

  function getYesAudio() {
    if (yesAudio) return yesAudio;

    yesAudio = document.createElement("audio");
    yesAudio.preload = "auto";
    yesAudio.loop = true;
    yesAudio.volume = 0.6;
    yesAudio.playsInline = true;
    document.body.appendChild(yesAudio);

    return yesAudio;
  }

  function loadYesAudio() {
    if (yesAudioLoaded) return;
    const audio = getYesAudio();
    audio.src = yesAudioSrc;
    yesAudioLoaded = true;
  }

  async function startYesAudio() {
    const audio = getYesAudio();
    loadYesAudio();
    try {
      await audio.play();
    } catch (err) {
      // Ignore play errors to avoid blocking the page.
    }
  }

  function primeYesAudioStart() {
    let started = false;

    const tryStart = async function () {
      if (started) return;
      started = true;
      removeListeners();
      await startYesAudio();
    };

    const removeListeners = function () {
      document.removeEventListener("click", tryStart);
      document.removeEventListener("touchstart", tryStart);
      document.removeEventListener("keydown", tryStart);
    };

    document.addEventListener("click", tryStart);
    document.addEventListener("touchstart", tryStart, { passive: true });
    document.addEventListener("keydown", tryStart);

    startYesAudio().catch(function () {});
  }

  const isYesPage =
    window.location.pathname.toLowerCase().endsWith("/yes.html") ||
    window.location.pathname.toLowerCase().endsWith("\\yes.html");

  if (isYesPage) {
    try {
      sessionStorage.removeItem("playMaya");
    } catch (err) {
      // Ignore storage errors.
    }
    primeYesAudioStart();
  } else if (sessionStorage.getItem("playMaya") === "1") {
    try {
      sessionStorage.removeItem("playMaya");
    } catch (err) {
      // Ignore storage errors.
    }
    primeYesAudioStart();
  }
});
