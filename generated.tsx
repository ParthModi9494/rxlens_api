<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>RxInsight – Prescription Dashboard</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.2/babel.min.js"></script>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: linear-gradient(180deg,#EEF3FF 0%,#F8FAFF 60%,#fff 100%); min-height: 100vh; }

  @keyframes pulse-ring { 0%,100%{transform:scale(1);opacity:.35} 50%{transform:scale(1.18);opacity:.7} }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes progress { from{width:0%} to{width:100%} }
  @keyframes dot-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }

  .fade-up { animation: fadeUp .55s cubic-bezier(.22,1,.36,1) both; }
  .fade-in { animation: fadeIn .45s ease both; }
  .spin { animation: spin 1.8s linear infinite; }
  .shimmer { background: linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%); background-size:200% 100%; animation: shimmer 1.4s infinite; }
  .dot-pulse { animation: dot-pulse 1.4s ease-in-out infinite; }

  .navbar { position:sticky;top:0;z-index:50;display:flex;align-items:center;padding:10px 20px; background:rgba(238,243,255,.88);backdrop-filter:blur(18px);border-bottom:1px solid rgba(0,0,0,.05); }
  .logo-box { width:28px;height:28px;background:linear-gradient(135deg,#2563EB,#1D4ED8);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:900;color:#fff;margin-right:8px; }
  .brand { font-size:15px;font-weight:900;color:#1e293b;letter-spacing:-.3px; }
  .verified-chip { margin-left:auto;font-size:11px;font-weight:700;color:#16a34a;display:flex;align-items:center;gap:5px; }
  .verified-dot { width:7px;height:7px;background:#22c55e;border-radius:50%;animation:dot-pulse 1.4s infinite; }

  .container { max-width:440px;margin:0 auto;padding:0 16px 60px; }

  /* UPLOAD */
  .upload-hero { text-align:center;padding:36px 0 28px; }
  .ai-chip { display:inline-flex;align-items:center;gap:6px;background:#EFF6FF;color:#2563EB;font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;padding:6px 14px;border-radius:999px;margin-bottom:16px; }
  .upload-title { font-size:32px;font-weight:900;color:#0f172a;line-height:1.1;letter-spacing:-.5px; }
  .upload-sub { color:#94a3b8;font-size:14px;margin-top:10px;line-height:1.6; }

  .drop-zone { border:2px dashed #CBD5E1;border-radius:28px;background:#fff;cursor:pointer;position:relative;overflow:hidden;transition:border-color .25s,box-shadow .25s; box-shadow:0 4px 40px rgba(0,0,0,.06); }
  .drop-zone:hover { border-color:#93C5FD;box-shadow:0 0 0 5px rgba(59,130,246,.1); }
  .dz-blob1 { position:absolute;top:0;right:0;width:140px;height:140px;background:#EFF6FF;border-radius:50%;transform:translate(35%,-45%);opacity:.7; }
  .dz-blob2 { position:absolute;bottom:0;left:0;width:110px;height:110px;background:#F0FDF4;border-radius:50%;transform:translate(-35%,45%);opacity:.7; }
  .dz-inner { position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:16px;padding:52px 24px; }
  .upload-icon-wrap { position:relative;display:flex;align-items:center;justify-content:center; }
  .upload-ring { position:absolute;inset:-6px;background:#3B82F6;border-radius:20px;animation:pulse-ring 2.2s ease-in-out infinite; }
  .upload-icon-box { position:relative;z-index:1;width:64px;height:64px;background:linear-gradient(135deg,#3B82F6,#1D4ED8);border-radius:18px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(37,99,235,.35); }
  .dz-label { font-size:15px;font-weight:700;color:#1e293b;text-align:center; }
  .dz-sub { font-size:13px;color:#94a3b8;text-align:center; }
  .fmt-chips { display:flex;align-items:center;gap:8px; }
  .fmt-chip { font-size:11px;font-weight:700; }
  .demo-btn { margin:20px auto 0;display:flex;align-items:center;gap:7px;background:#EFF6FF;color:#2563EB;font-family:inherit;font-size:13px;font-weight:700;padding:10px 20px;border-radius:16px;border:none;cursor:pointer;transition:background .2s; }
  .demo-btn:hover { background:#DBEAFE; }

  /* LOADING */
  .loading-wrap { display:flex;flex-direction:column;align-items:center;gap:20px;padding:40px 0 20px; }
  .spin-ring { width:48px;height:48px;border:3px solid #DBEAFE;border-top-color:#3B82F6;border-radius:50%;animation:spin 1s linear infinite; }
  .loading-label { font-size:12px;font-weight:800;color:#94a3b8;letter-spacing:.15em;text-transform:uppercase; }
  .progress-bar-track { width:180px;height:5px;background:#E2E8F0;border-radius:999px;overflow:hidden;margin-top:4px; }
  .progress-bar-fill { height:100%;background:linear-gradient(90deg,#60A5FA,#2563EB);border-radius:999px;animation:progress 2.6s ease-in-out forwards; }
  .skel { border-radius:16px; }

  /* HERO CARD */
  .hero-card { border-radius:28px;overflow:hidden;padding:28px 20px 24px;position:relative;background:linear-gradient(135deg,#1D4ED8 0%,#2563EB 55%,#0EA5E9 100%);box-shadow:0 12px 48px rgba(37,99,235,.38);margin-top:16px; }
  .hero-blob1 { position:absolute;top:0;right:0;width:200px;height:200px;background:rgba(255,255,255,.09);border-radius:50%;transform:translate(35%,-45%); }
  .hero-blob2 { position:absolute;bottom:0;left:0;width:140px;height:140px;background:rgba(255,255,255,.07);border-radius:50%;transform:translate(-35%,45%); }
  .rx-watermark { position:absolute;top:10px;right:16px;font-size:80px;font-weight:900;color:rgba(255,255,255,.08);line-height:1;user-select:none; }
  .hero-content { position:relative;z-index:2; }
  .rx-id-pill { display:inline-flex;align-items:center;gap:7px;background:rgba(255,255,255,.16);backdrop-filter:blur(8px);padding:5px 12px;border-radius:999px;margin-bottom:14px; }
  .rx-id-dot { width:7px;height:7px;background:#4ADE80;border-radius:50%;animation:dot-pulse 1.4s infinite; }
  .rx-id-text { font-size:11px;font-weight:700;color:rgba(255,255,255,.8);letter-spacing:.1em; }
  .hero-name { font-size:26px;font-weight:900;color:#fff;letter-spacing:-.3px;line-height:1.1; }
  .hero-meta { font-size:13px;color:rgba(186,230,253,1);margin-top:5px; }
  .complaint-box { margin-top:16px;background:rgba(255,255,255,.12);backdrop-filter:blur(6px);border-radius:14px;padding:10px 14px; }
  .complaint-label { font-size:10px;font-weight:800;color:rgba(147,197,253,1);letter-spacing:.12em;text-transform:uppercase;margin-bottom:3px; }
  .complaint-text { font-size:13px;font-weight:700;color:#fff; }
  .hero-footer { display:flex;align-items:center;justify-content:space-between;margin-top:18px; }
  .issued-date { font-size:12px;color:rgba(186,230,253,.9);display:flex;align-items:center;gap:5px; }
  .copy-btn { display:flex;align-items:center;gap:6px;background:rgba(255,255,255,.18);color:#fff;border:none;font-family:inherit;font-size:12px;font-weight:700;padding:8px 14px;border-radius:999px;cursor:pointer;transition:background .2s; }
  .copy-btn:hover { background:rgba(255,255,255,.28); }

  /* SECTION HEADER */
  .section-header { display:flex;align-items:center;gap:10px;margin-bottom:12px;margin-top:24px; }
  .section-icon { width:30px;height:30px;background:#F8FAFC;border-radius:10px;display:flex;align-items:center;justify-content:center; }
  .section-title { font-size:11px;font-weight:900;color:#94a3b8;letter-spacing:.16em;text-transform:uppercase; }

  /* VITALS */
  .vitals-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:12px; }
  .stat-card { background:#fff;border-radius:20px;padding:16px 14px;position:relative;overflow:hidden;box-shadow:0 2px 18px rgba(0,0,0,.06); }
  .stat-blob { position:absolute;top:0;right:0;width:72px;height:72px;border-radius:50%;transform:translate(30%,-30%); }
  .stat-icon-box { width:32px;height:32px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:10px; }
  .stat-value { font-size:18px;font-weight:900;color:#0f172a;line-height:1; }
  .stat-unit { font-size:10px;font-weight:700;color:#94a3b8;margin-left:2px; }
  .stat-label { font-size:10px;font-weight:800;color:#94a3b8;letter-spacing:.1em;text-transform:uppercase;margin-top:6px; }

  /* MED CARDS */
  .med-list { display:flex;flex-direction:column;gap:12px; }
  .med-card { background:#fff;border-radius:20px;padding:16px 16px 16px 20px;position:relative;overflow:hidden;box-shadow:0 2px 14px rgba(0,0,0,.05); animation:fadeUp .4s cubic-bezier(.22,1,.36,1) both; }
  .med-accent { position:absolute;left:0;top:12px;bottom:12px;width:3px;border-radius:0 4px 4px 0; }
  .med-top { display:flex;align-items:flex-start;justify-content:space-between;gap:8px; }
  .med-name { font-size:15px;font-weight:800;color:#0f172a;line-height:1.2; }
  .strength-chip { font-size:11px;font-weight:700;color:#94a3b8;background:#F8FAFC;padding:2px 8px;border-radius:999px;white-space:nowrap; }
  .med-dosage { font-size:12px;color:#64748b;margin-top:4px; }
  .med-badges { display:flex;align-items:center;flex-wrap:wrap;gap:7px;margin-top:12px; }
  .freq-badge { display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;padding:5px 10px;border-radius:999px; }
  .freq-dot { width:6px;height:6px;border-radius:50%; }
  .route-badge { display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;padding:5px 10px;border-radius:999px; }
  .duration-chip { font-size:11px;font-weight:600;color:#94a3b8;display:flex;align-items:center;gap:4px;margin-left:auto; }

  /* DOCTOR */
  .doctor-card { background:#fff;border-radius:22px;padding:20px;box-shadow:0 2px 18px rgba(0,0,0,.06);position:relative;overflow:hidden; }
  .doc-blob { position:absolute;top:0;right:0;width:100px;height:100px;background:#F0FDF4;border-radius:50%;transform:translate(30%,-30%);opacity:.7; }
  .doc-inner { display:flex;gap:16px;align-items:flex-start;position:relative;z-index:2; }
  .doc-avatar { width:52px;height:52px;border-radius:18px;background:linear-gradient(135deg,#34D399,#0D9488);display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 6px 16px rgba(20,184,166,.3); }
  .doc-name { font-size:16px;font-weight:800;color:#0f172a;line-height:1.2; }
  .doc-qual { font-size:12px;color:#64748b;margin-top:3px;line-height:1.5; }
  .doc-chips { display:flex;flex-wrap:wrap;gap:7px;margin-top:12px; }
  .lic-chip { display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;background:#F0FDF4;color:#16a34a;padding:5px 10px;border-radius:999px; }
  .clinic-chip { font-size:11px;font-weight:700;background:#F8FAFC;color:#64748b;padding:5px 10px;border-radius:999px; }

  /* CLINICAL NOTES */
  .notes-card { background:#FFFBEB;border:1px solid #FDE68A;border-radius:20px;padding:16px; }
  .notes-inner { display:flex;gap:12px; }
  .notes-icon { width:28px;height:28px;background:#FDE68A;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px; }
  .notes-text { font-size:13px;font-weight:500;color:#92400E;line-height:1.65; }

  /* FOLLOW UP */
  .followup-card { background:#fff;border-radius:20px;padding:16px;display:flex;align-items:center;gap:16px;box-shadow:0 2px 18px rgba(0,0,0,.06); }
  .cal-box { border-radius:16px;overflow:hidden;border:1px solid #E0E7FF;flex-shrink:0;width:64px; }
  .cal-month { background:#4F46E5;color:#fff;font-size:10px;font-weight:800;text-align:center;padding:5px 0;letter-spacing:.12em;text-transform:uppercase; }
  .cal-day { background:#fff;color:#312E81;font-size:26px;font-weight:900;text-align:center;padding:6px 0;line-height:1; }
  .followup-day { font-size:15px;font-weight:800;color:#0f172a; }
  .followup-date { font-size:13px;color:#64748b;margin-top:2px; }
  .followup-label { font-size:11px;font-weight:700;color:#6366F1;margin-top:6px;display:flex;align-items:center;gap:4px; }

  /* RESET */
  .reset-btn { width:100%;padding:14px;border-radius:20px;border:2px dashed #CBD5E1;background:transparent;color:#94a3b8;font-family:inherit;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;margin-top:8px;transition:border-color .2s,color .2s; }
  .reset-btn:hover { border-color:#93C5FD;color:#3B82F6; }
</style>
</head>
<body>
<div id="root"></div>
<script type="text/babel">
const { useState, useRef, useCallback } = React;

const SAMPLE_DATA = {
  prescription_id: "RX-2024-07-02-001",
  date_issued: "2024-07-02T00:00:00Z",
  patient: { name: "Rina Paul", date_of_birth: "1980-07-02", age: 44, gender: "Female", blood_group: null },
  doctor: { name: "Dr Mounita Debnath", specialization: "M.D. Respiratory Medicine (PGT)", license_number: "76565", qualifications: "M.B.B.S.(WBUHS), M.D. Respiratory Medicine (PGT)", clinic_name: "City Medical Centre" },
  medications: [
    { name: "Numlo-TM", strength: "5mg", dosage: "1 tablet", frequency: "Once daily after breakfast", route: "Oral", duration: "Continuous" },
    { name: "Vylda-DM", strength: "100/10/1000", dosage: "1 tablet", frequency: "Once daily before lunch", route: "Oral", duration: "Continuous" },
    { name: "Melmet SR", strength: "500mg", dosage: "1 tablet", frequency: "Once daily before dinner", route: "Oral", duration: "Continuous" },
    { name: "Ecaspirin-AV", strength: "75mg/10mg", dosage: "1 tablet", frequency: "Once daily after dinner", route: "Oral", duration: "Continuous" },
    { name: "Rabinos-D", strength: null, dosage: "1 capsule", frequency: "Once daily before food", route: "Oral", duration: "1 month" },
    { name: "Vibrante", strength: null, dosage: "1 tablet", frequency: "Once daily after food", route: "Oral", duration: "1 month" },
    { name: "Zerodol-P", strength: null, dosage: "1 tablet", frequency: "Twice daily after food", route: "Oral", duration: "5 days" },
    { name: "Candid-V Ointment", strength: null, dosage: "Apply locally", frequency: "As directed", route: "Topical", duration: "As directed" },
    { name: "Alkasol Syrup", strength: null, dosage: "2 tsp in water", frequency: "Three times a day", route: "Oral", duration: "7 days" },
    { name: "Lfx", strength: "750mg", dosage: "1 tablet", frequency: "Once daily after food", route: "Oral", duration: "7 days" },
  ],
  chief_complaint: "Burning micturition",
  vitals_at_visit: { BP: "120/70", FBS: "203", PPBS: "293" },
  clinical_notes: "Signs of hypoglycaemia — explain to patient. Blood tests (FBS, PPBS, HbA1C) after 3 months.",
  follow_up_date: "2024-10-02",
};

const fmtDate = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
};

const freqStyle = (freq) => {
  const f = (freq || "").toLowerCase();
  if (f.includes("three") || f.includes("3"))  return { bg:"#FFF3E0", text:"#C2410C", dot:"#F97316" };
  if (f.includes("twice") || f.includes("2"))  return { bg:"#EFF6FF", text:"#1D4ED8", dot:"#3B82F6" };
  if (f.includes("once")  || f.includes("1"))  return { bg:"#F0FDF4", text:"#15803D", dot:"#22C55E" };
  return { bg:"#F5F3FF", text:"#7C3AED", dot:"#8B5CF6" };
};

// SVG icons (inline, no lucide dep needed in plain HTML)
const Ico = {
  upload: () => (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>),
  sparkle: () => (<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-5.74L4 10l5.91-1.74z"/></svg>),
  pill: () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="7" y="2" width="10" height="20" rx="5"/><line x1="7" y1="12" x2="17" y2="12"/></svg>),
  layers: () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>),
  flask: () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 3h6l1 9H8L9 3z"/><path d="M8 12c-2.76 1.86-4 4-4 6a4 4 0 008 0c0-2-1.24-4.14-4-6z"/><path d="M16 12c2.76 1.86 4 4 4 6a4 4 0 01-8 0c0-2 1.24-4.14 4-6z"/></svg>),
  heart: () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="#EF4444" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>),
  droplets: () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="#F97316" stroke="none"><path d="M12 2C6.5 10 4 14 4 17a8 8 0 0016 0c0-3-2.5-7-8-15z"/></svg>),
  activity: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>),
  stethoscope: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6v0a6 6 0 006-6V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3"/><path d="M8 15v1a6 6 0 006 6h0a6 6 0 006-6v-4"/><circle cx="20" cy="10" r="2"/></svg>),
  clipboard: () => (<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>),
  calendar: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>),
  alert: () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>),
  clock: () => (<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>),
  copy: () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>),
  check: () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>),
  file: () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>),
  chevron: () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>),
  scope: () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M11 7v4l3 1.5"/></svg>),
};





// ─── App ──────────────────────────────────────────────────────────
function App() {
  const [screen, setScreen] = useState("upload");
  const [data, setData] = useState(null);

  const handleUpload = () => {
    setScreen("loading");
    setTimeout(()=>{ setData(SAMPLE_DATA); setScreen("dashboard"); }, 2700);
  };
  const handleReset = () => { setScreen("upload"); setData(null); };

  return (
    <div>
      <div className="navbar">
        <div className="logo-box">℞</div>
        <span className="brand">RxInsight</span>
        {screen==="dashboard" && (
          <div className="verified-chip"><div className="verified-dot"/>Verified</div>
        )}
      </div>
      {screen==="upload"    && <UploadZone onUpload={handleUpload}/>}
      {screen==="loading"   && <LoadingScreen/>}
      {screen==="dashboard" && data && <Dashboard data={data} onReset={handleReset}/>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
</script>
</body>
</html>