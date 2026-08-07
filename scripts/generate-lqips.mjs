/**
 * LQIP 方案来源: https://blog.cosine.ren/post/astro-lqip-implementation
 * 将图片缩到 2x2，取三角色压成 18 位 hex，运行时解码为 CSS 渐变占位。
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DIR = "src";
const PUBLIC_DIR = "public";
const OUTPUT_FILE = path.join(root, "src/constants/lqips.json");
const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);
const IGNORE_PREFIXES = [
	"public/favicon/",
	"public/vendor/",
];

/**
 * @param {string} dir
 * @param {string[]} out
 */
async function walkImages(dir, out = []) {
	let entries;
	try {
		entries = await fs.readdir(dir, { withFileTypes: true });
	} catch {
		return out;
	}
	for (const entry of entries) {
		const full = path.join(dir, entry.name);
		const rel = path.relative(root, full).replace(/\\/g, "/");
		if (IGNORE_PREFIXES.some((p) => rel.startsWith(p))) continue;
		if (entry.isDirectory()) {
			await walkImages(full, out);
			continue;
		}
		if (IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) {
			out.push(rel);
		}
	}
	return out;
}

/**
 * @param {{ r: number, g: number, b: number }} color
 */
function rgbToHex(color) {
	const hex = (n) => n.toString(16).padStart(2, "0");
	return `#${hex(color.r)}${hex(color.g)}${hex(color.b)}`;
}

/**
 * @param {string} imagePath
 */
async function processImage(imagePath) {
	try {
		const { data, info } = await sharp(imagePath)
			.resize(2, 2, { fit: "fill" })
			.raw()
			.toBuffer({ resolveWithObject: true });

		const channels = info.channels;
		const colors = [];
		for (let i = 0; i < 4; i++) {
			const offset = i * channels;
			colors.push({
				r: data[offset],
				g: data[offset + 1],
				b: data[offset + 2],
			});
		}
		return `${rgbToHex(colors[0]).slice(1)}${rgbToHex(colors[1]).slice(1)}${rgbToHex(colors[3]).slice(1)}`;
	} catch (error) {
		console.error(`Error processing ${imagePath}:`, error);
		return null;
	}
}

/**
 * @param {string} filePath relative to root with /
 */
function filePathToKey(filePath) {
	if (filePath.startsWith(`${PUBLIC_DIR}/`)) {
		return `public:${filePath.slice(PUBLIC_DIR.length + 1)}`;
	}
	if (filePath.startsWith(`${SRC_DIR}/`)) {
		return `src:${filePath.slice(SRC_DIR.length + 1)}`;
	}
	return filePath;
}

async function main() {
	/** @type {Record<string, string>} */
	let existing = {};
	try {
		existing = JSON.parse(await fs.readFile(OUTPUT_FILE, "utf-8"));
		console.log(
			`[lqips] loaded ${Object.keys(existing).length} existing entries`,
		);
	} catch {
		console.log("[lqips] no existing file, creating new");
	}

	const files = [
		...(await walkImages(path.join(root, SRC_DIR))),
		...(await walkImages(path.join(root, PUBLIC_DIR))),
	];

	const currentKeys = new Set(files.map((f) => filePathToKey(f)));
	for (const key of Object.keys(existing)) {
		if (!currentKeys.has(key)) delete existing[key];
	}

	const newFiles = files.filter((f) => !(filePathToKey(f) in existing));
	console.log(
		`[lqips] ${files.length} images, ${newFiles.length} new to process`,
	);

	const lqips = { ...existing };
	let processed = 0;
	for (const file of newFiles) {
		process.stdout.write(`\r[lqips] ${processed + 1}/${newFiles.length}`);
		const compact = await processImage(path.join(root, file));
		if (compact) {
			lqips[filePathToKey(file)] = compact;
			processed++;
		}
	}

	await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
	await fs.writeFile(OUTPUT_FILE, `${JSON.stringify(lqips, null, 2)}\n`, "utf-8");
	console.log(
		`\n[lqips] done. new=${processed}, total=${Object.keys(lqips).length} → ${path.relative(root, OUTPUT_FILE)}`,
	);
}

main();
