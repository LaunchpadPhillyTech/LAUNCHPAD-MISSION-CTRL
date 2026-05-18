'use client';

import { useState } from 'react';
import { api } from '@/app/lib/api';

// Custom hook demonstrating STATE + API INTEGRATION
// This hook shows: variables created, updated, and used

export const useAIEmailGeneration = () => {
  // VARIABLE 1: Email content state
  const [email, setEmail] = useState<string>('');

  // VARIABLE 2: Loading state
  const [loading, setLoading] = useState<boolean>(false);

  // VARIABLE 3: Error state
  const [error, setError] = useState<string>('');

  // FUNCTION WITHOUT PARAMETERS - Gets base endpoint
  const getApiUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  };

  // FUNCTION WITH PARAMETERS - Generates email from partner data
  // Parameters: partnerId (string), onSuccess callback (optional)
  const generateEmail = async (
    partnerId: string,
    onSuccess?: (emailContent: string) => void
  ): Promise<string | null> => {
    setLoading(true);
    setError('');
    try {
      // Use the shared API utility, which handles sanitization
      const data = await api.generateEmail({ partnerId });
      if (!data || !data.email) throw new Error('Generation failed');
      setEmail(data.email);
      if (onSuccess) onSuccess(data.email);
      return data.email;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // FUNCTION WITH PARAMETERS - Regenerates email (retry)
  const regenerateEmail = async (partnerId: string): Promise<string | null> => {
    // UPDATE: Reset previous email
    setEmail('');
    // Reuse generateEmail function
    return generateEmail(partnerId);
  };

  // FUNCTION WITHOUT PARAMETERS - Clears generated email
  const clearEmail = () => {
    // UPDATE: Clear the email
    setEmail('');
    // UPDATE: Clear errors
    setError('');
  };

  // RETURN: Object with state variables and functions that USE them
  return {
    // State variables (USED by component)
    email, // USED: Display in UI
    loading, // USED: Show spinner
    error, // USED: Show error message

    // Functions that UPDATE and USE state
    generateEmail, // USED: Called on button click
    regenerateEmail, // USED: Called on retry
    clearEmail // USED: Called on dismiss
  };
};
