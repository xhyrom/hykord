import { Plugin } from '@hykord/structures';
import { waitFor, Filters } from '@hykord/webpack';

export class Experiments extends Plugin {
  unpatch: any;

  name = 'Experiments';
  author = 'Hykord';
  version = '0.0.0';
  description = 'Enable discord experiments - for full experience enable Is Staff plugin';
  public async start(): Promise<void> {
    const currentUser: any = await this.getCurrentUser();
    const dispatcher: any = await this.getDispatcher();

    const actions = await this.getConnectionOpen(dispatcher);
    const user = currentUser.getCurrentUser();

    actions.find((n: any) => n.name === 'ExperimentStore').actionHandler({
      type: 'CONNECTION_OPEN', user: { flags: user.flags |= 1 }, experiments: [],
    });

    actions.find((n: any) => n.name === 'DeveloperExperimentStore').actionHandler();
  }

  private async getCurrentUser() {
    return new Promise((resolve) => {
      waitFor(Filters.byProps('getCurrentUser'), (s) => {
        resolve(s);
      });
    });
  }

  private async getDispatcher() {
    return new Promise((resolve) => {
      waitFor(Filters.byProps('_dispatcher'), (s) => {
        resolve(s);
      });
    });
  }

  private async getConnectionOpen(dispatcher: any) {
    let found = dispatcher._dispatcher._actionHandlers._orderedActionHandlers['CONNECTION_OPEN'];

    while (!found) {
      await new Promise((r) => setTimeout(r, 100));
      found = dispatcher._dispatcher._actionHandlers._orderedActionHandlers['CONNECTION_OPEN'];
    }

    return found;
  }
}