import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login, Home } from "./pages";
import { Navbar, AuthProvider, ProtectedRoute } from "./components";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            // TODO: agregar rutas para plantillas y constancias
          </Route>

          <Route element={<ProtectedRoute requiresAdmin={true} />}>
            // TODO: agregar ruta para gestion de usuarios
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
