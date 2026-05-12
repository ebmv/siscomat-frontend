import { Button, Card, Input, Toast } from "@siscomat/shared-ui";
import { faCog, faTrash, faWarning } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../components";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Badge,
  IconButton,
  Modal,
  ModalTitle,
  ModalActions,
  ModalIcon,
  Select,
} from "../components";
import useGestores from "../hooks/useGestores";
import { useEffect, useState } from "react";

export const Gestores = () => {
  const { user } = useAuth();
  const { gestores, fetchGestores, addGestor, deleteGestor, updateGestor } =
    useGestores();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [editingGestor, setEditingGestor] = useState<any>(null);
  const [gestorToDelete, setGestorToDelete] = useState<any>(null);
  const [toastConfig, setToastConfig] = useState<{
    mensaje: string;
    variant: "success" | "error";
  }>({ mensaje: "", variant: "success" });

  const [nombre, setNombre] = useState<string>("");
  const [apellido1, setApellido1] = useState<string>("");
  const [apellido2, setApellido2] = useState<string>("");
  const [correo, setCorreo] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [esAdmin, setEsAdmin] = useState<boolean>(false);

  const [errors, setErrors] = useState({
    nombre: "",
    apellido1: "",
    correo: "",
    password: "",
    general: "",
  });

  const roles = [
    { value: "false", label: "Gestor" },
    { value: "true", label: "Administrador" },
  ];

  useEffect(() => {
    fetchGestores();
  }, [fetchGestores]);

  useEffect(() => {
    document.title = "Gestores | Administración de SISCOMAT";
  }, []);

  const showToast = (
    mensaje: string,
    variant: "success" | "error" = "success",
  ) => {
    setToastConfig({ mensaje, variant });
  };

  const hideToast = () => {
    setToastConfig((prev) => ({ ...prev, mensaje: "" }));
  };

  const handleOpenCreate = () => {
    setEditingGestor(null);
    setNombre("");
    setApellido1("");
    setApellido2("");
    setCorreo("");
    setPassword("");
    setEsAdmin(false);
    setErrors({
      nombre: "",
      apellido1: "",
      correo: "",
      password: "",
      general: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (gestor: any) => {
    setEditingGestor(gestor);
    setNombre(gestor.nombre);
    setApellido1(gestor.apellido1);
    setApellido2(gestor.apellido2);
    setCorreo(gestor.correo);
    setPassword("");
    setEsAdmin(gestor.esAdmin);
    setErrors({
      nombre: "",
      apellido1: "",
      correo: "",
      password: "",
      general: "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    let newErrors = {
      nombre: "",
      apellido1: "",
      correo: "",
      password: "",
      general: "",
    };
    let hasError = false;
    if (!nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
      hasError = true;
    }
    if (!apellido1.trim()) {
      newErrors.apellido1 = "El primer apellido es obligatorio";
      hasError = true;
    }
    if (!correo.trim()) {
      newErrors.correo = "El correo es obligatorio";
      hasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correo)) {
        newErrors.correo = "El formato del correo no es válido.";
        hasError = true;
      }
    }
    if (!editingGestor && (!password || password.trim() === "")) {
      newErrors.password =
        "La contraseña es obligatoria para los usuarios nuevos.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setErrors({
      nombre: "",
      apellido1: "",
      correo: "",
      password: "",
      general: "",
    });
    try {
      var gestor = {
        nombre: nombre,
        apellido1: apellido1,
        apellido2: apellido2,
        correo: correo,
        passwordHash: password,
        esAdmin: esAdmin,
      };
      if (editingGestor) {
        await updateGestor(gestor, editingGestor.id);
        showToast("Usuario actualizado exitosamente.", "success");
      } else {
        await addGestor(gestor);
        showToast("Usuario creado exitosamente", "success");
      }
      setIsModalOpen(false);
    } catch (error: any) {
      const msg = error.message || "Error al guardar los datos";
      if (msg.toLowerCase().includes("correo")) {
        setErrors((prev) => ({ ...prev, correo: msg }));
      } else {
        showToast(msg, "error");
      }
    }
  };

  const handleOpenDelete = (gestor: any) => {
    setGestorToDelete(gestor);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!gestorToDelete) return;
    try {
      await deleteGestor(gestorToDelete.id);
      showToast("Usuario eliminado correctamente", "success");
      setIsConfirmOpen(false);
      setGestorToDelete(null);
    } catch (error: any) {
      showToast("Error al eliminar usuario", "error");
    }
  };

  return (
    <div className="pt-6 sm:pt-10 p-4 md:px-16 flex flex-col items-center gap-6">
      <Toast
        mensaje={toastConfig.mensaje}
        variant={toastConfig.variant}
        onClose={hideToast}
      />

      <Card className="px-6 py-8 sm:px-10 sm:pt-8 w-full max-w-5xl shadow-card">
        <div className="relative flex flex-col sm:flex-row items-center justify-center w-full mb-8 gap-4 sm:gap:0">
          <h1 className="heading-2 m-0 text-center">Gestión de usuarios</h1>
          <div className="sm:absolute sm:right-0">
            <Button onClick={handleOpenCreate}>Crear usuario</Button>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto overflow-x-auto w-full border border-light-2 rounded-lg shadow-sm">
          <Table>
            <TableHeader>
              <TableHead>Nombre</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Acciones</TableHead>
            </TableHeader>
            <TableBody>
              {gestores.map((gestor) => {
                const isCurrentUser = user?.id === gestor.id;
                return (
                  <TableRow key={gestor.id}>
                    <TableCell>
                      {gestor.nombre} {gestor.apellido1} {gestor.apellido2}
                    </TableCell>
                    <TableCell>{gestor.correo}</TableCell>
                    <TableCell>
                      <Badge
                        label={gestor.esAdmin ? "Admin" : "Gestor"}
                        variant={gestor.esAdmin ? "brand" : "light"}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-row items-center justify-center gap-3">
                        <IconButton
                          icon={faCog}
                          ariaLabel="Editar gestor"
                          onClick={() => handleOpenEdit(gestor)}
                        />
                        {!isCurrentUser && (
                          <IconButton
                            icon={faTrash}
                            variant="error"
                            ariaLabel="Eliminar gestor"
                            onClick={() => handleOpenDelete(gestor)}
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="2xl"
      >
        <div className="w-full flex flex-col">
          <div className="text-center mb-6">
            <ModalTitle
              title={editingGestor ? "Modificar usuario" : "Crear usuario"}
            />
          </div>

          <div className="flex flex-col gap-4 mb-8 text-left">
            <Input
              label="Nombre(s)"
              value={nombre}
              onChange={(e: any) => {
                setNombre(e.target.value);
                setErrors((prev) => ({ ...prev, nombre: "" }));
              }}
              error={errors.nombre}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Primer apellido"
                value={apellido1}
                onChange={(e: any) => {
                  setApellido1(e.target.value);
                  setErrors((prev) => ({ ...prev, apellido1: "" }));
                }}
                error={errors.apellido1}
              />
              <Input
                label="Segundo apellido"
                value={apellido2}
                onChange={(e: any) => setApellido2(e.target.value)}
              />
            </div>

            <Input
              label="Correo"
              type="email"
              value={correo}
              onChange={(e: any) => {
                setCorreo(e.target.value);
                setErrors((prev) => ({ ...prev, correo: "" }));
              }}
              error={errors.correo}
            />
            <Input
              label={"Contraseña"}
              type="password"
              value={password}
              onChange={(e: any) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
              error={errors.password}
            />

            <div className="flex flex-col gap-1.5">
              <label className="body-large text-dark-3">Rol</label>
              <Select
                options={roles}
                value={esAdmin ? "true" : "false"}
                onChange={(value) => setEsAdmin(value === "true")}
              />
            </div>
          </div>

          <ModalActions>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="success" onClick={handleSave}>
              {editingGestor ? "Guardar cambios" : "Crear usuario"}
            </Button>
          </ModalActions>
        </div>
      </Modal>

      <Modal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}>
        <div className="w-full flex flex-col items-center">
          <ModalIcon variant="error" icon={faWarning} />
          <ModalTitle title="Eliminar usuario" />

          <p className="label-normal text-center mt-2 mb-6">
            ¿Está seguro de que desea eliminar al usuario{" "}
            <strong className="text-dark-1">{gestorToDelete?.correo}</strong>?
          </p>

          <ModalActions>
            <div className="w-40">
              <Button
                variant="secondary"
                onClick={() => setIsConfirmOpen(false)}
              >
                Cancelar
              </Button>
            </div>
            <div className="w-40">
              <Button variant="error" onClick={handleDelete}>
                Sí, eliminar
              </Button>
            </div>
          </ModalActions>
        </div>
      </Modal>
    </div>
  );
};
