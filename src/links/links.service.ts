import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { db } from 'src/db';
import { linksTable } from 'src/db/schema';

@Injectable()
export class LinksService {
  getLinks() {
    return db.select().from(linksTable);
  }

  async getLinkByKey(linkKey: string) {
    const link = await db.query.linksTable.findFirst({
      where: ({ key }, { eq }) => eq(key, linkKey),
    });

    if (!link) {
      throw new Error('Link is not found');
    }

    return link;
  }

  async getShortLink(url: string) {
    const key = nanoid(6);
    await db.insert(linksTable).values({
      url,
      key,
    });

    return `${process.env.BASE_URL}/links/${key}`;
  }
}
