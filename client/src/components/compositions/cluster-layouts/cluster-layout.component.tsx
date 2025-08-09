// Cluster layout - https://every-layout.dev/layouts/cluster/
import type { CSSProperties, ReactNode } from "react";
import type { HTMLTags } from "../html-tags.type";

import clsx from "clsx";
import styles from "./cluster-layout.module.css";

interface ClusterLayoutProps {
  justify?: CSSProperties["justifyContent"];
  align?: CSSProperties["alignItems"];
  gap?: CSSProperties["gap"];
  noWrap?: boolean;
  className?: string;
  children: ReactNode;
  is?: HTMLTags;
}

const ClusterLayout = (clusterLayoutProps: ClusterLayoutProps) => {
  const {
    is: Component = "div",
    className: customClassName = "",
    justify,
    align,
    gap,
    noWrap,
    children,
  } = clusterLayoutProps;

  const optionalClusterClassName = {
    [styles["cluster-justify"] as string]: !!justify,
    [styles["cluster-align"] as string]: !!align,
    [styles["cluster-flow-exception"] as string]: !!noWrap,
  };

  const inlineClassName = clsx(
    styles.cluster,
    optionalClusterClassName,
    customClassName
  );

  const inlineStyle = {
    "--flow-gap": gap,
    "--cluster-justify": justify,
    "--cluster-alignment": align,
  } as CSSProperties;

  return (
    <Component className={inlineClassName} style={inlineStyle}>
      {children}
    </Component>
  );
};

export default ClusterLayout;
