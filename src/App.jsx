import { useState, useEffect } from "react";
import { saveData, listenData } from "./firebase";

/* ═══════════════════════════════════
   DATA
═══════════════════════════════════ */
const CATS = [
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
  { id:"achat",    label:"Achat imposé",      icon:"🛍️" },
];

const INTENS = [
  { lv:1, label:"Doux",         col:"#2d7a4a" },
  { lv:2, label:"Modéré",       col:"#7a6a10" },
  { lv:3, label:"Intense",      col:"#b05010" },
  { lv:4, label:"Très intense", col:"#8b1a1a" },
  { lv:5, label:"Hardcore",     col:"#5a0a6a" },
  { lv:6, label:"Extrême",      col:"#2a0a3a" },
];

const LINK_STATES = [
  { min:90, label:"Fusion",      col:"#e05050" },
  { min:70, label:"Harmonie",    col:"#8b5cf6" },
  { min:50, label:"Stable",      col:"#c9952a" },
  { min:30, label:"Fragile",     col:"#6b7280" },
  { min:0,  label:"Déconnexion", col:"#374151" },
];

const PUNISHMENTS = [
  "10 coups de ceinture supplémentaires",
  "Pinces à tétons pendant 15 minutes",
  "Interdit(e) de jouir pendant 48h",
  "Le Dom choisit la tenue pour la prochaine sortie",
  "Le Sub prépare le dîner nu(e)",
  "À disposition du Dom pendant 1h",
  "Plug anal pendant 30 minutes",
  "Interdit(e) de jouir pendant 72h",
];

const DEFAULT_REWARDS = [
  { id:"r1", icon:"💆", label:"Massage 30 min",        cost:25  },
  { id:"r2", icon:"🍽️", label:"Dîner au choix du Sub", cost:50  },
  { id:"r3", icon:"🎬", label:"Film au choix",          cost:15  },
  { id:"r4", icon:"👑", label:"Session au choix du Sub",cost:100 },
  { id:"r5", icon:"🏨", label:"Nuit hôtel",             cost:200 },
  { id:"r6", icon:"🔥", label:"Fantasme réalisé",       cost:300 },
  { id:"r7", icon:"😴", label:"Journée sans corvées",   cost:75  },
  { id:"r8", icon:"🤗", label:"Câlin prolongé",         cost:10  },
];

const NAV = [
  { id:"home",     icon:"🏠", label:"Accueil"  },
  { id:"rapide",   icon:"⚡", label:"Rapide"   },
  { id:"sessions", icon:"📅", label:"Sessions" },
  { id:"biblio",   icon:"📚", label:"Biblio"   },
  { id:"roue",     icon:"🎡", label:"Roue"     },
  { id:"coffre",   icon:"🔒", label:"Coffre"   },
  { id:"reglages", icon:"⚙️", label:"Réglages" },
];

/* ═══════════════════════════════════
   CSS
═══════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Inter:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#080508;--s1:#100810;--s2:#180d18;--s3:#201520;
  --b1:#281828;--b2:#381e30;
  --red:#b8182c;--red2:#d82030;--red3:#ff4050;
  --pu:#6b1fa0;--pu2:#9b40d0;--pu3:#c070ff;
  --gold:#c8922a;--gold2:#e8b040;
  --gr2:#1e6a40;--gr3:#40c870;
  --text:#f0e8f0;--text2:#c0b0c8;--muted:#6a5a70;--muted2:#8a7a90;
  --grad:linear-gradient(135deg,#b8182c,#6b1fa0);
  --r:12px;--nav:62px;
}
html,body{background:var(--bg);color:var(--text);font-family:'Inter',sans-serif;min-height:100vh;width:100%;max-width:100vw;overflow-x:hidden}
#root{width:100%;max-width:100vw;overflow-x:hidden}
.app{max-width:480px;width:100%;margin:0 auto;padding-bottom:var(--nav);min-height:100vh;position:relative}

/* Nav */
.nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;height:var(--nav);background:rgba(8,5,8,.96);border-top:1px solid var(--b2);display:flex;z-index:100;backdrop-filter:blur(12px)}
.ni{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;cursor:pointer;padding:6px 2px;font-family:'Inter',sans-serif;font-size:9px;font-weight:600;color:var(--muted2);letter-spacing:.5px;text-transform:uppercase;border:none;background:none;transition:color .2s}
.ni.on{color:var(--red3)}
.ni-icon{font-size:20px;line-height:1}

/* Header */
.ph{display:flex;align-items:center;justify-content:space-between;padding:14px 16px 8px}
.pt{font-family:'Cinzel',serif;font-size:12px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:var(--text2)}
.bk{width:34px;height:34px;border-radius:50%;background:var(--s2);border:1px solid var(--b2);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;color:var(--text2)}
.ab{width:34px;height:34px;border-radius:50%;background:var(--grad);border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:18px;color:#fff;font-weight:700;box-shadow:0 4px 14px rgba(184,24,44,.4)}

/* Cards */
.card{margin:0 14px 10px;background:var(--s1);border:1px solid var(--b1);border-radius:var(--r);padding:14px;position:relative}
.card.gb{border-color:transparent;background:linear-gradient(var(--s1),var(--s1)) padding-box,var(--grad) border-box}
.slbl{font-family:'Cinzel',serif;font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--muted2);margin-bottom:10px}

/* Buttons */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:5px;padding:11px 18px;border-radius:999px;font-family:'Inter',sans-serif;font-weight:600;font-size:13px;cursor:pointer;transition:all .15s;border:none;-webkit-tap-highlight-color:transparent}
.btn:active{transform:scale(.96)}
.btn-g{background:var(--grad);color:#fff;box-shadow:0 4px 14px rgba(184,24,44,.3)}
.btn-o{background:transparent;border:1px solid var(--b2);color:var(--text2)}
.btn-sm{padding:7px 14px;font-size:12px}
.btn-xs{padding:4px 10px;font-size:11px}
.btn-fw{width:100%}
.btn:disabled{opacity:.3;cursor:not-allowed}

/* Inputs */
.inp{width:100%;background:var(--s2);border:1px solid var(--b1);border-radius:10px;padding:11px 13px;color:var(--text);font-family:'Inter',sans-serif;font-size:13px;outline:none;transition:border-color .15s}
.inp:focus{border-color:var(--red)}
.inp::placeholder{color:var(--muted)}
textarea.inp{resize:vertical;min-height:70px}
.flbl{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted2);margin-bottom:5px;display:block}
.frow{margin-bottom:12px}

/* Modal */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:500;display:flex;align-items:flex-end;justify-content:center}
.modal{background:var(--s1);border-radius:20px 20px 0 0;border:1px solid var(--b2);padding:20px 18px 36px;width:100%;max-width:480px;max-height:90vh;overflow-y:auto}
.mtitle{font-family:'Cinzel',serif;font-size:15px;font-weight:700;margin-bottom:14px;text-align:center}

