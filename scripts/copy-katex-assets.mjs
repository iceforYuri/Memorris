/**
 * 将 KaTeX CSS + fonts 复制到 public/vendor/katex，
 * 供文章页通过 <link> 按路由加载（避免 Vite 打进全站共享 CSS）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcCss = path.join(root, "node_modules/katex/dist/katex.min.css");
const srcFonts = path.join(root, "node_modules/katex/dist/fonts");
const destDir = path.join(root, "public/vendor/katex");
const destFonts = path.join(destDir, "fonts");

if (!fs.existsSync(srcCss)) {
	console.error("[copy-katex] katex 未安装，请先 pnpm install");
	process.exit(1);
}

fs.mkdirSync(destFonts, { recursive: true });
fs.copyFileSync(srcCss, path.join(destDir, "katex.min.css"));

for (const name of fs.readdirSync(srcFonts)) {
	fs.copyFileSync(path.join(srcFonts, name), path.join(destFonts, name));
}

console.log("[copy-katex] synced public/vendor/katex");
