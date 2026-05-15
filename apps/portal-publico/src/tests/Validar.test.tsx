import { render, screen } from "@testing-library/react";
import { expect, vi, describe, test, beforeEach } from "vitest";
import Validar from "../pages/Validar";
import { MemoryRouter, Routes, Route } from "react-router-dom";

window.fetch = vi.fn();

describe("Validar Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("should show 'Cargando...' when making a petition", () => {
    (window.fetch as any).mockImplementation(() => new Promise(() => {}));

    render(
      <MemoryRouter initialEntries={["/validar/uuid-123"]}>
        <Routes>
          <Route path="/validar/:id" element={<Validar />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/cargando.../i)).toBeInTheDocument();
  });

  test("should show error 404 if the id doesn't exist", async () => {
    (window.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    render(
      <MemoryRouter initialEntries={["/validar/uuid-404"]}>
        <Routes>
          <Route path="/validar/:id" element={<Validar />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      await screen.findByText(/no existe una constancia con ese id/i),
    ).toBeInTheDocument();
  });

  test("should show error message if API fails or returns 500", async () => {
    (window.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(
      <MemoryRouter initialEntries={["/validar/uuid-500"]}>
        <Routes>
          <Route path="/validar/:id" element={<Validar />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      await screen.findByText(/ocurrió un error. intenta de nuevo/i),
    ).toBeInTheDocument();
  });

  test("should show certificate data when request is successful", async () => {
    const constanciaMock = {
      id: "uuid-123",
      participante: {
        folio: "2026-6767-67",
        nombre: "Karl",
        apellido_1: "Marx",
        apellido_2: "Engels",
      },
      curso: "Álgebra lineal",
      created_at: "2026-05-14T10:00:00Z",
    };

    (window.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => constanciaMock,
    });

    render(
      <MemoryRouter initialEntries={["/validar/uuid-123"]}>
        <Routes>
          <Route path="/validar/:id" element={<Validar />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      await screen.findByText(/constancia auténtica/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Karl Marx Engels")).toBeInTheDocument();
    expect(screen.getByText("2026-6767-67")).toBeInTheDocument();
    expect(screen.getByText("Álgebra lineal")).toBeInTheDocument();
  });
});
