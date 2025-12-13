import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AuthLayout from '@/components/layouts/AuthLayout';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string>('');
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Reset form when coming from logout or on mount
  useEffect(() => {
    reset({
      email: '',
      password: '',
    });
    setError('');
  }, [reset]);

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      const response = await authService.login(data);
      if (response.status === 'success' && response.data) {
        login(response.data.user, response.data.accessToken);
        // Redirect based on user role
        if (response.data.user.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (error: any) {
      // Get error message from API response
      let errorMessage = 'فشل تسجيل الدخول. يرجى التحقق من البريد الإلكتروني وكلمة المرور.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      console.error('Login failed', error);
    }
  };

  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Enter your email to sign in to your account"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800 rounded-lg shadow-sm">
            <p className="text-sm font-medium text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}
        
        <div className="space-y-2">
          <Input 
            type="email" 
            placeholder="name@example.com" 
            {...register('email')} 
            className="h-11"
            autoComplete="off"
            key="login-email"
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Input 
            type="password" 
            placeholder="Password" 
            {...register('password')} 
            className="h-11"
            autoComplete="new-password"
            key="login-password"
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full h-11 text-lg" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link to="/register" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
