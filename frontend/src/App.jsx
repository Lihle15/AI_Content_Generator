import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import {
  Check,
  Clock,
  Copy,
  Heart,
  Loader2,
  Moon,
  Sparkles,
  Sun,
  Trash2,
  WandSparkles,
} from 'lucide-react'

const CONTENT_TYPES = ['Social Post', 'Blog Outline', 'Email', 'Ad Copy']
const TONES = ['Conversational', 'Bold', 'Professional', 'Witty']
const PLATFORMS = ['Instagram', 'LinkedIn', 'Twitter/X']

const API_URL = 'http://localhost:8000/api/generate'

function SelectorRow({ label, options, value, onChange }) {
  return (
    <div className="selector-row">
      <div className="selector-label">{label}</div>
      <div className="selector-options">
        {options.map((option) => {
          const selected = option === value
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              aria-pressed={selected}
              className={`selector-pill ${selected ? 'selected' : ''}`}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function App() {
  const [topic, setTopic] = useState('')
  const [contentType, setContentType] = useState(CONTENT_TYPES[0])
  const [tone, setTone] = useState(TONES[0])
  const [platform, setPlatform] = useState(PLATFORMS[0])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState(() => {
    try {
      const savedHistory = JSON.parse(localStorage.getItem('forgeai-history') || '[]')
      return Array.isArray(savedHistory) ? savedHistory.slice(0, 50) : []
    } catch {
      return []
    }
  })
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('forgeai-theme')
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  const canGenerate = useMemo(() => topic.trim().length > 0 && !loading, [topic, loading])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('forgeai-theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('forgeai-history', JSON.stringify(history.slice(0, 50)))
  }, [history])

  async function handleGenerate(event) {
    event.preventDefault()
    if (!topic.trim()) {
      setError('Enter a topic to generate content.')
      return
    }

    setLoading(true)
    setError('')
    setCopied(false)

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          content_type: contentType,
          tone,
          platform,
        }),
      })

      if (!response.ok) {
        throw new Error('Generation failed')
      }

      const data = await response.json()
      const generatedContent = data.content || ''
      setContent(generatedContent)
      setHistory((currentHistory) => [
        {
          id: Date.now(),
          topic: topic.trim(),
          contentType,
          tone,
          platform,
          content: generatedContent,
          createdAt: new Date().toISOString(),
        },
        ...currentHistory,
      ].slice(0, 50))
    } catch {
      setError('Unable to generate content right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    if (!content) return
    await navigator.clipboard.writeText(content)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  function loadHistoryItem(item) {
    setContent(item.content)
    setTopic(item.topic)
    setContentType(item.contentType)
    setTone(item.tone)
    setPlatform(item.platform)
    setError('')
  }

  function deleteHistoryItem(id) {
    setHistory((currentHistory) => currentHistory.filter((item) => item.id !== id))
  }

  function clearHistory() {
    if (window.confirm('Clear all saved generations?')) setHistory([])
  }

  function formatDate(value) {
    return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(value))
  }

  return (
    <div className="app-shell">
      <div className="background-glow background-glow-one" aria-hidden="true" />
      <div className="background-glow background-glow-two" aria-hidden="true" />

      <header className="topbar">
        <div className="brand-wrap">
          <Heart className="brand-mark" size={19} strokeWidth={2.2} aria-hidden="true" />
          <span className="brand-name">LOPE-LEE</span>
        </div>
        <div className="topbar-actions">
          <div className="brand-badge">AI CONTENT STUDIO</div>
          <button
            type="button"
            className="icon-button"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
          </button>
        </div>
      </header>

      <main className="main-layout">
        <section className="hero-section">
          <h1>
            Create content that
            <span>gets remembered.</span>
          </h1>
          <p className="subtitle">
            Describe what you need, choose your style, and LOPE-LEE will create polished content in seconds.
          </p>
        </section>

        <div className="studio-layout">
          <div className="studio-compose">
            <form onSubmit={handleGenerate} className="generator-panel">
              <div className="panel-section">
                <SelectorRow
                  label="CONTENT TYPE"
                  options={CONTENT_TYPES}
                  value={contentType}
                  onChange={setContentType}
                />
              </div>

              <div className="panel-section">
                <div className="section-title">TOPIC</div>
                <label htmlFor="topic" className="sr-only">
                  Topic
                </label>
                <textarea
                  id="topic"
                  rows={5}
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                  placeholder="Describe what you want LOPE-LEE to create..."
                  className="prompt-input"
                />
              </div>

              <div className="panel-section">
                <SelectorRow label="TONE" options={TONES} value={tone} onChange={setTone} />
              </div>

              <div className="panel-section">
                <SelectorRow label="PLATFORM" options={PLATFORMS} value={platform} onChange={setPlatform} />
              </div>

              <div className="generator-actions">
                <button
                  type="submit"
                  disabled={!canGenerate}
                  className={`primary-button ${loading ? 'loading' : ''}`}
                >
                  {loading ? <Loader2 className="spin" size={17} /> : <WandSparkles size={17} />}
                  {loading ? 'Generating...' : 'Generate Content'}
                </button>
              </div>
            </form>

            {error ? <p className="error-message">{error}</p> : null}
          </div>

          <section className="preview-panel">
            <div className="preview-header">
              <h2>THE PIECE</h2>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!content}
                className="secondary-button"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied' : 'Copy to Clipboard'}
              </button>
            </div>

            <div className="preview-content">
              {loading ? (
                <div className="loading-state" aria-label="Generating content">
                  <span />
                  <span />
                  <span />
                </div>
              ) : content ? (
                <div className="markdown-body"><ReactMarkdown>{content}</ReactMarkdown></div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon" aria-hidden="true"><Sparkles size={20} /></div>
                  <p className="empty-label">Your generated content will appear here.</p>
                  <p className="empty-helper">Fill in the topic on the left, then let LOPE-LEE take over.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <section className="history-section">
          <div className="history-header">
            <div>
              <p className="eyebrow history-eyebrow"><Clock size={14} /> HISTORY</p>
              <h2>Your recent pieces</h2>
            </div>
            {history.length > 0 ? (
              <button type="button" className="text-button" onClick={clearHistory}>Clear all</button>
            ) : null}
          </div>
          {history.length > 0 ? (
            <div className="history-list">
              {history.map((item) => (
                <article key={item.id} className="history-item">
                  <button type="button" className="history-main" onClick={() => loadHistoryItem(item)}>
                    <div className="history-item-topline">
                      <span className="history-topic">{item.topic}</span>
                    </div>
                    <div className="history-pills">
                      <span>{item.contentType}</span><span>{item.tone}</span><span>{item.platform}</span>
                    </div>
                    <p>{item.content}</p>
                  </button>
                  <div className="history-actions">
                    <span className="history-date">{formatDate(item.createdAt)}</span>
                    <button
                      type="button"
                      className="icon-button history-delete"
                      onClick={() => deleteHistoryItem(item.id)}
                      aria-label={`Delete ${item.topic}`}
                      title="Delete generation"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="history-empty"><Clock size={19} /><span>Your saved generations will appear here.</span></div>
          )}
        </section>
      </main>
    </div>
  )
}
