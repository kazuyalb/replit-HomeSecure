import { copyFileSync, readdirSync, mkdirSync, existsSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function copyRecursive(src, dest) {
  const stat = statSync(src);
  if (stat.isDirectory()) {
    if (!existsSync(dest)) {
      mkdirSync(dest, { recursive: true });
    }
    const files = readdirSync(src);
    for (const file of files) {
      const srcPath = join(src, file);
      const destPath = join(dest, file);
      copyRecursive(srcPath, destPath);
    }
  } else {
    copyFileSync(src, dest);
  }
}

try {
  // dist/publicの内容をdistに移動
  const sourceDir = join(__dirname, '..', 'dist', 'public');
  const targetDir = join(__dirname, '..', 'dist');

  console.log('Moving files from', sourceDir, 'to', targetDir);

  if (!existsSync(sourceDir)) {
    throw new Error(`Source directory ${sourceDir} does not exist`);
  }

  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  const files = readdirSync(sourceDir);
  console.log('Found files:', files);

  files.forEach(file => {
    const sourcePath = join(sourceDir, file);
    const targetPath = join(targetDir, file);
    console.log(`Copying ${sourcePath} to ${targetPath}`);
    copyRecursive(sourcePath, targetPath);
  });

  console.log('Successfully moved all files');
} catch (error) {
  console.error('Error during postbuild:', error);
  process.exit(1);
}