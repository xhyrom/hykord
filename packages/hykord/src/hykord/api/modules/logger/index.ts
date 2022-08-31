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

export const info = (...message) => {
    log(Level.info, ...message);
}

export const warn = (...message) => {
    log(Level.warn, ...message);
}

export const err = (...message) => {
    log(Level.err, ...message);
}

const log = (level: Level, ...message) => {
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

    console.log(`%c${level}%c:`, `color: ${color}`, `color: ${Color.Reset}`, ...message);
}

export default {
    info,
    warn,
    err,
}