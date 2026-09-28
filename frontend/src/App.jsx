import { useMemo, useState } from 'react'

const CONTENT_TYPES = ['Social Post', 'Blog Outline', 'Email', 'Ad Copy']
const TONES = ['Conversational', 'Bold', 'Professional', 'Witty']
const PLATFORMS = ['Instagram', 'LinkedIn', 'Twitter/X']

const API_URL = 'http://localhost:8000/api/generate'

function SelectorRow({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <span className="w-28 shrink-0 text-xs font-medium uppercase tracking-[0.18em] text-white/45">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = option === value
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
                selected
                  ? 'border-white/20 bg-white/15 text-white shadow-[0_0_20px_rgba(165,180,252,0.18)]'
                  : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10 hover:text-white'
              }`}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function formatContent(text) {
  return text.split('\n').map((line, index) => {
    if (!line.trim()) {
      return <div key={index} className="h-3" />
    }
    return (
      <p key={index} className="leading-7 text-white/85">
        {line}
      </p>
    )
  })
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

  const canGenerate = useMemo(() => topic.trim().length > 0 && !loading, [topic, loading])

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
      setContent(data.content || '')
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070c] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="orb absolute -left-24 top-[-8%] h-[28rem] w-[28rem] rounded-full bg-indigo-600/25 blur-[110px]" />
        <div className="orb absolute right-[-8%] top-10 h-[24rem] w-[24rem] rounded-full bg-fuchsia-500/20 blur-[120px] [animation-delay:-4s]" />
        <div className="absolute bottom-[-20%] left-1/3 h-[22rem] w-[22rem] rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_42%)]" />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="text-sm font-semibold tracking-[0.28em] text-white/70">LUMINA</div>
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-white/50 backdrop-blur-md">
          Content Studio
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-col px-6 pb-20 pt-8">
        <section className="mb-10 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-indigo-200/70">Creative generation</p>
          <h1 className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-6xl">
            AI Content Generator
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/55 sm:text-lg">
            Generate high-converting social posts, blog outlines, and ad copy in seconds
          </p>
        </section>

        <form
          onSubmit={handleGenerate}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
        >
          <label htmlFor="topic" className="mb-3 block text-sm font-medium text-white/70">
            Describe what you want to create
          </label>
          <textarea
            id="topic"
            rows={5}
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="Launch campaign for a premium skincare line targeting first-time buyers"
            className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-4 text-base text-white outline-none placeholder:text-white/30 focus:border-indigo-300/40"
          />

          <div className="mt-6 space-y-4">
            <SelectorRow
              label="Content Type"
              options={CONTENT_TYPES}
              value={contentType}
              onChange={setContentType}
            />
            <SelectorRow label="Tone" options={TONES} value={tone} onChange={setTone} />
            <SelectorRow label="Platform" options={PLATFORMS} value={platform} onChange={setPlatform} />
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={!canGenerate}
              className={`rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                loading ? 'glow-loading' : 'hover:brightness-110'
              }`}
            >
              {loading ? 'Generating...' : 'Generate Content'}
            </button>
          </div>
        </form>

        {error ? (
          <p className="mt-4 text-center text-sm text-rose-300/90">{error}</p>
        ) : null}

        {content ? (
          <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-[0_20px_80px_rgba(0,0,0,0.28)]">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-sm font-medium uppercase tracking-[0.22em] text-white/50">Preview</h2>
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
              >
                {copied ? 'Copied' : 'Copy to Clipboard'}
              </button>
            </div>
            <div className="rounded-xl border border-white/8 bg-black/25 p-5">{formatContent(content)}</div>
          </section>
        ) : null}
      </main>
    </div>
  )
}
