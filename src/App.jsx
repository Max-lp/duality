import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   STATIC DATA
═══════════════════════════════════════════════════════════ */
const CATEGORIES = [
  { id:"oral",     label:"Oral / Gorge profonde",    icon:"👄" },
  { id:"anal",     label:"Anal",                     icon:"🍑" },
  { id:"bondage",  label:"Bondage / Restraint",      icon:"⛓️" },
  { id:"spanking", label:"Fessée / Impact",           icon:"✋" },
  { id:"wax",      label:"Cire / Sensations",         icon:"🕯️" },
  { id:"uro",      label:"Uro",                       icon:"💧" },
  { id:"exhib",    label:"Exhib / Voyeurisme",        icon:"👁️" },
  { id:"role",     label:"Jeu de rôle",               icon:"🎭" },
  { id:"toys",     label:"Jouets",                    icon:"🔧" },
  { id:"pain",     label:"Douleur / Edge play",       icon:"🌹" },
  { id:"dirty",    label:"Dirty talk",                icon:"🗣️" },
  { id:"edging",   label:"Edging / Orgasm control",   icon:"⏳" },
  { id:"distance", label:"À distance",                icon:"📱" },
  { id:"online",   label:"En ligne",                  icon:"🌐" },
  { id:"body",     label:"Modification corporelle",   icon:"✨" },
];

const INTENSITY = [
  { level:1, label:"Doux",        color:"#2d7a4a" },
  { level:2, label:"Modéré",      color:"#7a6a10" },
  { level:3, label:"Intense",     color:"#b05010" },
  { level:4, label:"Très intense",color:"#8b1a1a" },
  { level:5, label:"Hardcore",    color:"#5a0a6a" },
  { level:6, label:"Extrême",     color:"#1a0a2a" },
];

const MOODS = [
  { id:"soft",    label:"Doux",    icon:"🌹", levels:[1,2] },
  { id:"intense", label:"Intense", icon:"🔥", levels:[2,3,4] },
  { id:"brutal",  label:"Brutal",  icon:"💀", levels:[4,5,6] },
  { id:"all",     label:"Tout",    icon:"⚡", levels:[1,2,3,4,5,6] },
];

const LINK_STATES = [
  { min:90, label:"Fusion",       color:"#c0392b", icon:"❤️‍🔥" },
  { min:70, label:"Harmonie",     color:"#8b5cf6", icon:"💜" },
  { min:50, label:"Stable",       color:"#c9952a", icon:"🖤" },
  { min:30, label:"Fragile",      color:"#6b7280", icon:"🩶" },
  { min:0,  label:"Déconnexion",  color:"#374151", icon:"💔" },
];

const PUNISHMENTS = [
  "10 coups de ceinture supplémentaires",
  "Pinces à tétons pendant 15 minutes",
  "Interdit(e) de jouir pendant 48h",
  "Massage complet du Dom sans retour",
  "Le Dom choisit la tenue pour la prochaine sortie",
  "Le Sub prépare le dîner nu(e)",
  "5 gifles consenties immédiatement",
  "Le Sub s'excuse à genoux",
  "Plug anal pendant 30 minutes",
  "À disposition du Dom pendant 1h",
];

const OUTFITS = [
  "Lingerie choisie par le Dom","Collier + laisse seulement",
  "Uniforme scolaire","Cuir / Latex intégral","Corset serré + bas",
  "Rien — nu(e) sur commande","Tenue de sport déchirée",
  "Menottes + peu de vêtements","Robe fendue sans sous-vêtement",
  "Tenue imposée à la dernière minute",
];

const REWARDS = [
  { pts:10,  label:"Massage 15 min" },
  { pts:25,  label:"Dîner — le Sub commande" },
  { pts:50,  label:"Session 100% au choix du Sub" },
  { pts:75,  label:"Nuit hôtel — rôles inversés" },
  { pts:100, label:"Fantasme secret exaucé" },
  { pts:150, label:"Weekend BDSM — Sub aux commandes" },
  { pts:200, label:"Récompense ultime à définir" },
];

const SUB_TITLES = [
  { min:0,   title:"Novice",           icon:"🌱" },
  { min:30,  title:"Initié(e)",        icon:"🔗" },
  { min:80,  title:"Dressé(e)",        icon:"⛓️" },
  { min:150, title:"Objet",            icon:"👑" },
  { min:250, title:"Esclave",          icon:"🔥" },
  { min:400, title:"Propriété totale", icon:"💀" },
];

const DISTANCE_DEFIS = [
  { id:"photo",    label:"Envoyer une photo",        icon:"📸", desc:"Le Sub envoie une photo selon les instructions du Dom" },
  { id:"tenue",    label:"Porter une tenue imposée", icon:"👗", desc:"Le Sub porte la tenue choisie pendant X heures" },
  { id:"no_sous",  label:"Sans sous-vêtements",      icon:"🔥", desc:"Le Sub reste sans sous-vêtements toute la journée" },
  { id:"massage",  label:"Se préparer ce soir",      icon:"🛁", desc:"Le Sub se prépare selon les instructions pour le retour" },
  { id:"interdit", label:"Interdit de toucher",      icon:"🚫", desc:"Le Sub n'a pas le droit de se toucher jusqu'au retour" },
  { id:"plug",     label:"Porter un plug",           icon:"🍑", desc:"Le Sub porte le plug pendant X heures" },
  { id:"message",  label:"Message secret",           icon:"💬", desc:"Le Sub envoie un message explicite à heure fixe" },
  { id:"custom",   label:"Mission personnalisée",    icon:"✏️", desc:"" },
];

const DEFAULT_FAVORITES = [
  { id:"fav1", name:"Session douce 🌹",  cats:["oral","bondage","dirty","edging"] },
  { id:"fav2", name:"Full hardcore 💀",  cats:["anal","bondage","spanking","pain","edging"] },
  { id:"fav3", name:"À distance 📱",     cats:["distance","online","dirty","exhib"] },
];

/* ═══════════════════════════════════════════════════════════
   CSS
═══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Inter:wght@300;400;500;600;700&display=swap');

*,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }

:root {
  --bg:#030104;
  --s1:#0a0610;
  --s2:#110918;
  --s3:#180e22;
  --b1:#251535;
  --b2:#3a1a28;
  --b3:#4a2030;
  --red:#8b1a1a;
  --red2:#b02020;
  --red3:#e04040;
  --gold:#8a6520;
  --gold2:#b8842a;
  --gold3:#e8b040;
  --purple:#3a0850;
  --purple2:#6b24a0;
  --purple3:#a855e8;
  --green2:#1e6a40;
  --green3:#34c770;
  --blue2:#1a4a8a;
  --blue3:#3080e0;
  --text:#e0d4e8;
  --text2:#c0b0cc;
  --muted:#6a5a7a;
  --muted2:#8a7a9a;
  --r:10px;
  --shadow:0 4px 24px rgba(0,0,0,.5);
}

html, body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
}

/* Scanlines */
body::after {
  content:''; position:fixed; inset:0;
  background: repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.08) 3px,rgba(0,0,0,.08) 4px);
  pointer-events:none; z-index:9998;
}

/* Noise */
body::before {
  content:''; position:fixed; inset:0;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");
  pointer-events:none; z-index:9997; opacity:.5;
}

.app { width:100%; max-width:100%; margin:0 auto; padding:0 0 90px; position:relative; z-index:1; overflow-x:hidden;  }

/* ── Header ── */
.hdr { padding:28px 20px 0; text-align:center; }
.hdr-title {
  font-family:'Cinzel', serif;
  font-size:28px; font-weight:900;
  letter-spacing:8px; text-transform:uppercase;
  background:linear-gradient(180deg,#fff 0%,var(--red3) 45%,var(--red) 100%);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent;
  line-height:1;
}
.hdr-sub {
  font-family:'Inter', sans-serif;
  font-size:9px; font-weight:500;
  color:var(--muted); letter-spacing:5px;
  margin-top:4px; text-transform:uppercase;
}
.hdr-line {
  height:1px;
  background:linear-gradient(90deg,transparent,var(--red2),var(--gold2),var(--red2),transparent);
  margin:14px 0 0;
}

/* ── Safeword bar ── */
.sw {
  margin:8px 16px 0; padding:7px 14px;
  border:1px solid var(--b1); border-radius:6px;
  background:var(--s2);
  font-family:'Inter',sans-serif; font-size:10px; font-weight:500;
  color:var(--muted); text-align:center; letter-spacing:1px;
}
.sw span { color:var(--gold3); font-weight:700; }

/* ── Link bar ── */
.link-bar {
  margin:8px 16px 0; padding:10px 14px;
  border:1px solid var(--b1); border-radius:var(--r);
  background:var(--s2);
  display:flex; align-items:center; gap:10px;
}
.link-bar-label {
  font-family:'Cinzel',serif; font-size:11px;
  color:var(--gold2); white-space:nowrap; font-weight:600;
}
.link-track {
  flex:1; height:6px; border-radius:3px;
  background:var(--b1); overflow:hidden; position:relative;
}
.link-fill {
  height:100%; border-radius:3px;
  transition:width .8s cubic-bezier(.4,0,.2,1);
}
.link-pct {
  font-family:'Cinzel',serif; font-size:12px; font-weight:700;
  white-space:nowrap; min-width:44px; text-align:right;
}
.link-state {
  font-size:9px; font-weight:600; white-space:nowrap;
  font-family:'Inter',sans-serif; letter-spacing:.5px;
}

/* ── Nav ── */
.nav {
  display:flex; overflow-x:auto; gap:3px;
  padding:10px 16px 2px; scrollbar-width:none;
}
.nav::-webkit-scrollbar { display:none; }
.nb {
  flex-shrink:0; padding:6px 12px;
  border:1px solid var(--b1); background:var(--s1);
  color:var(--muted);
  font-family:'Inter',sans-serif; font-weight:600;
  font-size:11px; letter-spacing:.5px;
  cursor:pointer; transition:all .15s; border-radius:5px; white-space:nowrap;
}
.nb:hover { color:var(--text); border-color:var(--red2); }
.nb.on { background:var(--red); border-color:var(--red2); color:#fff; }
.cbadge {
  display:inline-flex; align-items:center; justify-content:center;
  min-width:16px; height:16px; border-radius:999px;
  background:rgba(255,255,255,.25); color:#fff;
  font-size:9px; padding:0 4px; margin-left:4px;
  font-family:'Inter',sans-serif; font-weight:700;
}

/* ── Cards ── */
.card {
  margin:10px 16px 0;
  background:var(--s1); border:1px solid var(--b2);
  border-radius:var(--r); padding:16px;
  position:relative; overflow:hidden;
  box-shadow:var(--shadow);
  transition:box-shadow .2s;
}
.card::before {
  content:''; position:absolute; top:0; left:0; right:0; height:2px;
  background:linear-gradient(90deg,var(--red),var(--gold2),var(--red));
}
.card.purple::before { background:linear-gradient(90deg,var(--purple),var(--purple3),var(--purple)); }
.card.blue::before   { background:linear-gradient(90deg,var(--blue2),var(--blue3),var(--blue2)); }
.card.gold::before   { background:linear-gradient(90deg,var(--gold),var(--gold3),var(--gold)); }
.card.green::before  { background:linear-gradient(90deg,var(--green2),var(--green3),var(--green2)); }

.ctitle {
  font-family:'Cinzel',serif; font-size:11px; font-weight:700;
  letter-spacing:2px; color:var(--gold2); text-transform:uppercase;
  margin-bottom:13px; display:flex; align-items:center; gap:6px;
}

/* ── Buttons ── */
.btn {
  display:inline-flex; align-items:center; justify-content:center; gap:5px;
  padding:9px 16px;
  border:1px solid var(--red2); background:transparent; color:var(--red3);
  font-family:'Inter',sans-serif; font-weight:700;
  font-size:12px; letter-spacing:.5px; text-transform:uppercase;
  cursor:pointer; border-radius:5px; transition:all .15s;
}
.btn:hover   { background:rgba(176,32,32,.18); }
.btn:active  { transform:scale(.97); }
.btn-p  { background:var(--red); border-color:var(--red2); color:#fff; }
.btn-p:hover { background:var(--red2); }
.btn-g  { border-color:var(--gold2); color:var(--gold3); }
.btn-g:hover { background:rgba(184,132,42,.15); }
.btn-pu { border-color:var(--purple2); color:var(--purple3); }
.btn-pu:hover { background:rgba(107,36,160,.25); }
.btn-gr { border-color:var(--green2); color:var(--green3); }
.btn-gr:hover { background:rgba(30,106,64,.25); }
.btn-bl { border-color:var(--blue2); color:var(--blue3); }
.btn-bl:hover { background:rgba(26,74,138,.2); }
.btn-sm  { padding:5px 11px; font-size:11px; }
.btn-xs  { padding:3px 8px; font-size:10px; }
.btn-full { width:100%; }
.btn:disabled { opacity:.3; cursor:not-allowed; }

/* ── Dashboard ── */
.dash-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:12px; }
.dash-card {
  padding:14px 12px; border-radius:var(--r);
  border:1px solid var(--b2); background:var(--s2);
  text-align:center; cursor:pointer; transition:all .2s;
  position:relative; overflow:hidden;
}
.dash-card:hover { border-color:var(--red2); transform:translateY(-1px); box-shadow:0 6px 20px rgba(0,0,0,.4); }
.dash-card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,var(--gold2),transparent); }
.dash-icon { font-size:24px; margin-bottom:6px; }
.dash-lbl { font-family:'Cinzel',serif; font-size:10px; font-weight:700; color:var(--gold2); letter-spacing:1px; margin-bottom:2px; }
.dash-val { font-family:'Inter',sans-serif; font-size:12px; color:var(--text2); }

