import { useState, useEffect, useRef } from "react";
import { saveData, listenData } from "./firebase";

/* ═══════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════ */
const CATEGORIES = [
  { id:"oral",     label:"Oral",              icon:"👄" },
  { id:"anal",     label:"Anal",              icon:"🍑" },
  { id:"bondage",  label:"Bondage",           icon:"⛓️" },
  { id:"spanking", label:"Fessée / Impact",   icon:"✋" },
  { id:"wax",      label:"Cire / Sensations", icon:"🕯️" },
  { id:"uro",      label:"Uro",               icon:"💧" },
  { id:"exhib",    label:"Exhib",             icon:"👁️" },
  { id:"role",     label:"Jeu de rôle",       icon:"🎭" },
  { id:"toys",     label:"Jouets",            icon:"🔧" },
  { id:"pain",     label:"Douleur",           icon:"🌹" },
  { id:"dirty",    label:"Dirty talk",        icon:"🗣️" },
  { id:"edging",   label:"Edging",            icon:"⏳" },
  { id:"distance", label:"À distance",        icon:"📱" },
  { id:"online",   label:"En ligne",          icon:"🌐" },
  { id:"body",     label:"Modif. corporelle", icon:"✨" },
];

const INTENSITY = [
  { level:1, label:"Doux",         color:"#2d7a4a", fires:1 },
  { level:2, label:"Modéré",       color:"#7a6a10", fires:2 },
  { level:3, label:"Intense",      color:"#b05010", fires:3 },
  { level:4, label:"Très intense", color:"#8b1a1a", fires:4 },
  { level:5, label:"Hardcore",     color:"#5a0a6a", fires:5 },
  { level:6, label:"Extrême",      color:"#1a0a2a", fires:6 },
];

const LINK_STATES = [
  { min:90, label:"Fusion",      color:"#e05050" },
  { min:70, label:"Harmonie",    color:"#8b5cf6" },
  { min:50, label:"Stable",      color:"#c9952a" },
  { min:30, label:"Fragile",     color:"#6b7280" },
  { min:0,  label:"Déconnexion", color:"#374151" },
];

const NAV_ITEMS = [
  { id:"home",     label:"Accueil",   icon:"🏠" },
  { id:"rapide",   label:"Rapide",    icon:"⚡" },
  { id:"sessions", label:"Sessions",  icon:"📅" },
  { id:"biblio",   label:"Biblio",    icon:"📚" },
  { id:"coffre",   label:"Coffre",    icon:"🔒" },
  { id:"reglages", label:"Réglages",  icon:"⚙️" },
];

const PUNISHMENTS = [
  "10 coups de ceinture supplémentaires",
  "Pinces à tétons pendant 15 minutes",
  "Interdit(e) de jouir pendant 48h",
  "Le Dom choisit la tenue pour la prochaine sortie",
  "Le Sub prépare le dîner nu(e)",
  "5 gifles consenties immédiatement",
  "Le Sub s'excuse à genoux",
  "Plug anal pendant 30 minutes",
  "À disposition du Dom pendant 1h",
  "Interdit(e) de jouir pendant 72h",
];

/* ═══════════════════════════════════════════════
   CSS
═══════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Inter:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0a0608;
  --s1:#110a0e;
  --s2:#1a1018;
  --s3:#221420;
  --b1:#2a1a24;
  --b2:#3a2030;
  --red:#c0182c;
  --red2:#e0203a;
  --purple:#6b1fa0;
  --purple2:#9b40e0;
  --gold:#c8922a;
  --gold2:#e8b040;
  --text:#f0e8f0;
  --text2:#c0b0c8;
  --muted:#6a5a70;
  --muted2:#8a7a90;
  --grad:linear-gradient(135deg,#c0182c,#6b1fa0);
  --r:12px;
  --nav:64px;
}
html,body{background:var(--bg);color:var(--text);font-family:'Inter',sans-serif;min-height:100vh;overflow-x:hidden;width:100%;max-width:100vw}
#root{width:100%;max-width:100vw;overflow-x:hidden}

.app{max-width:480px;width:100%;margin:0 auto;padding:0 0 var(--nav);min-height:100vh;position:relative;background:var(--bg)}

/* ── Nav bottom ── */
.nav-bottom{
  position:fixed;bottom:0;left:50%;transform:translateX(-50%);
  width:100%;max-width:480px;
  background:rgba(10,6,8,.95);
  border-top:1px solid var(--b2);
  display:flex;z-index:100;
  backdrop-filter:blur(10px);
  height:var(--nav);
}
.nav-item{
  flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:3px;cursor:pointer;padding:8px 4px;
  font-family:'Inter',sans-serif;font-size:10px;font-weight:500;
  color:var(--muted2);letter-spacing:.5px;text-transform:uppercase;
  transition:all .2s;border:none;background:none;
}
.nav-item.on{color:var(--red2)}
.nav-icon{font-size:20px;line-height:1}

/* ── Header ── */
.page-header{
  display:flex;align-items:center;justify-content:space-between;
  padding:16px 20px 8px;
}
.page-title{
  font-family:'Cinzel',serif;font-size:13px;font-weight:700;
  letter-spacing:4px;text-transform:uppercase;color:var(--text2);
}
.back-btn{
  width:36px;height:36px;border-radius:50%;
  background:var(--s2);border:1px solid var(--b2);
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;font-size:16px;color:var(--text2);
}
.action-btn{
  width:36px;height:36px;border-radius:50%;
  background:var(--grad);border:none;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;font-size:18px;color:#fff;font-weight:700;
  box-shadow:0 4px 16px rgba(192,24,44,.4);
}

/* ── Cards ── */
.card{
  margin:0 16px 12px;
  background:var(--s1);
  border:1px solid var(--b1);
  border-radius:var(--r);
  padding:16px;
  position:relative;
}
.card.grad-border{border-color:transparent;background:linear-gradient(var(--s1),var(--s1)) padding-box,var(--grad) border-box}
.section-label{
  font-family:'Cinzel',serif;font-size:9px;font-weight:700;
  letter-spacing:3px;text-transform:uppercase;
  color:var(--muted2);margin-bottom:10px;
}

/* ── Home header ── */
.home-couple-name{
  font-family:'Cinzel',serif;font-size:26px;font-weight:900;
  text-align:center;padding:24px 20px 4px;
  background:linear-gradient(135deg,#fff,var(--text2));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
}
.home-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:0 16px 12px}
.hstat{
  background:var(--s1);border:1px solid var(--b1);border-radius:10px;
  padding:10px 6px;text-align:center;
}
.hstat-val{font-family:'Cinzel',serif;font-size:20px;font-weight:700;color:var(--gold2);line-height:1}
.hstat-lbl{font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-top:3px}
.xp-bar-wrap{margin:0 16px 12px;background:var(--s1);border:1px solid var(--b1);border-radius:10px;padding:12px 14px}
.xp-label{display:flex;justify-content:space-between;font-size:11px;color:var(--muted2);margin-bottom:6px}
.xp-bar{height:4px;border-radius:2px;background:var(--b2)}
.xp-fill{height:100%;border-radius:2px;background:var(--grad);transition:width .6s ease}

/* ── Link card ── */
.link-card{margin:0 16px 12px;background:var(--s1);border:1px solid var(--b1);border-radius:var(--r);padding:14px;cursor:pointer}
.link-card.grad-border{border-color:transparent;background:linear-gradient(var(--s1),var(--s1)) padding-box,var(--grad) border-box}
.link-top{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.link-icon{width:36px;height:36px;border-radius:50%;background:var(--grad);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
.link-pct{font-family:'Cinzel',serif;font-size:22px;font-weight:700}
.link-state{font-size:11px;font-weight:600;letter-spacing:1px}
.link-track{height:6px;border-radius:3px;background:var(--b2);overflow:hidden;margin-bottom:8px;position:relative}
.link-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--red),var(--purple2));transition:width .8s ease}
.link-objective{display:flex;justify-content:space-between;font-size:10px;color:var(--muted)}
.link-msg{font-size:12px;color:var(--text2);margin-top:8px;padding:8px 10px;background:var(--s2);border-radius:8px;line-height:1.4}

