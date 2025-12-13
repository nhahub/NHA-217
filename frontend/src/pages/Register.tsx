import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '@/components/layouts/AuthLayout';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterForm = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  // Reset form on mount
  useEffect(() => {
    reset({
      name: '',
      email: '',
      password: '',
    });
    setError('');
    setSuccess(false);
  }, [reset]);

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError('');
      setSuccess(false);
      await authService.register({ name: data.name, email: data.email, password: data.password });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.';
      setError(errorMessage);
      console.error('Registration failed', error);
    }
  };

  return (
    <AuthLayout 
      title="Create an account" 
      subtitle="Enter your details below to create your account"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800 rounded-lg shadow-sm">
            <p className="text-sm font-medium text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400">Account created successfully! Redirecting to login...</p>
          </div>
        )}
        
        <div className="space-y-2">
          <Input 
            placeholder="Full Name" 
            {...register('name')} 
            className="h-11"
            autoComplete="off"
            key="register-name"
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Input 
            type="email" 
            placeholder="name@example.com" 
            {...register('email')} 
            className="h-11"
            autoComplete="off"
            key="register-email"
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
            key="register-password"
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full h-11 text-lg" disabled={isSubmitting || success}>
          {isSubmitting ? 'Creating account...' : success ? 'Account Created!' : 'Create Account'}
        </Button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
