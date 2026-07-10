import './styles.css';
import { buildRetrievalOnlyAnswer, retrieve, shouldRefuse } from '../shared/retrieval';
import type { ChatResponse, Citation } from './types';

async function localAnswer(question: string, reason = 'local_demo'): Promise<ChatResponse> {
  const { corpus } = await import('./generated/corpus');
  const hits = retrieve(question, corpus, { limit: 4 });
  const refusal = shouldRefuse(hits);
  const citations: Citation[] = refusal ? [] : hits.slice(0, 3).map((hit) => ({
    id: hit.id,
    title: `${hit.title} · ${hit.heading}`,
    url: hit.url,
    excerpt: hit.text.slice(0, 180),
  }));
  return {
    answer: buildRetrievalOnlyAnswer(hits, reason),
    citations,
    mode: refusal ? 'refusal' : 'retrieval-only',
    reason,
  };
}

function appendTextParagraphs(container: HTMLElement, answer: string): void {
  for (const value of answer.split('\n').filter(Boolean)) {
    const paragraph = document.createElement('p');
    paragraph.textContent = value;
    container.append(paragraph);
  }
}

function renderResponse(region: HTMLElement, response: ChatResponse): void {
  region.replaceChildren();
  const card = document.createElement('div');
  card.className = 'answer-card';
  const mode = document.createElement('div');
  mode.className = 'answer-mode';
  mode.textContent = response.mode === 'live'
    ? 'Claude answer · citations validated'
    : response.mode === 'refusal'
      ? 'Correctly refused'
      : 'Retrieval-only degraded mode';
  card.append(mode);
  appendTextParagraphs(card, response.answer);

  if (response.citations.length > 0) {
    const list = document.createElement('ol');
    list.className = 'citation-list';
    for (const citation of response.citations) {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = citation.url;
      link.textContent = citation.title;
      const excerpt = document.createElement('span');
      excerpt.textContent = citation.excerpt;
      item.append(link, excerpt);
      list.append(item);
    }
    card.append(list);
  }
  region.append(card);
}

for (const panel of document.querySelectorAll<HTMLElement>('[data-ask-portfolio]')) {
  const form = panel.querySelector<HTMLFormElement>('[data-ask-form]');
  const input = panel.querySelector<HTMLInputElement>('[data-ask-input]');
  const submit = panel.querySelector<HTMLButtonElement>('[data-ask-submit]');
  const region = panel.querySelector<HTMLElement>('[data-answer-region]');
  if (!form || !input || !submit || !region) continue;
  const endpoint = panel.dataset.apiUrl?.replace(/\/$/, '') ?? '';

  input.addEventListener('input', () => { submit.disabled = input.value.trim().length < 3; });

  const ask = async (question: string): Promise<void> => {
    const trimmed = question.trim();
    if (trimmed.length < 3 || region.getAttribute('aria-busy') === 'true') return;
    input.value = trimmed;
    submit.disabled = true;
    submit.textContent = 'Retrieving…';
    region.setAttribute('aria-busy', 'true');
    region.textContent = 'Retrieving bounded evidence…';
    try {
      if (!endpoint) {
        renderResponse(region, await localAnswer(trimmed));
      } else {
        try {
          const result = await fetch(`${endpoint}/ask`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ question: trimmed }),
          });
          const payload = await result.json() as ChatResponse & { error?: string };
          if (!result.ok) throw new Error(payload.error || 'Request failed');
          renderResponse(region, payload);
        } catch {
          const fallback = await localAnswer(trimmed, 'network_fallback');
          fallback.answer = fallback.answer.replace('temporarily unavailable', 'could not be reached');
          renderResponse(region, fallback);
        }
      }
    } finally {
      region.setAttribute('aria-busy', 'false');
      submit.textContent = 'Ask';
      submit.disabled = input.value.trim().length < 3;
    }
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    void ask(input.value);
  });
  for (const button of panel.querySelectorAll<HTMLButtonElement>('[data-question]')) {
    button.addEventListener('click', () => void ask(button.dataset.question ?? ''));
  }
}
