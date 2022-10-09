import { Logger as RealLogger } from './Logger';

// Exported
export const CoreLogger = new RealLogger('core');
export const PreloadLogger = new RealLogger('preload');
export const LoaderLogger = new RealLogger('loader');
export * from './Logger';
export * from './utils';
export * from './types/index';