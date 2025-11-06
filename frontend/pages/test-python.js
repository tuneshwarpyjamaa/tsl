import { useState } from 'react';

export default function TestPython() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('mukesh ambani');
  const [category, setCategory] = useState('business');
  const [count, setCount] = useState(1);

  const runPythonScript = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/run-python', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          count: parseInt(count),
          category,
        }),
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Test Python Script</h1>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>Query: </label>
          <input 
            type="text" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: '300px', padding: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Category: </label>
          <input 
            type="text" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: '300px', padding: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Count: </label>
          <input 
            type="number" 
            value={count} 
            onChange={(e) => setCount(e.target.value)}
            min="1"
            style={{ width: '50px', padding: '5px' }}
          />
        </div>
        <button 
          onClick={runPythonScript}
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#0070f3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Running...' : 'Run Python Script'}
        </button>
      </div>
      
      {result && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '4px',
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace'
        }}>
          <h3>Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
