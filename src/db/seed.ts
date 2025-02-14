import { nanoid } from 'nanoid';
import { db } from './index';
import { linksTable } from './schema';

const urls = [
  'https://example.com',
  'https://google.com',
  'https://github.com',
];

async function seed() {
  console.log('Seeding database...');

  await db
    .insert(linksTable)
    .values(urls.map((url) => ({ key: nanoid(6), url })));

  console.log('Seeding complete!');
  process.exit();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
