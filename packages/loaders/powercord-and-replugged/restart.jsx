const { React, i18n: { Messages } } = require('powercord/webpack');
const { Confirm } = require('powercord/components/modal');
const { open: openModal, close: closeModal } = require('powercord/modal');

module.exports.askRestart = (callback) => {
    openModal(() => <Confirm
      red
      header="Restart Discord"
      confirmText="Restart"
      cancelText="Not now"
      onConfirm={() => DiscordNative.app.relaunch()}
      onCancel={() => closeModal() && callback()}
    >
      <div className='powercord-text'>
        This setting requires you to restart Discord to take effect. Do you want to restart Discord now?
      </div>
    </Confirm>);
}