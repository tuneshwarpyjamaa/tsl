import { render, screen } from '@testing-library/react';
import Navbar from '../Navbar';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
    };
  },
}));

describe('Navbar', () => {
  it('renders the navbar', () => {
    render(<Navbar />);
    expect(screen.getByText('The Mandate Wire')).toBeInTheDocument();
  });
});