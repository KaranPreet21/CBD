#fixed issue in main.js - gurkaram06
// ---- Config ----
const API = "http://127.0.0.1:5000/api";
let currentRole = null;

// ---- On load: check session and show login or dashboard
window.onload = async function () {
    await checkSession();
    // Setup logout button
    document.getElementById('logout-btn').onclick = doLogout;
};

// ---- Login ----
document.getElementById('login-form').onsubmit = async function (e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const res = await fetch(API + "/login", {
        method: 'POST',
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
        showAlert('Login successful!', 'success');
        await checkSession();
    } else {
        showAlert(data.msg || 'Login failed', 'danger');
        document.getElementById('login-alert').innerText = data.msg || 'Login failed';
        document.getElementById('login-alert').classList.remove('d-none');
    }
};

// ---- Check session, show correct dashboard ----
async function checkSession() {
    const res = await fetch(API + "/session", { credentials: "include" });
    const data = await res.json();
    hideAll();
    if (data.logged_in) {
        document.getElementById('nav-username').innerText = data.name;
        document.getElementById('logout-btn').classList.remove('d-none');
        currentRole = data.role_id;
        if (currentRole == 1) showAdminDashboard(data.name);
        else if (currentRole == 2) showTutorDashboard(data.name);
        else showStudentDashboard(data.name);
    } else {
        document.getElementById('login-section').classList.remove('d-none');
        document.getElementById('nav-username').innerText = "";
        document.getElementById('logout-btn').classList.add('d-none');
        currentRole = null;
    }
}

// ---- Hide all dashboards ----
function hideAll() {
    document.getElementById('login-section').classList.add('d-none');
    document.getElementById('student-dashboard').classList.add('d-none');
    document.getElementById('tutor-dashboard').classList.add('d-none');
    document.getElementById('admin-dashboard').classList.add('d-none');
    document.getElementById('login-alert').classList.add('d-none');
}

// ---- Logout ----
async function doLogout() {
    await fetch(API + "/logout", { method: "POST", credentials: "include" });
    showAlert('Logged out', 'info');
    await checkSession();
}

// ---- Dashboard loaders ----
async function showStudentDashboard(name) {
    document.getElementById('student-name').innerText = name;
    document.getElementById('student-dashboard').classList.remove('d-none');
    loadSubjects('student-subject-filter');
    loadArticles('student-articles', 'student-subject-filter', 'search-student');
    document.getElementById('student-subject-filter').onchange = () => loadArticles('student-articles', 'student-subject-filter', 'search-student');
    document.getElementById('search-student').oninput = () => loadArticles('student-articles', 'student-subject-filter', 'search-student');
}
async function showTutorDashboard(name) {
    document.getElementById('tutor-name').innerText = name;
    document.getElementById('tutor-dashboard').classList.remove('d-none');
    loadSubjects('tutor-subject-filter');
    loadArticles('tutor-articles', 'tutor-subject-filter', 'search-tutor', true);
    document.getElementById('tutor-subject-filter').onchange = () => loadArticles('tutor-articles', 'tutor-subject-filter', 'search-tutor', true);
    document.getElementById('search-tutor').oninput = () => loadArticles('tutor-articles', 'tutor-subject-filter', 'search-tutor', true);
    // Add modal hook for Add
    document.getElementById('article-form').onsubmit = submitArticleForm;
    setupArticleModal();
}
async function showAdminDashboard(name) {
    document.getElementById('admin-name').innerText = name;
    document.getElementById('admin-dashboard').classList.remove('d-none');
    loadSubjects('admin-subject-filter');
    loadArticles('admin-articles', 'admin-subject-filter', 'search-admin', true, true);
    document.getElementById('admin-subject-filter').onchange = () => loadArticles('admin-articles', 'admin-subject-filter', 'search-admin', true, true);
    document.getElementById('search-admin').oninput = () => loadArticles('admin-articles', 'admin-subject-filter', 'search-admin', true, true);
    document.getElementById('article-form').onsubmit = submitArticleForm;
    setupArticleModal();
}

// ---- Load subjects for dropdown ----
async function loadSubjects(selectId) {
    const res = await fetch(API + "/subjects");
    const data = await res.json();
    const sel = document.getElementById(selectId);
    sel.innerHTML = `<option value="">All Subjects</option>`;
    data.forEach(subj => {
        sel.innerHTML += `<option value="${subj.SubjectName}">${subj.SubjectName}</option>`;
    });
}

// ---- Load articles, display as cards ----
async function loadArticles(divId, subjectSelId, searchBoxId, canEdit = false, canDelete = false) {
    let url = API + "/articles";
    const subject = document.getElementById(subjectSelId).value;
    const keyword = document.getElementById(searchBoxId).value.trim();
    let params = [];
    if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
    if (keyword) params.push(`keyword=${encodeURIComponent(keyword)}`);
    if (params.length) url += '?' + params.join('&');
    const res = await fetch(url, { credentials: "include" });
    const data = await res.json();
    const div = document.getElementById(divId);
    div.innerHTML = '';
    data.forEach(article => {
        div.innerHTML += renderArticleCard(article, canEdit, canDelete);
    });
    // Add Edit/Delete hooks
    if (canEdit) {
        document.querySelectorAll('.edit-article-btn').forEach(btn => {
            btn.onclick = () => openArticleModal(btn.dataset.id);
        });
    }
    if (canDelete) {
        document.querySelectorAll('.delete-article-btn').forEach(btn => {
            btn.onclick = () => deleteArticle(btn.dataset.id);
        });
    }
}

// ---- Article card renderer ----
function renderArticleCard(article, canEdit, canDelete) {
    return `
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card shadow-sm h-100">
        <div class="card-body">
            <h5 class="card-title">${article.Title}</h5>
            <p class="mb-1"><strong>Category:</strong> ${article.Category || '-'}</p>
            <p class="mb-1"><strong>Type:</strong> ${article.Type || '-'}</p>
            <p class="mb-1"><strong>Year:</strong> ${article.Year || '-'}</p>
            <p class="mb-1"><strong>Location:</strong> ${article.Location || '-'}</p>
            <p class="mb-1"><strong>Medium:</strong> ${article.Medium || '-'}</p>
            ${canEdit ? `<button class="btn btn-sm btn-primary edit-article-btn" data-id="${article.ArticleID}">Edit</button>` : ''}
            ${canDelete ? `<button class="btn btn-sm btn-danger ms-2 delete-article-btn" data-id="${article.ArticleID}">Delete</button>` : ''}
        </div>
      </div>
    </div>`;
}

// ---- Article Modal (for Add/Edit) ----
let currentEditId = null;
async function setupArticleModal() {
    // Load dropdowns
    const subjRes = await fetch(API + "/subjects");
    const subjects = await subjRes.json();
    const subjSel = document.getElementById('article-subject');
    subjSel.innerHTML = '';
    subjects.forEach(s => {
        subjSel.innerHTML += `<option value="${s.SubjectID}">${s.SubjectName}</option>`;
    });
    const pplRes = await fetch(API + "/people");
    const people = await pplRes.json();
    const pplSel = document.getElementById('article-person');
    pplSel.innerHTML = '<option value="">None</option>';
    people.forEach(p => {
        pplSel.innerHTML += `<option value="${p.PersonID}">${p.Name}</option>`;
    });
    // Clear form
    clearArticleForm();
    // Modal: clear on open
    const articleModal = document.getElementById('articleModal');
    articleModal.addEventListener('show.bs.modal', clearArticleForm);
}
function clearArticleForm() {
    currentEditId = null;
    document.getElementById('article-id').value = '';
    document.getElementById('article-title').value = '';
    document.getElementById('article-category').value = '';
    document.getElementById('article-type').value = '';
    document.getElementById('article-year').value = '';
    document.getElementById('article-medium').value = '';
    document.getElementById('article-dimensions').value = '';
    document.getElementById('article-location').value = '';
    document.getElementById('article-designedby').value = '';
    document.getElementById('article-developer').value = '';
    document.getElementById('article-subject').selectedIndex = 0;
    document.getElementById('article-person').selectedIndex = 0;
    document.getElementById('articleModalLabel').innerText = "Add Article";
}

async function openArticleModal(id) {
    currentEditId = id;
    // Load article data
    const res = await fetch(API + "/articles/" + id, { credentials: "include" });
    const art = await res.json();
    document.getElementById('article-id').value = art.ArticleID;
    document.getElementById('article-title').value = art.Title || '';
    document.getElementById('article-category').value = art.Category || '';
    document.getElementById('article-type').value = art.Type || '';
    document.getElementById('article-year').value = art.Year || '';
    document.getElementById('article-medium').value = art.Medium || '';
    document.getElementById('article-dimensions').value = art.Dimensions || '';
    document.getElementById('article-location').value = art.Location || '';
    document.getElementById('article-designedby').value = art.DesignedBy || '';
    document.getElementById('article-developer').value = art.Developer || '';
    document.getElementById('article-subject').value = art.SubjectID || '';
    document.getElementById('article-person').value = art.PersonID || '';
    document.getElementById('articleModalLabel').innerText = "Edit Article";
    let modal = new bootstrap.Modal(document.getElementById('articleModal'));
    modal.show();
}

// ---- Article Add/Edit Submission ----
async function submitArticleForm(e) {
    e.preventDefault();
    let id = document.getElementById('article-id').value;
    let article = {
        Title: document.getElementById('article-title').value,
        Category: document.getElementById('article-category').value,
        Type: document.getElementById('article-type').value,
        Year: document.getElementById('article-year').value,
        Medium: document.getElementById('article-medium').value,
        Dimensions: document.getElementById('article-dimensions').value,
        Location: document.getElementById('article-location').value,
        DesignedBy: document.getElementById('article-designedby').value,
        Developer: document.getElementById('article-developer').value,
        SubjectID: document.getElementById('article-subject').value,
        PersonID: document.getElementById('article-person').value || null
    };
    let url = API + "/articles";
    let method = "POST";
    if (id) {
        url += "/" + id;
        method = "PUT";
    }
    const res = await fetch(url, {
        method: method,
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article)
    });
    const data = await res.json();
    if (data.success) {
        showAlert('Article saved!', 'success');
        bootstrap.Modal.getInstance(document.getElementById('articleModal')).hide();
        await checkSession(); // reload dashboard
    } else {
        showAlert(data.msg || "Error saving article", "danger");
    }
}

// ---- Delete Article ----
async function deleteArticle(id) {
    if (!confirm("Delete this article?")) return;
    const res = await fetch(API + "/articles/" + id, {
        method: "DELETE",
        credentials: "include"
    });
    const data = await res.json();
    if (data.success) {
        showAlert('Article deleted!', 'success');
        await checkSession();
    } else {
        showAlert(data.msg || "Delete failed", "danger");
    }
}

// ---- Simple Alert Helper ----
function showAlert(msg, type) {
    let alert = document.getElementById('main-alert');
    alert.innerText = msg;
    alert.className = 'alert alert-' + type;
    alert.classList.remove('d-none');
    setTimeout(() => { alert.classList.add('d-none'); }, 2500);
}
