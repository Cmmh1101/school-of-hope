// Public single-post view: reads only a published post matching ?slug=... (enforced by RLS).
// Picks whichever language field matches the current site toggle, falling back to whichever
// language was actually written if the post only has one. Body HTML comes from the admin's
// WYSIWYG editor and is sanitized with DOMPurify before being rendered.
document.addEventListener("DOMContentLoaded", function () {
  var container = document.querySelector("#post-content");
  if (!container) return;

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }

  function currentLang() {
    return document.documentElement.getAttribute("lang") === "en" ? "en" : "es";
  }

  function showNotFound() {
    container.innerHTML =
      '<div style="text-align:center; padding:60px 20px;">' +
      '<h1 style="margin-bottom:14px;">Publicación no encontrada</h1>' +
      '<p style="color:var(--ink-muted); margin-bottom:24px;">Es posible que este enlace haya cambiado o que la publicación ya no esté disponible.</p>' +
      '<a href="blog.html" class="btn btn-primary">Volver al blog</a>' +
      "</div>";
  }

  function renderPost(post) {
    var lang = currentLang();
    var other = lang === "es" ? "en" : "es";
    var usedLang = post["title_" + lang] ? lang : post["title_" + other] ? other : null;

    if (!usedLang) {
      showNotFound();
      return;
    }

    var title = post["title_" + usedLang];
    var body = post["body_" + usedLang];
    var onlyOneLang = !(post.title_es && post.title_en);

    document.title = title + " — School of Hope International";
    var dateStr = post.published_at
      ? new Date(post.published_at).toLocaleDateString(usedLang === "en" ? "en-US" : "es-ES", { year: "numeric", month: "long", day: "numeric" })
      : "";
    var backLabel = usedLang === "en" ? "Blog" : "Blog";

    var html =
      '<p class="breadcrumb"><a href="blog.html">' + backLabel + "</a> / " + escapeHtml(title) + "</p>" +
      (onlyOneLang ? '<span class="lang-tag">' + usedLang.toUpperCase() + "</span>" : "") +
      '<h1 style="margin:10px 0 8px;">' + escapeHtml(title) + "</h1>" +
      '<p style="color:var(--ink-muted); margin-bottom:28px;">' + dateStr + "</p>";
    if (post.cover_image_url) {
      html += '<img src="' + post.cover_image_url + '" alt="" style="width:100%; border-radius:12px; margin-bottom:28px;">';
    }
    html += '<div class="post-body">' + DOMPurify.sanitize(body) + "</div>";
    container.innerHTML = html;
  }

  var slug = new URLSearchParams(window.location.search).get("slug");
  if (!slug) {
    showNotFound();
    return;
  }

  sb.from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single()
    .then(function (res) {
      if (res.error || !res.data) {
        showNotFound();
        return;
      }
      renderPost(res.data);
      document.querySelectorAll(".lang-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          renderPost(res.data);
        });
      });
    });
});
