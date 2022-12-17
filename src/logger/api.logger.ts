import winston, { Logger, format } from "winston";
const { combine, timestamp, label, printf, colorize } = format;

export class BotLogger {
  logger: Logger;
  private static instance: BotLogger;
  private myFormat;

  constructor() {
    this.myFormat = printf(({ level, message, label, timestamp }) => {
      return `${label} [${timestamp}] (${level}): ${message}`;
    });
    this.logger = winston.createLogger({
      format: combine(
        colorize({
          all: true,
        }),
        label({ label: "|| INGMAN TEST BACKEND ||" }),
        timestamp(),
        this.myFormat
      ),
      defaultMeta: { service: "fcs-test-backend" },
      transports: [
        new winston.transports.File({
          filename: "error.log",
          level: "error",
          dirname: "./logger",
        }),
        new winston.transports.File({
          level: "info",
          filename: "info.log",
          dirname: "./logger",
        }),
        new winston.transports.Console(),
      ],
    });
  }

  public static getInstance(): BotLogger {
    if (!BotLogger.instance) {
      BotLogger.instance = new BotLogger();
    }
    return BotLogger.instance;
  }
}

export default BotLogger.getInstance().logger;
