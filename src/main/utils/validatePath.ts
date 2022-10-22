import { normalize } from 'path';

// Avoid ../../xxx
export default (path: string) => {
    return normalize(path).replace(/^(\.\.(\/|\\|$))+/, '');
}