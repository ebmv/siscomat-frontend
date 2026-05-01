import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import ConsultarFlow from "./pages/ConsultarFlow";
import Validar from "./pages/Validar";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ConsultarFlow />} />
          <Route path="/validar/:id" element={<Validar />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;