const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const path = require('path');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, count = 1, category = 'news' } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    // Get the absolute path to the Python script
    const scriptPath = path.join(process.cwd(), '..', 'article_script.py');
    
    // Execute the Python script
    const { stdout, stderr } = await execAsync(
      `python "${scriptPath}" "${query}" --count ${count} --category "${category}"`,
      { 
        maxBuffer: 1024 * 1024 * 5, // 5MB buffer
        cwd: path.join(process.cwd(), '..') // Run from project root
      }
    );

    if (stderr) {
      console.error('Python script stderr:', stderr);
    }

    // Parse the output (assuming it's JSON)
    const result = JSON.parse(stdout);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error executing Python script:', error);
    res.status(500).json({
      error: 'Failed to generate article',
      details: error.message,
      stderr: error.stderr,
      stdout: error.stdout
    });
  }
}
