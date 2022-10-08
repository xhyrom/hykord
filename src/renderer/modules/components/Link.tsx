import { React } from '@hykord/webpack';

interface Props {
  href: string;
}

export const Link = (props: React.PropsWithChildren<Props>) => {
  return (
    <a href={props.href} target="_blank">
      {props.children}
    </a>
  );
};
