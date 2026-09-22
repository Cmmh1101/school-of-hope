// Language toggle: shows/hides every [data-lang] element to match the selected language and
// remembers the choice in localStorage. Add a language by giving new elements a matching
// data-lang value (e.g. data-lang="fr") and a third button with data-set-lang="fr" in the
// .lang-switch markup on every page.
var SUPPORTED_LANGS = ["es", "en"];

function setLanguage(lang) {
  if (SUPPORTED_LANGS.indexOf(lang) === -1) lang = "es";

  document.querySelectorAll("[data-lang]").forEach(function (el) {
    var isHidden = el.getAttribute("data-lang") !== lang;
    el.hidden = isHidden;
    // A hidden <input>/<select>/<textarea> still submits with the form unless it's also
    // disabled — matters for fields duplicated per language (like the subject dropdown).
    if ("disabled" in el) el.disabled = isHidden;
  });
  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    btn.classList.toggle("active", btn.getAttribute("data-set-lang") === lang);
  });
  document.documentElement.setAttribute("lang", lang);

  try {
    localStorage.setItem("site-lang", lang);
  } catch (e) {
    /* private browsing / storage blocked — language just won't persist across pages */
  }
}

function getInitialLanguage() {
  try {
    var saved = localStorage.getItem("site-lang");
    if (saved) return saved;
  } catch (e) {
    /* ignore */
  }
  return navigator.language && navigator.language.toLowerCase().indexOf("en") === 0 ? "en" : "es";
}

document.addEventListener("DOMContentLoaded", function () {
  setLanguage(getInitialLanguage());

  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLanguage(btn.getAttribute("data-set-lang"));
    });
  });

  // Menú móvil: abre/cierra la navegación en pantallas pequeñas.
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
  }

  // Contact form submission lives in js/contact.js (posts real leads to Supabase).

  // Hero background video (YouTube): starts muted for autoplay, this button lets
  // visitors turn sound on/off via postMessage to the embed (needs enablejsapi=1 on the iframe src).
  var ytMuteBtn = document.querySelector(".yt-mute-toggle");
  var ytFrame = document.querySelector(".yt-bg-wrap iframe");
  if (ytMuteBtn && ytFrame) {
    var ytMuteLabels = {
      es: { muted: "Activar sonido", unmuted: "Silenciar" },
      en: { muted: "Turn on sound", unmuted: "Mute" },
    };
    ytMuteBtn.addEventListener("click", function () {
      var willMute = !ytMuteBtn.classList.contains("is-muted");
      ytFrame.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: willMute ? "mute" : "unMute", args: [] }),
        "*"
      );
      ytMuteBtn.classList.toggle("is-muted", willMute);
      var lang = document.documentElement.getAttribute("lang") === "en" ? "en" : "es";
      ytMuteBtn.setAttribute("aria-label", willMute ? ytMuteLabels[lang].muted : ytMuteLabels[lang].unmuted);
    });
  }
});
