import CONSTANTS from '../constants.js';

const { MESSAGES } = CONSTANTS;

export async function runCommand (command, params) {
  try {
    await command(params);
  } catch (error) {
    console.log(MESSAGES.OPERATION_FAILED);
  }
}
  