import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import styles from "./wrapper-layout.module.css";
import type { HTMLTags } from "../html-tags.type";

interface WrapperLayoutProps {
  children: ReactNode;
  maxWidth?: CSSProperties["maxWidth"];
  gutter?: CSSProperties["paddingInline" | "paddingLeft" | "paddingRight"];
  className?: string;
  noWrap?: boolean;
  is?: HTMLTags;
}

const WrapperLayout = (wrapperLayoutProps: WrapperLayoutProps) => {
  const {
    is: Component = "div",
    className: customClassName = "",
    gutter,
    maxWidth,
    noWrap,
    children,
  } = wrapperLayoutProps;

  const isNoWrapClassName = noWrap ? styles["wrapper-flow-exception"] : null;

  const inlineClassName = clsx(
    styles.wrapper,
    isNoWrapClassName,
    customClassName
  );

  const inlineStyle = {
    "--gutter": gutter,
    "--max-width": maxWidth,
  } as CSSProperties;
  return (
    <Component className={inlineClassName} style={inlineStyle}>
      {children}
    </Component>
  );
};

export default WrapperLayout;
