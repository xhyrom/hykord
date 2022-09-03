import { injectCss } from "@hykord/patcher";

export default () => {
    injectCss('.hykord-errorboundary{font-family: var(--font-display);color:var(--text-normal);padding:16px}.hykord-errorboundary-code{background-color:var(--background-secondary);font-family:var(--font-code);user-select:text}'); // For ErrorBoundary

    injectCss('.hykord-card{padding: 16px;margin-bottom: 10px;}.hykord-form-divider{margin-top:10px;margin-bottom:10px}'); // Simple CSS - Add padding for plugin card & margin for divider

    injectCss('.hykord-textinput-container{border-radius:4px;overflow:hidden}.hykord-textinput-container,.hykord-textinput-inner{-webkit-box-sizing:border-box;box-sizing:border-box;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-flex:1;-ms-flex:1 1 auto;flex:1 1 auto}.hykord-textinput-inner{position:relative;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-direction:row;flex-direction:row;-ms-flex-wrap:wrap;flex-wrap:wrap;padding:1px;min-width:0;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.hykord-textinput-input{-webkit-box-sizing:border-box;box-sizing:border-box;background:transparent;border:none;resize:none;-webkit-box-flex:1;-ms-flex:1;flex:1;min-width:48px;margin:1px;-webkit-appearance:none;-moz-appearance:none;appearance:none}')
    // Grabbed from discord from searchbar, because doesn't work :( ^
}