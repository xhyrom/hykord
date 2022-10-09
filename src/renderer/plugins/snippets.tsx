import { Plugin } from '@hykord/structures';
import { Settings } from '@hykord/apis';
import Loader from '@monaco-editor/loader';
import { React } from '@hykord/webpack';
import { ErrorBoundary } from '@hykord/components';

// TODO: move into external plugin
export class Snippets extends Plugin {
  monaco: any;
  editor: any;

  name = 'Snippets';
  author = 'Hykord';
  version = '0.0.0';
  description = 'Snippets';
  dependsOn = ['Settings API'];
  $internal = true;
  public start(): void {
    this.fullStart();
  }

  public async fullStart(): Promise<void> {
    new Promise((resolve) => {
      if (document.readyState === 'complete') resolve('complete');
      else window.addEventListener('load', resolve);
    }).then(() => {
      Loader.init().then((m) => {
        this.monaco = m;
      });
    });

    Settings.registerSection(
      'HYKORD_SNIPPETS',
      'Snippets',
      ErrorBoundary.wrap(() => {
        React.useEffect(() => {
          this.editor = this.monaco.editor.create(
            document.getElementById('editor-container'),
            {
              theme: 'vs-dark',
              minimap: {
                enabled: false,
              },
            },
          );

          return () => {
            this.editor.dispose();
          };
        });

        return (
          <div id="hykord-editor-panel">
            <div className="hykord-editor-wrapper">
              <div className="hykord-editor" id="editor-container" />
            </div>
          </div>
        );
      }),
    );
  }

  public stop(): void {
    Settings.unregisterSection('HYKORD_SNIPPETS');
  }
}
