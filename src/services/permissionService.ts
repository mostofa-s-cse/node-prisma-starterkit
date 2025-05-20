import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { logToFile } from '../utils/logger';

const prisma = new PrismaClient();

export const createPermission = async (data: { name: string; description?: string }) => {
  try {
    const existingPermission = await prisma.permission.findUnique({
      where: { name: data.name },
    });

    if (existingPermission) {
      logToFile('permissionService', `Permission creation failed: Name already exists (${data.name})`);
      throw new AppError('Permission name already exists', 400);
    }

    const permission = await prisma.permission.create({
      data,
    });

    logToFile('permissionService', `Permission created successfully (ID: ${permission.id})`);
    return permission;
  } catch (error: any) {
    logToFile('permissionService', 'Permission creation error', error);
    throw error;
  }
};

export const getAllPermissions = async () => {
  const permissions = await prisma.permission.findMany();
  return permissions;
};

export const getPermissionById = async (id: string) => {
  const permission = await prisma.permission.findUnique({
    where: { id },
  });

  if (!permission) {
    throw new AppError('Permission not found', 404);
  }

  return permission;
};

export const updatePermission = async (id: string, data: { name?: string; description?: string }) => {
  try {
    const permission = await prisma.permission.findUnique({
      where: { id },
    });

    if (!permission) {
      logToFile('permissionService', `Permission update failed: Permission not found (ID: ${id})`);
      throw new AppError('Permission not found', 404);
    }

    const updatedPermission = await prisma.permission.update({
      where: { id },
      data,
    });

    logToFile('permissionService', `Permission updated successfully (ID: ${id})`);
    return updatedPermission;
  } catch (error: any) {
    logToFile('permissionService', 'Permission update error', error);
    throw error;
  }
};

export const deletePermission = async (id: string) => {
  try {
    const permission = await prisma.permission.findUnique({
      where: { id },
    });

    if (!permission) {
      logToFile('permissionService', `Permission deletion failed: Permission not found (ID: ${id})`);
      throw new AppError('Permission not found', 404);
    }

    await prisma.permission.delete({
      where: { id },
    });

    logToFile('permissionService', `Permission deleted successfully (ID: ${id})`);
    return true;
  } catch (error: any) {
    logToFile('permissionService', 'Permission deletion error', error);
    throw error;
  }
}; 