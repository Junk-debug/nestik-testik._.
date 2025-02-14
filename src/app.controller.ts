import { Controller, Get, Param, Redirect } from '@nestjs/common';

@Controller()
export class AppController {
  @Get(':key')
  @Redirect()
  redirect(@Param('key') key: string) {
    return { url: `/links/${key}` };
  }
}
