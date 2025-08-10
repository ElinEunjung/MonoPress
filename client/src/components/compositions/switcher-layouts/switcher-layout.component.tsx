import type { CSSProperties, ReactNode } from "react";

import clsx from "clsx";
import styles from "./switcher-layout.module.css";
import type { HTMLTags } from "../html-tags.type";

interface SwitcherLayoutProps {
  limit?:
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12";
  threshold?: CSSProperties["width" | "maxWidth"];
  space?: CSSProperties["gap"];
  align?: CSSProperties["alignItems"];
  className?: string;
  children: ReactNode;
  is?: HTMLTags;
}

const SwitcherLayout = (switcherLayoutProps: SwitcherLayoutProps) => {
  const {
    is: Component = "div",
    space = "1em",
    threshold = "30rem",
    align = "flex-start",
    limit = "3",
    children,
    className: remainingClassName = "",
  } = switcherLayoutProps;

  const limitClassName = styles[`limit-${limit}`];

  const inlineClassname = clsx(
    styles.switcher,
    limitClassName,
    remainingClassName,
  );

  const inlineStyle = {
    "--threshold-breakpoint": threshold,
    "--flow-space": space,
    "--switcher-align-items": align,
  } as CSSProperties;

  return (
    <Component className={inlineClassname} style={inlineStyle}>
      {children}
    </Component>
  );
};

export default SwitcherLayout;
