import { resolve, dirname } from 'path';
import { cwd } from 'node:process';

import CONSTANTS from '../constants.js';

const { MESSAGES } = CONSTANTS;

export function resolvePath(params) {
  const [sourcePath, destinationPath] = params;
  const source = resolve(cwd(), sourcePath);

  let destination;
  if (!params.length && !destinationPath) {
    console.log(MESSAGES.INVALID_INPUT);
  }
  if (destinationPath) {
    destination = resolve(cwd(), dirname(sourcePath), destinationPath);
  }

  return [source, destination];
}