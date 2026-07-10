const suggestions = [
  'Has Alex built agentic systems?',
  'How does Alex evaluate RAG?',
  'What happens when an LLM call fails?',
];

export function AskPortfolio(): JSX.Element {
  const apiUrl = process.env.VITE_PORTFOLIO_API_URL ?? '';
  return (
    <section className="ask-panel" id="ask" aria-labelledby="ask-title" data-ask-portfolio data-api-url={apiUrl}>
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
          <button key={suggestion} type="button" data-question={suggestion}>{suggestion}</button>
        ))}
      </div>
      <form className="ask-form" data-ask-form>
        <label className="sr-only" htmlFor="portfolio-question">Ask a question about Alex's engineering work</label>
        <input
          id="portfolio-question"
          name="question"
          minLength={3}
          maxLength={400}
          placeholder="Has Alex built agentic systems?"
          data-ask-input
        />
        <button type="submit" disabled data-ask-submit>Ask</button>
      </form>
      <div className="answer-region" aria-live="polite" aria-busy="false" data-answer-region />
      <div className="ask-footer">
        <a href="/how-it-works/">Architecture, prompt, cost, and evals →</a>
        <a href="https://github.com/alexkorol/alexkorol.github.io" target="_blank" rel="noreferrer">Eval harness and Worker source ↗</a>
      </div>
    </section>
  );
}
