// Blog admin panel. Access control is enforced server-side by Supabase Row Level Security
// (see supabase/schema.sql) — only an authenticated Supabase user can write posts, and the
// only way to become one is for you to create a user in the Supabase dashboard yourself
// (Authentication -> Users -> Add user), with public sign-up turned off. There is no
// sign-up form anywhere on this site.
document.addEventListener("DOMContentLoaded", function () {
  var loginView = document.querySelector("#admin-login");
  var dashView = document.querySelector("#admin-dashboard");
  var loginForm = document.querySelector("#login-form");
  var loginError = document.querySelector("#login-error");
  var logoutBtn = document.querySelector("#logout-btn");
  var postForm = document.querySelector("#post-form");
  var postsListEl = document.querySelector("#posts-list");
  var newPostBtn = document.querySelector("#new-post-btn");
  var cancelBtn = document.querySelector("#cancel-edit-btn");
  var slugInput = document.querySelector("#post-slug");
  var coverPreview = document.querySelector("#cover-preview");
  var saveStatus = document.querySelector("#save-status");
  var titleEsInput = document.querySelector("#post-title-es");
  var titleEnInput = document.querySelector("#post-title-en");
  var categorySelect = document.querySelector("#post-category");
  var passwordInput = document.querySelector("#login-password");
  var togglePasswordBtn = document.querySelector("#toggle-password-btn");

  var CATEGORY_LABELS = {
    noticias: "Noticias",
    educacion: "Educación",
    comunidad: "Comunidad",
    testimonios: "Testimonios",
    eventos: "Eventos",
  };

  var editingId = null;
  var slugTouched = false;

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }

  function slugify(text) {
    return (text || "")
      .toString()
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  // ---------- Quill editors (one per language) ----------
  var toolbarOptions = [
    [{ header: [2, 3, false] }],
    ["bold", "italic", "underline"],
    ["link", "image"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote"],
    ["clean"],
  ];

  function makeImageHandler(quill) {
    return function () {
      var input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = function () {
        var file = input.files[0];
        if (!file) return;
        var path = Date.now() + "-" + file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
        sb.storage
          .from("blog-images")
          .upload(path, file)
          .then(function (res) {
            if (res.error) {
              alert("Error al subir la imagen: " + res.error.message);
              return;
            }
            var url = sb.storage.from("blog-images").getPublicUrl(path).data.publicUrl;
            var range = quill.getSelection(true);
            quill.insertEmbed(range.index, "image", url, "user");
            quill.setSelection(range.index + 1);
          });
      };
      input.click();
    };
  }

  var quillEs = new Quill("#editor-es", { theme: "snow", modules: { toolbar: toolbarOptions } });
  var quillEn = new Quill("#editor-en", { theme: "snow", modules: { toolbar: toolbarOptions } });
  quillEs.getModule("toolbar").addHandler("image", makeImageHandler(quillEs));
  quillEn.getModule("toolbar").addHandler("image", makeImageHandler(quillEn));

  // ---------- Language tabs ----------
  document.querySelectorAll(".admin-lang-tabs button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var lang = btn.getAttribute("data-post-lang");
      document.querySelectorAll(".admin-lang-tabs button").forEach(function (b) {
        b.classList.toggle("active", b === btn);
      });
      document.querySelectorAll(".admin-lang-panel").forEach(function (panel) {
        panel.hidden = panel.getAttribute("data-lang-panel") !== lang;
      });
    });
  });

  // ---------- Password show/hide ----------
  togglePasswordBtn.addEventListener("click", function () {
    var show = passwordInput.type === "password";
    passwordInput.type = show ? "text" : "password";
    togglePasswordBtn.setAttribute("aria-label", show ? "Ocultar contraseña" : "Mostrar contraseña");
    togglePasswordBtn.classList.toggle("is-visible", show);
  });

  // ---------- Auth ----------
  function showDashboard() {
    loginView.hidden = true;
    dashView.hidden = false;
    logoutBtn.hidden = false;
    loadPosts();
  }
  function showLogin() {
    loginView.hidden = false;
    dashView.hidden = true;
    logoutBtn.hidden = true;
  }

  sb.auth.getSession().then(function (res) {
    if (res.data.session) showDashboard();
    else showLogin();
  });
  sb.auth.onAuthStateChange(function (_event, session) {
    if (session) showDashboard();
    else showLogin();
  });

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    loginError.hidden = true;
    sb.auth
      .signInWithPassword({ email: loginForm.email.value, password: loginForm.password.value })
      .then(function (res) {
        if (res.error) loginError.hidden = false;
      });
  });

  logoutBtn.addEventListener("click", function () {
    sb.auth.signOut();
  });

  // ---------- Slug auto-fill from whichever title is being typed ----------
  slugInput.addEventListener("input", function () {
    slugTouched = true;
  });
  [titleEsInput, titleEnInput].forEach(function (input) {
    input.addEventListener("input", function () {
      if (!slugTouched) slugInput.value = slugify(titleEsInput.value || titleEnInput.value);
    });
  });

  // ---------- Form reset / new / edit ----------
  function resetForm() {
    postForm.reset();
    editingId = null;
    slugTouched = false;
    quillEs.setContents([]);
    quillEn.setContents([]);
    document.querySelector("#post-form-title").textContent = "Nueva publicación";
    categorySelect.value = "";
    coverPreview.hidden = true;
    saveStatus.hidden = true;
    document.querySelector('.admin-lang-tabs button[data-post-lang="es"]').click();
  }

  newPostBtn.addEventListener("click", function () {
    resetForm();
    postForm.hidden = false;
    postForm.scrollIntoView({ behavior: "smooth" });
  });
  cancelBtn.addEventListener("click", function () {
    resetForm();
    postForm.hidden = true;
  });

  function editPost(post) {
    editingId = post.id;
    slugTouched = true;
    postForm.hidden = false;
    document.querySelector("#post-form-title").textContent = "Editar publicación";

    titleEsInput.value = post.title_es || "";
    document.querySelector("#post-excerpt-es").value = post.excerpt_es || "";
    quillEs.setContents([]);
    if (post.body_es) quillEs.clipboard.dangerouslyPasteHTML(post.body_es);

    titleEnInput.value = post.title_en || "";
    document.querySelector("#post-excerpt-en").value = post.excerpt_en || "";
    quillEn.setContents([]);
    if (post.body_en) quillEn.clipboard.dangerouslyPasteHTML(post.body_en);

    slugInput.value = post.slug;
    categorySelect.value = post.category || "";
    postForm.querySelector('input[name="status"][value="' + post.status + '"]').checked = true;

    if (post.cover_image_url) {
      coverPreview.src = post.cover_image_url;
      coverPreview.hidden = false;
    } else {
      coverPreview.hidden = true;
    }

    document.querySelector('.admin-lang-tabs button[data-post-lang="es"]').click();
    saveStatus.hidden = true;
    postForm.scrollIntoView({ behavior: "smooth" });
  }

  function deletePost(post) {
    if (!confirm('¿Eliminar "' + (post.title_es || post.title_en) + '"? Esta acción no se puede deshacer.')) return;
    sb.from("posts")
      .delete()
      .eq("id", post.id)
      .then(function (res) {
        if (res.error) {
          alert("Error al eliminar: " + res.error.message);
          return;
        }
        loadPosts();
      });
  }

  // ---------- Posts list ----------
  function loadPosts() {
    sb.from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .then(function (res) {
        if (res.error) {
          postsListEl.innerHTML = "<p>Error al cargar publicaciones.</p>";
          return;
        }
        renderPostsList(res.data);
      });
  }

  function renderPostsList(posts) {
    if (!posts.length) {
      postsListEl.innerHTML = '<p style="color:var(--ink-muted);">Aún no hay publicaciones. Crea la primera.</p>';
      return;
    }
    postsListEl.innerHTML = "";
    posts.forEach(function (post) {
      var statusLabel = post.status === "published" ? "Publicado" : "Borrador";
      var langsPresent = [];
      if (post.title_es && post.body_es) langsPresent.push("ES");
      if (post.title_en && post.body_en) langsPresent.push("EN");
      var displayTitle = post.title_es || post.title_en || "(sin título)";
      var categoryLabel = CATEGORY_LABELS[post.category] || "sin categoría";

      var row = document.createElement("div");
      row.className = "admin-post-row";
      row.innerHTML =
        "<div><strong>" + escapeHtml(displayTitle) + "</strong>" +
        '<span class="admin-post-meta">' + statusLabel + " · " + (langsPresent.join("/") || "sin idioma") + " · " + escapeHtml(categoryLabel) + " · /" + escapeHtml(post.slug) + "</span></div>";

      var actions = document.createElement("div");
      actions.className = "admin-post-actions";

      var editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "btn btn-outline-navy";
      editBtn.textContent = "Editar";
      editBtn.addEventListener("click", function () {
        editPost(post);
      });

      var delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "btn";
      delBtn.style.background = "#be5a34";
      delBtn.style.color = "#fff";
      delBtn.textContent = "Eliminar";
      delBtn.addEventListener("click", function () {
        deletePost(post);
      });

      actions.appendChild(editBtn);
      actions.appendChild(delBtn);
      row.appendChild(actions);
      postsListEl.appendChild(row);
    });
  }

  // ---------- Save ----------
  postForm.addEventListener("submit", function (e) {
    e.preventDefault();
    saveStatus.hidden = true;

    var bodyEs = DOMPurify.sanitize(quillEs.root.innerHTML.trim() === "<p><br></p>" ? "" : quillEs.root.innerHTML);
    var bodyEn = DOMPurify.sanitize(quillEn.root.innerHTML.trim() === "<p><br></p>" ? "" : quillEn.root.innerHTML);
    var hasEs = titleEsInput.value.trim() && bodyEs;
    var hasEn = titleEnInput.value.trim() && bodyEn;

    if (!hasEs && !hasEn) {
      saveStatus.textContent = "Completa al menos un idioma por completo (título + contenido) antes de guardar.";
      saveStatus.style.color = "#be5a34";
      saveStatus.hidden = false;
      saveStatus.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    var file = document.querySelector("#post-cover").files[0];

    function finishSave(coverUrl) {
      var payload = {
        slug: slugInput.value,
        title_es: hasEs ? titleEsInput.value.trim() : null,
        excerpt_es: hasEs ? document.querySelector("#post-excerpt-es").value : null,
        body_es: hasEs ? bodyEs : null,
        title_en: hasEn ? titleEnInput.value.trim() : null,
        excerpt_en: hasEn ? document.querySelector("#post-excerpt-en").value : null,
        body_en: hasEn ? bodyEn : null,
        category: categorySelect.value || null,
        status: postForm.querySelector('input[name="status"]:checked').value,
      };
      if (coverUrl) payload.cover_image_url = coverUrl;
      if (payload.status === "published") payload.published_at = new Date().toISOString();

      var req = editingId
        ? sb.from("posts").update(payload).eq("id", editingId)
        : sb.from("posts").insert(payload);

      req.then(function (res) {
        if (res.error) {
          saveStatus.textContent = "Error al guardar: " + res.error.message;
          saveStatus.style.color = "#be5a34";
          saveStatus.hidden = false;
          return;
        }
        resetForm();
        postForm.hidden = true;
        loadPosts();
      });
    }

    if (file) {
      var path = Date.now() + "-" + file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
      sb.storage
        .from("blog-images")
        .upload(path, file)
        .then(function (res) {
          if (res.error) {
            saveStatus.textContent = "Error al subir la portada: " + res.error.message;
            saveStatus.style.color = "#be5a34";
            saveStatus.hidden = false;
            return;
          }
          var publicUrl = sb.storage.from("blog-images").getPublicUrl(path).data.publicUrl;
          finishSave(publicUrl);
        });
    } else {
      finishSave(null);
    }
  });
});
