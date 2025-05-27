import { z } from 'zod';

// Auth Schemas
export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const verifyOTPSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    otp: z.string().length(6, 'OTP must be 6 characters'),
  }),
});

// User Schemas
export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    roleId: z.string().uuid('Invalid role ID').optional(),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID'),
  }),
  body: z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters').optional(),
    lastName: z.string().min(2, 'Last name must be at least 2 characters').optional(),
    roleId: z.string().uuid('Invalid role ID').optional(),
  }),
});

// Role Schemas
export const createRoleSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Role name must be at least 2 characters'),
    description: z.string().optional(),
    permissions: z.array(z.string().uuid('Invalid permission ID')).optional(),
  }),
});

export const updateRoleSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid role ID'),
  }),
  body: z.object({
    name: z.string().min(2, 'Role name must be at least 2 characters').optional(),
    description: z.string().optional(),
    permissions: z.array(z.string().uuid('Invalid permission ID')).optional(),
  }),
});

// Permission Schemas
export const createPermissionSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Permission name must be at least 2 characters'),
    description: z.string().optional(),
  }),
});

export const updatePermissionSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid permission ID'),
  }),
  body: z.object({
    name: z.string().min(2, 'Permission name must be at least 2 characters').optional(),
    description: z.string().optional(),
  }),
}); 