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
    <div className="pt-10 px-2 md:px-16 flex flex-col items-center gap-6">
      <Card className="px-10 pb-16 pt-6">
        <h1 className="justify-center text-center heading-1 mb-8">
          {getGreeting()}, {user?.nombre}
        </h1>
        <div className="flex flex-row flex-wrap justify-center gap-6">
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
