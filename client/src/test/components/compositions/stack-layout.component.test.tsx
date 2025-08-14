import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import StackLayout from "../../../components/compositions/stack-layouts/stack-layout.component";

describe("StackLayout", () => {
  it("renders children with default stack layout styles", () => {
    render(
      <StackLayout data-testid="stack">
        <div>Stack item1</div>
        <div>Stack item 2</div>
        <div>Stackitem 3</div>
      </StackLayout>
    );

    const element = screen.getByTestId("stack");
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass("stack");
    expect(screen.getByText("Stack item 1")).toBeInTheDocument();
    expect(screen.getByText("Stack item 2")).toBeInTheDocument();
    expect(screen.getByText("Stack item 3")).toBeInTheDocument();
  });

  it("applies CSS custom properties for spacing controls", () => {
    render(
      <StackLayout gap="2rem" space="1.5rem" data-testid="stack">
        <p>Spaced content</p>
      </StackLayout>
    );

    const element = screen.getByTestId("stack");
    expect(element).toHaveStyle({
      "--flow-gap": "2rem",
      "--flow-margin": "1.5rem",
    });
  });

  it("applies recursive class when recursive prop is true", () => {
    render(
      <StackLayout recursive data-testid="stack">
        <div>
          <p>Nested paragraph 1</p>
          <p>Nested paragraph 2</p>
        </div>
      </StackLayout>
    );

    const element = screen.getByTestId("stack");
    expect(element).toHaveClass("stack", "stack-recursive");
  });

  it("rendersas different HTML elements when 'is' propis provided", () => {
    render(
      <StackLayout is="main" data-testid="stack">
        <section>Main section</section>
      </StackLayout>
    );

    const element = screen.getByTestId("stack");
    expect(element.tagName).toBe("MAIN");
    expect(element).toHaveClass("stack");
  });
});
