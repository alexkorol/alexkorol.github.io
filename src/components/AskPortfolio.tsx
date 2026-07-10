import { FormEvent, useId, useState } from 'react';
import { corpus } from '../generated/content';
import { buildRetrievalOnlyAnswer, retrieve, shouldRefuse } from '../../shared/retrieval';
import type { ChatResponse, Citation } from '../types';

const suggestions = [
  'Has Alex built agentic systems?',
  'How does Alex evaluate RAG?',
  'What happens when an LLM call fails?',
];

function configuredApiUrl(): string {
  if (typeof window === 'undefined') return process.env.VITE_PORTFOLIO_API_URL ?? '';
  return import.meta.env.VITE_PORTFOLIO_API_URL ?? '';
}

function localAnswer(question: string): ChatResponse {
  const hits = retrieve(question, corpus, { limit: 4 });
  const refusal = shouldRefuse(hits);
  const citations: Citation[] = refusal ? [] : hits.slice(0, 3).map((hit) => ({
    id: hit.id,
    title: `${hit.title} · ${hit.heading}`,
    url: hit.url,
    excerpt: hit.text.slice(0, 180),
  }));
  return {
    answer: refusal
      ? buildRetrievalOnlyAnswer(hits, 'local_demo')
      : buildRetrievalOnlyAnswer(hits, 'local_demo'),
    citations,
    mode: refusal ? 'refusal' : 'retrieval-only',
    reason: 'local_demo',
  };
}

export function AskPortfolio(): JSX.Element {
  const inputId = useId();
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const apiUrl = configuredApiUrl();

  async function ask(nextQuestion = question): Promise<void> {
    const trimmed = nextQuestion.trim();
    if (trimmed.length < 3 || status === 'loading') return;
    setQuestion(trimmed);
    setStatus('loading');
    setResponse(null);

    if (!apiUrl) {
      setResponse(localAnswer(trimmed));
      setStatus('idle');
      return;
    }

    try {
      const result = await fetch(`${apiUrl.replace(/\/$/, '')}/ask`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question: trimmed }),
      });
      const payload = await result.json() as ChatResponse & { error?: string };
      if (!result.ok) throw new Error(payload.error || 'Request failed');
      setResponse(payload);
      setStatus('idle');
    } catch {
      const fallback = localAnswer(trimmed);
      fallback.reason = 'network_fallback';
      fallback.answer = fallback.answer.replace('the deployed model endpoint is not configured in this build', 'the live endpoint could not be reached');
      setResponse(fallback);
      setStatus('error');
    }
  }

  function onSubmit(event: FormEvent): void {
    event.preventDefault();
    void ask();
  }

  return (
    <section className="ask-panel" id="ask" aria-labelledby="ask-title">
      <div className="ask-heading-row">
        <div>
          <p className="eyebrow">Flagship · cited portfolio RAG</p>
          <h2 id="ask-title">Ask my portfolio</h2>
        </div>
        <span className="status-dot"><span aria-hidden="true" /> {apiUrl ? 'Claude via Worker' : 'Retrieval-only build'}</span>
      </div>
      <p className="ask-intro">Answers are constrained to projects, engineering notes, and the resume. Every supported claim links to its source.</p>
      <div className="suggestion-row" aria-label="Example questions">
        {suggestions.map((suggestion) => (
          <button key={suggestion} type="button" onClick={() => void ask(suggestion)}>{suggestion}</button>
        ))}
      </div>
      <form className="ask-form" onSubmit={onSubmit}>
        <label className="sr-only" htmlFor={inputId}>Ask a question about Alex's engineering work</label>
        <input
          id={inputId}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          minLength={3}
          maxLength={400}
          placeholder="Has Alex built agentic systems?"
        />
        <button type="submit" disabled={status === 'loading' || question.trim().length < 3}>
          {status === 'loading' ? 'Retrieving…' : 'Ask'}
        </button>
      </form>
      <div className="answer-region" aria-live="polite" aria-busy={status === 'loading'}>
        {status === 'loading' && <p className="answer-placeholder">Retrieving bounded evidence…</p>}
        {response && (
          <div className="answer-card">
            <div className="answer-mode">
              {response.mode === 'live' ? 'Claude answer · citations validated' : response.mode === 'refusal' ? 'Correctly refused' : 'Retrieval-only degraded mode'}
            </div>
            {response.answer.split('\n').map((paragraph, index) => paragraph ? <p key={`${paragraph.slice(0, 20)}-${index}`}>{paragraph}</p> : null)}
            {response.citations.length > 0 && (
              <ol className="citation-list">
                {response.citations.map((citation) => (
                  <li key={citation.id}>
                    <a href={citation.url}>{citation.title}</a>
                    <span>{citation.excerpt}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </div>
      <div className="ask-footer">
        <a href="/how-it-works/">Architecture, prompt, cost, and evals →</a>
        <a href="https://github.com/alexkorol/alexkorol.github.io" target="_blank" rel="noreferrer">Eval harness and Worker source ↗</a>
      </div>
    </section>
  );
}
