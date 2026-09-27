import Groq from 'groq-sdk';

let groq: Groq | null = null;

function getGroqClient(): Groq | null {
  if (groq) return groq;
  if (!process.env.GROQ_API_KEY) {
    console.warn('⚠️  GROQ_API_KEY not set. Get free key at https://console.groq.com');
    return null;
  }
  groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return groq;
}

const SYSTEM_PROMPT = `You are an expert code reviewer with 15+ years of experience. Analyze code thoroughly and provide actionable feedback.

Analyze the code for:
1. **Bugs & Logic Errors** - Potential runtime errors, edge cases, incorrect logic
2. **Security Issues** - Vulnerabilities, injection risks, auth problems
3. **Performance** - Inefficient patterns, memory leaks, optimization opportunities
4. **Best Practices** - Code style, maintainability, SOLID principles
5. **Documentation** - Missing comments, unclear naming, need for docs

Respond in JSON format:
{
  "summary": "Brief overall assessment (2-3 sentences)",
  "score": <1-10>,
  "issues": [
    {
      "type": "bug|security|performance|best-practice|documentation",
      "severity": "critical|high|medium|low",
      "line": <line number or null>,
      "message": "Description of the issue",
      "suggestion": "How to fix it"
    }
  ],
  "improvements": ["List of general improvement suggestions"],
  "documentation": "Generated documentation if code needs it"
}`;

export async function analyzeCode(
  code: string,
  language?: string,
  filename?: string
): Promise<any> {
  const provider = process.env.AI_PROVIDER || 'groq';

    if (provider === 'groq' && getGroqClient()) {
    return analyzeWithGroq(code, language, filename);
  } else if (provider === 'ollama') {
    return analyzeWithOllama(code, language, filename);
  }

  throw new Error('No AI provider configured. Set GROQ_API_KEY or use Ollama.');
}

async function analyzeWithGroq(code: string, language?: string, filename?: string): Promise<any> {
   const groqClient = getGroqClient();
  if (!groqClient) {
    throw new Error('Groq client not initialized. Check GROQ_API_KEY.');
  }

  const userMessage = `Review this ${language || 'code'}${filename ? ` from ${filename}` : ''}:

\`\`\`${language || ''}
${code}
\`\`\`

Provide a thorough code review in JSON format.`;

  try {
        const completion = await groqClient.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.3,
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    return JSON.parse(content);
  } catch (error: any) {
    console.error('Groq error:', error);
    throw new Error(`AI analysis failed: ${error.message}`);
  }
}

async function analyzeWithOllama(code: string, language?: string, filename?: string): Promise<any> {
  const ollamaHost = process.env.OLLAMA_HOST || 'http://localhost:11434';
  const model = process.env.OLLAMA_MODEL || 'llama3.1';

  const userMessage = `Review this ${language || 'code'}${filename ? ` from ${filename}` : ''}:

\`\`\`${language || ''}
${code}
\`\`\`

Provide a thorough code review in JSON format.`;

  try {
    const response = await fetch(`${ollamaHost}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt: userMessage,
        system: SYSTEM_PROMPT,
        format: 'json',
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.statusText}`);
    }

    const data = await response.json();
    return JSON.parse(data.response);
  } catch (error: any) {
    console.error('Ollama error:', error);
    throw new Error(`Ollama analysis failed: ${error.message}`);
  }
}

// Stream analysis for real-time feedback
export async function streamAnalyzeCode(
  code: string,
  language: string | undefined,
  filename: string | undefined,
  onChunk: (chunk: string) => void
): Promise<void> {
  const provider = process.env.AI_PROVIDER || 'groq';

    if (provider === 'groq' && getGroqClient()) {
    return streamWithGroq(code, language, filename, onChunk);
  } else if (provider === 'ollama') {
    return streamWithOllama(code, language, filename, onChunk);
  }

  throw new Error('No AI provider configured');
}

async function streamWithGroq(
  code: string,
  language: string | undefined,
  filename: string | undefined,
  onChunk: (chunk: string) => void
): Promise<void> {
    const groqClient = getGroqClient();
  if (!groqClient) throw new Error('Groq not initialized');

  const userMessage = `Review this ${language || 'code'}${filename ? ` from ${filename}` : ''}:

\`\`\`${language || ''}
${code}
\`\`\`

Provide analysis as it comes, be conversational.`;

    const stream = await groqClient.chat.completions.create({
    model: 'openai/gpt-oss-120b',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage }
    ],
    temperature: 0.3,
    max_tokens: 4000,
    stream: true
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      onChunk(content);
    }
  }
}

async function streamWithOllama(
  code: string,
  language: string | undefined,
  filename: string | undefined,
  onChunk: (chunk: string) => void
): Promise<void> {
  const ollamaHost = process.env.OLLAMA_HOST || 'http://localhost:11434';
  const model = process.env.OLLAMA_MODEL || 'llama3.1';

  const userMessage = `Review this ${language || 'code'}${filename ? ` from ${filename}` : ''}:

\`\`\`${language || ''}
${code}
\`\`\``;

  const response = await fetch(`${ollamaHost}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt: userMessage,
      system: SYSTEM_PROMPT,
      stream: true
    })
  });

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response stream');

  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = decoder.decode(value);
    const lines = text.split('\n').filter(Boolean);

    for (const line of lines) {
      try {
        const json = JSON.parse(line);
        if (json.response) {
          onChunk(json.response);
        }
      } catch {}
    }
  }
}
