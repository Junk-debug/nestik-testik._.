import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import normalizeUrl from 'normalize-url';
import { nanoid } from 'nanoid';
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

  async createShortLink(rawUrl: string): Promise<string> {
    this.logger.log(`[createShortLink start] Raw URL: ${rawUrl}`);
    const normalizedURL = normalizeUrl(rawUrl);
    this.logger.log(`Normalized URL: ${normalizedURL}`);

    const link = await db.query.linksTable.findFirst({
      where: ({ url }, { eq }) => eq(url, normalizedURL),
    });

    if (link) {
      this.logger.log(
        `Found the same link: ${link.url}, returning saved short link`,
      );
      this.logger.log('[createShortLink end]');
      return `${process.env.BASE_URL}/links/${link.key}`;
    }

    this.logger.log(`Creating short link for URL: ${normalizedURL}`);

    const key = nanoid(6);
    await db.insert(linksTable).values({
      url: normalizedURL,
      key,
    });

    this.logger.log(`Created short link with key: ${key}`);

    this.logger.log('[createShortLink end]');
    return `${process.env.BASE_URL}/links/${key}`;
  }
}
