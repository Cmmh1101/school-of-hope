// Public blog listing: reads only published posts (enforced by RLS, see supabase/schema.sql).
// Each post carries separate ES/EN fields; this picks whichever matches the current site
// language and falls back to the other one if that language wasn't written for this post.
document.addEventListener("DOMContentLoaded", function () {
  var grid = document.querySelector("#blog-grid");
  var emptyState = document.querySelector("#blog-empty");
  if (!grid) return;

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }

  function currentLang() {
    return document.documentElement.getAttribute("lang") === "en" ? "en" : "es";
  }

  function pickContent(post) {
    var lang = currentLang();
    var other = lang === "es" ? "en" : "es";
    var usedLang = post["title_" + lang] ? lang : post["title_" + other] ? other : null;
    if (!usedLang) return null;
    return {
      lang: usedLang,
      title: post["title_" + usedLang],
      excerpt: post["excerpt_" + usedLang],
      onlyOneLang: !(post.title_es && post.title_en),
    };
  }

  function render(posts) {
    grid.innerHTML = "";
    var shown = 0;
    posts.forEach(function (post) {
      var content = pickContent(post);
      if (!content) return;
      shown++;
      var dateStr = post.published_at
        ? new Date(post.published_at).toLocaleDateString(content.lang === "en" ? "en-US" : "es-ES", { year: "numeric", month: "long", day: "numeric" })
        : "";
      var card = document.createElement("a");
      card.className = "card blog-card";
      card.href = "post.html?slug=" + encodeURIComponent(post.slug);
      card.innerHTML =
        (post.cover_image_url
          ? '<div class="blog-card-cover"><img src="' + post.cover_image_url + '" alt=""></div>'
          : "") +
        (content.onlyOneLang ? '<span class="lang-tag">' + content.lang.toUpperCase() + "</span>" : "") +
        "<h3>" + escapeHtml(content.title) + "</h3>" +
        (content.excerpt ? "<p>" + escapeHtml(content.excerpt) + "</p>" : "") +
        '<span class="card-cta">' + dateStr + "</span>";
      grid.appendChild(card);
    });
    if (!shown) {
      grid.innerHTML = "";
      emptyState.hidden = false;
    }
  }

  sb.from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .then(function (res) {
      if (res.error || !res.data || !res.data.length) {
        grid.innerHTML = "";
        emptyState.hidden = false;
        return;
      }
      render(res.data);
      // Re-render if the visitor switches language while on the page, so titles/excerpts
      // and the "only available in X" badge stay in sync.
      document.querySelectorAll(".lang-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          render(res.data);
        });
      });
    });
});
