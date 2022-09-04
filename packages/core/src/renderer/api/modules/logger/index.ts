enum Level {
    info = 'info',
    warn = 'warn',
    err = 'err',
};

const Color = {
    Red: "#E47B83",
    Green: "#98C379",
    Yellow: "#E5C07B",
    Reset: "inherit",
};

export class Logger {
    public name: string;
    constructor(name: string) {
        this.name = `Hykord/${name}`;
    }

    public info(...message) {
        this.log(Level.info, ...message);
    }
    
    public warn(...message) {
        this.log(Level.warn, ...message);
    }
    
    public err(...message) {
        this.log(Level.err, ...message);
    }
    
    private log(level: Level, ...message) {
        let color;
        switch(level) {
            case Level.info:
                color = Color.Green;
                break;
            case Level.warn:
                color = Color.Yellow;
                break;
            default:
                color = Color.Red;
                break;
        }
    
        console.log(`%c[%c${this.name}%c] %c${level}%c:`, `color: #BFBFBF`, `color: ${color}`, `color: #BFBFBF`, `color: ${color}`, `color: ${Color.Reset}`, ...message);
    }
}

export default new Logger('core');