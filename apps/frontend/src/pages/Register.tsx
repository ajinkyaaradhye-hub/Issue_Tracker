import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Label, TextInput, Button, Card, Spinner } from 'flowbite-react';
import type { AppDispatch, RootState } from '../store';
import { registerUser } from '../features/auth/authSlice';

export default function Register() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { token, loading, error } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (token) navigate('/issues');
  }, [token, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    const result = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(result) && result.payload.success) {
      navigate('/login');
    }
  };

  return (
    <section className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <TextInput
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              required
              onChange={handleChange}
              value={formData.name}
            />
          </div>
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
            <Label htmlFor="password">Password</Label>
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
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <TextInput
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              onChange={handleChange}
              value={formData.confirmPassword}
            />
          </div>

          <Button
            type="submit"
            color="blue"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : 'Register'}
          </Button>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{' '}
          <a href="/" className="text-cyan-700 hover:underline">
            Login
          </a>
        </p>
      </Card>
    </section>
  );
}