/* ── Player cards ── */
.players-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:0 16px 12px}
.player-card{background:var(--s1);border:1px solid var(--b1);border-radius:var(--r);padding:12px;display:flex;align-items:center;gap:10px;cursor:pointer;transition:all .2s}
.player-card.dom-c{border-color:var(--red)}
.player-card.sub-c{border-color:var(--purple2)}
.player-avatar{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.dom-av{background:radial-gradient(circle,var(--red),#600010)}
.sub-av{background:radial-gradient(circle,var(--purple2),#300060)}
.player-info{}
.player-role{font-size:9px;color:var(--muted2);letter-spacing:2px;text-transform:uppercase}
.player-name{font-family:'Cinzel',serif;font-size:14px;font-weight:700;margin:1px 0}
.player-stats{font-size:10px;color:var(--muted2)}

/* ── Home buttons ── */
.home-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin:0 16px 12px}
.home-btn{
  background:var(--s1);border:1px solid var(--b1);border-radius:var(--r);
  padding:16px 10px;text-align:center;cursor:pointer;
  transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:8px;
}
.home-btn:active{transform:scale(.96)}
.home-btn-icon{
  width:44px;height:44px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;font-size:20px;
}
.hb-red{background:radial-gradient(circle,var(--red),#600010)}
.hb-purple{background:radial-gradient(circle,var(--purple),#200040)}
.hb-gold{background:radial-gradient(circle,var(--gold),#603010)}
.home-btn-lbl{font-family:'Cinzel',serif;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--text2)}

/* ── Buttons ── */
.btn{
  display:inline-flex;align-items:center;justify-content:center;gap:6px;
  padding:12px 20px;border-radius:999px;
  font-family:'Inter',sans-serif;font-weight:600;font-size:13px;
  cursor:pointer;transition:all .15s;border:none;
}
.btn-grad{background:var(--grad);color:#fff;box-shadow:0 4px 16px rgba(192,24,44,.3)}
.btn-grad:active{transform:scale(.97)}
.btn-outline{background:transparent;border:1px solid var(--b2);color:var(--text2)}
.btn-outline:active{background:var(--s2)}
.btn-sm{padding:7px 14px;font-size:12px}
.btn-xs{padding:4px 10px;font-size:11px}
.btn-full{width:100%}
.btn:disabled{opacity:.3;cursor:not-allowed}

/* ── Mode tabs ── */
.mode-tabs{display:flex;background:var(--s2);border-radius:999px;padding:3px;margin-bottom:14px}
.mode-tab{
  flex:1;padding:8px 10px;border-radius:999px;text-align:center;
  font-family:'Inter',sans-serif;font-weight:600;font-size:12px;
  cursor:pointer;transition:all .2s;color:var(--muted2);border:none;background:none;
}
.mode-tab.on{background:var(--grad);color:#fff;box-shadow:0 2px 10px rgba(192,24,44,.4)}

/* ── Action cards (biblio) ── */
.action-item{
  background:var(--s1);border:1px solid var(--b1);border-radius:var(--r);
  padding:14px;margin-bottom:8px;cursor:pointer;transition:all .2s;
}
.action-item:active{background:var(--s2)}
.action-item.selected{border-color:var(--red);background:rgba(192,24,44,.1)}
.ai-category{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--purple2);margin-bottom:4px;display:flex;align-items:center;gap:6px}
.ai-role{color:var(--red2)}
.ai-name{font-family:'Cinzel',serif;font-size:15px;font-weight:700;margin-bottom:4px;color:var(--text)}
.ai-desc{font-size:12px;color:var(--text2);line-height:1.4;margin-bottom:8px}
.ai-meta{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.ai-fires{display:flex;gap:2px}
.ai-fire{font-size:12px}
.ai-pts{font-size:12px;font-weight:700;color:var(--gold2)}
.ai-lien{font-size:12px;font-weight:700;color:var(--purple3,#b060e0)}
.ai-intensity{font-size:10px;font-weight:600;letter-spacing:1px;padding:2px 8px;border-radius:999px;background:var(--s2)}
.ai-actions{display:flex;gap:6px;margin-left:auto}
.icon-btn{background:none;border:none;cursor:pointer;font-size:16px;color:var(--muted2);padding:4px;transition:color .15s}
.icon-btn:hover{color:var(--text)}

/* ── Search ── */
.search-bar{
  display:flex;align-items:center;gap:10px;
  background:var(--s2);border:1px solid var(--b1);border-radius:999px;
  padding:10px 16px;margin:0 16px 12px;
}
.search-icon{font-size:14px;color:var(--muted)}
.search-inp{
  flex:1;background:none;border:none;outline:none;
  font-family:'Inter',sans-serif;font-size:13px;color:var(--text);
}
.search-inp::placeholder{color:var(--muted)}

/* ── Filter chips ── */
.filter-chips{display:flex;gap:6px;padding:0 16px 10px;overflow-x:auto;scrollbar-width:none}
.filter-chips::-webkit-scrollbar{display:none}
.fchip{
  flex-shrink:0;padding:5px 12px;border-radius:999px;
  font-size:11px;font-weight:600;cursor:pointer;
  border:1px solid var(--b2);background:var(--s1);color:var(--muted2);
  transition:all .15s;white-space:nowrap;
}
.fchip.on{background:var(--grad);border-color:transparent;color:#fff}

/* ── Inputs ── */
.inp{
  width:100%;background:var(--s2);border:1px solid var(--b1);
  border-radius:10px;padding:12px 14px;
  color:var(--text);font-family:'Inter',sans-serif;font-size:13px;
  outline:none;transition:border-color .15s;
}
.inp:focus{border-color:var(--red)}
.inp::placeholder{color:var(--muted)}
textarea.inp{resize:vertical;min-height:72px}
.inp-label{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted2);margin-bottom:5px;display:block}
.form-row{margin-bottom:12px}

/* ── Profile ── */
.profile-big{text-align:center;padding:20px 16px 12px}
.profile-avatar-big{
  width:80px;height:80px;border-radius:50%;margin:0 auto 10px;
  display:flex;align-items:center;justify-content:center;font-size:36px;
  box-shadow:0 0 30px rgba(192,24,44,.4);
}
.profile-name-big{font-family:'Cinzel',serif;font-size:24px;font-weight:900}
.profile-role-big{font-size:11px;letter-spacing:3px;color:var(--muted2);text-transform:uppercase;margin-top:4px}
.profile-stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:12px 0}
.pstat{background:var(--s2);border:1px solid var(--b1);border-radius:10px;padding:10px;text-align:center}
.pstat-val{font-family:'Cinzel',serif;font-size:20px;font-weight:700;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.pstat-lbl{font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-top:2px}
.xp-bar-profile{height:4px;border-radius:2px;background:var(--b2);margin-top:6px}
.xp-fill-profile{height:100%;border-radius:2px;background:var(--grad)}
.tab-switch{display:flex;background:var(--s2);border-radius:999px;padding:3px;margin-bottom:14px}
.tab-sw-btn{flex:1;padding:7px;border-radius:999px;text-align:center;font-size:11px;font-weight:600;cursor:pointer;color:var(--muted2);border:none;background:none;transition:all .2s}
.tab-sw-btn.on{background:var(--s1);color:var(--text);border:1px solid var(--b2)}

/* ── Coffre (fantasmes) ── */
.coffre-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:12px}
.cstat{background:var(--s2);border:1px solid var(--b1);border-radius:8px;padding:8px 4px;text-align:center}
.cstat-val{font-family:'Cinzel',serif;font-size:18px;font-weight:700;color:var(--gold2)}
.cstat-lbl{font-size:8px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-top:2px}
.fantasme-card{background:var(--s1);border:1px solid var(--b1);border-radius:var(--r);padding:14px;margin-bottom:8px}
.fantasme-card.revealed{border-color:var(--gold)}
.fantasme-card.done{border-color:var(--purple2)}
.fc-title{font-family:'Cinzel',serif;font-size:14px;font-weight:700;margin-bottom:4px}
.fc-desc{font-size:12px;color:var(--text2);line-height:1.4;margin-bottom:8px}
.fc-meta{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:6px}
.fc-badge{padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700;font-family:'Cinzel',serif;letter-spacing:.5px}
.fb-secret{background:rgba(107,31,160,.2);border:1px solid var(--purple2);color:var(--purple2)}
.fb-revealed{background:rgba(200,146,42,.2);border:1px solid var(--gold);color:var(--gold2)}
.fb-done{background:rgba(45,122,74,.2);border:1px solid #2d7a4a;color:#50c878}
.stars{color:var(--gold2);font-size:13px;letter-spacing:1px}

/* ── Session ── */
.session-card{background:var(--s1);border:1px solid var(--b1);border-radius:var(--r);padding:14px;margin-bottom:8px}
.sc-date{font-size:10px;color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:6px}
.sc-title{font-family:'Cinzel',serif;font-size:14px;font-weight:700;margin-bottom:6px}
.tags{display:flex;flex-wrap:wrap;gap:4px}
.tag{padding:3px 8px;border-radius:999px;font-size:10px;font-weight:600;background:rgba(192,24,44,.2);border:1px solid var(--red);color:var(--red2)}
.sc-note{font-size:11px;color:var(--muted);font-style:italic;margin-top:6px}

/* ── Action display (rapide) ── */
.action-display{
  background:linear-gradient(135deg,rgba(192,24,44,.12),rgba(17,10,14,.9));
  border:1px solid rgba(192,24,44,.3);border-radius:var(--r);
  padding:24px 16px;text-align:center;margin-bottom:12px;
  position:relative;overflow:hidden;min-height:120px;
  display:flex;align-items:center;justify-content:center;
}
.action-display::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(192,24,44,.08),transparent 70%)}
.ad-cat{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--purple2);margin-bottom:6px}
.ad-text{font-size:16px;font-weight:500;line-height:1.5;color:#fff;position:relative;z-index:1}
.ad-empty{font-size:13px;color:var(--muted);font-style:italic}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(192,24,44,.6)}70%{box-shadow:0 0 0 14px rgba(192,24,44,0)}100%{box-shadow:0 0 0 0 rgba(192,24,44,0)}}
.action-display.flash{animation:pulse .5s ease}

/* ── Validate ── */
.validate-row{display:flex;gap:8px;margin-bottom:8px}
.vbtn-ok{flex:1;padding:11px;border-radius:999px;background:rgba(45,122,74,.2);border:1px solid #2d7a4a;color:#50c878;font-weight:700;font-size:13px;cursor:pointer;transition:all .15s}
.vbtn-ok:active{background:rgba(45,122,74,.4)}
.vbtn-fail{flex:1;padding:11px;border-radius:999px;background:rgba(192,24,44,.15);border:1px solid var(--red);color:var(--red2);font-weight:700;font-size:13px;cursor:pointer;transition:all .15s}
.vbtn-fail:active{background:rgba(192,24,44,.3)}
.validate-result{padding:12px 14px;border-radius:var(--r);text-align:center;margin-bottom:8px;animation:fi .3s ease}
.vr-ok{background:rgba(45,122,74,.18);border:1px solid #2d7a4a}
.vr-fail{background:rgba(192,24,44,.18);border:1px solid var(--red)}
.vr-icon{font-size:26px;margin-bottom:4px}
.vr-text{font-family:'Cinzel',serif;font-size:11px;font-weight:700;letter-spacing:1px}
.vr-ok .vr-text{color:#50c878}
.vr-fail .vr-text{color:var(--red2)}
.punishment-box{margin-top:8px;padding:8px 12px;border-radius:8px;background:rgba(192,24,44,.2);border:1px solid var(--red);font-size:12px;color:var(--red2)}

/* ── Réglages ── */
.setting-row{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--b1)}
.setting-row:last-child{border-bottom:none}
.setting-label{font-size:13px;font-weight:500}
.setting-val{font-family:'Cinzel',serif;font-size:13px;color:var(--gold2)}
.slider{width:100%;height:4px;border-radius:2px;background:var(--b2);outline:none;-webkit-appearance:none;appearance:none;margin-top:8px}
.slider::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:var(--grad);cursor:pointer;box-shadow:0 2px 8px rgba(192,24,44,.4)}

/* ── Form modal overlay ── */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:200;display:flex;align-items:flex-end;justify-content:center}
.modal{background:var(--s1);border-radius:20px 20px 0 0;border:1px solid var(--b2);padding:20px 20px 40px;width:100%;max-width:480px;max-height:85vh;overflow-y:auto}
.modal-title{font-family:'Cinzel',serif;font-size:16px;font-weight:700;margin-bottom:16px;text-align:center}

/* ── Misc ── */
.empty{text-align:center;color:var(--muted);font-style:italic;font-size:13px;padding:30px 20px}
.empty-icon{font-size:40px;margin-bottom:10px}
.row{display:flex;gap:8px}
.col{display:flex;flex-direction:column;gap:6px}
.sep{height:1px;background:var(--b1);margin:12px 0}
@keyframes fi{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@keyframes shine{0%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(1.04)}100%{opacity:1;transform:scale(1)}}
.shine{animation:shine .5s ease}
.intensity-dots{display:flex;gap:3px}
.idot{width:6px;height:6px;border-radius:50%;background:var(--b2)}

/* Profil selector in settings */
.profil-selector{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
.ps-card{padding:14px 10px;border-radius:var(--r);border:1px solid var(--b1);background:var(--s2);text-align:center;cursor:pointer;transition:all .2s}
.ps-card.active-dom{border-color:var(--red);background:rgba(192,24,44,.15)}
.ps-card.active-sub{border-color:var(--purple2);background:rgba(107,31,160,.15)}
.ps-icon{font-size:28px;margin-bottom:6px}
.ps-name{font-family:'Cinzel',serif;font-size:13px;font-weight:700}
`;

/* ═══════════════════════════════════════════════
   STORAGE
═══════════════════════════════════════════════ */
const KEY = "duality_v2";
function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } }
function persist(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); saveData(d); } catch {} }
function todayStr() { return new Date().toLocaleDateString("fr-FR", { weekday:"long", day:"2-digit", month:"long", year:"numeric" }); }
function todayISO() { return new Date().toISOString().split("T")[0]; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pickN(arr, n) { const s=[...arr], r=[]; while(r.length<n&&s.length>0){const i=Math.floor(Math.random()*s.length);r.push(s.splice(i,1)[0]);} return r; }
function getLinkState(pct) { return LINK_STATES.find(s => pct >= s.min) || LINK_STATES[LINK_STATES.length-1]; }
function getLevel(pts) { return Math.floor(pts / 100) + 1; }
function getXP(pts) { return pts % 100; }
function getXPNeeded() { return 100; }

/* ═══════════════════════════════════════════════
   APP
═══════════════════════════════════════════════ */
export default function App() {
  const st = load();
  const [tab, setTab] = useState("home");

  // Couple config
  const [coupleName, setCoupleName] = useState(st.coupleName || "Nox & Lyra");
  const [p1Name, setP1Name] = useState(st.p1Name || "Joueur 1");
  const [p2Name, setP2Name] = useState(st.p2Name || "Joueur 2");
  const [p1Avatar, setP1Avatar] = useState(st.p1Avatar || "👑");
  const [p2Avatar, setP2Avatar] = useState(st.p2Avatar || "⚡");
  const [p1Desc, setP1Desc] = useState(st.p1Desc || "");
  const [p2Desc, setP2Desc] = useState(st.p2Desc || "");
  const [p1Notes, setP1Notes] = useState(st.p1Notes || "");
  const [p2Notes, setP2Notes] = useState(st.p2Notes || "");
  const [p1Prefs, setP1Prefs] = useState(st.p1Prefs || "");
  const [p2Prefs, setP2Prefs] = useState(st.p2Prefs || "");
  const [activeProfile, setActiveProfile] = useState(st.activeProfile || "p1");

  // Link
  const [link, setLink] = useState(st.link ?? 50);
  const [linkDecay, setLinkDecay] = useState(st.linkDecay ?? 1);
  const [linkPenalty, setLinkPenalty] = useState(st.linkPenalty ?? 3);
  const [linkObjective, setLinkObjective] = useState(st.linkObjective ?? 80);
  const [lastLinkDate, setLastLinkDate] = useState(st.lastLinkDate || null);

  // Points / XP
  const [p1Points, setP1Points] = useState(st.p1Points || 0);
  const [p2Points, setP2Points] = useState(st.p2Points || 0);

  // Actions library: [{id, name, desc, category, intensity, points, lien, role, favorite}]
  const [actions, setActions] = useState(st.actions || []);

  // Sessions
  const [sessions, setSessions] = useState(st.sessions || []);

  // Fantasmes: [{id, owner, title, desc, importance, difficulty, status, private}]
  const [fantasmes, setFantasmes] = useState(st.fantasmes || []);

  // Idées
  const [ideas, setIdeas] = useState(st.ideas || []);

  // Streak
  const [streak, setStreak] = useState(st.streak || 0);
  const [lastDate, setLastDate] = useState(st.lastDate || null);

  // UI state
  const [profileTab, setProfileTab] = useState("public");
  const [viewProfile, setViewProfile] = useState("p1");
  const [coffreTab, setCoffreTab] = useState("mine");
  const [rapideMode, setRapideMode] = useState("manuel");
  const [sessionMode, setSessionMode] = useState("manuel");
  const [searchQ, setSearchQ] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [selectedActions, setSelectedActions] = useState([]);
  const [showAddAction, setShowAddAction] = useState(false);
  const [showAddSession, setShowAddSession] = useState(false);
  const [showAddFantasme, setShowAddFantasme] = useState(false);

  // Current action (rapide)
  const [curAction, setCurAction] = useState(null);
  const [actionStatus, setActionStatus] = useState(null);
  const [flashAct, setFlashAct] = useState(false);
  const [punishment, setPunishment] = useState(null);

  // New action form
  const [newActName, setNewActName] = useState("");
  const [newActDesc, setNewActDesc] = useState("");
  const [newActCat, setNewActCat] = useState("oral");
  const [newActInt, setNewActInt] = useState(1);
  const [newActPts, setNewActPts] = useState(10);
  const [newActLien, setNewActLien] = useState(5);
  const [newActRole, setNewActRole] = useState("couple");

  // New session form
  const [newSessName, setNewSessName] = useState("Nouvelle session");
  const [newSessNote, setNewSessNote] = useState("");
  const [newSessInt, setNewSessInt] = useState(3);
  const [sessActions, setSessActions] = useState([]);

  // New fantasme form
  const [newFantTitle, setNewFantTitle] = useState("");
  const [newFantDesc, setNewFantDesc] = useState("");
  const [newFantImp, setNewFantImp] = useState(3);
  const [newFantDiff, setNewFantDiff] = useState(3);
  const [newFantPrivate, setNewFantPrivate] = useState(true);

  // Daily link decay
  useEffect(() => {
    const today = todayISO();
    if (lastLinkDate && lastLinkDate !== today) {
      const days = Math.round((new Date(today) - new Date(lastLinkDate)) / 86400000);
      setLink(l => Math.max(0, l - days * linkDecay));
    }
    setLastLinkDate(today);
  }, []);

  // Firebase sync
  useEffect(() => {
    listenData((data) => {
      if (data.link !== undefined) setLink(data.link);
      if (data.p1Points !== undefined) setP1Points(data.p1Points);
      if (data.p2Points !== undefined) setP2Points(data.p2Points);
      if (data.sessions !== undefined) setSessions(data.sessions);
      if (data.actions !== undefined) setActions(data.actions);
      if (data.fantasmes !== undefined) setFantasmes(data.fantasmes);
      if (data.ideas !== undefined) setIdeas(data.ideas);
      if (data.streak !== undefined) setStreak(data.streak);
      if (data.coupleName !== undefined) setCoupleName(data.coupleName);
    });
  }, []);

  // Persist
  useEffect(() => {
    persist({ coupleName, p1Name, p2Name, p1Avatar, p2Avatar, p1Desc, p2Desc, p1Notes, p2Notes, p1Prefs, p2Prefs, activeProfile, link, linkDecay, linkPenalty, linkObjective, lastLinkDate, p1Points, p2Points, actions, sessions, fantasmes, ideas, streak, lastDate });
  }, [coupleName, p1Name, p2Name, p1Avatar, p2Avatar, p1Desc, p2Desc, p1Notes, p2Notes, p1Prefs, p2Prefs, activeProfile, link, linkDecay, linkPenalty, linkObjective, lastLinkDate, p1Points, p2Points, actions, sessions, fantasmes, ideas, streak, lastDate]);

  // Helpers
  const totalPoints = p1Points + p2Points;
  const coupleLevel = getLevel(totalPoints);
  const coupleXP = getXP(totalPoints);
  const linkState = getLinkState(link);
  const activeP = activeProfile === "p1" ? { name: p1Name, avatar: p1Avatar, points: p1Points } : { name: p2Name, avatar: p2Avatar, points: p2Points };

  function fireAction(act) {
    setCurAction(act);
    setActionStatus(null);
    setPunishment(null);
    setFlashAct(true);
    setTimeout(() => setFlashAct(false), 600);
  }

  function validateAction(ok) {
    if (!curAction) return;
    if (ok) {
      setActionStatus("done");
      setLink(l => Math.min(100, l + (curAction.lien || 5)));
      if (activeProfile === "p1") setP1Points(p => p + (curAction.points || 10));
      else setP2Points(p => p + (curAction.points || 10));
    } else {
      setActionStatus("fail");
      setLink(l => Math.max(0, l - linkPenalty));
      setPunishment(pick(PUNISHMENTS));
    }
  }

  function addAction() {
    if (!newActName.trim()) return;
    const a = { id: Date.now(), name: newActName.trim(), desc: newActDesc.trim(), category: newActCat, intensity: newActInt, points: newActPts, lien: newActLien, role: newActRole, favorite: false };
    setActions([...actions, a]);
    setNewActName(""); setNewActDesc(""); setNewActCat("oral"); setNewActInt(1); setNewActPts(10); setNewActLien(5); setNewActRole("couple");
    setShowAddAction(false);
  }

  function toggleFav(id) { setActions(actions.map(a => a.id === id ? {...a, favorite: !a.favorite} : a)); }
  function deleteAction(id) { setActions(actions.filter(a => a.id !== id)); }

  function addSession() {
    const today = todayISO();
    let ns = streak;
    if (lastDate) { const d = Math.round((new Date(today)-new Date(lastDate))/86400000); if(d===1)ns=streak+1; else if(d>1)ns=1; } else ns=1;
    setStreak(ns); setLastDate(today);
    setLink(l => Math.min(100, l + 10));
    const s = { id: Date.now(), date: todayStr(), name: newSessName, note: newSessNote, actions: sessActions.map(a => a.name), intensity: newSessInt };
    setSessions([s, ...sessions]);
    setNewSessName("Nouvelle session"); setNewSessNote(""); setSessActions([]); setShowAddSession(false);
  }

  function addFantasme() {
    if (!newFantTitle.trim()) return;
    const f = { id: Date.now(), owner: activeProfile, title: newFantTitle.trim(), desc: newFantDesc.trim(), importance: newFantImp, difficulty: newFantDiff, status: "secret", private: newFantPrivate };
    setFantasmes([...fantasmes, f]);
    setNewFantTitle(""); setNewFantDesc(""); setNewFantImp(3); setNewFantDiff(3);
    setShowAddFantasme(false);
  }

  function revealFantasme(id) { setFantasmes(fantasmes.map(f => f.id===id?{...f,status:"revealed",private:false}:f)); setLink(l=>Math.min(100,l+15)); }
  function realisedFantasme(id) { setFantasmes(fantasmes.map(f => f.id===id?{...f,status:"done"}:f)); setLink(l=>Math.min(100,l+20)); }

  // Filtered actions
  const filteredActions = actions.filter(a => {
    const matchQ = !searchQ || a.name.toLowerCase().includes(searchQ.toLowerCase()) || a.desc.toLowerCase().includes(searchQ.toLowerCase());
    const matchCat = filterCat === "all" || (filterCat === "favoris" && a.favorite) || a.category === filterCat;
    return matchQ && matchCat;
  });

  // Random action
  function generateRandom() {
    const pool = actions.filter(a => a.intensity <= newSessInt);
    if (!pool.length) { setCurAction({ name: "Aucune action disponible — ajoute-en dans la Bibliothèque !", category: "—", lien: 0, points: 0 }); return; }
    fireAction(pick(pool));
  }

  function FireDots({ count }) {
    return <div className="intensity-dots">{Array.from({length:6},(_,i)=><div key={i} className="idot" style={i<count?{background:INTENSITY.find(x=>x.level===count)?.color||"#888"}:{}}/>)}</div>;
  }

  function StarRating({ val, set, max=5 }) {
    return <div style={{display:"flex",gap:4}}>{Array.from({length:max},(_,i)=><button key={i} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,padding:0}} onClick={()=>set(i+1)}>{i<val?"⭐":"☆"}</button>)}</div>;
  }

  const AVATARS = ["👑","⚡","🔥","💀","🌹","🖤","🐍","🦋","🌙","⚔️","💎","🗡️","🩸","🔮","🌑","💜","❤️‍🔥","🐉","🦅","🌊","🔱","🎭","✨","🌺"];

  return (
    <>
      <style>{CSS}</style>
      <div className="app">

        {/* ══ HOME ══ */}
        {tab === "home" && (<>
          <div className="home-couple-name">{coupleName}</div>
          <div className="home-stats">
            <div className="hstat"><div className="hstat-val">{coupleLevel}</div><div className="hstat-lbl">Niv.</div></div>
            <div className="hstat"><div className="hstat-val">{totalPoints}</div><div className="hstat-lbl">Pts</div></div>
            <div className="hstat"><div className="hstat-val" style={{color:linkState.color}}>{link}%</div><div className="hstat-lbl">Lien</div></div>
            <div className="hstat"><div className="hstat-val">🔥{streak}</div><div className="hstat-lbl">Streak</div></div>
          </div>
          <div className="xp-bar-wrap">
            <div className="xp-label"><span style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:2}}>{coupleXP}/{getXPNeeded()} XP VERS NIV. {coupleLevel+1}</span></div>
            <div className="xp-bar"><div className="xp-fill" style={{width:`${(coupleXP/getXPNeeded())*100}%`}}/></div>
          </div>

          {/* Link card */}
          <div className="link-card grad-border">
            <div className="link-top">
              <div className="link-icon">🖤</div>
              <div>
                <div className="link-pct" style={{color:linkState.color}}>{link}% <span style={{fontSize:14,fontFamily:"'Cinzel',serif",fontWeight:700,letterSpacing:2}}>{linkState.label}</span></div>
              </div>
            </div>
            <div className="link-track"><div className="link-fill" style={{width:`${link}%`}}/></div>
            <div className="link-objective"><span>0%</span><span style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:2}}>OBJECTIF {linkObjective}%</span><span>100%</span></div>
            {link < linkObjective && <div className="link-msg">Votre Lien est sous l'objectif fixé. Certaines activités pourraient vous aider à le renforcer.</div>}
          </div>

          {/* Players */}
          <div className="players-row">
            <div className="player-card dom-c" onClick={() => { setViewProfile("p1"); setTab("profil"); }}>
              <div className="player-avatar dom-av">{p1Avatar}</div>
              <div className="player-info">
                <div className="player-role">Dominant·e</div>
                <div className="player-name">{p1Name}</div>
                <div className="player-stats">Niv.{getLevel(p1Points)} · {p1Points} pts</div>
              </div>
            </div>
            <div className="player-card sub-c" onClick={() => { setViewProfile("p2"); setTab("profil"); }}>
              <div className="player-avatar sub-av">{p2Avatar}</div>
              <div className="player-info">
                <div className="player-role">Soumis·e</div>
                <div className="player-name">{p2Name}</div>
                <div className="player-stats">Niv.{getLevel(p2Points)} · {p2Points} pts</div>
              </div>
            </div>
          </div>

          {/* Quick buttons */}
          <div className="home-grid">
            <div className="home-btn" onClick={() => setTab("rapide")}>
              <div className="home-btn-icon hb-red">⚡</div>
              <div className="home-btn-lbl">Action Rapide</div>
            </div>
            <div className="home-btn" onClick={() => { setShowAddSession(true); setTab("sessions"); }}>
              <div className="home-btn-icon hb-purple">📅</div>
              <div className="home-btn-lbl">Nouvelle Session</div>
            </div>
            <div className="home-btn" onClick={() => setTab("biblio")}>
              <div className="home-btn-icon hb-gold">📚</div>
              <div className="home-btn-lbl">Bibliothèque</div>
            </div>
            <div className="home-btn" onClick={() => setTab("coffre")}>
              <div className="home-btn-icon hb-purple">🔒</div>
              <div className="home-btn-lbl">Fantasmes</div>
            </div>
            <div className="home-btn" onClick={() => setTab("idees")}>
              <div className="home-btn-icon hb-gold">💡</div>
              <div className="home-btn-lbl">Journal</div>
            </div>
            <div className="home-btn" onClick={() => setTab("reglages")}>
              <div className="home-btn-icon hb-red">⚙️</div>
              <div className="home-btn-lbl">Réglages</div>
            </div>
          </div>
        </>)}

        {/* ══ RAPIDE ══ */}
        {tab === "rapide" && (<>
          <div className="page-header">
            <div className="back-btn" onClick={() => setTab("home")}>←</div>
            <div className="page-title">Action Rapide</div>
            <div style={{width:36}}/>
          </div>
          <div style={{padding:"8px 16px 0"}}>
            <div className="mode-tabs">
              <button className={`mode-tab${rapideMode==="manuel"?" on":""}`} onClick={() => setRapideMode("manuel")}>✋ Manuel</button>
              <button className={`mode-tab${rapideMode==="aleatoire"?" on":""}`} onClick={() => { setRapideMode("aleatoire"); setCurAction(null); setActionStatus(null); }}>🎲 Aléa.</button>
              <button className={`mode-tab${rapideMode==="categorie"?" on":""}`} onClick={() => setRapideMode("categorie")}>🗂 Catég.</button>
            </div>
          </div>

          {rapideMode === "aleatoire" && (<>
            <div style={{padding:"0 16px 10px"}}>
              <div className="form-row">
                <span className="inp-label">Intensité max — {INTENSITY.find(x=>x.level===newSessInt)?.label}</span>
                <div style={{display:"flex",gap:5}}>
                  {INTENSITY.map(lv=><div key={lv.level} onClick={()=>setNewSessInt(lv.level)} style={{flex:1,height:32,borderRadius:6,background:newSessInt>=lv.level?lv.color:"var(--s2)",border:`1px solid ${newSessInt>=lv.level?lv.color:"var(--b1)"}`,cursor:"pointer",transition:"all .15s"}}/>)}
                </div>
              </div>
            </div>
            <div style={{padding:"0 16px"}}>
              <div className={`action-display${flashAct?" flash":""}`}>
                {curAction
                  ? <div style={{width:"100%"}}>
                      <div className="ad-cat">{CATEGORIES.find(c=>c.id===curAction.category)?.icon} {CATEGORIES.find(c=>c.id===curAction.category)?.label}</div>
                      <div className="ad-text">{curAction.name}</div>
                      {curAction.desc&&<div style={{fontSize:12,color:"var(--text2)",marginTop:6}}>{curAction.desc}</div>}
                    </div>
                  : <div className="ad-empty">Appuie sur Générer pour recevoir un ordre</div>}
              </div>
              {curAction && actionStatus === null && (
                <div className="validate-row">
                  <button className="vbtn-ok" onClick={() => validateAction(true)}>✅ Accompli</button>
                  <button className="vbtn-fail" onClick={() => validateAction(false)}>❌ Échec</button>
                </div>
              )}
              {actionStatus === "done" && <div className="validate-result vr-ok"><div className="vr-icon">✅</div><div className="vr-text">Accompli ! +{curAction?.points||10} pts · +{curAction?.lien||5}% Lien</div></div>}
              {actionStatus === "fail" && <div className="validate-result vr-fail"><div className="vr-icon">❌</div><div className="vr-text">Échec — -{linkPenalty}% Lien</div>{punishment&&<div className="punishment-box">🎡 {punishment}</div>}</div>}
              <button className="btn btn-grad btn-full" style={{marginTop:8}} onClick={() => { generateRandom(); }}>🎲 Générer</button>
              {actionStatus !== null && <button className="btn btn-outline btn-full" style={{marginTop:8}} onClick={()=>{setCurAction(null);setActionStatus(null);}}>Nouvelle action</button>}
            </div>
          </>)}

          {rapideMode === "manuel" && (<>
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input className="search-inp" placeholder="Chercher une action..." value={searchQ} onChange={e=>setSearchQ(e.target.value)}/>
            </div>
            <div className="filter-chips">
              <span className={`fchip${filterCat==="all"?" on":""}`} onClick={()=>setFilterCat("all")}>Toutes {actions.length}</span>
              <span className={`fchip${filterCat==="favoris"?" on":""}`} onClick={()=>setFilterCat("favoris")}>⭐ Favoris</span>
              {CATEGORIES.map(c=><span key={c.id} className={`fchip${filterCat===c.id?" on":""}`} onClick={()=>setFilterCat(c.id)}>{c.icon} {c.label}</span>)}
            </div>
            {curAction && (<div style={{padding:"0 16px 8px"}}>
              <div className={`action-display${flashAct?" flash":""}`}>
                <div style={{width:"100%"}}>
                  <div className="ad-cat">{CATEGORIES.find(c=>c.id===curAction.category)?.icon} {CATEGORIES.find(c=>c.id===curAction.category)?.label}</div>
                  <div className="ad-text">{curAction.name}</div>
                </div>
              </div>
              {actionStatus === null && <div className="validate-row">
                <button className="vbtn-ok" onClick={()=>validateAction(true)}>✅ Accompli</button>
                <button className="vbtn-fail" onClick={()=>validateAction(false)}>❌ Échec</button>
              </div>}
              {actionStatus==="done"&&<div className="validate-result vr-ok"><div className="vr-icon">✅</div><div className="vr-text">+{curAction.points} pts · +{curAction.lien}% Lien</div></div>}
              {actionStatus==="fail"&&<div className="validate-result vr-fail"><div className="vr-icon">❌</div><div className="vr-text">-{linkPenalty}% Lien</div>{punishment&&<div className="punishment-box">🎡 {punishment}</div>}</div>}
            </div>)}
            <div style={{padding:"0 16px"}}>
              {filteredActions.length === 0
                ? <div className="empty"><div className="empty-icon">📭</div>Aucune action trouvée.<br/>Ajoute-en dans la Bibliothèque !</div>
                : filteredActions.map(a => (
                  <div key={a.id} className="action-item" onClick={() => { fireAction(a); setActionStatus(null); }}>
                    <div className="ai-category">{CATEGORIES.find(c=>c.id===a.category)?.icon} {CATEGORIES.find(c=>c.id===a.category)?.label} {a.role!=="couple"&&<span className="ai-role">· {a.role==="dom"?"DOM":"SUB"}</span>}</div>
                    <div className="ai-name">{a.name}</div>
                    {a.desc&&<div className="ai-desc">{a.desc}</div>}
                    <div className="ai-meta">
                      <FireDots count={a.intensity}/>
                      <span className="ai-intensity" style={{color:INTENSITY.find(x=>x.level===a.intensity)?.color}}>{INTENSITY.find(x=>x.level===a.intensity)?.label}</span>
                      <span className="ai-pts">+{a.points} pts</span>
                      <span className="ai-lien">+{a.lien}%</span>
                    </div>
                  </div>
                ))
              }
            </div>
          </>)}

          {rapideMode === "categorie" && (<>
            <div style={{padding:"0 16px"}}>
              <div className="cat-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                {CATEGORIES.map(c => (
                  <div key={c.id} onClick={()=>{setFilterCat(c.id); const pool=actions.filter(a=>a.category===c.id); if(pool.length)fireAction(pick(pool)); else setCurAction({name:"Aucune action pour cette catégorie !",category:c.id,points:0,lien:0});setActionStatus(null);}}
                    style={{padding:"12px 10px",background:"var(--s1)",border:"1px solid var(--b1)",borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontSize:13,fontWeight:600,transition:"all .15s"}}>
                    <span style={{fontSize:18}}>{c.icon}</span>{c.label}
                  </div>
                ))}
              </div>
              {curAction && (<>
                <div className={`action-display${flashAct?" flash":""}`}>
                  <div style={{width:"100%"}}>
                    <div className="ad-cat">{CATEGORIES.find(c=>c.id===curAction.category)?.icon} {CATEGORIES.find(c=>c.id===curAction.category)?.label}</div>
                    <div className="ad-text">{curAction.name}</div>
                  </div>
                </div>
                {actionStatus===null&&<div className="validate-row"><button className="vbtn-ok" onClick={()=>validateAction(true)}>✅ Accompli</button><button className="vbtn-fail" onClick={()=>validateAction(false)}>❌ Échec</button></div>}
                {actionStatus==="done"&&<div className="validate-result vr-ok"><div className="vr-icon">✅</div><div className="vr-text">+{curAction.points} pts · +{curAction.lien}% Lien</div></div>}
                {actionStatus==="fail"&&<div className="validate-result vr-fail"><div className="vr-icon">❌</div><div className="vr-text">-{linkPenalty}% Lien</div>{punishment&&<div className="punishment-box">🎡 {punishment}</div>}</div>}
              </>)}
            </div>
          </>)}
        </>)}

        {/* ══ SESSIONS ══ */}
        {tab === "sessions" && (<>
          <div className="page-header">
            <div className="back-btn" onClick={()=>setTab("home")}>←</div>
            <div className="page-title">Sessions</div>
            <div className="action-btn" onClick={()=>setShowAddSession(true)}>+</div>
          </div>
          {sessions.length === 0
            ? <div className="empty" style={{marginTop:40}}><div className="empty-icon">📅</div>Aucune session<br/><span style={{fontSize:12}}>Crée ta première session avec le bouton +.</span></div>
            : <div style={{padding:"8px 16px 0"}}>
              {sessions.map(s => (
                <div key={s.id} className="session-card">
                  <div className="sc-date">{s.date}</div>
                  <div className="sc-title">{s.name}</div>
                  {s.actions?.length > 0 && <div className="tags">{s.actions.map((a,i)=><span key={i} className="tag">{a}</span>)}</div>}
                  {s.note && <div className="sc-note">"{s.note}"</div>}
                </div>
              ))}
            </div>
          }
          {showAddSession && (
            <div className="overlay" onClick={e=>e.target===e.currentTarget&&setShowAddSession(false)}>
              <div className="modal">
                <div className="modal-title">Nouvelle Session</div>
                <div className="mode-tabs">
                  <button className={`mode-tab${sessionMode==="manuel"?" on":""}`} onClick={()=>setSessionMode("manuel")}>✋ Manuel</button>
                  <button className={`mode-tab${sessionMode==="aleatoire"?" on":""}`} onClick={()=>setSessionMode("aleatoire")}>🎲 Aléa.</button>
                  <button className={`mode-tab${sessionMode==="semi"?" on":""}`} onClick={()=>setSessionMode("semi")}>✨ Semi</button>
                </div>
                <div className="form-row"><span className="inp-label">Nom</span><input className="inp" value={newSessName} onChange={e=>setNewSessName(e.target.value)}/></div>
                <div className="form-row">
                  <span className="inp-label">Intensité max — {INTENSITY.find(x=>x.level===newSessInt)?.label}</span>
                  <div style={{display:"flex",gap:5}}>
                    {INTENSITY.map(lv=><div key={lv.level} onClick={()=>setNewSessInt(lv.level)} style={{flex:1,height:28,borderRadius:5,background:newSessInt>=lv.level?lv.color:"var(--s2)",border:`1px solid ${newSessInt>=lv.level?lv.color:"var(--b1)"}`,cursor:"pointer"}}/>)}
                  </div>
                </div>
                <div className="form-row">
                  <span className="inp-label">Actions ({sessActions.length})</span>
                  <div style={{maxHeight:200,overflowY:"auto"}}>
                    {actions.filter(a=>a.intensity<=newSessInt).map(a=>(
                      <div key={a.id} style={{padding:"8px 10px",background:"var(--s2)",borderRadius:8,marginBottom:4,display:"flex",alignItems:"center",gap:8,cursor:"pointer",border:`1px solid ${sessActions.find(x=>x.id===a.id)?"var(--red)":"var(--b1)"}`}} onClick={()=>setSessActions(s=>s.find(x=>x.id===a.id)?s.filter(x=>x.id!==a.id):[...s,a])}>
                        <span style={{fontSize:16}}>{sessActions.find(x=>x.id===a.id)?"✅":"⬜"}</span>
                        <span style={{fontSize:13}}>{a.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="form-row"><span className="inp-label">Notes</span><textarea className="inp" value={newSessNote} onChange={e=>setNewSessNote(e.target.value)} placeholder="Ressenti, intensité..."/></div>
                <div className="row">
                  <button className="btn btn-outline btn-full" onClick={()=>setShowAddSession(false)}>Annuler</button>
                  <button className="btn btn-grad btn-full" onClick={addSession}>Créer</button>
                </div>
              </div>
            </div>
          )}
        </>)}

        {/* ══ BIBLIO ══ */}
        {tab === "biblio" && (<>
          <div className="page-header">
            <div className="back-btn" onClick={()=>setTab("home")}>←</div>
            <div className="page-title">Bibliothèque</div>
            <div className="action-btn" onClick={()=>setShowAddAction(true)}>+</div>
          </div>
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input className="search-inp" placeholder="Chercher dans la bibliothèque..." value={searchQ} onChange={e=>setSearchQ(e.target.value)}/>
          </div>
          <div className="filter-chips">
            <span className={`fchip${filterCat==="all"?" on":""}`} onClick={()=>setFilterCat("all")}>Toutes {actions.length}</span>
            <span className={`fchip${filterCat==="favoris"?" on":""}`} onClick={()=>setFilterCat("favoris")}>⭐ Favoris {actions.filter(a=>a.favorite).length}</span>
            {CATEGORIES.map(c=><span key={c.id} className={`fchip${filterCat===c.id?" on":""}`} onClick={()=>setFilterCat(c.id)}>{c.icon} {c.label} {actions.filter(a=>a.category===c.id).length}</span>)}
          </div>
          <div style={{padding:"0 16px"}}>
            {filteredActions.length === 0
              ? <div className="empty"><div className="empty-icon">📚</div>Aucune action.<br/><span style={{fontSize:12}}>Ajoute ta première action avec le bouton +.</span></div>
              : filteredActions.map(a => (
                <div key={a.id} className="action-item">
                  <div className="ai-category">{CATEGORIES.find(c=>c.id===a.category)?.icon} {CATEGORIES.find(c=>c.id===a.category)?.label} {a.role!=="couple"&&<span className="ai-role">· {a.role==="dom"?"DOM":"SUB"}</span>}</div>
                  <div className="ai-name">{a.name}</div>
                  {a.desc&&<div className="ai-desc">{a.desc}</div>}
                  <div className="ai-meta">
                    <FireDots count={a.intensity}/>
                    <span className="ai-intensity" style={{color:INTENSITY.find(x=>x.level===a.intensity)?.color}}>{INTENSITY.find(x=>x.level===a.intensity)?.label}</span>
                    <span className="ai-pts">+{a.points} pts</span>
                    <span className="ai-lien">💜+{a.lien}%</span>
                    <div className="ai-actions">
                      <button className="icon-btn" onClick={()=>toggleFav(a.id)}>{a.favorite?"⭐":"☆"}</button>
                      <button className="icon-btn" onClick={()=>deleteAction(a.id)}>🗑️</button>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
          {showAddAction && (
            <div className="overlay" onClick={e=>e.target===e.currentTarget&&setShowAddAction(false)}>
              <div className="modal">
                <div className="modal-title">Nouvelle Action</div>
                <div className="form-row"><span className="inp-label">Nom</span><input className="inp" value={newActName} onChange={e=>setNewActName(e.target.value)} placeholder="Ex: Gorge profonde imposée"/></div>
                <div className="form-row"><span className="inp-label">Description</span><textarea className="inp" value={newActDesc} onChange={e=>setNewActDesc(e.target.value)} placeholder="Détails de l'action..."/></div>
                <div className="form-row">
                  <span className="inp-label">Catégorie</span>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
                    {CATEGORIES.map(c=><div key={c.id} onClick={()=>setNewActCat(c.id)} style={{padding:"8px 10px",background:newActCat===c.id?"rgba(192,24,44,.2)":"var(--s2)",border:`1px solid ${newActCat===c.id?"var(--red)":"var(--b1)"}`,borderRadius:8,cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",gap:6}}><span>{c.icon}</span>{c.label}</div>)}
                  </div>
                </div>
                <div className="form-row">
                  <span className="inp-label">Intensité — {INTENSITY.find(x=>x.level===newActInt)?.label}</span>
                  <div style={{display:"flex",gap:5}}>
                    {INTENSITY.map(lv=><div key={lv.level} onClick={()=>setNewActInt(lv.level)} style={{flex:1,height:28,borderRadius:5,background:newActInt===lv.level?lv.color:"var(--s2)",border:`1px solid ${newActInt===lv.level?lv.color:"var(--b1)"}`,cursor:"pointer"}}/>)}
                  </div>
                </div>
                <div className="row" style={{marginBottom:12}}>
                  <div style={{flex:1}}>
                    <span className="inp-label">Points</span>
                    <input className="inp" type="number" value={newActPts} onChange={e=>setNewActPts(parseInt(e.target.value)||0)}/>
                  </div>
                  <div style={{flex:1}}>
                    <span className="inp-label">Lien %</span>
                    <input className="inp" type="number" value={newActLien} onChange={e=>setNewActLien(parseInt(e.target.value)||0)}/>
                  </div>
                </div>
                <div className="form-row">
                  <span className="inp-label">Rôle recommandé</span>
                  <div style={{display:"flex",gap:6}}>
                    {[{id:"dom",label:"DOM"},{id:"sub",label:"SUB"},{id:"couple",label:"Couple"}].map(r=><button key={r.id} onClick={()=>setNewActRole(r.id)} style={{flex:1,padding:"8px",borderRadius:8,border:`1px solid ${newActRole===r.id?"var(--red)":"var(--b1)"}`,background:newActRole===r.id?"rgba(192,24,44,.2)":"var(--s2)",color:newActRole===r.id?"var(--red2)":"var(--muted2)",cursor:"pointer",fontSize:12,fontWeight:600}}>{r.label}</button>)}
                  </div>
                </div>
                <div className="row">
                  <button className="btn btn-outline btn-full" onClick={()=>setShowAddAction(false)}>Annuler</button>
                  <button className="btn btn-grad btn-full" onClick={addAction} disabled={!newActName.trim()}>Ajouter</button>
                </div>
              </div>
            </div>
          )}
        </>)}

        {/* ══ COFFRE (FANTASMES) ══ */}
        {tab === "coffre" && (<>
          <div className="page-header">
            <div className="back-btn" onClick={()=>setTab("home")}>←</div>
            <div className="page-title">Coffre</div>
            <div className="action-btn" onClick={()=>setShowAddFantasme(true)}>+</div>
          </div>
          <div style={{padding:"8px 16px 0"}}>
            <div className="card">
              <div className="section-label">Qui consulte le coffre ?</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                {[{id:"p1",name:p1Name,av:p1Avatar,pts:p1Points},{id:"p2",name:p2Name,av:p2Avatar,pts:p2Points}].map(p=>(
                  <div key={p.id} onClick={()=>setActiveProfile(p.id)} style={{padding:"10px",background:"var(--s2)",borderRadius:10,border:`1px solid ${activeProfile===p.id?"var(--gold)":"var(--b1)"}`,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:22}}>{p.av}</span>
                    <div><div style={{fontFamily:"'Cinzel',serif",fontSize:13,fontWeight:700}}>{p.name}</div><div style={{fontSize:10,color:"var(--muted)"}}>🔗 {p.pts}</div></div>
                  </div>
                ))}
              </div>
              <div style={{fontSize:11,color:"var(--muted)",textAlign:"center"}}>Les fantasmes secrets ne sont jamais visibles à l'autre joueur sans déblocage.</div>
            </div>
            <div className="coffre-stats">
              <div className="cstat"><div className="cstat-val">{fantasmes.length}</div><div className="cstat-lbl">Enregistrés</div></div>
              <div className="cstat"><div className="cstat-val">{fantasmes.filter(f=>f.status==="revealed").length}</div><div className="cstat-lbl">Révélés</div></div>
              <div className="cstat"><div className="cstat-val">{fantasmes.filter(f=>f.status==="done").length}</div><div className="cstat-lbl">Réalisés</div></div>
              <div className="cstat"><div className="cstat-val">{fantasmes.length?Math.round(fantasmes.filter(f=>f.status==="done").length/fantasmes.length*100):0}%</div><div className="cstat-lbl">%</div></div>
            </div>
            <div className="mode-tabs">
              <button className={`mode-tab${coffreTab==="mine"?" on":""}`} onClick={()=>setCoffreTab("mine")}>Mes secrets</button>
              <button className={`mode-tab${coffreTab==="other"?" on":""}`} onClick={()=>setCoffreTab("other")}>{activeProfile==="p1"?p2Name:p1Name}</button>
              <button className={`mode-tab${coffreTab==="done"?" on":""}`} onClick={()=>setCoffreTab("done")}>Réalisés</button>
            </div>
            {coffreTab === "mine" && (<>
              {fantasmes.filter(f=>f.owner===activeProfile&&f.status!=="done").length === 0
                ? <div className="card" style={{textAlign:"center",padding:30}}><div style={{fontSize:36,marginBottom:10}}>🔒</div><div style={{fontFamily:"'Cinzel',serif",fontSize:14,fontWeight:700,marginBottom:6}}>Ton coffre est vide</div><div style={{fontSize:12,color:"var(--muted)"}}>Enregistre une envie. Elle reste invisible pour l'autre.</div></div>
                : fantasmes.filter(f=>f.owner===activeProfile&&f.status!=="done").map(f=>(
                  <div key={f.id} className="fantasme-card">
                    <div className="fc-title">{f.title}</div>
                    {f.desc&&<div className="fc-desc">{f.desc}</div>}
                    <div className="fc-meta">
                      <span className={`fc-badge ${f.status==="secret"?"fb-secret":f.status==="revealed"?"fb-revealed":"fb-done"}`}>{f.status==="secret"?"Secret":f.status==="revealed"?"Révélé":"Réalisé"}</span>
                      <span className="stars">{"⭐".repeat(f.importance)}</span>
                      <span style={{fontSize:10,color:"var(--muted)"}}>Diff: {"🔥".repeat(f.difficulty)}</span>
                    </div>
                    {f.status==="secret"&&<div className="row"><button className="btn btn-sm btn-outline" onClick={()=>revealFantasme(f.id)}>👁️ Révéler +15%</button><button className="btn btn-sm btn-outline" onClick={()=>realisedFantasme(f.id)}>✅ Réalisé</button></div>}
                  </div>
                ))
              }
            </>)}
            {coffreTab === "other" && (<>
              {fantasmes.filter(f=>f.owner!==(activeProfile)&&f.status==="revealed").length===0
                ? <div className="empty">Aucun fantasme révélé par l'autre.</div>
                : fantasmes.filter(f=>f.owner!==activeProfile&&f.status==="revealed").map(f=>(
                  <div key={f.id} className="fantasme-card revealed">
                    <div className="fc-title">{f.title}</div>
                    {f.desc&&<div className="fc-desc">{f.desc}</div>}
                    <div className="fc-meta"><span className="fc-badge fb-revealed">Révélé</span><span className="stars">{"⭐".repeat(f.importance)}</span></div>
                    <button className="btn btn-sm btn-grad btn-full" style={{marginTop:8}} onClick={()=>realisedFantasme(f.id)}>✅ Marquer réalisé +20%</button>
                  </div>
                ))
              }
            </>)}
            {coffreTab === "done" && (<>
              {fantasmes.filter(f=>f.status==="done").length===0
                ? <div className="empty">Aucun fantasme réalisé encore.</div>
                : fantasmes.filter(f=>f.status==="done").map(f=>(
                  <div key={f.id} className="fantasme-card done">
                    <div className="fc-title">✅ {f.title}</div>
                    {f.desc&&<div className="fc-desc">{f.desc}</div>}
                    <div className="fc-meta"><span className="fc-badge fb-done">Réalisé</span></div>
                  </div>
                ))
              }
            </>)}
          </div>
          {showAddFantasme && (
            <div className="overlay" onClick={e=>e.target===e.currentTarget&&setShowAddFantasme(false)}>
              <div className="modal">
                <div className="modal-title">Nouveau Fantasme</div>
                <div className="form-row"><span className="inp-label">Titre</span><input className="inp" value={newFantTitle} onChange={e=>setNewFantTitle(e.target.value)} placeholder="Titre du fantasme..."/></div>
                <div className="form-row"><span className="inp-label">Description</span><textarea className="inp" value={newFantDesc} onChange={e=>setNewFantDesc(e.target.value)} placeholder="Décris ton fantasme..."/></div>
                <div className="form-row"><span className="inp-label">Importance</span><StarRating val={newFantImp} set={setNewFantImp}/></div>
                <div className="form-row"><span className="inp-label">Difficulté</span><StarRating val={newFantDiff} set={setNewFantDiff}/></div>
                <div className="form-row">
                  <span className="inp-label">Visibilité</span>
                  <div className="row">
                    <button className={`btn btn-full${newFantPrivate?" btn-outline":""}`} style={!newFantPrivate?{background:"var(--grad)",color:"#fff",border:"none"}:{}} onClick={()=>setNewFantPrivate(false)}>👁️ Visible</button>
                    <button className={`btn btn-full${!newFantPrivate?" btn-outline":""}`} style={newFantPrivate?{background:"var(--grad)",color:"#fff",border:"none"}:{}} onClick={()=>setNewFantPrivate(true)}>🔒 Secret</button>
                  </div>
                </div>
                <div className="row">
                  <button className="btn btn-outline btn-full" onClick={()=>setShowAddFantasme(false)}>Annuler</button>
                  <button className="btn btn-grad btn-full" onClick={addFantasme} disabled={!newFantTitle.trim()}>Sauvegarder</button>
                </div>
              </div>
            </div>
          )}
        </>)}

        {/* ══ IDÉES / JOURNAL ══ */}
        {tab === "idees" && (<>
          <div className="page-header">
            <div className="back-btn" onClick={()=>setTab("home")}>←</div>
            <div className="page-title">Journal</div>
            <div className="action-btn" onClick={()=>{const t=prompt("Nouvelle idée:");if(t?.trim())setIdeas([{id:Date.now(),text:t.trim(),date:todayStr()},...ideas]);}}>+</div>
          </div>
          <div style={{padding:"8px 16px 0"}}>
            {ideas.length===0
              ? <div className="empty"><div className="empty-icon">💡</div>Aucune idée encore.<br/>Notez vos envies !</div>
              : ideas.map(i=>(
                <div key={i.id} style={{background:"var(--s1)",border:"1px solid var(--b1)",borderRadius:var,padding:14,marginBottom:8,display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10}}>
                  <div><div style={{fontSize:9,color:"var(--muted)",marginBottom:4}}>{i.date}</div><div style={{fontSize:13}}>{i.text}</div></div>
                  <button style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:16}} onClick={()=>setIdeas(ideas.filter(x=>x.id!==i.id))}>×</button>
                </div>
              ))
            }
          </div>
        </>)}

        {/* ══ PROFIL ══ */}
        {tab === "profil" && (<>
          <div className="page-header">
            <div className="back-btn" onClick={()=>setTab("home")}>←</div>
            <div className="page-title">Profil</div>
            <div style={{width:36}}/>
          </div>
          {(() => {
            const isP1 = viewProfile === "p1";
            const name = isP1 ? p1Name : p2Name;
            const avatar = isP1 ? p1Avatar : p2Avatar;
            const points = isP1 ? p1Points : p2Points;
            const desc = isP1 ? p1Desc : p2Desc;
            const notes = isP1 ? p1Notes : p2Notes;
            const prefs = isP1 ? p1Prefs : p2Prefs;
            const setName = isP1 ? setP1Name : setP2Name;
            const setAvatar = isP1 ? setP1Avatar : setP2Avatar;
            const setDesc = isP1 ? setP1Desc : setP2Desc;
            const setNotes = isP1 ? setP1Notes : setP2Notes;
            const setPrefs = isP1 ? setP1Prefs : setP2Prefs;
            const isMe = activeProfile === viewProfile;
            return (<>
              <div className="profile-big">
                <div className="profile-avatar-big" style={{background:isP1?"radial-gradient(circle,var(--red),#600010)":"radial-gradient(circle,var(--purple2),#300060)"}}>{avatar}</div>
                <div className="profile-name-big">{name}</div>
                <div className="profile-role-big">{isP1?"Dominant·e":"Soumis·e"}</div>
                <div className="profile-stats-row">
                  <div className="pstat"><div className="pstat-val">{getLevel(points)}</div><div className="pstat-lbl">Niveau</div></div>
                  <div className="pstat"><div className="pstat-val">{points}</div><div className="pstat-lbl">Points</div></div>
                  <div className="pstat"><div className="pstat-val">{actions.length}</div><div className="pstat-lbl">Actions</div></div>
                </div>
                <div className="xp-bar-profile"><div className="xp-fill-profile" style={{width:`${(getXP(points)/getXPNeeded())*100}%`}}/></div>
                <div style={{fontSize:10,color:"var(--muted)",marginTop:4,letterSpacing:1}}>{getXP(points)}/{getXPNeeded()} XP</div>
              </div>
              <div style={{padding:"0 16px"}}>
                <div className="tab-switch">
                  <button className={`tab-sw-btn${profileTab==="public"?" on":""}`} onClick={()=>setProfileTab("public")}>👁️ Public</button>
                  {isMe&&<button className={`tab-sw-btn${profileTab==="prive"?" on":""}`} onClick={()=>setProfileTab("prive")}>🔒 Privé</button>}
                </div>
                {profileTab==="public"&&(<>
                  <div className="form-row"><span className="inp-label">Pseudo</span><input className="inp" value={name} onChange={e=>setName(e.target.value)}/></div>
                  <div className="form-row"><span className="inp-label">Description</span><input className="inp" value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Une phrase qui te décrit..."/></div>
                  <div className="form-row">
                    <span className="inp-label">Avatar</span>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:6,marginTop:6}}>
                      {AVATARS.map(a=><div key={a} onClick={()=>setAvatar(a)} style={{fontSize:22,textAlign:"center",padding:"8px 4px",borderRadius:8,border:`1px solid ${avatar===a?"var(--gold)":"var(--b1)"}`,background:avatar===a?"rgba(200,146,42,.15)":"var(--s2)",cursor:"pointer"}}>{a}</div>)}
                    </div>
                  </div>
                </>)}
                {profileTab==="prive"&&isMe&&(<>
                  <div className="form-row"><span className="inp-label">Notes personnelles</span><textarea className="inp" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Pensées, ressentis, envies à exprimer plus tard..."/></div>
                  <div className="form-row"><span className="inp-label">Préférences</span><textarea className="inp" value={prefs} onChange={e=>setPrefs(e.target.value)} placeholder="Actions ou catégories que tu apprécies particulièrement..."/></div>
                </>)}
              </div>
            </>);
          })()}
        </>)}

        {/* ══ RÉGLAGES ══ */}
        {tab === "reglages" && (<>
          <div className="page-header">
            <div className="back-btn" onClick={()=>setTab("home")}>←</div>
            <div className="page-title">Réglages</div>
            <div style={{width:36}}/>
          </div>
          <div style={{padding:"8px 16px 0"}}>
            <div className="card">
              <div className="section-label">Nom du couple</div>
              <input className="inp" value={coupleName} onChange={e=>setCoupleName(e.target.value)}/>
            </div>
            <div className="card" style={{marginTop:0}}>
              <div className="section-label">Profil actif sur cet appareil</div>
              <div className="profil-selector">
                <div className={`ps-card${activeProfile==="p1"?" active-dom":""}`} onClick={()=>setActiveProfile("p1")}>
                  <div className="ps-icon">{p1Avatar}</div>
                  <div className="ps-name">{p1Name}</div>
                </div>
                <div className={`ps-card${activeProfile==="p2"?" active-sub":""}`} onClick={()=>setActiveProfile("p2")}>
                  <div className="ps-icon">{p2Avatar}</div>
                  <div className="ps-name">{p2Name}</div>
                </div>
              </div>
              <div style={{fontSize:11,color:"var(--muted)"}}>Le profil actif détermine la partie privée visible (notes, limites, fantasmes secrets).</div>
            </div>
            <div className="card" style={{marginTop:0}}>
              <div className="section-label">Profils</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <button className="btn btn-outline" onClick={()=>{setViewProfile("p1");setTab("profil");}}>👑 Profil de {p1Name}</button>
                <button className="btn btn-outline" onClick={()=>{setViewProfile("p2");setTab("profil");}}>⚡ Profil de {p2Name}</button>
              </div>
            </div>
            <div className="card" style={{marginTop:0}}>
              <div className="section-label">Jauge de Lien</div>
              <div className="setting-row">
                <span className="setting-label">Décroissance par jour</span>
                <span className="setting-val">-{linkDecay}%</span>
              </div>
              <input type="range" className="slider" min={0} max={10} step={0.5} value={linkDecay} onChange={e=>setLinkDecay(parseFloat(e.target.value))}/>
              <div style={{fontSize:10,color:"var(--muted)",marginTop:4}}>Défaut : -1%/jour.</div>
              <div className="sep"/>
              <div className="setting-row">
                <span className="setting-label">Pénalité sur refus d'action</span>
                <span className="setting-val">-{linkPenalty}%</span>
              </div>
              <input type="range" className="slider" min={0} max={20} step={1} value={linkPenalty} onChange={e=>setLinkPenalty(parseFloat(e.target.value))}/>
              <div style={{fontSize:10,color:"var(--muted)",marginTop:4}}>Défaut : -3% par refus.</div>
              <div className="sep"/>
              <div className="setting-row">
                <span className="setting-label">Objectif de Lien</span>
                <span className="setting-val">{linkObjective}%</span>
              </div>
              <input type="range" className="slider" min={50} max={100} step={5} value={linkObjective} onChange={e=>setLinkObjective(parseFloat(e.target.value))}/>
            </div>
            <div className="card" style={{marginTop:0}}>
              <div className="section-label">Données</div>
              <button className="btn btn-outline btn-full" style={{marginBottom:8}} onClick={()=>{if(confirm("Réinitialiser toutes les données ?"))localStorage.removeItem(KEY);}}>🗑️ Réinitialiser</button>
            </div>
          </div>
        </>)}

        {/* ══ NAV BOTTOM ══ */}
        <nav className="nav-bottom">
          {NAV_ITEMS.map(n=>(
            <button key={n.id} className={`nav-item${tab===n.id||(n.id==="coffre"&&tab==="coffre")||(n.id==="home"&&tab==="home")||(n.id==="rapide"&&tab==="rapide")||(n.id==="sessions"&&tab==="sessions")||(n.id==="biblio"&&tab==="biblio")||(n.id==="reglages"&&(tab==="reglages"||tab==="profil"||tab==="idees"))?" on":""}`} onClick={()=>setTab(n.id)}>
              <span className="nav-icon">{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>

      </div>
    </>
  );
}
