import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from "../../firebase";
import { sendPasswordResetEmail } from 'firebase/auth';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import BackButton from '../components/BackButton';
import AuthSkeleton from '../components/common/AuthSkeleton';
import { toast } from 'react-hot-toast';
import {
  AuthContainer,
  AuthCard,
  Title,
  Form,
  InputGroup,
  InputWrapper,
  Label,
  Input,
  Icon,
  Button,
  ErrorMessage,
  AuthLink
} from '../styles/AuthStyles';

const ResetPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      toast.success('Password reset email sent! Please check your inbox.');
    } catch (err: any) {
      let errorMessage = 'Failed to reset password.';
      
      // Handle specific Firebase error codes
      switch (err.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later.';
          break;
        default:
          errorMessage = 'Failed to reset password. Please try again.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <AuthSkeleton text="Sending reset instructions..." />;
  }

  return (
    <AuthContainer>
      <BackButton />
      <AuthCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Title>{success ? 'Check Your Email' : 'Reset Password'}</Title>
        {!success ? (
          <Form onSubmit={handleResetPassword}>
            <InputGroup>
              <Label htmlFor="email">Email Address</Label>
              <InputWrapper>
                <Icon>
                  <FiMail size={20} />
                </Icon>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputWrapper>
            </InputGroup>
            <Button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Reset Password'}
            </Button>
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </Form>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p>We've sent password reset instructions to your email.</p>
            <Button onClick={() => navigate('/login')} style={{ marginTop: '20px' }}>
              <FiArrowLeft size={20} />
              Back to Login
            </Button>
          </div>
        )}
        <AuthLink>
          Remember your password? <Link to="/login">Sign In</Link>
        </AuthLink>
      </AuthCard>
    </AuthContainer>
  );
};

export default ResetPasswordScreen; 