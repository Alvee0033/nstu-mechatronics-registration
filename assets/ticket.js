(function(){
  function getParam(name){
    const url = new URL(window.location.href);
    return url.searchParams.get(name) || '';
  }
  const name = getParam('name');
  const phone = getParam('phone');
  const session = getParam('session');
  const department = getParam('department');
  const studentId = getParam('studentId');

  document.getElementById('tName').textContent = name;
  document.getElementById('tPhone').textContent = phone;
  document.getElementById('tSession').textContent = session;
  document.getElementById('tDept').textContent = department;
  document.getElementById('tId').textContent = studentId;

  document.getElementById('downloadTicket').addEventListener('click', async () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'pt');

    // Accessible, high-contrast palette
    const accent = [37, 99, 235];     // blue-600
    const accentLight = [191, 219, 254]; // blue-200
    const text = [17, 24, 39];         // slate-900
    const muted = [55, 65, 81];        // slate-700
    const lightBg = [248, 250, 252];   // slate-50

    const pageW = doc.internal.pageSize.getWidth();

    // Header (light, with accent underline)
    doc.setFillColor(255,255,255);
    doc.rect(0, 0, pageW, 96, 'F');
    doc.setDrawColor(...accent);
    doc.setLineWidth(2);
    doc.line(0, 96, pageW, 96);

    doc.setTextColor(...text);
    doc.setFontSize(20);
    doc.text('NSTU Mechatronics Club', 40, 44);
    doc.setFontSize(12);
    doc.setTextColor(...muted);
    doc.text('Orientation Ticket', 40, 68);

    // Logo
    try {
      const img = await loadImage('./assets/logo.png');
      doc.addImage(img, 'PNG', pageW - 40 - 64, 20, 64, 64);
    } catch {}

    // Ticket container (very light background)
    const x = 40, y = 120, w = pageW - 80, h = 360;
    doc.setFillColor(...lightBg);
    doc.setDrawColor(...accent);
    doc.setLineWidth(1.2);
    roundedRect(doc, x, y, w, h, 12);
    doc.rect(x, y, w, h, 'F');

    // Venue/time chips (high contrast)
    doc.setFontSize(10);
    chip(doc, x + 14, y + 18, 'IQAC', accent, text);
    chip(doc, x + 80, y + 18, '2:00 PM', accent, text);

    // Title
    doc.setTextColor(...text);
    doc.setFontSize(16);
    doc.text('Registration Details', x + 14, y + 60);

    // Details table (readable rows)
    const rows = [
      ['Name', name],
      ['Phone', phone],
      ['Session', session],
      ['Department', department],
      ['Student ID', studentId]
    ];
    doc.autoTable({
      head: [['Field', 'Value']],
      body: rows,
      startY: y + 78,
      margin: { left: x + 12, right: x + 12 },
      styles: { fontSize: 12, cellPadding: 6, textColor: text },
      headStyles: { fillColor: accent, textColor: 255 },
      bodyStyles: { fillColor: [255,255,255] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      theme: 'grid'
    });

    // Perforation & barcode (subtle)
    const barY = y + h - 54;
    dashedLine(doc, x + 12, barY - 12, x + w - 12, muted);
    barcode(doc, x + 12, barY, w - 24, 26, muted);

    const file = `nstu_ticket_${(studentId||'').toString() || 'registration'}.pdf`;
    doc.save(file);
  });

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  function roundedRect(doc, x, y, w, h, r) {
    doc.roundedRect(x, y, w, h, r, r, 'S');
  }

  function dashedLine(doc, x1, y, x2, color=[148,163,184]) {
    doc.setDrawColor(...color);
    doc.setLineWidth(0.6);
    const dash = 6, gap = 4;
    let x = x1;
    while (x < x2) {
      const end = Math.min(x + dash, x2);
      doc.line(x, y, end, y);
      x = end + gap;
    }
  }

  function barcode(doc, x, y, w, h, color=[71,85,105]) {
    doc.setDrawColor(...color);
    const bars = Math.floor(w / 4);
    for (let i = 0; i < bars; i++) {
      const bw = (i % 2 === 0) ? 2 : 1;
      doc.rect(x + i * 4, y, bw, h, 'F');
    }
  }

  function chip(doc, cx, cy, text, borderRGB, textRGB=[17,24,39]) {
    doc.setDrawColor(...borderRGB);
    doc.setFillColor(255,255,255);
    const paddingX = 6, paddingY = 4;
    const textWidth = doc.getTextWidth(text);
    const w = textWidth + paddingX * 2;
    const h = 18;
    roundedRect(doc, cx, cy, w, h, 9);
    doc.rect(cx, cy, w, h);
    doc.setTextColor(...textRGB);
    doc.setFontSize(10);
    doc.text(text, cx + paddingX, cy + h - paddingY - 3);
  }
})();


