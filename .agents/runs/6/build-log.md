# ひより珈琲 デモサイト 実装ログ — run 6（制作元募集導線バナーの追加）

担当：Antigravity（agy）

## やったこと

`AGENTS.md` の規約および指示に基づき、`site/` 配下の全5ページ（`index.html`, `menu.html`, `about.html`, `access.html`, `contact.html`）の上部に制作元（Studio Miraie）への募集導線バナーを追加し、共有スタイルシート（`site/css/style.css`）を拡張した。あわせて `tools_build_preview.py` を再実行し、単一ファイルプレビュー（`preview/hiyori-coffee-preview.html`）を最新化した。

### 変更したファイル一覧

| パス | 変更内容 |
|---|---|
| `site/index.html` | スキップリンク直後・既存 `.demo-banner` の上部に `<aside class="studio-bar" aria-label="制作元の案内">` を追加 |
| `site/menu.html` | 同上 |
| `site/about.html` | 同上 |
| `site/access.html` | 同上 |
| `site/contact.html` | 同上 |
| `site/css/style.css` | `.studio-bar` / `.studio-bar-inner` / `.studio-bar-text` / `.studio-bar-cta` のスタイルを追記（上部固定 `position: sticky; top: 0`、黒背景 `#1C1917`、アイボリー文字 `#FAF7F2`、金 `#A16207` のボタン縁取り、モバイル縦積み・768px以上横並び） |
| `preview/hiyori-coffee-preview.html` | `tools_build_preview.py` により `site/` の変更を反映して再生成 |

---

## 根拠

1. **文言・リンク仕様の一致確認**
   - 全5ページに共通で、文言「`このサイトは Studio Miraie の制作見本（デモ）です`」と、CTAボタン「`あなたの店のサイト制作はこちら`」（`href="https://studio-miraie-portfolio.vercel.app"`、`target="_blank"` 等の別タブ指定なし）を配置した。
2. **デザイン・レスポンシブ・アクセシビリティの確認**
   - 既存のデザイントークン（`--color-green: #1C1917` エスプレッソブラック、`--bg-base: #FAF7F2` アイボリー、`--color-accent: #A16207` ゴールド）を使用し、高級路線のトーンに合わせて細く控えめなバーとして実装した。
   - 既存の `.demo-banner`（同様に `#1C1917` 背景）と視覚的に区別できるよう、`.studio-bar` 下部に控えめなゴールドの細線（`rgba(161, 98, 7, 0.45)`）を設けた。
   - モバイル（767px以下）では `flex-direction: column` による縦積み・中央揃えとし、320px幅でもテキスト折り返しや横スクロールはみ出しが起きない構造とした。768px以上では `flex-direction: row` で1行に収まる。
   - コントラスト比：背景 `#1C1917` に対するアイボリー文字 `#FAF7F2` は **16.4:1**（WCAG AAA基準クリア）。キーボードフォーカス時には白系アウトライン（`2px solid var(--bg-surface)`）が表示され、スキップリンク（`z-index: 1000`）は固定バー（`z-index: 900`）より前面に表示される。またページ内アンカー移動時に固定バーと重ならないよう `[id]` の `scroll-margin-top` を調整した。
3. **厳守事項の確認**
   - `git diff` により、既存の本文・架空である旨の注記（`.demo-banner` およびフッター注記）・ページ構成・JSファイルに一切変更がないことを確認した。
   - Webフォント・CDN・外部画像などの外部リクエストは一切追加していない（追加した `https://` は CTA の `a[href]` のみ）。
   - `tools_build_preview.py` を実行し、`preview/hiyori-coffee-preview.html`（3,697,738 bytes）がエラーなく再生成されたことを確認した。

---

## 未確認のこと

- 実ブラウザでの目視レンダリング確認および実機スクロール時の固定バー挙動確認は未実施。
