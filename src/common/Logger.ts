enum Level {
  info = 'info',
  warn = 'warn',
  err = 'error',
  debug = 'debug',
}

const Color = {
  Red: '#E47B83',
  Green: '#98C379',
  Yellow: '#E5C07B',
  Debug: '#707782',
  Orange: '#f5c542',
  Reset: 'inherit',
};

export class Logger {
  public name: string;
  constructor(name: string) {
    this.name = name;
  }

  public info(...message: string[]) {
    this.log(Level.info, ...message);
  }

  public warn(...message: string[]) {
    this.log(Level.warn, ...message);
  }

  public err(...message: string[]) {
    this.log(Level.err, ...message);
  }

  public debug(...message: string[]) {
    this.log(Level.debug, ...message);
  }

  private log(level: Level, ...message: string[]) {
    let color;
    switch (level) {
      case Level.info:
        color = Color.Green;
        break;
      case Level.warn:
        color = Color.Yellow;
        break;
      case Level.debug:
        color = Color.Debug;
        break;
      default:
        color = Color.Red;
        break;
    }

    console.info(
      `%c Hykord %c %c ${this.name} %c`,
      `background: ${color}; color: black; font-weight: bold; border-radius: 5px;`,
      `color: ${Color.Reset}`,
      `background: ${Color.Orange}; color: black; font-weight: bold; border-radius: 5px;`,
      `color: ${Color.Reset}`,
      ...message,
    );
  }
}
