import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../atoms/authAtoms';
import axios from 'axios';

function LoginPage() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_API_URL}auth/login`, {
        email: formData.email,
        password: formData.password
      });

      login(response.data);
         
      // Redirect to recipes page after successful login
      setLocation('/recipes');
    } catch (err) {
        console.log(err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-center">Login</h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">Login</button>
                </div>
              </form>
            </div>
            <div className="card-footer text-center">
              Don't have an account? <a href="/register">Register</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;