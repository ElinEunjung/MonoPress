import type { CSSProperties, ReactNode } from "react";
import type { HTMLTags } from "../html-tags.type";
import clsx from "clsx";
import styles from "./grid-layout.module.css";

interface GridLayoutProps {
  repeat?: "auto-fit" | "auto-fill" | ({} & string);
  gap?: CSSProperties["gap"];
  min?: string;
  max?: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  is?: HTMLTags;
}

const GridLayout = (gridLayoutProps: GridLayoutProps) => {
  const {
    repeat,
    gap,
    min,
    max,
    children,
    style,
    is: Component = "div",
    className: customClassName = "",
  } = gridLayoutProps;

  const inlineClassName = clsx(styles["grid-layout"], customClassName);

  const inlineStyle = {
    "--gap": gap,
    "--repeat": repeat,
    "--max": max,
    "--min": min,
    ...style,
  } as CSSProperties;
  return (
    <Component className={inlineClassName} style={inlineStyle}>
      {children}
    </Component>
  );
};

export default GridLayout;
