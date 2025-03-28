import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private prisma = new PrismaClient();

  async createUser(email: string, password: string): Promise<User> {
    console.log('createUser', email, password);
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      return await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao criar usuário');
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    return user;
  }
}
