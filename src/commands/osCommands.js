
import { EOL, cpus, homedir, userInfo, arch } from 'os';
import { runCommand } from '../helpers/runCommand.js';
import CONSTANTS from '../constants.js';

const { MESSAGES } = CONSTANTS;

const logInfo = {
  EOL: () => {
    console.log('EOL: ', JSON.stringify(EOL));
  },
  cpus: () => {
    const result = cpus().map(({ model, speed }) => ({
      model,
      speed: speed / 1000,
    }));

    console.table(result);
  },
  homedir: () => {
    const result = homedir();
    console.log('homedir: ', result);
  },
  username: () => {
    const result = userInfo().username;
    console.log('username: ', result);
  },
  architecture: () => {
    const result = arch();
    console.log('architecture: ', result);
  },
};

export const osCommands = {
  os: async (params) => {
    if (!params.length || params.join().trim() === '') {
      console.log(MESSAGES.INVALID_INPUT);
      return;
    }

    const [param] = params;
    const command = logInfo[param.trim().replace('--','')];

    await runCommand(command);
  },
};