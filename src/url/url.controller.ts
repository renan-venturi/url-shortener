import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
// import { AuthGuard } from '@nestjs/passport';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
  };
}

@ApiTags('urls')
@ApiBearerAuth()
@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new shortened URL' })
  @ApiResponse({
    status: 201,
    description: 'The URL has been successfully created.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(
    @Body() createUrlDto: CreateUrlDto,
    @Req() req: AuthenticatedRequest,
  ) {
    console.log(req.user, 'req');
    const userId = req.user?.id;
    console.log(userId, 'userId');
    console.log(createUrlDto);
    return this.urlService.shortenUrl(createUrlDto.originalUrl, userId);
  }

  @Get(':shortCode')
  @ApiOperation({ summary: 'Retrieve the original URL using the short code' })
  @ApiResponse({ status: 200, description: 'The original URL.' })
  @ApiResponse({ status: 404, description: 'URL not found.' })
  async findOne(@Param('shortCode') shortCode: string) {
    return this.urlService.getOriginalUrl(shortCode);
  }

  @Get('findAll/:userId')
  @ApiOperation({ summary: 'Get all URLs for a specific user' })
  @ApiResponse({ status: 200, description: 'List of URLs for the user.' })
  async getUrlsByUserId(@Param('userId') userId: string) {
    return this.urlService.getUrlsByUserId(+userId);
  }

  @Delete(':id')
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete a URL by ID' })
  @ApiResponse({
    status: 200,
    description: 'The URL has been successfully deleted.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async remove(@Param('id') id: string) {
    // const userId = req.user?.id;
    return this.urlService.removeUrl(+id);
  }
}
