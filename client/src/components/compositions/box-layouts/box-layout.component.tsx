// Box layout - https://every-layout.dev/layouts/box/
import type { CSSProperties, ReactNode } from "react";
import type { HTMLTags } from "../html-tags.type";

import clsx from "clsx";
import styles from "./box-layout.module.css";

interface BoxLayoutProps {
  padding?: CSSProperties["padding"];
  paddingInline?: CSSProperties["paddingInline"];
  paddingBlock?: CSSProperties["paddingBlock"];
  paddingInlineStart?: CSSProperties["paddingInlineStart"];
  paddingInlineEnd?: CSSProperties["paddingInlineEnd"];
  borderWidth?: CSSProperties["borderWidth"];
  className?: string;
  children: ReactNode;
  is?: HTMLTags;
}

const BoxLayout = (BoxLayoutProps: BoxLayoutProps) => {
  const {
    is: Component = "div",
    className: customClassName = "",
    padding,
    paddingBlock,
    paddingInline,
    paddingInlineEnd,
    paddingInlineStart,
    borderWidth,
    children,
  } = BoxLayoutProps;

  const optionalBoxClassName = {
    [styles.inline as string]: !!paddingInline,
    [styles.block as string]: !!paddingBlock,
    [styles["inline-start"] as string]: !!paddingInlineStart,
    [styles["inline-end"] as string]: !!paddingInlineEnd,
  };

  const inlineClassName = clsx(
    styles.box,
    optionalBoxClassName,
    customClassName,
  );

  const inlineStyle = {
    "--spacing-padding": padding,
    "--spacing-padding-inline": paddingInline,
    "--spacing-padding-block": paddingBlock,
    "--spacing-padding-start": paddingInlineStart,
    "--spacing-padding-ending": paddingInlineEnd,
    "--border-width": borderWidth,
  } as CSSProperties;

  return (
    <Component className={inlineClassName} style={inlineStyle}>
      {children}
    </Component>
  );
};

export default BoxLayout;
