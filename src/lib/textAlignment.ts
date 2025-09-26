import { franc } from "franc";

// Languages that use Right-to-Left (RTL) writing direction
const RTL_LANGUAGES = new Set([
  "ara", // Arabic
  "arb", // Standard Arabic (franc uses this code)
  "heb", // Hebrew
  "per", // Persian/Farsi
  "fas", // Persian (alternative code)
  "pes", // Western Persian
  "prs", // Dari Persian
  "urd", // Urdu
  "pus", // Pashto
  "snd", // Sindhi
  "uig", // Uyghur
  "arc", // Aramaic
  "ckb", // Central Kurdish
  "div", // Divehi
  "kur", // Kurdish
  "mzn", // Mazandarani
  "syr", // Syriac
]);

export interface TextAlignmentResult {
  language: string;
  direction: "ltr" | "rtl";
  textAlign: "left" | "right" | "center";
}

/**
 * Detects the language of text and returns appropriate alignment settings
 */
export function detectTextAlignment(text: string): TextAlignmentResult {
  // Remove markdown syntax for better language detection
  const cleanText = text
    .replace(/[#*_`~[\]()]/g, " ") // Remove markdown symbols
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();

  // Return default if text is too short for reliable detection
  if (cleanText.length < 10) {
    return {
      language: "und", // undefined language
      direction: "ltr",
      textAlign: "left",
    };
  }

  // Detect language using franc
  const detectedLanguage = franc(cleanText);

  // Determine if the language uses RTL writing direction
  const isRTL = RTL_LANGUAGES.has(detectedLanguage);

  return {
    language: detectedLanguage,
    direction: isRTL ? "rtl" : "ltr",
    textAlign: isRTL ? "right" : "left",
  };
}

/**
 * Get CSS classes for text alignment based on detected language
 */
export function getTextAlignmentClasses(text: string): string {
  const { direction, textAlign } = detectTextAlignment(text);

  const directionClass = direction === "rtl" ? "rtl" : "ltr";
  const alignmentClass = textAlign === "right" ? "text-right" : "text-left";

  return `${directionClass} ${alignmentClass}`;
}
