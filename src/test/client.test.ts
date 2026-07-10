import { fireEvent, waitFor } from '@testing-library/dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('progressive chat client', () => {
  beforeEach(() => {
    vi.resetModules();
    document.body.innerHTML = `
      <section data-ask-portfolio data-api-url="">
        <button type="button" data-question="Has Alex built agentic systems?">Example</button>
        <form data-ask-form>
          <input data-ask-input />
          <button type="submit" data-ask-submit disabled>Ask</button>
        </form>
        <div data-answer-region aria-busy="false"></div>
      </section>`;
  });

  it('enables valid questions and renders the lazy retrieval fallback', async () => {
    await import('../client');
    const input = document.querySelector<HTMLInputElement>('[data-ask-input]')!;
    const submit = document.querySelector<HTMLButtonElement>('[data-ask-submit]')!;
    input.value = 'Has Alex built agentic systems?';
    fireEvent.input(input);
    expect(submit.disabled).toBe(false);
    fireEvent.submit(document.querySelector('[data-ask-form]')!);
    await waitFor(() => expect(document.querySelectorAll('.citation-list li').length).toBeGreaterThan(0));
    expect(document.querySelector('.answer-mode')).toHaveTextContent('Retrieval-only degraded mode');
  });
});
