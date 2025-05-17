
// Simulated AI service

export interface CodeBundle {
  html: string;
  css: string;
  js: string;
}

// Simulates generating a detailed plan from a prompt
export const generatePlan = async (prompt: string): Promise<string> => {
  console.log(`AI: Generating plan for prompt: "${prompt}"`);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  const plan = `
    Plan for: "${prompt}"
    1. Layout: A single-column layout.
    2. Header: Contains the title "${prompt}".
    3. Content: A paragraph describing the website.
    4. Colors: Use a light theme with blue accents.
    5. Components: Header, Paragraph.
  `;
  console.log("AI: Plan generated.");
  return plan;
};

// Simulates generating code from a plan
export const generateCode = async (plan: string): Promise<CodeBundle> => {
  console.log(`AI: Generating code for plan: "${plan.substring(0, 50)}..."`);
  await new Promise(resolve => setTimeout(resolve, 1500));
  const code: CodeBundle = {
    html: `<h1>My Awesome Website</h1>\n<p>This website was generated based on a plan.</p>\n<button onclick="greet()">Click me!</button>`,
    css: `body {\n  font-family: sans-serif;\n  background-color: #f0f8ff;\n  color: #333;\n  padding: 20px;\n}\nh1 {\n  color: #007bff;\n}`,
    js: `function greet() {\n  alert("Hello from the generated website!");\n}`,
  };
  console.log("AI: Code generated.");
  return code;
};

// Simulates editing existing code based on a request
export const editCode = async (
  currentCode: CodeBundle,
  editRequest: string
): Promise<CodeBundle> => {
  console.log(`AI: Editing code with request: "${editRequest}"`);
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Simple simulation: append a comment to each part
  const updatedCode: CodeBundle = {
    html: `${currentCode.html}\n<!-- Edit: ${editRequest} -->`,
    css: `${currentCode.css}\n/* Edit: ${editRequest} */`,
    js: `${currentCode.js}\n// Edit: ${editRequest}`,
  };
  console.log("AI: Code edited.");
  return updatedCode;
};
