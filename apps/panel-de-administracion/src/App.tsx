import { useState } from "react";
import {
  Navbar,
  Select,
  Badge,
  IconButton,
  ListContainer,
  ListElement,
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Modal,
  ModalIcon,
  ModalTitle,
  ModalActions,
  FileUploader,
} from "./components";
import { Card, Button } from "@siscomat/shared-ui";
import { faCheck, faCog, faTrash } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [rolSeleccionado, setRolSeleccionado] = useState("Administrador");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const options = [
    { value: "admin", label: "Administrador" },
    { value: "gestor", label: "Gestor" },
  ];
  // TODO: reemplazar todo
  return (
    <div className="min-h-screen bg-light-2 p-10 pt-24 flex flex-col items-center gap-6">
      <Navbar></Navbar>
      <Card className="px-10 py-4 gap-8 items-center">
        <h1 className="heading-1 text-brand-primary">
          Panel de administración
        </h1>
        <h2 className="heading-2">Prueba de componentes</h2>
        <Table>
          <TableHeader>
            <TableHead>Nombre</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Acciones</TableHead>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>ola</TableCell>
              <TableCell>jgbdfhjb</TableCell>
              <TableCell>
                <Badge label="Gestor"></Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2 justify-center">
                  <IconButton
                    icon={faCog}
                    ariaLabel="Editar gestor"
                    onClick={() => console.log("ola")}
                  />
                  <IconButton
                    icon={faTrash}
                    variant="error"
                    ariaLabel="Eliminar gestor"
                    onClick={() => console.log("ola")}
                  />
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>ola</TableCell>
              <TableCell>jgbdfhjb</TableCell>
              <TableCell>
                <Badge variant="brand" label="Admin"></Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2 justify-center">
                  <IconButton
                    icon={faCog}
                    ariaLabel="Editar gestor"
                    onClick={() => console.log("ola")}
                  />
                  <IconButton
                    icon={faTrash}
                    variant="error"
                    ariaLabel="Eliminar gestor"
                    onClick={() => console.log("ola")}
                  />
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Select
          options={options}
          value={rolSeleccionado}
          onChange={setRolSeleccionado}
        ></Select>

        <Card variant="white" className="p-4 max-w-xs">
          <p className="heading-5 pb-4">Plantillas</p>
          <ListContainer>
            <ListElement
              nombre="plantilla 1"
              fechaCreacion="30/04/26"
            ></ListElement>
            <ListElement
              nombre="plantilla 1"
              fechaCreacion="30/04/26"
            ></ListElement>
            <ListElement
              nombre="plantilla 1"
              fechaCreacion="30/04/26"
            ></ListElement>
            <ListElement
              nombre="plantilla 1"
              fechaCreacion="30/04/26"
            ></ListElement>
          </ListContainer>
        </Card>
      </Card>
      <Button onClick={() => setIsModalOpen(true)}>Abrir modal</Button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalIcon icon={faCheck} variant="success" />
        <ModalTitle title="Probando" />
        <p className="label-normal text-dark-1">aaaaaaa ola</p>
        <ModalActions>
          <Button onClick={() => setIsModalOpen(false)} variant="secondary">
            Cerrar
          </Button>
          <Button onClick={() => setIsModalOpen(false)} variant="success">
            Aceptar
          </Button>
        </ModalActions>
      </Modal>
      <FileUploader />
    </div>
  );
}

export default App;
