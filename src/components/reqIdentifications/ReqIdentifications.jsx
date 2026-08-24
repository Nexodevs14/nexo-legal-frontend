import { useCallback, useState, useRef, useMemo, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Button,
  Tooltip,
} from "@heroui/react";
import useReqIdentifications from "../../hooks/reqIdentifications/useReqIdentifications.jsx";
import useSubjects from "../../hooks/subject/useSubjects";
import useAspects from "../../hooks/aspect/useAspects";
import useTerritory from "../../hooks/territory/useTerritory";
import useUsers from "../../hooks/user/useUsers";
import TopContent from "./TopContent.jsx";
import ReqIdentificationCell from "./ReqIdentificationCell.jsx";
import EditReqIdentification from "./EditReqIdentifications.jsx";
import DeleteModal from "./deleteReqIdentifications.jsx";
import BottomContent from "../utils/BottomContent.jsx";
import Error from "../utils/Error.jsx";
import { toast } from "react-toastify";
import check from "../../assets/check.png";
import trash_icon from "../../assets/papelera-mas.png";
import { useNavigate } from "react-router-dom";

const columns = [
  { name: "Nombre", uid: "name", align: "start" },
  { name: "Descripción", uid: "description", align: "start" },
  { name: "Estatus", uid: "status", align: "start" },
  { name: "Usuario", uid: "user", align: "start" },
  { name: "Materia", uid: "subject", align: "start" },
  { name: "Aspectos", uid: "aspects", align: "start" },
  { name: "Jurisdicción", uid: "jurisdiction", align: "start" },
  { name: "Estado", uid: "state", align: "start" },
  { name: "Municipio", uid: "municipality", align: "start" },
  { name: "Creado", uid: "createdAt", align: "start" },
  { name: "Acciones", uid: "actions", align: "center" },
];

/**
 * Requirements Identification component
 *
 * This component provides a Requirements Identification management interface, including features for listing, filtering,
 * pagination, role-based filtering, and CRUD operations. Requirements Identifications can be edited or deleted,
 * with appropriate feedback displayed for each action.
 *
 * @returns {JSX.Element} Rendered Requirements Identification component, displaying the requirements identification management interface with
 * filters, pagination, and modals for adding, editing, and deleting Requirements Identifications.
 *
 */
