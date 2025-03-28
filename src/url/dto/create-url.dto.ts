import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class CreateUrlDto implements Prisma.UrlCreateInput {
  @ApiProperty({
    description: 'The original URL to be shortened',
    example: 'https://example.com',
  })
  @IsString()
  originalUrl: string;

  @ApiProperty({
    description: 'The short code for the URL',
    example: 'abc123',
  })
  @IsString()
  shortCode: string;

  @ApiPropertyOptional({
    description: 'The ID of the user creating the URL',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  userId?: number;

  @ApiProperty({
    description: 'The shortened URL',
    example: 'https://example.com/abc123',
  })
  @IsString()
  shortUrl: string;
}
