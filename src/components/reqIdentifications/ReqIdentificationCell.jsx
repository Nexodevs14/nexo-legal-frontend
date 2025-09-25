import PropTypes from "prop-types";
import { useCallback } from "react";
import {
  Dropdown,
  DropdownItem,
  Button,
  DropdownTrigger,
  DropdownMenu,
  User,
  CircularProgress,
} from "@heroui/react";
import defaultAvatar from "../../assets/usuario.png";
import menu_icon from "../../assets/aplicaciones.png";
import watch_icon from "../../assets/ver.png";
import update_icon from "../../assets/actualizar.png";
import delete_icon from "../../assets/eliminar.png";

/**
 * Status colors mapping for different requirement identification states.
 *
 * @constant {Object}
 * @property {string} Activo - Color class for active status.
 * @property {string} Fallido - Color class for failed status.
 * @property {string} Completado - Color class for completed status.
 */
const statusBgColors = {
  Activo: "bg-green",
  Completado: "bg-primary",
  Fallido: "bg-red",
};

/** * Status colors mapping for different requirement identification states.
 * @constant {Object}
 * @property {string} Activo - Color class for active status.
 * @property {string} Fallido - Color class for failed status.
 * @property {string} Completado - Color class for completed status.
 *
 */
const statusProgressColors = {
  Activo: "success",
  Completado: "primary",
  Fallido: "danger",
};

/**
 * ReqIdentificationCell component
 *
 * Functional component used for rendering table cells based on column keys.
 * It handles various types of data in the table, including requirement identification details and actions.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.requirement - The requirement identification data object containing all relevant details for a row.
 * @param {string} props.columnKey - The column key that determines which data should be rendered in the cell.
 * @param {Function} props.openEditModal - Function to open the edit modal for the requirement identification.
 * @param {Function} props.viewRequirementDetails - Function to navigate to requirement identification details.
 * @param {Function} props.handleDelete - Function to handle deletion of the requirement identification.
 * @returns {JSX.Element|null} Rendered cell content based on the column key.
 */
const ReqIdentificationCell = ({
  reqIdentification,
  columnKey,
  viewRequirementDetails,
  openEditModal,
  handleDelete,
}) => {
  const renderCell = useCallback(() => {
    switch (columnKey) {
      case "name":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {reqIdentification.name || "N/A"}
            </p>
          </div>
        );

      case "description":
        return (
          <div className="flex flex-col">
            <p className="text-sm capitalize">
              {reqIdentification.description || "N/A"}
            </p>
          </div>
        );

      case "subject":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {reqIdentification.subject?.subject_name || "Por definirse"}
            </p>
          </div>
        );

      case "aspects":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {reqIdentification.aspects && reqIdentification.aspects.length > 0
                ? reqIdentification.aspects.map((aspect, index) => (
                    <span key={aspect.aspect_id}>
                      {aspect.aspect_name}
                      {index < reqIdentification.aspects.length - 1 ? ", " : ""}
                    </span>
                  ))
                : "Por definirse"}
            </p>
          </div>
        );

      case "jurisdiction":
        return (
          <div className="flex flex-col">
            <p className="text-sm capitalize">
              {reqIdentification.jurisdiction || "Por definirse"}
            </p>
          </div>
        );

      case "state":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {!reqIdentification.jurisdiction
                ? "Por definirse"
                : reqIdentification.state || "N/A"}
            </p>
          </div>
        );

      case "municipality":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {!reqIdentification.jurisdiction
                ? "Por definirse"
                : reqIdentification.municipality || "N/A"}
            </p>
          </div>
        );

      case "status": {
        const status = reqIdentification.status || "N/A";
        const progress = reqIdentification.progress;
        const colorBgClass = statusBgColors[status] || "bg-gray-400";
        const value = progress ? parseFloat(progress) : 0;
        const colorProgressClass = statusProgressColors[status] || "primary";

        return (
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${colorBgClass}`} />
            <span className="text-sm font-semibold capitalize">{status}</span>
            {progress ? (
              <CircularProgress
                aria-label="Cargando..."
                color={colorProgressClass}
                showValueLabel={true}
                size="lg"
                value={value}
              />
            ) : null}
          </div>
        );
      }

      case "createdAt":
        return (
          <div className="flex flex-col">
            <span className="text-sm">
              {reqIdentification.createdAt || "N/A"}
            </span>
          </div>
        );

      case "user": {
        const user = reqIdentification.user;

        return (
          <User
            avatarProps={{
              radius: "lg",
              src: user?.profile_picture || defaultAvatar,
            }}
            description={user?.gmail || "SIN USUARIO"}
            name={user?.name || "SIN USUARIO"}
          />
        );
      }

      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="light"
                  color="primary"
                  size="sm"
                  isIconOnly
                  aria-label="Opciones"
                >
                  <img src={menu_icon} alt="Menu" className="w-6 h-6" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Opciones de identificación"
                variant="light"
              >
                <DropdownItem
                  aria-label="Ver Identificación"
                  startContent={
                    <img
                      src={watch_icon}
                      alt="Watch"
                      className="w-4 h-4 flex-shrink-0"
                    />
                  }
                  className="hover:bg-primary/20"
                  key="watch"
                  onPress={() => viewRequirementDetails(reqIdentification.id)}
                  textValue="Ver Identificación"
                >
                  <p className="font-normal text-primary">Ver Identificación</p>
                </DropdownItem>

                <DropdownItem
                  aria-label="Editar Identificación"
                  startContent={
                    <img
                      src={update_icon}
                      alt="Edit Icon"
                      className="w-4 h-4 flex-shrink-0"
                    />
                  }
                  className="hover:bg-primary/20"
                  key="update"
                  textValue="Editar Identificación"
                  onPress={() => openEditModal(reqIdentification)}
                >
                  <p className="font-normal text-primary">
                    Editar Identificación
                  </p>
                </DropdownItem>

                <DropdownItem
                  aria-label="Eliminar"
                  startContent={
                    <img src={delete_icon} alt="Delete" className="w-4 h-4" />
                  }
                  onPress={() => handleDelete(reqIdentification.id)}
                  className="hover:bg-red/20"
                >
                  <p className="font-normal text-red">
                    Eliminar Identificación
                  </p>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );

      default:
        return null;
    }
  }, [
    columnKey,
    reqIdentification,
    viewRequirementDetails,
    openEditModal,
    handleDelete,
  ]);

  return renderCell();
};

ReqIdentificationCell.propTypes = {
  reqIdentification: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string,
    description: PropTypes.string,
    subject: PropTypes.shape({
      subject_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      subject_name: PropTypes.string,
    }),
    aspects: PropTypes.arrayOf(
      PropTypes.shape({
        aspect_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        aspect_name: PropTypes.string,
      })
    ),
    jurisdiction: PropTypes.string,
    state: PropTypes.string,
    municipality: PropTypes.string,
    status: PropTypes.string,
    created_at: PropTypes.string,
    user: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      name: PropTypes.string,
      gmail: PropTypes.string,
      profile_picture: PropTypes.string,
    }),
  }).isRequired,
  columnKey: PropTypes.string.isRequired,
  viewRequirementDetails: PropTypes.func.isRequired,
  openEditModal: PropTypes.func.isRequired,
  goToDetails: PropTypes.func,
  handleDelete: PropTypes.func.isRequired,
};

export default ReqIdentificationCell;
