import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output, cwd } from 'node:process';
import { commands } from './commands/commands.js';
import { parseCLIArgs } from './helpers/parseCLIArgs.js';
import { runCommand } from './helpers/runCommand.js';

const rl = readline.createInterface({ input, output });
const { argv } = process;

const userName = argv.find((el) => el.startsWith('--username')).split('=')[1];

console.log(`Welcome to the File Manager, ${userName}!`);

rl.on('close', () => {
  console.log(`Thank you for using File Manager, ${userName}, goodbye!`);
});

const COMMANDS = {
  '.exit': () => rl.close(),
  ...commands,
};

for await (const cli of rl) {
  const [commandValue, params] = parseCLIArgs(cli);

  const command = COMMANDS[commandValue];
  if (!command) {
    console.log('Operation failed');
  }

  await runCommand(command, params);
  console.log(`You are currently in ${cwd()}`);
}
