import { GoogleGenAI, Type } from "@google/genai";
import { SignatureConfig, GeneratedResult } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSignatureCode = async (config: SignatureConfig): Promise<GeneratedResult> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    You are an expert HTML Email Developer. Your task is to generate a robust, cross-client compatible HTML email signature based on the provided JSON data.

    **CRITICAL DESIGN RULES:**
    
    1.  **ALIGNMENT:** 
        *   **STRICTLY LEFT ALIGNED.** The main container <table> must have 'align="left"'.
        *   All text content must be 'text-align: left'.
        
    2.  **SPACING (COMPACT):**
        *   **ZERO SPACING DEFAULTS:** All <table> tags MUST have 'cellpadding="0"', 'cellspacing="0"', and 'border="0"'.
        *   All <td>, <p>, <h1>, <span> tags must have 'margin: 0;' and 'padding: 0;'.
        *   Use explicit 'line-height: 1.2;' to prevent large vertical gaps.
        *   Only add vertical spacing using empty rows <tr style="height: 10px;"> or specific 'padding-bottom' where absolutely necessary to separate sections.

    3.  **STRUCTURE ORDER (Strict):**
        1.  **Header:** Logo (left) + Name/Title (right of logo).
        2.  **Divider:** Horizontal line (ensure no huge gaps above/below).
        3.  **Details:** Contact fields (Website, Email, Address).
        4.  **Social Media:** Icons row.
        5.  **Banner:** The banner image (if provided).
        6.  **Footer:** The Disclaimer text (if provided) is the LAST element.

    4.  **TYPOGRAPHY:**
        *   **Labels (WEBSITE:, etc.):** Monospace font (Courier New), Bold, Uppercase.
        *   **Values:** Serif font (Georgia), Normal weight.
        *   **Name:** Large (e.g., 22px), Serif, Bold.
        *   **Job Title:** Monospace, Uppercase, smaller (e.g., 12px), letter-spacing: 1px.

    5.  **SOCIAL MEDIA ICONS (High Visibility & PNG):**
        *   We need **White Icons** centered on a **Solid Black Circle**.
        *   **USE PNG IMAGES** for maximum compatibility (Outlook does not support external SVGs well).
        *   **USE THIS EXACT HTML PATTERN** for each icon:
            \`\`\`html
            <a href="[URL]" style="text-decoration: none; display: inline-block; margin-right: 5px;">
              <table cellpadding="0" cellspacing="0" border="0" style="display: inline-block;">
                <tr>
                  <td style="background-color: #000000; border-radius: 50%; width: 28px; height: 28px; text-align: center; vertical-align: middle;">
                    <img src="https://img.icons8.com/ios-filled/50/ffffff/[ICON_SLUG].png" width="16" height="16" style="display: block; margin: 0 auto; border: 0;" alt="Icon" />
                  </td>
                </tr>
              </table>
            </a>
            \`\`\`
        *   **[ICON_SLUG] Mapping:**
            *   LinkedIn -> 'linkedin'
            *   Calendly -> 'calendly'
            *   X / Twitter -> 'x'
            *   YouTube -> 'youtube'
            *   Instagram -> 'instagram-new'
        *   Only render icons for links that are present in the data.

    6.  **IMAGES:**
        *   **Logo:** If provided, place it in a <td> to the left of the text info. If 'logoLink' exists, wrap the <img> in an <a> tag.
        *   **Banner:** Place in a new <tr> below social icons. Ensure 'display: block; width: 100%; max-width: 600px;'. If 'bannerLink' exists, wrap in <a>.
        *   **General:** Add 'display: block;' to all images to remove ghost padding in Outlook.

    Data:
    ${JSON.stringify(config)}

    Output Format:
    Return a JSON object with:
    - 'html': The raw HTML string.
    - 'tips': A short string of advice.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            html: {
              type: Type.STRING,
              description: "The complete HTML code.",
            },
            tips: {
              type: Type.STRING,
              description: "Brief advice.",
            },
          },
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return result as GeneratedResult;

  } catch (error) {
    console.error("Error generating signature:", error);
    throw new Error("Failed to generate signature code.");
  }
};