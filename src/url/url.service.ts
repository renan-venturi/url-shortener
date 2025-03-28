import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateUrlDto } from './dto/create-url.dto';
import { Cron } from '@nestjs/schedule';
import Redis from 'ioredis';

@Injectable()
export class UrlService {
  private prisma = new PrismaClient();
  private redis = new Redis();

  // Gera um código aleatório de 6 caracteres
  private generateShortCode(): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  }

  // Cria uma nova URL encurtada
  async shortenUrl(originalUrl: string, userId?: number): Promise<string> {
    try {
      const shortCode = this.generateShortCode();
      console.log(shortCode, 'shortCode');

      const urlWithProtocol =
        originalUrl.startsWith('http://') || originalUrl.startsWith('https://')
          ? originalUrl
          : `http://${originalUrl}`;

      const oldUrl = new URL(urlWithProtocol);
      const shortUrl = `${oldUrl.origin}/${shortCode}`;

      const data: CreateUrlDto = {
        originalUrl: urlWithProtocol,
        shortCode,
        shortUrl,
        ...(userId !== undefined ? { userId } : {}),
      };

      await this.prisma.url.create({ data });

      return shortUrl;
    } catch (error) {
      console.error('Erro ao criar URL:', error);
      throw new Error('Não foi possível criar a URL encurtada.');
    }
  }

  // Atualiza o endereço de destino de uma URL encurtada
  async updateOriginalUrl(shortCode: string, newOriginalUrl: string) {
    try {
      const url = await this.prisma.url.findUnique({
        where: { shortCode },
      });

      if (!url) {
        throw new NotFoundException('URL não encontrada');
      }

      return await this.prisma.url.update({
        where: { shortCode },
        data: { originalUrl: newOriginalUrl },
      });
    } catch (error) {
      console.error('Erro ao atualizar a URL:', error);
      throw new InternalServerErrorException(
        'Erro ao atualizar o endereço de destino',
      );
    }
  }

  // Obtém o endereço de destino original de uma URL encurtada
  async getOriginalUrl(shortCode: string): Promise<string> {
    const url = await this.prisma.url.findUnique({
      where: { shortCode },
    });
    if (!url) {
      throw new Error('URL not found');
    }

    await this.redis.incr(`clickCount:${shortCode}`);
    return url.originalUrl;
  }

  // Obtém todas as URLs de um usuário
  async getUrlsByUserId(userId: number) {
    try {
      const urls = await this.prisma.url.findMany({
        where: {
          userId: userId,
          deletedAt: null,
        },
      });

      return Promise.all(
        urls.map(async (url) => {
          const redisClicks = await this.redis.get(
            `clickCount:${url.shortCode}`,
          );
          const redisClicksCount = redisClicks ? parseInt(redisClicks, 10) : 0;
          return { ...url, totalClicks: redisClicksCount };
        }),
      );
    } catch (error) {
      console.error('Erro ao buscar URLs:', error);
      throw new InternalServerErrorException('Erro ao buscar URLs do usuário');
    }
  }

  // Sincroniza os cliques de cada URL com o Redis cada 5 minutos
  @Cron('*/5 * * * *')
  async syncClicks() {
    console.log('Sincronizando cliques...');
    try {
      const keys = await this.redis.keys('clickCount:*');
      for (const key of keys) {
        const shortCode = key.split(':')[1];
        const clickCount = await this.redis.get(key);
        if (clickCount) {
          await this.prisma.url.update({
            where: { shortCode },
            data: { clickCount: { increment: parseInt(clickCount, 10) } },
          });
          await this.redis.del(key);
        }
      }
    } catch (error) {
      console.error('Erro ao sincronizar cliques:', error);
    }
  }

  // Remove uma URL encurtada
  async removeUrl(id: number) {
    try {
      await this.prisma.url.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      console.log(error);
      throw new Error('URL not found');
    }
  }
}
