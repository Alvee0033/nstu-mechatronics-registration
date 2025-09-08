(() => {
    const STORAGE_KEY = 'nstu_mec_orient_registrations'; // fallback local
    const COLLECTION = 'registrations';
    const META_DOC = 'meta/config';

    function getThursdayLabel() {
        const now = new Date();
        const day = now.getDay(); // 0 Sun ... 4 Thu
        const diffToThu = (4 - day + 7) % 7 || 7; // next Thursday
        const nextThu = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToThu);
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        return nextThu.toLocaleDateString(undefined, options);
    }

    const dateText = document.getElementById('dateText');
    if (dateText) { dateText.textContent = getThursdayLabel(); }
    // Setup countdown to next Thursday 2:00 PM local time
    (function setupCountdown(){
        const elD = document.getElementById('cdDays');
        const elH = document.getElementById('cdHours');
        const elM = document.getElementById('cdMins');
        const elS = document.getElementById('cdSecs');
        const iD = document.getElementById('cdDaysInline');
        const iH = document.getElementById('cdHoursInline');
        const iM = document.getElementById('cdMinsInline');
        const iS = document.getElementById('cdSecsInline');
        function flipUpdate(el, val) { if (el) el.textContent = val; }
        const inlineWrap = document.getElementById('countdownInline');
        const headerWrap = document.getElementById('countdown');
        const anyExists = (elD && elH && elM && elS) || (iD && iH && iM && iS);
        if (!anyExists) return;
        function nextThursdayAtTwo(){
            const now = new Date();
            const day = now.getDay();
            const diffToThu = (4 - day + 7) % 7 || 7; // next Thursday
            const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToThu, 14, 0, 0, 0);
            return target;
        }
        let target = nextThursdayAtTwo();
        function pad(n){ return String(n).padStart(2,'0'); }
        function tick(){
            const now = new Date();
            if (now >= target) target = nextThursdayAtTwo();
            const ms = target - now;
            const totalSec = Math.max(0, Math.floor(ms/1000));
            const days = Math.floor(totalSec / 86400);
            const hours = Math.floor((totalSec % 86400) / 3600);
            const mins = Math.floor((totalSec % 3600) / 60);
            const secs = totalSec % 60;
            const d = pad(days), h = pad(hours), m = pad(mins), s = pad(secs);
            if (elD) { elD.textContent = d; elH.textContent = h; elM.textContent = m; elS.textContent = s; headerWrap?.classList.remove('hidden'); }
            flipUpdate(iD, d); flipUpdate(iH, h); flipUpdate(iM, m); flipUpdate(iS, s); inlineWrap?.classList.remove('hidden');
        }
        tick();
        setInterval(tick, 1000);
    })();

    const form = document.getElementById('registrationForm');
    const successMsg = document.getElementById('successMsg');
    const seatInfo = document.getElementById('seatInfo');
    const ticketModal = document.getElementById('ticketModal');
    const closeTicket = document.getElementById('closeTicket');
    const tName = document.getElementById('tName');
    const tPhone = document.getElementById('tPhone');
    const tSession = document.getElementById('tSession');
    const tDept = document.getElementById('tDept');
    const tId = document.getElementById('tId');
    const downloadTicket = document.getElementById('downloadTicket');

    function readRegistrationsLocal() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; } }
    function writeRegistrationsLocal(list) { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }

    function setError(name, message) {
        const p = document.querySelector(`[data-error-for="${name}"]`);
        if (p) {
            p.textContent = message || '';
            p.classList.toggle('hidden', !message);
        }
    }

    function validate(values) {
        let ok = true;
        // Name: letters, spaces, 2-50 chars
        if (!/^([A-Za-z]+\s?){2,50}$/.test(values.name.trim())) {
            ok = false; setError('name', 'Enter 2-50 letters/spaces.');
        } else setError('name');

        // Phone: 10-15 digits
        if (!/^\d{10,15}$/.test(values.phone)) {
            ok = false; setError('phone', 'Enter 10-15 digits.');
        } else setError('phone');

        // Session required
        if (!values.session) { ok = false; setError('session', 'Select a session.'); } else setError('session');

        // Department required, min 2 chars
        if (!values.department || values.department.trim().length < 2) { ok = false; setError('department', 'Enter a department.'); } else setError('department');

        // Student ID: must start with MUH|ASH|BFK|BBH|BKH, end with M or F, total 11
        // Exception: if "(batch20)" present AND session === '2024-25', accept
        const upperId = String(values.studentId || '').toUpperCase();
        const isBatch20Exception = /\(BATCH20\)/i.test(values.studentId) && values.session === '2024-25';
        const idPattern = /^(MUH|ASH|BFK|BBH|BKH)[A-Z0-9]{7}[MF]$/;
        if (!(isBatch20Exception || idPattern.test(upperId))) {
            ok = false; setError('studentId', 'ID must start MUH/ASH/BFK/BBH/BKH, end with M or F (11 chars).');
        } else setError('studentId');

        return ok;
    }

    function hasDuplicate(list, values) {
        const phoneMatch = list.some(x => x.phone === values.phone);
        const idMatch = list.some(x => x.studentId.toUpperCase() === values.studentId.toUpperCase());
        return phoneMatch || idMatch;
    }

    async function getDbCounts() {
        try {
            const metaRef = db.doc(META_DOC);
            const metaSnap = await metaRef.get();
            const quota = metaSnap.exists && metaSnap.data().quota ? Number(metaSnap.data().quota) : 0;
            const regsSnap = await db.collection(COLLECTION).get();
            return { total: regsSnap.size, quota };
        } catch { return { total: readRegistrationsLocal().length, quota: 0 }; }
    }

    async function updateSeatInfo() {
        if (!seatInfo) return;
        const { total, quota } = await getDbCounts();
        if (quota > 0) {
            seatInfo.textContent = `${total} / ${quota} seats filled`;
            seatInfo.classList.remove('hidden');
            if (total >= quota && form) {
                form.classList.add('hidden');
                const full = document.createElement('div');
                full.className = 'mt-4 text-rose-300';
                full.textContent = 'Sorry, sign-up quota is full.';
                form.parentElement.appendChild(full);
            } else if (form) {
                form.classList.remove('hidden');
            }
        } else {
            seatInfo.classList.add('hidden');
        }
    }

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const overlay = document.getElementById('submitOverlay');
        overlay?.classList.add('show');
        const formData = new FormData(form);
        const values = {
            name: String(formData.get('name') || '').trim(),
            phone: String(formData.get('phone') || '').replace(/\D/g, ''),
            session: String(formData.get('session') || ''),
            department: String(formData.get('department') || '').trim(),
            studentId: String(formData.get('studentId') || '').trim(),
            timestamp: new Date().toISOString()
        };

        if (!validate(values)) return;

        try {
            // Check quota
            const { total, quota } = await getDbCounts();
            if (quota > 0 && total >= quota) {
                alert('Sorry, sign-up quota is full.');
                await updateSeatInfo();
                overlay?.classList.remove('show');
                return;
            }

            // Check duplicate in Firestore
            const dupQuery = await db.collection(COLLECTION)
                .where('studentId_upper', '==', values.studentId.toUpperCase())
                .where('session', '==', values.session)
                .limit(1)
                .get();
            const dupPhone = await db.collection(COLLECTION)
                .where('phone', '==', values.phone)
                .limit(1)
                .get();
            if (!dupQuery.empty || !dupPhone.empty) {
                alert('Duplicate entry: Phone or Student ID already registered.');
                overlay?.classList.remove('show');
                return;
            }

            await db.collection(COLLECTION).add({ ...values, studentId_upper: values.studentId.toUpperCase() });
        } catch (err) {
            // Fallback to local storage on error
            const list = readRegistrationsLocal();
            if (hasDuplicate(list, values)) { alert('Duplicate entry: Phone or Student ID already registered.'); overlay?.classList.remove('show'); return; }
            list.push(values);
            writeRegistrationsLocal(list);
        }

        successMsg?.classList.remove('hidden');
        const params = new URLSearchParams({
            name: values.name,
            phone: values.phone,
            session: values.session,
            department: values.department,
            studentId: values.studentId
        });
        overlay?.classList.remove('show');
        window.location.href = `./ticket.html?${params.toString()}`;
    });

    closeTicket?.addEventListener('click', () => {
        ticketModal?.classList.add('hidden');
        ticketModal?.classList.remove('flex');
    });

    downloadTicket?.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'pt');
        doc.setFontSize(16);
        doc.text('NSTU Mechatronics Club - Orientation Ticket', 40, 50);
        doc.setFontSize(11);
        doc.text('Venue: IQAC', 40, 70);
        doc.text('Time: 2:00 PM', 120, 70);
        const rows = [
            ['Name', tName?.textContent || ''],
            ['Phone', tPhone?.textContent || ''],
            ['Session', tSession?.textContent || ''],
            ['Department', tDept?.textContent || ''],
            ['Student ID', tId?.textContent || ''],
        ];
        doc.autoTable({
            head: [['Field', 'Value']],
            body: rows,
            startY: 95,
            styles: { fontSize: 11 },
            headStyles: { fillColor: [99,102,241] }
        });
        doc.save(`nstu_ticket_${(tId?.textContent||'').toString() || 'registration'}.pdf`);
    });

    // Initial
    updateSeatInfo();
})();


