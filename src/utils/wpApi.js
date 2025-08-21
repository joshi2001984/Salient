import he from "he";
import axios from "axios";

// 1. Extract WPBakery attribute blocks
export function extractAttributeBlocks(content) {
  if (!content) return [];

  // Decode and normalize WPBakery weird encodings
  const decoded = he.decode(content)
    .replace(/\\"/g, '"')
    .replace(/[“”]/g, '"')    // fancy quotes
    .replace(/[‘’]/g, "'")
    .replace(/&#8221;|&#8243;/g, '"') // encoded double quotes → "
    .replace(/&#8216;|&#8217;/g, "'"); // encoded single quotes → '

  const results = [];

  const attributes = [
    "text_content","link_text","title","heading","label","alt",
    "team_member_bio","quote","hover_content","name","subtitle",
    "bg_image","image","image_url","images","video_mp4",
    "background_image","team_member_mini_bio","job_position","bio_alt_image_url",
   
  ];

  // Support both single and double quotes
  attributes.forEach(attr => {
    const regex = new RegExp(`${attr}="([^"]*)"`, "gi");   // for double quotes
const regexSingle = new RegExp(`${attr}='([^']*)'`, "gi"); // for single quotes

for (const match of decoded.matchAll(regex)) {
  results.push({ type: attr, value: match[1].trim() });
}
for (const match of decoded.matchAll(regexSingle)) {
  results.push({ type: attr, value: match[1].trim() });
}
  });

  // VC column text shortcodes
  const shortcodeRegex = /\[vc_column_text[^\]]*](.*?)\[\/vc_column_text]/gis;
  for (const match of decoded.matchAll(shortcodeRegex)) {
    const text = match[1].trim();
    if (text) results.push({ type: "inner_text", value: text });
  }

  // Extract raw tags
  const tags = ['p','li','h1','h2','h3','h4','h5','h6','span','strong','em','b','i'];
  tags.forEach(tag => {
    const regex = new RegExp(`<${tag}[^>]*>(.*?)<\/${tag}>`, 'gis');
    for (const match of decoded.matchAll(regex)) {
      const textContent = match[1].trim().replace(/<[^>]+>/g, '').trim();
      if (textContent) {
        results.push({ type: tag, value: textContent });
        if(tag === 'h2') {
          results.push({ type: 'card_title', value: textContent });
        }
      }
    }
  });

  

  return results;
}

// 2. Fetch WPBakery page content
export async function fetchWpPage(id) {
  try {
    const numericId = parseInt(String(id).replace(/\D/g, ''), 10);
    if (isNaN(numericId)) return null;

    const res = await axios.get(`https://staging.ekarigar.com/wordpress/wp-json/custom/v1/wpbakery-page/${numericId}`);
    if (!res.data?.data) throw new Error("Page not found");

    return {
      id: numericId,
      title: res.data.data.title || "",
      content_html: res.data.data.content_html || ""
    };
  } catch (error) {
    console.error("Failed to fetch page:", error);
    return null;
  }
}

// 3. Get extracted value by type
export function getValue(type, texts, index = 0) {
  if (!Array.isArray(texts) || !texts.length) return "";
  const matches = texts.filter(txt => txt.type === type);
  return matches[index]?.value || "";
}

// 4. Get multiple values (comma-separated IDs/URLs)
export function getMultipleValues(type, texts) {
  if (!Array.isArray(texts) || !texts.length) return [];
  const matches = texts.filter(txt => txt.type === type);
  if (!matches.length) return [];
  return matches
    .flatMap(item => item.value.split(","))
    .map(v => v.trim())
    .filter(Boolean);
}

// 5. Get all image URLs (extended for logos)
export function getAllImageUrls(extractedTexts) {
  if (!Array.isArray(extractedTexts)) return [];
  const urls = extractedTexts
    .filter(item => ["image_url","image","bg_image","background_image","logo","logos"].includes(item.type))
    .map(item => item.value)
    .filter(Boolean);
  return [...new Set(urls)];
}

// 7. Fetch image (handles both ID and URL)
//    Always return {url, alt}
export async function fetchWpImageByValue(value) {
  if (!value) return { url: "/default.jpg", alt: "" };

  const numericId = parseInt(value, 10);
  if (!isNaN(numericId)) {
    try {
      const res = await axios.get(`https://staging.ekarigar.com/wordpress/wp-json/custom/v1/image/${numericId}`);
      return { url: res.data?.url || "/default.jpg", alt: res.data?.alt || "" };
    } catch (err) {
      // console.warn("Image not found for ID:", numericId);
      return { url: "/default.jpg", alt: "" };
    }
  }

  if (typeof value === "string" && (value.startsWith("http://") || value.startsWith("https://"))) {
    return { url: value, alt: "" };
  }

  return { url: "/default.jpg", alt: "" };
}

// 8. Alias for Home.js usage
export async function fetchWpImageById(idOrUrl) {
  return await fetchWpImageByValue(idOrUrl);
}

