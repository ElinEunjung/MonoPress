import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import GridLayout from "../../../components/compositions/grid-layouts/grid-layout.component";

describe("GridLayout", () => {
  it("renders children with default grid layout styles", () => {
    render(
      <GridLayout data-testid="grid">
        <div>Grid item 1</div>
        <div>Grid item 2</div>
        <div>Grid item 3</div>
      </GridLayout>
    );

    const element = screen.getByTestId("grid");
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass("grid-layout");
    expect(screen.getByText("Grid item 1")).toBeInTheDocument();
    expect(screen.getByText("Grid item 2")).toBeInTheDocument();
    expect(screen.getByText("Grid item 3")).toBeInTheDocument();
  });

  it("applies CSS custom properties for grid controls", () => {
    render(
      <GridLayout
        repeat="auto-fill"
        gap="2rem"
        min="200px"
        max="300px"
        data-testid="grid"
      >
        <div>Item</div>
      </GridLayout>
    );

    const element = screen.getByTestId("grid");
    expect(element).toHaveStyle({
      "--repeat": "auto-fill",
      "--gap": "2rem",
      "--min": "200px",
      "--max": "300px",
    });
  });

  it("merges custom style prop with internal styles", () => {
    render(
      <GridLayout
        gap="1rem"
        style={{ backgroundColor: "lightgray", padding: "10px" }}
        data-testid="grid"
      >
        <div>Styled grid item</div>
      </GridLayout>
    );

    const element = screen.getByTestId("grid");
    expect(element).toHaveStyle({
      "--gap": "1rem",
      backgroundColor: "lightgray",
      padding: "10px",
    });
  });

  it("renders as different HTML elements when 'is' prop is provided", () => {
    render(
      <GridLayout is="main" data-testid="grid">
        <article>Main content</article>
      </GridLayout>
    );

    const element = screen.getByTestId("grid");
    expect(element.tagName).toBe("MAIN");
    expect(element).toHaveClass("grid-layout");
  });
});
