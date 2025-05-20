import { Request, Response, NextFunction } from 'express';
import {
  createPermission,
  getAllPermissions,
  getPermissionById,
  updatePermission,
  deletePermission,
} from '../services/permissionService';

export const createPermissionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const permission = await createPermission(req.body);
    res.status(201).json({
      success: true,
      message: 'Permission created successfully',
      data: permission
    });
  } catch (error) {
    next(error);
  }
};

export const getPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const permissions = await getAllPermissions();
    res.status(200).json({
      success: true,
      message: 'Permissions retrieved successfully',
      data: permissions
    });
  } catch (error) {
    next(error);
  }
};

export const getPermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const permission = await getPermissionById(id);
    res.status(200).json({
      success: true,
      message: 'Permission retrieved successfully',
      data: permission
    });
  } catch (error) {
    next(error);
  }
};

export const updatePermissionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updatedPermission = await updatePermission(id, req.body);
    res.status(200).json({
      success: true,
      message: 'Permission updated successfully',
      data: updatedPermission
    });
  } catch (error) {
    next(error);
  }
};

export const deletePermissionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await deletePermission(id);
    res.status(200).json({
      success: true,
      message: 'Permission deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}; 