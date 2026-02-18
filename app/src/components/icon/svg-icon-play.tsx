import { SvgIcon, type SvgIconProps } from "@/components/icon/svg-icon";

const SvgIconPlay = (props: Omit<SvgIconProps, "children">) => {
  return (
    <SvgIcon {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.2,7.3l-9.5-6.1c-0.6-0.3-1.2-0.3-1.2,0.8v12c0,1,0.7,1.2,1.2,0.8l9.5-6.1C13.6,8.3,13.6,7.7,13.2,7.3"
      />
    </SvgIcon>
  );
};

export { SvgIconPlay };
