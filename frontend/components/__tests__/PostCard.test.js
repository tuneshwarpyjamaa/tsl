import { render, screen } from '@testing-library/react';
import PostCard from '../PostCard';

describe('PostCard', () => {
  const post = {
    title: 'Test Post',
    slug: 'test-post',
    content: 'This is a test post.',
    author: 'Test Author',
    createdAt: new Date().toISOString(),
  };

  it('renders the postcard', () => {
    render(<PostCard post={post} />);
    expect(screen.getByText('Test Post')).toBeInTheDocument();
  });
});