import { useState } from "react";
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
    <div className="min-h-screen bg-light-2 p-8 px-2 md:px-16 flex flex-col items-center gap-6">
      <Card className="px-4 py-4 gap-8 items-center">
        <h1 className="heading-1 text-center py-10">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-md">
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
        </form>
        <div className="py-10">
          <Button type="submit" disabled={loading} onClick={handleSubmit}>
            {loading ? "Iniciando..." : "Iniciar sesión"}
          </Button>
        </div>
      </Card>
    </div>
  );
};
