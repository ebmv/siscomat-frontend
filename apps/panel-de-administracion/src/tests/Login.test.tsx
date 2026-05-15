import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { expect, describe, test, vi } from "vitest";
import { Login } from "../pages/Login";
import { BrowserRouter } from "react-router-dom";

const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock("../components", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Login Component", () => {
  test("should show validation errors when fields are empty", async () => {
    render(<Login />, { wrapper: BrowserRouter });

    const submitBtn = screen.getByRole("button", { name: /iniciar sesión/i });
    fireEvent.click(submitBtn);

    expect(
      await screen.findByText(/por favor ingresa tu correo/i),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/por favor ingresa tu contraseña/i),
    ).toBeInTheDocument();

    expect(mockLogin).not.toHaveBeenCalled();
  });

  test("should show general error message on failed login", async () => {
    mockLogin.mockResolvedValueOnce({
      success: false,
      msg: "Credenciales inválidas",
    });
    render(<Login />, { wrapper: BrowserRouter });

    fireEvent.change(screen.getByLabelText(/correo/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "password123" },
    });
    const submitBtn = screen.getByRole("button", { name: /iniciar sesión/i });
    fireEvent.click(submitBtn);

    expect(
      await screen.findByText(/credenciales inválidas/i),
    ).toBeInTheDocument();
  });

  test("button should become disabled while loading", async () => {
    mockLogin.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ success: true }), 100),
        ),
    );
    render(<Login />, { wrapper: BrowserRouter });

    fireEvent.change(screen.getByLabelText(/correo/i), {
      target: { value: "admin@admin.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "admin123" },
    });
    const submitBtn = screen.getByRole("button", { name: /iniciar sesión/i });
    fireEvent.click(submitBtn);

    expect(submitBtn).toBeDisabled();
    expect(screen.getByText(/iniciando.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(submitBtn).not.toBeDisabled();
    });
  });

  test("should navigate to home on successful login", async () => {
    mockLogin.mockResolvedValueOnce({ success: true });
    render(<Login />, { wrapper: BrowserRouter });

    fireEvent.change(screen.getByLabelText(/correo/i), {
      target: { value: "admin@admin.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "admin123" },
    });
    const submitBtn = screen.getByRole("button", { name: /iniciar sesión/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});
