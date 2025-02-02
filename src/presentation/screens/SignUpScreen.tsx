import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FiMail, FiLock, FiUserPlus } from 'react-icons/fi';
import BackButton from '../components/BackButton';
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
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/events');
    } catch (err) {
      setError('Failed to create an account. Please try again.');
    }
  };

  return (
    <AuthWrapper>
      <AuthContainer>
        <BackButton />
        <AuthCard>
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
              <FiUserPlus size={20} />
              Sign Up
            </Button>
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </Form>
          <AuthLink>
            Already have an account?<Link to="/login">Sign In</Link>
          </AuthLink>
        </AuthCard>
      </AuthContainer>
    </AuthWrapper>
  );
};

export default SignUpScreen;