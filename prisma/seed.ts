import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create permissions
  const permissions = [
    { name: 'user:read', description: 'Can read user data' },
    { name: 'user:write', description: 'Can modify user data' },
    { name: 'user:delete', description: 'Can delete users' },
    { name: 'role:read', description: 'Can read roles' },
    { name: 'role:write', description: 'Can modify roles' },
    { name: 'role:delete', description: 'Can delete roles' },
    { name: 'permission:read', description: 'Can read permissions' },
    { name: 'permission:write', description: 'Can modify permissions' },
    { name: 'permission:delete', description: 'Can delete permissions' },
  ];

  console.log('Creating permissions...');
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission,
    });
  }

  // Create super admin role
  console.log('Creating super admin role...');
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'super_admin' },
    update: {},
    create: {
      name: 'super_admin',
      description: 'Super Administrator with all permissions',
    },
  });

  // Assign all permissions to super admin role
  console.log('Assigning permissions to super admin role...');
  const allPermissions = await prisma.permission.findMany();
  await prisma.role.update({
    where: { id: superAdminRole.id },
    data: {
      permissions: {
        connect: allPermissions.map(permission => ({ id: permission.id })),
      },
    },
  });

  // Create super admin user
  console.log('Creating super admin user...');
  const hashedPassword = await bcrypt.hash('password123', 12);
  await prisma.user.upsert({
    where: { email: 'superadmin@example.com' },
    update: {},
    create: {
      email: 'superadmin@example.com',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      isVerified: true,
      otp: null,
      otpExpiry: null,
      roles: {
        connect: { id: superAdminRole.id },
      },
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 