import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FiMail, FiLock, FiUserPlus } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import BackButton from '../components/BackButton';
import AuthSkeleton from '../components/common/AuthSkeleton';
import {
  AuthWrapper,
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

const SignUpScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();

  const validatePassword = () => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate password
    const passwordError = validatePassword();
    if (passwordError) {
      setError(passwordError);
      toast.error(passwordError);
      return;
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setIsRedirecting(true);
      toast.success('Account created successfully!');
      setTimeout(() => {
        navigate('/events');
      }, 1000);
    } catch (err: any) {
      let errorMessage = 'Failed to create account.';
      
      // Handle specific Firebase error codes
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password accounts are not enabled. Please contact support.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Please choose a stronger password.';
          break;
        default:
          errorMessage = 'Failed to create account. Please try again.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading || isRedirecting) {
    return <AuthSkeleton text={isRedirecting ? "Setting up your account..." : "Creating your account..."} />;
  }

  return (
    <AuthWrapper>
      <Toaster position="top-right" />
      <AuthContainer>
        <BackButton />
        <AuthCard
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Title>Create Account</Title>
          <Form onSubmit={handleSignUp}>
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
                  autoComplete="email"
                />
              </InputWrapper>
            </InputGroup>
            <InputGroup>
              <Label htmlFor="password">Password</Label>
              <InputWrapper>
                <Icon>
                  <FiLock size={20} />
                </Icon>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </InputWrapper>
            </InputGroup>
            <InputGroup>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <InputWrapper>
                <Icon>
                  <FiLock size={20} />
                </Icon>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </InputWrapper>
            </InputGroup>
            <Button type="submit" disabled={loading}>
              <FiUserPlus size={20} />
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
            <AnimatePresence mode="wait">
              {error && (
                <ErrorMessage
                  as={motion.div}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {error}
                </ErrorMessage>
              )}
            </AnimatePresence>
          </Form>
          <AuthLink>
            Already have an account? <Link to="/login">Sign In</Link>
          </AuthLink>
        </AuthCard>
      </AuthContainer>
    </AuthWrapper>
  );
};

export default SignUpScreen;