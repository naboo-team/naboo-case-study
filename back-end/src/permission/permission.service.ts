import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission } from './schema/permission.schema';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: Model<Permission>,
  ) {}

  async getAll(): Promise<Permission[]> {
    return this.permissionModel.find().sort({ createdAt: -1 }).exec();
  }

  async getById(id: string): Promise<Permission> {
    const permission = await this.permissionModel.findById(id).exec();
    if (!permission) throw new NotFoundException();
    return permission;
  }

  async getByName(name: string): Promise<Permission> {
    const permission = await this.permissionModel.findById(name).exec();
    if (!permission) throw new NotFoundException();
    return permission;
  }

  async countDocuments(): Promise<number> {
    return this.permissionModel.estimatedDocumentCount().exec();
  }
}
