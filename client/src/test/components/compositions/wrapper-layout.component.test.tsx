import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import WrapperLayout from "../../../components/compositions/wrapper-layouts/wrapper-layout.component";

describe("WrapperLayout", () => {
  it("renders children with default wrapper layout styles", () => {
    render(
      <WrapperLayout data-testid="wrapper">
        <div>Wrapped content</div>
        <p>More content</p>
      </WrapperLayout>
    );

    const element = screen.getByTestId("wrapper");
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass("wrapper");
    expect(screen.getByText("Wrapped content")).toBeInTheDocument();
    expect(screen.getByText("More content")).toBeInTheDocument();
  });

  it("applies CSS custom properties for maxWidth and gutter", () => {
    render(
      <WrapperLayout maxWidth="1200px" gutter="2rem" data-testid="wrapper">
        <span>Content</span>
      </WrapperLayout>
    );

    const element = screen.getByTestId("wrapper");
    expect(element).toHaveStyle({
      "--max-width": "1200px",
      "--gutter": "2rem",
    });
  });

  it("applies no-wrap class when noWrap prop is true", () => {
    render(
      <WrapperLayout noWrap data-testid="wrapper">
        <div>No margin content</div>
      </WrapperLayout>
    );

    const element = screen.getByTestId("wrapper");
    expect(element).toHaveClass("wrapper", "wrapper-flow-exception");
  });

  it("renders as different HTML elements when 'is' prop is provided", () => {
    render(
      <WrapperLayout is="main" data-testid="wrapper">
        <section>Main content area</section>
      </WrapperLayout>
    );

    const element = screen.getByTestId("wrapper");
    expect(element.tagName).toBe("MAIN");
    expect(element).toHaveClass("wrapper");
  });
});
