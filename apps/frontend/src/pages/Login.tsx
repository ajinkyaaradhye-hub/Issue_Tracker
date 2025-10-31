import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Label, TextInput, Button, Card, Spinner } from 'flowbite-react';
import type { AppDispatch, RootState } from '../store';
import { loginUser } from '../features/auth/authSlice';

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { token, loading, error } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState({ email: '', password: '' });

  useEffect(() => {
    if (token) navigate('/issues');
  }, [token, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <section className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <TextInput
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              onChange={handleChange}
              value={formData.email}
            />
          </div>
          <div>
            <Label htmlFor="password">Email</Label>
            <TextInput
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              onChange={handleChange}
              value={formData.password}
            />
          </div>
          <Button
            type="submit"
            color="blue"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : 'Log In'}
          </Button>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
        <p className="text-center text-sm mt-4">
          Don’t have an account?{' '}
          <a href="/register" className="text-cyan-700 hover:underline">
            Register
          </a>
        </p>
      </Card>
    </section>
  );
}