export default function ReqIdentification() {
  const {
    reqIdentifications,
    loading,
    error,
    fetchReqIdentifications,
    fetchReqIdentificationsByName,
    fetchReqIdentificationsByDescription,
    fetchReqIdentificationsByUserId,
    fetchReqIdentificationsBySubjectId,
    fetchReqIdentificationsBySubjectAndAspects,
    fetchReqIdentificationsByJurisdiction,
    fetchReqIdentificationsByLegalBasisName,
    fetchReqIdentificationsByRequirementName,
    fetchReqIdentificationsByState,
    fetchReqIdentificationsByStateAndMunicipalities,
    fetchReqIdentificationsByStatus,
    fetchReqIdentificationsByCreatedAt,
    editReqIdentification,
    removeReqIdentification,
    removeReqIdentificationsBatch,
  } = useReqIdentifications();
  const {
    subjects,
    loading: subjectLoading,
    error: subjectError,
  } = useSubjects();
  const { users, loading: usersLoading, error: usersError } = useUsers();
  const {
    aspects,
    loadingState: aspectsLoading,
    error: aspectError,
    clearAspects,
    fetchAspects,
  } = useAspects();
  const {
    states,
    loadingStates,
    errorStates,
    municipalities,
    loadingMunicipalities,
    fetchMunicipalities,
    errorMunicipalities,
    clearMunicipalities,
  } = useTerritory();
  const navigate = useNavigate();
  const [filterByName, setFilterByName] = useState("");
  const [filterByDescription, setFilterByDescription] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedAspects, setSelectedAspects] = useState([]);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState("");
  const [filterByLegalBasisName, setFilterByLegalBasisName] = useState("");
  const [filterByRequirementName, setFilterByRequirementName] = useState("");
  const [selectedState, setSelectedState] = useState(null);
  const [selectedMunicipalities, setSelectedMunicipalities] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [creationRange, setCreationRange] = useState(null);
  const [creationRangeInvalid, setCreationRangeInvalid] = useState(false);
  const [creationRangeError, setCreationRangeError] = useState("");
  const [page, setPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimeout = useRef(null);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedReqIdentification, setSelectedReqIdentification] =
    useState(null);
  const [nameInputError, setNameInputError] = useState(null);
  const [descriptionInputError, setDescriptionInputError] = useState(null);
  const [userInputError, setUserInputError] = useState(null);
  const [isDeletingBatch, setIsDeletingBatch] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    jurisdiction: "",
    state: "",
    municipality: "",
    subject: "",
    aspects: [],
    status: "",
    user: "",
  });

  useEffect(() => {
    if (!loading && isFirstRender) {
      setIsFirstRender(false);
    }
  }, [loading, isFirstRender]);

  const handleClear = useCallback(() => {
    setFilterByName("");
    setFilterByDescription("");
    setSelectedUser(null);
    setSelectedSubject(null);
    setSelectedAspects([]);
    setSelectedJurisdiction("");
    setFilterByLegalBasisName("");
    setFilterByRequirementName("");
    setSelectedState(null);
    setSelectedMunicipalities([]);
    setSelectedStatus("");
    setCreationRange(null);
    setCreationRangeInvalid(false);
    setCreationRangeError("");
    clearAspects();
    clearMunicipalities();
    fetchReqIdentifications();
  }, [fetchReqIdentifications, clearAspects, clearMunicipalities]);

  const resetSubjectAndAspects = useCallback(() => {
    if (selectedSubject) {
      setSelectedSubject(null);
      setSelectedAspects([]);
      clearAspects();
    }
  }, [selectedSubject, clearAspects]);

  const resetStatesAndMunicipalities = useCallback(() => {
    if (selectedState) {
      setSelectedState(null);
      setSelectedMunicipalities([]);
      clearMunicipalities();
    }
  }, [selectedState, clearMunicipalities]);

  const handleFilter = useCallback(
    (field, value) => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(async () => {
        setPage(1);
        setIsSearching(true);
        switch (field) {
          case "name":
            await fetchReqIdentificationsByName(value);
            break;
          case "description":
            await fetchReqIdentificationsByDescription(value);
            break;
          case "user":
            await fetchReqIdentificationsByUserId(value);
            break;
          case "subject":
            await fetchReqIdentificationsBySubjectId(value);
            await fetchAspects(value);
            break;
          case "subjectAndAspects": {
            const { subjectId, aspectsIds } = value;
            await fetchReqIdentificationsBySubjectAndAspects(
              subjectId,
              aspectsIds
            );
            break;
          }
          case "jurisdiction":
            await fetchReqIdentificationsByJurisdiction(value);
            break;
          case "legalBasisName":
            await fetchReqIdentificationsByLegalBasisName(value);
            break;
          case "requirementName":
            await fetchReqIdentificationsByRequirementName(value);
            break;
          case "state":
            await fetchReqIdentificationsByState(value);
            await fetchMunicipalities(value);
            break;
          case "stateAndMunicipalities": {
            const { state, municipalities } = value;
            await fetchReqIdentificationsByStateAndMunicipalities(
              state,
              municipalities
            );
            break;
          }
          case "status":
            await fetchReqIdentificationsByStatus(value);
            break;
          default:
            break;
        }
        setIsSearching(false);
      }, 500);
    },
    [
      fetchReqIdentificationsByName,
      fetchReqIdentificationsByDescription,
      fetchReqIdentificationsByUserId,
      fetchReqIdentificationsBySubjectId,
      fetchReqIdentificationsBySubjectAndAspects,
      fetchReqIdentificationsByJurisdiction,
      fetchReqIdentificationsByLegalBasisName,
      fetchReqIdentificationsByRequirementName,
      fetchReqIdentificationsByState,
      fetchReqIdentificationsByStateAndMunicipalities,
      fetchReqIdentificationsByStatus,
      fetchAspects,
      fetchMunicipalities,
    ]
  );

  const handleFilterByName = useCallback(
    (value) => {
      if (value.trim() === "") {
        handleClear();
        return;
      }
      setFilterByName(value);
      setFilterByDescription("");
      setSelectedUser(null);
      setSelectedJurisdiction("");
      setFilterByLegalBasisName("");
      setFilterByRequirementName("");
      setSelectedStatus("");
      resetSubjectAndAspects();
      resetStatesAndMunicipalities();
      setCreationRange(null);
      setCreationRangeInvalid(false);
      setCreationRangeError("");
      handleFilter("name", value);
    },
    [
      handleFilter,
      handleClear,
      resetSubjectAndAspects,
      resetStatesAndMunicipalities,
    ]
  );

  const handleFilterByDescription = useCallback(
    (value) => {
      if (value.trim() === "") {
        handleClear();
        return;
      }
      setFilterByDescription(value);
      setFilterByName("");
      setSelectedUser(null);
      setSelectedJurisdiction("");
      setFilterByLegalBasisName("");
      setFilterByRequirementName("");
      setSelectedStatus("");
      resetSubjectAndAspects();
      resetStatesAndMunicipalities();
      setCreationRange(null);
      setCreationRangeInvalid(false);
      setCreationRangeError("");
      handleFilter("description", value);
    },
    [
      handleFilter,
      handleClear,
      resetSubjectAndAspects,
      resetStatesAndMunicipalities,
    ]
  );

  const handleFilterByUser = useCallback(
    (userId) => {
      if (!userId) {
        handleClear();
        return;
      }
      setSelectedUser(userId);
      setFilterByName("");
      setFilterByDescription("");
      setSelectedJurisdiction("");
      setFilterByLegalBasisName("");
      setFilterByRequirementName("");
      setSelectedStatus("");
      resetSubjectAndAspects();
      resetStatesAndMunicipalities();
      setCreationRange(null);
      setCreationRangeInvalid(false);
      setCreationRangeError("");
      handleFilter("user", userId);
    },
    [
      handleFilter,
      handleClear,
      resetSubjectAndAspects,
      resetStatesAndMunicipalities,
    ]
  );

  const handleFilterBySubject = useCallback(
    (subjectId) => {
      if (!subjectId) {
        handleClear();
        return;
      }
      setFilterByName("");
      setFilterByDescription("");
      setSelectedUser(null);
      setSelectedJurisdiction("");
      setFilterByLegalBasisName("");
      setFilterByRequirementName("");
      setSelectedStatus("");
      resetStatesAndMunicipalities();
      setCreationRange(null);
      setCreationRangeInvalid(false);
      setCreationRangeError("");
      setSelectedSubject(subjectId);
      handleFilter("subject", subjectId);
    },
    [handleFilter, handleClear, resetStatesAndMunicipalities]
  );

  const handleFilterBySubjectAndAspects = useCallback(
    (aspectIds) => {
      setSelectedAspects(aspectIds);
      if (aspectIds.size === 0) {
        if (selectedSubject) {
          handleFilter("subject", selectedSubject);
        } else {
          handleClear();
        }
        return;
      }
      const value = {
        subjectId: selectedSubject,
        aspectsIds: Array.from(aspectIds),
      };
      handleFilter("subjectAndAspects", value);
    },
    [handleFilter, handleClear, selectedSubject]
  );

  const handleFilterByJurisdiction = useCallback(
    (jurisdiction) => {
      if (!jurisdiction) {
        handleClear();
        return;
      }
      setFilterByName("");
      setFilterByDescription("");
      setSelectedUser(null);
      setSelectedStatus("");
      setFilterByLegalBasisName("");
      setFilterByRequirementName("");
      resetSubjectAndAspects();
      resetStatesAndMunicipalities();
      setCreationRange(null);
      setCreationRangeInvalid(false);
      setCreationRangeError("");
      setSelectedJurisdiction(jurisdiction);
      handleFilter("jurisdiction", jurisdiction);
    },
    [
      handleFilter,
      handleClear,
      resetSubjectAndAspects,
      resetStatesAndMunicipalities,
    ]
  );

  const handleFilterByLegalBasisName = useCallback(
    (legalBasisName) => {
      if (!legalBasisName) {
        handleClear();
        return;
      }
      setFilterByName("");
      setFilterByDescription("");
      setSelectedUser(null);
      setSelectedStatus("");
      setFilterByLegalBasisName(legalBasisName);
      setFilterByRequirementName("");
      resetSubjectAndAspects();
      resetStatesAndMunicipalities();
      setCreationRange(null);
      setCreationRangeInvalid(false);
      setCreationRangeError("");
      setSelectedJurisdiction();
      handleFilter("legalBasisName", legalBasisName);
    },
    [
      handleFilter,
      handleClear,
      resetSubjectAndAspects,
      resetStatesAndMunicipalities,
    ]
  );

  const handleFilterByRequirementName = useCallback(
    (requirementName) => {
      if (!requirementName) {
        handleClear();
        return;
      }
      setFilterByName("");
      setFilterByDescription("");
      setSelectedUser(null);
      setSelectedStatus("");
      setFilterByLegalBasisName("");
      setFilterByRequirementName(requirementName);
      resetSubjectAndAspects();
      resetStatesAndMunicipalities();
      setCreationRange(null);
      setCreationRangeInvalid(false);
      setCreationRangeError("");
      setSelectedJurisdiction("");
      handleFilter("requirementName", requirementName);
    },
    [
      handleFilter,
      handleClear,
      resetSubjectAndAspects,
      resetStatesAndMunicipalities,
    ]
  );

  const handleFilterByState = useCallback(
    (state) => {
      if (!state) {
        handleClear();
        return;
      }
      setFilterByName("");
      setFilterByDescription("");
      setSelectedUser(null);
      setSelectedStatus("");
      setFilterByLegalBasisName("");
      setFilterByRequirementName("");
      resetSubjectAndAspects();
      setCreationRange(null);
      setCreationRangeInvalid(false);
      setCreationRangeError("");
      setSelectedJurisdiction("");
      setSelectedState(state);
      handleFilter("state", state);
    },
    [handleFilter, handleClear, resetSubjectAndAspects]
  );

  const handleFilterByMunicipalities = useCallback(
    (municipalities) => {
      setSelectedMunicipalities(municipalities);
      if (municipalities.size === 0) {
        if (selectedState) {
          handleFilter("state", selectedState);
        } else {
          handleClear();
        }
        return;
      }
      const municipalitiesArray = Array.from(municipalities);
      const value = {
        state: selectedState,
        municipalities: municipalitiesArray,
      };
      handleFilter("stateAndMunicipalities", value);
    },
    [handleFilter, handleClear, selectedState]
  );

  const handleFilterByStatus = useCallback(
    (status) => {
      if (!status) {
        handleClear();
        return;
      }
      setSelectedStatus(status);
      setFilterByName("");
      setFilterByDescription("");
      setSelectedUser(null);
      setSelectedJurisdiction("");
      setFilterByLegalBasisName("");
      setFilterByRequirementName("");
      resetSubjectAndAspects();
      resetStatesAndMunicipalities();
      setCreationRange(null);
      setCreationRangeInvalid(false);
      setCreationRangeError("");
      handleFilter("status", status);
    },
    [
      handleFilter,
      handleClear,
      resetSubjectAndAspects,
      resetStatesAndMunicipalities,
    ]
  );

  const handleFilterByCreationRange = useCallback(
    (values) => {
      if (values) {
        if (values.start.compare(values.end) > 0) {
          setCreationRangeInvalid(true);
          setCreationRangeError("Fecha inicio debe ser antes que fecha fin.");
        } else {
          setCreationRangeInvalid(false);
          setCreationRangeError("");
        }
        const { start, end } = values;
        setFilterByName("");
        setFilterByDescription("");
        setSelectedUser(null);
        setSelectedStatus("");
        setSelectedJurisdiction("");
        setFilterByLegalBasisName("");
        setFilterByRequirementName("");
        resetSubjectAndAspects();
        resetStatesAndMunicipalities();
        fetchReqIdentificationsByCreatedAt(start.toString(), end.toString());
        setCreationRange(values);
      } else {
        handleClear();
        setCreationRange(null);
        setCreationRangeInvalid(false);
        setCreationRangeError("");
      }
    },
    [fetchReqIdentificationsByCreatedAt, handleClear, resetSubjectAndAspects, resetStatesAndMunicipalities, setSelectedStatus]
  );

  const openEditModal = (reqIdentification) => {
    setSelectedReqIdentification(reqIdentification);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedReqIdentification(null);
    setNameInputError(null);
    setUserInputError(null);
    clearMunicipalities();
    clearAspects();
  };

  const handleNameChange = useCallback(
    (e) => {
      const { value } = e.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        name: value,
      }));
      if (nameInputError && value.trim() !== "") {
        setNameInputError(null);
      }
    },
    [nameInputError, setFormData, setNameInputError]
  );

  const handleDescriptionChange = useCallback(
    (e) => {
      const { value } = e.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        description: value,
      }));
      if (descriptionInputError && value.trim() !== "") {
        setDescriptionInputError(null);
      }
    },
    [descriptionInputError, setFormData, setDescriptionInputError]
  );

  const handleUserChange = useCallback(
    (selectedKey) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        user: selectedKey,
      }));
      if (userInputError && selectedKey.trim() !== "") {
        setUserInputError(null);
      }
    },
    [userInputError, setFormData, setUserInputError]
  );

  const viewRequirementDetails = (reqIdentificationId) => {
    navigate(`/req_identifications/${reqIdentificationId}/requirements`);
  };

  const totalPages = useMemo(
    () => Math.ceil(reqIdentifications.length / rowsPerPage),
    [reqIdentifications, rowsPerPage]
  );

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);
  const onPageChange = (newPage) => setPage(newPage);
  const onPreviousPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const onNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));

  const handleDelete = useCallback(
    async (reqIdentificationId) => {
      const toastId = toast.loading(
        "Eliminando identificación de requerimientos...",
        {
          icon: <Spinner size="sm" />,
          progressStyle: {
            background: "#113c53",
          },
        }
      );
      try {
        const { success, error } = await removeReqIdentification(
          reqIdentificationId
        );
        if (success) {
          toast.update(toastId, {
            render: "Identificación de requerimientos eliminada con éxito",
            type: "info",
            icon: <img src={check} alt="Success Icon" />,
            progressStyle: {
              background: "#113c53",
            },
            isLoading: false,
            autoClose: 3000,
          });
        } else {
          toast.update(toastId, {
            render: (
              <div
                style={{
                  maxHeight: 200,
                  overflowY: "auto",
                  whiteSpace: "pre-wrap",
                }}
              >
                {error}
              </div>
            ),
            className: "toast-scroll-red",
            type: "error",
            icon: null,
            progressStyle: {},
            isLoading: false,
            autoClose: 5000,
          });
        }
      } catch (error) {
        console.error(error);
        toast.update(toastId, {
          render:
            "Algo mal sucedió al eliminar la identificación de requerimientos. Intente de nuevo.",
          type: "error",
          icon: null,
          progressStyle: {},
          isLoading: false,
          autoClose: 5000,
        });
      }
    },
    [removeReqIdentification]
  );

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
  if (error) return <Error title={error.title} message={error.message} />;
  if (usersError)
    return <Error title={usersError.title} message={usersError.message} />;
  if (subjectError)
    return <Error title={subjectError.title} message={subjectError.message} />;
  if (aspectError)
    return <Error title={aspectError.title} message={aspectError.message} />;
  if (errorStates)
    return <Error title={errorStates.title} message={errorStates.message} />;
  if (errorMunicipalities)
    return (
      <Error
        title={errorMunicipalities.title}
        message={errorMunicipalities.message}
      />
    );

  return (
    <div className="mt-24 mb-4 -ml-60 mr-4 lg:-ml-0 lg:mr-0 flex justify-center items-center flex-wrap">
      <TopContent
        config={{
          onRowsPerPageChange: onRowsPerPageChange,
          totalReqIdentifications: reqIdentifications.length,
          filterByName: filterByName,
          filterByDescription: filterByDescription,
          onFilterByName: handleFilterByName,
          onFilterByDescription: handleFilterByDescription,
          users: users,
          usersLoading: usersLoading,
          selectedUser: selectedUser,
          onFilterByUser: handleFilterByUser,
          subjects: subjects,
          selectedSubject: selectedSubject,
          subjectLoading: subjectLoading,
          onFilterBySubject: handleFilterBySubject,
          aspects: aspects,
          selectedAspects: selectedAspects,
          aspectsLoading: aspectsLoading,
          onFilterBySubjectAndAspects: handleFilterBySubjectAndAspects,
          selectedJurisdiction: selectedJurisdiction,
          onFilterByJurisdiction: handleFilterByJurisdiction,
          filterByLegalBasisName: filterByLegalBasisName,
          onFilterByLegalBasisName: handleFilterByLegalBasisName,
          filterByRequirementName: filterByRequirementName,
          onFilterByRequirementName: handleFilterByRequirementName,
          states: states,
          selectedState: selectedState,
          stateLoading: loadingStates,
          onFilterByState: handleFilterByState,
          municipalities: municipalities,
          selectedMunicipalities: selectedMunicipalities,
          municipalitiesLoading: loadingMunicipalities,
          onFilterByMunicipalities: handleFilterByMunicipalities,
          selectedStatus: selectedStatus,
          onFilterByStatus: handleFilterByStatus,
          creationRange: creationRange,
          creationRangeInvalid: creationRangeInvalid,
          creationRangeError: creationRangeError,
          onFilterByCreationRange: handleFilterByCreationRange,
          onClear: handleClear,
        }}
      />
      <>
        {isSearching || loading ? (
          <div
            role="status"
            className="flex justify-center items-center w-full h-40"
          >
            <Spinner className="h-10 w-10" color="secondary" />
          </div>
        ) : (
          <Table
            aria-label="Tabla de Identificación de Requerimientos"
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            color="primary"
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.uid} align={column.align}>
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={reqIdentifications.slice(
                (page - 1) * rowsPerPage,
                page * rowsPerPage
              )}
              emptyContent="No hay identificaciones de requerimientos disponibles"
            >
              {(reqIdentification) => (
                <TableRow key={reqIdentification.id}>
                  {(columnKey) => (
                    <TableCell>
                      <ReqIdentificationCell
                        reqIdentification={reqIdentification}
                        columnKey={columnKey}
                        viewRequirementDetails={viewRequirementDetails}
                        openEditModal={openEditModal}
                        handleDelete={handleDelete}
                      />
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
        <div className="relative w-full">
          {(selectedKeys.size > 0 || selectedKeys === "all") && (
            <>
              <Tooltip content="Eliminar" size="sm">
                <Button
                  isIconOnly
                  size="sm"
                  className="absolute left-0 bottom-0 ml-5 bg-primary transform translate-y-32 sm:translate-y-24 md:translate-y-24 lg:translate-y-24 xl:translate-y-10"
                  aria-label="Eliminar seleccionados"
                  onPress={openDeleteModal}
                >
                  <img src={trash_icon} alt="delete" className="w-5 h-5" />
                </Button>
              </Tooltip>
            </>
          )}
        </div>
        <BottomContent
          config={{
            page: page,
            totalPages: totalPages,
            onPageChange: onPageChange,
            onPreviousPage: onPreviousPage,
            onNextPage: onNextPage,
            selectedKeys: selectedKeys,
            filteredItems: reqIdentifications,
          }}
        />
        {isEditModalOpen && (
          <EditReqIdentification
            config={{
              editReqIdentification: editReqIdentification,
              isOpen: isEditModalOpen,
              closeModalEdit: closeEditModal,
              formData: formData,
              setFormData: setFormData,
              selectedReqIdentification: selectedReqIdentification,
              nameError: nameInputError,
              setNameError: setNameInputError,
              handleNameChange: handleNameChange,
              descriptionError: descriptionInputError,
              setDescriptionError: setDescriptionInputError,
              handleDescriptionChange: handleDescriptionChange,
              userError: userInputError,
              setUserError: setUserInputError,
              handleUserChange: handleUserChange,
              users: users,
              usersLoading: usersLoading,
            }}
          />
        )}
      </>
      {showDeleteModal && (
        <DeleteModal
          config={{
            showDeleteModal: showDeleteModal,
            closeDeleteModal: closeDeleteModal,
            setIsDeletingBatch: setIsDeletingBatch,
            isDeletingBatch: isDeletingBatch,
            selectedKeys: selectedKeys,
            reqIdentifications: reqIdentifications,
            deleteReqIdentificationsBatch: removeReqIdentificationsBatch,
            setSelectedKeys: setSelectedKeys,
            setPage: setPage,
            check: check,
          }}
        />
      )}
    </div>
  );
}
