import { injectCss } from "@hykord/patcher";

export default () => {
    injectCss('.hykord-errorboundary{font-family: var(--font-display);color:var(--text-normal);padding:16px}.hykord-errorboundary-code{background-color:var(--background-secondary);font-family:var(--font-code);user-select:text}'); // For ErrorBoundary

    injectCss('.hykord-card{padding: 16px;margin-bottom: 10px;}.hykord-form-divider{margin-top:10px;margin-bottom:10px}'); // Simple CSS - Add padding for plugin card & margin for divider
}