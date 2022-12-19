export function parseCLIArgs (line) {
  let [command, ...params] = line.split(' ');

  if (/'|'/g.test(params)) {
    params = params
      .join(' ')
      .split(/[''] | ['']/)
      .map((item) => item.replace(/'|'/g, ''));
  }

  return [command, params];
}
