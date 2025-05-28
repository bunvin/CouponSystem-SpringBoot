import React, { JSX } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import User from '../../Models/User';
import UserService from '../../Services/UserService';
import ROLES from '../Constants';


function Login(): JSX.Element {

  //const navigate = useNavigate();

  const { register, watch, handleSubmit, formState, reset, setValue } = useForm<User>();


  async function send(user: User): Promise<void> {
    await UserService.login(user);
    //navigate('/task-list');
  }

  return (
    <form onSubmit={handleSubmit(send)} className="my-form">
      <div className="form-group">
        <label htmlFor="email">Email: </label>
        <input type="text" id="email" placeholder="Enter email "
          {...register("email", {
            required: { value: true, message: 'Required' },
            minLength: { value: 3, message: 'Must contain at least 3 characters' }
          })} />
        {formState.errors.email && <span className="error-message">{formState.errors.email?.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password: </label>
        <input type="password" id="password" placeholder="Enter password"
          {...register("password", {
            required: { value: true, message: 'Required' },
            minLength: { value: 5, message: 'Must contain at least 5 characters' }
          })} />
        {formState.errors.password && <span className="error-message">{formState.errors.password?.message}</span>}
      </div>

            <div className="form-group">
        <label htmlFor="userType">Role: </label>
        <input type="userType" id="userType" placeholder="Enter userType"
          {...register("userType", {
            required: { value: true, message: 'Required' },
            minLength: { value: 5, message: 'Must contain at least 5 characters' }
          })} />
        {formState.errors.password && <span className="error-message">{formState.errors.password?.message}</span>}
      </div>
      <button>Login</button>

      <p>"ADMIN - UserName: admin@admin.com password: admin"</p>
      <p>"ADMIN "</p>
      <p>"ADMIN "</p>
    </form>

    
  );
}

export default Login;