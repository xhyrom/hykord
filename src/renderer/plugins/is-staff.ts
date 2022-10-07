import { Plugin } from '@hykord/structures';
import { waitFor, Filters } from '@hykord/webpack';
import { after } from '@hykord/patcher';

export class IsStaff extends Plugin {
  unpatch: any;

  name = 'Is Staff';
  author = 'Hykord';
  version = '0.0.0';
  description = 'Gives access to things locked behind staff flag';
  public async start(): Promise<void> {
    const currentUser: any = await this.getCurrentUser();

    this.unpatch = after('getCurrentUser', currentUser, (_, res) => {
      res.flags |= 1;
      return res;
    });
  }

  public stop(): void {
    this.unpatch();
  }

  private async getCurrentUser() {
    return new Promise((resolve) => {
      waitFor(Filters.byProps('getCurrentUser'), (s) => {
        resolve(s);
      });
    });
  }
}