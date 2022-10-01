import { Logger as RealLogger } from './Logger';

// Exported
export const CoreLogger = new RealLogger('core');
export const PreloadLogger = new RealLogger('preload');
export * from './Logger';
export * from './utils';