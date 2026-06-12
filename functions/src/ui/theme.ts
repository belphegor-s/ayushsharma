// Shared CSS for all server-rendered pages. Mirrors the portfolio aesthetic:
// dark base, dot-grid background, hairline frame with plus markers, mono
// uppercase labels, blue accent, Geist + Geist Mono + Dancing Script.

export const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&family=Dancing+Script:wght@700&display=swap';

export const CSS = `
:root {
  --bg: #0a0b0d;
  --panel: #0c0d10;
  --line: rgba(255,255,255,0.10);
  --line-soft: rgba(255,255,255,0.06);
  --text: #e8e9ec;
  --muted: rgba(255,255,255,0.45);
  --faint: rgba(255,255,255,0.25);
  --blue: #3b82f6;
  --blue-300: #93b4ff;
}
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  background-color: var(--bg);
  background-image: radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px);
  background-size: 22px 22px;
  color: var(--text);
  font-family: 'Geist', system-ui, -apple-system, sans-serif;
  font-size: 15px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
a { color: var(--blue-300); text-decoration: none; }
a:hover { color: #fff; }
.wrap { max-width: 880px; margin: 0 auto; padding: 0 16px; }
.frame {
  position: relative;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--line);
  border-right: 1px solid var(--line);
  background: rgba(12,13,16,0.6);
  backdrop-filter: blur(6px);
  min-height: 100vh;
}
.content { flex: 1 1 auto; }
.plus { position: absolute; width: 9px; height: 9px; pointer-events: none; z-index: 20; }
.plus::before, .plus::after { content: ''; position: absolute; background: rgba(255,255,255,0.25); }
.plus::before { left: 50%; top: 0; height: 100%; width: 1px; transform: translateX(-50%); }
.plus::after { top: 50%; left: 0; width: 100%; height: 1px; transform: translateY(-50%); }
.plus.tl { left: -5px; top: -5px; } .plus.tr { right: -5px; top: -5px; }
.plus.bl { left: -5px; bottom: -5px; } .plus.br { right: -5px; bottom: -5px; }
.bar {
  display: flex; align-items: center; justify-content: space-between;
  border-bottom: 1px solid var(--line); padding: 12px 20px;
}
.label {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.2em; color: var(--muted);
}
.label .slash { color: var(--blue); font-weight: 700; margin-right: 6px; }
.nav a { font-family: 'Geist Mono', monospace; font-size: 0.7rem; text-transform: uppercase;
  letter-spacing: 0.18em; color: var(--faint); margin-left: 18px; transition: color .15s; }
.nav a:hover { color: var(--text); }
.nav a.active { color: var(--blue-300); }
.section { padding: 28px 20px; animation: rise .55s cubic-bezier(.22,.61,.36,1) both; }
.rule { border-top: 1px solid var(--line); position: relative; }
h1.title { font-family: 'Dancing Script', cursive; font-weight: 700; font-size: 2.6rem;
  margin: 0 0 6px; text-shadow: 0 0 15px rgba(99,102,241,0.3);
  animation: glow 5s ease-in-out infinite; }
h2 { font-size: 1.05rem; margin: 28px 0 10px; }
h3 { font-size: 0.92rem; margin: 22px 0 8px; color: var(--text); }
p.lead { color: var(--muted); margin: 0 0 18px; }
.muted { color: var(--muted); }
.card {
  position: relative; border: 1px solid var(--line); background: rgba(255,255,255,0.02);
  padding: 18px 20px; margin: 14px 0;
  transition: border-color .2s, background .2s;
}
.card:hover { border-color: rgba(255,255,255,0.18); background: rgba(255,255,255,0.03); }
.endpoint:hover { border-color: rgba(59,130,246,0.28); }
.btn {
  display: inline-flex; align-items: center; gap: 8px; cursor: pointer;
  border: 1px solid var(--line); background: rgba(255,255,255,0.03); color: var(--text);
  font-family: 'Geist', sans-serif; font-size: 0.85rem; font-weight: 500;
  padding: 9px 16px; border-radius: 6px; transition: all .15s;
}
.btn:hover { border-color: rgba(255,255,255,0.3); }
.btn.primary { background: var(--blue); border-color: var(--blue); color: #fff; }
.btn.primary:hover { background: #2f74ec; }
.btn.danger:hover { border-color: #ef4444; color: #ff8a8a; }
.btn.google { background: #fff; color: #1f1f1f; border-color: #fff; font-weight: 600; }
.btn.google:hover { background: #f1f1f1; }
form.inline { display: inline; margin: 0; }
.key {
  font-family: 'Geist Mono', monospace; font-size: 0.9rem; word-break: break-all;
  background: #06070a; border: 1px solid var(--line); border-radius: 6px; padding: 12px 14px;
  color: #9be6a8;
}
.meter { height: 6px; background: rgba(255,255,255,0.08); border-radius: 999px; overflow: hidden; margin: 8px 0; }
.meter > span { display: block; height: 100%; background: linear-gradient(90deg, var(--blue), #60a5fa); }
table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
td, th { text-align: left; padding: 8px 10px; border-bottom: 1px solid var(--line-soft); }
th { font-family: 'Geist Mono', monospace; font-size: 0.68rem; text-transform: uppercase;
  letter-spacing: 0.14em; color: var(--faint); font-weight: 500; }
.method { font-family: 'Geist Mono', monospace; font-size: 0.72rem; font-weight: 600;
  padding: 2px 7px; border-radius: 4px; }
.method.get { color: #7ee0a0; background: rgba(126,224,160,0.1); }
.method.post { color: #93b4ff; background: rgba(147,180,255,0.1); }
.endpoint code { font-family: 'Geist Mono', monospace; color: var(--text); }
.banner { border: 1px solid; border-radius: 6px; padding: 12px 16px; margin: 14px 0; font-size: 0.88rem; }
.banner.warn { border-color: rgba(234,179,8,0.4); background: rgba(234,179,8,0.06); color: #f5d77a; }
.swatch { display: inline-block; width: 18px; height: 18px; border-radius: 4px; vertical-align: middle;
  border: 1px solid rgba(255,255,255,0.15); margin-right: 6px; }
.shiki { border: 1px solid var(--line); border-radius: 8px; padding: 14px 16px; overflow-x: auto;
  font-size: 0.82rem; line-height: 1.6; margin: 10px 0; }
.shiki code { font-family: 'Geist Mono', ui-monospace, monospace; }
/* Inline highlighted base URL, code-block style. */
.codeblock { display: inline-flex; align-items: center; gap: 8px; font-family: 'Geist Mono', monospace;
  font-size: 0.82rem; background: linear-gradient(135deg, rgba(59,130,246,0.08), rgba(147,180,255,0.04));
  border: 1px solid rgba(59,130,246,0.2); border-radius: 10px; padding: 8px 10px 8px 14px; color: #93b4ff;
  box-shadow: 0 0 12px rgba(59,130,246,0.06), inset 0 1px 0 rgba(255,255,255,0.04);
  transition: border-color .2s, box-shadow .2s; }
.codeblock:hover { border-color: rgba(59,130,246,0.42);
  box-shadow: 0 0 18px rgba(59,130,246,0.14), inset 0 1px 0 rgba(255,255,255,0.05); }
.codeblock .dot { width: 7px; height: 7px; border-radius: 50%; background: #34d399; box-shadow: 0 0 8px #34d39988;
  animation: pulse 2.6s ease-in-out infinite; }
.scopes { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
.chip { font-family: 'Geist Mono', monospace; font-size: 0.68rem; letter-spacing: 0.06em;
  border: 1px solid var(--line); border-radius: 999px; padding: 4px 10px; color: var(--muted); }
.toolkit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 14px 0; }
@media (max-width: 640px) { .toolkit-grid { grid-template-columns: 1fr; } }
footer.foot { display: flex; justify-content: center; gap: 14px; padding: 18px 20px;
  border-top: 1px solid var(--line); }
footer.foot .label a { color: var(--faint); transition: color .15s; }
footer.foot .label a:hover { color: var(--text); }

/* --- Copy button -------------------------------------------------------- */
.codewrap { position: relative; }
.copy {
  position: absolute; top: 8px; right: 8px; z-index: 6;
  display: inline-flex; align-items: center; justify-content: center;
  width: 30px; height: 30px; padding: 0;
  border: 1px solid var(--line); border-radius: 7px;
  background: rgba(18,20,26,0.72); -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px);
  color: var(--muted); cursor: pointer; opacity: 0; transform: translateY(-2px);
  transition: opacity .18s, color .15s, border-color .15s, background .15s, transform .12s;
}
.codewrap:hover .copy { opacity: 1; transform: none; }
@media (hover: none) { .copy { opacity: 1; transform: none; } }
.copy:focus-visible { opacity: 1; outline: 2px solid var(--blue); outline-offset: 2px; }
.copy:hover { color: var(--text); border-color: rgba(255,255,255,0.28); }
.copy:active { transform: scale(0.9); }
.copy svg { width: 15px; height: 15px; display: block; }
.copy .i-check { display: none; }
.copy.copied { color: #34d399; border-color: rgba(52,211,153,0.45); background: rgba(52,211,153,0.1); opacity: 1; }
.copy.copied .i-copy { display: none; }
.copy.copied .i-check { display: block; animation: pop .26s ease; }
/* Inline variant: sits inside the base-URL pill, always visible. */
.copy.inblock { position: static; opacity: 1; transform: none; width: 24px; height: 24px;
  border: none; background: transparent; border-radius: 6px; color: rgba(147,180,255,0.7); }
.copy.inblock:hover { background: rgba(147,180,255,0.12); color: #fff; }
.copy.inblock.copied { background: rgba(52,211,153,0.14); color: #34d399; }

/* --- Motion ------------------------------------------------------------- */
@keyframes rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
@keyframes glow { 0%,100% { text-shadow: 0 0 15px rgba(99,102,241,0.25); }
  50% { text-shadow: 0 0 24px rgba(99,102,241,0.45); } }
@keyframes pop { 0% { transform: scale(0.5); } 60% { transform: scale(1.18); } 100% { transform: scale(1); } }
@keyframes pulse { 0%,100% { box-shadow: 0 0 6px #34d39966; } 50% { box-shadow: 0 0 11px #34d399cc; } }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition-duration: .01ms !important; }
}
`;

/** Inline client script: delegated copy-to-clipboard for [data-copy] buttons. */
export const COPY_JS = `
(function () {
  function flash(btn) {
    btn.classList.add('copied');
    setTimeout(function () { btn.classList.remove('copied'); }, 1500);
  }
  function copy(text, btn) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { flash(btn); }).catch(function () { fallback(text, btn); });
    } else { fallback(text, btn); }
  }
  function fallback(text, btn) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); flash(btn); } catch (e) {}
    document.body.removeChild(ta);
  }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-copy]');
    if (!btn) return;
    e.preventDefault();
    copy(btn.getAttribute('data-copy'), btn);
  });
})();
`;
