import { resolve, dirname } from 'path';
import { stat, readdir } from 'fs/promises';
import { cwd, chdir } from 'node:process';

import CONSTANTS from '../constants.js';

const { TYPES } = CONSTANTS;

function resolvePaths(params) {
  const [sourcePath, destinationPath] = params;
  const source = resolve(cwd(), sourcePath);

  let destination;
  if (!params.length && !destinationPath) {
    console.log('Invalid input');
  }

  if (destinationPath) {
    console.log('destinationPath', destinationPath)
    destination = resolve(cwd(), dirname(sourcePath), destinationPath);
    console.log('source, destination', source, destination)
  }

  return [source, destination];
}

export const commands = {
  up: () => {
    const destination = resolve(cwd(), '..');
    chdir(destination);
  },
  cd: async (params) => {
    if (!params.length || !params[0].trim()) {
      console.log('Invalid input');
      return;
    }

    const [destination] = resolvePaths(params);

    try {
      await stat(destination);
      chdir(destination);
    } catch {
      console.log('Operation failed');
    }
  },
  ls: async () => {
    const dirsArray = await readdir(cwd(), { withFileTypes: true });
    const directories = dirsArray.map((el) => ({
      Name: el.name,
      Type: el.isDirectory() ? TYPES.DIRECTORY : TYPES.FILE,
    }));

    console.table(directories);
  },
};