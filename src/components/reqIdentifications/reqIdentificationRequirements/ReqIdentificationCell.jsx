import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
    Dropdown,
    DropdownItem,
    Button,
    DropdownTrigger,
    DropdownMenu,
    Tooltip
} from "@heroui/react";
import LegalVerbsTable from "./LegalVerbsTable";
import RequirementTypesTable from "./RequirementTypesTable";
import menu_icon from "../../../assets/aplicaciones.png";
import update_icon from "../../../assets/actualizar.png";
import delete_icon from "../../../assets/eliminar.png";
import watch_icon from "../../../assets/ver.png";

/**
 * ReqIdentificationCell component
 *
 * Functional component used for rendering table rows of requirement identification.
 * It displays data based on column keys and allows expansion to show legal verbs and requirement types.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.item - The requirement identification object with nested requirement, types, verbs and identifiers.
 * @param {Array} props.columns - The table column configuration.
 * @param {Function} props.openModalDescription - Callback to open a modal showing description content.
 * @param {Function} props.openEditModal - Callback to open the edit modal.
 * @param {Function} props.handleDelete - Callback to handle delete action.
 * @returns {JSX.Element} Rendered table row with collapsible content.
 */
export default function ReqIdentificationCell({
    item,
    columns,
    openModalDescription,
    //openEditModal,
    //handleDelete,
}) {
    const {
        requirement,
        legalVerbs,
        requirementTypes,
        reqIdentificationId,
        requirementName,
    } = item;

    const [isExpanded, setIsExpanded] = useState(false);
    const [showLegalVerbs, setShowLegalVerbs] = useState(false);
    const [showRequirementTypes, setShowRequirementTypes] = useState(false);

    const toggleExpansion = () => setIsExpanded((prev) => !prev);

    const renderCell = useCallback(
        (columnKey) => {
            switch (columnKey) {
                case "expand":
                    return (
                        <div className="flex items-center gap-2 text-sm text-gray-800">
                            {isExpanded ? (
                                <KeyboardArrowUpIcon fontSize="small" />
                            ) : (
                                <KeyboardArrowDownIcon fontSize="small" />
                            )}
                        </div>
                    );

                case "reqIdentificationId":
                    return (
                        <div className="text-sm text-gray-700">
                            {reqIdentificationId ?? "N/A"}
                        </div>
                    );

                case "requirement_number":
                    return (
                        <div className="text-sm text-gray-700">
                            {requirement.requirement_number ?? "N/A"}
                        </div>
                    );

                case "requirementName":
                    return (
                        <div className="text-sm text-gray-700">
                            {requirementName ?? "N/A"}
                        </div>
                    );

                case "requirement_name":
                    return (
                        <div className="text-sm text-gray-700">
                            {requirement.requirement_name ?? "N/A"}
                        </div>
                    );

                case "requirement_condition":
                    return (
                        <div className="text-sm text-gray-700">
                            {requirement.condition ?? "N/A"}
                        </div>
                    );

                case "evidence":
                    return (
                        <div className="text-sm text-gray-700">
                            {requirement.formatted_evidence ||
                                requirement.evidence ||
                                "N/A"}
                        </div>
                    );

                case "periodicity":
                    return (
                        <div className="text-sm text-gray-700">
                            {requirement.periodicity ?? "N/A"}
                        </div>
                    );

                case "subject":
                    return (
                        <div className="text-sm text-gray-700">
                            {requirement.subject?.subject_name ?? "N/A"}
                        </div>
                    );

                case "aspects":
                    return (
                        <div className="text-sm text-gray-700">
                            {requirement.aspects?.map((a, i) => (
                                <span key={a.aspect_id}>
                                    {a.aspect_name}
                                    {i < requirement.aspects.length - 1 ? ", " : ""}
                                </span>
                            )) ?? "N/A"}
                        </div>
                    );

                case "acceptance_criteria":
                    return (
                        <div className="flex items-center justify-center">
                            <Tooltip content="Ver Criterio de Aceptación">
                                <Button
                                    isIconOnly
                                    aria-label="Ver Criterio de Aceptación"
                                    color="primary"
                                    variant="light"
                                    onPress={() =>
                                        openModalDescription(
                                            requirement,
                                            "acceptance_criteria",
                                            "Criterio de Aceptación"
                                        )
                                    }
                                >
                                    <img src={watch_icon} alt="Ver" className="w-5 h-5" />
                                </Button>
                            </Tooltip>
                        </div>
                    );

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
                                <DropdownMenu aria-label="Opciones de requerimiento">
                                    <DropdownItem
                                        startContent={
                                            <img src={update_icon} alt="Edit" className="w-4 h-4" />
                                        }
                                        onPress={() => console.log("Hola")}
                                    >
                                        <p className="font-normal text-primary">Editar</p>
                                    </DropdownItem>
                                    <DropdownItem
                                        startContent={
                                            <img src={delete_icon} alt="Delete" className="w-4 h-4" />
                                        }
                                        onPress={() => console.log("Hola")}
                                    >
                                        <p className="font-normal text-red">Eliminar</p>
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    );

                default:
                    return <div className="text-sm text-gray-700">-</div>;
            }
        },
        [requirement, reqIdentificationId, requirementName, openModalDescription, isExpanded]
    );

    return (
        <>
            <tr className="hover:bg-gray-50 border-b cursor-pointer" onClick={toggleExpansion}>
                {columns.map((col) => (
                    <td key={col.uid} className={`text-${col.align} px-3 py-2`}>
                        {renderCell(col.uid)}
                    </td>
                ))}
            </tr>

            <tr>
                <td colSpan={columns.length} className="p-0 border-t">
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <div
                                className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-t font-semibold text-xs text-gray-500 mt-4 flex items-center gap-2"
                                onClick={() => setShowRequirementTypes((prev) => !prev)}
                            >
                                {showRequirementTypes ? (
                                    <KeyboardArrowDownIcon fontSize="small" />
                                ) : (
                                    <KeyboardArrowRightIcon fontSize="small" />
                                )}
                                Tipos de requerimiento
                            </div>
                            <Collapse in={showRequirementTypes} timeout="auto" unmountOnExit>
                                <Box sx={{ marginTop: 1 }}>
                                    <RequirementTypesTable requirementTypes={requirementTypes} />
                                </Box>
                            </Collapse>
                            <div
                                className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-t font-semibold text-xs text-gray-500 mt-4 flex items-center gap-2"
                                onClick={() => setShowLegalVerbs((prev) => !prev)}
                            >
                                {showLegalVerbs ? (
                                    <KeyboardArrowDownIcon fontSize="small" />
                                ) : (
                                    <KeyboardArrowRightIcon fontSize="small" />
                                )}
                                Verbos legales
                            </div>
                            <Collapse in={showLegalVerbs} timeout="auto" unmountOnExit>
                                <Box sx={{ marginTop: 2 }}>
                                    <LegalVerbsTable legalVerbs={legalVerbs} />
                                </Box>
                            </Collapse>
                        </Box>
                    </Collapse>
                </td>
            </tr>
        </>
    );
}

ReqIdentificationCell.propTypes = {
    item: PropTypes.shape({
        requirement: PropTypes.object.isRequired,
        legalVerbs: PropTypes.array,
        requirementTypes: PropTypes.array,
        reqIdentificationId: PropTypes.number,
        requirementName: PropTypes.string,
    }).isRequired,
    columns: PropTypes.array.isRequired,
    openModalDescription: PropTypes.func.isRequired,
    openEditModal: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
};
