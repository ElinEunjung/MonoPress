import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import BoxLayout from "../../../components/compositions/box-layouts/box-layout.component";

describe("BoxLayout", () => {
  it("renders children content correctly", () => {
    render(
      <BoxLayout>
        <p>Test content</p>
      </BoxLayout>
    );

    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("renders as div element by default", () => {
    render(<BoxLayout data-testid="box">Content</BoxLayout>);

    const element = screen.getByTestId("box");
    expect(element.tagName).toBe("DIV");
  });

  it("renders with custom HTML tag when 'is' prop is provided", () => {
    render(
      <BoxLayout is="article" data-testid="box">
        Content
      </BoxLayout>
    );

    const element = screen.getByTestId("box");
    expect(element.tagName).toBe("ARTICLE");
  });

  it("applies custom className when provided", () => {
    render(
      <BoxLayout className="custom-class" data-testid="box">
        Content
      </BoxLayout>
    );

    const element = screen.getByTestId("box");
    expect(element).toHaveClass("box", "custom-class");
  });

  it("applies inline padding class when paddingInline is provided", () => {
    render(
      <BoxLayout paddingInline="2em" data-testid="box">
        Content
      </BoxLayout>
    );

    const element = screen.getByTestId("box");
    expect(element).toHaveClass("inline");
  });

  it("applies block padding class when paddingBlock is provided", () => {
    render(
      <BoxLayout paddingBlock="2em" data-testid="box">
        Content
      </BoxLayout>
    );

    const element = screen.getByTestId("box");
    expect(element).toHaveClass("block");
  });

  it("applies inline-start padding class when paddingInlineStart is provided", () => {
    render(
      <BoxLayout paddingInlineStart="2em" data-testid="box">
        Content
      </BoxLayout>
    );

    const element = screen.getByTestId("box");
    expect(element).toHaveClass("inline-start");
  });

  it("applies inline-end padding class when paddingInlineEnd is provided", () => {
    render(
      <BoxLayout paddingInlineEnd="2em" data-testid="box">
        Content
      </BoxLayout>
    );

    const element = screen.getByTestId("box");
    expect(element).toHaveClass("inline-end");
  });

  it("applies multiple padding classes when multiple padding props are provided", () => {
    render(
      <BoxLayout
        paddingInline="1em"
        paddingBlock="2em"
        paddingInlineStart="3em"
        data-testid="box"
      >
        Content
      </BoxLayout>
    );

    const element = screen.getByTestId("box");
    expect(element).toHaveClass("inline", "block", "inline-start");
  });

  it("merges custom style prop with internal styles", () => {
    render(
      <BoxLayout
        padding="1em"
        style={{ backgroundColor: "red", color: "white" }}
        data-testid="box"
      >
        Content
      </BoxLayout>
    );

    const element = screen.getByTestId("box");
    expect(element).toHaveStyle({
      "--spacing-padding": "1em",
      backgroundColor: "red",
      color: "white",
    });
  });

  it("applies all padding and border properties together", () => {
    render(
      <BoxLayout
        padding="1em"
        paddingInline="2em"
        paddingBlock="3em"
        paddingInlineStart="4em"
        paddingInlineEnd="5em"
        borderWidth="2px"
        data-testid="box"
      >
        Content
      </BoxLayout>
    );

    const element = screen.getByTestId("box");
    expect(element).toHaveStyle({
      "--spacing-padding": "1em",
      "--spacing-padding-inline": "2em",
      "--spacing-padding-block": "3em",
      "--spacing-padding-start": "4em",
      "--spacing-padding-ending": "5em",
      "--border-width": "2px",
    });
    expect(element).toHaveClass(
      "inline",
      "block",
      "inline-start",
      "inline-end"
    );
  });

  it("handles complex React children", () => {
    render(
      <BoxLayout data-testid="box">
        <div>
          <h1>Title</h1>
          <p>Paragraph</p>
          {[1, 2, 3].map((num) => (
            <span key={num}>Item {num}</span>
          ))}
        </div>
      </BoxLayout>
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Paragraph")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();
  });
});
