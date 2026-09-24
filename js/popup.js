(function () {
  var SHOWN_KEY = "sohPromoPopupShown";
  var REGISTER_URL = "https://academy.schoolofhopeinternational.org/registro";
  var DONATE_URL = "https://www.paypal.com/donate?hosted_button_id=JWBZEQHW76WC4";

  if (sessionStorage.getItem(SHOWN_KEY)) return;

  function buildPopup() {
    var overlay = document.createElement("div");
    overlay.className = "promo-popup-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.innerHTML =
      '<div class="promo-popup">' +
        '<button type="button" class="promo-popup-close" aria-label="Cerrar / Close">&times;</button>' +
        '<img src="assets/popup-promo.webp" alt="School of Hope International" class="promo-popup-image">' +
        '<div class="promo-popup-actions">' +
          '<a href="' + REGISTER_URL + '" target="_blank" rel="noopener" class="btn btn-primary">' +
            '<span data-lang="es">Inscríbete</span><span data-lang="en" hidden>Register</span>' +
          '</a>' +
          '<a href="' + DONATE_URL + '" target="_blank" rel="noopener" class="btn btn-outline-navy">' +
            '<span data-lang="es">Donar</span><span data-lang="en" hidden>Donate</span>' +
          '</a>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    if (window.getInitialLanguage) {
      var lang = window.getInitialLanguage();
      overlay.querySelectorAll("[data-lang]").forEach(function (el) {
        el.hidden = el.getAttribute("data-lang") !== lang;
      });
    }

    function close() {
      overlay.classList.remove("is-open");
      setTimeout(function () {
        overlay.remove();
      }, 200);
      sessionStorage.setItem(SHOWN_KEY, "1");
    }

    overlay.querySelector(".promo-popup-close").addEventListener("click", close);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", function onKey(e) {
      if (e.key === "Escape") {
        close();
        document.removeEventListener("keydown", onKey);
      }
    });

    requestAnimationFrame(function () {
      overlay.classList.add("is-open");
    });
  }

  window.addEventListener("load", function () {
    setTimeout(buildPopup, 3000);
  });
})();
