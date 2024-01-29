import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './schema/role.schema';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: Model<Role>,
  ) {}

  async getAll(): Promise<Role[]> {
    return this.roleModel.find().sort({ createdAt: -1 }).exec();
  }

  async getById(id: string): Promise<Role> {
    const role = await this.roleModel.findById(id).exec();
    if (!role) throw new NotFoundException();
    return role;
  }

  async getByName(name: string): Promise<Role> {
    const role = await this.roleModel.findOne({ name }).exec();
    if (!role) {
      throw new NotFoundException(`Role with name '${name}' not found`);
    }
    return role;
  }

  async create(name: string): Promise<Role> {
    const role = await this.roleModel.create({
      name,
    });
    return role;
  }

  async countDocuments(): Promise<number> {
    return this.roleModel.estimatedDocumentCount().exec();
  }
}
