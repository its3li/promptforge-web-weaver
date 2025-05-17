
export interface CodeBundle {
  html: string;
  css: string;
  js: string;
}

const API_KEY_STORAGE_KEY = 'pollinationApiKey';
// IMPORTANT: Replace with the actual Pollination AI API endpoint
const POLLINATION_API_URL = 'https://api.pollinations.ai/v1/chat/completions'; // This is a hypothetical URL

async function callPollinationApi(messages: Array<{role: string, content: string}>, instruction?: string): Promise<string> {
  const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
  if (!apiKey) {
    throw new Error("Pollination AI API key not found. Please set it in the application.");
  }

  const systemMessage = instruction ? instruction : "You are an expert web developer. Provide complete, concise, and accurate code or plans as requested. For code generation, always provide HTML, CSS, and JavaScript. If a language is not needed, provide an empty string for it.";
  
  const body = {
    model: "pollinations/chat-model-alpha", // Placeholder model, adjust as needed
    messages: [{ role: "system", content: systemMessage }, ...messages],
    // Add any other parameters required by Pollination AI, like temperature, max_tokens etc.
  };

  console.log("Sending to Pollination AI:", JSON.stringify(body, null, 2));

  const response = await fetch(POLLINATION_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Pollination API Error:", response.status, errorBody);
    throw new Error(`Pollination AI API request failed with status ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  console.log("Received from Pollination AI:", data);

  // Adjust this based on the actual API response structure
  // Assuming the response has a structure like: { choices: [{ message: { content: "..." } }] }
  if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
    return data.choices[0].message.content;
  } else {
    console.error("Unexpected API response structure:", data);
    throw new Error("Unexpected response structure from Pollination AI API.");
  }
}

export const generatePlan = async (prompt: string): Promise<string> => {
  console.log(`AI: Generating plan for prompt: "${prompt}" using Pollination AI`);
  
  const messages = [{ role: "user", content: `Generate a detailed step-by-step plan to create a website based on the following idea: "${prompt}". The plan should cover layout, key components, color scheme, and interactivity. Be specific.` }];
  
  const plan = await callPollinationApi(messages, "You are an expert project planner. Generate a concise and actionable plan.");
  console.log("AI: Plan generated via Pollination AI.");
  return plan;
};

// Helper to parse structured code output
const parseCodeBundleResponse = (responseText: string): CodeBundle => {
  try {
    // Attempt to parse as JSON if the AI returns a JSON string
    // e.g., {"html": "...", "css": "...", "js": "..."}
    const parsed = JSON.parse(responseText);
    if (parsed.html !== undefined && parsed.css !== undefined && parsed.js !== undefined) {
      return {
        html: parsed.html || "",
        css: parsed.css || "",
        js: parsed.js || "",
      };
    }
  } catch (e) {
    // If not JSON, try to extract from markdown code blocks
    console.log("Response is not JSON, trying markdown extraction.");
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
  console.log(`AI: Generating code for plan: "${plan.substring(0, 100)}..." using Pollination AI`);
  
  const messages = [{ role: "user", content: `Based on the following plan, generate the complete HTML, CSS, and JavaScript code for a functional single-page website.
  Ensure the code is well-structured and works together.
  Output the HTML, CSS, and JavaScript in separate, clearly marked sections or as a JSON object with keys "html", "css", and "js".

  Plan:
  ${plan}` }];
  
  const rawCodeResponse = await callPollinationApi(messages, "You are a senior web developer. Generate complete, working HTML, CSS, and JavaScript code based on the provided plan. Structure your response clearly, preferably as a JSON object string with 'html', 'css', and 'js' keys, or using markdown code blocks for each language.");
  console.log("AI: Raw code response received from Pollination AI.");
  
  return parseCodeBundleResponse(rawCodeResponse);
};

export const editCode = async (
  currentCode: CodeBundle,
  editRequest: string
): Promise<CodeBundle> => {
  console.log(`AI: Editing code with request: "${editRequest}" using Pollination AI`);
  
  const messages = [{ role: "user", content: `I have the following HTML, CSS, and JavaScript code.
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
  Provide the complete updated HTML, CSS, and JavaScript code. Structure your response clearly, preferably as a JSON object string with 'html', 'css', and 'js' keys, or using markdown code blocks for each language.`
  }];
  
  const rawEditedCodeResponse = await callPollinationApi(messages, "You are a senior web developer. Modify the provided HTML, CSS, and JavaScript code according to the user's request. Return the complete, updated code. Structure your response clearly, preferably as a JSON object string with 'html', 'css', and 'js' keys, or using markdown code blocks for each language.");
  console.log("AI: Raw edited code response received from Pollination AI.");

  return parseCodeBundleResponse(rawEditedCodeResponse);
};
