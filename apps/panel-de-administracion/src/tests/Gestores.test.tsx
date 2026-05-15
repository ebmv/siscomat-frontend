import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { expect, vi, describe, test, beforeEach } from "vitest";
import { Gestores } from "../pages/Gestores";

const mockFetchGestores = vi.fn();
const mockAddGestor = vi.fn();
const mockUpdateGestor = vi.fn();
const mockDeleteGestor = vi.fn();

vi.mock("../hooks/useGestores", () => ({
  default: () => ({
    gestores: [
      {
        id: 1,
        nombre: "Admin",
        apellido1: "Admin",
        apellido2: "",
        correo: "admin@admin.com",
        esAdmin: true,
      },
      {
        id: 2,
        nombre: "Karl",
        apellido1: "Marx",
        apellido2: "",
        correo: "prueba@example.com",
        esAdmin: false,
      },
    ],
    fetchGestores: mockFetchGestores,
    addGestor: mockAddGestor,
    updateGestor: mockUpdateGestor,
    deleteGestor: mockDeleteGestor,
  }),
}));

vi.mock("../components", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as any),
    useAuth: () => ({ user: { id: 1, nombre: "Admin" } }),
  };
});

describe("Gestores Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should load table and not show delete button for current user", () => {
    render(<Gestores />);

    expect(mockFetchGestores).toHaveBeenCalled();

    expect(screen.getByText(/admin admin/i)).toBeInTheDocument();
    expect(screen.getByText(/karl marx/i)).toBeInTheDocument();

    const deleteBtns = screen.getAllByRole("button", {
      name: /eliminar gestor/i,
    });
    expect(deleteBtns.length).toBe(1);
  });

  test("should show validation errors when creating empty user", async () => {
    render(<Gestores />);

    fireEvent.click(screen.getByRole("button", { name: /crear usuario/i }));
    expect(
      await screen.findByRole("heading", { name: "Crear usuario" }),
    ).toBeInTheDocument();

    const saveBtn = screen.getAllByRole("button", {
      name: /crear usuario/i,
    })[1];
    fireEvent.click(saveBtn);

    expect(
      await screen.findByText(/el nombre es obligatorio/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/el primer apellido es obligatorio/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/el correo es obligatorio/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /la contraseña es obligatoria para los usuarios nuevos/i,
      ),
    ).toBeInTheDocument();

    expect(mockAddGestor).not.toHaveBeenCalled();
  });

  test("should allow editing user without requiring password and calling API", async () => {
    render(<Gestores />);

    const editingButtons = screen.getAllByRole("button", {
      name: /editar gestor/i,
    });
    fireEvent.click(editingButtons[1]);

    expect(await screen.findByText("Modificar usuario")).toBeInTheDocument();

    const apellido2Input = screen.getByLabelText(/segundo apellido/i);
    fireEvent.change(apellido2Input, { target: { value: "Prueba" } });

    const saveBtn = screen.getByRole("button", { name: /guardar cambios/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockUpdateGestor).toHaveBeenCalledWith(
        expect.objectContaining({
          apellido2: "Prueba",
          correo: "prueba@example.com",
        }),
        2,
      );
    });
  });

  test("should open confirm modal and call API when deleting", async () => {
    render(<Gestores />);

    const deleteBtn = screen.getByRole("button", { name: /eliminar gestor/i });
    fireEvent.click(deleteBtn);

    expect(
      await screen.findByText(/¿está seguro de que desea eliminar al usuario/i),
    ).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", { name: /^sí, eliminar$/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(mockDeleteGestor).toHaveBeenCalledWith(2);
    });
  });
});
