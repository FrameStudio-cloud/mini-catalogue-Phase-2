import { useState, useEffect, useRef, useCallback } from 'react'
import { FiMessageCircle, FiX, FiSend, FiChevronDown, FiChevronUp, FiPhone, FiShoppingBag, FiAlertCircle, FiLock } from 'react-icons/fi'
import { supabase } from '../lib/supabase'
import { getShopId, getShopSettings } from '../lib/shop'
import { useShop } from '../context/ShopContext'

function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [config, setConfig] = useState(null)
  const [faqs, setFaqs] = useState([])
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [question, setQuestion] = useState('')
  const [cbName, setCbName] = useState('')
  const [cbPhone, setCbPhone] = useState('')
  const [sending, setSending] = useState(false)
  const [aiResponse, setAiResponse] = useState(null)
  const [messages, setMessages] = useState([])
  const [view, setView] = useState('main')
  const [cbSent, setCbSent] = useState(false)
  const [saSent, setSaSent] = useState(false)
  const [lastAiQuestion, setLastAiQuestion] = useState('')
  const pollRef = useRef(null)
  const shopIdRef = useRef(null)
  const { shop } = useShop()
  const [shopSettings, setShopSettings] = useState(null)

  const isPro = config?.pro_until && new Date(config.pro_until) > new Date()

  const isFree = !isPro

  useEffect(() => {
    (async () => {
      const shopId = await getShopId()
      if (!shopId) return
      shopIdRef.current = shopId

      const [cfgRes, faqRes, settings] = await Promise.all([
        supabase.from('chat_config').select('*').eq('shop_id', shopId).maybeSingle(),
        supabase.from('chat_faqs').select('*').eq('shop_id', shopId).order('sort_order').limit(200),
        getShopSettings(),
      ])

      if (cfgRes.data) setConfig(cfgRes.data)
      if (faqRes.data) setFaqs(faqRes.data)
      if (settings) setShopSettings(settings)

      const stored = localStorage.getItem(`chat_ids_${shopId}`)
      if (stored) {
        try {
          const ids = JSON.parse(stored)
          if (ids.length > 0) {
            const { data } = await supabase
              .from('chat_messages')
              .select('*')
              .in('id', ids)
              .order('created_at', { ascending: false })
            if (data) setMessages(data)
          }
        } catch {}
      }
    })()
  }, [])

  useEffect(() => {
    if (!open) return
    pollRef.current = setInterval(async () => {
      const sid = shopIdRef.current
      if (!sid) return
      const stored = localStorage.getItem(`chat_ids_${sid}`)
      if (!stored) return
      try {
        const ids = JSON.parse(stored)
        if (ids.length === 0) return
        const { data } = await supabase
          .from('chat_messages')
          .select('*')
          .in('id', ids)
          .order('created_at', { ascending: false })
        if (data) setMessages(data)
      } catch {}
    }, 5000)
    return () => clearInterval(pollRef.current)
  }, [open])

  const buildShopContext = useCallback(async () => {
    const sid = shopIdRef.current
    if (!sid) return null

    const { data: products } = await supabase
      .from('catalogue')
      .select('name, price, category, description, featured')
      .eq('shop_id', sid)
      .eq('available', true)
      .limit(100)

    return {
      shopName: shopSettings?.store_name || shop.name + (shop.nameAccent ? ` ${shop.nameAccent}` : ''),
      description: shopSettings?.description || shop.description || shop.about,
      location: shopSettings?.store_address || shop.location,
      hours: shopSettings?.business_hours ? (typeof shopSettings.business_hours === 'string' ? shopSettings.business_hours : JSON.stringify(shopSettings.business_hours)) : shop.hours,
      deliveryInfo: '',
      products: (products || []).map(p => ({
        name: p.name,
        price: p.price,
        category: p.category,
        description: p.description,
        inStock: true,
      })),
      faqs: faqs.map(f => ({ question: f.question, answer: f.answer })),
    }
  }, [shop, shopSettings, faqs])

  async function handleAsk() {
    if (!question.trim() || sending) return
    setSending(true)
    setAiResponse(null)
    setView('waiting')
    setLastAiQuestion(question.trim())

    const ctx = await buildShopContext()
    if (!ctx) { setSending(false); return }

    try {
      const res = await fetch('/api/chat-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopContext: ctx, question: question.trim() }),
      })
      const data = await res.json()
      if (data.error) {
        setAiResponse({ answer: 'Sorry, something went wrong. Please try again or leave your contact details for a callback.', noAnswer: true })
        setView('callback')
      } else {
        setAiResponse(data)
        if (data.outOfStockProduct) {
          setView('stock-alert')
        } else if (!data.answer || data.answer.toLowerCase().includes('cannot answer') || data.answer.toLowerCase().includes("don't have that information") || data.answer.toLowerCase().includes("i don't know")) {
          setView('callback')
        } else if (data.orderReady) {
          setView('order')
        } else {
          setView('answer')
        }
      }
    } catch {
      setAiResponse({ answer: 'Sorry, something went wrong. Please try again or leave your contact details for a callback.', noAnswer: true })
      setView('callback')
    }

    setSending(false)
  }

  async function handleCallback() {
    if (!cbName.trim() || !cbPhone.trim() || !shopIdRef.current) return
    await supabase.from('chat_callbacks').insert({
      shop_id: shopIdRef.current,
      name: cbName.trim(),
      phone: cbPhone.trim(),
      question: lastAiQuestion,
      status: 'pending',
    })
    setCbSent(true)
  }

  async function handleStockAlert() {
    if (!cbName.trim() || !cbPhone.trim() || !shopIdRef.current || !aiResponse?.outOfStockProduct) return
    await supabase.from('chat_stock_alerts').insert({
      shop_id: shopIdRef.current,
      product_name: aiResponse.outOfStockProduct,
      customer_note: lastAiQuestion,
      status: 'pending',
    })
    setSaSent(true)
  }

  function handleOrder() {
    const shopPhone = shopSettings?.whatsapp || shop.whatsapp
    if (!shopPhone) return
    const items = aiResponse?.orderItems || [{ name: question.trim(), quantity: 1, price: 0 }]
    const lines = items.map((it, i) => `${i + 1}. ${it.name} x${it.quantity} - Ksh ${it.price.toLocaleString()}`).join('\n')
    const total = items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0)
    const msg = `Hello! I'd like to order:\n\n${lines}\n\nTotal: Ksh ${total.toLocaleString()}\n\nMy name: ${cbName || 'Customer'}`
    window.open(`https://wa.me/${shopPhone.replace(/^0/, '254')}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  function reset() {
    setQuestion('')
    setAiResponse(null)
    setView('main')
    setCbSent(false)
    setSaSent(false)
    setCbName('')
    setCbPhone('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAsk()
    }
  }

  const color = config?.widget_color || '#3B82F6'

  if (!config?.enabled) return null

  return (
    <div className="fixed bottom-8 left-8 z-50">
      {open && (
        <div className="absolute bottom-16 left-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[80vh]">
          <div className="p-4 text-white shrink-0" style={{ backgroundColor: color }}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">
                {config?.welcome_message || 'Hi! How can we help you today?'}
              </p>
              {isFree && (
                <span className="text-[10px] bg-white/20 rounded-full px-2 py-0.5">Free</span>
              )}
              {isPro && (
                <span className="text-[10px] bg-white/20 rounded-full px-2 py-0.5">Pro</span>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {faqs.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">FAQs</p>
                {faqs.map((faq) => (
                  <div key={faq.id} className="mb-1">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                      className="flex items-center gap-2 w-full text-left text-sm font-medium text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {expandedFaq === faq.id ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                      <span className="flex-1">{faq.question}</span>
                    </button>
                    {expandedFaq === faq.id && (
                      <p className="text-xs text-gray-500 pl-9 pr-3 pb-2 leading-relaxed">{faq.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {isFree && (
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 text-center">
                <FiLock size={20} className="mx-auto mb-2 text-gray-400" />
                <p className="text-xs text-gray-500">Upgrade to <span className="font-semibold text-gray-700">Pro Plan</span> to unlock the smart assistant — get instant AI answers, order guidance, and off-hours callback capture.</p>
              </div>
            )}

            {isPro && view === 'main' && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Ask anything</p>
                <textarea
                  rows={2}
                  placeholder="e.g. Do you have a black dress? Do you deliver to Thika?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-blue-400 placeholder-gray-400"
                />
                <button
                  onClick={handleAsk}
                  disabled={!question.trim() || sending}
                  className="mt-2 w-full py-2 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ backgroundColor: color }}
                >
                  <FiSend size={14} />
                  {sending ? 'Thinking...' : 'Ask'}
                </button>
              </div>
            )}

            {isPro && view === 'waiting' && (
              <div className="text-center py-6">
                <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-gray-400">Thinking...</p>
              </div>
            )}

            {isPro && view === 'answer' && aiResponse && (
              <div>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <p className="text-xs font-semibold text-blue-600 mb-1 uppercase tracking-wider">Assistant</p>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{aiResponse.answer}</p>
                </div>
                <div className="flex gap-2 mt-3">
                  {aiResponse.orderReady && (
                    <button onClick={handleOrder} className="flex-1 py-2 text-xs font-semibold text-white rounded-lg flex items-center justify-center gap-1.5" style={{ backgroundColor: color }}>
                      <FiShoppingBag size={13} />
                      Order Now
                    </button>
                  )}
                  {aiResponse.suggestedAlternative && (
                    <button onClick={() => setView('stock-alert')} className="flex-1 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg flex items-center justify-center gap-1.5 hover:bg-gray-200 transition-colors">
                      <FiAlertCircle size={13} />
                      Notify Me
                    </button>
                  )}
                </div>
                <button onClick={reset} className="mt-2 w-full py-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors">Ask another question</button>
              </div>
            )}

            {isPro && view === 'stock-alert' && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                {saSent ? (
                  <div className="text-center py-3">
                    <FiCheck size={24} className="mx-auto mb-2 text-amber-500" />
                    <p className="text-sm font-medium text-amber-800">We'll let you know when it's back!</p>
                    <button onClick={reset} className="mt-2 text-xs text-amber-600 underline">Ask another question</button>
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-semibold text-amber-700 mb-2">Notify me when back in stock</p>
                    {aiResponse?.answer && (
                      <p className="text-xs text-gray-600 mb-3 whitespace-pre-wrap">{aiResponse.answer}</p>
                    )}
                    {aiResponse?.suggestedAlternative && (
                      <p className="text-xs text-amber-700 mb-3 font-medium">Alternative suggestion: {aiResponse.suggestedAlternative}</p>
                    )}
                    <input
                      type="text"
                      placeholder="Your name"
                      value={cbName}
                      onChange={(e) => setCbName(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:border-amber-400 placeholder-gray-400"
                    />
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={cbPhone}
                      onChange={(e) => setCbPhone(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:border-amber-400 placeholder-gray-400"
                    />
                    <button
                      onClick={handleStockAlert}
                      disabled={!cbName.trim() || !cbPhone.trim()}
                      className="mt-1 w-full py-2 text-white text-sm font-semibold rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                      style={{ backgroundColor: color }}
                    >
                      <FiAlertCircle size={14} />
                      Notify Me
                    </button>
                  </>
                )}
              </div>
            )}

            {isPro && view === 'callback' && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                {cbSent ? (
                  <div className="text-center py-3">
                    <FiCheck size={24} className="mx-auto mb-2 text-green-500" />
                    <p className="text-sm font-medium text-gray-800">We'll call you back!</p>
                    <p className="text-xs text-gray-400 mt-1">We'll get back to you during business hours.</p>
                    <button onClick={reset} className="mt-2 text-xs text-gray-500 underline">Ask another question</button>
                  </div>
                ) : (
                  <>
                    {aiResponse?.answer && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Assistant</p>
                        <p className="text-xs text-gray-600 whitespace-pre-wrap">{aiResponse.answer}</p>
                      </div>
                    )}
                    <p className="text-xs font-semibold text-gray-500 mb-2">Leave your details for a callback</p>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={cbName}
                      onChange={(e) => setCbName(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:border-gray-400 placeholder-gray-400"
                    />
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={cbPhone}
                      onChange={(e) => setCbPhone(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:border-gray-400 placeholder-gray-400"
                    />
                    <button
                      onClick={handleCallback}
                      disabled={!cbName.trim() || !cbPhone.trim()}
                      className="mt-1 w-full py-2 text-white text-sm font-semibold rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                      style={{ backgroundColor: color }}
                    >
                      <FiPhone size={14} />
                      Request Callback
                    </button>
                  </>
                )}
              </div>
            )}

            {isPro && view === 'order' && aiResponse && (
              <div>
                <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                  <p className="text-xs font-semibold text-green-600 mb-1 uppercase tracking-wider">Assistant</p>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{aiResponse.answer}</p>
                </div>
                <button
                  onClick={handleOrder}
                  className="mt-3 w-full py-3 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2"
                  style={{ backgroundColor: color }}
                >
                  <FiShoppingBag size={16} />
                  Order via WhatsApp
                </button>
                <button onClick={reset} className="mt-1.5 w-full py-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors">Ask another question</button>
              </div>
            )}

            {messages.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Previous messages</p>
                {messages.map((msg) => (
                  <div key={msg.id} className="bg-gray-50 rounded-lg p-3 mb-2 border border-gray-100">
                    <p className="text-sm text-gray-700">{msg.question}</p>
                    {msg.status === 'answered' && msg.answer ? (
                      <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                        <p className="text-[10px] font-semibold text-blue-600 mb-0.5 uppercase tracking-wider">Reply</p>
                        <p className="text-xs text-gray-600">{msg.answer}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                        <span className="w-3 h-3 border border-gray-300 rounded-full" />
                        Awaiting reply...
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
        style={{ backgroundColor: color }}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? <FiX size={24} /> : <FiMessageCircle size={24} />}
      </button>
    </div>
  )
}

export default ChatWidget
