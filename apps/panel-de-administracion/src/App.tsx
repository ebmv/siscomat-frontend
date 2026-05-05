import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login, Home, Plantillas, Gestores } from "./pages";
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
                <Route path="/plantillas" element={<Plantillas />} />
                // TODO: agregar ruta para constancias
              </Route>

              <Route element={<ProtectedRoute requiresAdmin={false} />}>
                <Route path="/gestores" element={<Gestores />} />
              </Route>
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
