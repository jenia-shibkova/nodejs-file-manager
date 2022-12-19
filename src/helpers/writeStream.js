import { Writable } from 'stream';
import { EOL } from 'os';

export function writeStream() {
  return new Writable({
    write(chunk, _, callback) {
      process.stdout.write(chunk + EOL, callback);
    },
  });
}