import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
  it('renders the footer', () => {
    render(<Footer />);

    // Check for the main heading
    const heading = screen.getByRole('link', { name: /the mandate wire/i });
    expect(heading).toBeInTheDocument();

    // Check for the copyright notice
    const copyright = screen.getByText(/copyright/i);
    expect(copyright).toBeInTheDocument();
  });
});
