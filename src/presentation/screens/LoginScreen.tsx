import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import BackButton from '../components/BackButton';
import AuthSkeleton from '../components/common/AuthSkeleton';
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
  AuthLink,
  AuthWrapper
} from '../styles/AuthStyles';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsRedirecting(true);
      toast.success('Login successful!');
      setTimeout(() => {
        navigate('/events');
      }, 1000);
    } catch (err: any) {
      let errorMessage = 'Failed to log in.';
      
      // Handle specific Firebase error codes
      switch (err.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'Invalid email or password.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled.';
          break;
        default:
          errorMessage = 'Failed to log in. Please try again.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading || isRedirecting) {
    return <AuthSkeleton text={isRedirecting ? "Redirecting to events..." : "Signing in..."} />;
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
          <Title>Welcome Back</Title>
          <Form onSubmit={handleLogin}>
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
                  autoComplete="current-password"
                />
              </InputWrapper>
            </InputGroup>
            <Button type="submit" disabled={loading}>
              <FiLogIn size={20} />
              {loading ? 'Signing in...' : 'Sign In'}
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
            <Link to="/reset-password">Forgot Password?</Link>
          </AuthLink>
          <AuthLink>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </AuthLink>
        </AuthCard>
      </AuthContainer>
    </AuthWrapper>
  );
};

export default LoginScreen;