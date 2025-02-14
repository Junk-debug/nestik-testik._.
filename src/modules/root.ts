import { Controller, Get, Module, Param, Redirect } from '@nestjs/common';

@Controller()
class RootController {
  @Get(':key')
  @Redirect()
  redirect(@Param('key') key: string) {
    return { url: `/links/${key}` };
  }
}

@Module({
  controllers: [RootController],
})
export class RootModule {}
