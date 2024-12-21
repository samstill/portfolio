import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/forms.css';
import React from 'react';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    dateOfBirth: '',
    gender: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { email, password, name, dateOfBirth, gender } = formData;
      
      if (!email || !password || !name || !dateOfBirth || !gender) {
        throw new Error('Please fill in all fields');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const age = calculateAge(dateOfBirth);
      
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email,
        name,
        age,
        gender,
        dateOfBirth: new Date(dateOfBirth)
      });

      navigate('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join our community today</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              name="name"
              type="text"
              className="form-input"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              name="email"
              type="email"
              className="form-input"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              name="password"
              type="password"
              className="form-input"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>
          <div className="form-group">
            <input
              name="dateOfBirth"
              type="date"
              className="form-input"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <select 
              name="gender"
              className="form-input"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <Link to="/login" className="auth-link">
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
