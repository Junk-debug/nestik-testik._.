import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { nanoid } from 'nanoid';
import { db } from 'src/db';
import { linksTable } from 'src/db/schema';
import { validateUrl } from 'src/utils/validateURL';

@Injectable()
export class LinksService {
  private readonly logger = new Logger(LinksService.name);

  getLinks() {
    return db.select().from(linksTable);
  }

  async getLinkByKey(linkKey: string) {
    const link = await db.query.linksTable.findFirst({
      where: ({ key }, { eq }) => eq(key, linkKey),
    });

    if (!link) {
      throw new NotFoundException(`Link with key ${linkKey} not found`);
    }

    return link;
  }

  async createShortLink(url: string): Promise<string> {
    if (!validateUrl(url)) {
      throw new BadRequestException('Invalid URL format');
    }

    const link = await db.query.linksTable.findFirst({
      where: ({ url: u }, { eq }) => eq(u, url),
    });

    if (link) {
      this.logger.log(
        `This link is already exists, returning saved short link for URL: ${url}`,
      );
      return `${process.env.BASE_URL}/links/${link.key}`;
    }

    this.logger.log(`Creating short link for URL: ${url}`);

    const key = nanoid(6);
    await db.insert(linksTable).values({
      url,
      key,
    });

    this.logger.log(`Created short link with key: ${key}`);

    return `${process.env.BASE_URL}/links/${key}`;
  }
}
