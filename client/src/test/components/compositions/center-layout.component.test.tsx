import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import CenterLayout from "../../../components/compositions/center-layouts/center-layout.component";

describe("CenterLayout", () => {
  it("renders children with default center layout styles", () => {
    render(
      <CenterLayout data-testid="center">
        <div>Centered content</div>
        <p>More content</p>
      </CenterLayout>
    );

    const element = screen.getByTestId("center");
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass("center-layout");
    expect(screen.getByText("Centered content")).toBeInTheDocument();
    expect(screen.getByText("More content")).toBeInTheDocument();
  });

  it("applies CSS custom properties and optional classes for layout controls", () => {
    render(
      <CenterLayout
        max="800px"
        gutter="1.5rem"
        textCenter
        intrinsic
        data-testid="center"
      >
        <span>Content</span>
      </CenterLayout>
    );

    const element = screen.getByTestId("center");
    expect(element).toHaveStyle({
      "--max-inline-size": "800px",
      "--gutter": "1.5rem",
    });
    expect(element).toHaveClass("center-layout", "text-center", "intrinsic");
  });

  it("applies center class for full viewport height centering", () => {
    render(
      <CenterLayout center data-testid="center">
        <div>Viewport centered content</div>
      </CenterLayout>
    );

    const element = screen.getByTestId("center");
    expect(element).toHaveClass("center-layout", "center");
  });

  it("renders as different HTML elements when 'is' prop is provided", () => {
    render(
      <CenterLayout is="article" data-testid="center">
        <div>Article content</div>
      </CenterLayout>
    );

    const element = screen.getByTestId("center");
    expect(element.tagName).toBe("ARTICLE");
    expect(element).toHaveClass("center-layout");
  });
});
