import { SvgIcon, type SvgIconProps } from "@/components/icon/svg-icon";

const SvgIconGoogle = (props: Omit<SvgIconProps, "children">) => {
  return (
    <SvgIcon viewBox="0 0 16 16" {...props}>
      <path d="M15.7 8.2c0-.5 0-.9-.1-1.3H8.2v2.5h4.2c-.2 1.1-.8 2-1.7 2.6v1.6h2.2c1.8-1.6 2.8-4 2.8-6.4Z" />
      <path d="M8.2 16c2.2 0 4.1-.7 5.4-2l-2.2-1.6c-.6.4-1.5.7-3.2.7-2.4 0-4.5-1.7-5.2-3.9H.7v1.7A8.1 8.1 0 0 0 8.2 16Z" />
      <path d="M3 9.2c-.2-.4-.3-.9-.3-1.4s.1-1 .3-1.4V4.7H.7A8.1 8.1 0 0 0 0 7.8c0 1.2.3 2.3.7 3.1L3 9.2Z" />
      <path d="M8.2 2.9c1.3 0 2.5.5 3.4 1.3L14 2c-1.5-1.4-3.4-2-5.8-2A8.1 8.1 0 0 0 .7 4.7L3 6.4c.7-2.2 2.8-3.5 5.2-3.5Z" />
    </SvgIcon>
  );
};

export { SvgIconGoogle };
