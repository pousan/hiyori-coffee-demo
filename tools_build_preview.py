#!/usr/bin/env python3
"""Build a single-file clickable preview of the cafe-demo site.

Each page becomes a fully self-contained srcdoc iframe (its own CSS/JS inlined,
scripts moved to end of body which matches defer semantics). A tiny interceptor
in each page forwards cross-page link clicks to the shell, which switches the
visible iframe. The original site files are untouched.
"""
import base64
import html
import re
from pathlib import Path

SITE = Path.home() / "workspace/projects/cafe-demo/site"
OUT = Path.home() / "workspace/projects/cafe-demo/preview/hiyori-coffee-preview.html"
PAGES = ["index", "menu", "about", "access", "contact"]

INTERCEPTOR = """
<script>
document.addEventListener('click', function (e) {
  var a = e.target.closest('a[href]');
  if (!a) return;
  var m = a.getAttribute('href').match(/^([a-z]+)\\.html(?:#(.*))?$/);
  if (m) {
    e.preventDefault();
    parent.postMessage({ hiyoriNav: { page: m[1], anchor: m[2] || null } }, '*');
  }
});
window.addEventListener('message', function (e) {
  if (e.data && e.data.hiyoriScroll) {
    var el = document.getElementById(e.data.hiyoriScroll);
    if (el) el.scrollIntoView();
  }
});
</script>
"""

SHELL_SCRIPT = """
<script>
var frames = {};
document.querySelectorAll('iframe').forEach(function (f) { frames[f.dataset.page] = f; });
function show(page, anchor) {
  if (!frames[page]) return;
  document.querySelectorAll('iframe').forEach(function (f) { f.classList.remove('active'); });
  frames[page].classList.add('active');
  frames[page].contentWindow.scrollTo(0, 0);
  if (anchor) {
    setTimeout(function () {
      frames[page].contentWindow.postMessage({ hiyoriScroll: anchor }, '*');
    }, 60);
  }
}
window.addEventListener('message', function (e) {
  if (e.data && e.data.hiyoriNav) show(e.data.hiyoriNav.page, e.data.hiyoriNav.anchor);
});
</script>
"""


def build_page(name: str) -> str:
    doc = (SITE / f"{name}.html").read_text(encoding="utf-8")
    css = (SITE / "css/style.css").read_text(encoding="utf-8")
    doc = doc.replace(
        '<link rel="stylesheet" href="css/style.css">',
        "<style>\n" + css + "\n</style>",
    )
    scripts = []
    for m in re.finditer(r'<script src="js/([a-z-]+)\.js" defer></script>', doc):
        scripts.append((SITE / f"js/{m.group(1)}.js").read_text(encoding="utf-8"))
    doc = re.sub(r'<script src="js/[a-z-]+\.js" defer></script>\n?', "", doc)
    # inline images as data URIs so the single file stays self-contained
    def _inline_img(m: "re.Match[str]") -> str:
        img_path = SITE / m.group(1)
        data = base64.b64encode(img_path.read_bytes()).decode("ascii")
        return f'src="data:image/jpeg;base64,{data}"'

    doc = re.sub(r'src="(images/[a-z-]+\.jpg)"', _inline_img, doc)
    injected = "".join("<script>\n" + s + "\n</script>\n" for s in scripts)
    doc = doc.replace("</body>", injected + INTERCEPTOR + "</body>")
    return doc


def main() -> None:
    frames = []
    for name in PAGES:
        srcdoc = html.escape(build_page(name), quote=True)
        cls = ' class="active"' if name == "index" else ""
        frames.append(f'<iframe data-page="{name}"{cls} title="{name}" srcdoc="{srcdoc}"></iframe>')
    shell = (
        "<!DOCTYPE html>\n"
        '<html lang="ja">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
        '<meta name="robots" content="noindex,nofollow">\n'
        "<title>ひより珈琲 デモサイト（プレビュー）</title>\n"
        "<style>html,body{margin:0;height:100%;background:#faf6ef}"
        "iframe{border:0;width:100%;height:100%;display:none}"
        "iframe.active{display:block}</style>\n</head>\n<body>\n"
        + "\n".join(frames)
        + "\n"
        + SHELL_SCRIPT
        + "</body>\n</html>\n"
    )
    OUT.write_text(shell, encoding="utf-8")
    print(f"wrote {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
