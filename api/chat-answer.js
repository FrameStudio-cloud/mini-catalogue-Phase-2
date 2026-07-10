export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { shopContext, question, groqApiKey } = req.body
  if (!question) {
    return res.status(400).json({ error: 'question is required' })
  }

  const apiKey = groqApiKey || process.env.GROQ_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Groq API key not configured' })
  }

  const productsBlock = shopContext?.products?.length
    ? shopContext.products.map(p =>
        `- ${p.name} (${p.category}) — Ksh ${p.price}${p.inStock ? '' : ' — OUT OF STOCK'}`
      ).join('\n')
    : 'No products available.'

  const faqsBlock = shopContext?.faqs?.length
    ? shopContext.faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')
    : 'No FAQs available.'

  const systemPrompt = `You are a friendly Kenyan shop assistant for ${shopContext?.shopName || 'the shop'}. Answer customer questions based ONLY on the shop information provided below. Be conversational, use Kenyan English, and keep responses concise.

Shop Information:
- Name: ${shopContext?.shopName || 'N/A'}
- Description: ${shopContext?.description || 'N/A'}
- Location: ${shopContext?.location || 'N/A'}
- Hours: ${shopContext?.hours || 'N/A'}
- Delivery: ${shopContext?.deliveryInfo || 'N/A'}

Products Available:
${productsBlock}

FAQs:
${faqsBlock}

Respond with valid JSON only (no markdown, no code fences):
{
  "answer": "your friendly response here",
  "outOfStockProduct": null or "product name if a requested item is out of stock",
  "suggestedAlternative": null or "alternative product name if applicable",
  "orderReady": false or true if customer clearly wants to order,
  "orderItems": null or [{ "name": "product name", "quantity": 1, "price": 0 }]
}`

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Groq API error:', err)
      return res.status(502).json({ error: 'AI service error' })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return res.status(502).json({ error: 'Empty AI response' })
    }

    // Parse the JSON from the response
    let parsed
    try {
      parsed = JSON.parse(content)
    } catch {
      // If AI didn't return valid JSON, wrap the raw text as answer
      parsed = { answer: content, outOfStockProduct: null, suggestedAlternative: null, orderReady: false, orderItems: null }
    }

    return res.status(200).json(parsed)
  } catch (err) {
    console.error('Chat answer error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
