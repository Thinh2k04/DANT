import { useState } from 'react';
import { sendOrderConfirmationEmail } from '../EmailOrder';

export const useEmail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendEmail = async (emailData) => {
    try {
      setLoading(true);
      setError(null);
      await sendOrderConfirmationEmail(emailData);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendEmail,
    loading,
    error
  };
};