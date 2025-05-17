export interface CodeBundle {
  html: string;
  css: string;
  js: string;
}

const POLLINATION_TEXT_API_URL_BASE = 'https://text.pollinations.ai';

// This function will now handle GET requests to the text.pollinations.ai endpoint
async function callPollinationTextApi(
  userPromptContent: string,
  systemPromptContent?: string,
  expectJsonOutput: boolean = false
): Promise<string> {
  const encodedUserPrompt = encodeURIComponent(userPromptContent);
  let apiUrl = `${POLLINATION_TEXT_API_URL_BASE}/${encodedUserPrompt}?model=openai-large`;

  if (systemPromptContent) {
    apiUrl += `&system=${encodeURIComponent(systemPromptContent)}`;
  }
  if (expectJsonOutput) {
    apiUrl += `&json=true`;
  }
  // Add other parameters like seed if needed, e.g., &seed=42
  // apiUrl += `&private=true`; // If you want to keep generations private

  console.log(`Calling Pollination Text API: ${apiUrl}`);

  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      // No Authorization header needed for this endpoint
      'Accept': expectJsonOutput ? 'application/json' : 'text/plain',
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Pollination Text API Error:", response.status, errorBody);
    throw new Error(`Pollination AI Text API request failed with status ${response.status}: ${errorBody}`);
  }

  const responseText = await response.text();
  console.log("Received from Pollination Text API:", responseText);

  // If json=true was used, Pollination AI might return a string that is itself a JSON string.
  // e.g., "\"{\\\"html\\\": \\\"...\\\"}\"" which needs double parsing,
  // or just "{ \"html\": \"...\" }" which needs single parsing.
  // Let's try to parse it directly if we expect JSON.
  if (expectJsonOutput) {
    try {
      // First, attempt to parse the text as if it's directly a JSON object string
      const parsedJson = JSON.parse(responseText);
      // If it's a string that contains JSON (e.g. from json=true), parse it again.
      if (typeof parsedJson === 'string') {
        return parsedJson; // This string should be the JSON content for CodeBundle
      }
      // If it was already an object (though API docs say json=true gives a string)
      return JSON.stringify(parsedJson); // Should not happen based on docs, but as fallback
    } catch (e) {
      console.warn("Failed to parse responseText as JSON, returning raw text. Error:", e);
      // Fallback to returning the raw text if primary parsing fails.
      // parseCodeBundleResponse will handle further attempts.
      return responseText;
    }
  }
  
  return responseText;
}

export const generatePlan = async (prompt: string): Promise<string> => {
  console.log(`AI: Generating plan for prompt: "${prompt}" using Pollination Text AI`);
  
  const userPrompt = `Generate a detailed step-by-step plan to create a website based on the following idea: "${prompt}". The plan should cover layout, key components, color scheme, and interactivity. Be specific.`;
  const systemPrompt = "You are an expert project planner. Generate a concise and actionable plan as plain text.";
  
  // Plan is expected as plain text, not JSON
  const plan = await callPollinationTextApi(userPrompt, systemPrompt, false);
  console.log("AI: Plan generated via Pollination Text AI.");
  return plan;
};

const parseCodeBundleResponse = (responseText: string): CodeBundle => {
  try {
    // ResponseText from callPollinationTextApi (when expectJsonOutput=true)
    // should already be a string ready for JSON.parse to get the object.
    const parsed = JSON.parse(responseText);
    if (parsed.html !== undefined && parsed.css !== undefined && parsed.js !== undefined) {
      return {
        html: parsed.html || "",
        css: parsed.css || "",
        js: parsed.js || "",
      };
    }
  } catch (e) {
    console.log("Response is not a direct JSON object string, trying markdown extraction. Error:", e);
    // Fallback to markdown extraction if JSON parsing fails (e.g., AI didn't follow JSON instruction)
  }

  // Fallback: try to find sections like ```html ... ```
  const htmlMatch = responseText.match(/```html\s*([\s\S]*?)\s*```/);
  const cssMatch = responseText.match(/```css\s*([\s\S]*?)\s*```/);
  const jsMatch = responseText.match(/```javascript\s*([\s\S]*?)\s*```/);

  return {
    html: htmlMatch ? htmlMatch[1].trim() : `<!-- HTML could not be extracted. Raw response:\n${responseText}\n-->`,
    css: cssMatch ? cssMatch[1].trim() : `/* CSS could not be extracted. */`,
    js: jsMatch ? jsMatch[1].trim() : `// JavaScript could not be extracted.`,
  };
};


export const generateCode = async (plan: string): Promise<CodeBundle> => {
  console.log(`AI: Generating code for plan: "${plan.substring(0, 100)}..." using Pollination Text AI`);
  
  const userPrompt = `Based on the following plan, generate the complete HTML, CSS, and JavaScript code for a functional single-page website.
Ensure the code is well-structured and works together.
Output ONLY a JSON object string with keys "html", "css", and "js".

Plan:
${plan}`;
  const systemPrompt = `You are a senior web developer. Generate complete, working HTML, CSS, and JavaScript code based on the provided plan. IMPORTANT: Your entire response must be ONLY a single JSON object string with three keys: "html", "css", and "js". Do not include any other text, explanations, or markdown formatting around the JSON object. Example: {"html": "...", "css": "...", "js": "..."}`;
  
  // Expecting a JSON string response
  const rawCodeResponse = await callPollinationTextApi(userPrompt, systemPrompt, true);
  console.log("AI: Raw code response received from Pollination Text AI.");
  
  return parseCodeBundleResponse(rawCodeResponse);
};

export const editCode = async (
  currentCode: CodeBundle,
  editRequest: string
): Promise<CodeBundle> => {
  console.log(`AI: Editing code with request: "${editRequest}" using Pollination Text AI`);
  
  const userPrompt = `I have the following HTML, CSS, and JavaScript code.
HTML:
\`\`\`html
${currentCode.html}
\`\`\`

CSS:
\`\`\`css
${currentCode.css}
\`\`\`

JavaScript:
\`\`\`javascript
${currentCode.js}
\`\`\`

Please apply the following edit: "${editRequest}".
Provide ONLY the complete updated HTML, CSS, and JavaScript code as a JSON object string with keys "html", "css", and "js".`;
  
  const systemPrompt = `You are a senior web developer. Modify the provided HTML, CSS, and JavaScript code according to the user's request. IMPORTANT: Return ONLY the complete, updated code as a single JSON object string with three keys: "html", "css", and "js". Do not include any other text, explanations, or markdown formatting around the JSON object.`;
  
  // Expecting a JSON string response
  const rawEditedCodeResponse = await callPollinationTextApi(userPrompt, systemPrompt, true);
  console.log("AI: Raw edited code response received from Pollination Text AI.");

  return parseCodeBundleResponse(rawEditedCodeResponse);
};
