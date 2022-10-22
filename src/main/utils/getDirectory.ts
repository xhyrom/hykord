import { join } from 'path';

export default () => join(`${process.env.HOME || process.env.USERPROFILE}`, '.hykord');