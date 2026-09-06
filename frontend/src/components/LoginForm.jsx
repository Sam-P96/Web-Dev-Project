import React from 'react'
import Navbar from './Navbar'

const LoginForm = () => {
const handleSubmit=(e)=>{

    e.preventDefault()

    const formData= new FormData(e.currentTarget)

    const values = Object.fromEntries(formData.entries())

    console.log(values)
}

  return (
    <div>
        <main className="login-page">
  <div className="login-card">
    <div className="login-heading">
      <p className="section-label">WELCOME BACK</p>
      <h1>Login to AutoTori</h1>
      <p>Sign in to manage your cars and account.</p>
    </div>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          required=""
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          required=""
        />
      </div>
      <div className="login-options">
        <label className="remember-me">
          <input type="checkbox" name="remember" />
          Remember me
        </label>
        <a href="#">Forgot password?</a>
      </div>
      <button type="submit" className="login-submit">
        Login
      </button>
    </form>
    <div className="login-divider">OR</div>
    <div className="create-account">
      Don't have an account?
      <a href="register.html">Create Account</a>
    </div>
  </div>
</main>
</div>
  )
}
export default LoginForm;