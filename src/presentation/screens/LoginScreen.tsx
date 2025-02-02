import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import BackButton from '../components/BackButton';
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
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/events');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
    }
  };

  return (
    <AuthWrapper>
      <AuthContainer>
        <BackButton />
        <AuthCard>
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
                />
              </InputWrapper>
            </InputGroup>
            <Button type="submit">
              <FiLogIn size={20} />
              Sign In
            </Button>
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </Form>
          <AuthLink>
            Don't have an account?<Link to="/signup">Sign Up</Link>
          </AuthLink>
        </AuthCard>
      </AuthContainer>
    </AuthWrapper>
  );
};

export default LoginScreen;