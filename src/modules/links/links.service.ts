import { Injectable, NotFoundException, Logger, Inject } from '@nestjs/common';
import normalizeUrl from 'normalize-url';
import { nanoid } from 'nanoid';
import { db } from 'src/db';
import { linksTable } from 'src/db/schema';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class LinksService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  private readonly logger = new Logger(LinksService.name);

  private constructUrlFromKey = (key: string) =>
    `${process.env.BASE_URL}/${key}`;

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

    const cachedKey = await this.cacheManager.get<string | null>(normalizedURL);
    if (cachedKey) {
      this.logger.log('Found same url in cache, returning it');
      return this.constructUrlFromKey(cachedKey);
    }

    const link = await db.query.linksTable.findFirst({
      where: ({ url }, { eq }) => eq(url, normalizedURL),
    });

    if (link) {
      this.logger.log(
        `Found the same link: ${link.url} in db, returning saved short link`,
      );
      this.logger.log('[createShortLink end]');
      await this.cacheManager.set(normalizedURL, link.key);
      return this.constructUrlFromKey(link.key);
    }

    this.logger.log(`Creating short link for URL: ${normalizedURL}`);

    const key = nanoid(6);
    await db.insert(linksTable).values({
      url: normalizedURL,
      key,
    });

    this.logger.log(`Created short link with key: ${key}`);

    this.logger.log('[createShortLink end]');
    await this.cacheManager.set(normalizedURL, key);
    return this.constructUrlFromKey(key);
  }
}
