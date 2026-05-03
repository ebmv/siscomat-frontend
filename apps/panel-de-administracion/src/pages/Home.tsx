import { Card } from "@siscomat/shared-ui";
import { ActionCard } from "../components/ActionCard";
import { faAward, faPalette, faUsers } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components";

export const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getGreeting = () => {
    const time = new Date().getHours();
    if (time < 12) return "Buenos días";
    if (time < 19) return "Buenas tardes";
    return "Buenas noches";
  };
  return (
    <div className="pt-6 sm:pt-10 p-4 md:px-16 flex flex-col items-center gap-6">
      <Card className="px-16 py-8 sm:px-10 sm:pt-6 lg:min-h-[70vh] w-full max-w-6xl">
        <h1 className="justify-center text-center heading-2 sm:heading-1 mb-8 sm:mb-12">
          {getGreeting()}, {user?.nombre}
        </h1>
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6 w-full">
          <ActionCard
            title="Gestionar plantillas"
            icon={faPalette}
            onClick={() => navigate("/plantillas")}
          />
          <ActionCard
            title="Generar constancias"
            icon={faAward}
            onClick={() => navigate("/constancias")}
          />
          {user?.esAdmin && (
            <ActionCard
              title="Gestionar usuarios"
              icon={faUsers}
              onClick={() => navigate("/gestores")}
            />
          )}
        </div>
      </Card>
    </div>
  );
};