/* Mode tabs */
.mtabs{display:flex;background:var(--s2);border-radius:999px;padding:3px;margin-bottom:12px}
.mtab{flex:1;padding:7px 6px;border-radius:999px;text-align:center;font-family:'Inter',sans-serif;font-weight:600;font-size:11px;cursor:pointer;transition:all .2s;color:var(--muted2);border:none;background:none;-webkit-tap-highlight-color:transparent}
.mtab.on{background:var(--grad);color:#fff}

/* Link bar */
.lbar{margin:8px 14px;background:var(--s1);border:1px solid var(--b1);border-radius:var(--r);padding:12px 14px;cursor:pointer}
.lbar-top{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.lbar-icon{width:34px;height:34px;border-radius:50%;background:var(--grad);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
.lbar-pct{font-family:'Cinzel',serif;font-size:20px;font-weight:700}
.lbar-state{font-size:11px;font-weight:600;letter-spacing:1px;margin-left:4px}
.ltrack{height:5px;border-radius:3px;background:var(--b1);overflow:hidden}
.lfill{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--red),var(--pu2));transition:width .8s ease}

/* Home stats */
.hstats{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin:0 14px 10px}
.hst{background:var(--s1);border:1px solid var(--b1);border-radius:10px;padding:10px 5px;text-align:center}
.hst-v{font-family:'Cinzel',serif;font-size:20px;font-weight:700;color:var(--gold2);line-height:1}
.hst-l{font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-top:3px}
.xpbar{margin:0 14px 10px;background:var(--s1);border:1px solid var(--b1);border-radius:10px;padding:10px 13px}
.xprow{display:flex;justify-content:space-between;font-size:10px;color:var(--muted2);margin-bottom:5px}
.xptrack{height:4px;border-radius:2px;background:var(--b1);overflow:hidden}
.xpfill{height:100%;border-radius:2px;background:var(--grad);transition:width .6s}

/* Home buttons */
.hgrid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:9px;margin:0 14px 10px}
.hbtn{background:var(--s1);border:1px solid var(--b1);border-radius:var(--r);padding:14px 8px;text-align:center;cursor:pointer;transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:7px;-webkit-tap-highlight-color:transparent}
.hbtn:active{transform:scale(.95)}
.hbico{width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px}
.hico-r{background:radial-gradient(circle,var(--red),#500010)}
.hico-p{background:radial-gradient(circle,var(--pu),#200040)}
.hico-g{background:radial-gradient(circle,var(--gold),#502010)}
.hblbl{font-family:'Cinzel',serif;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--text2)}

/* Players */
.prow{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:0 14px 10px}
.pcard{background:var(--s1);border:1px solid var(--b1);border-radius:var(--r);padding:11px;display:flex;align-items:center;gap:9px;cursor:pointer;transition:all .2s}
.pcard.dom{border-color:var(--red)}
.pcard.sub{border-color:var(--pu2)}
.pav{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.pav-dom{background:radial-gradient(circle,var(--red),#500010)}
.pav-sub{background:radial-gradient(circle,var(--pu2),#300060)}
.prole{font-size:9px;color:var(--muted2);letter-spacing:2px;text-transform:uppercase}
.pname{font-family:'Cinzel',serif;font-size:13px;font-weight:700;margin:1px 0}
.ppts{font-size:10px;color:var(--muted2)}

/* Action display */
.adisp{background:linear-gradient(135deg,rgba(184,24,44,.12),rgba(16,8,16,.9));border:1px solid rgba(184,24,44,.3);border-radius:var(--r);padding:22px 14px;text-align:center;margin-bottom:10px;min-height:110px;display:flex;align-items:center;justify-content:center}
.adisp.flash{animation:pulse .5s ease}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(184,24,44,.6)}70%{box-shadow:0 0 0 14px rgba(184,24,44,0)}100%{box-shadow:0 0 0 0 rgba(184,24,44,0)}}
.acat{font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--pu2);margin-bottom:6px}
.aname{font-family:'Cinzel',serif;font-size:16px;font-weight:700;color:#fff;line-height:1.4;margin-bottom:5px}
.adesc{font-size:12px;color:var(--text2);line-height:1.4}
.aempty{color:var(--muted);font-size:13px;font-style:italic}

/* Validate */
.vrow{display:flex;gap:8px;margin-bottom:8px}
.vok{flex:1;padding:11px;border-radius:999px;background:rgba(30,106,64,.2);border:1px solid var(--gr2);color:var(--gr3);font-weight:700;font-size:13px;cursor:pointer;-webkit-tap-highlight-color:transparent}
.vfail{flex:1;padding:11px;border-radius:999px;background:rgba(184,24,44,.15);border:1px solid var(--red);color:var(--red3);font-weight:700;font-size:13px;cursor:pointer;-webkit-tap-highlight-color:transparent}
.vres{padding:11px 13px;border-radius:var(--r);text-align:center;margin-bottom:8px;animation:fi .3s ease}
.vres-ok{background:rgba(30,106,64,.18);border:1px solid var(--gr2)}
.vres-fail{background:rgba(184,24,44,.18);border:1px solid var(--red)}
.vico{font-size:24px;margin-bottom:3px}
.vtxt{font-family:'Cinzel',serif;font-size:11px;font-weight:700;letter-spacing:1px}
.vres-ok .vtxt{color:var(--gr3)}
.vres-fail .vtxt{color:var(--red3)}
.punbox{margin-top:7px;padding:8px 11px;border-radius:8px;background:rgba(184,24,44,.2);border:1px solid var(--red);font-size:12px;color:var(--red3)}

/* Action items */
.ait{background:var(--s1);border:1px solid var(--b1);border-radius:var(--r);padding:13px;margin-bottom:7px;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:all .15s}
.ait:active{background:var(--s2)}
.ait-cat{font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--pu2);margin-bottom:3px}
.ait-name{font-family:'Cinzel',serif;font-size:14px;font-weight:700;margin-bottom:3px}
.ait-desc{font-size:12px;color:var(--text2);line-height:1.4;margin-bottom:7px}
.ait-meta{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.ait-int{font-size:10px;font-weight:600;letter-spacing:1px;padding:2px 8px;border-radius:999px;background:var(--s2)}
.ait-pts{font-size:12px;font-weight:700;color:var(--gold2)}
.ait-lien{font-size:12px;font-weight:700;color:var(--pu3)}
.ait-acts{display:flex;gap:5px;margin-left:auto}
.ico-btn{background:none;border:none;cursor:pointer;font-size:15px;color:var(--muted2);padding:3px;-webkit-tap-highlight-color:transparent}

/* Search + chips */
.sbar{display:flex;align-items:center;gap:9px;background:var(--s2);border:1px solid var(--b1);border-radius:999px;padding:9px 14px;margin:0 14px 10px}
.sinp{flex:1;background:none;border:none;outline:none;font-family:'Inter',sans-serif;font-size:13px;color:var(--text)}
.sinp::placeholder{color:var(--muted)}
.chips{display:flex;gap:5px;padding:0 14px 8px;overflow-x:auto;scrollbar-width:none}
.chips::-webkit-scrollbar{display:none}
.chip{flex-shrink:0;padding:5px 12px;border-radius:999px;font-size:11px;font-weight:600;cursor:pointer;border:1px solid var(--b2);background:var(--s1);color:var(--muted2);transition:all .15s;-webkit-tap-highlight-color:transparent;white-space:nowrap}
.chip.on{background:var(--grad);border-color:transparent;color:#fff}

/* Intensity selector */
.intsel{display:flex;gap:4px;margin-bottom:10px}
.intdot{flex:1;height:26px;border-radius:5px;cursor:pointer;transition:all .15s;-webkit-tap-highlight-color:transparent}

/* Session player */
.sprog{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.sprogt{flex:1;height:5px;border-radius:3px;background:var(--b1);overflow:hidden}
.sprogf{height:100%;border-radius:3px;background:var(--grad);transition:width .4s}
.sprogl{font-family:'Cinzel',serif;font-size:11px;font-weight:700;color:var(--gold2);white-space:nowrap}
.sacard{background:linear-gradient(135deg,rgba(184,24,44,.12),rgba(16,8,16,.9));border:1px solid rgba(184,24,44,.3);border-radius:var(--r);padding:20px 14px;text-align:center;margin-bottom:12px}
.sacnum{font-size:9px;color:var(--muted);letter-spacing:2px;text-transform:uppercase;margin-bottom:6px}
.saccat{font-size:10px;font-weight:700;color:var(--pu2);letter-spacing:2px;text-transform:uppercase;margin-bottom:5px}
.sacname{font-family:'Cinzel',serif;font-size:18px;font-weight:700;margin-bottom:5px}
.sacdesc{font-size:13px;color:var(--text2);line-height:1.4}
.ssum{text-align:center;padding:20px 14px}
.ssum-title{font-family:'Cinzel',serif;font-size:20px;font-weight:900;margin-bottom:10px;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.ssum-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin:14px 0}
.sss{background:var(--s2);border:1px solid var(--b1);border-radius:10px;padding:10px;text-align:center}
.sss-v{font-family:'Cinzel',serif;font-size:20px;font-weight:700;color:var(--gold2)}
.sss-l{font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-top:2px}

/* Session cards */
.scard{background:var(--s1);border:1px solid var(--b1);border-radius:var(--r);padding:12px;margin-bottom:7px;cursor:pointer;-webkit-tap-highlight-color:transparent}
.scard-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:5px}
.scard-date{font-size:9px;color:var(--muted);letter-spacing:1px;text-transform:uppercase}
.scard-go{font-size:11px;color:var(--gold2);font-weight:600}
.scard-name{font-family:'Cinzel',serif;font-size:13px;font-weight:700;margin-bottom:5px}
.tags{display:flex;flex-wrap:wrap;gap:3px}
.tag{padding:2px 7px;border-radius:999px;font-size:10px;font-weight:600;background:rgba(184,24,44,.2);border:1px solid var(--red);color:var(--red3)}

/* Fantasme cards */
.fcard{background:var(--s1);border:1px solid var(--b1);border-radius:var(--r);padding:13px;margin-bottom:7px;position:relative}
.fcard.rev{border-color:var(--gold)}
.fcard.done{border-color:var(--pu2)}
.fc-title{font-family:'Cinzel',serif;font-size:13px;font-weight:700;margin-bottom:3px}
.fc-desc{font-size:12px;color:var(--text2);line-height:1.4;margin-bottom:7px}
.fc-meta{display:flex;gap:7px;flex-wrap:wrap;align-items:center;margin-bottom:6px}
.fbadge{padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700;font-family:'Cinzel',serif}
.fb-s{background:rgba(107,31,160,.2);border:1px solid var(--pu2);color:var(--pu2)}
.fb-r{background:rgba(200,146,42,.2);border:1px solid var(--gold);color:var(--gold2)}
.fb-d{background:rgba(30,106,64,.2);border:1px solid var(--gr2);color:var(--gr3)}
.stars{color:var(--gold2);font-size:12px}
.fdel{position:absolute;top:8px;right:8px;background:none;border:none;color:var(--muted);cursor:pointer;font-size:13px}

/* Roue */
.wheel-wrap{display:flex;flex-direction:column;align-items:center;padding:10px 0 14px}
.wheel-ptr{font-size:26px;margin-bottom:4px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.5))}
.rw-list{display:flex;flex-direction:column;gap:6px}
.rwi{display:flex;align-items:center;justify-content:space-between;padding:11px 13px;background:var(--s1);border:1px solid var(--b1);border-radius:10px;transition:all .2s}
.rwi.aff{border-color:var(--gold);background:rgba(200,146,42,.08)}
.rwi-l{display:flex;align-items:center;gap:10px}
.rwi-ico{font-size:22px}
.rwi-name{font-size:13px;font-weight:600}
.rwi-cost{font-family:'Cinzel',serif;font-size:12px;font-weight:700;color:var(--gold2)}
.rwi-buy{padding:6px 14px;border-radius:999px;background:var(--grad);border:none;color:#fff;font-size:12px;font-weight:700;cursor:pointer;-webkit-tap-highlight-color:transparent}
.rwi-buy:disabled{opacity:.3;cursor:not-allowed}
.wres{background:var(--grad);border-radius:var(--r);padding:14px 18px;text-align:center;margin-bottom:10px;animation:fi .4s ease;box-shadow:0 4px 18px rgba(184,24,44,.4)}
.wres-ico{font-size:34px;margin-bottom:5px}
.wres-name{font-family:'Cinzel',serif;font-size:17px;font-weight:700;color:#fff;margin-bottom:3px}
.wres-cost{font-size:11px;color:rgba(255,255,255,.7)}

/* Profile */
.phero{position:relative;height:170px;margin-bottom:0}
.phero-back{position:absolute;inset:0;border-radius:0}
.phero-content{position:absolute;bottom:0;left:0;right:0;text-align:center;padding:0 16px 14px}
.pav-big{width:76px;height:76px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:34px;margin:0 auto 9px;box-shadow:0 0 28px rgba(184,24,44,.4)}
.pname-big{font-family:'Cinzel',serif;font-size:21px;font-weight:900;letter-spacing:2px}
.prole-big{font-size:9px;color:var(--muted2);letter-spacing:4px;text-transform:uppercase;margin-top:3px}
.pstats{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin:10px 14px}
.pst{background:var(--s2);border:1px solid var(--b1);border-radius:10px;padding:10px;text-align:center}
.pst-v{font-family:'Cinzel',serif;font-size:19px;font-weight:700;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.pst-l{font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-top:2px}
.tabsw{display:flex;background:var(--s2);border-radius:999px;padding:3px;margin-bottom:12px}
.tsb{flex:1;padding:7px;border-radius:999px;text-align:center;font-size:11px;font-weight:600;cursor:pointer;color:var(--muted2);border:none;background:none;transition:all .2s;-webkit-tap-highlight-color:transparent}
.tsb.on{background:var(--s1);color:var(--text);border:1px solid var(--b2)}

/* Coffre stats */
.cstats{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;margin-bottom:11px}
.cst{background:var(--s2);border:1px solid var(--b1);border-radius:8px;padding:8px 4px;text-align:center}
.cst-v{font-family:'Cinzel',serif;font-size:17px;font-weight:700;color:var(--gold2)}
.cst-l{font-size:8px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-top:2px}

/* Réglages */
.srow{display:flex;align-items:center;justify-content:space-between;padding:11px 0;border-bottom:1px solid var(--b1)}
.srow:last-child{border-bottom:none}
.slabel{font-size:13px;font-weight:500}
.sval{font-family:'Cinzel',serif;font-size:13px;color:var(--gold2)}
.slider{width:100%;height:4px;border-radius:2px;background:var(--b2);outline:none;-webkit-appearance:none;appearance:none;margin-top:7px}
.slider::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:var(--grad);cursor:pointer}
.psel{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:10px}
.psc{padding:13px 9px;border-radius:var(--r);border:1px solid var(--b1);background:var(--s2);text-align:center;cursor:pointer;transition:all .2s;-webkit-tap-highlight-color:transparent}
.psc.dom{border-color:var(--red);background:rgba(184,24,44,.14)}
.psc.sub{border-color:var(--pu2);background:rgba(107,31,160,.14)}
.psc-ico{font-size:26px;margin-bottom:5px}
.psc-name{font-family:'Cinzel',serif;font-size:12px;font-weight:700}

/* Misc */
.row{display:flex;gap:7px}
.col{display:flex;flex-direction:column;gap:5px}
.sep{height:1px;background:var(--b1);margin:10px 0}
.empty{text-align:center;color:var(--muted);font-style:italic;font-size:13px;padding:28px 16px}
.eico{font-size:38px;margin-bottom:9px}
.avs{display:grid;grid-template-columns:repeat(6,1fr);gap:5px;margin:7px 0 11px}
.av{font-size:20px;text-align:center;padding:7px 4px;border-radius:7px;border:1px solid var(--b1);background:var(--s2);cursor:pointer;transition:all .15s;-webkit-tap-highlight-color:transparent}
.av.sel{border-color:var(--gold);background:rgba(200,146,42,.14)}
@keyframes fi{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
`;

/* ═══════════════════════════════════
   STORAGE
═══════════════════════════════════ */
const KEY = "duality_v3";
function ld() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } }
function sv(d) {
  try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {}
  try { saveData(d); } catch {}
}
function todayStr() { return new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"2-digit",month:"long",year:"numeric"}); }
function todayISO() { return new Date().toISOString().split("T")[0]; }
function pick(arr) { return arr[Math.floor(Math.random()*arr.length)]; }
function pickN(arr,n) { const s=[...arr],r=[]; while(r.length<n&&s.length>0){const i=Math.floor(Math.random()*s.length);r.push(s.splice(i,1)[0]);} return r; }
function getLinkState(p) { return LINK_STATES.find(s=>p>=s.min)||LINK_STATES[LINK_STATES.length-1]; }
function lvl(pts) { return Math.floor(pts/100)+1; }
function xp(pts) { return pts%100; }

/* ═══════════════════════════════════
   APP
═══════════════════════════════════ */
export default function App() {
  const st = ld();

  // Tab
  const [tab, setTab] = useState("home");

  // Couple
  const [coupleName, setCN] = useState(st.coupleName||"Duality");
  const [p1n, setP1n] = useState(st.p1n||"Joueur 1");
  const [p2n, setP2n] = useState(st.p2n||"Joueur 2");
  const [p1av, setP1av] = useState(st.p1av||"👑");
  const [p2av, setP2av] = useState(st.p2av||"⚡");
  const [p1desc, setP1desc] = useState(st.p1desc||"");
  const [p2desc, setP2desc] = useState(st.p2desc||"");
  const [p1notes, setP1notes] = useState(st.p1notes||"");
  const [p2notes, setP2notes] = useState(st.p2notes||"");
  const [myProfile, setMyProfile] = useState(st.myProfile||"p1");
  const [viewP, setViewP] = useState("p1");
  const [profileTab, setProfileTab] = useState("public");

  // Points
  const [p1pts, setP1pts] = useState(st.p1pts||0);
  const [p2pts, setP2pts] = useState(st.p2pts||0);

  // Link
  const [link, setLink] = useState(st.link??50);
  const [linkDecay, setLinkDecay] = useState(st.linkDecay??1);
  const [linkPenalty, setLinkPenalty] = useState(st.linkPenalty??3);
  const [linkGoal, setLinkGoal] = useState(st.linkGoal??80);
  const [lastLinkDate, setLastLinkDate] = useState(st.lastLinkDate||null);

  // Actions
  const [actions, setActions] = useState(st.actions||[]);

  // Sessions
  const [sessions, setSessions] = useState(st.sessions||[]);
  const [activeSess, setActiveSess] = useState(null);
  const [sessStatus, setSessStatus] = useState(null);

  // Fantasmes
  const [fantasmes, setFantasmes] = useState(st.fantasmes||[]);

  // Idées
  const [ideas, setIdeas] = useState(st.ideas||[]);

  // Rewards
  const [rewards, setRewards] = useState(st.rewards||DEFAULT_REWARDS);

  // Streak
  const [streak, setStreak] = useState(st.streak||0);
  const [lastDate, setLastDate] = useState(st.lastDate||null);

  // UI — action rapide
  const [rapideMode, setRapideMode] = useState("aleatoire");
  const [curAct, setCurAct] = useState(null);
  const [actStatus, setActStatus] = useState(null);
  const [flashAct, setFlashAct] = useState(false);
  const [punishment, setPunishment] = useState(null);
  const [filterCat, setFilterCat] = useState("all");
  const [searchQ, setSearchQ] = useState("");
  const [maxInt, setMaxInt] = useState(3);

  // UI — biblio
  const [bFilterCat, setBFilterCat] = useState("all");
  const [bSearch, setBSearch] = useState("");

  // UI — modals (all start closed)
  const [showAddAct, setShowAddAct] = useState(false);
  const [showAddSess, setShowAddSess] = useState(false);
  const [showAddFant, setShowAddFant] = useState(false);
  const [showAddRew, setShowAddRew] = useState(false);

  // Forms
  const [fActName, setFActName] = useState("");
  const [fActDesc, setFActDesc] = useState("");
  const [fActCat, setFActCat] = useState("oral");
  const [fActInt, setFActInt] = useState(1);
  const [fActPts, setFActPts] = useState(10);
  const [fActLien, setFActLien] = useState(5);

  const [fSessName, setFSessName] = useState("Nouvelle session");
  const [fSessNote, setFSessNote] = useState("");
  const [fSessInt, setFSessInt] = useState(3);
  const [fSessMode, setFSessMode] = useState("manuel");
  const [fSessActs, setFSessActs] = useState([]);

  const [fFantTitle, setFFantTitle] = useState("");
  const [fFantDesc, setFFantDesc] = useState("");
  const [fFantImp, setFFantImp] = useState(3);
  const [fFantDiff, setFFantDiff] = useState(3);
  const [fFantPriv, setFFantPriv] = useState(true);

  const [fRewName, setFRewName] = useState("");
  const [fRewCost, setFRewCost] = useState(50);
  const [fRewIcon, setFRewIcon] = useState("🎁");

  // Wheel
  const [wheelAngle, setWheelAngle] = useState(0);
  const [wheelSpin, setWheelSpin] = useState(false);
  const [wheelRes, setWheelRes] = useState(null);

  // Coffreonglet
  const [coffreTab, setCoffreTab] = useState("mine");

  // Daily decay
  useEffect(()=>{
    const today = todayISO();
    if(lastLinkDate && lastLinkDate!==today){
      const days = Math.round((new Date(today)-new Date(lastLinkDate))/86400000);
      setLink(l=>Math.max(0,l-days*linkDecay));
    }
    setLastLinkDate(today);
  },[]);

  // Firebase sync
  useEffect(()=>{
    try {
      listenData(data=>{
        if(data.link!==undefined) setLink(data.link);
        if(data.p1pts!==undefined) setP1pts(data.p1pts);
        if(data.p2pts!==undefined) setP2pts(data.p2pts);
        if(data.actions!==undefined) setActions(data.actions);
        if(data.sessions!==undefined) setSessions(data.sessions);
        if(data.fantasmes!==undefined) setFantasmes(data.fantasmes);
        if(data.ideas!==undefined) setIdeas(data.ideas);
        if(data.streak!==undefined) setStreak(data.streak);
        if(data.coupleName!==undefined) setCN(data.coupleName);
      });
    } catch {}
  },[]);

  // Persist
  useEffect(()=>{
    sv({coupleName,p1n,p2n,p1av,p2av,p1desc,p2desc,p1notes,p2notes,myProfile,link,linkDecay,linkPenalty,linkGoal,lastLinkDate,p1pts,p2pts,actions,sessions,fantasmes,ideas,rewards,streak,lastDate});
  },[coupleName,p1n,p2n,p1av,p2av,p1desc,p2desc,p1notes,p2notes,myProfile,link,linkDecay,linkPenalty,linkGoal,lastLinkDate,p1pts,p2pts,actions,sessions,fantasmes,ideas,rewards,streak,lastDate]);

  /* ── helpers ── */
  const totalPts = p1pts+p2pts;
  const coupleLevel = lvl(totalPts);
  const coupleXP = xp(totalPts);
  const myPts = myProfile==="p1"?p1pts:p2pts;
  const linkState = getLinkState(link);

  function goTab(t) {
    setShowAddAct(false);
    setShowAddSess(false);
    setShowAddFant(false);
    setShowAddRew(false);
    setTab(t);
  }

  function addMyPts(n) {
    if(myProfile==="p1") setP1pts(p=>p+n);
    else setP2pts(p=>p+n);
  }

  function fireAction(a) {
    setCurAct(a);
    setActStatus(null);
    setPunishment(null);
    setFlashAct(true);
    setTimeout(()=>setFlashAct(false),600);
  }

  function validateAct(ok) {
    if(!curAct) return;
    if(ok){
      setActStatus("ok");
      setLink(l=>Math.min(100,l+(curAct.lien||5)));
      addMyPts(curAct.pts||10);
    } else {
      setActStatus("fail");
      setLink(l=>Math.max(0,l-linkPenalty));
      setPunishment(pick(PUNISHMENTS));
    }
  }

  function genRandom() {
    const pool = actions.filter(a=>a.int<=maxInt);
    if(!pool.length){
      setCurAct({name:"Aucune action disponible — ajoute-en dans la Bibliothèque !",cat:"—",pts:0,lien:0});
      setActStatus(null); return;
    }
    fireAction(pick(pool));
  }

  function saveAction() {
    if(!fActName.trim()) return;
    const a={id:Date.now(),name:fActName.trim(),desc:fActDesc.trim(),cat:fActCat,int:fActInt,pts:fActPts,lien:fActLien,fav:false};
    setActions(prev=>[...prev,a]);
    setFActName(""); setFActDesc(""); setFActCat("oral"); setFActInt(1); setFActPts(10); setFActLien(5);
    setShowAddAct(false);
  }

  function saveSession() {
    const today = todayISO();
    let ns = streak;
    if(lastDate){const d=Math.round((new Date(today)-new Date(lastDate))/86400000);if(d===1)ns=streak+1;else if(d>1)ns=1;}else ns=1;
    setStreak(ns); setLastDate(today);
    setLink(l=>Math.min(100,l+10));
    setSessions(prev=>[{id:Date.now(),date:todayStr(),name:fSessName,note:fSessNote,acts:fSessActs.map(a=>a.name),int:fSessInt},...prev]);
    setFSessName("Nouvelle session"); setFSessNote(""); setFSessActs([]);
    setShowAddSess(false);
  }

  function startSession(s) {
    const actObjs = s.acts.map(name=>actions.find(a=>a.name===name)||{name,cat:"—",pts:0,lien:0,desc:""});
    setActiveSess({name:s.name,acts:actObjs,idx:0,pts:0,lien:0,done:false});
    setSessStatus(null);
  }

  function validateSessAct(ok) {
    if(!activeSess) return;
    const a = activeSess.acts[activeSess.idx];
    const pts = ok?(a.pts||10):0;
    const lien = ok?(a.lien||5):-linkPenalty;
    setLink(l=>Math.min(100,Math.max(0,l+lien)));
    if(ok) addMyPts(pts);
    const ni = activeSess.idx+1;
    setActiveSess({...activeSess,idx:ni,pts:activeSess.pts+pts,lien:activeSess.lien+lien,done:ni>=activeSess.acts.length});
    setSessStatus(null);
  }

  function saveFantasme() {
    if(!fFantTitle.trim()) return;
    setFantasmes(prev=>[...prev,{id:Date.now(),owner:myProfile,title:fFantTitle.trim(),desc:fFantDesc.trim(),imp:fFantImp,diff:fFantDiff,status:"secret",priv:fFantPriv}]);
    setFFantTitle(""); setFFantDesc(""); setFFantImp(3); setFFantDiff(3);
    setShowAddFant(false);
  }

  function revealFant(id){setFantasmes(f=>f.map(x=>x.id===id?{...x,status:"revealed",priv:false}:x));setLink(l=>Math.min(100,l+15));}
  function realiseFant(id){setFantasmes(f=>f.map(x=>x.id===id?{...x,status:"done"}:x));setLink(l=>Math.min(100,l+20));}
  function deleteFant(id){setFantasmes(f=>f.filter(x=>x.id!==id));}

  function saveReward() {
    if(!fRewName.trim()) return;
    setRewards(prev=>[...prev,{id:`r${Date.now()}`,icon:fRewIcon,label:fRewName.trim(),cost:fRewCost}]);
    setFRewName(""); setFRewCost(50); setFRewIcon("🎁");
    setShowAddRew(false);
  }

  function buyReward(r) {
    if(myPts<r.cost) return;
    addMyPts(-r.cost);
  }

  function spinWheel() {
    if(wheelSpin||rewards.length===0) return;
    setWheelSpin(true); setWheelRes(null);
    const extra = (Math.floor(Math.random()*5)+5)*360;
    const slice = 360/rewards.length;
    const ti = Math.floor(Math.random()*rewards.length);
    const target = extra+(360-ti*slice-slice/2);
    setWheelAngle(prev=>prev+target);
    setTimeout(()=>{ setWheelSpin(false); setWheelRes(rewards[ti]); },4000);
  }

  /* filtered actions */
  const filtRapide = actions.filter(a=>{
    const q = !searchQ||a.name.toLowerCase().includes(searchQ.toLowerCase())||a.desc.toLowerCase().includes(searchQ.toLowerCase());
    const c = filterCat==="all"||(filterCat==="fav"&&a.fav)||a.cat===filterCat;
    return q&&c;
  });
  const filtBiblio = actions.filter(a=>{
    const q = !bSearch||a.name.toLowerCase().includes(bSearch.toLowerCase())||a.desc.toLowerCase().includes(a.desc.toLowerCase());
    const c = bFilterCat==="all"||(bFilterCat==="fav"&&a.fav)||a.cat===bFilterCat;
    return q&&c;
  });

  const AVATARS=["👑","⚡","🔥","💀","🌹","🖤","🐍","🦋","🌙","⚔️","💎","🗡️","🩸","🔮","🌑","💜","❤️‍🔥","🐉","🦅","🌊","🔱","🎭","✨","🌺"];

  function ActDisplay({act,status,onOk,onFail,onNext,flash}) {
    if(!act) return null;
    const cat = CATS.find(c=>c.id===act.cat);
    return <>
      <div className={`adisp${flash?" flash":""}`}>
        <div style={{width:"100%"}}>
          {cat&&<div className="acat">{cat.icon} {cat.label}</div>}
          <div className="aname">{act.name}</div>
          {act.desc&&<div className="adesc">{act.desc}</div>}
        </div>
      </div>
      {status===null&&<div className="vrow">
        <button className="vok" onClick={onOk}>✅ Accompli</button>
        <button className="vfail" onClick={onFail}>❌ Échec</button>
      </div>}
      {status==="ok"&&<div className="vres vres-ok">
        <div className="vico">✅</div>
        <div className="vtxt">+{act.pts||10} pts · +{act.lien||5}% Lien</div>
        {onNext&&<button className="btn btn-g btn-fw" style={{marginTop:9}} onClick={onNext}>Suivante ▶</button>}
      </div>}
      {status==="fail"&&<div className="vres vres-fail">
        <div className="vico">❌</div>
        <div className="vtxt">-{linkPenalty}% Lien</div>
        {punishment&&<div className="punbox">🎡 {punishment}</div>}
        {onNext&&<button className="btn btn-o btn-fw" style={{marginTop:9}} onClick={onNext}>Continuer ▶</button>}
      </div>}
    </>;
  }

  function IntSel({val,set}) {
    return <div className="intsel">
      {INTENS.map(i=><div key={i.lv} role="button" onClick={()=>set(i.lv)}
        className="intdot"
        style={{background:val>=i.lv?i.col:"var(--s2)",border:`1px solid ${val>=i.lv?i.col:"var(--b1)"}`}}
      />)}
    </div>;
  }

  /* ── RENDER ── */
  return <>
    <style>{CSS}</style>
    <div className="app">

      {/* ══ HOME ══ */}
      {tab==="home"&&<>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:24,fontWeight:900,textAlign:"center",padding:"22px 16px 6px",background:"linear-gradient(135deg,#fff,var(--text2))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{coupleName}</div>

        <div className="hstats">
          <div className="hst"><div className="hst-v">{coupleLevel}</div><div className="hst-l">Niv.</div></div>
          <div className="hst"><div className="hst-v">{totalPts}</div><div className="hst-l">Pts</div></div>
          <div className="hst"><div className="hst-v" style={{color:linkState.col}}>{link}%</div><div className="hst-l">Lien</div></div>
          <div className="hst"><div className="hst-v">🔥{streak}</div><div className="hst-l">Streak</div></div>
        </div>

        <div className="xpbar">
          <div className="xprow"><span style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:2}}>{coupleXP}/100 XP → NIV.{coupleLevel+1}</span></div>
          <div className="xptrack"><div className="xpfill" style={{width:`${coupleXP}%`}}/></div>
        </div>

        <div className="lbar gb">
          <div className="lbar-top">
            <div className="lbar-icon">🖤</div>
            <div>
              <span className="lbar-pct" style={{color:linkState.col}}>{link}%</span>
              <span className="lbar-state" style={{color:linkState.col}}> · {linkState.label}</span>
            </div>
          </div>
          <div className="ltrack"><div className="lfill" style={{width:`${link}%`}}/></div>
        </div>

        <div className="prow">
          <div className="pcard dom" onClick={()=>{setViewP("p1");setProfileTab("public");goTab("profil");}}>
            <div className="pav pav-dom">{p1av}</div>
            <div><div className="prole">Dominant·e</div><div className="pname">{p1n}</div><div className="ppts">Niv.{lvl(p1pts)} · {p1pts} pts</div></div>
          </div>
          <div className="pcard sub" onClick={()=>{setViewP("p2");setProfileTab("public");goTab("profil");}}>
            <div className="pav pav-sub">{p2av}</div>
            <div><div className="prole">Soumis·e</div><div className="pname">{p2n}</div><div className="ppts">Niv.{lvl(p2pts)} · {p2pts} pts</div></div>
          </div>
        </div>

        <div className="hgrid">
          <div className="hbtn" onClick={()=>goTab("rapide")}><div className="hbico hico-r">⚡</div><div className="hblbl">Action Rapide</div></div>
          <div className="hbtn" onClick={()=>{setShowAddSess(true);goTab("sessions");}}><div className="hbico hico-p">📅</div><div className="hblbl">Session</div></div>
          <div className="hbtn" onClick={()=>goTab("biblio")}><div className="hbico hico-g">📚</div><div className="hblbl">Bibliothèque</div></div>
          <div className="hbtn" onClick={()=>goTab("coffre")}><div className="hbico hico-p">🔒</div><div className="hblbl">Fantasmes</div></div>
          <div className="hbtn" onClick={()=>goTab("roue")}><div className="hbico hico-r">🎡</div><div className="hblbl">Roue</div></div>
          <div className="hbtn" onClick={()=>goTab("reglages")}><div className="hbico hico-g">⚙️</div><div className="hblbl">Réglages</div></div>
        </div>
      </>}

      {/* ══ RAPIDE ══ */}
      {tab==="rapide"&&<>
        <div className="ph"><div className="bk" onClick={()=>goTab("home")}>←</div><div className="pt">Action Rapide</div><div style={{width:34}}/></div>
        <div style={{padding:"4px 14px 0"}}>
          <div className="mtabs">
            <button className={`mtab${rapideMode==="aleatoire"?" on":""}`} onClick={()=>{setRapideMode("aleatoire");setCurAct(null);setActStatus(null);}}>🎲 Aléatoire</button>
            <button className={`mtab${rapideMode==="manuel"?" on":""}`} onClick={()=>{setRapideMode("manuel");setCurAct(null);setActStatus(null);}}>✋ Manuel</button>
            <button className={`mtab${rapideMode==="categorie"?" on":""}`} onClick={()=>{setRapideMode("categorie");setCurAct(null);setActStatus(null);}}>🗂 Catégorie</button>
          </div>

          {/* Aléatoire */}
          {rapideMode==="aleatoire"&&<>
            <div className="frow">
              <span className="flbl">Intensité max — {INTENS.find(i=>i.lv===maxInt)?.label}</span>
              <IntSel val={maxInt} set={setMaxInt}/>
            </div>
            {curAct
              ? <ActDisplay act={curAct} status={actStatus} flash={flashAct}
                  onOk={()=>validateAct(true)} onFail={()=>validateAct(false)}/>
              : <div className="adisp"><div className="aempty">Appuie sur Générer</div></div>
            }
            {(actStatus!==null||!curAct)&&<button className="btn btn-g btn-fw" style={{marginTop:8}} onClick={()=>{setCurAct(null);setActStatus(null);genRandom();}}>🎲 Générer</button>}
          </>}

          {/* Manuel */}
          {rapideMode==="manuel"&&<>
            <div className="sbar"><span style={{fontSize:14,color:"var(--muted)"}}>🔍</span><input className="sinp" placeholder="Chercher une action..." value={searchQ} onChange={e=>setSearchQ(e.target.value)}/></div>
          </>}
          {rapideMode==="manuel"&&<>
            <div className="chips">
              <span className={`chip${filterCat==="all"?" on":""}`} onClick={()=>setFilterCat("all")}>Toutes</span>
              <span className={`chip${filterCat==="fav"?" on":""}`} onClick={()=>setFilterCat("fav")}>⭐</span>
              {CATS.map(c=><span key={c.id} className={`chip${filterCat===c.id?" on":""}`} onClick={()=>setFilterCat(c.id)}>{c.icon} {c.label}</span>)}
            </div>
            {curAct&&<ActDisplay act={curAct} status={actStatus} flash={flashAct} onOk={()=>validateAct(true)} onFail={()=>validateAct(false)}/>}
            {filtRapide.length===0
              ? <div className="empty"><div className="eico">📭</div>Aucune action.<br/>Ajoute-en dans la Bibliothèque !</div>
              : filtRapide.map(a=><div key={a.id} className="ait" onClick={()=>{fireAction(a);}}>
                  <div className="ait-cat">{CATS.find(c=>c.id===a.cat)?.icon} {CATS.find(c=>c.id===a.cat)?.label}</div>
                  <div className="ait-name">{a.name}</div>
                  {a.desc&&<div className="ait-desc">{a.desc}</div>}
                  <div className="ait-meta">
                    <span className="ait-int" style={{color:INTENS.find(i=>i.lv===a.int)?.col}}>{INTENS.find(i=>i.lv===a.int)?.label}</span>
                    <span className="ait-pts">+{a.pts} pts</span>
                    <span className="ait-lien">💜+{a.lien}%</span>
                  </div>
                </div>)
            }
          </>}

          {/* Catégorie */}
          {rapideMode==="categorie"&&<>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:10}}>
              {CATS.map(c=><div key={c.id} onClick={()=>{const pool=actions.filter(a=>a.cat===c.id);if(pool.length)fireAction(pick(pool));else setCurAct({name:"Aucune action pour cette catégorie",cat:c.id,pts:0,lien:0});setActStatus(null);}}
                style={{padding:"11px 9px",background:"var(--s1)",border:"1px solid var(--b1)",borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",gap:7,fontSize:12,fontWeight:600,WebkitTapHighlightColor:"transparent"}}>
                <span style={{fontSize:16}}>{c.icon}</span>{c.label}
              </div>)}
            </div>
            {curAct&&<ActDisplay act={curAct} status={actStatus} flash={flashAct} onOk={()=>validateAct(true)} onFail={()=>validateAct(false)}/>}
          </>}
        </div>
      </>}

      {/* ══ SESSIONS ══ */}
      {tab==="sessions"&&<>
        <div className="ph">
          <div className="bk" onClick={()=>{ if(activeSess){setActiveSess(null);setSessStatus(null);}else goTab("home"); }}>←</div>
          <div className="pt">{activeSess?activeSess.name:"Sessions"}</div>
          {!activeSess?<div className="ab" onClick={()=>setShowAddSess(true)}>+</div>:<div style={{width:34}}/>}
        </div>

        {/* Session active */}
        {activeSess&&!activeSess.done&&<div style={{padding:"4px 14px 0"}}>
          <div className="sprog">
            <div className="sprogt"><div className="sprogf" style={{width:`${(activeSess.idx/activeSess.acts.length)*100}%`}}/></div>
            <div className="sprogl">{activeSess.idx}/{activeSess.acts.length}</div>
          </div>
          {activeSess.idx<activeSess.acts.length&&(()=>{
            const a=activeSess.acts[activeSess.idx];
            const cat=CATS.find(c=>c.id===a.cat);
            return <>
              <div className="sacard">
                <div className="sacnum">ACTION {activeSess.idx+1} / {activeSess.acts.length}</div>
                {cat&&<div className="saccat">{cat.icon} {cat.label}</div>}
                <div className="sacname">{a.name}</div>
                {a.desc&&<div className="sacdesc">{a.desc}</div>}
              </div>
              {sessStatus===null&&<div className="vrow">
                <button className="vok" onClick={()=>{validateSessAct(true);setSessStatus("ok");}}>✅ Accompli</button>
                <button className="vfail" onClick={()=>{validateSessAct(false);setSessStatus("fail");}}>❌ Échec</button>
              </div>}
              {sessStatus==="ok"&&<><div className="vres vres-ok"><div className="vico">✅</div><div className="vtxt">Accompli !</div></div><button className="btn btn-g btn-fw" onClick={()=>setSessStatus(null)}>Suivante ▶</button></>}
              {sessStatus==="fail"&&<><div className="vres vres-fail"><div className="vico">❌</div><div className="vtxt">Raté</div></div><button className="btn btn-o btn-fw" onClick={()=>setSessStatus(null)}>Continuer ▶</button></>}
            </>;
          })()}
        </div>}

        {/* Session terminée */}
        {activeSess&&activeSess.done&&<div className="ssum">
          <div className="ssum-title">Session terminée ! 🎉</div>
          <div className="ssum-stats">
            <div className="sss"><div className="sss-v">{activeSess.acts.length}</div><div className="sss-l">Actions</div></div>
            <div className="sss"><div className="sss-v">+{activeSess.pts}</div><div className="sss-l">Points</div></div>
            <div className="sss"><div className="sss-v">+{Math.max(0,activeSess.lien)}%</div><div className="sss-l">Lien</div></div>
          </div>
          <button className="btn btn-g btn-fw" onClick={()=>{setActiveSess(null);setSessStatus(null);}}>Terminer</button>
        </div>}

        {/* Liste sessions */}
        {!activeSess&&<div style={{padding:"4px 14px 0"}}>
          {sessions.length===0
            ? <div className="empty"><div className="eico">📅</div>Aucune session.<br/>Crée-en une avec le bouton +.</div>
            : sessions.map(s=><div key={s.id} className="scard" onClick={()=>startSession(s)}>
                <div className="scard-top"><div className="scard-date">{s.date}</div><div className="scard-go">{s.acts?.length||0} actions ▶</div></div>
                <div className="scard-name">{s.name}</div>
                {s.acts?.length>0&&<div className="tags">{s.acts.slice(0,3).map((a,i)=><span key={i} className="tag">{a}</span>)}{s.acts.length>3&&<span className="tag">+{s.acts.length-3}</span>}</div>}
                {s.note&&<div style={{fontSize:11,color:"var(--muted)",fontStyle:"italic",marginTop:5}}>"{s.note}"</div>}
              </div>)
          }
        </div>}

        {/* Modal add session */}
        {showAddSess&&<div className="overlay">
          <div className="modal">
            <div className="mtitle">Nouvelle Session</div>
            <div className="mtabs">
              <button className={`mtab${fSessMode==="manuel"?" on":""}`} onClick={()=>setFSessMode("manuel")}>✋ Manuel</button>
              <button className={`mtab${fSessMode==="aleatoire"?" on":""}`} onClick={()=>{setFSessMode("aleatoire");const pool=actions.filter(a=>a.int<=fSessInt);setFSessActs(pickN(pool,Math.min(5,pool.length)));}}>🎲 Aléa.</button>
              <button className={`mtab${fSessMode==="semi"?" on":""}`} onClick={()=>setFSessMode("semi")}>✨ Semi</button>
            </div>
            <div className="frow"><span className="flbl">Nom</span><input className="inp" value={fSessName} onChange={e=>setFSessName(e.target.value)}/></div>
            <div className="frow">
              <span className="flbl">Intensité max — {INTENS.find(i=>i.lv===fSessInt)?.label}</span>
              <IntSel val={fSessInt} set={v=>{setFSessInt(v);if(fSessMode==="aleatoire"){const p=actions.filter(a=>a.int<=v);setFSessActs(pickN(p,Math.min(5,p.length)));}}}/>
            </div>
            <div className="frow">
              <span className="flbl">Actions ({fSessActs.length})</span>
              <div style={{maxHeight:180,overflowY:"auto"}}>
                {actions.filter(a=>a.int<=fSessInt).map(a=><div key={a.id} onClick={()=>setFSessActs(s=>s.find(x=>x.id===a.id)?s.filter(x=>x.id!==a.id):[...s,a])}
                  style={{padding:"8px 10px",background:"var(--s2)",borderRadius:8,marginBottom:4,display:"flex",alignItems:"center",gap:8,cursor:"pointer",border:`1px solid ${fSessActs.find(x=>x.id===a.id)?"var(--red)":"var(--b1)"}`}}>
                  <span style={{fontSize:15}}>{fSessActs.find(x=>x.id===a.id)?"✅":"⬜"}</span>
                  <span style={{fontSize:13}}>{a.name}</span>
                  <span style={{marginLeft:"auto",fontSize:10,color:"var(--muted)"}}>{INTENS.find(i=>i.lv===a.int)?.label}</span>
                </div>)}
              </div>
              {fSessMode==="semi"&&<button className="btn btn-o btn-sm" style={{marginTop:6}} onClick={()=>{const ex=fSessActs.map(a=>a.id);const p=actions.filter(a=>a.int<=fSessInt&&!ex.includes(a.id));setFSessActs(prev=>[...prev,...pickN(p,Math.min(3,p.length))]);}}>✨ Compléter auto</button>}
            </div>
            <div className="frow"><span className="flbl">Notes</span><textarea className="inp" value={fSessNote} onChange={e=>setFSessNote(e.target.value)} placeholder="Ressenti..."/></div>
            <div className="row">
              <button className="btn btn-o btn-fw" onClick={()=>setShowAddSess(false)}>Annuler</button>
              <button className="btn btn-g btn-fw" onClick={saveSession} disabled={fSessActs.length===0}>Créer ({fSessActs.length})</button>
            </div>
          </div>
        </div>}
      </>}

      {/* ══ BIBLIO ══ */}
      {tab==="biblio"&&<>
        <div className="ph"><div className="bk" onClick={()=>goTab("home")}>←</div><div className="pt">Bibliothèque</div><div className="ab" onClick={()=>setShowAddAct(true)}>+</div></div>
        <div className="sbar"><span style={{fontSize:14,color:"var(--muted)"}}>🔍</span><input className="sinp" placeholder="Chercher..." value={bSearch} onChange={e=>setBSearch(e.target.value)}/></div>
        <div className="chips">
          <span className={`chip${bFilterCat==="all"?" on":""}`} onClick={()=>setBFilterCat("all")}>Toutes {actions.length}</span>
          <span className={`chip${bFilterCat==="fav"?" on":""}`} onClick={()=>setBFilterCat("fav")}>⭐ {actions.filter(a=>a.fav).length}</span>
          {CATS.map(c=><span key={c.id} className={`chip${bFilterCat===c.id?" on":""}`} onClick={()=>setBFilterCat(c.id)}>{c.icon} {c.label} {actions.filter(a=>a.cat===c.id).length}</span>)}
        </div>
        <div style={{padding:"0 14px"}}>
          {filtBiblio.length===0
            ? <div className="empty"><div className="eico">📚</div>Aucune action.<br/>Ajoute-en avec le bouton +.</div>
            : filtBiblio.map(a=><div key={a.id} className="ait">
                <div className="ait-cat">{CATS.find(c=>c.id===a.cat)?.icon} {CATS.find(c=>c.id===a.cat)?.label}</div>
                <div className="ait-name">{a.name}</div>
                {a.desc&&<div className="ait-desc">{a.desc}</div>}
                <div className="ait-meta">
                  <span className="ait-int" style={{color:INTENS.find(i=>i.lv===a.int)?.col}}>{INTENS.find(i=>i.lv===a.int)?.label}</span>
                  <span className="ait-pts">+{a.pts} pts</span>
                  <span className="ait-lien">💜+{a.lien}%</span>
                  <div className="ait-acts">
                    <button className="ico-btn" onClick={()=>setActions(prev=>prev.map(x=>x.id===a.id?{...x,fav:!x.fav}:x))}>{a.fav?"⭐":"☆"}</button>
                    <button className="ico-btn" onClick={()=>setActions(prev=>prev.filter(x=>x.id!==a.id))}>🗑️</button>
                  </div>
                </div>
              </div>)
          }
        </div>

        {/* Modal add action */}
        {showAddAct&&<div className="overlay">
          <div className="modal">
            <div className="mtitle">Nouvelle Action</div>
            <div className="frow"><span className="flbl">Nom</span><input className="inp" value={fActName} onChange={e=>setFActName(e.target.value)} placeholder="Ex: Gorge profonde imposée"/></div>
            <div className="frow"><span className="flbl">Description (optionnel)</span><textarea className="inp" value={fActDesc} onChange={e=>setFActDesc(e.target.value)} placeholder="Détails..."/></div>
            <div className="frow">
              <span className="flbl">Catégorie</span>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
                {CATS.map(c=><div key={c.id} onClick={()=>setFActCat(c.id)}
                  style={{padding:"8px 9px",background:fActCat===c.id?"rgba(184,24,44,.2)":"var(--s2)",border:`1px solid ${fActCat===c.id?"var(--red)":"var(--b1)"}`,borderRadius:8,cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",gap:5,WebkitTapHighlightColor:"transparent"}}>
                  <span style={{fontSize:14}}>{c.icon}</span>{c.label}
                </div>)}
              </div>
            </div>
            <div className="frow">
              <span className="flbl">Intensité — {INTENS.find(i=>i.lv===fActInt)?.label}</span>
              <IntSel val={fActInt} set={setFActInt}/>
            </div>
            <div className="row" style={{marginBottom:12}}>
              <div style={{flex:1}}><span className="flbl">Points</span><input className="inp" type="number" value={fActPts} onChange={e=>setFActPts(parseInt(e.target.value)||0)}/></div>
              <div style={{flex:1}}><span className="flbl">Lien %</span><input className="inp" type="number" value={fActLien} onChange={e=>setFActLien(parseInt(e.target.value)||0)}/></div>
            </div>
            <div className="row">
              <button className="btn btn-o btn-fw" onClick={()=>setShowAddAct(false)}>Annuler</button>
              <button className="btn btn-g btn-fw" onClick={saveAction} disabled={!fActName.trim()}>Ajouter</button>
            </div>
          </div>
        </div>}
      </>}

      {/* ══ ROUE ══ */}
      {tab==="roue"&&<>
        <div className="ph"><div className="bk" onClick={()=>goTab("home")}>←</div><div className="pt">Roue des Récompenses</div><div className="ab" onClick={()=>setShowAddRew(true)}>+</div></div>
        <div style={{padding:"4px 14px 0"}}>
          <div style={{textAlign:"center",marginBottom:12,padding:12,background:"var(--s1)",border:"1px solid var(--b1)",borderRadius:"var(--r)"}}>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:10,color:"var(--muted2)",letterSpacing:2,textTransform:"uppercase",marginBottom:3}}>Mes points</div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:30,fontWeight:900,background:"var(--grad)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{myPts}</div>
          </div>

          {rewards.length>0&&<>
            {wheelRes&&!wheelSpin&&<div className="wres">
              <div className="wres-ico">{wheelRes.icon}</div>
              <div className="wres-name">{wheelRes.label}</div>
              <div className="wres-cost">Coût : {wheelRes.cost} pts</div>
              <button className="btn" style={{background:"rgba(255,255,255,.2)",border:"none",color:"#fff",marginTop:9}} onClick={()=>buyReward(wheelRes)} disabled={myPts<wheelRes.cost}>
                {myPts>=wheelRes.cost?"✅ Utiliser":"❌ Points insuffisants"}
              </button>
            </div>}

            <div className="wheel-wrap">
              <div className="wheel-ptr">▼</div>
              <svg width="260" height="260" viewBox="0 0 260 260"
                style={{transform:`rotate(${wheelAngle}deg)`,transition:wheelSpin?"transform 4s cubic-bezier(.17,.67,.12,1)":"none",borderRadius:"50%",boxShadow:"0 0 28px rgba(184,24,44,.4)",display:"block",margin:"0 auto 14px"}}>
                {rewards.map((r,i)=>{
                  const n=rewards.length, slice=360/n;
                  const start=(i*slice-90)*Math.PI/180;
                  const end=((i+1)*slice-90)*Math.PI/180;
                  const x1=130+120*Math.cos(start),y1=130+120*Math.sin(start);
                  const x2=130+120*Math.cos(end),y2=130+120*Math.sin(end);
                  const cols=["#7a0f1a","#4a0850","#6a5a08","#0f4a6a","#1a4a28","#5a1040","#3a3a08","#0f4a3a"];
                  const mid=((i+.5)*slice-90)*Math.PI/180;
                  const tx=130+80*Math.cos(mid),ty=130+80*Math.sin(mid);
                  return <g key={r.id}>
                    <path d={`M130,130 L${x1},${y1} A120,120 0 ${slice>180?1:0},1 ${x2},${y2} Z`} fill={cols[i%cols.length]} stroke="rgba(0,0,0,.3)" strokeWidth="1"/>
                    <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" fontSize="16" transform={`rotate(${(i+.5)*slice},${tx},${ty})`}>{r.icon}</text>
                  </g>;
                })}
                <circle cx="130" cy="130" r="18" fill="var(--bg)" stroke="rgba(255,255,255,.15)" strokeWidth="2"/>
              </svg>
              <button className="btn btn-g" style={{padding:"12px 36px",fontSize:14}} onClick={spinWheel} disabled={wheelSpin}>
                {wheelSpin?"En cours...":"🎡 Tourner"}
              </button>
            </div>

            <div className="slbl" style={{marginTop:4}}>Toutes les récompenses</div>
            <div className="rw-list">
              {rewards.map(r=><div key={r.id} className={`rwi${myPts>=r.cost?" aff":""}`}>
                <div className="rwi-l"><span className="rwi-ico">{r.icon}</span><div><div className="rwi-name">{r.label}</div><div className="rwi-cost">{r.cost} pts</div></div></div>
                <button className="rwi-buy" disabled={myPts<r.cost} onClick={()=>buyReward(r)}>{myPts>=r.cost?"Utiliser":"🔒"}</button>
              </div>)}
            </div>
          </>}
        </div>

        {showAddRew&&<div className="overlay">
          <div className="modal">
            <div className="mtitle">Nouvelle Récompense</div>
            <div className="frow"><span className="flbl">Icône</span><input className="inp" value={fRewIcon} onChange={e=>setFRewIcon(e.target.value)} style={{fontSize:22,textAlign:"center"}}/></div>
            <div className="frow"><span className="flbl">Nom</span><input className="inp" value={fRewName} onChange={e=>setFRewName(e.target.value)} placeholder="Ex: Massage 30 min"/></div>
            <div className="frow"><span className="flbl">Coût en points</span><input className="inp" type="number" value={fRewCost} onChange={e=>setFRewCost(parseInt(e.target.value)||0)}/></div>
            <div className="row">
              <button className="btn btn-o btn-fw" onClick={()=>setShowAddRew(false)}>Annuler</button>
              <button className="btn btn-g btn-fw" onClick={saveReward} disabled={!fRewName.trim()}>Ajouter</button>
            </div>
          </div>
        </div>}
      </>}

      {/* ══ COFFRE ══ */}
      {tab==="coffre"&&<>
        <div className="ph"><div className="bk" onClick={()=>goTab("home")}>←</div><div className="pt">Coffre</div><div className="ab" onClick={()=>setShowAddFant(true)}>+</div></div>
        <div style={{padding:"4px 14px 0"}}>
          <div className="card" style={{marginBottom:10}}>
            <div className="slbl">Qui consulte ?</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
              {[{id:"p1",n:p1n,av:p1av,pts:p1pts},{id:"p2",n:p2n,av:p2av,pts:p2pts}].map(p=><div key={p.id} onClick={()=>setMyProfile(p.id)}
                style={{padding:10,background:"var(--s2)",borderRadius:10,border:`1px solid ${myProfile===p.id?"var(--gold)":"var(--b1)"}`,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:20}}>{p.av}</span>
                <div><div style={{fontFamily:"'Cinzel',serif",fontSize:12,fontWeight:700}}>{p.n}</div><div style={{fontSize:10,color:"var(--muted)"}}>🔗 {p.pts} pts</div></div>
              </div>)}
            </div>
            <div style={{fontSize:11,color:"var(--muted)",textAlign:"center"}}>Les fantasmes secrets sont invisibles sans déblocage.</div>
          </div>

          <div className="cstats">
            <div className="cst"><div className="cst-v">{fantasmes.length}</div><div className="cst-l">Total</div></div>
            <div className="cst"><div className="cst-v">{fantasmes.filter(f=>f.status==="revealed").length}</div><div className="cst-l">Révélés</div></div>
            <div className="cst"><div className="cst-v">{fantasmes.filter(f=>f.status==="done").length}</div><div className="cst-l">Réalisés</div></div>
            <div className="cst"><div className="cst-v">{fantasmes.length?Math.round(fantasmes.filter(f=>f.status==="done").length/fantasmes.length*100):0}%</div><div className="cst-l">Taux</div></div>
          </div>

          <div className="mtabs">
            <button className={`mtab${coffreTab==="mine"?" on":""}`} onClick={()=>setCoffreTab("mine")}>Mes secrets</button>
            <button className={`mtab${coffreTab==="other"?" on":""}`} onClick={()=>setCoffreTab("other")}>{myProfile==="p1"?p2n:p1n}</button>
            <button className={`mtab${coffreTab==="done"?" on":""}`} onClick={()=>setCoffreTab("done")}>Réalisés</button>
          </div>

          {coffreTab==="mine"&&<>
            {fantasmes.filter(f=>f.owner===myProfile&&f.status!=="done").length===0
              ? <div className="empty"><div className="eico">🔒</div>Ton coffre est vide.<br/>Enregistre une envie — invisible pour l'autre.</div>
              : fantasmes.filter(f=>f.owner===myProfile&&f.status!=="done").map(f=><div key={f.id} className="fcard">
                  <button className="fdel" onClick={()=>deleteFant(f.id)}>×</button>
                  <div className="fc-title">{f.title}</div>
                  {f.desc&&<div className="fc-desc">{f.desc}</div>}
                  <div className="fc-meta">
                    <span className={`fbadge ${f.status==="secret"?"fb-s":f.status==="revealed"?"fb-r":"fb-d"}`}>{f.status==="secret"?"Secret":f.status==="revealed"?"Révélé":"Réalisé"}</span>
                    <span className="stars">{"⭐".repeat(f.imp)}</span>
                    <span style={{fontSize:10,color:"var(--muted)"}}>Diff: {"🔥".repeat(f.diff)}</span>
                  </div>
                  {f.status==="secret"&&<div className="row">
                    <button className="btn btn-o btn-sm" onClick={()=>revealFant(f.id)}>👁️ Révéler +15%</button>
                    <button className="btn btn-o btn-sm" onClick={()=>realiseFant(f.id)}>✅ Réalisé</button>
                  </div>}
                </div>)
            }
          </>}

          {coffreTab==="other"&&<>
            {fantasmes.filter(f=>f.owner!==myProfile&&f.status==="revealed").length===0
              ? <div className="empty">Aucun fantasme révélé.</div>
              : fantasmes.filter(f=>f.owner!==myProfile&&f.status==="revealed").map(f=><div key={f.id} className="fcard rev">
                  <div className="fc-title">{f.title}</div>
                  {f.desc&&<div className="fc-desc">{f.desc}</div>}
                  <div className="fc-meta"><span className="fbadge fb-r">Révélé</span><span className="stars">{"⭐".repeat(f.imp)}</span></div>
                  <button className="btn btn-g btn-fw" style={{marginTop:8}} onClick={()=>realiseFant(f.id)}>✅ Réalisé +20%</button>
                </div>)
            }
          </>}

          {coffreTab==="done"&&<>
            {fantasmes.filter(f=>f.status==="done").length===0
              ? <div className="empty">Aucun fantasme réalisé encore.</div>
              : fantasmes.filter(f=>f.status==="done").map(f=><div key={f.id} className="fcard done">
                  <div className="fc-title">✅ {f.title}</div>
                  {f.desc&&<div className="fc-desc">{f.desc}</div>}
                </div>)
            }
          </>}
        </div>

        {showAddFant&&<div className="overlay">
          <div className="modal">
            <div className="mtitle">Nouveau Fantasme</div>
            <div className="frow"><span className="flbl">Titre</span><input className="inp" value={fFantTitle} onChange={e=>setFFantTitle(e.target.value)} placeholder="Titre..."/></div>
            <div className="frow"><span className="flbl">Description</span><textarea className="inp" value={fFantDesc} onChange={e=>setFFantDesc(e.target.value)} placeholder="Décris ton fantasme..."/></div>
            <div className="frow"><span className="flbl">Importance</span><div style={{display:"flex",gap:4}}>{[1,2,3,4,5].map(i=><button key={i} onClick={()=>setFFantImp(i)} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,padding:0}}>{i<=fFantImp?"⭐":"☆"}</button>)}</div></div>
            <div className="frow"><span className="flbl">Difficulté</span><div style={{display:"flex",gap:4}}>{[1,2,3,4,5].map(i=><button key={i} onClick={()=>setFFantDiff(i)} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,padding:0}}>{i<=fFantDiff?"🔥":"○"}</button>)}</div></div>
            <div className="frow">
              <span className="flbl">Visibilité</span>
              <div className="row">
                <button className={`btn btn-fw${!fFantPriv?" btn-g":" btn-o"}`} onClick={()=>setFFantPriv(false)}>👁️ Visible</button>
                <button className={`btn btn-fw${fFantPriv?" btn-g":" btn-o"}`} onClick={()=>setFFantPriv(true)}>🔒 Secret</button>
              </div>
            </div>
            <div className="row">
              <button className="btn btn-o btn-fw" onClick={()=>setShowAddFant(false)}>Annuler</button>
              <button className="btn btn-g btn-fw" onClick={saveFantasme} disabled={!fFantTitle.trim()}>Sauvegarder</button>
            </div>
          </div>
        </div>}
      </>}

      {/* ══ PROFIL ══ */}
      {tab==="profil"&&(()=>{
        const isP1=viewP==="p1";
        const name=isP1?p1n:p2n, av=isP1?p1av:p2av, pts=isP1?p1pts:p2pts;
        const desc=isP1?p1desc:p2desc, notes=isP1?p1notes:p2notes;
        const setName=isP1?setP1n:setP2n, setAv=isP1?setP1av:setP2av;
        const setDesc=isP1?setP1desc:setP2desc, setNotes=isP1?setP1notes:setP2notes;
        const isMe=myProfile===viewP;
        const bg=isP1?"linear-gradient(135deg,#b8182c,#500010)":"linear-gradient(135deg,#6b1fa0,#300060)";
        const bc=isP1?"var(--red)":"var(--pu2)";
        return <>
          <div className="phero" style={{background:`linear-gradient(180deg,rgba(8,5,8,0) 0%,var(--bg) 100%),${bg}`}}>
            <div style={{position:"absolute",top:12,left:12}}><div className="bk" onClick={()=>goTab("home")}>←</div></div>
            <div className="phero-content">
              <div className="pav-big" style={{background:bg,border:`3px solid ${bc}`}}>{av}</div>
              <div className="pname-big">{name}</div>
              <div className="prole-big">Switch · Niveau {lvl(pts)}</div>
            </div>
          </div>
          <div className="pstats">
            <div className="pst"><div className="pst-v">{lvl(pts)}</div><div className="pst-l">Niveau</div></div>
            <div className="pst"><div className="pst-v">{pts}</div><div className="pst-l">Points</div></div>
            <div className="pst"><div className="pst-v">{sessions.length}</div><div className="pst-l">Sessions</div></div>
          </div>
          <div style={{padding:"0 14px"}}>
            <div className="tabsw">
              <button className={`tsb${profileTab==="public"?" on":""}`} onClick={()=>setProfileTab("public")}>👁️ Public</button>
              {isMe&&<button className={`tsb${profileTab==="prive"?" on":""}`} onClick={()=>setProfileTab("prive")}>🔒 Privé</button>}
              {isMe&&<button className={`tsb${profileTab==="edit"?" on":""}`} onClick={()=>setProfileTab("edit")}>✏️ Éditer</button>}
            </div>
            {profileTab==="public"&&<>
              {desc?<div style={{background:"var(--s1)",border:`1px solid ${bc}33`,borderRadius:"var(--r)",padding:13,marginBottom:10,fontStyle:"italic",color:"var(--text2)",fontSize:13,lineHeight:1.5}}>"{desc}"</div>
              :<div style={{color:"var(--muted)",fontSize:12,fontStyle:"italic",marginBottom:10}}>Aucune description.</div>}
            </>}
            {profileTab==="prive"&&isMe&&<>
              <div style={{background:"rgba(107,31,160,.1)",border:"1px solid var(--pu2)",borderRadius:"var(--r)",padding:13,marginBottom:10}}>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:10,fontWeight:700,color:"var(--pu3)",letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>🔒 Notes privées</div>
                <div style={{fontSize:13,color:"var(--text2)",lineHeight:1.5,whiteSpace:"pre-wrap"}}>{notes||<span style={{color:"var(--muted)",fontStyle:"italic"}}>Aucune note.</span>}</div>
              </div>
            </>}
            {profileTab==="edit"&&isMe&&<>
              <div className="frow"><span className="flbl">Pseudo</span><input className="inp" value={name} onChange={e=>setName(e.target.value)}/></div>
              <div className="frow"><span className="flbl">Description visible</span><input className="inp" value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Une phrase qui te décrit..."/></div>
              <div className="frow"><span className="flbl">Notes privées</span><textarea className="inp" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Pensées, préférences, envies..."/></div>
              <div className="frow">
                <span className="flbl">Avatar</span>
                <div className="avs">{AVATARS.map(a=><div key={a} className={`av${av===a?" sel":""}`} onClick={()=>setAv(a)}>{a}</div>)}</div>
              </div>
            </>}
          </div>
        </>;
      })()}

      {/* ══ RÉGLAGES ══ */}
      {tab==="reglages"&&<>
        <div className="ph"><div className="bk" onClick={()=>goTab("home")}>←</div><div className="pt">Réglages</div><div style={{width:34}}/></div>
        <div style={{padding:"4px 14px 0"}}>
          <div className="card">
            <div className="slbl">Nom du couple</div>
            <input className="inp" value={coupleName} onChange={e=>setCN(e.target.value)}/>
          </div>
          <div className="card">
            <div className="slbl">Profil actif sur cet appareil</div>
            <div className="psel">
              <div className={`psc${myProfile==="p1"?" dom":""}`} onClick={()=>setMyProfile("p1")}><div className="psc-ico">{p1av}</div><div className="psc-name">{p1n}</div></div>
              <div className={`psc${myProfile==="p2"?" sub":""}`} onClick={()=>setMyProfile("p2")}><div className="psc-ico">{p2av}</div><div className="psc-name">{p2n}</div></div>
            </div>
            <div style={{fontSize:11,color:"var(--muted)"}}>Le profil actif détermine tes points et tes notes privées.</div>
          </div>
          <div className="card">
            <div className="slbl">Profils</div>
            <div className="row">
              <button className="btn btn-o btn-fw" onClick={()=>{setViewP("p1");setProfileTab("edit");goTab("profil");}}>✏️ {p1n}</button>
              <button className="btn btn-o btn-fw" onClick={()=>{setViewP("p2");setProfileTab("edit");goTab("profil");}}>✏️ {p2n}</button>
            </div>
          </div>
          <div className="card">
            <div className="slbl">Jauge de Lien</div>
            <div className="srow"><span className="slabel">Décroissance/jour</span><span className="sval">-{linkDecay}%</span></div>
            <input type="range" className="slider" min={0} max={10} step={0.5} value={linkDecay} onChange={e=>setLinkDecay(parseFloat(e.target.value))}/>
            <div className="sep"/>
            <div className="srow"><span className="slabel">Pénalité refus</span><span className="sval">-{linkPenalty}%</span></div>
            <input type="range" className="slider" min={0} max={20} step={1} value={linkPenalty} onChange={e=>setLinkPenalty(parseFloat(e.target.value))}/>
            <div className="sep"/>
            <div className="srow"><span className="slabel">Objectif</span><span className="sval">{linkGoal}%</span></div>
            <input type="range" className="slider" min={50} max={100} step={5} value={linkGoal} onChange={e=>setLinkGoal(parseFloat(e.target.value))}/>
          </div>
          <div className="card">
            <div className="slbl">Ajout de points manuel</div>
            <div className="srow"><span className="slabel">{p1n}</span><span style={{display:"flex",gap:6}}><button className="btn btn-sm btn-o" onClick={()=>setP1pts(p=>p+10)}>+10</button><button className="btn btn-sm btn-o" onClick={()=>setP1pts(p=>Math.max(0,p-10))}>-10</button></span></div>
            <div className="srow"><span className="slabel">{p2n}</span><span style={{display:"flex",gap:6}}><button className="btn btn-sm btn-o" onClick={()=>setP2pts(p=>p+10)}>+10</button><button className="btn btn-sm btn-o" onClick={()=>setP2pts(p=>Math.max(0,p-10))}>-10</button></span></div>
          </div>
          <div className="card">
            <div className="slbl">Données</div>
            <button className="btn btn-o btn-fw" onClick={()=>{localStorage.removeItem(KEY);window.location.reload();}}>🗑️ Réinitialiser toutes les données</button>
          </div>
        </div>
      </>}

      {/* ══ NAV ══ */}
      <nav className="nav">
        {NAV.map(n=><button key={n.id} className={`ni${tab===n.id?" on":""}`} onClick={()=>goTab(n.id)}>
          <span className="ni-icon">{n.icon}</span>{n.label}
        </button>)}
      </nav>

    </div>
  </>;
}
