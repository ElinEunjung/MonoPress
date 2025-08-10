import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import styles from "./stack-layout.module.css";
import type { HTMLTags } from "../html-tags.type";

interface StackLayoutProps {
  children: ReactNode;
  gap?: string;
  is?: HTMLTags;
  space?: string;
  className?: string;
  recursive?: boolean;
}

const StackLayout = (stackLayoutProps: StackLayoutProps) => {
  const {
    is: Component = "div",
    className: customClassName = "",
    gap,
    recursive,
    space,
    children,
  } = stackLayoutProps;

  const inlineStyle = {
    "--flow-margin": space,
    "--flow-gap": gap,
  } as CSSProperties;

  const optionalStackClassName = {
    [styles["stack-recursive"] as string]: !!recursive,
  };

  const inlineClassName = clsx(
    styles["stack"],
    optionalStackClassName,
    customClassName,
  );

  return (
    <Component className={inlineClassName} style={inlineStyle}>
      {children}
    </Component>
  );
};

export default StackLayout;
