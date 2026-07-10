import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('portfolio routes', () => {
  it('puts the flagship and evidence claim above the fold', () => {
    render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /I build and evaluate LLM-powered systems/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Ask my portfolio' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Resume PDF/i })).toHaveAttribute('href', '/alexei-korol-resume.pdf');
  });

  it('renders a crawlable case study route', () => {
    render(<MemoryRouter initialEntries={['/projects/songcraft-rag/']}><App /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1, name: 'SongCraft RAG' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'System path' })).toBeInTheDocument();
    expect(screen.getByText('0.952')).toBeInTheDocument();
  });
});
