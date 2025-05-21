import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { logToFile } from '../utils/logger';

const prisma = new PrismaClient();

export const createRole = async (data: {
  name: string;
  description?: string;
  permissions?: string[];
}) => {
  try {
    const { name, description, permissions = [] } = data;

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
        permissions: permissions.length > 0 ? {
          connect: permissions.map((id) => ({ id })),
        } : undefined,
      },
      include: {
        permissions: true,
      },
    });

    logToFile('roleService', `Role created successfully (ID: ${role.id})`);
    return role;
  } catch (error) {
    logToFile('roleService', 'Role creation error', error);
    throw error;
  }
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
    name?: string;
    description?: string;
    permissions?: string[];
  }
) => {
  try {
    const { name, description, permissions } = data;

    const role = await prisma.role.findUnique({
      where: { id },
    });

    if (!role) {
      logToFile('roleService', `Role update failed: Role not found (ID: ${id})`);
      throw new AppError('Role not found', 404);
    }

    // Check if new name already exists for a different role
    if (name && name !== role.name) {
      const existingRole = await prisma.role.findUnique({
        where: { name },
      });
      if (existingRole) {
        throw new AppError('Role name already exists', 400);
      }
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (permissions) {
      updateData.permissions = {
        set: permissions.map((id) => ({ id })),
      };
    }

    const updatedRole = await prisma.role.update({
      where: { id },
      data: updateData,
      include: {
        permissions: true,
      },
    });

    logToFile('roleService', `Role updated successfully (ID: ${id})`);
    return updatedRole;
  } catch (error) {
    logToFile('roleService', `Role update error for ID: ${id}`, error);
    throw error;
  }
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

export const assignPermissionsToRole = async (roleId: string, permissionIds: string[]) => {
  try {
    const role = await prisma.role.findUnique({
      where: { id: roleId },
      include: { permissions: true }
    });

    if (!role) {
      throw new AppError('Role not found', 404);
    }

    const updatedRole = await prisma.role.update({
      where: { id: roleId },
      data: {
        permissions: {
          connect: permissionIds.map(id => ({ id }))
        }
      },
      include: {
        permissions: true
      }
    });

    logToFile('roleService', `Permissions assigned to role ${roleId} successfully`);
    return updatedRole;
  } catch (error) {
    logToFile('roleService', `Error assigning permissions to role ${roleId}`, error);
    throw error;
  }
}; 