import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Heading } from "../../lib/main";
import { SectionTitle } from "../../lib/main";
import { Tooltip } from "../../lib/main";
import { CommandCard, createEmptySlots } from "../../lib/main";
import { Table } from "../../lib/main";
import type { TableColumn, TableRowDef } from "../../lib/main";

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
    const { container } = render(<Heading className="custom">Styled</Heading>);
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

describe("Table", () => {
  const columns: TableColumn[] = [
    { key: "name", header: "Name" },
    { key: "gold", header: "Gold", align: "right" },
    { key: "units", header: "Units", align: "center" },
  ];

  const rows: TableRowDef[] = [
    {
      id: 1,
      cells: {
        name: { value: "Human" },
        gold: { value: 1500 },
        units: { value: 12 },
      },
    },
    {
      id: 2,
      cells: {
        name: { value: "Orc" },
        gold: { value: 800 },
        units: { value: 7 },
      },
      highlighted: true,
    },
  ];

  it("renders column headers", () => {
    render(<Table columns={columns} rows={rows} />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Gold")).toBeInTheDocument();
    expect(screen.getByText("Units")).toBeInTheDocument();
  });

  it("renders row values", () => {
    render(<Table columns={columns} rows={rows} />);
    expect(screen.getByText("Human")).toBeInTheDocument();
    expect(screen.getByText("Orc")).toBeInTheDocument();
    expect(screen.getByText("1500")).toBeInTheDocument();
    expect(screen.getByText("800")).toBeInTheDocument();
  });

  it("renders row numbers when showRowNumbers is true", () => {
    const { container } = render(
      <Table columns={columns} rows={rows} showRowNumbers />,
    );
    expect(container.querySelector(".wc-table-td--num")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("applies highlighted class to highlighted rows", () => {
    const { container } = render(<Table columns={columns} rows={rows} />);
    const highlighted = container.querySelectorAll(".wc-table-tr--highlighted");
    expect(highlighted).toHaveLength(1);
  });

  it("renders custom cell via render()", () => {
    const customRows: TableRowDef[] = [
      {
        cells: {
          name: { render: () => <span data-testid="custom-cell">Custom</span> },
          gold: { value: 0 },
          units: { value: 0 },
        },
      },
    ];
    render(<Table columns={columns} rows={customRows} />);
    expect(screen.getByTestId("custom-cell")).toBeInTheDocument();
  });

  it("applies custom className to wrapper", () => {
    const { container } = render(
      <Table columns={columns} rows={rows} className="my-table" />,
    );
    expect(container.querySelector(".my-table")).toBeInTheDocument();
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
            iconPath: "../../public/buttons/command/BTNMove.blp",
            state: "ready",
          },
        ]}
      />,
    );
    const cells = container.querySelectorAll(".command-card-cell");
    expect(cells).toHaveLength(12);
  });
});
