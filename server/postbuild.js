import { copyFileSync, readdirSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// dist/publicの内容をdistに移動
const sourceDir = join(__dirname, '..', 'dist', 'public');
const targetDir = join(__dirname, '..', 'dist');

if (!existsSync(targetDir)) {
  mkdirSync(targetDir);
}

const files = readdirSync(sourceDir);
files.forEach(file => {
  copyFileSync(join(sourceDir, file), join(targetDir, file));
});
