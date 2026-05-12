import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components";
import { Card, Button, Input } from "@siscomat/shared-ui";

export const Login = () => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    correo: "",
    password: "",
    general: "",
  });
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Iniciar sesión | Administración de SISCOMAT";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ correo: "", password: "", general: "" });

    let errors = false;
    const newErrors = { correo: "", password: "", general: "" };

    if (!correo.trim()) {
      newErrors.correo = "Por favor ingresa tu correo.";
      errors = true;
    }
    if (!password.trim()) {
      newErrors.password = "Por favor ingresa tu contraseña.";
      errors = true;
    }

    if (errors) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const result = await login(correo, password);
    setLoading(false);

    if (result.success) {
      navigate("/");
    } else {
      setErrors({
        ...newErrors,
        general: result.msg || "Error al iniciar sesión",
      });
    }
  };

  return (
    <div className="min-h-screen bg-light-2 p-4 sm:p-8 flex flex-col items-center justify-center">
      <Card className="px-6 py-10 sm:px-10 sm:py-12 lg:py-16 gap-8 lg:gap-10 items-center w-full max-w-md lg:max-w-none lg:w-[60%] lg:min-h-[80vh]">
        <h1 className="heading-1 text-center ">Login</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full lg:max-w-md"
        >
          <Input
            label="Correo"
            type="email"
            placeholder="ejemplo@unison.mx"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            error={errors.correo}
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="*********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          {errors.general && (
            <div className="text-error-primary label-small w-full text-center mt-2">
              {errors.general}
            </div>
          )}
          <div className="w-full mt-4 lg:mt-8">
            <Button type="submit" disabled={loading} onClick={handleSubmit}>
              {loading ? "Iniciando..." : "Iniciar sesión"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
