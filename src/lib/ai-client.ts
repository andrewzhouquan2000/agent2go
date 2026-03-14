/**
 * AI Client for Agent2Go
 * Supports OpenAI and Claude APIs
 */

interface AIConfig {
  provider: 'openai' | 'claude'
  apiKey: string
  model?: string
}

interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface AIResponse {
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

/**
 * Call AI API based on provider
 */
export async function callAI(
  messages: AIMessage[],
  config: AIConfig
): Promise<AIResponse> {
  if (config.provider === 'openai') {
    return callOpenAI(messages, config.apiKey, config.model)
  } else if (config.provider === 'claude') {
    return callClaude(messages, config.apiKey, config.model)
  } else {
    throw new Error(`Unsupported provider: ${config.provider}`)
  }
}

/**
 * Call OpenAI API
 */
async function callOpenAI(
  messages: AIMessage[],
  apiKey: string,
  model = 'gpt-4o-mini'
): Promise<AIResponse> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 4096,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI API error: ${response.status} ${error}`)
  }

  const data = await response.json()
  
  return {
    content: data.choices[0]?.message?.content || '',
    usage: {
      promptTokens: data.usage?.prompt_tokens || 0,
      completionTokens: data.usage?.completion_tokens || 0,
      totalTokens: data.usage?.total_tokens || 0,
    },
  }
}

/**
 * Call Claude API
 */
async function callClaude(
  messages: AIMessage[],
  apiKey: string,
  model = 'claude-3-5-sonnet-20241022'
): Promise<AIResponse> {
  // Convert messages to Claude format
  const systemMessage = messages.find(m => m.role === 'system')
  const claudeMessages = messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    }))

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system: systemMessage?.content || '',
      messages: claudeMessages,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Claude API error: ${response.status} ${error}`)
  }

  const data = await response.json()
  
  return {
    content: data.content?.[0]?.text || '',
    usage: {
      promptTokens: data.usage?.input_tokens || 0,
      completionTokens: data.usage?.output_tokens || 0,
      totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
    },
  }
}
