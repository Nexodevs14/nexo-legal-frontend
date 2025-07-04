import { useCallback, useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "@heroui/react";
import TopContent from "./TopContent";
import useReqIdentifications from "../../../hooks/reqIdentifications/useReqIdentifications";
import useReqIdentificationRequirements from "../../../hooks/reqIdentifications/useReqIdentificationRequirements";
import DescriptionModal from "../../requirements/TextArea/DescriptionModal";
import Error from "../../utils/Error";
import ReqIdentificationCell from "./ReqIdentificationCell";

const columns = [
  { name: "", uid: "expand", align: "center" },
  { name: "Orden", uid: "requirement_number", align: "start" },
  { name: "Nombre de Requerimiento", uid: "requirementName", align: "start" },
  { name: "Requerimiento", uid: "requirement_name", align: "start" },
  { name: "Condición", uid: "requirement_condition", align: "start" },
  { name: "Evidencia", uid: "evidence", align: "start" },
  { name: "Periodicidad", uid: "periodicity", align: "start" },
  { name: "Materia", uid: "subject", align: "start" },
  { name: "Aspectos", uid: "aspects", align: "start" },
  {
    name: "Criterio de Aceptación",
    uid: "acceptance_criteria",
    align: "start",
  },
  { name: "Acciones", uid: "actions", align: "center" },
];

/**
 * Requirements Identification Requirements component
 *
 * This component provides a Requirements Identification Requirements management interface, including features for listing, filtering,
 * pagination, role-based filtering, and CRUD operations. Requirements can be created, edited or deleted,
 * with appropriate feedback displayed for each action.
 *
 * @returns {JSX.Element} Rendered Requirements Identification Requirements component, displaying the requirements management interface with
 * filters, pagination, and modals for adding, editing, and deleting Requirements.
 *
 */
export default function ReqIdentificationRequirements() {
  const { id } = useParams();
  const { fetchReqIdentificationById } = useReqIdentifications();
  const {
    reqIdentificationRequirements,
    loading,
    error,
    fetchRequirements,
    fetchRequirementsByName,
    fetchRequirementsByRequirementName,
  } = useReqIdentificationRequirements();
  const [reqIdentification, setReqIdentification] = useState(null);
  const [reqIdentificationError, setReqIdentificationError] = useState(null);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [filterByName, setFilterByName] = useState("");
  const [filterByRequirement, setFilterByRequirement] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimeout = useRef(null);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const { success, data, error } = await fetchReqIdentificationById(id);
        await fetchRequirements(id);
        if (success && data) {
          setReqIdentification(data);
          setReqIdentificationError(null);
        } else {
          setReqIdentification(null);
          setReqIdentificationError(error);
        }
      }
    };
    fetchData();
  }, [id, fetchRequirements, fetchReqIdentificationById]);

  useEffect(() => {
    if (!loading && isFirstRender) {
      setIsFirstRender(false);
    }
  }, [loading, isFirstRender]);

  const handleClear = useCallback(() => {
    setFilterByName("");
    setFilterByRequirement("");
    fetchRequirements(id);
  }, [id, fetchRequirements]);

  const handleFilter = useCallback(
    (type, value) => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(async () => {
        setIsSearching(true);
        switch (type) {
          case "name":
            await fetchRequirementsByName(id, value);
            break;
          case "requirementName":
            await fetchRequirementsByRequirementName(id, value);
            break;
          default:
            break;
        }
        setIsSearching(false);
      }, 500);
    },
    [id, fetchRequirementsByName, fetchRequirementsByRequirementName]
  );

  const handleFilterByName = useCallback(
    (value) => {
      if (value.trim() === "") {
        handleClear();
        return;
      }
      setFilterByRequirement("");
      setFilterByName(value);
      handleFilter("name", value);
    },
    [handleFilter, handleClear]
  );

  const handleFilterByRequirement = useCallback(
    (value) => {
      if (value.trim() === "") {
        handleClear();
        return;
      }
      setFilterByName("");
      setFilterByRequirement(value);
      handleFilter("requirementName", value);
    },
    [handleFilter, handleClear]
  );

  const openModalDescription = (requirement, field, title) => {
    setSelectedRequirement({
      title: title,
      description: requirement[field],
    });
    setShowDescriptionModal(true);
  };

  const closeModalDescription = () => {
    setShowDescriptionModal(false);
    setSelectedRequirement(null);
  };

  if (loading && isFirstRender) {
    return (
      <div
        role="status"
        className="fixed inset-0 flex items-center justify-center"
      >
        <Spinner
          className="h-10 w-10 transform translate-x-0 lg:translate-x-28 xl:translate-x-32"
          color="secondary"
        />
      </div>
    );
  }

  console.log(error, reqIdentificationError)
  if (error) return <Error title={error.title} message={error.message} />;

  return (
    <div className="mt-24 mb-4 -ml-60 mr-4 lg:-ml-0 lg:mr-0 xl:-ml-0 xl:mr-0 flex justify-center items-center flex-wrap">
      {reqIdentificationError ? (
        <Error
          title={reqIdentificationError.title}
          message={reqIdentificationError.message}
        />
      ) : (
        <>
          <TopContent
            config={{
              reqIdentification: reqIdentification,
              filterByRequirement,
              filterByName,
              onFilterByRequirement: handleFilterByRequirement,
              onFilterByName: handleFilterByName,
              onClear: handleClear,
              totalRequirements: reqIdentificationRequirements.length,
            }}
          />

          {isSearching || loading ? (
            <div
              role="status"
              className="flex justify-center items-center w-full h-40"
            >
              <Spinner className="h-10 w-10" color="secondary" />
            </div>
          ) : (
            <div className="w-full rounded-xl border border-gray-200 shadow-sm overflow-x-hidden overflow-y-hidden">
              <div className="w-full overflow-x-auto overflow-y-hidden rounded-xl border border-gray-200 shadow-sm">
                <table className="min-w-full text-sm text-left divide-y divide-gray-200">
                  <thead className="bg-gray-100 text-gray-500">
                    <tr>
                      {columns.map((col) => (
                        <th
                          key={col.uid}
                          className={`px-4 py-3 font-semibold text-xs tracking-wide whitespace-nowrap text-${col.align}`}
                        >
                          {col.name}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {reqIdentificationRequirements.length === 0 ? (
                      <tr>
                        <td
                          colSpan={columns.length}
                          className="text-center py-24 text-base text-gray-500"
                        >
                          No hay requerimientos disponibles.
                        </td>
                      </tr>
                    ) : (
                      reqIdentificationRequirements.map((requirement) => (
                        <ReqIdentificationCell
                          key={requirement.requirement.id}
                          item={requirement}
                          columns={columns}
                          openModalDescription={openModalDescription}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {selectedRequirement && (
            <DescriptionModal
              isOpen={showDescriptionModal}
              onClose={closeModalDescription}
              title={selectedRequirement?.title || ""}
              description={selectedRequirement?.description || ""}
            />
          )}
        </>
      )}
    </div>
  );
}
