import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Heading } from "../../lib/main";
import { SectionTitle } from "../../lib/main";
import { Tooltip } from "../../lib/main";
import { CommandCard, createEmptySlots } from "../../lib/main";

describe("Heading", () => {
  it("renders with correct heading level", () => {
    const { container } = render(<Heading level={1}>Test Title</Heading>);
    const h1 = container.querySelector("h1");
    expect(h1).toBeInTheDocument();
    expect(h1).toHaveTextContent("Test Title");
  });

  it("defaults to h2", () => {
    const { container } = render(<Heading>Default</Heading>);
    expect(container.querySelector("h2")).toBeInTheDocument();
  });

  it("renders with icon", () => {
    render(
      <Heading level={2} icon={<span data-testid="icon">icon</span>}>
        With Icon
      </Heading>,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Heading className="custom">Styled</Heading>,
    );
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });
});

describe("SectionTitle", () => {
  it("renders title and children", () => {
    render(
      <SectionTitle title="My Section">
        <p>Content</p>
      </SectionTitle>,
    );
    expect(screen.getByText("My Section")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});

describe("Tooltip", () => {
  it("renders children", () => {
    render(
      <Tooltip>
        <span>Tooltip text</span>
      </Tooltip>,
    );
    expect(screen.getByText("Tooltip text")).toBeInTheDocument();
  });

  it("renders with icon", () => {
    render(
      <Tooltip icon={<span data-testid="tt-icon">I</span>}>
        <span>With icon</span>
      </Tooltip>,
    );
    expect(screen.getByTestId("tt-icon")).toBeInTheDocument();
  });
});

describe("CommandCard", () => {
  it("renders 12 cells with empty slots", () => {
    const { container } = render(<CommandCard slots={createEmptySlots()} />);
    const cells = container.querySelectorAll(".command-card-cell");
    expect(cells).toHaveLength(12);
  });

  it("pads to 12 when fewer slots given", () => {
    const { container } = render(
      <CommandCard
        slots={[
          {
            hotkey: "Q",
            label: "Move",
            iconPath: "buttons/command/BTNMove.blp",
            state: "ready",
          },
        ]}
      />,
    );
    const cells = container.querySelectorAll(".command-card-cell");
    expect(cells).toHaveLength(12);
  });
});
