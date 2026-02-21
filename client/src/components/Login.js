import React, { useMemo, useState } from 'react';
import axios from 'axios';

export default function Login({ setIsLogin }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [user, setUser] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const isRegister = mode === 'register';

  const canSubmit = useMemo(() => {
    if (!user.email || !user.password) return false;
    if (isRegister && !user.name) return false;
    return true;
  }, [user, isRegister]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    setErr('');
  };

  const registerSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/users/register', {
        username: user.name,
        email: user.email,
        password: user.password,
      });
      // Backend often returns msg; show it and switch to login
      setErr(res?.data?.msg || 'Registered successfully. Please log in.');
      setMode('login');
      setUser({ name: '', email: user.email, password: '' });
    } catch (error) {
      const msg = error?.response?.data?.msg || 'Registration failed.';
      setErr(msg);
    }
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/users/login', {
        email: user.email,
        password: user.password,
      });
      localStorage.setItem('tokenStore', res.data.token);
      setUser({ name: '', email: '', password: '' });
      setIsLogin(true);
    } catch (error) {
      const msg = error?.response?.data?.msg || 'Login failed.';
      setErr(msg);
    }
  };

  return (
    <section className="auth-shell">
      <div className="auth-card" role="dialog" aria-label="Authentication">
        <div className="auth-brand">
          <div className="auth-logo">🗒️</div>
          <div>
            <h1 className="auth-title">Sticky Notes</h1>
            <p className="auth-subtitle">Save quick thoughts. Access them anywhere.</p>
          </div>
        </div>

        <div className="auth-tabs" role="tablist" aria-label="Login or register">
          <button
            type="button"
            className={mode === 'login' ? 'tab active' : 'tab'}
            onClick={() => {
              setMode('login');
              setErr('');
            }}
            role="tab"
            aria-selected={mode === 'login'}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'tab active' : 'tab'}
            onClick={() => {
              setMode('register');
              setErr('');
            }}
            role="tab"
            aria-selected={mode === 'register'}
          >
            Register
          </button>
        </div>

        {err ? (
          <div className="auth-alert" role="alert">
            {err}
          </div>
        ) : null}

        <form className="auth-form" onSubmit={isRegister ? registerSubmit : loginSubmit} autoComplete="on">
          {isRegister ? (
            <div className="field">
              <label htmlFor="register-name">Full Name</label>
              <input
                type="text"
                name="name"
                id="register-name"
                placeholder="Your name"
                required
                value={user.name}
                onChange={onChangeInput}
              />
            </div>
          ) : null}

          <div className="field">
            <label htmlFor={isRegister ? 'register-email' : 'login-email'}>Email</label>
            <input
              type="email"
              name="email"
              id={isRegister ? 'register-email' : 'login-email'}
              placeholder="you@example.com"
              required
              value={user.email}
              onChange={onChangeInput}
              autoComplete="email"
            />
          </div>

          <div className="field">
            <label htmlFor={isRegister ? 'register-password' : 'login-password'}>Password</label>
            <input
              type="password"
              name="password"
              id={isRegister ? 'register-password' : 'login-password'}
              placeholder="••••••••"
              required
              value={user.password}
              onChange={onChangeInput}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
            />
          </div>

          <button className="btn primary" type="submit" disabled={!canSubmit}>
            {isRegister ? 'Create account' : 'Sign in'}
          </button>

          <p className="auth-footnote">
            {isRegister ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  className="linklike"
                  onClick={() => {
                    setMode('login');
                    setErr('');
                  }}
                >
                  Login
                </button>
              </>
            ) : (
              <>
                New here?{' '}
                <button
                  type="button"
                  className="linklike"
                  onClick={() => {
                    setMode('register');
                    setErr('');
                  }}
                >
                  Create an account
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </section>
  );
}
