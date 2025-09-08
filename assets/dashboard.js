(() => {
    const STORAGE_KEY = 'nstu_mec_orient_registrations';
    const AUTH_KEY = 'nstu_dashboard_auth';
    const COLLECTION = 'registrations';
    const META_DOC = 'meta/config';

    function readRegistrations() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
    }

    const search = document.getElementById('search');
    const filterSession = document.getElementById('filterSession');
    const tableBody = document.getElementById('tableBody');
    const count = document.getElementById('count');
    const downloadBtn = document.getElementById('downloadPdf');

    async function fetchRegistrations() {
        try {
            const snap = await db.collection(COLLECTION).orderBy('timestamp', 'desc').get();
            return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch {
            return readRegistrations();
        }
    }

    async function render() {
        const q = (search?.value || '').toLowerCase().trim();
        const sess = filterSession?.value || '';
        const dataAll = await fetchRegistrations();
        const data = dataAll
            .filter(item => !sess || item.session === sess)
            .filter(item => {
                const hay = `${item.name} ${item.phone} ${item.studentId}`.toLowerCase();
                return !q || hay.includes(q);
            });

        count.textContent = String(data.length);
        tableBody.innerHTML = data.map((item, idx) => {
            const dt = new Date(item.timestamp);
            const time = dt.toLocaleString();
            return `<tr class="hover:bg-slate-900/50">\
                <td class="p-3 text-slate-400">${idx + 1}</td>\
                <td class="p-3">${escapeHtml(item.name)}</td>\
                <td class="p-3">${escapeHtml(item.phone)}</td>\
                <td class="p-3">${escapeHtml(item.session)}</td>\
                <td class="p-3">${escapeHtml(item.department)}</td>\
                <td class="p-3 tracking-wider">${escapeHtml(item.studentId)}</td>\
                <td class="p-3 text-slate-400">${escapeHtml(time)}</td>\
                <td class="p-3"><button data-del="${item.id || ''}" class="rounded-lg border border-rose-600/60 text-rose-300 px-2 py-1 hover:bg-rose-900/30">Delete</button></td>\
            </tr>`;
        }).join('');

        // Bind delete buttons
        tableBody.querySelectorAll('button[data-del]')?.forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-del');
                if (!id) return;
                const overlay = document.getElementById('dashOverlay');
                const otext = document.getElementById('dashOverlayText');
                otext && (otext.textContent = 'Deleting...');
                overlay?.classList.remove('hidden');
                overlay?.classList.add('flex');
                try {
                    await db.collection(COLLECTION).doc(id).delete();
                } catch {}
                overlay?.classList.add('hidden');
                overlay?.classList.remove('flex');
                render();
            });
        });
    }

    function escapeHtml(str) {
        return String(str).replace(/[&<>\"]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]));
    }

    search?.addEventListener('input', () => { render(); });
    filterSession?.addEventListener('change', () => { render(); });

    downloadBtn?.addEventListener('click', async () => {
        const q = (search?.value || '').toLowerCase().trim();
        const sess = filterSession?.value || '';
        const data = await fetchRegistrations();
        const filtered = data
            .filter(item => !sess || item.session === sess)
            .filter(item => {
                const hay = `${item.name} ${item.phone} ${item.studentId}`.toLowerCase();
                return !q || hay.includes(q);
            });
        const rows = filtered
            .map((item, idx) => [idx + 1, item.name, item.phone, item.session, item.department, item.studentId, new Date(item.timestamp).toLocaleString()]);

        const totalText = `Total sign-ups: ${filtered.length}`;

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'pt');
        doc.setFontSize(14);
        doc.text('NSTU Mechatronics Club - Orientation Sign-ups', 40, 40);
        doc.setFontSize(10);
        doc.text('Venue: IQAC • Time: 2:00 PM • Date: Thursday', 40, 58);
        doc.setFontSize(11);
        doc.text(totalText, 40, 72);
        doc.autoTable({
            head: [['#', 'Name', 'Phone', 'Session', 'Department', 'Student ID', 'Time']],
            body: rows,
            startY: 90,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [99,102,241] }
        });
        doc.save('nstu_mechatronics_orientation_signups.pdf');
    });

    function showApp() {
        const app = document.getElementById('appContent');
        const overlay = document.getElementById('loginOverlay');
        app?.classList.remove('hidden');
        overlay?.classList.add('hidden');
        loadQuota();
        render();
    }

    function tryAutoLogin() {
        try {
            const token = sessionStorage.getItem(AUTH_KEY);
            if (token === 'ok') { showApp(); }
        } catch {}
    }

    const loginForm = document.getElementById('loginForm');
    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const u = document.getElementById('loginUser');
        const p = document.getElementById('loginPass');
        const err = document.getElementById('loginError');
        const user = u?.value?.trim();
        const pass = p?.value || '';
        if (user === 'Alvee1177' && pass === 'alvee6969') {
            sessionStorage.setItem(AUTH_KEY, 'ok');
            showApp();
        } else {
            err?.classList.remove('hidden');
        }
    });

    // Quota controls
    const quotaText = document.getElementById('quotaText');
    const quotaInput = document.getElementById('quotaInput');
    const saveQuota = document.getElementById('saveQuota');
    const saveQuotaText = document.getElementById('saveQuotaText');
    const saveQuotaSpinner = document.getElementById('saveQuotaSpinner');
    async function loadQuota() {
        try {
            const snap = await db.doc(META_DOC).get();
            const q = snap.exists ? Number(snap.data().quota || 0) : 0;
            if (quotaText) quotaText.textContent = q ? String(q) : '—';
        } catch { if (quotaText) quotaText.textContent = '—'; }
    }
    saveQuota?.addEventListener('click', async () => {
        const val = Number(quotaInput.value || 0);
        saveQuotaSpinner?.classList.remove('hidden');
        saveQuotaText && (saveQuotaText.textContent = 'Saving...');
        await db.doc(META_DOC).set({ quota: val }, { merge: true });
        await loadQuota();
        saveQuotaSpinner?.classList.add('hidden');
        saveQuotaText && (saveQuotaText.textContent = 'Save');
        await render();
    });

    tryAutoLogin();
})();


