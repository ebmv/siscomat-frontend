import { render, screen, fireEvent } from "@testing-library/react";
import { expect, vi, describe, test, beforeEach, afterEach } from "vitest";
import { Home } from "../pages/Home";
import { BrowserRouter } from "react-router-dom";

const mockNavigate = vi.fn();

let mockUser = { nombre: "Karl", esAdmin: false };

vi.mock("../components", () => ({
  useAuth: () => ({
    user: mockUser,
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

describe("Home Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser = { nombre: "Karl", esAdmin: false };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("should show basic options and hide admin option for non-admin users", () => {
    render(<Home />, { wrapper: BrowserRouter });
    expect(screen.getByText(/gestionar plantillas/i)).toBeInTheDocument();
    expect(screen.getByText(/generar constancias/i)).toBeInTheDocument();
    expect(screen.queryByText(/gestionar usuarios/i)).not.toBeInTheDocument();
  });

  test("should show admin option for admin users", () => {
    mockUser.esAdmin = true;
    render(<Home />, { wrapper: BrowserRouter });
    expect(screen.getByText(/gestionar usuarios/i)).toBeInTheDocument();
  });

  test("should navigate to correct pages on action card click", () => {
    render(<Home />, { wrapper: BrowserRouter });
    fireEvent.click(screen.getByText(/gestionar plantillas/i));
    expect(mockNavigate).toHaveBeenCalledWith("/plantillas");
    fireEvent.click(screen.getByText(/generar constancias/i));
    expect(mockNavigate).toHaveBeenCalledWith("/constancias");
  });

  test("should navigate to user management for admin users", () => {
    mockUser.esAdmin = true;
    render(<Home />, { wrapper: BrowserRouter });
    fireEvent.click(screen.getByText(/gestionar usuarios/i));
    expect(mockNavigate).toHaveBeenCalledWith("/gestores");
  });

  test("should say good morning at 9:00 AM", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 0, 1, 9)); // Jan 1, 2024, 9:00 AM

    render(<Home />, { wrapper: BrowserRouter });
    expect(screen.getByText(/buenos días, karl/i)).toBeInTheDocument();
  });

  test("should say good afternoon at 3:00 PM", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 0, 1, 15)); // Jan 1, 2024, 3:00 PM

    render(<Home />, { wrapper: BrowserRouter });
    expect(screen.getByText(/buenas tardes, karl/i)).toBeInTheDocument();
  });

  test("should say good evening at 8:00 PM", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 0, 1, 20)); // Jan 1, 2024, 8:00 PM

    render(<Home />, { wrapper: BrowserRouter });
    expect(screen.getByText(/buenas noches, karl/i)).toBeInTheDocument();
  });
});
