import { Injectable, NotFoundException, Logger } from '@nestjs/common';

import { db } from 'src/db';
import { linksTable } from 'src/db/schema';

@Injectable()
export class LinksService {
  private readonly logger = new Logger(LinksService.name);

  getLinks() {
    this.logger.log('Selecting all links');
    return db.select().from(linksTable);
  }

  async getLinkByKey(linkKey: string) {
    this.logger.log(`Finding link for a key: ${linkKey}`);

    const link = await db.query.linksTable.findFirst({
      where: ({ key }, { eq }) => eq(key, linkKey),
    });

    if (!link) {
      throw new NotFoundException(`Link with key "${linkKey}" not found`);
    }

    this.logger.log(`Link found: ${link.url}`);
    return link;
  }

  async createShortLink(url: string): Promise<string> {
    // these packages is weird, they don't support commonjs
    // modern node versions(since v22.14.0) supports cjs even if library doesn't support it, but railway only has access to node v22.10.0, so we using it this way
    const { default: normalizeUrl } = await import('normalize-url');
    const { nanoid } = await import('nanoid');

    const normalizedURL = normalizeUrl(url, { defaultProtocol: 'https' });

    const link = await db.query.linksTable.findFirst({
      where: ({ url }, { eq }) => eq(url, normalizedURL),
    });

    if (link) {
      this.logger.log(
        `This link is already exists, returning saved short link for URL: ${normalizedURL}`,
      );
      return `${process.env.BASE_URL}/links/${link.key}`;
    }

    this.logger.log(`Creating short link for URL: ${normalizedURL}`);

    const key = nanoid(6);
    await db.insert(linksTable).values({
      url,
      key,
    });

    this.logger.log(`Created short link with key: ${key}`);

    return `${process.env.BASE_URL}/links/${key}`;
  }
}
