import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { logToFile } from '../utils/logger';

const prisma = new PrismaClient();

export const createRole = async (data: {
  name: string;
  description: string;
  permissions: string[];
}) => {
  const { name, description, permissions } = data;

  const existingRole = await prisma.role.findUnique({
    where: { name },
  });

  if (existingRole) {
    logToFile('roleService', `Role creation failed: Name already exists (${name})`);
    throw new AppError('Role already exists', 400);
  }

  const role = await prisma.role.create({
    data: {
      name,
      description,
      permissions: {
        connect: permissions.map((id) => ({ id })),
      },
    },
    include: {
      permissions: true,
    },
  });

  logToFile('roleService', `Role created successfully (ID: ${role.id})`);
  return role;
};

export const getAllRoles = async () => {
  try {
    const roles = await prisma.role.findMany({
      include: {
        permissions: true,
      },
    });

    logToFile('roleService', `Retrieved ${roles.length} roles`);
    return roles;
  } catch (error: any) {
    logToFile('roleService', 'Error retrieving roles', error);
    throw error;
  }
};

export const getRoleById = async (id: string) => {
  const role = await prisma.role.findUnique({
    where: { id },
    include: {
      permissions: true,
    },
  });

  if (!role) {
    throw new AppError('Role not found', 404);
  }

  return role;
};

export const updateRole = async (
  id: string,
  data: {
    name: string;
    description: string;
    permissions: string[];
  }
) => {
  const { name, description, permissions } = data;

  const role = await prisma.role.findUnique({
    where: { id },
  });

  if (!role) {
    logToFile('roleService', `Role update failed: Role not found (ID: ${id})`);
    throw new AppError('Role not found', 404);
  }

  const updatedRole = await prisma.role.update({
    where: { id },
    data: {
      name,
      description,
      permissions: {
        set: permissions.map((id) => ({ id })),
      },
    },
    include: {
      permissions: true,
    },
  });

  logToFile('roleService', `Role updated successfully (ID: ${id})`);
  return updatedRole;
};

export const deleteRole = async (id: string) => {
  try {
    const role = await prisma.role.findUnique({
      where: { id },
    });

    if (!role) {
      logToFile('roleService', `Role deletion failed: Role not found (ID: ${id})`);
      throw new AppError('Role not found', 404);
    }

    await prisma.role.delete({
      where: { id },
    });

    logToFile('roleService', `Role deleted successfully (ID: ${id})`);
    return true;
  } catch (error: any) {
    logToFile('roleService', 'Role deletion error', error);
    throw error;
  }
}; 