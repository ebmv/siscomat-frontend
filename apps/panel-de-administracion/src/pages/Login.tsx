import { Card, Button, Input } from "@siscomat/shared-ui";

export const Login = () => {
  return (
    <div className="min-h-screen bg-light-2 p-8 px-2 md:px-16 flex flex-col items-center gap-6">
      <Card className="px-4 py-4 gap-8 items-center">
        <h1 className="heading-1 text-center py-10">Login</h1>
        <div className="flex flex-col gap-4 w-md">
          <Input label="Correo" placeholder="ejemplo@unison.mx" />
          <Input label="Contraseña" placeholder="*********" />
        </div>
        <div className="py-10">
          <Button>Iniciar sesión</Button>
        </div>
      </Card>
    </div>
  );
};
