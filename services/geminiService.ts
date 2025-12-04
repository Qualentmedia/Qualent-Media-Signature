
import { GoogleGenAI, Type } from "@google/genai";
import { SignatureConfig, GeneratedResult } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSignatureCode = async (config: SignatureConfig): Promise<GeneratedResult> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    You are an expert HTML Email Developer. Your task is to generate a robust, cross-client compatible HTML email signature based on the provided JSON data.

    Design Requirements based on the user's preferred style:
    1.  **Layout:** Use HTML tables (<table>, <tr>, <td>) for layout to ensure compatibility with Outlook and Gmail. Do not use Flexbox or Grid.
    2.  **Typography:**
        *   **Labels (e.g., WEBSITE:, EMAIL:):** Use a Monospace font family (Courier New, monospace). They should be bold.
        *   **Values (e.g., example.com):** Use a Serif font family (Georgia, serif).
        *   **Name:** Large, Serif font, Bold.
        *   **Job Title:** Monospace font, uppercase, letter-spacing: 2px.
    3.  **Styling:**
        *   Use INLINE CSS for everything (style="...").
        *   Minimalist, professional white background.
        *   Include a horizontal divider line.
    4.  **Social Media:**
        *   Place the social media icons immediately after the Contact Details.
        *   Use CIRCULAR icons (black circle background with white logo).
        *   Use publicly available, reliable CDN URLs for the social icons (e.g., from Icons8 or similar). Ensure they are approx 24x24px.
        *   Wrap each icon in an anchor (<a>) tag pointing to the provided URL.
        *   Only include icons for services that have a URL provided in the data.
    5.  **Images & Links:**
        *   **Logo:**
            *   If a 'logo' URL is provided, place it to the left of the name/title block.
            *   If 'logoLink' is provided, wrap the logo <img> in an <a> tag pointing to 'logoLink'.
        *   **Banner:**
            *   If a 'banner' URL is provided, place it at the very bottom of the signature (full width).
            *   If 'bannerLink' is provided, wrap the banner <img> in an <a> tag pointing to 'bannerLink'.
        *   Ensure images have 'display: block' to remove gaps in some clients.
        *   Use the provided URL strings for src attributes directly. Do NOT assume they are Base64.
        *   Set appropriate widths for images if needed, but ensure they remain responsive.

    Data:
    ${JSON.stringify(config)}

    Output Format:
    Return a JSON object with:
    - 'html': The raw HTML string for the signature.
    - 'tips': A short string of advice on how to install this signature.
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
              description: "The complete HTML code for the email signature.",
            },
            tips: {
              type: Type.STRING,
              description: "Brief advice on installation.",
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
