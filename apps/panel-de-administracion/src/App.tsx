import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login, Home } from "./pages";
import {
  Navbar,
  AuthProvider,
  ProtectedRoute,
  PublicRoute,
} from "./components";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-light-2">
          <Navbar />
          <main className="flex-1 w-full flex flex-col">
            <Routes>
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Home />} />
                // TODO: agregar rutas para plantillas y constancias
              </Route>

              <Route element={<ProtectedRoute requiresAdmin={true} />}>
                // TODO: agregar ruta para gestion de usuarios
              </Route>
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
