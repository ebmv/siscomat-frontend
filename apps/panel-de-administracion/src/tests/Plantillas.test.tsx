import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { expect, vi, describe, test, beforeEach } from "vitest";
import { Plantillas } from "../pages/Plantillas";

const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
  delete: vi.fn(),
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

describe("Plantillas Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockApi.get.mockResolvedValue({ data: [] });
  });

  test("should load and display templates", async () => {
    const mockTemplates = [
      {
        id: 1,
        nombre: "Plantilla 1",
        descripcion: "Descripción 1",
        url: "http://example.com/plantilla1.docx",
      },
      {
        id: 2,
        nombre: "Plantilla 2",
        descripcion: "Descripción 2",
        url: "http://example.com/plantilla2.docx",
      },
    ];
    mockApi.get.mockResolvedValueOnce({ data: mockTemplates });

    render(<Plantillas />);
    expect(await screen.findByText(/plantilla 1/i)).toBeInTheDocument();
    expect(screen.getByText(/plantilla 2/i)).toBeInTheDocument();
  });

  test("should show error message when no file is selected for upload", async () => {
    render(<Plantillas />);
    const uploadBtn = screen.getByRole("button", { name: /subir plantilla/i });
    fireEvent.click(uploadBtn);
    expect(
      await screen.findByText(/selecciona un archivo pdf/i),
    ).toBeInTheDocument();
    expect(mockApi.post).not.toHaveBeenCalled();
  });

  test("should open confirm modal on delete and call API on confirm", async () => {
    const mockTemplates = [
      {
        id: 1,
        nombre: "Plantilla 1",
        descripcion: "Descripción 1",
        url: "http://example.com/plantilla1.docx",
      },
    ];
    mockApi.get.mockResolvedValueOnce({ data: mockTemplates });
    render(<Plantillas />);
    expect(await screen.findByText(/plantilla 1/i)).toBeInTheDocument();

    const btnOpciones = screen.getByRole("button", { name: /abrir opciones/i });
    fireEvent.click(btnOpciones);

    const btnEliminar = await screen.findByText(/eliminar/i);
    fireEvent.click(btnEliminar);

    expect(
      screen.getByText(/está seguro de que desea eliminar la plantilla/i),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /sí, eliminar/i }));
    await waitFor(() => {
      expect(mockApi.delete).toHaveBeenCalledWith("/plantillas/1");
    });
  });
});
