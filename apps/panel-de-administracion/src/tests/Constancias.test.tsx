import { render, screen, fireEvent } from "@testing-library/react";
import { expect, describe, test, vi, beforeEach } from "vitest";
import { Constancias } from "../pages/Constancias";

const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
};

vi.mock("../components", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as any),
    useAuth: () => ({ api: mockApi }),
  };
});

window.URL.createObjectURL = vi.fn(() => "blob:http://localhost/dummy-url");
window.URL.revokeObjectURL = vi.fn();
window.fetch = vi.fn();

describe("Constancias Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockApi.get.mockResolvedValue({ data: [] });
  });

  test("should reject file upload without csv extension", async () => {
    const { container } = render(<Constancias />);
    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    expect(fileInput).not.toBeNull();
    const file = new File(["dummy content"], "test.txt", {
      type: "text/plain",
    });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(
      await screen.findByText(
        /se requiere estrictamente un archivo con extensión \.csv/i,
      ),
    ).toBeInTheDocument();
    expect(mockApi.post).not.toHaveBeenCalled();
  });

  test("should read and display CSV content correctly", async () => {
    const { container } = render(<Constancias />);
    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    expect(fileInput).not.toBeNull();

    const csvContent = "nombre,curso\nKarl,Matemáticas\nAnna,Física";
    const file = new File([csvContent], "test.csv", {
      type: "text/csv",
    });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(await screen.findByText(/karl/i)).toBeInTheDocument();
    expect(screen.getByText(/matemáticas/i)).toBeInTheDocument();
    expect(screen.getByText(/anna/i)).toBeInTheDocument();
    expect(screen.getByText(/física/i)).toBeInTheDocument();
  });

  test("'generar constancias' button should be disabled when no template is selected", async () => {
    mockApi.get.mockResolvedValueOnce({
      data: [{ id: 1, nombre: "Template 1", created_at: "2026-01-01" }],
    });

    const { container } = render(<Constancias />);
    const generateBtn = await screen.getAllByRole("button", {
      name: /generar constancias/i,
    })[0];
    expect(generateBtn).toBeDisabled();

    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const csvContent = "nombre,curso\nKarl,Matemáticas";
    const file = new File([csvContent], "test.csv", {
      type: "text/csv",
    });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(await screen.findByText(/karl/i)).toBeInTheDocument();
    expect(generateBtn).toBeDisabled();
  });

  test("'generar constancias' button should be enabled when a template is selected and CSV is loaded", async () => {
    mockApi.get.mockResolvedValueOnce({
      data: [{ id: 1, nombre: "Template 1", created_at: "2026-01-01" }],
    });

    const { container } = render(<Constancias />);
    const generateBtn = await screen.getAllByRole("button", {
      name: /generar constancias/i,
    })[0];
    expect(generateBtn).toBeDisabled();

    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const csvContent = "nombre,curso\nKarl,Matemáticas";
    const file = new File([csvContent], "test.csv", {
      type: "text/csv",
    });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(await screen.findByText(/karl/i)).toBeInTheDocument();
    expect(generateBtn).toBeDisabled();

    const selectButton = await screen.findByRole("button", {
      name: /seleccione una plantilla/i,
    });
    fireEvent.click(selectButton);

    const templateOption = await screen.findByText(/template 1/i);
    fireEvent.click(templateOption);

    expect(generateBtn).toBeEnabled();
  });
});
