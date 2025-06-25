import PropTypes from "prop-types";
import { useCallback } from "react";
import {
    Dropdown,
    DropdownItem,
    Button,
    DropdownTrigger,
    DropdownMenu,
    User
} from "@heroui/react";
import defaultAvatar from "../../assets/usuario.png";
import menu_icon from "../../assets/aplicaciones.png";
import watch_icon from "../../assets/ver.png";
import update_icon from "../../assets/actualizar.png";
import delete_icon from "../../assets/eliminar.png";

const statusColors = {
    Activo: "bg-green",
    Completado: "bg-blue-500",
    Fallido: "bg-red",
};

const ReqIdentificationCell = ({
    reqIdentification,
    columnKey,
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
                            {reqIdentification.subject?.subject_name || "Estarán disponibles al completar la identificación"}
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
                                : "Estarán disponibles al completar la identificación"}
                        </p>
                    </div>
                );

            case "jurisdiction":
                return (
                    <div className="flex flex-col">
                        <p className="text-sm capitalize">
                            {reqIdentification.jurisdiction || "Estarán disponibles al completar la identificación"}
                        </p>
                    </div>
                );

            case "state":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">
                            {!reqIdentification.jurisdiction
                                ? "Estarán disponibles al completar la identificación"
                                : reqIdentification.state || "N/A"}
                        </p>
                    </div>
                );

            case "municipality":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">
                            {!reqIdentification.jurisdiction
                                ? "Estarán disponibles al completar la identificación"
                                : reqIdentification.municipality || "N/A"}
                        </p>
                    </div>
                );

            case "status": {
                const status = reqIdentification.status || "N/A";
                const colorClass = statusColors[status] || "bg-gray-400";

                return (
                    <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${colorClass}`} />
                        <span className="text-sm font-semibold capitalize">{status}</span>
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
                        description={user?.gmail || "SIN DEFENIR"}
                        name={user?.name || "SIN DEFENIR"}
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
                            <DropdownMenu aria-label="Opciones de identificación" variant="light">
                                <DropdownItem
                                    aria-label="Ver Detalle"
                                    startContent={<img src={watch_icon} alt="Watch" className="w-4 h-4" />}
                                >
                                    <p className="font-normal text-primary">Ver Identificación</p>
                                </DropdownItem>

                                <DropdownItem
                                    aria-label="Editar"
                                    startContent={<img src={update_icon} alt="Edit" className="w-4 h-4" />}
                                    onPress={() => openEditModal(reqIdentification)}
                                >
                                    <p className="font-normal text-primary">Editar Identificación</p>
                                </DropdownItem>

                                <DropdownItem
                                    aria-label="Eliminar"
                                    startContent={<img src={delete_icon} alt="Delete" className="w-4 h-4" />}
                                    onPress={() => handleDelete(reqIdentification.id)}
                                    className="hover:bg-red/20"
                                >
                                    <p className="font-normal text-red">Eliminar Identificación</p>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );

            default:
                return null;
        }
    }, [columnKey, reqIdentification, openEditModal, handleDelete]);

    return renderCell();
};

ReqIdentificationCell.propTypes = {
    reqIdentification: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        name: PropTypes.string,
        description: PropTypes.string,
        subject: PropTypes.shape({
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
            username: PropTypes.string,
            gmail: PropTypes.string,
            name: PropTypes.string,
            profile_picture: PropTypes.string,
        }),
    }).isRequired,
    columnKey: PropTypes.string.isRequired,
    openEditModal: PropTypes.func.isRequired,
    goToDetails: PropTypes.func,
    handleDelete: PropTypes.func.isRequired,
};

export default ReqIdentificationCell;
