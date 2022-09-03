import { batchFind, findAsync, React } from '@hykord/webpack';
import { Markdown } from '@hykord/components';

interface ConfirmationModal {
  header?: string;
  confirmText?: string;
  cancelText?: string;
  content?: string;
  type?: 'neutral' | 'danger' | 'confirm' | string;
}

export const openConfirmationModal = async({
    header = "ARE YOU SURE?",
    confirmText = "Confirm",
    cancelText= "Cancel",
    content = "Are you sure you want to do that?",
    type = "neutral",
  }: ConfirmationModal,
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  callback = (value: boolean) => {},
) => {
  const [{ openModal }, Colors, ConfirmModal] = await findAsync(() => batchFind(
    ({ findByProps, findByDisplayName }) => {
      findByProps("openModalLazy");
      findByProps("button", "colorRed");
      findByDisplayName("ConfirmModal");
    },
  ));

  new Promise((resolve) => {
    let confirmed = false;

    const buttonColor = {
        danger: Colors.colorRed,
        confirm: Colors.colorGreen,
        info: Colors.colorPrimary,
        warn: Colors.colorYellow,
    }[type.toLowerCase()] ?? Colors[type] ?? Colors.colorBrandNew;

    function handleConfirm(value) {
      if (confirmed) return;
      confirmed = true;
      callback(value);
      resolve(value);
    }
    
    openModal((e) => {
      if (e.transitionState === 3) handleConfirm(false);

      return (
        <ConfirmModal
          {...{
            header,
            confirmText,
            cancelText,
          }}
          transitionState={e.transitionState}
          confirmButtonColor={buttonColor}
          onClose={() => handleConfirm(false)}
          onCancel={() => {
            handleConfirm(false);
            e.onClose();
          }}
          onConfirm={() => {
            handleConfirm(true);
            e.onClose();
          }}>
          <Markdown editable={false}>{content}</Markdown>
        </ConfirmModal>
      );
    });
  })
}

export const openRequiredRestartModal = () => openConfirmationModal({
    header: 'Additional Info',
    confirmText: 'Restart Now',
    cancelText: 'Restart Later',
    content: 'In order to take effect, Discord needs to be restarted. Do you want to restart now?',
    type: 'danger'
}, (value) => value && window.HykordNative.relaunchApp());