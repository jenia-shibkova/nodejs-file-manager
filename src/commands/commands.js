import { resolve } from 'path';
import { stat, readdir, open, rename, unlink } from 'fs/promises';
import { cwd, chdir } from 'node:process';
import { pipeline } from 'stream/promises';
import { createReadStream, createWriteStream } from 'fs';
import { createHash } from 'crypto';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { resolvePath } from '../helpers/resolvePath.js';
import { writeStream } from '../helpers/writeStream.js';
import CONSTANTS from '../constants.js';

const { TYPES, MESSAGES } = CONSTANTS;



export const commands = {
  up: () => {
    const destination = resolve(cwd(), '..');
    chdir(destination);
  },
  cd: async (params) => {
    if (!params.length || !params[0].trim()) {
      console.log(MESSAGES.INVALID_INPUT);
      return;
    }

    const [destination] = resolvePath(params);

    try {
      await stat(destination);
      chdir(destination);
    } catch {
      console.log(MESSAGES.OPERATION_FAILED);
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
  cat: async (params) => {
    const [source] = params;
    const stats = await stat(source);
   
    if (!stats.isDirectory()) {
      await pipeline(createReadStream(source), writeStream());
    } else {
      console.log(MESSAGES.INVALID_INPUT);
    }
  },
  add: async (params) => {
    const [source] = resolvePath(params);

    try {
      const file = await open(source, 'wx');
      await file.close();
    } catch {
      console.log(MESSAGES.OPERATION_FAILED);
    }
  },
  rn: async (params) => {
    const [source, destination] = resolvePath(params);
    
    try {
      await rename(source, destination);
    } catch {
      console.log(MESSAGES.OPERATION_FAILED);
    }
  },
  cp: async (params) => {
    const [source, destination] = resolvePath(params);
    const fileEx = source.split('/').pop();
    const destinationFileEx = destination.split('/').pop();
    const destinationDir = destinationFileEx.includes('.') ? destination : `${destination}/${fileEx}`;

    try {
      await pipeline(createReadStream(source), createWriteStream(destinationDir));
    } catch (error) {
      console.log(MESSAGES.OPERATION_FAILED);
    }
  },
  mv: async (params) => {
    const [source, destination] = resolvePath(params, 'mv');
    const fileEx = source.split('/').pop();
    const destinationFileEx = destination.split('/').pop();
    const destinationDir = destinationFileEx.includes('.') ? destination : `${destination}/${fileEx}`;

    try {
      await pipeline(createReadStream(source), createWriteStream(`${destinationDir}`));
      await unlink(source);
    } catch (error) {
      console.log(MESSAGES.OPERATION_FAILED);
    }
  },
  rm: async (params) => {
    const [source] = resolvePath(params);

    try {
      await unlink(source);
    } catch (error) {
      console.log(MESSAGES.OPERATION_FAILED);
    }
  },
  hash: async (params) => {
    const [source] = resolvePath(params);

    try {
      await pipeline(
        createReadStream(source),
        createHash('sha256').setEncoding('hex'),
        writeStream()
      );
    } catch (error) {
      console.log(MESSAGES.OPERATION_FAILED);
    }
  },
  compress: async (params) => {
    const [source, destination] = resolvePath(params);
    
    try {
      await pipeline(
        createReadStream(source),
        createBrotliCompress(),
        createWriteStream(destination)
      );
    } catch (error) {
      console.log(MESSAGES.OPERATION_FAILED, error);
    }
  },
  decompress: async (params) => {
    const [source, destination] = resolvePath(params);

    try {
      await pipeline(
        createReadStream(source),
        createBrotliDecompress(),
        createWriteStream(destination)
      );
    } catch (error) {
      console.log(MESSAGES.OPERATION_FAILED, error);
    }
  },
};
