import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import ClusterLayout from "../../../components/compositions/cluster-layouts/cluster-layout.component";

describe("ClusterLayout", () => {
  it("renders children with default cluster layout styles", () => {
    render(
      <ClusterLayout data-testid="cluster">
        <span>Item 1</span>
        <span>Item 2</span>
        <span>Item 3</span>
      </ClusterLayout>
    );

    const element = screen.getByTestId("cluster");
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass("cluster");
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();
  });

  it("applies CSS custom properties for layout controls", () => {
    render(
      <ClusterLayout
        justify="center"
        align="center"
        gap="2rem"
        data-testid="cluster"
      >
        <span>Content</span>
      </ClusterLayout>
    );

    const element = screen.getByTestId("cluster");
    expect(element).toHaveStyle({
      "--flow-gap": "2rem",
      "--cluster-justify": "center",
      "--cluster-alignment": "center",
    });
    expect(element).toHaveClass("cluster-justify", "cluster-align");
  });

  it("applies no-wrap class when noWrap prop is true", () => {
    render(
      <ClusterLayout noWrap data-testid="cluster">
        <span>Item 1</span>
        <span>Item 2</span>
      </ClusterLayout>
    );

    const element = screen.getByTestId("cluster");
    expect(element).toHaveClass("cluster", "cluster-flow-exception");
  });

  it("renders as different HTML elements when 'is' prop is provided", () => {
    render(
      <ClusterLayout is="nav" data-testid="cluster">
        <a href="#1">Link 1</a>
        <a href="#2">Link 2</a>
      </ClusterLayout>
    );

    const element = screen.getByTestId("cluster");
    expect(element.tagName).toBe("NAV");
    expect(element).toHaveClass("cluster");
  });
});