.dash-stat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; margin-bottom:12px; }
.dash-stat { padding:10px 6px; border-radius:8px; border:1px solid var(--b1); background:var(--s2); text-align:center; }
.dash-stat-num { font-family:'Cinzel',serif; font-size:20px; font-weight:700; background:linear-gradient(135deg,#fff,var(--gold3)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; line-height:1; }
.dash-stat-lbl { font-size:9px; color:var(--muted); margin-top:2px; font-weight:500; }

/* ── Role ── */
.role-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px; }
.rc { padding:16px 10px; border:1px solid var(--b1); border-radius:var(--r); background:var(--s2); text-align:center; cursor:pointer; transition:all .2s; }
.rc-dom { border-color:var(--red); }
.rc-sub { border-color:var(--purple2); }
.rc-dom.sel { background:rgba(139,26,26,.22); box-shadow:0 0 20px rgba(139,26,26,.25); }
.rc-sub.sel { background:rgba(58,8,80,.28); box-shadow:0 0 20px rgba(107,36,160,.25); }
.ri { font-size:26px; display:block; margin-bottom:4px; }
.rl { font-family:'Cinzel',serif; font-size:12px; font-weight:700; letter-spacing:2px; display:block; margin-bottom:2px; }
.rc-dom .rl { color:var(--red3); }
.rc-sub .rl { color:var(--purple3); }
.rd { font-size:10px; color:var(--muted); font-weight:400; }

/* ── Coin ── */
.coin-wrap { display:flex; flex-direction:column; align-items:center; gap:14px; padding:4px 0; }
.coin { width:86px; height:86px; perspective:600px; cursor:pointer; }
.ci  { width:100%; height:100%; position:relative; transform-style:preserve-3d; }
.ci.spin { animation:cf 1.5s cubic-bezier(.4,0,.2,1) forwards; }
@keyframes cf {
  0%   { transform:rotateY(0) scale(1); }
  45%  { transform:rotateY(calc(var(--er)*.55)) scale(1.1); }
  100% { transform:rotateY(var(--er)) scale(1); }
}
.cface { position:absolute; inset:0; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-direction:column; backface-visibility:hidden; font-family:'Cinzel',serif; font-size:9px; letter-spacing:1px; font-weight:700; }
.cf-f  { background:radial-gradient(circle at 30% 30%,#c0392b,#4a0808); border:3px solid var(--gold2); color:var(--gold3); box-shadow:0 0 22px rgba(139,26,26,.5); }
.cf-b  { background:radial-gradient(circle at 30% 30%,#7b2fa0,#2a0840); border:3px solid var(--purple2); color:var(--purple3); transform:rotateY(180deg); box-shadow:0 0 22px rgba(58,8,80,.5); }
.cface .cfi { font-size:24px; margin-bottom:2px; }

.rr  { padding:11px 16px; border-radius:var(--r); border:1px solid; text-align:center; font-family:'Cinzel',serif; font-size:14px; font-weight:700; letter-spacing:2px; animation:fi .4s ease; margin-top:10px; }
.rr-dom { background:rgba(139,26,26,.2); border-color:var(--red2); color:var(--red3); }
.rr-sub { background:rgba(58,8,80,.22); border-color:var(--purple2); color:var(--purple3); }
.rr2 { font-size:10px; margin-top:3px; opacity:.6; font-family:'Inter',sans-serif; letter-spacing:.5px; font-weight:400; }

.or { display:flex; align-items:center; gap:10px; margin:10px 0; }
.or::before, .or::after { content:''; flex:1; height:1px; background:var(--b1); }
.or span { font-size:10px; color:var(--muted); letter-spacing:2px; font-family:'Inter',sans-serif; font-weight:500; }

/* ── Cat grid ── */
.cat-grid { display:grid; grid-template-columns:1fr 1fr; gap:5px; }
.ci-item {
  padding:8px 9px; border:1px solid var(--b1); border-radius:6px;
  background:var(--s2); cursor:pointer;
  display:flex; align-items:center; gap:6px;
  font-size:12px; font-weight:500;
  transition:all .15s; user-select:none;
}
.ci-item:hover { border-color:var(--muted2); }
.ci-item.sel   { border-color:var(--red2); background:rgba(139,26,26,.18); color:var(--red3); }
.ci-item.match { border-color:var(--gold2); background:rgba(184,132,42,.15); color:var(--gold3); }
.ci-item.blocked { opacity:.3; pointer-events:none; }
.cii { font-size:14px; flex-shrink:0; }

/* ── Cat selector panel ── */
.cat-panel { background:var(--s2); border:1px solid var(--purple2); border-radius:var(--r); padding:14px; margin-bottom:10px; position:relative; box-shadow:0 2px 12px rgba(107,36,160,.15); }
.cat-panel::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,var(--purple),var(--purple3),var(--purple)); border-radius:var(--r) var(--r) 0 0; }
.fav-chips { display:flex; flex-wrap:wrap; gap:5px; margin-bottom:10px; }
.fav-chip  { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:999px; border:1px solid var(--gold2); background:rgba(184,132,42,.12); color:var(--gold3); font-size:11px; font-weight:600; cursor:pointer; transition:all .15s; }
.fav-chip:hover { background:rgba(184,132,42,.25); }
.fav-chip-del { background:none; border:none; color:var(--muted); cursor:pointer; font-size:13px; padding:0; line-height:1; transition:color .15s; }
.fav-chip-del:hover { color:var(--red3); }
.ac-chip { padding:2px 8px; border-radius:999px; font-size:10px; font-weight:600; background:rgba(139,26,26,.2); border:1px solid var(--red); color:var(--red3); cursor:pointer; transition:background .15s; }
.ac-chip:hover { background:rgba(139,26,26,.35); }
.active-cats-summary { display:flex; flex-wrap:wrap; gap:3px; margin-bottom:10px; }
.cat-sel-toggle { display:flex; align-items:center; justify-content:space-between; cursor:pointer; margin-bottom:8px; }
.cat-sel-lbl { font-family:'Cinzel',serif; font-size:10px; font-weight:700; color:var(--purple3); letter-spacing:1px; }
.cat-sel-count { font-family:'Inter',sans-serif; font-size:10px; color:var(--muted); }
.all-none-row { display:flex; gap:5px; margin-bottom:8px; }

/* ── Mode toggle ── */
.mode-tog { display:flex; margin:8px 16px 0; border:1px solid var(--b1); border-radius:6px; overflow:hidden; }
.mb { flex:1; padding:8px 4px; text-align:center; font-family:'Cinzel',serif; font-size:9px; font-weight:700; letter-spacing:1px; text-transform:uppercase; cursor:pointer; background:var(--s1); color:var(--muted); border:none; transition:all .15s; }
.mb.on { background:var(--red); color:#fff; }

/* ── Action box ── */
.abox {
  position:relative; padding:20px 16px;
  border:1px solid var(--red2); border-radius:var(--r);
  background:linear-gradient(135deg,rgba(139,26,26,.12),rgba(10,6,16,.8));
  text-align:center; min-height:100px;
  display:flex; align-items:center; justify-content:center;
  overflow:hidden; margin-bottom:10px;
}
.abox::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at center,rgba(139,26,26,.07) 0%,transparent 70%); }
.acat  { font-family:'Inter',sans-serif; font-size:9px; font-weight:600; color:var(--gold2); letter-spacing:2px; margin-bottom:6px; text-transform:uppercase; }
.alv   { display:inline-block; padding:2px 8px; border-radius:999px; font-size:9px; font-family:'Cinzel',serif; font-weight:700; letter-spacing:1px; margin-bottom:6px; }
.atxt  { font-family:'Inter',sans-serif; font-size:15px; font-weight:500; line-height:1.5; color:#fff; position:relative; z-index:1; }
.aempty { color:var(--muted); font-size:13px; font-style:italic; font-family:'Inter',sans-serif; }
@keyframes pulse { 0%{box-shadow:0 0 0 0 rgba(139,26,26,.6)} 70%{box-shadow:0 0 0 14px rgba(139,26,26,0)} 100%{box-shadow:0 0 0 0 rgba(139,26,26,0)} }
.abox.flash { animation:pulse .5s ease; }

/* ── Action selection list ── */
.act-sel-list { display:flex; flex-direction:column; gap:6px; max-height:300px; overflow-y:auto; margin-bottom:10px; scrollbar-width:thin; scrollbar-color:var(--b2) transparent; }
.act-sel-item { padding:10px 12px; border:1px solid var(--b1); border-radius:6px; background:var(--s2); cursor:pointer; display:flex; align-items:flex-start; gap:10px; transition:all .15s; }
.act-sel-item:hover { border-color:var(--muted2); }
.act-sel-item.checked { border-color:var(--gold2); background:rgba(184,132,42,.1); }
.asi-check { width:18px; height:18px; border-radius:3px; border:1px solid var(--muted); flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:11px; margin-top:1px; transition:all .15s; }
.act-sel-item.checked .asi-check { background:var(--gold2); border-color:var(--gold2); color:#000; font-weight:700; }
.asi-body { flex:1; }
.asi-name { font-size:13px; font-weight:600; margin-bottom:2px; }
.asi-meta { font-size:11px; color:var(--muted); display:flex; gap:8px; flex-wrap:wrap; }
.asi-lv   { font-size:10px; padding:1px 6px; border-radius:999px; font-family:'Cinzel',serif; font-weight:600; }

/* ── Secret card ── */
.secret-card { padding:20px; border:1px solid var(--purple2); border-radius:var(--r); background:rgba(58,8,80,.2); text-align:center; cursor:pointer; position:relative; overflow:hidden; }
.secret-card::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at center,rgba(107,36,160,.15) 0%,transparent 70%); }
.secret-reveal { font-size:14px; font-weight:500; color:#fff; line-height:1.5; position:relative; z-index:1; }
.secret-hidden { font-size:13px; color:var(--purple3); font-style:italic; position:relative; z-index:1; font-family:'Cinzel',serif; }

/* ── Distance ── */
.dist-grid { display:grid; grid-template-columns:1fr 1fr; gap:6px; }
.dist-card { padding:12px 10px; border:1px solid var(--b1); border-radius:6px; background:var(--s2); cursor:pointer; text-align:center; transition:all .15s; }
.dist-card:hover { border-color:var(--blue2); }
.dist-card.sel { border-color:var(--blue3); background:rgba(26,74,138,.18); }
.dist-icon  { font-size:22px; margin-bottom:4px; }
.dist-label { font-size:12px; font-weight:600; color:var(--text); }
.dist-desc  { font-size:10px; color:var(--muted); margin-top:3px; line-height:1.3; }
.mission-list  { display:flex; flex-direction:column; gap:8px; }
.mission-card  { padding:12px; border-radius:6px; border:1px solid var(--b1); background:var(--s2); position:relative; }
.ms-status { display:inline-flex; align-items:center; gap:4px; padding:2px 8px; border-radius:999px; font-size:10px; font-family:'Cinzel',serif; font-weight:700; letter-spacing:.5px; margin-bottom:6px; }
.ms-pending { background:rgba(184,132,42,.2); border:1px solid var(--gold2); color:var(--gold3); }
.ms-done    { background:rgba(30,106,64,.2); border:1px solid var(--green2); color:var(--green3); }
.ms-refused { background:rgba(139,26,26,.2); border:1px solid var(--red); color:var(--red3); }
.mission-title  { font-size:14px; font-weight:600; margin-bottom:4px; }
.mission-desc   { font-size:12px; color:var(--muted); margin-bottom:8px; line-height:1.4; }
.mission-acts   { display:flex; gap:5px; flex-wrap:wrap; }
.mission-del { position:absolute; top:8px; right:8px; background:none; border:none; color:var(--muted); cursor:pointer; font-size:13px; transition:color .15s; }
.mission-del:hover { color:var(--red3); }

/* ── Timer ── */
.timer-ring { position:relative; width:76px; height:76px; margin:0 auto 10px; }
.tsvg { transform:rotate(-90deg); }
.tc { transition:stroke-dashoffset .1s linear; }
.tnum { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-family:'Cinzel',serif; font-size:18px; font-weight:700; color:var(--red3); }
.timer-row { display:flex; gap:5px; flex-wrap:wrap; justify-content:center; margin-bottom:8px; }

/* ── Escalade bar ── */
.esc-bar { height:4px; border-radius:2px; background:linear-gradient(90deg,var(--green2),var(--gold2),var(--red2),var(--purple2)); margin-bottom:8px; position:relative; overflow:hidden; }
.esc-cur { position:absolute; top:-2px; width:8px; height:8px; border-radius:50%; background:#fff; transform:translateX(-50%); transition:left .4s ease; box-shadow:0 0 8px rgba(255,255,255,.5); }

/* ── Intensity selector ── */
.int-grid { display:flex; gap:3px; margin-bottom:10px; }
.int-btn  { flex:1; padding:6px 2px; border-radius:3px; border:1px solid var(--b1); background:var(--s2); text-align:center; cursor:pointer; transition:all .15s; }
.int-btn .ilbl { font-family:'Cinzel',serif; font-size:8px; font-weight:700; letter-spacing:.5px; display:block; color:var(--muted); }
.int-btn .idot { width:7px; height:7px; border-radius:50%; margin:3px auto 0; background:var(--b2); }
.int-btn.sel .ilbl { color:var(--ic); }
.int-btn.sel .idot { background:var(--ic); }
.int-btn.sel { border-color:var(--ic); }

/* ── Mood ── */
.mood-grid { display:flex; gap:4px; margin-bottom:10px; }
.mood-btn { flex:1; padding:7px 3px; border-radius:4px; border:1px solid var(--b1); background:var(--s2); text-align:center; cursor:pointer; font-family:'Inter',sans-serif; font-weight:600; font-size:11px; transition:all .15s; color:var(--muted2); }
.mood-btn:hover { border-color:var(--muted); color:var(--text); }
.mood-btn.sel { border-color:var(--red2); background:rgba(139,26,26,.2); color:var(--red3); }

/* ── Points & Streak ── */
.pts-big { text-align:center; padding:6px 0 12px; }
.pts-num { font-family:'Cinzel',serif; font-size:48px; font-weight:900; background:linear-gradient(135deg,#fff,var(--gold3),var(--gold)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; line-height:1; }
.pts-lbl { font-family:'Inter',sans-serif; font-size:9px; font-weight:500; color:var(--muted); letter-spacing:3px; margin-top:3px; text-transform:uppercase; }
.sub-title { display:flex; align-items:center; justify-content:center; gap:6px; margin-top:6px; font-family:'Cinzel',serif; font-size:11px; font-weight:700; letter-spacing:2px; color:var(--purple3); }
.streak-d { text-align:center; padding:4px 0 12px; }
.streak-n { font-family:'Cinzel',serif; font-size:38px; font-weight:900; background:linear-gradient(135deg,var(--gold3),var(--gold2)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; line-height:1; }
.streak-l { font-family:'Inter',sans-serif; font-size:9px; color:var(--muted); letter-spacing:3px; margin-top:2px; text-transform:uppercase; }
.pts-row  { display:flex; align-items:center; gap:5px; margin-top:8px; }
.pts-inp  { width:68px; background:var(--s2); border:1px solid var(--b1); border-radius:4px; padding:7px 10px; color:var(--text); font-family:'Inter',sans-serif; font-size:14px; outline:none; text-align:center; }
.pts-inp:focus { border-color:var(--gold2); }
.rw-list  { display:flex; flex-direction:column; gap:4px; }
.rw-item  { display:flex; align-items:center; justify-content:space-between; padding:8px 12px; border-radius:5px; border:1px solid var(--b1); background:var(--s2); font-size:12px; font-weight:500; transition:all .2s; }
.rw-item.ok { border-color:var(--gold2); background:rgba(184,132,42,.1); }
.rw-pts { font-family:'Cinzel',serif; font-size:10px; font-weight:700; color:var(--gold2); flex-shrink:0; }
.rw-item.ok .rw-pts { color:var(--gold3); }

/* ── History ── */
.sess-list { display:flex; flex-direction:column; gap:8px; }
.sess-card { padding:11px; border-radius:6px; border:1px solid var(--b1); background:var(--s2); }
.sess-date { font-family:'Inter',sans-serif; font-size:9px; font-weight:500; color:var(--muted); letter-spacing:1px; margin-bottom:4px; text-transform:uppercase; }
.sess-roles { display:flex; gap:4px; margin-bottom:5px; flex-wrap:wrap; }
.badge { padding:2px 8px; border-radius:999px; font-family:'Cinzel',serif; font-size:9px; font-weight:700; letter-spacing:.5px; }
.b-dom { background:rgba(139,26,26,.3); color:var(--red3); border:1px solid var(--red); }
.b-sub { background:rgba(58,8,80,.3); color:var(--purple3); border:1px solid var(--purple2); }
.tags  { display:flex; flex-wrap:wrap; gap:3px; margin-top:4px; }
.tag   { padding:2px 6px; border-radius:999px; font-size:10px; font-weight:600; background:rgba(139,26,26,.2); border:1px solid var(--red); color:var(--red3); }
.sess-note { font-size:11px; color:var(--muted); font-style:italic; margin-top:4px; }
.sdel { background:none; border:none; color:var(--muted); cursor:pointer; font-size:12px; float:right; line-height:1; padding:0; transition:color .15s; }
.sdel:hover { color:var(--red3); }

/* ── Ideas ── */
.idea-list  { display:flex; flex-direction:column; gap:5px; margin-bottom:10px; }
.idea-item  { padding:9px 11px; border-radius:5px; border:1px solid var(--b1); background:var(--s2); display:flex; align-items:flex-start; justify-content:space-between; gap:8px; font-size:13px; font-weight:400; }
.idel { background:none; border:none; color:var(--muted); cursor:pointer; font-size:14px; flex-shrink:0; transition:color .15s; }
.idel:hover { color:var(--red3); }

/* ── Fantasmes ── */
.fantasy-list { display:flex; flex-direction:column; gap:8px; }
.fantasy-card { padding:13px; border-radius:var(--r); border:1px solid var(--purple2); background:rgba(58,8,80,.15); position:relative; transition:all .2s; }
.fantasy-card:hover { border-color:var(--purple3); }
.fantasy-title { font-family:'Cinzel',serif; font-size:13px; font-weight:700; color:var(--purple3); margin-bottom:4px; }
.fantasy-desc  { font-size:12px; color:var(--text2); line-height:1.4; margin-bottom:8px; }
.fantasy-meta  { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:6px; }
.fantasy-badge { padding:2px 8px; border-radius:999px; font-size:10px; font-weight:600; border:1px solid; }
.fb-secret   { background:rgba(107,36,160,.2); border-color:var(--purple2); color:var(--purple3); }
.fb-revealed { background:rgba(184,132,42,.2); border-color:var(--gold2); color:var(--gold3); }
.fb-done     { background:rgba(30,106,64,.2); border-color:var(--green2); color:var(--green3); }
.fantasy-stars { color:var(--gold3); font-size:12px; }
.fantasy-del { position:absolute; top:8px; right:8px; background:none; border:none; color:var(--muted); cursor:pointer; font-size:13px; transition:color .15s; }
.fantasy-del:hover { color:var(--red3); }
.star-row    { display:flex; gap:3px; }
.star-btn    { background:none; border:none; cursor:pointer; font-size:18px; transition:transform .1s; padding:0; }
.star-btn:hover { transform:scale(1.2); }

/* ── Editor ── */
.prog-wrap { margin-bottom:10px; }
.prog-label { display:flex; justify-content:space-between; font-size:11px; color:var(--muted); margin-bottom:4px; font-weight:500; }
.prog-label span { color:var(--gold3); font-family:'Cinzel',serif; font-weight:700; }
.prog-bar  { height:5px; border-radius:3px; background:var(--b1); overflow:hidden; }
.prog-fill { height:100%; border-radius:3px; background:linear-gradient(90deg,var(--red),var(--gold2),var(--purple2)); transition:width .6s ease; }
.al-list   { display:flex; flex-direction:column; gap:4px; max-height:220px; overflow-y:auto; margin-bottom:8px; scrollbar-width:thin; scrollbar-color:var(--b2) transparent; }
.al-item   { padding:8px 10px; border-radius:4px; border:1px solid var(--b1); background:var(--s2); display:flex; align-items:flex-start; gap:6px; font-size:12px; }
.al-txt    { flex:1; line-height:1.4; font-weight:400; }
.al-del    { background:none; border:none; color:var(--muted); cursor:pointer; font-size:12px; flex-shrink:0; transition:color .15s; padding:0; }
.al-del:hover { color:var(--red3); }
.ed-lv     { display:flex; gap:3px; margin-bottom:10px; }
.ed-lv-btn { flex:1; padding:5px 2px; border-radius:3px; border:1px solid var(--b1); background:var(--s2); text-align:center; cursor:pointer; font-family:'Cinzel',serif; font-size:8px; font-weight:700; letter-spacing:.5px; color:var(--muted2); transition:all .15s; }
.ed-lv-btn.sel { border-color:var(--gold2); background:rgba(184,132,42,.15); color:var(--gold3); }
.ie-row    { display:flex; gap:5px; margin-top:8px; }

/* ── Limits ── */
.lim-grid  { display:grid; grid-template-columns:1fr 1fr; gap:5px; }
.lim-item  { padding:8px 9px; border-radius:5px; border:1px solid var(--b1); background:var(--s2); cursor:pointer; display:flex; align-items:center; gap:6px; font-size:12px; font-weight:500; transition:all .15s; }
.lim-item.hard   { border-color:var(--red2); background:rgba(139,26,26,.2); color:var(--red3); }
.lim-item.soft   { border-color:var(--gold2); background:rgba(184,132,42,.1); color:var(--gold3); }
.lim-dot { width:6px; height:6px; border-radius:50%; background:var(--b2); flex-shrink:0; transition:background .15s; }
.lim-item.hard .lim-dot { background:var(--red2); }
.lim-item.soft .lim-dot { background:var(--gold2); }

/* ── Stats ── */
.stats-grid { display:grid; grid-template-columns:1fr 1fr; gap:6px; }
.stat-card  { padding:12px; border-radius:5px; border:1px solid var(--b1); background:var(--s2); text-align:center; }
.stat-num   { font-family:'Cinzel',serif; font-size:24px; font-weight:700; background:linear-gradient(135deg,var(--gold3),var(--gold2)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; line-height:1; }
.stat-lbl   { font-size:10px; color:var(--muted); margin-top:2px; font-weight:500; }
.top-item   { display:flex; align-items:center; justify-content:space-between; font-size:12px; padding:4px 0; border-bottom:1px solid var(--b1); font-weight:400; }
.top-bar    { height:2px; border-radius:2px; background:var(--red2); margin-top:2px; transition:width .5s ease; }

/* ── Profiles ── */
.profile-switcher{display:flex;gap:6px;margin-bottom:14px}
.profile-tab{flex:1;padding:12px 8px;border-radius:var(--r);border:1px solid var(--b2);background:var(--s2);text-align:center;cursor:pointer;transition:all .2s}
.profile-tab:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,.3)}
.profile-tab.apt1{border-color:var(--red2);background:rgba(139,26,26,.18)}
.profile-tab.apt2{border-color:var(--purple2);background:rgba(58,8,80,.22)}
.profile-avatar{font-size:34px;display:block;margin-bottom:5px}
.profile-name{font-family:'Cinzel',serif;font-size:13px;font-weight:700;letter-spacing:1px}
.profile-tab.apt1 .profile-name{color:var(--red3)}
.profile-tab.apt2 .profile-name{color:var(--purple3)}
.profile-desc-txt{font-size:11px;color:var(--muted);margin-top:3px;font-style:italic}
.avatar-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:5px;margin:8px 0 12px}
.avatar-opt{font-size:20px;text-align:center;padding:6px 4px;border-radius:6px;border:1px solid var(--b1);background:var(--s2);cursor:pointer;transition:all .15s}
.avatar-opt.sel{border-color:var(--gold2);background:rgba(184,132,42,.15)}
.pstats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:10px 0}
.pstat{padding:8px 5px;border-radius:6px;border:1px solid var(--b1);background:var(--s2);text-align:center}
.pstat-num{font-family:'Cinzel',serif;font-size:18px;font-weight:700;background:linear-gradient(135deg,#fff,var(--gold3));-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1}
.pstat-lbl{font-size:9px;color:var(--muted);margin-top:2px}
.priv-section{background:rgba(58,8,80,.12);border:1px solid var(--purple2);border-radius:var(--r);padding:12px;margin-top:10px}
.priv-title{font-family:'Cinzel',serif;font-size:10px;font-weight:700;color:var(--purple3);letter-spacing:1px;margin-bottom:8px}
.active-badge{display:inline-block;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:600;font-family:'Cinzel',serif;background:rgba(184,132,42,.2);border:1px solid var(--gold2);color:var(--gold3);margin-top:4px;cursor:pointer}
.which-me-row{display:flex;gap:6px;margin-bottom:12px}

/* ── Wheel ── */
.wheel-result { padding:12px 16px; border:1px solid var(--red2); border-radius:var(--r); background:rgba(139,26,26,.18); text-align:center; font-size:14px; font-weight:500; color:var(--red3); animation:fi .3s ease; margin-bottom:10px; }

/* ── Outfit ── */
.of-list { display:flex; flex-direction:column; gap:4px; }
.of-item { padding:9px 12px; border-radius:5px; border:1px solid var(--b1); background:var(--s2); cursor:pointer; font-size:13px; font-weight:500; display:flex; align-items:center; justify-content:space-between; transition:all .15s; }
.of-item:hover { border-color:var(--muted2); }
.of-item.sel { border-color:var(--gold2); background:rgba(184,132,42,.12); color:var(--gold3); }

/* ── Generic ── */
.row  { display:flex; gap:6px; }
.col  { display:flex; flex-direction:column; gap:5px; }
.inp  { flex:1; background:var(--s2); border:1px solid var(--b1); border-radius:4px; padding:8px 11px; color:var(--text); font-family:'Inter',sans-serif; font-weight:400; font-size:13px; outline:none; transition:border-color .15s; }
.inp:focus { border-color:var(--red2); }
.inp::placeholder { color:var(--muted); }
textarea.inp { resize:vertical; min-height:58px; }
.form-lbl { font-family:'Inter',sans-serif; font-size:9px; font-weight:700; color:var(--gold2); letter-spacing:2px; text-transform:uppercase; margin-bottom:4px; display:block; }
.form-row { display:flex; flex-direction:column; gap:4px; margin-bottom:10px; }
.sep { height:1px; background:linear-gradient(90deg,transparent,var(--b1),transparent); margin:10px 0; }
.empty { text-align:center; color:var(--muted); font-style:italic; font-size:13px; padding:16px 0; font-weight:400; }

@keyframes fi    { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:none} }
@keyframes shine { 0%{opacity:1;transform:scale(1)} 50%{opacity:.7;transform:scale(1.04)} 100%{opacity:1;transform:scale(1)} }
.shine { animation:shine .5s ease; }

/* ── Validation ── */
.validate-row { display:flex; gap:8px; margin-bottom:4px; }
.validate-row .btn { flex:1; padding:10px 8px; font-size:12px; }
.abox-done { border-color:var(--green2) !important; background:linear-gradient(135deg,rgba(30,106,64,.15),rgba(10,6,16,.8)) !important; }
.abox-fail { border-color:var(--red2) !important; opacity:.7; }
.validate-result { padding:12px 14px; border-radius:var(--r); text-align:center; animation:fi .3s ease; margin-bottom:4px; }
.validate-result.done { background:rgba(30,106,64,.18); border:1px solid var(--green2); }
.validate-result.fail { background:rgba(139,26,26,.18); border:1px solid var(--red2); }
.vr-icon { font-size:28px; margin-bottom:4px; }
.vr-text { font-family:'Cinzel',serif; font-size:12px; font-weight:700; letter-spacing:1px; }
.validate-result.done .vr-text { color:var(--green3); }
.validate-result.fail .vr-text { color:var(--red3); }
.punishment-box { margin-top:8px; padding:8px 12px; border-radius:6px; background:rgba(139,26,26,.25); border:1px solid var(--red); font-size:12px; color:var(--red3); font-weight:500; }
`;

/* ═══════════════════════════════════════════════════════════
   STORAGE & HELPERS
═══════════════════════════════════════════════════════════ */
const KEY = "duality_v1";
function load()    { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } }
function persist(d){ try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {} }
function todayStr(){ return new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"2-digit",month:"long",year:"numeric"}); }
function todayISO(){ return new Date().toISOString().split("T")[0]; }
function pick(arr) { return arr[Math.floor(Math.random()*arr.length)]; }
function pickN(arr,n){ const s=[...arr],r=[]; while(r.length<n&&s.length>0){const i=Math.floor(Math.random()*s.length);r.push(s.splice(i,1)[0]);}return r; }

function getLinkState(pct){
  return LINK_STATES.find(s=>pct>=s.min)||LINK_STATES[LINK_STATES.length-1];
}

/* ═══════════════════════════════════════════════════════════
   APP
═══════════════════════════════════════════════════════════ */
export default function App() {
  const st = load();

  const [tab, setTab]           = useState("dashboard");

  /* ── Role ── */
  const [role, setRole]         = useState(st.role||null);
  const [flipping, setFlipping] = useState(false);
  const [endRot, setEndRot]     = useState(0);

  /* ── Link system ── */
  const [link, setLink]         = useState(st.link ?? 50);
  const [lastLinkDate, setLastLinkDate] = useState(st.lastLinkDate||null);

  /* Daily link decay */
  useEffect(()=>{
    const today = todayISO();
    if(lastLinkDate && lastLinkDate !== today){
      const days = Math.round((new Date(today)-new Date(lastLinkDate))/86400000);
      setLink(l=>Math.max(0, l - days));
    }
    setLastLinkDate(today);
  },[]);

  /* ── Categories & limits ── */
  const [limits, setLimits]     = useState(st.limits||{}); // {catId: "hard"|"soft"}
  const [activeCats, setActiveCats] = useState(st.activeCats||CATEGORIES.map(c=>c.id));
  const [favorites, setFavorites]   = useState(st.favorites||DEFAULT_FAVORITES);
  const [showCatPanel, setShowCatPanel] = useState(false);
  const [showFavPanel, setShowFavPanel] = useState(false);
  const [favName, setFavName]           = useState("");

  /* ── Custom actions ── */
  const [customActions, setCustomActs] = useState(st.customActions||{});

  /* ── Action state ── */
  const [actMode, setActMode]   = useState("random");
  const [mood, setMood]         = useState(st.mood||"all");
  const [intensity, setIntensity] = useState(st.intensity||3);
  const [curAction, setCurAction] = useState(null);
  const [curCat, setCurCat]       = useState(null);
  const [curLv, setCurLv]         = useState(null);
  const [flashAct, setFlashAct]   = useState(false);
  const [escaladeStep, setEscStep]= useState(0);
  const [proposals, setProposals] = useState([]);
  const [selActions, setSelActions] = useState([]);
  const [selQueue, setSelQueue]     = useState([]);
  const [selIdx, setSelIdx]         = useState(0);
  const [secretQueue, setSecretQueue] = useState([]);
  const [secretIdx, setSecretIdx]     = useState(0);
  const [secretRevealed, setSecretRevealed] = useState(false);
  const [actionStatus, setActionStatus] = useState(null); // null | "done" | "fail"

  /* ── Timer ── */
  const [timer, setTimer]       = useState(0);
  const [timerRunning, setTimerR] = useState(false);
  const [timerMax, setTimerMax] = useState(300);
  const timerRef = useRef();
  useEffect(()=>{
    if(timerRunning){timerRef.current=setInterval(()=>setTimer(t=>{if(t<=1){clearInterval(timerRef.current);setTimerR(false);return 0;}return t-1;}),1000);}
    else clearInterval(timerRef.current);
    return()=>clearInterval(timerRef.current);
  },[timerRunning]);

  /* ── Punishment ── */
  const [punishment, setPunishment] = useState(null);

  /* ── Distance ── */
  const [missions, setMissions] = useState(st.missions||[]);
  const [distMode, setDistMode] = useState("defis");
  const [selDefis, setSelDefis] = useState([]);
  const [customMission, setCustomMission] = useState("");
  const [missionHour, setMissionHour]     = useState("");

  /* ── Profils ── */
  const [p1Name, setP1Name]   = useState(st.p1Name||"Joueur 1");
  const [p1Avatar, setP1Avatar] = useState(st.p1Avatar||"👑");
  const [p1Desc, setP1Desc]   = useState(st.p1Desc||"");
  const [p1Notes, setP1Notes] = useState(st.p1Notes||"");
  const [p2Name, setP2Name]   = useState(st.p2Name||"Joueur 2");
  const [p2Avatar, setP2Avatar] = useState(st.p2Avatar||"⛓️");
  const [p2Desc, setP2Desc]   = useState(st.p2Desc||"");
  const [p2Notes, setP2Notes] = useState(st.p2Notes||"");
  const [editProfile, setEditProfile] = useState(null); // null | "p1" | "p2"
  const [activeProfile, setActiveProfile] = useState("p1"); // which profile is "mine"

  /* ── Session ── */
  const [outfit, setOutfit]     = useState(st.outfit||null);
  const [newNote, setNewNote]   = useState("");
  const [newDom, setNewDom]     = useState("Joueur 1");
  const [newSub, setNewSub]     = useState("Joueur 2");

  /* ── Points & streak ── */
  const [points, setPoints]     = useState(st.points||0);
  const [ptsIn, setPtsIn]       = useState("");
  const [shine, setShine]       = useState(false);
  const [streak, setStreak]     = useState(st.streak||0);
  const [lastDate, setLastDate] = useState(st.lastDate||null);

  /* ── Sessions & ideas ── */
  const [sessions, setSessions] = useState(st.sessions||[]);
  const [ideas, setIdeas]       = useState(st.ideas||[]);
  const [ideaIn, setIdeaIn]     = useState("");

  /* ── Fantasmes ── */
  const [fantasmes, setFantasmes] = useState(st.fantasmes||[]);
  const [showFantForm, setShowFantForm] = useState(false);
  const [fantTitle, setFantTitle]     = useState("");
  const [fantDesc, setFantDesc]       = useState("");
  const [fantImportance, setFantImportance] = useState(3);
  const [fantDiff, setFantDiff]       = useState(3);
  const [fantPrivate, setFantPrivate] = useState(true);

  /* ── Editor ── */
  const [edCat, setEdCat]       = useState(CATEGORIES[0].id);
  const [edLv, setEdLv]         = useState(1);
  const [edText, setEdText]     = useState("");

  /* ── Persist ── */
  useEffect(()=>{
    persist({role,link,lastLinkDate,limits,activeCats,favorites,customActions,mood,intensity,outfit,points,streak,lastDate,sessions,ideas,missions,fantasmes,p1Name,p1Avatar,p1Desc,p1Notes,p2Name,p2Avatar,p2Desc,p2Notes,activeProfile});
  },[role,link,lastLinkDate,limits,activeCats,favorites,customActions,mood,intensity,outfit,points,streak,lastDate,sessions,ideas,missions,fantasmes,p1Name,p1Avatar,p1Desc,p1Notes,p2Name,p2Avatar,p2Desc,p2Notes,activeProfile]);

  /* ──────────────────────────────────────────────────────
     HELPERS
  ────────────────────────────────────────────────────── */
  // Toutes les catégories non bloquées
  const allValidCats = CATEGORIES.filter(c=>limits[c.id]!=="hard");
  // Catégories actives sélectionnées dans le panneau
  const activeCatsValid = CATEGORIES.filter(c=>activeCats.includes(c.id)&&limits[c.id]!=="hard");
  // Catégories qui ont au moins une action
  const catsWithActions = CATEGORIES.filter(c=>{
    if(limits[c.id]==="hard") return false;
    const cd=customActions[c.id]||{};
    return Object.values(cd).some(arr=>arr.length>0);
  });

  function getMoodLevels(){
    const m=MOODS.find(x=>x.id===mood);
    // Si humeur "all" ou intensité max → tous les niveaux disponibles
    const lvs=m?m.levels:[1,2,3,4,5,6];
    const filtered=lvs.filter(l=>l<=intensity);
    // Si le filtre est trop restrictif, on prend quand même tous les niveaux ≤ intensity
    return filtered.length>0?filtered:[1,2,3,4,5,6].filter(l=>l<=intensity);
  }

  function getAllPool(catIds, levels){
    const pool=[];
    catIds.forEach(id=>{
      const cd=customActions[id]||{};
      // Si pas d'actions aux niveaux demandés, chercher dans tous les niveaux disponibles
      const lvPool=[];
      levels.forEach(lv=>{(cd[lv]||[]).forEach(a=>lvPool.push({text:a,level:lv,cat:id}));});
      if(lvPool.length>0) lvPool.forEach(a=>pool.push(a));
      else {
        // Fallback : prendre toutes les actions de cette catégorie peu importe le niveau
        Object.entries(cd).forEach(([lv,acts])=>acts.forEach(a=>pool.push({text:a,level:parseInt(lv),cat:id})));
      }
    });
    return pool;
  }

  function getAllActionsFlat(){
    const list=[];
    const cats = activeCatsValid.length>0 ? activeCatsValid : catsWithActions;
    cats.forEach(c=>{
      const cd=customActions[c.id]||{};
      Object.entries(cd).forEach(([lv,acts])=>acts.forEach(a=>list.push({text:a,cat:c.id,catLabel:c.label,catIcon:c.icon,level:parseInt(lv)})));
    });
    return list;
  }

  // Toutes les actions de toutes les catégories (pour l'éditeur)
  function getAllActionsFlatAll(){
    const list=[];
    CATEGORIES.forEach(c=>{
      const cd=customActions[c.id]||{};
      Object.entries(cd).forEach(([lv,acts])=>acts.forEach(a=>list.push({text:a,cat:c.id,catLabel:c.label,catIcon:c.icon,level:parseInt(lv)})));
    });
    return list;
  }

  function fireAction(a){
    const catObj=CATEGORIES.find(x=>x.id===a.cat);
    setCurCat(catObj?.label||""); setCurLv(a.level); setCurAction(a.text);
    setActionStatus(null); // reset validation
    setFlashAct(true); setTimeout(()=>setFlashAct(false),600);
  }

  function validateAction(success){
    if(success){
      setActionStatus("done");
      setPoints(p=>p+5);
      setLink(l=>Math.min(100,l+5));
    } else {
      setActionStatus("fail");
      setLink(l=>Math.max(0,l-3));
      setPunishment(pick(PUNISHMENTS));
    }
  }

  function generateRandom(catIds){
    // Utiliser toutes les catégories avec actions si le pool est vide
    const effectiveCats = catIds.length>0 ? catIds : catsWithActions.map(c=>c.id);
    const lvs=getMoodLevels();
    let pool=getAllPool(effectiveCats,lvs);
    // Fallback : ignorer le filtre d'intensité si rien trouvé
    if(!pool.length) pool=getAllPool(effectiveCats,[1,2,3,4,5,6]);
    if(!pool.length){setCurAction("Aucune action — ajoute-en dans l'onglet ✏ Éditeur !");setCurCat("—");setCurLv(null);return;}
    fireAction(pick(pool));
  }

  function generateProposals(catIds){
    const effectiveCats = catIds.length>0 ? catIds : catsWithActions.map(c=>c.id);
    const lvs=getMoodLevels();
    let pool=getAllPool(effectiveCats,lvs);
    if(!pool.length) pool=getAllPool(effectiveCats,[1,2,3,4,5,6]);
    if(!pool.length){setProposals([]);return;}
    setProposals(pickN(pool,Math.min(5,pool.length)));
    setFlashAct(true);setTimeout(()=>setFlashAct(false),600);
  }

  function startSelQueue(){
    const q=selActions.map(text=>{
      for(const [catId,levels] of Object.entries(customActions)){
        for(const [lv,acts] of Object.entries(levels)){
          if(acts.includes(text)) return {text,cat:catId,level:parseInt(lv)};
        }
      }
      return {text,cat:null,level:null};
    });
    setSelQueue(q);setSelIdx(0);
    if(q[0]) fireAction(q[0]);
  }

  function nextSel(){
    const ni=selIdx+1;
    if(ni>=selQueue.length){setCurAction("✅ Session terminée !");setCurCat("Fin");setCurLv(null);return;}
    setSelIdx(ni);fireAction(selQueue[ni]);
  }

  function startSecret(){
    const cats = activeCatsValid.length>0 ? activeCatsValid : catsWithActions;
    const lvs=getMoodLevels();
    let pool=getAllPool(cats.map(c=>c.id),lvs);
    if(!pool.length) pool=getAllPool(cats.map(c=>c.id),[1,2,3,4,5,6]);
    setSecretQueue(pickN(pool,Math.min(8,pool.length)));
    setSecretIdx(0);setSecretRevealed(false);
  }

  function revealSecret(){
    if(!secretQueue.length) return;
    fireAction(secretQueue[secretIdx]);
    setSecretRevealed(true);
  }

  function nextSecret(){
    const ni=secretIdx+1;
    if(ni>=secretQueue.length){setCurAction("✅ Toutes les surprises révélées !");setCurCat("Fin");setCurLv(null);setSecretRevealed(true);return;}
    setSecretIdx(ni);setSecretRevealed(false);
  }

  /* Favorites */
  function saveFav(){
    if(!favName.trim()||!activeCats.length) return;
    setFavorites([...favorites,{id:`fav${Date.now()}`,name:favName.trim(),cats:[...activeCats]}]);
    setFavName("");setShowFavPanel(false);
  }
  function loadFav(f){setActiveCats(f.cats);setShowCatPanel(false);setShowFavPanel(false);}
  function delFav(id){setFavorites(favorites.filter(f=>f.id!==id));}

  /* Points */
  function addPts(){const n=parseInt(ptsIn);if(!n||n<=0)return;setPoints(p=>p+n);setPtsIn("");setShine(true);setTimeout(()=>setShine(false),600);}
  function subPts(){const n=parseInt(ptsIn);if(!n||n<=0)return;setPoints(p=>Math.max(0,p-n));setPtsIn("");}
  function getSubTitle(){let t=SUB_TITLES[0];SUB_TITLES.forEach(s=>{if(points>=s.min)t=s;});return t;}

  /* Session save */
  function saveSession(){
    const today=todayISO();
    let ns=streak;
    if(lastDate){const d=Math.round((new Date(today)-new Date(lastDate))/86400000);if(d===1)ns=streak+1;else if(d>1)ns=1;}else ns=1;
    setStreak(ns);setLastDate(today);
    setSessions([{id:Date.now(),date:todayStr(),categories:activeCatsValid.map(c=>c.label),outfit,note:newNote,dom:newDom,sub:newSub},...sessions]);
    setNewNote("");setEscStep(0);
    setLink(l=>Math.min(100,l+10));
    if(ns%5===0)setPoints(p=>p+10);
  }

  /* Ideas */
  function addIdea(){if(!ideaIn.trim())return;setIdeas([{id:Date.now(),text:ideaIn.trim()},...ideas]);setIdeaIn("");}
  function delIdea(id){setIdeas(ideas.filter(i=>i.id!==id));}

  /* Fantasmes */
  function addFantasme(){
    if(!fantTitle.trim())return;
    setFantasmes([{id:Date.now(),title:fantTitle,desc:fantDesc,importance:fantImportance,difficulty:fantDiff,status:fantPrivate?"secret":"secret",private:fantPrivate},...fantasmes]);
    setFantTitle("");setFantDesc("");setFantImportance(3);setFantDiff(3);setShowFantForm(false);
  }
  function revealFantasme(id){setFantasmes(fantasmes.map(f=>f.id===id?{...f,status:"revealed",private:false}:f));setLink(l=>Math.min(100,l+15));}
  function realisedFantasme(id){setFantasmes(fantasmes.map(f=>f.id===id?{...f,status:"done"}:f));setLink(l=>Math.min(100,l+20));}
  function delFantasme(id){setFantasmes(fantasmes.filter(f=>f.id!==id));}

  /* Missions */
  function addMission(defi,desc="",hour=""){
    const d=defi||DISTANCE_DEFIS.find(x=>x.id==="custom");
    setMissions([{id:Date.now(),type:distMode,icon:d.icon,title:d.label,desc:desc||d.desc,hour,status:"pending"},...missions]);
    setSelDefi(null);setCustomMission("");setMissionHour("");
  }
  function updMission(id,status){setMissions(missions.map(m=>m.id===id?{...m,status}:m));}
  function delMission(id){setMissions(missions.filter(m=>m.id!==id));}

  /* Editor */
  function addAction(){
    if(!edText.trim())return;
    const u={...customActions};
    if(!u[edCat])u[edCat]={};
    if(!u[edCat][edLv])u[edCat][edLv]=[];
    u[edCat][edLv]=[...u[edCat][edLv],edText.trim()];
    setCustomActs(u);setEdText("");
  }
  function delAction(catId,lv,idx){
    const u={...customActions};
    u[catId][lv]=u[catId][lv].filter((_,i)=>i!==idx);
    setCustomActs(u);
  }
  function countActions(){let n=0;Object.values(customActions).forEach(cat=>Object.values(cat).forEach(arr=>n+=arr.length));return n;}
  const totalActs=countActions();
  const edCatActs=(customActions[edCat]||{})[edLv]||[];

  /* Export/Import */
  const fileRef=useRef();
  function exportActs(){const b=new Blob([JSON.stringify(customActions,null,2)],{type:"application/json"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download="duality-actions.json";a.click();URL.revokeObjectURL(u);}
  function importActs(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{try{setCustomActs(JSON.parse(ev.target.result));}catch{}};r.readAsText(f);}

  /* Stats */
  function getStats(){
    const cc={};sessions.forEach(s=>s.categories.forEach(c=>{cc[c]=(cc[c]||0)+1;}));
    const sorted=Object.entries(cc).sort((a,b)=>b[1]-a[1]).slice(0,4);
    return {total:sessions.length,sorted,maxVal:sorted[0]?.[1]||1};
  }
  const stats=getStats();

  /* Link */
  const linkState=getLinkState(link);

  /* Timer UI */
  const circ=2*Math.PI*32;
  const dash=circ*(1-(timerMax>0?timer/timerMax:0));

  const pendingCount=missions.filter(m=>m.status==="pending").length;
  const lvColor=(lv)=>INTENSITY.find(x=>x.level===lv)?.color||"#888";
  const lvLabel=(lv)=>INTENSITY.find(x=>x.level===lv)?.label||"";

  function ActionDisplay({onNext}){
    if(!curAction) return <div className="aempty">Lance une action pour commencer.</div>;
    return <div style={{width:"100%"}}>
      {/* Action card */}
      <div className={`abox${flashAct?" flash":""}${actionStatus==="done"?" abox-done":actionStatus==="fail"?" abox-fail":""}`} style={{marginBottom:10}}>
        <div>
          {curCat&&<div className="acat">{curCat}</div>}
          {curLv&&<span className="alv" style={{background:`color-mix(in srgb,${lvColor(curLv)} 22%,transparent)`,border:`1px solid ${lvColor(curLv)}`,color:lvColor(curLv)}}>{lvLabel(curLv)}</span>}
          <div className="atxt" style={{marginTop:curLv?6:0}}>{curAction}</div>
        </div>
      </div>

      {/* Validation */}
      {actionStatus===null&&<div className="validate-row">
        <button className="btn btn-gr btn-full" onClick={()=>validateAction(true)}>✅ Accompli +5pts +5% Lien</button>
        <button className="btn btn-full" style={{borderColor:"var(--red2)",color:"var(--red3)"}} onClick={()=>validateAction(false)}>❌ Échec −3% Lien</button>
      </div>}

      {/* Résultat accompli */}
      {actionStatus==="done"&&<div className="validate-result done">
        <div className="vr-icon">✅</div>
        <div className="vr-text">Accompli ! +5 pts · +5% Lien</div>
        {onNext&&<button className="btn btn-p btn-sm" style={{marginTop:8}} onClick={onNext}>Action suivante ▶</button>}
      </div>}

      {/* Résultat échec */}
      {actionStatus==="fail"&&<div className="validate-result fail">
        <div className="vr-icon">❌</div>
        <div className="vr-text">Échec — −3% Lien</div>
        {punishment&&<div className="punishment-box">🎡 Châtiment : {punishment}</div>}
        {onNext&&<button className="btn btn-sm" style={{marginTop:8,borderColor:"var(--muted)",color:"var(--muted)"}} onClick={onNext}>Action suivante ▶</button>}
      </div>}
    </div>;
  }

  function StarRating({val,set,max=5}){
    return <div className="star-row">{Array.from({length:max},(_,i)=><button key={i} className="star-btn" onClick={()=>set(i+1)}>{i<val?"⭐":"☆"}</button>)}</div>;
  }

  function CatSelectorPanel(){
    return <div className="cat-panel">
      <div className="cat-sel-toggle" onClick={()=>setShowCatPanel(p=>!p)}>
        <span className="cat-sel-lbl">🗂 Catégories actives</span>
        <span className="cat-sel-count">{activeCatsValid.length} sélectionnée{activeCatsValid.length>1?"s":""} {showCatPanel?"▲":"▼"}</span>
      </div>
      {favorites.length>0&&<div className="fav-chips">
        {favorites.map(f=>(
          <span key={f.id} className="fav-chip" onClick={()=>loadFav(f)}>
            ⭐ {f.name}
            <button className="fav-chip-del" onClick={e=>{e.stopPropagation();delFav(f.id);}}>×</button>
          </span>
        ))}
      </div>}
      {!showCatPanel&&activeCatsValid.length>0&&<div className="active-cats-summary">
        {activeCatsValid.map(c=><span key={c.id} className="ac-chip" onClick={()=>setShowCatPanel(true)}>{c.icon} {c.label}</span>)}
      </div>}
      {showCatPanel&&<>
        <div className="all-none-row">
          <button className="btn btn-xs btn-pu" onClick={()=>setActiveCats(CATEGORIES.filter(c=>limits[c.id]!=="hard").map(c=>c.id))}>Tout</button>
          <button className="btn btn-xs" onClick={()=>setActiveCats([])}>Aucune</button>
        </div>
        <div className="cat-grid" style={{marginBottom:10}}>
          {CATEGORIES.map(c=>(
            <div key={c.id}
              className={`ci-item${activeCats.includes(c.id)?" sel":""}${limits[c.id]==="hard"?" blocked":""}`}
              onClick={()=>limits[c.id]!=="hard"&&setActiveCats(a=>a.includes(c.id)?a.filter(x=>x!==c.id):[...a,c.id])}>
              <span className="cii">{c.icon}</span>{c.label}
              {limits[c.id]==="soft"&&<span style={{marginLeft:"auto",fontSize:9,color:"var(--gold2)"}}>⚠</span>}
            </div>
          ))}
        </div>
        {!showFavPanel
          ? <button className="btn btn-g btn-sm btn-full" onClick={()=>setShowFavPanel(true)}>⭐ Sauvegarder comme favori</button>
          : <div className="row">
              <input className="inp" placeholder="Nom du favori…" value={favName} onChange={e=>setFavName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveFav()}/>
              <button className="btn btn-g btn-sm" onClick={saveFav}>✓</button>
              <button className="btn btn-sm" onClick={()=>{setShowFavPanel(false);setFavName("");}}>✕</button>
            </div>
        }
      </>}
    </div>;
  }

  /* ── TABS ── */
  const TABS=[
    {id:"dashboard",label:"🏠 Accueil"},
    {id:"profil",   label:"👤 Profils"},
    {id:"role",     label:"⚔ Rôles"},
    {id:"action",   label:"🔥 Action"},
    {id:"distance", label:"📱 Distance",badge:pendingCount},
    {id:"session",  label:"📋 Session"},
    {id:"fantasmes",label:"🔒 Fantasmes"},
    {id:"points",   label:"⭐ Points"},
    {id:"history",  label:"📅 Historique"},
    {id:"ideas",    label:"💡 Idées"},
    {id:"editor",   label:"✏ Éditeur",badge:totalActs},
    {id:"limits",   label:"🛑 Limites"},
    {id:"stats",    label:"📊 Stats"},
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="app">

        {/* Header */}
        <div className="hdr">
          <div className="hdr-title">Duality</div>
          <div className="hdr-sub">// espace privé & sécurisé //</div>
          <div className="hdr-line"/>
        </div>

        {/* Safeword */}
        <div className="sw">SAFEWORD — prononcez <span>ROUGE</span> pour tout stopper</div>

        {/* Link bar */}
        <div className="link-bar">
          <span className="link-bar-label">{linkState.icon} Lien</span>
          <div className="link-track">
            <div className="link-fill" style={{width:`${link}%`,background:`linear-gradient(90deg,${linkState.color},${linkState.color}cc)`}}/>
          </div>
          <span className="link-pct" style={{color:linkState.color}}>{link}%</span>
          <span className="link-state" style={{color:linkState.color}}>{linkState.label}</span>
        </div>

        {/* Nav */}
        <nav className="nav">
          {TABS.map(t=>(
            <button key={t.id} className={`nb${tab===t.id?" on":""}`} onClick={()=>setTab(t.id)}>
              {t.label}
              {t.badge>0&&<span className="cbadge">{t.badge}</span>}
            </button>
          ))}
        </nav>

        {/* ══ DASHBOARD ══ */}
        {tab==="dashboard"&&(<>
          <div className="card gold">
            <div className="ctitle">Tableau de bord</div>
            <div className="dash-stat-grid">
              <div className="dash-stat"><div className="dash-stat-num">{sessions.length}</div><div className="dash-stat-lbl">Sessions</div></div>
              <div className="dash-stat"><div className="dash-stat-num">{streak}🔥</div><div className="dash-stat-lbl">Streak</div></div>
              <div className="dash-stat"><div className="dash-stat-num">{points}</div><div className="dash-stat-lbl">Points</div></div>
            </div>
            <div className="dash-grid">
              <div className="dash-card" onClick={()=>setTab("action")}>
                <div className="dash-icon">🔥</div>
                <div className="dash-lbl">Action rapide</div>
                <div className="dash-val">Générer maintenant</div>
              </div>
              <div className="dash-card" onClick={()=>setTab("session")}>
                <div className="dash-icon">📋</div>
                <div className="dash-lbl">Session</div>
                <div className="dash-val">Préparer une session</div>
              </div>
              <div className="dash-card" onClick={()=>setTab("fantasmes")}>
                <div className="dash-icon">🔒</div>
                <div className="dash-lbl">Fantasmes</div>
                <div className="dash-val">{fantasmes.length} enregistré{fantasmes.length>1?"s":""}</div>
              </div>
              <div className="dash-card" onClick={()=>setTab("distance")}>
                <div className="dash-icon">📱</div>
                <div className="dash-lbl">À distance</div>
                <div className="dash-val">{pendingCount} en attente</div>
              </div>
              <div className="dash-card" onClick={()=>setTab("points")}>
                <div className="dash-icon">⭐</div>
                <div className="dash-lbl">Récompenses</div>
                <div className="dash-val">{points} pts — {getSubTitle().icon} {getSubTitle().title}</div>
              </div>
              <div className="dash-card" onClick={()=>setTab("ideas")}>
                <div className="dash-icon">💡</div>
                <div className="dash-lbl">Idées</div>
                <div className="dash-val">{ideas.length} noté{ideas.length>1?"es":""}</div>
              </div>
            </div>
          </div>
          {sessions.length>0&&<div className="card">
            <div className="ctitle">Dernière session</div>
            <div className="sess-date">{sessions[0].date}</div>
            <div className="tags">{sessions[0].categories.slice(0,4).map((c,i)=><span key={i} className="tag">{c}</span>)}</div>
            {sessions[0].note&&<div className="sess-note">"{sessions[0].note}"</div>}
          </div>}
        </>)}

        {/* ══ PROFILS ══ */}
        {tab==="profil"&&(()=>{
          const AVATARS=["👑","⛓️","🔥","💀","🌹","🖤","🐍","🦋","🌙","⚡","🎭","💎","🗡️","🩸","🔮","🌑","💜","❤️‍🔥","🐉","🦅","🌊","🔱","⚔️","🎪"];
          const isP1=editProfile==="p1"||activeProfile==="p1";
          return <>
            {/* Qui suis-je */}
            <div className="card gold">
              <div className="ctitle">Quel profil est le mien ?</div>
              <div className="which-me-row">
                <button className={`btn btn-full${activeProfile==="p1"?" btn-p":""}`} onClick={()=>setActiveProfile("p1")}>
                  {p1Avatar} Je suis {p1Name}
                </button>
                <button className={`btn btn-full${activeProfile==="p2"?" btn-pu":""}`} onClick={()=>setActiveProfile("p2")}>
                  {p2Avatar} Je suis {p2Name}
                </button>
              </div>
              <p style={{fontSize:11,color:"var(--muted)",textAlign:"center"}}>Tes notes privées ne sont visibles que sur ton profil</p>
            </div>

            {/* Cards des deux profils */}
            <div className="card">
              <div className="ctitle">Nos profils</div>
              <div className="profile-switcher">
                {[{id:"p1",name:p1Name,avatar:p1Avatar,desc:p1Desc,cls:"apt1"},{id:"p2",name:p2Name,avatar:p2Avatar,desc:p2Desc,cls:"apt2"}].map(p=>(
                  <div key={p.id} className={`profile-tab${editProfile===p.id?" "+p.cls:""}`} onClick={()=>setEditProfile(editProfile===p.id?null:p.id)}>
                    <span className="profile-avatar">{p.avatar}</span>
                    <div className="profile-name">{p.name}</div>
                    {p.desc&&<div className="profile-desc-txt">"{p.desc}"</div>}
                    {activeProfile===p.id&&<div className="active-badge">✦ Mon profil</div>}
                  </div>
                ))}
              </div>

              {/* Stats communes visibles */}
              <div className="pstats-row">
                <div className="pstat"><div className="pstat-num">{sessions.length}</div><div className="pstat-lbl">Sessions</div></div>
                <div className="pstat"><div className="pstat-num">{streak}🔥</div><div className="pstat-lbl">Streak</div></div>
                <div className="pstat"><div className="pstat-num">{points}</div><div className="pstat-lbl">Points</div></div>
                <div className="pstat"><div className="pstat-num">{fantasmes.filter(f=>f.status==="done").length}</div><div className="pstat-lbl">Fantasmes</div></div>
                <div className="pstat"><div className="pstat-num">{totalActs}</div><div className="pstat-lbl">Actions</div></div>
                <div className="pstat"><div className="pstat-num">{link}%</div><div className="pstat-lbl">Lien</div></div>
              </div>
            </div>

            {/* Edit P1 */}
            {editProfile==="p1"&&<div className="card">
              <div className="ctitle">✏ Modifier — {p1Name}</div>
              <div className="form-row"><span className="form-lbl">Pseudo</span><input className="inp" value={p1Name} onChange={e=>setP1Name(e.target.value)} placeholder="Pseudo…"/></div>
              <div className="form-row">
                <span className="form-lbl">Description visible</span>
                <input className="inp" value={p1Desc} onChange={e=>setP1Desc(e.target.value)} placeholder="Une phrase qui te décrit…"/>
              </div>
              <div className="form-row">
                <span className="form-lbl">Avatar</span>
                <div className="avatar-grid">
                  {AVATARS.map(a=><div key={a} className={`avatar-opt${p1Avatar===a?" sel":""}`} onClick={()=>setP1Avatar(a)}>{a}</div>)}
                </div>
              </div>
              {activeProfile==="p1"&&<div className="priv-section">
                <div className="priv-title">🔒 Notes privées — visible uniquement par toi</div>
                <textarea className="inp" value={p1Notes} onChange={e=>setP1Notes(e.target.value)} placeholder="Tes préférences, pensées, limites personnelles, notes intimes…" style={{minHeight:90}}/>
              </div>}
              <button className="btn btn-p btn-sm" style={{marginTop:10}} onClick={()=>setEditProfile(null)}>✓ Fermer</button>
            </div>}

            {/* Edit P2 */}
            {editProfile==="p2"&&<div className="card">
              <div className="ctitle">✏ Modifier — {p2Name}</div>
              <div className="form-row"><span className="form-lbl">Pseudo</span><input className="inp" value={p2Name} onChange={e=>setP2Name(e.target.value)} placeholder="Pseudo…"/></div>
              <div className="form-row">
                <span className="form-lbl">Description visible</span>
                <input className="inp" value={p2Desc} onChange={e=>setP2Desc(e.target.value)} placeholder="Une phrase qui te décrit…"/>
              </div>
              <div className="form-row">
                <span className="form-lbl">Avatar</span>
                <div className="avatar-grid">
                  {AVATARS.map(a=><div key={a} className={`avatar-opt${p2Avatar===a?" sel":""}`} onClick={()=>setP2Avatar(a)}>{a}</div>)}
                </div>
              </div>
              {activeProfile==="p2"&&<div className="priv-section">
                <div className="priv-title">🔒 Notes privées — visible uniquement par toi</div>
                <textarea className="inp" value={p2Notes} onChange={e=>setP2Notes(e.target.value)} placeholder="Tes préférences, pensées, limites personnelles, notes intimes…" style={{minHeight:90}}/>
              </div>}
              <button className="btn btn-pu btn-sm" style={{marginTop:10}} onClick={()=>setEditProfile(null)}>✓ Fermer</button>
            </div>}
          </>;
        })()}

        {/* ══ RÔLES ══ */}
        {tab==="role"&&(
          <div className="card">
            <div className="ctitle">Choisir ou tirer les rôles</div>
            <div className="role-grid">
              <div className={`rc rc-dom${role==="dom"?" sel":""}`} onClick={()=>setRole("dom")}><span className="ri">👑</span><span className="rl">Dominant</span><span className="rd">Contrôle total</span></div>
              <div className={`rc rc-sub${role==="sub"?" sel":""}`} onClick={()=>setRole("sub")}><span className="ri">⛓️</span><span className="rl">Soumis</span><span className="rd">Abandon total</span></div>
            </div>
            <div className="or"><span>ou laisser le destin décider</span></div>
            <div className="coin-wrap">
              <div className="coin" onClick={()=>{if(flipping)return;setFlipping(true);const d=Math.random()<.5;const r=(Math.floor(Math.random()*4)+4)*360+(d?0:180);setEndRot(r);setTimeout(()=>{setFlipping(false);setRole(d?"dom":"sub");},1550);}}>
                <div className={`ci${flipping?" spin":""}`} style={{"--er":`${endRot}deg`}}>
                  <div className="cface cf-f"><span className="cfi">👑</span>DOM</div>
                  <div className="cface cf-b"><span className="cfi">⛓️</span>SUB</div>
                </div>
              </div>
              <button className="btn btn-p btn-sm" onClick={()=>{if(flipping)return;setFlipping(true);const d=Math.random()<.5;const r=(Math.floor(Math.random()*4)+4)*360+(d?0:180);setEndRot(r);setTimeout(()=>{setFlipping(false);setRole(d?"dom":"sub");},1550);}} disabled={flipping}>{flipping?"En vol…":"🎲 Lancer la pièce"}</button>
            </div>
            {role&&!flipping&&(
              <div className={`rr ${role==="dom"?"rr-dom":"rr-sub"}`}>
                {role==="dom"?"👑 Dominant ce soir":"⛓️ Soumis ce soir"}
                <div className="rr2">{role==="dom"?"Tu prends le contrôle — obéissance totale exigée":"Tu t'abandonnes — obéis ou assume les conséquences"}</div>
              </div>
            )}
          </div>
        )}

        {/* ══ ACTION ══ */}
        {tab==="action"&&(<>
          <div className="mode-tog">
            <button className={`mb${actMode==="random"?" on":""}`} onClick={()=>{setActMode("random");setProposals([]);setCurAction(null);}}>Aléatoire</button>
            <button className={`mb${actMode==="proposals"?" on":""}`} onClick={()=>{setActMode("proposals");setCurAction(null);}}>Propositions</button>
            <button className={`mb${actMode==="select"?" on":""}`} onClick={()=>{setActMode("select");setCurAction(null);setSelActions([]);}}>Choisir</button>
            <button className={`mb${actMode==="secret"?" on":""}`} onClick={()=>{setActMode("secret");setCurAction(null);setSecretQueue([]);setSecretRevealed(false);}}>Secret</button>
            <button className={`mb${actMode==="escalade"?" on":""}`} onClick={()=>{setActMode("escalade");setCurAction(null);setEscStep(0);}}>Escalade</button>
          </div>

          {/* Cat selector */}
          <div style={{margin:"10px 16px 0"}}><CatSelectorPanel/></div>

          {actMode!=="escalade"&&<div className="card">
            <div className="ctitle">Intensité max ({intensity}/6)</div>
            <div className="int-grid">{INTENSITY.map(lv=><div key={lv.level} className={`int-btn${intensity===lv.level?" sel":""}`} style={{"--ic":lv.color}} onClick={()=>setIntensity(lv.level)}><span className="ilbl">{lv.label}</span><div className="idot"/></div>)}</div>
          </div>}

          {/* ALÉATOIRE */}
          {actMode==="random"&&<div className="card">
            <div className="ctitle">Action aléatoire</div>
            {totalActs===0
              ? <div style={{textAlign:"center",padding:"16px 0"}}>
                  <div style={{fontSize:32,marginBottom:8}}>✏️</div>
                  <p style={{fontSize:13,color:"var(--muted)",lineHeight:1.6,marginBottom:12}}>Tu n'as pas encore créé d'actions.<br/>Va dans l'onglet <strong style={{color:"var(--gold3)"}}>✏ Éditeur</strong> pour en ajouter.</p>
                  <button className="btn btn-g btn-sm" onClick={()=>setTab("editor")}>→ Aller à l'Éditeur</button>
                </div>
              : <>
                <ActionDisplay/>
                {(actionStatus!==null||!curAction)&&<div className="row" style={{marginTop:8}}>
                  <button className="btn btn-p btn-full" onClick={()=>generateRandom(activeCatsValid.map(c=>c.id))}>🎲 Nouvelle action</button>
                </div>}
              </>
            }
          </div>}

          {actMode==="proposals"&&<div className="card">
            <div className="ctitle">3-5 propositions</div>
            {activeCatsValid.length===0&&totalActs===0?<p className="empty">Ajoute des actions dans l'Éditeur d'abord.</p>:<>
              {!curAction&&proposals.length>0&&<div className="act-sel-list">
                {proposals.map((p,i)=>{
                  const catObj=CATEGORIES.find(x=>x.id===p.cat);
                  return <div key={i} className="act-sel-item" onClick={()=>fireAction(p)}>
                    <div className="asi-body">
                      <div className="asi-name">{p.text}</div>
                      <div className="asi-meta">
                        <span>{catObj?.icon} {catObj?.label}</span>
                        <span className="asi-lv" style={{background:`color-mix(in srgb,${lvColor(p.level)} 20%,transparent)`,border:`1px solid ${lvColor(p.level)}`,color:lvColor(p.level)}}>{lvLabel(p.level)}</span>
                      </div>
                    </div>
                    <span style={{color:"var(--muted)",fontSize:18}}>▶</span>
                  </div>;
                })}
              </div>}
              {curAction&&<ActionDisplay onNext={()=>{setCurAction(null);setActionStatus(null);}}/>}
              {(actionStatus!==null||!curAction)&&<button className="btn btn-p btn-full" style={{marginTop:8}} onClick={()=>{setCurAction(null);setActionStatus(null);generateProposals(activeCatsValid.map(c=>c.id));}}>🎲 Nouvelles propositions</button>}
            </>}
          </div>}

          {actMode==="select"&&<div className="card">
            <div className="ctitle">Sélectionner les actions</div>
            {selQueue.length===0?<>
              {getAllActionsFlat().length===0?<p className="empty">Aucune action disponible — ajoute-en dans l'Éditeur.</p>:<>
                <p style={{fontSize:12,color:"var(--muted)",marginBottom:10}}>Coche les actions à inclure dans ta session.</p>
                <div className="act-sel-list">
                  {getAllActionsFlat().map((a,i)=>(
                    <div key={i} className={`act-sel-item${selActions.includes(a.text)?" checked":""}`} onClick={()=>setSelActions(s=>s.includes(a.text)?s.filter(x=>x!==a.text):[...s,a.text])}>
                      <div className="asi-check">{selActions.includes(a.text)?"✓":""}</div>
                      <div className="asi-body">
                        <div className="asi-name">{a.text}</div>
                        <div className="asi-meta">
                          <span>{a.catIcon} {a.catLabel}</span>
                          <span className="asi-lv" style={{background:`color-mix(in srgb,${lvColor(a.level)} 20%,transparent)`,border:`1px solid ${lvColor(a.level)}`,color:lvColor(a.level)}}>{lvLabel(a.level)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn btn-p btn-full" onClick={startSelQueue} disabled={selActions.length===0}>▶ Lancer ({selActions.length})</button>
              </>}
            </>:<>
              <p style={{fontSize:11,color:"var(--muted)",marginBottom:8}}>{selIdx+1} / {selQueue.length}</p>
              <ActionDisplay onNext={()=>{
                if(selIdx<selQueue.length-1){setActionStatus(null);nextSel();}
                else{setSelQueue([]);setSelActions([]);setCurAction(null);setActionStatus(null);}
              }}/>
              {actionStatus===null&&<button className="btn btn-sm btn-full" style={{marginTop:8}} onClick={()=>{setSelQueue([]);setSelActions([]);setCurAction(null);setActionStatus(null);}}>↺ Abandonner</button>}
            </>}
          </div>}

          {actMode==="secret"&&<div className="card">
            <div className="ctitle">Mode secret</div>
            {secretQueue.length===0?<>
              <p style={{fontSize:12,color:"var(--muted)",marginBottom:12,lineHeight:1.5}}>Le Dom prépare. Le Sub découvre une par une.</p>
              <button className="btn btn-pu btn-full" onClick={startSecret} disabled={totalActs===0}>🔮 Préparer les surprises</button>
              {totalActs===0&&<p className="empty" style={{marginTop:8}}>Ajoute des actions dans l'Éditeur d'abord.</p>}
            </>:<>
              <p style={{fontSize:11,color:"var(--muted)",marginBottom:8}}>{secretIdx+1} / {secretQueue.length}</p>
              {!secretRevealed
                ?<div className="secret-card" onClick={revealSecret}><div className="secret-hidden">🔮 Appuie pour révéler…</div></div>
                :<ActionDisplay onNext={()=>{
                  setActionStatus(null);
                  if(secretIdx<secretQueue.length-1){setSecretIdx(s=>s+1);setSecretRevealed(false);setCurAction(null);}
                  else{setSecretQueue([]);setCurAction(null);}
                }}/>
              }
              {!secretRevealed&&<button className="btn btn-sm" style={{marginTop:8}} onClick={()=>{setSecretQueue([]);setCurAction(null);setActionStatus(null);}}>↺ Abandonner</button>}
            </>}
          </div>}

          {actMode==="escalade"&&<div className="card">
            <div className="ctitle">Mode escalade</div>
            <div className="esc-bar"><div className="esc-cur" style={{left:`${(escaladeStep/5)*100}%`}}/></div>
            <div style={{textAlign:"center",marginBottom:10,fontSize:12,color:"var(--muted2)"}}>Étape {escaladeStep+1}/6 — {INTENSITY.find(x=>x.level===Math.min(escaladeStep+1,6))?.label}</div>
            <ActionDisplay onNext={()=>{
              setActionStatus(null);
              const lv=Math.min(escaladeStep+1,6);
              const pool=getAllPool(activeCatsValid.map(c=>c.id),[lv]);
              const fallback=getAllPool(activeCatsValid.map(c=>c.id),[1,2,3,4,5,6]);
              if(!pool.length&&!fallback.length){setCurAction("Aucune action à ce niveau.");setCurCat("—");setCurLv(null);return;}
              fireAction(pick(pool.length?pool:fallback));setEscStep(s=>Math.min(5,s+1));
            }}/>
            <div className="row" style={{marginTop:8}}>
              {actionStatus!==null&&<button className="btn btn-p btn-full" onClick={()=>{
                setActionStatus(null);
                const lv=Math.min(escaladeStep+1,6);
                const pool=getAllPool(activeCatsValid.map(c=>c.id),[lv]);
                const fb=getAllPool(activeCatsValid.map(c=>c.id),[1,2,3,4,5,6]);
                if(!pool.length&&!fb.length){setCurAction("Aucune action.");return;}
                fireAction(pick(pool.length?pool:fb));setEscStep(s=>Math.min(5,s+1));
              }}>🔥 Escalader</button>}
              {!curAction&&<button className="btn btn-p btn-full" onClick={()=>{
                const lv=Math.min(escaladeStep+1,6);
                const pool=getAllPool(activeCatsValid.map(c=>c.id),[lv]);
                const fb=getAllPool(activeCatsValid.map(c=>c.id),[1,2,3,4,5,6]);
                if(!pool.length&&!fb.length){setCurAction("Aucune action — ajoute-en dans l'Éditeur.");setCurCat("—");setCurLv(null);return;}
                fireAction(pick(pool.length?pool:fb));setEscStep(s=>Math.min(5,s+1));
              }}>🔥 Lancer l'escalade</button>}
              <button className="btn btn-sm" onClick={()=>{setEscStep(0);setCurAction(null);setActionStatus(null);}}>↺</button>
            </div>
          </div>}

          {/* Châtiment */}
          <div className="card">
            <div className="ctitle">Roue du châtiment</div>
            <p style={{fontSize:12,color:"var(--muted)",marginBottom:10}}>Le Sub refuse ? La roue décide. (-3% Lien)</p>
            {punishment&&<div className="wheel-result">{punishment}</div>}
            <button className="btn btn-full" onClick={()=>{setPunishment(pick(PUNISHMENTS));setLink(l=>Math.max(0,l-3));}}>🎲 Tirer un châtiment</button>
          </div>
        </>)}

        {/* ══ DISTANCE ══ */}
        {tab==="distance"&&(<>
          <div className="card blue">
            <div className="ctitle">Mode à distance</div>
            <div className="mode-tog" style={{margin:"0 0 12px"}}>
              <button className={`mb${distMode==="defis"?" on":""}`} onClick={()=>setDistMode("defis")}>Défis</button>
              <button className={`mb${distMode==="ordres"?" on":""}`} onClick={()=>setDistMode("ordres")}>Ordre du jour</button>
            </div>

            {distMode==="defis"&&(<>
              <div className="form-lbl" style={{marginBottom:8}}>Sélectionne un ou plusieurs défis</div>
              <div className="dist-grid">
                {DISTANCE_DEFIS.map(d=>(
                  <div key={d.id}
                    className={`dist-card${selDefis.includes(d.id)?" sel":""}`}
                    onClick={()=>setSelDefis(s=>s.includes(d.id)?s.filter(x=>x!==d.id):[...s,d.id])}>
                    <div className="dist-icon">{d.icon}</div>
                    <div className="dist-label">{d.label}</div>
                  </div>
                ))}
              </div>
              {selDefis.length>0&&<>
                <div className="form-row" style={{marginTop:12}}>
                  <span className="form-lbl">Instructions / description</span>
                  <textarea className="inp" placeholder="Donne des précisions, conditions, durée, règles…" value={customMission} onChange={e=>setCustomMission(e.target.value)} style={{minHeight:80}}/>
                </div>
                <div className="form-row">
                  <span className="form-lbl">Heure limite (optionnel)</span>
                  <input className="inp" type="time" value={missionHour} onChange={e=>setMissionHour(e.target.value)}/>
                </div>
                <button className="btn btn-bl btn-full" onClick={()=>{
                  selDefis.forEach(id=>{
                    const d=DISTANCE_DEFIS.find(x=>x.id===id);
                    addMission(d, customMission, missionHour);
                  });
                  setSelDefis([]);
                }}>📤 Envoyer {selDefis.length > 1 ? `${selDefis.length} défis` : "le défi"}</button>
              </>}
            </>)}

            {distMode==="ordres"&&(<>
              <div className="form-row">
                <span className="form-lbl">Mission personnalisée</span>
                <textarea className="inp" placeholder="Ex: Porter le plug de 9h à 12h, envoyer une photo à midi…" value={customMission} onChange={e=>setCustomMission(e.target.value)} style={{minHeight:80}}/>
              </div>
              <div className="form-row">
                <span className="form-lbl">Heure</span>
                <input className="inp" type="time" value={missionHour} onChange={e=>setMissionHour(e.target.value)}/>
              </div>
              <button className="btn btn-bl btn-full" onClick={()=>addMission(DISTANCE_DEFIS.find(x=>x.id==="custom"),customMission,missionHour)} disabled={!customMission.trim()}>📤 Ajouter à l'ordre du jour</button>
            </>)}
          </div>

          {missions.length>0&&<div className="card blue">
            <div className="ctitle">Missions en cours</div>
            <div className="mission-list">
              {missions.map(m=><div key={m.id} className="mission-card">
                <button className="mission-del" onClick={()=>delMission(m.id)}>×</button>
                <div className={`ms-status ${m.status==="pending"?"ms-pending":m.status==="done"?"ms-done":"ms-refused"}`}>
                  {m.status==="pending"?"⏳ En attente":m.status==="done"?"✅ Accompli":"❌ Refusé"}
                </div>
                {m.hour&&<div style={{fontSize:10,color:"var(--muted)",marginBottom:4}}>🕐 {m.hour}</div>}
                <div className="mission-title">{m.icon} {m.title}</div>
                {m.desc&&<div className="mission-desc">{m.desc}</div>}
                {m.status==="pending"&&<div className="mission-acts">
                  <button className="btn btn-gr btn-xs" onClick={()=>{updMission(m.id,"done");setLink(l=>Math.min(100,l+5));}}>✅ Accompli</button>
                  <button className="btn btn-xs" onClick={()=>{updMission(m.id,"refused");setLink(l=>Math.max(0,l-3));}}>❌ Refusé</button>
                </div>}
              </div>)}
            </div>
          </div>}
        </>)}

        {/* ══ SESSION ══ */}
        {tab==="session"&&(<>
          <div style={{margin:"10px 16px 0"}}><CatSelectorPanel/></div>
          <div className="card">
            <div className="ctitle">Tenue imposée</div>
            <div className="of-list">{OUTFITS.map(o=><div key={o} className={`of-item${outfit===o?" sel":""}`} onClick={()=>setOutfit(o===outfit?null:o)}>{o}{outfit===o&&<span>✓</span>}</div>)}</div>
          </div>
          <div className="card">
            <div className="ctitle">Joker — 1 veto par session</div>
            <p style={{fontSize:12,color:"var(--muted)",lineHeight:1.5}}>Chaque joueur peut dire <strong style={{color:"var(--gold3)"}}>JOKER</strong> une fois pour refuser sans punition.</p>
          </div>
          <div className="card">
            <div className="ctitle">Enregistrer la session</div>
            <div className="form-row"><span className="form-lbl">Dominant</span><input className="inp" value={newDom} onChange={e=>setNewDom(e.target.value)} placeholder="Pseudo"/></div>
            <div className="form-row"><span className="form-lbl">Soumis</span><input className="inp" value={newSub} onChange={e=>setNewSub(e.target.value)} placeholder="Pseudo"/></div>
            <div className="form-row"><span className="form-lbl">Note privée</span><textarea className="inp" value={newNote} onChange={e=>setNewNote(e.target.value)} placeholder="Ressenti, intensité, à refaire…"/></div>
            <button className="btn btn-p btn-full" onClick={saveSession}>Enregistrer +10% Lien</button>
          </div>
        </>)}

        {/* ══ FANTASMES ══ */}
        {tab==="fantasmes"&&(<>
          <div className="card purple">
            <div className="ctitle">Fantasmes secrets</div>
            <p style={{fontSize:12,color:"var(--muted)",marginBottom:12,lineHeight:1.5}}>
              Tes fantasmes secrets sont <strong style={{color:"var(--purple3)"}}>visibles uniquement par toi</strong>. Tu peux les révéler à l'autre en dépensant des points.
            </p>
            {!showFantForm
              ? <button className="btn btn-pu btn-full" onClick={()=>setShowFantForm(true)}>+ Ajouter un fantasme</button>
              : <>
                <div className="form-row"><span className="form-lbl">Titre</span><input className="inp" placeholder="Titre du fantasme…" value={fantTitle} onChange={e=>setFantTitle(e.target.value)}/></div>
                <div className="form-row"><span className="form-lbl">Description</span><textarea className="inp" placeholder="Décris ton fantasme…" value={fantDesc} onChange={e=>setFantDesc(e.target.value)}/></div>
                <div className="form-row">
                  <span className="form-lbl">Importance</span>
                  <StarRating val={fantImportance} set={setFantImportance}/>
                </div>
                <div className="form-row">
                  <span className="form-lbl">Difficulté</span>
                  <StarRating val={fantDiff} set={setFantDiff}/>
                </div>
                <div className="form-row">
                  <span className="form-lbl">Visibilité</span>
                  <div className="row">
                    <button className={`btn btn-sm${fantPrivate?" btn-pu":""}`} onClick={()=>setFantPrivate(true)}>🔒 Secret</button>
                    <button className={`btn btn-sm${!fantPrivate?" btn-g":""}`} onClick={()=>setFantPrivate(false)}>👁️ Visible</button>
                  </div>
                </div>
                <div className="row">
                  <button className="btn btn-pu btn-full" onClick={addFantasme} disabled={!fantTitle.trim()}>Sauvegarder</button>
                  <button className="btn btn-sm" onClick={()=>setShowFantForm(false)}>Annuler</button>
                </div>
              </>
            }
          </div>
          {fantasmes.length>0&&<div className="card purple">
            <div className="ctitle">Mes fantasmes ({fantasmes.length})</div>
            <div className="fantasy-list">
              {fantasmes.map(f=>(
                <div key={f.id} className="fantasy-card">
                  <button className="fantasy-del" onClick={()=>delFantasme(f.id)}>×</button>
                  <div className="fantasy-title">{f.private?"🔒":""} {f.title}</div>
                  {f.desc&&<div className="fantasy-desc">{f.desc}</div>}
                  <div className="fantasy-meta">
                    <span className={`fantasy-badge ${f.status==="secret"?"fb-secret":f.status==="revealed"?"fb-revealed":"fb-done"}`}>
                      {f.status==="secret"?"Secret":f.status==="revealed"?"Révélé":"Réalisé"}
                    </span>
                    <span className="fantasy-stars">{"⭐".repeat(f.importance)}</span>
                    <span style={{fontSize:10,color:"var(--muted)"}}>Diff: {"🔥".repeat(f.difficulty)}</span>
                  </div>
                  {f.status==="secret"&&<div className="row" style={{marginTop:8}}>
                    <button className="btn btn-g btn-xs" onClick={()=>revealFantasme(f.id)}>👁️ Révéler (+15% Lien)</button>
                    <button className="btn btn-gr btn-xs" onClick={()=>realisedFantasme(f.id)}>✅ Réalisé (+20%)</button>
                  </div>}
                  {f.status==="revealed"&&<button className="btn btn-gr btn-xs btn-full" style={{marginTop:8}} onClick={()=>realisedFantasme(f.id)}>✅ Marquer comme réalisé (+20%)</button>}
                </div>
              ))}
            </div>
          </div>}
        </>)}

        {/* ══ POINTS ══ */}
        {tab==="points"&&(<>
          <div className="card">
            <div className="ctitle">Points du Soumis</div>
            <div className="pts-big"><div className={`pts-num${shine?" shine":""}`}>{points}</div><div className="pts-lbl">points accumulés</div><div className="sub-title">{getSubTitle().icon} {getSubTitle().title}</div></div>
            <div className="streak-d"><div className="streak-n">🔥 {streak}</div><div className="streak-l">sessions consécutives</div>{streak>0&&streak%5===0&&<div style={{fontSize:10,color:"var(--gold3)",marginTop:3}}>+10 pts bonus streak !</div>}</div>
            <div className="pts-row">
              <input className="pts-inp" type="number" min="1" placeholder="pts" value={ptsIn} onChange={e=>setPtsIn(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addPts()}/>
              <button className="btn btn-g btn-sm" onClick={addPts}>+ Ajouter</button>
              <button className="btn btn-sm" onClick={subPts}>− Retirer</button>
            </div>
          </div>
          <div className="card">
            <div className="ctitle">Récompenses</div>
            <div className="rw-list">{REWARDS.map(r=><div key={r.pts} className={`rw-item${points>=r.pts?" ok":""}`}><span>{points>=r.pts?"✅":"🔒"} {r.label}</span><span className="rw-pts">{r.pts} pts</span></div>)}</div>
          </div>
        </>)}

        {/* ══ HISTORIQUE ══ */}
        {tab==="history"&&(
          <div className="card">
            <div className="ctitle">Historique des sessions</div>
            {sessions.length===0?<p className="empty">Aucune session enregistrée.</p>:
            <div className="sess-list">{sessions.map(s=><div key={s.id} className="sess-card">
              <button className="sdel" onClick={()=>setSessions(sessions.filter(x=>x.id!==s.id))}>×</button>
              <div className="sess-date">{s.date}</div>
              <div className="sess-roles"><span className="badge b-dom">👑 {s.dom}</span><span className="badge b-sub">⛓️ {s.sub}</span></div>
              {s.outfit&&<div style={{fontSize:11,color:"var(--gold2)",marginBottom:3}}>Tenue : {s.outfit}</div>}
              <div className="tags">{s.categories.map((c,i)=><span key={i} className="tag">{c}</span>)}</div>
              {s.note&&<div className="sess-note">"{s.note}"</div>}
            </div>)}</div>}
          </div>
        )}

        {/* ══ IDÉES ══ */}
        {tab==="ideas"&&(
          <div className="card">
            <div className="ctitle">Carnet de fantasmes</div>
            <div className="row" style={{marginBottom:10}}>
              <input className="inp" placeholder="Une envie, une idée…" value={ideaIn} onChange={e=>setIdeaIn(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addIdea()}/>
              <button className="btn btn-p btn-sm" onClick={addIdea}>+</button>
            </div>
            {ideas.length===0?<p className="empty">Rien encore.</p>:
            <div className="idea-list">{ideas.map(i=><div key={i.id} className="idea-item"><span>{i.text}</span><button className="idel" onClick={()=>delIdea(i.id)}>×</button></div>)}</div>}
          </div>
        )}

        {/* ══ ÉDITEUR ══ */}
        {tab==="editor"&&(<>
          {/* Barre de progression */}
          <div className="card gold">
            <div className="ctitle">✏ Mes actions personnalisées</div>
            <div style={{textAlign:"center",marginBottom:10}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:32,fontWeight:900,background:"linear-gradient(135deg,#fff,var(--gold3))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{totalActs}</div>
              <div style={{fontSize:10,color:"var(--muted)",letterSpacing:2,textTransform:"uppercase"}}>actions créées sur 500</div>
            </div>
            <div className="prog-bar" style={{marginBottom:8}}><div className="prog-fill" style={{width:`${Math.min(100,(totalActs/500)*100)}%`}}/></div>
            <p style={{fontSize:11,color:"var(--muted)",textAlign:"center",lineHeight:1.5}}>
              Les actions que tu ajoutes ici apparaissent dans l'onglet <strong style={{color:"var(--gold3)"}}>🔥 Action</strong> lors de la génération.
            </p>
          </div>

          {/* Formulaire d'ajout simplifié */}
          <div className="card">
            <div className="ctitle">➕ Ajouter une action</div>

            {/* Étape 1 : Catégorie */}
            <div style={{marginBottom:12}}>
              <div className="form-lbl" style={{marginBottom:8}}>① Choisis une catégorie</div>
              <div className="cat-grid">
                {CATEGORIES.map(c=>(
                  <div key={c.id} className={`ci-item${edCat===c.id?" sel":""}`} onClick={()=>setEdCat(c.id)}>
                    <span className="cii">{c.icon}</span>{c.label}
                    {customActions[c.id]&&Object.values(customActions[c.id]).flat().length>0&&
                      <span style={{marginLeft:"auto",fontSize:9,color:"var(--gold2)",fontFamily:"Cinzel,serif",fontWeight:700}}>
                        {Object.values(customActions[c.id]).flat().length}
                      </span>
                    }
                  </div>
                ))}
              </div>
            </div>

            {/* Étape 2 : Niveau */}
            <div style={{marginBottom:12}}>
              <div className="form-lbl" style={{marginBottom:8}}>② Choisis un niveau d'intensité</div>
              <div className="ed-lv">
                {INTENSITY.map(lv=>(
                  <button key={lv.level} className={`ed-lv-btn${edLv===lv.level?" sel":""}`}
                    style={edLv===lv.level?{borderColor:lv.color,color:lv.color,background:`color-mix(in srgb,${lv.color} 15%,transparent)`}:{}}
                    onClick={()=>setEdLv(lv.level)}>
                    {lv.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Étape 3 : Texte */}
            <div className="form-lbl" style={{marginBottom:6}}>③ Décris l'action</div>
            <textarea
              className="inp"
              placeholder={`Ex: Le Sub reste attaché pendant 15 min sans bouger…`}
              value={edText}
              onChange={e=>setEdText(e.target.value)}
              style={{minHeight:72,marginBottom:10}}
              onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),addAction())}
            />
            <button className="btn btn-p btn-full" onClick={addAction} disabled={!edText.trim()}>
              ➕ Ajouter dans {CATEGORIES.find(c=>c.id===edCat)?.icon} {CATEGORIES.find(c=>c.id===edCat)?.label}
            </button>
          </div>

          {/* Liste des actions de la catégorie sélectionnée */}
          <div className="card">
            <div className="ctitle">
              {CATEGORIES.find(c=>c.id===edCat)?.icon} {CATEGORIES.find(c=>c.id===edCat)?.label}
              <span style={{marginLeft:6,fontSize:10,color:"var(--muted)",fontFamily:"Inter,sans-serif",fontWeight:400}}>
                — {Object.values(customActions[edCat]||{}).flat().length} action(s)
              </span>
            </div>

            {/* Filtre par niveau */}
            <div className="ed-lv" style={{marginBottom:10}}>
              {INTENSITY.map(lv=>{
                const n=(customActions[edCat]||{})[lv.level]?.length||0;
                return <button key={lv.level} className={`ed-lv-btn${edLv===lv.level?" sel":""}`} onClick={()=>setEdLv(lv.level)}>
                  {lv.label}{n>0&&<span style={{display:"block",fontSize:8,color:"var(--gold2)"}}>{n}</span>}
                </button>;
              })}
            </div>

            {edCatActs.length===0
              ? <p className="empty">Aucune action niveau "{INTENSITY.find(l=>l.level===edLv)?.label}" pour cette catégorie.</p>
              : <div className="al-list">
                {edCatActs.map((a,i)=>(
                  <div key={i} className="al-item">
                    <span className="al-txt">{a}</span>
                    <button className="al-del" onClick={()=>delAction(edCat,edLv,i)}>×</button>
                  </div>
                ))}
              </div>
            }

            <div className="ie-row">
              <button className="btn btn-g btn-sm btn-full" onClick={exportActs}>⬇ Exporter toutes mes actions</button>
              <button className="btn btn-sm btn-full" onClick={()=>fileRef.current?.click()}>⬆ Importer</button>
              <input ref={fileRef} type="file" accept=".json" style={{display:"none"}} onChange={importActs}/>
            </div>
          </div>

          {/* Vue globale de toutes les actions */}
          {totalActs>0&&<div className="card">
            <div className="ctitle">📋 Toutes mes actions ({totalActs})</div>
            <div className="al-list" style={{maxHeight:300}}>
              {getAllActionsFlatAll().map((a,i)=>{
                const catObj=CATEGORIES.find(c=>c.id===a.cat);
                return <div key={i} className="al-item">
                  <span style={{fontSize:13,flexShrink:0}}>{catObj?.icon}</span>
                  <span className="al-txt">{a.text}</span>
                  <span style={{fontSize:9,color:INTENSITY.find(l=>l.level===a.level)?.color||"var(--muted)",fontFamily:"Cinzel,serif",fontWeight:700,flexShrink:0,whiteSpace:"nowrap"}}>{INTENSITY.find(l=>l.level===a.level)?.label}</span>
                </div>;
              })}
            </div>
          </div>}
        </>)}

        {/* ══ LIMITES ══ */}
        {tab==="limits"&&(
          <div className="card">
            <div className="ctitle">Limites personnelles</div>
            <p style={{fontSize:12,color:"var(--muted)",marginBottom:12,lineHeight:1.5}}>
              <strong style={{color:"var(--red3)"}}>Hard</strong> = jamais proposé. <strong style={{color:"var(--gold3)"}}>Soft</strong> = signalé avec ⚠. Clic pour changer.
            </p>
            <div className="lim-grid">
              {CATEGORIES.map(c=>{
                const st=limits[c.id];
                return <div key={c.id}
                  className={`lim-item${st==="hard"?" hard":st==="soft"?" soft":""}`}
                  onClick={()=>setLimits(l=>{
                    const n={...l};
                    if(!n[c.id]) n[c.id]="soft";
                    else if(n[c.id]==="soft") n[c.id]="hard";
                    else delete n[c.id];
                    return n;
                  })}>
                  <div className="lim-dot"/>
                  <span className="cii">{c.icon}</span>
                  <span style={{fontSize:12}}>{c.label}</span>
                  {st&&<span style={{marginLeft:"auto",fontSize:10,fontWeight:700}}>{st==="hard"?"🚫":"⚠"}</span>}
                </div>;
              })}
            </div>
            {Object.keys(limits).length>0&&<p style={{fontSize:10,color:"var(--muted)",marginTop:10,textAlign:"center"}}>
              {Object.values(limits).filter(v=>v==="hard").length} hard · {Object.values(limits).filter(v=>v==="soft").length} soft
            </p>}
          </div>
        )}

        {/* ══ STATS ══ */}
        {tab==="stats"&&(<>
          <div className="card">
            <div className="ctitle">Tableau de bord</div>
            <div className="stats-grid">
              <div className="stat-card"><div className="stat-num">{stats.total}</div><div className="stat-lbl">Sessions</div></div>
              <div className="stat-card"><div className="stat-num">{streak}🔥</div><div className="stat-lbl">Streak</div></div>
              <div className="stat-card"><div className="stat-num">{points}</div><div className="stat-lbl">Points Sub</div></div>
              <div className="stat-card"><div className="stat-num">{totalActs}</div><div className="stat-lbl">Actions créées</div></div>
              <div className="stat-card"><div className="stat-num">{missions.filter(m=>m.status==="done").length}</div><div className="stat-lbl">Missions OK</div></div>
              <div className="stat-card"><div className="stat-num">{fantasmes.filter(f=>f.status==="done").length}</div><div className="stat-lbl">Fantasmes réalisés</div></div>
            </div>
          </div>
          {stats.total>0&&<div className="card">
            <div className="ctitle">Catégories favorites</div>
            {stats.sorted.length===0?<p className="empty">Pas encore de données.</p>:
            <div>{stats.sorted.map(([cat,count])=><div key={cat}><div className="top-item"><span>{cat}</span><span style={{fontSize:10,color:"var(--gold2)",fontFamily:"Cinzel,serif",fontWeight:700}}>{count}×</span></div><div className="top-bar" style={{width:`${(count/stats.maxVal)*100}%`}}/></div>)}</div>}
          </div>}
          <div className="card">
            <div className="ctitle">Progression Sub</div>
            <div className="col">{SUB_TITLES.map(t=><div key={t.min} className={`rw-item${points>=t.min?" ok":""}`}><span>{points>=t.min?"✅":"🔒"} {t.icon} {t.title}</span><span className="rw-pts">{t.min} pts</span></div>)}</div>
          </div>
        </>)}

      </div>
    </>
  );
}
