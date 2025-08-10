// Center Layout = https://every-layout.dev/layouts/center/

import type { CSSProperties, ReactNode } from "react";
import type { HTMLTags } from "../html-tags.type";

import clsx from "clsx";
import styles from "./center-layout.module.css";

interface CenterLayoutProps {
  children: ReactNode;
  is?: HTMLTags;
  className?: string;
  textCenter?: boolean;
  intrinsic?: boolean; // Center child elements based on their content width and full height of the viewport page
  max?: CSSProperties["maxWidth"] | CSSProperties["maxInlineSize"]; // max-width value
  gutter?: CSSProperties["paddingInline"]; // The minimum space on either side of the content
}

const CenterLayout = (centerLayoutProps: CenterLayoutProps) => {
  const {
    is: Component = "div",
    className: customClassName = "",
    children,
    gutter,
    intrinsic,
    max,
    textCenter,
  } = centerLayoutProps;

  const optionalCenterClassName = {
    [styles["text-center"]]: !!textCenter,
    [styles["intrinsic"]]: !!intrinsic,
  };

  const inlineClassName = clsx(
    styles["center-layout"],
    optionalCenterClassName,
    customClassName,
  );

  const inlineStyle = {
    "--max-inline-size": max,
    "--gutter": gutter,
  } as CSSProperties;

  return (
    <Component className={inlineClassName} style={inlineStyle}>
      {children}
    </Component>
  );
};

export default CenterLayout;
