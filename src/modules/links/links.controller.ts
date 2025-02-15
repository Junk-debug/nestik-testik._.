import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Redirect,
} from '@nestjs/common';
import { LinksService } from './links.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateShortLinkDto, ResponseDto } from './dto/createShortLink.dto';

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Get()
  @ApiOperation({
    summary: 'Returns list of all links',
  })
  getAllLinks() {
    return this.linksService.getLinks();
  }

  @Get(':key')
  @Redirect()
  async redirect(@Param('key') key: string) {
    const { url } = await this.linksService.getLinkByKey(key);
    return { url };
  }

  @Post('shorten')
  @ApiOperation({
    summary: 'Saves url to db and returns it short version',
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    description: 'Created',
    status: HttpStatus.CREATED,
    type: ResponseDto,
  })
  @ApiBody({ type: CreateShortLinkDto })
  async createShortLink(@Body() createShortLinkDto: CreateShortLinkDto) {
    const shortLink = await this.linksService.createShortLink(
      createShortLinkDto.url,
    );

    return {
      message: 'URL successfully shorten',
      data: {
        shortLink,
      },
      statusCode: HttpStatus.CREATED,
    };
  }
}
