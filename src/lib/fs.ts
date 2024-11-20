import fs from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOURCE_DIR = join(__dirname, './../../scripts/source/');
const DIST_DIR = join(__dirname, '../../scripts/realtime-data/');

export async function readCategoriesName() {
  const files = await fs.readdir(DIST_DIR);

  const data: string[] = [];
  for (const file of files) {
    const pkgJSON = await fs.readFile(join(SOURCE_DIR, file), 'utf-8');
    const pkgData = JSON.parse(pkgJSON);
    data.push(pkgData?.name);
  }

  return data;
}

export async function readCategoryDetail(slug: string) {
  const file = await fs.readFile(join(DIST_DIR, `${slug}.json`), { encoding: 'utf-8' });
  const pkgData = JSON.parse(file);
  return pkgData
}
