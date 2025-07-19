'use client';

import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setAnswer('');
    setIsLoading(true);

    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/love', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setAnswer(data.answer);
      } else {
        setError(data.error || 'An error occurred.');
      }
    } catch {
      setError('Failed to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>LoveBot 💖</h1>
      <p>Ask for romantic date ideas, love messages, or relationship tips!</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="prompt" className={styles.label}>
          Your Love Prompt (max 1000 characters):
        </label>
        <input
          id="prompt"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          maxLength={1000}
          placeholder="e.g., Suggest a romantic date night"
          className={styles.input}
          disabled={isLoading}
        />
        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? 'Thinking...' : 'Ask LoveBot'}
        </button>
      </form>

      {answer && (
        <div className={styles.response}>
          <h2>LoveBot Says:</h2>
          <p>{answer}</p>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <h2>Oops!</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
