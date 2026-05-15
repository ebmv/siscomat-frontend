import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { expect, vi, describe, test, beforeEach } from "vitest";
import ConsultarFlow from "../pages/ConsultarFlow";

window.fetch = vi.fn();
window.URL.createObjectURL = vi.fn();
window.URL.revokeObjectURL = vi.fn();

describe("ConsultarFlow Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("should verify folio isn't empty", async () => {
    render(<ConsultarFlow />);

    const searchBtn = screen.getByRole("button", {
      name: /buscar constancia/i,
    });
    fireEvent.click(searchBtn);

    expect(window.fetch).not.toHaveBeenCalled();
    expect(screen.getByText("Ingresa un folio.")).toBeInTheDocument();
  });

  test("should format folio automatically during typing", () => {
    render(<ConsultarFlow />);

    const folioInput = screen.getByLabelText(/folio/i);
    fireEvent.change(folioInput, { target: { value: "2026676767" } });

    expect(folioInput).toHaveValue("2026-6767-67");
  });

  test("should show error if folio doesn't exist", async () => {
    (window.fetch as any).mockResolvedValue({
      ok: false,
      status: 404,
    });

    render(<ConsultarFlow />);

    const folioInput = screen.getByLabelText(/folio/i);
    fireEvent.change(folioInput, { target: { value: "2026676767" } });
    fireEvent.click(screen.getByRole("button", { name: /buscar constancia/i }));
    expect(
      await screen.findByText(/no existe un participante con ese folio/i),
    ).toBeInTheDocument();
  });

  test("should show results and allow to navigate back to search", async () => {
    const resultsMock = {
      folio: "2026-6767-67",
      nombre: "Karl",
      apellido_1: "Marx",
      apellido_2: "Engels",
      constancias: [
        { id: "uuid-123", curso: "Álgebra lineal" },
        { id: "uuid-456", curso: "Geometría analítica" },
      ],
    };

    (window.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => resultsMock,
    });

    render(<ConsultarFlow />);

    fireEvent.change(screen.getByLabelText(/folio/i), {
      target: { value: "2026-6767-67" },
    });
    fireEvent.click(screen.getByRole("button", { name: /buscar constancia/i }));

    expect(await screen.findByText("Karl Marx Engels")).toBeInTheDocument();
    expect(
      screen.getByText("2 constancia(s) disponible(s):"),
    ).toBeInTheDocument();
    expect(screen.getByText("Álgebra lineal")).toBeInTheDocument();

    // test return button
    const returnBtn = screen.getByRole("button", { name: /regresar/i });
    fireEvent.click(returnBtn);

    expect(
      screen.getByRole("heading", { name: "Buscar constancia" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/folio/i)).toHaveValue("");
  });

  test("should download PDF correctly", async () => {
    const resultsMock = {
      folio: "2026-6767-67",
      nombre: "Karl",
      apellido_1: "Marx",
      apellido_2: "Engels",
      constancias: [{ id: "uuid-123", curso: "Álgebra lineal" }],
    };

    (window.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => resultsMock,
    });

    (window.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      blob: async () => new Blob(["pdf file"], { type: "application/pdf" }),
    });

    const createElementSpy = vi.spyOn(document, "createElement");

    render(<ConsultarFlow />);

    fireEvent.change(screen.getByLabelText(/folio/i), {
      target: { value: "2026-6767-67" },
    });
    fireEvent.click(screen.getByRole("button", { name: /buscar constancia/i }));

    const downloadBtn = await screen.findByRole("button", {
      name: /descargar/i,
    });

    fireEvent.click(downloadBtn);

    await waitFor(() => {
      expect(createElementSpy).toHaveBeenCalledWith("a");
      expect(window.URL.createObjectURL).toHaveBeenCalled();
      expect(window.URL.revokeObjectURL).toHaveBeenCalled();
    });

    createElementSpy.mockRestore();
  });
});
