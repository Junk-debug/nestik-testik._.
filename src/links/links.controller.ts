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

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Get()
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
  @HttpCode(HttpStatus.CREATED)
  async shortUrlAndSave(@Body() body: { url: string }) {
    const shortLink = await this.linksService.createShortLink(body.url);

    return {
      message: 'URL successfully shorten',
      data: {
        shortLink,
      },
      statusCode: HttpStatus.CREATED,
    };
  }
}
