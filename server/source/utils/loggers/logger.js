import winston from 'winston';
const { createLogger, format, transports } = winston;
const { combine, timestamp, prettyPrint, printf } = format;

const logFormat = printf(({ level, payload, url, timestamp, method }) => {
  return `
  {
  time: ${timestamp},
  url: [${url}],
  method: ${method},
  data: ${JSON.stringify(payload, null, '\t')}
  }`;
});

const logger = createLogger({
  level: 'debug',
  format: combine(timestamp(), prettyPrint()),
  transports: [new transports.Console()],
});

export { logger };
