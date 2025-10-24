import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('gsap', () => ({
  gsap: {
    registerPlugin: jest.fn(),
    set: jest.fn(),
    to: jest.fn(() => ({
      kill: jest.fn(),
      scrollTrigger: { kill: jest.fn() }
    }))
  }
}));

jest.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {}
}));

import App from './App';

describe('App navigation', () => {
  test('renders primary navigation items', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Projects/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /AI Art/i })).toBeInTheDocument();
  });
});
