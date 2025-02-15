import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class CreateShortLinkDto {
  @ApiProperty({ example: 'https://example.com' })
  @IsUrl()
  url: string;
}

export class ResponseDto {
  message: string;
  statusCode = HttpStatus.CREATED;
  data: {
    shortLink: string;
  };
}
