import { useCallback, useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "@heroui/react";
import TopContent from "./TopContent";
import useReqIdentifications from "../../../hooks/reqIdentifications/useReqIdentifications";
import useReqIdentificationRequirements from "../../../hooks/reqIdentifications/useReqIdentificationRequirements";
import useRequirements from "../../../hooks/requirement/useRequirements";
import useRequirementTypes from "../../../hooks/requirementTypes/useRequirementTypes";
import useLegalVerbs from "../../../hooks/legalVerbs/useLegalVerbs";
import useLegalBasis from "../../../hooks/legalBasis/useLegalBasis"
import DescriptionModal from "../../requirements/TextArea/DescriptionModal";
import Error from "../../utils/Error";
import ReqIdentificationCell from "./ReqIdentificationCell";
import check from "../../../assets/check.png";
import { toast } from "react-toastify";
import CreateReqIdentificationRequirementModal from "./CreateRequirementModal";
import EditReqIdentificationRequirementModal from "./EditRequirementModal";
import EditReqIdentificationArticleModal from "./EditArticlesModal";
import CreateReqIdentificationLegalBasisModal from "./CreateLegalBasisModal";
import CreateReqIdentificationArticlesModal from "./CreateArticlesModal";

const columns = [
  { name: "", uid: "expand", align: "center" },
  { name: "Orden", uid: "requirement_number", align: "start" },
  { name: "Nombre del Requerimiento", uid: "requirementName", align: "start" },
  { name: "Requerimiento", uid: "requirement_name", align: "start" },
  { name: "Condición", uid: "requirement_condition", align: "start" },
  { name: "Evidencia", uid: "evidence", align: "start" },
  { name: "Periodicidad", uid: "periodicity", align: "start" },
  { name: "Materia", uid: "subject", align: "start" },
  { name: "Aspectos", uid: "aspects", align: "start" },
  {
    name: "Criterio de Aceptación",
    uid: "acceptance_criteria",
    align: "center",
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
    addRequirement,
    fetchRequirements,
    fetchRequirementsByName,
    fetchRequirementsByRequirementName,
    fetchRequirementsByLegalBasisName,
    editRequirement,
    deleteRequirement,
    addLegalBasis,
    deleteLegalBasis,
    addArticle,
    editArticle
  } = useReqIdentificationRequirements();
  const {
    requirements,
    error: requirementError,
  } = useRequirements();
  const {
    requirementTypes,
    error: requirementTypeError,
  } = useRequirementTypes();
  const {
    legalVerbs,
    error: legalVerbsError,
  } = useLegalVerbs();
  const {
    legalBasis,
    error: legalBasisError,
  } = useLegalBasis()
  const [reqIdentification, setReqIdentification] = useState(null);
  const [reqIdentificationError, setReqIdentificationError] = useState(null);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [requirementNameInputError, setRequirementNameInputError] =
    useState(null);
  const [requirementInputError, setRequirementInputError] = useState(null);
  const [requirementTypesInputError, setRequirementTypesInputError] =
    useState(null);
  const [legalVerbsInputErrors, setLegalVerbsInputErrors] = useState(null);
  const [filterByName, setFilterByName] = useState("");
  const [filterByRequirementName, setFilterByRequirementName] = useState("");
  const [filterByLegalBasisName, setFilterByLegalBasisName] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimeout = useRef(null);
  const [isCreateModalRequirementOpen, setIsCreateModalRequirementOpen] = useState(false);
  const [isEditModalRequirementOpen, setIsEditModalRequirementOpen] = useState(false);
  const [isCreateLegalBasisModalOpen, setIsCreateLegalBasisModalOpen] = useState(false);
  const [legalBasisInputError, setLegalBasisInputError] = useState(null);
  const [isCreateArticlesModalOpen, setIsCreateArticlesModalOpen] = useState(null)
  const [isEditModalArticleOpen, setIsEditArticlesModalOpen] = useState(null)
  const [articleInputError, setArticleInputError] = useState(null)
  const [articleTypeInputError, setArticleTypeInputError] = useState(null)
  const [articleScoreInputError, setArticleScoreInputError] = useState(null)
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [formDataRequirement, setFormDataRequirement] = useState({
    reqIdentificationId: null,
    requirement: null,
    requirementName: "",
    requirementTypeIds: [],
    legalVerbs: [],
  });
  const [formDataLegalBasis, setFormDataLegalBasis] = useState({
    reqIdentificationId: null,
    requirementId: null,
    legalBasisId: null,
  });
  const [formDataArticle, setFormDataArticle] = useState({
    reqIdentificationId: null,
    requirementId: null,
    legalBasisId: null,
    articleId: null,
    articleType: "",
    score: 0,
  });


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
    setFilterByRequirementName("");
    setFilterByLegalBasisName("");
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
          case "legalBasisName":
            await fetchRequirementsByLegalBasisName(id, value);
            break;
          default:
            break;
        }
        setIsSearching(false);
      }, 500);
    },
    [
      id,
      fetchRequirementsByName,
      fetchRequirementsByRequirementName,
      fetchRequirementsByLegalBasisName,
    ]
  );

  const handleFilterByName = useCallback(
    (value) => {
      if (value.trim() === "") {
        handleClear();
        return;
      }
      setFilterByRequirementName("");
      setFilterByLegalBasisName("");
      setFilterByName(value);
      handleFilter("name", value);
    },
    [handleFilter, handleClear]
  );

  const handleFilterByRequirementName = useCallback(
    (value) => {
      if (value.trim() === "") {
        handleClear();
        return;
      }
      setFilterByName("");
      setFilterByLegalBasisName("");
      setFilterByRequirementName(value);
      handleFilter("requirementName", value);
    },
    [handleFilter, handleClear]
  );

  const handleFilterByLegalBasisName = useCallback(
    (value) => {
      if (value.trim() === "") {
        handleClear();
        return;
      }
      setFilterByName("");
      setFilterByRequirementName("");
      setFilterByLegalBasisName(value);
      handleFilter("legalBasisName", value);
    },
    [handleClear, handleFilter]
  );

  const openModalCreateRequirement = () => {
    const initialLegalVerbs = legalVerbs.map((verb) => ({
      id: verb.id,
      name: verb.name,
      translation: "",
    }));

    setFormDataRequirement({
      reqIdentificationId: id,
      requirement: null,
      requirementName: "",
      requirementTypeIds: [],
      legalVerbs: initialLegalVerbs,
    });

    setIsCreateModalRequirementOpen(true);
  };

  const handleRemoveLegalVerb = (id) => {
    setFormDataRequirement((prev) => ({
      ...prev,
      legalVerbs: prev.legalVerbs.filter((verb) => verb.id !== id),
    }));
    setLegalVerbsInputErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[id];
      return Object.keys(newErrors).length > 0 ? newErrors : null;
    });
  };

  const closeModalCreateRequirement = () => {
    setIsCreateModalRequirementOpen(false);
    setRequirementNameInputError(null);
    setRequirementTypesInputError(null);
    setLegalVerbsInputErrors(null);
  };

  const handleRequirementNameChange = useCallback(
    (e) => {
      const { value } = e.target;
      setFormDataRequirement((prevFormData) => ({
        ...prevFormData,
        requirementName: value,
      }));
      if (requirementNameInputError && value.trim() !== "") {
        setRequirementNameInputError(null);
      }
    },
    [
      requirementNameInputError,
      setRequirementNameInputError,
      setFormDataRequirement,
    ]
  );

  const handleRequirementChange = useCallback(
    (value) => {
      if (!value) {
        setFormDataRequirement((prevFormData) => ({
          ...prevFormData,
          requirement: null,
        }));
        if (requirementInputError) {
          setRequirementInputError(null);
        }
        return;
      }
      setFormDataRequirement((prevFormData) => ({
        ...prevFormData,
        requirement: value,
      }));
      if (requirementInputError && value.trim() !== "") {
        setRequirementInputError(null);
      }
    },
    [requirementInputError, setRequirementInputError, setFormDataRequirement]
  );

  const handleRequirementTypesChange = useCallback(
    (selectedIds) => {
      setFormDataRequirement((prevFormData) => ({
        ...prevFormData,
        requirementTypeIds: Array.from(selectedIds),
      }));

      if (requirementTypesInputError && selectedIds.size > 0) {
        setRequirementTypesInputError(null);
      }
    },
    [
      requirementTypesInputError,
      setFormDataRequirement,
      setRequirementTypesInputError,
    ]
  );

  const handleLegalVerbTranslationChange = useCallback(
    (id, value) => {
      setFormDataRequirement((prev) => ({
        ...prev,
        legalVerbs: prev.legalVerbs.map((verb) =>
          verb.id === id ? { ...verb, translation: value } : verb
        ),
      }));

      setLegalVerbsInputErrors((prevErrors) => {
        if (prevErrors?.[id] && value.trim() !== "") {
          const newErrors = { ...prevErrors };
          delete newErrors[id];
          return Object.keys(newErrors).length > 0 ? newErrors : null;
        }
        return prevErrors;
      });
    },
    [setFormDataRequirement, setLegalVerbsInputErrors]
  );

  const openModalDescription = (requirement, field, title) => {
    setSelectedRequirement({
      title: title,
      description: requirement[field],
    });
    setShowDescriptionModal(true);
  };

  const openEditRequirmentModal = (reqIdentificatioRequirement) => {
    setSelectedRequirement(reqIdentificatioRequirement);
    setIsEditModalRequirementOpen(true);
  };

  const closeEditRequirementModal = () => {
    setIsEditModalRequirementOpen(false);
    setSelectedRequirement(null);
    setRequirementNameInputError("");
    setRequirementInputError("");
    setLegalVerbsInputErrors("");
  }

  const closeModalDescription = () => {
    setShowDescriptionModal(false);
    setSelectedRequirement(null);
  };

  const openCreateLegalBasisModal = (requirementId) => {
    setFormDataLegalBasis({
      reqIdentificationId: id,
      requirementId: requirementId,
      legalBasisId: null,
    });
    setIsCreateLegalBasisModalOpen(true);
  };

  const closeCreateLegalBasisModal = () => {
    setIsCreateLegalBasisModalOpen(false);
    setLegalBasisInputError("")
  };

  const handleLegalBasisChange = useCallback(
    (value) => {
      if (!value) {
        setFormDataLegalBasis((prevFormData) => ({
          ...prevFormData,
          legalBasisId: null,
        }));
        if (legalBasisInputError) {
          setLegalBasisInputError(null);
        }
        return;
      }
      setFormDataLegalBasis((prevFormData) => ({
        ...prevFormData,
        legalBasisId: value,
      }));
      if (legalBasisInputError && value.trim() !== "") {
        setLegalBasisInputError(null);
      }
    },
    [legalBasisInputError, setLegalBasisInputError, setFormDataLegalBasis]
  );

  const openCreateArticleModal = (requirementId, legalBasisId) => {
    setFormDataArticle({
      reqIdentificationId: id,
      requirementId,
      legalBasisId,
      articleId: null,
      articleType: "",
      score: 0,
    });
    setIsCreateArticlesModalOpen(true);
  };

  const closeCreateArticleModal = () => {
    setIsCreateArticlesModalOpen(false);
    setArticleInputError("")
    setArticleTypeInputError("")
    setArticleScoreInputError("")
  };


  const handleArticleChange = useCallback(
    (value) => {
      if (!value) {
        setFormDataArticle((prevFormData) => ({
          ...prevFormData,
          articleId: null,
        }));
        if (articleInputError) {
          setArticleInputError(null);
        }
        return;
      }
      setFormDataArticle((prevFormData) => ({
        ...prevFormData,
        articleId: value,
      }));
      if (articleInputError && value.trim() !== "") {
        setArticleInputError(null);
      }
    },
    [articleInputError, setArticleInputError, setFormDataArticle]
  );

  const handleArticleTypeChange = useCallback(
    (value) => {
      if (!value) {
        setFormDataArticle((prevFormData) => ({
          ...prevFormData,
          articleType: "",
        }));
        if (articleTypeInputError) {
          setArticleTypeInputError(null);
        }
        return;
      }
      setFormDataArticle((prevFormData) => ({
        ...prevFormData,
        articleType: value,
      }));
      if (articleTypeInputError && value.trim() !== "") {
        setArticleTypeInputError(null);
      }
    },
    [
      articleTypeInputError,
      setFormDataArticle,
      setArticleTypeInputError,
    ]
  );

  const handleArticleScoreChange = useCallback(
    (e) => {
      const { value } = e.target;
      setFormDataArticle((prevFormData) => ({
        ...prevFormData,
        score: value,
      }));
      if (articleScoreInputError && value.trim() !== "") {
        setArticleScoreInputError(null);
      }
    },
    [articleScoreInputError, setFormDataArticle, setArticleScoreInputError]
  );

  const openEditArticleModal = (requirementId, legalBasisId, articleId, articleType, score) => {
    setFormDataArticle({
      reqIdentificationId: id,
      requirementId: requirementId,
      legalBasisId: legalBasisId,
      articleId: articleId.toString(),
      articleType: articleType,
      score: score,
    });
    setIsEditArticlesModalOpen(true);
  };

  const closeEditArticleModal = () => {
    setIsEditArticlesModalOpen(false);
    setArticleInputError("")
    setArticleTypeInputError("")
    setArticleScoreInputError("")
  };

  const handleDeleteRequirement = useCallback(
    async (requirementId) => {
      const toastId = toast.loading("Eliminando requerimiento...", {
        icon: <Spinner size="sm" />,
        progressStyle: {
          background: "#113c53",
        },
      });
      try {
        const { success, error } = await deleteRequirement(id, requirementId);
        if (success) {
          toast.update(toastId, {
            render: "Requerimiento eliminado con éxito",
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
            "Algo mal sucedió al eliminar el requerimiento. Intente de nuevo.",
          type: "error",
          icon: null,
          progressStyle: {},
          isLoading: false,
          autoClose: 5000,
        });
      }
    },
    [id, deleteRequirement]
  );


  const handleDeleteLegalBasis = useCallback(
    async (requirementId, legalBasisId) => {
      const toastId = toast.loading("Eliminando fundamento legal...", {
        icon: <Spinner size="sm" />,
        progressStyle: {
          background: "#113c53",
        },
      });
      try {
        const { success, error } = await deleteLegalBasis(id, requirementId, legalBasisId);
        if (success) {
          toast.update(toastId, {
            render: "Fundamento legal eliminado con éxito",
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
            "Algo mal sucedió al eliminar el fundamento legal. Intente de nuevo.",
          type: "error",
          icon: null,
          progressStyle: {},
          isLoading: false,
          autoClose: 5000,
        });
      }
    },
    [id, deleteLegalBasis]
  );

  if (
    loading && isFirstRender
  ) {
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
  if (requirementError)
    return (
      <Error
        title={requirementError.title}
        message={requirementError.message}
      />
    );
  if (requirementTypeError)
    return (
      <Error
        title={requirementTypeError.title}
        message={requirementTypeError.message}
      />
    );
  if (legalVerbsError)
    return (
      <Error title={legalVerbsError.title} message={legalVerbsError.message} />
    );
  if (legalBasisError)
    return (
      <Error title={legalBasisError.title} message={legalBasisError.message} />
    );
  if (reqIdentificationError)
    return (
      <Error
        title={reqIdentificationError.title}
        message={reqIdentificationError.message}
      />
    );

  return (
    <div className="mt-24 mb-4 -ml-60 mr-4 lg:-ml-0 lg:mr-0 xl:-ml-0 xl:mr-0 flex justify-center items-center flex-wrap">
      <>
        <TopContent
          config={{
            reqIdentification: reqIdentification,
            isEditModalRequirementOpen: isEditModalRequirementOpen,
            filterByRequirementName: filterByRequirementName,
            filterByLegalBasisName: filterByLegalBasisName,
            filterByName: filterByName,
            onFilterByRequirementName: handleFilterByRequirementName,
            onFilterByName: handleFilterByName,
            onFilterByLegalBasisName: handleFilterByLegalBasisName,
            onClear: handleClear,
            totalRequirements: reqIdentificationRequirements.length,
            openModalCreateRequirement: openModalCreateRequirement,
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
                        reqIdentificatioRequirement={requirement}
                        columns={columns}
                        openModalDescription={openModalDescription}
                        openEditRequirmentModal={openEditRequirmentModal}
                        openCreateLegalBasisModal={openCreateLegalBasisModal}
                        handleDeleteRequirement={handleDeleteRequirement}
                        handleDeleteLegalBasis={handleDeleteLegalBasis}
                        openCreateArticleModal={openCreateArticleModal}
                        openEditArticleModal={openEditArticleModal}
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
        {isCreateModalRequirementOpen && (
          <CreateReqIdentificationRequirementModal
            config={{
              isOpen: isCreateModalRequirementOpen,
              closeModalCreate: closeModalCreateRequirement,
              formData: formDataRequirement,
              addRequirement: addRequirement,
              requirementNameInputError: requirementNameInputError,
              setRequirementNameInputError: setRequirementNameInputError,
              handleRequirementNameChange: handleRequirementNameChange,
              requirementInputError: requirementInputError,
              setRequirementInputError: setRequirementInputError,
              handleRequirementChange: handleRequirementChange,
              handleRequirementTypesChange: handleRequirementTypesChange,
              legalVerbsInputErrors: legalVerbsInputErrors,
              setLegalVerbsInputErrors: setLegalVerbsInputErrors,
              handleLegalVerbTranslationChange:
                handleLegalVerbTranslationChange,
              requirements: requirements,
              requirementTypes: requirementTypes,
              handleRemoveLegalVerb: handleRemoveLegalVerb,
            }}
          />
        )}
        {isEditModalRequirementOpen && (
          <EditReqIdentificationRequirementModal
            config={{
              isOpen: isEditModalRequirementOpen,
              closeModalEdit: closeEditRequirementModal,
              formData: formDataRequirement,
              setFormData: setFormDataRequirement,
              editRequirement: editRequirement,
              selectedRequirement: selectedRequirement,
              requirementNameInputError: requirementNameInputError,
              setRequirementNameInputError: setRequirementNameInputError,
              handleRequirementNameChange: handleRequirementNameChange,
              requirementInputError: requirementInputError,
              setRequirementInputError: setRequirementInputError,
              handleRequirementChange: handleRequirementChange,
              handleRequirementTypesChange: handleRequirementTypesChange,
              legalVerbsInputErrors: legalVerbsInputErrors,
              setLegalVerbsInputErrors: setLegalVerbsInputErrors,
              handleLegalVerbTranslationChange: handleLegalVerbTranslationChange,
              requirements: requirements,
              requirementTypes: requirementTypes,
              legalVerbs: legalVerbs,
              handleRemoveLegalVerb: handleRemoveLegalVerb,


            }}
          />
        )}
        {isCreateLegalBasisModalOpen && (
          <CreateReqIdentificationLegalBasisModal
            config={{
              isOpen: isCreateLegalBasisModalOpen,
              closeModalCreate: closeCreateLegalBasisModal,
              formData: formDataLegalBasis,
              addLegalBasis: addLegalBasis,
              legalBasis: legalBasis,
              legalBasisInputError: legalBasisInputError,
              setLegalBasisInputError: setLegalBasisInputError,
              handleLegalBasisChange: handleLegalBasisChange,
            }}
          />
        )}
        {isCreateArticlesModalOpen && (
          <CreateReqIdentificationArticlesModal
            config={{
              isOpen: isCreateArticlesModalOpen,
              closeModalCreate: closeCreateArticleModal,
              formData: formDataArticle,
              addArticle: addArticle,
              articleInputError: articleInputError,
              setArticleInputError: setArticleInputError,
              handleArticleChange: handleArticleChange,
              articleTypeInputError: articleTypeInputError,
              setArticleTypeInputError: setArticleTypeInputError,
              handleArticleTypeChange: handleArticleTypeChange,
              articleScoreInputError: articleScoreInputError,
              setArticleScoreInputError: setArticleScoreInputError,
              handleArticleScoreChange: handleArticleScoreChange,
            }}
          />
        )}
        {isEditModalArticleOpen && (
          <EditReqIdentificationArticleModal
            config={{
              isOpen: isEditModalArticleOpen,
              closeModalEdit: closeEditArticleModal,
              formData: formDataArticle,
              editArticle: editArticle,
              articleInputError: articleInputError,
              setArticleInputError: setArticleInputError,
              handleArticleChange: handleArticleChange,
              articleTypeInputError: articleTypeInputError,
              setArticleTypeInputError: setArticleTypeInputError,
              handleArticleTypeChange: handleArticleTypeChange,
              articleScoreInputError: articleScoreInputError,
              setArticleScoreInputError: setArticleScoreInputError,
              handleArticleScoreChange: handleArticleScoreChange,
            }}
          />
        )}
      </>
    </div>
  );
}
