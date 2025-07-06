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
  Tooltip,
} from "@heroui/react";
import LegalVerbsTable from "./LegalVerbsTable";
import RequirementTypesTable from "./RequirementTypesTable";
import LegalBasisTable from "./LegalBasisTable";
import menu_icon from "../../../assets/aplicaciones.png";
import update_icon from "../../../assets/actualizar.png";
import delete_icon from "../../../assets/eliminar.png";
import watch_icon from "../../../assets/ver.png";
import link_blue_icon from "../../../assets/enlace_blue.png";

/**
 * ReqIdentificationCell component
 *
 * Functional component used for rendering table rows of requirement identification.
 * It displays data based on column keys and allows expansion to show legal verbs and requirement types.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.reqIdentificatioRequirement - The requirement identification object with nested requirements.
 * @param {Array} props.columns - The table column configuration.
 * @param {Function} props.openModalDescription - Callback to open a modal showing description content.
 * @param {Function} props.openEditRequirmentModal - Callback to open the edit modal.
 * @param {Function} props.openCreateLegalBasisModal - Callback to open the create legal basis modal.
 * @param {Function} props.handleDeleteRequirement - Callback to handle delete requirement action.
 * @param {Function} props.handleDeleteLegalBasis - Callback to handle delete legal basis action.
 * @returns {JSX.Element} Rendered table row with collapsible content.
 */
export default function ReqIdentificationCell({
  reqIdentificatioRequirement,
  columns,
  openModalDescription,
  openEditRequirmentModal,
  handleDeleteRequirement,
  openCreateLegalBasisModal,
  handleDeleteLegalBasis
}) {
  const {
    requirement,
    legalVerbs,
    requirementTypes,
    legalBasis,
    reqIdentificationId,
    requirementName,
  } = reqIdentificatioRequirement;

  const [isExpanded, setIsExpanded] = useState(false);
  const [showLegalVerbs, setShowLegalVerbs] = useState(false);
  const [showRequirementTypes, setShowRequirementTypes] = useState(false);
  const [showLegalBasis, setShowLegalBasis] = useState(false);

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
              {requirement.formatted_evidence || requirement.evidence || "N/A"}
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
                <DropdownMenu
                  aria-label="Opciones de requerimiento"
                  variant="light"
                >
                  <DropdownItem
                    aria-label="Asociar Fundamento Legal"
                    startContent={
                      <img
                        src={link_blue_icon}
                        alt="Edit Icon"
                        className="w-4 h-4 flex-shrink-0"
                      />
                    }
                    className="hover:bg-primary/20"
                    key="update"
                    textValue="Asociar Fundamento Legal"
                    onPress={() => openCreateLegalBasisModal(requirement.id)}
                  >
                    <p className="font-normal text-primary">
                      Asociar Fundamento
                    </p>
                  </DropdownItem>
                  <DropdownItem
                    aria-label="Editar Requerimiento"
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
                    onPress={() => openEditRequirmentModal(reqIdentificatioRequirement)}
                  >
                    <p className="font-normal text-primary">
                      Editar Requerimiento
                    </p>
                  </DropdownItem>
                  <DropdownItem
                    aria-label="Eliminar"
                    startContent={
                      <img src={delete_icon} alt="Delete" className="w-4 h-4" />
                    }
                    onPress={() => handleDeleteRequirement(requirement.id)}
                    className="hover:bg-red/20"
                  >
                    <p className="font-normal text-red">
                      Eliminar Requerimiento
                    </p>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );

        default:
          return <div className="text-sm text-gray-700">-</div>;
      }
    },
    [
      requirement,
      reqIdentificatioRequirement,
      reqIdentificationId,
      requirementName,
      openModalDescription,
      isExpanded,
      openEditRequirmentModal,
      handleDeleteRequirement,
      openCreateLegalBasisModal
    ]
  );

  return (
    <>
      <tr
        className="hover:bg-gray-50 border-b cursor-pointer"
        onClick={toggleExpansion}
      >
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
              <div
                className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-t font-semibold text-xs text-gray-500 mt-4 flex items-center gap-2"
                onClick={() => setShowLegalBasis((prev) => !prev)}
              >
                {showLegalBasis ? (
                  <KeyboardArrowDownIcon fontSize="small" />
                ) : (
                  <KeyboardArrowRightIcon fontSize="small" />
                )}
                Fundamentos legales
              </div>
              <Collapse in={showLegalBasis} timeout="auto" unmountOnExit>
                <Box sx={{ marginTop: 2 }}>
                  <LegalBasisTable requirement={requirement} legalBasis={legalBasis} handleDeleteLegalBasis={handleDeleteLegalBasis} />
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
  reqIdentificatioRequirement: PropTypes.shape({
    requirement: PropTypes.object.isRequired,
    legalVerbs: PropTypes.array,
    requirementTypes: PropTypes.array,
    legalBasis: PropTypes.array,
    reqIdentificationId: PropTypes.number,
    requirementName: PropTypes.string,
  }).isRequired,
  columns: PropTypes.array.isRequired,
  openModalDescription: PropTypes.func.isRequired,
  openEditRequirmentModal: PropTypes.func.isRequired,
  openCreateLegalBasisModal: PropTypes.func.isRequired,
  handleDeleteRequirement: PropTypes.func.isRequired,
  handleDeleteLegalBasis: PropTypes.func.isRequired
};
