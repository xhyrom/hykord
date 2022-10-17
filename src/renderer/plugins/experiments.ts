import { $plugin } from '@hykord/hooks';
import { waitFor, Filters } from '@hykord/webpack';
import { after } from '@hykord/patcher';
import { Logger as RealLogger } from '@common';

const Logger = new RealLogger('Experiments');

let unpatch: () => void;
export default $plugin({
  name: 'Experiments',
  author: 'Hykord',
  version: '0.0.0',
  description: 'Enable discord experiments',
  $internal: true,
  async start(): Promise<void> {
    const currentUser: any = await waitFor(Filters.byProps('getCurrentUser'));
    const dispatcher: any = await waitFor(Filters.byProps('_dispatcher'));

    const actions = await this.getConnectionOpen(dispatcher);
    const user = currentUser.getCurrentUser();

    actions
      .find((n: any) => n.name === 'ExperimentStore')
      .actionHandler({
        type: 'CONNECTION_OPEN',
        user: { flags: (user.flags |= 1) },
        experiments: [],
      });

    actions
      .find((n: any) => n.name === 'DeveloperExperimentStore')
      .actionHandler();

    unpatch = after('getCurrentUser', currentUser, (_, res) => {
      res.flags |= 1;
      return res;
    });

    Logger.info('Plugin successfully injected everything needed');
  },

  stop(): void {
    unpatch();
  },

  async getConnectionOpen(dispatcher: any) {
    let found =
      dispatcher._dispatcher._actionHandlers._orderedActionHandlers[
        'CONNECTION_OPEN'
      ];

    while (!found) {
      await new Promise((r) => setTimeout(r, 100));
      found =
        dispatcher._dispatcher._actionHandlers._orderedActionHandlers[
          'CONNECTION_OPEN'
        ];
    }

    return found;
  }
});
