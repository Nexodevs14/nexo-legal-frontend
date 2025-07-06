import PropTypes from "prop-types";
import { Input, Button, ScrollShadow } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import search_icon from "../../../assets/busqueda_blue.png";
import mas_icon from "../../../assets/mas.png";
import flecha_icon from "../../../assets/flecha_izquierda.png";
import download_icon from "../../../assets/descargar_white.png";

/**
 * TopContent component for filtering requirements in a Requirement Identification.
 *
 * Renders search inputs for both associated requirement name and original requirement name.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.config - Configuration object with filter values and handlers.
 * @param {Object} props.config.reqIdentification - The requirement identification object.
 * @param {string} props.config.filterByName - Current value of the associated requirement name filter.
 * @param {string} props.config.filterByRequirementName - Current value of the original requirement name filter.
 * @param {string} props.config.filterByLegalBasisName - Current value of the legal basis name filter.
 * @param {Function} props.config.onFilterByName - Handler for changing associated requirement name filter.
 * @param {Function} props.config.onFilterByRequirementName - Handler for changing original requirement name filter.
 * @param {Function} props.config.onFilterByLegalBasisName - Handler for changing legal basis name filter.
 * @param {Function} props.config.onClear - Clears all filters.
 * @param {number} props.config.totalRequirements - Total number of filtered requirements.
 *
 * @returns {JSX.Element} Rendered TopContent component.
 */
function TopContent({ config }) {
  const {
    reqIdentification,
    filterByRequirementName,
    filterByLegalBasisName,
    filterByName,
    onFilterByRequirementName,
    onFilterByName,
    onFilterByLegalBasisName,
    onClear,
    totalRequirements,
  } = config;
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/req_identifications");
  };

  return (
    <div>
      <ScrollShadow
        orientation="vertical"
        className="relative -mt-8 mb-8 max-w-xs sm:max-w-md md:max-w-xl mx-auto text-center max-h-20 overflow-y-auto overflow-x-hidden"
      >
        <h1 className="font-semibold text-primary text-sm lg:text-lg">
          Requerimientos de la Identificación:
          <span className="block font-thin text-gray-800 text-sm mt-1">
            {reqIdentification.name}
          </span>
        </h1>
      </ScrollShadow>

      <div className="flex flex-col gap-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          <Button
            color="primary"
            variant="solid"
            className="w-full"
            startContent={
              <img
                src={flecha_icon}
                alt="Back Icon"
                className="w-6 h-6 flex-shrink-0"
              />
            }
            onPress={handleBack}
          >
            Volver
          </Button>

          <Input
            color="primary"
            variant="faded"
            isClearable
            value={filterByName}
            className="w-full"
            placeholder="Buscar por nombre..."
            startContent={
              <img src={search_icon} alt="Buscar" className="w-4 h-4" />
            }
            onClear={onClear}
            onValueChange={onFilterByName}
          />
          <Input
            color="primary"
            variant="faded"
            isClearable
            value={filterByRequirementName}
            className="w-full"
            placeholder="Buscar por requerimiento..."
            startContent={
              <img src={search_icon} alt="Buscar" className="w-4 h-4" />
            }
            onClear={onClear}
            onValueChange={onFilterByRequirementName}
          />
          <Input
            color="primary"
            variant="faded"
            isClearable
            value={filterByLegalBasisName}
            className="w-full"
            placeholder="Buscar por fundamento..."
            startContent={
              <img src={search_icon} alt="Buscar" className="w-4 h-4" />
            }
            onClear={onClear}
            onValueChange={onFilterByLegalBasisName}
          />
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
          <span className="text-default-400">
            Requerimientos totales: {totalRequirements}
          </span>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto sm:ml-auto">
            <Button
              color="primary"
              className="w-full sm:w-auto"
              endContent={
                <img
                  src={mas_icon}
                  alt="Add Icon"
                  className="w-4 h-4 flex-shrink-0"
                />
              }
            >
              Nuevo Requerimiento
            </Button>

            <Button
              className="bg-secondary text-white w-full sm:w-auto"
              endContent={
                <img
                  src={download_icon}
                  alt="Download Icon"
                  className="w-4 h-4 flex-shrink-0 object-contain"
                />
              }
            >
              Exportar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

TopContent.propTypes = {
  config: PropTypes.shape({
    reqIdentification: PropTypes.object.isRequired,
    filterByName: PropTypes.string.isRequired,
    filterByRequirementName: PropTypes.string.isRequired,
    filterByLegalBasisName: PropTypes.string.isRequired,
    onFilterByName: PropTypes.func.isRequired,
    onFilterByRequirementName: PropTypes.func.isRequired,
    onFilterByLegalBasisName: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    totalRequirements: PropTypes.number.isRequired,
  }).isRequired,
};

export default TopContent;
