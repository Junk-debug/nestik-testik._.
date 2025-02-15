import { db } from './index';
import { linksTable } from './schema';
import { inArray } from 'drizzle-orm';
import { isURL } from 'class-validator';

async function cleanup() {
  console.log('Cleaning database...');

  await db.transaction(async (tx) => {
    const allUrls = await tx
      .select({ id: linksTable.id, url: linksTable.url })
      .from(linksTable);

    const invalidUrls = allUrls.filter(
      ({ url }) => !isURL(url, { require_protocol: true }),
    );

    await tx.delete(linksTable).where(
      inArray(
        linksTable.id,
        invalidUrls.map(({ id }) => id),
      ),
    );

    console.log('Deleted invalid urls!');
  });

  process.exit();
}

cleanup().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
