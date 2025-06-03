import React, { JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import User from '../../Models/User';
import UserService from '../../Services/UserService';
import ROLES from '../Constants';

function Login(): JSX.Element {
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm<User>();

  async function send(user: User): Promise<void> {
    try {
      await UserService.login(user);
      navigate('/task-list');
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login error (show message to user, etc.)
    }
  }

  return (
    <form onSubmit={handleSubmit(send)} className="my-form">
      <div className="form-group">
        <label htmlFor="email">Email: </label>
        <input 
          type="email" 
          id="email" 
          placeholder="Enter email"
          {...register("email", {
            required: { value: true, message: 'Email is required' },
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })} 
        />
        {formState.errors.email && (
          <span className="error-message">{formState.errors.email.message}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password: </label>
        <input 
          type="password" 
          id="password" 
          placeholder="Enter password"
          {...register("password", {
            required: { value: true, message: 'Password is required' },
            minLength: { value: 5, message: 'Password must be at least 5 characters' }
          })} 
        />
        {formState.errors.password && (
          <span className="error-message">{formState.errors.password.message}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="userType">Role: </label>
        <select 
          id="userType"
          {...register("userType", {
            required: { value: true, message: 'Role is required' }
          })}
        >
          <option value="">Select a role</option>
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        {formState.errors.userType && (
          <span className="error-message">{formState.errors.userType.message}</span>
        )}
      </div>

      <button type="submit" disabled={formState.isSubmitting}>
        {formState.isSubmitting ? 'Logging in...' : 'Login'}
      </button>

      <div className="demo-credentials">
        <p><strong>Credentials:</strong></p>
        <p>Admin - Email: admin@admin.com, Password: admin, Role: ADMIN</p>
      </div>
    </form>
  );
}

export default Login;