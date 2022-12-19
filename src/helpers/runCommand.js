export async function runCommand (command, params) {
  try {
    await command(params);
  } catch (error) {
    console.log('Operation failed');
  }
}
  