// Python API endpoints removed to eliminate memory leaks
export default function handler(req, res) {
  res.status(410).json({
    error: 'Python API endpoints have been removed',
    message: 'This endpoint no longer exists to prevent memory leaks',
    alternative: 'Use the main backend API at /api/posts/generate-article instead'
  });
}
