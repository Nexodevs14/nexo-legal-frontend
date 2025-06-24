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
import useReqIdentification from "../../hooks/reqIdentifications/useReqIdentifications.jsx";
import useSubjects from "../../hooks/subject/useSubjects";
import useAspects from "../../hooks/aspect/useAspects";
import useCopomex from "../../hooks/copomex/useCopomex";
import useUsers from "../../hooks/user/useUsers";
import TopContent from "./TopContent.jsx";
import ReqIdentificationCell from "./ReqIdentificationCell.jsx";
import EditReqIdentification from "./EditReqIdentifications.jsx"
import DeleteModal from "./deleteReqIdentifications.jsx";
import BottomContent from "../utils/BottomContent.jsx";
import Error from "../utils/Error.jsx";
import { toast } from "react-toastify";
import check from "../../assets/check.png";
import trash_icon from "../../assets/papelera-mas.png";


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

export default function ReqIdentification() {
    const {
        reqIdentifications,
        loading,
        error,
        fetchReqIdentifications,
        fetchReqIdentificationByName,
        fetchReqIdentificationByDescription,
        fetchReqIdentificationByUser,
        fetchReqIdentificationBySubject,
        fetchReqIdentificationBySubjectAndAspects,
        fetchReqIdentificationByJurisdiction,
        fetchReqIdentificationByState,
        fetchReqIdentificationByStateAndMunicipalities,
        fetchReqIdentificationByStatus,
        fetchReqIdentificationByCreationRange,
        modifyReqIdentification,
        removeReqIdentification,
        removeReqIdentificationsBatch,
        setReqIdentifications,
    } = useReqIdentification();
    const {
        subjects,
        loading: subjectLoading,
        error: subjectError,
    } = useSubjects();
    const { users } = useUsers();
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
    } = useCopomex();

    const [filterByName, setFilterByName] = useState("");
    const [filterByDescription, setFilterByDescription] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedAspects, setSelectedAspects] = useState([]);
    const [selectedJurisdiction, setSelectedJurisdiction] = useState("");
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
    const [selectedReqIdentification, setSelectedReqIdentification] = useState(null);
    const [nameInputError, setNameInputError] = useState(null);
    const [userInputError, setUserInputError] = useState(null);
    const [descriptionInputError, setDescriptionInputError] = useState(null);
    const [jurisdictionInputError, setJurisdictionInputError] = useState(null);
    const [stateInputError, setStateInputError] = useState(null);
    const [municipalityInputError, setMunicipalityInputError] = useState(null);
    const [subjectInputError, setSubjectInputError] = useState(null);
    const [creationRangeInputError, setCreationRangeInputError] = useState(null);
    const [isStateActive, setIsStateActive] = useState(false);
    const [isMunicipalityActive, setIsMunicipalityActive] = useState(false);
    const [isAspectsActive, setIsAspectsActive] = useState(false);
    const [aspectInputError, setAspectInputError] = useState(null);
    const [isDeletingBatch, setIsDeletingBatch] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        id: "",
        name: "",
        description: "",
        user: "",
        jurisdiction: "",
        state: "",
        municipality: "",
        subject: "",
        aspects: [],
    })
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
                        await fetchReqIdentificationByName(value);
                        break;
                    case "description":
                        await fetchReqIdentificationByDescription(value);
                        break;
                    case "user":
                        await fetchReqIdentificationByUser(value);
                        break;
                    case "subject":
                        await fetchReqIdentificationBySubject(value);
                        await fetchAspects(value);
                        break;
                    case "subjectAndAspects": {
                        const { subjectId, aspectsIds } = value;
                        await fetchReqIdentificationBySubjectAndAspects(subjectId, aspectsIds);
                        break;
                    }
                    case "jurisdiction":
                        await fetchReqIdentificationByJurisdiction(value);
                        break;
                    case "state":
                        await fetchReqIdentificationByState(value);
                        await fetchMunicipalities(value);
                        break;
                    case "stateAndMunicipalities": {
                        const { state, municipalities } = value;
                        await fetchReqIdentificationByStateAndMunicipalities(state, municipalities);
                        break;
                    }
                    case "status":
                        await fetchReqIdentificationByStatus(value);
                        break;
                    case "creationRange":
                        await fetchReqIdentificationByCreationRange(value);
                        break;
                    default:
                        break;
                }
                setIsSearching(false);
            }, 500);
        },
        [
            fetchReqIdentificationByName,
            fetchReqIdentificationByDescription,
            fetchReqIdentificationByUser,
            fetchReqIdentificationBySubject,
            fetchReqIdentificationBySubjectAndAspects,
            fetchReqIdentificationByJurisdiction,
            fetchReqIdentificationByState,
            fetchReqIdentificationByStateAndMunicipalities,
            fetchReqIdentificationByStatus,
            fetchReqIdentificationByCreationRange,
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
            resetStatesAndMunicipalities]);

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
            resetStatesAndMunicipalities]);

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
            resetStatesAndMunicipalities]);

    const handleFilterBySubject = useCallback(
        (selectedId) => {
            if (!selectedId) {
                handleClear();
                return;
            }
            setFilterByName("");
            setFilterByDescription("");
            setSelectedUser(null);
            setSelectedJurisdiction("");
            setSelectedStatus("");
            resetStatesAndMunicipalities();
            setCreationRange(null);
            setCreationRangeInvalid(false);
            setCreationRangeError("");
            setSelectedSubject(selectedId);
            handleFilter("subject", selectedId);
        }, [handleFilter, handleClear, resetStatesAndMunicipalities]
    );

    const handleFilterByAspects = useCallback(
        (selectedIds) => {
            setSelectedAspects(selectedIds);
            if (selectedIds.size === 0) {
                if (selectedSubject) {
                    handleFilter("subject", selectedSubject);
                } else {
                    handleClear();
                }
                return;
            }
            const value = {
                subjectId: selectedSubject,
                aspectsIds: Array.from(selectedIds),
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
            resetStatesAndMunicipalities]);

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
        (selectedIds) => {
            setSelectedMunicipalities(selectedIds);
            if (selectedIds.size === 0) {
                if (selectedState) {
                    handleFilter("state", selectedState);
                } else {
                    handleClear();
                }
                return;
            }
            const municipalitiesArray = Array.from(selectedIds);
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
            resetStatesAndMunicipalities]);

    const handleFilterByCreationRange = useCallback((values) => {
        if (values) {
            if (values.start.compare(values.end) > 0) {
                setCreationRangeInvalid(true);
                setCreationRangeError("Rango inválido");
            } else {
                setCreationRangeInvalid(false);
                setCreationRangeError("");
            }
            const { start, end } = values;
            fetchReqIdentificationByCreationRange(start.toString(), end.toString());
            setCreationRange(values);
        } else {
            handleClear();
            setCreationRange(null);
            setCreationRangeInvalid(false);
            setCreationRangeError("");
        }
    },
        [fetchReqIdentificationByCreationRange, handleClear]
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
        setJurisdictionInputError(null);
        setStateInputError(null);
        setMunicipalityInputError(null);
        setSubjectInputError(null);
        setAspectInputError(null);
        setIsStateActive(false);
        setIsMunicipalityActive(false);
        setIsAspectsActive(false);
        clearMunicipalities();
        clearAspects();
        setCreationRangeInputError(null);


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

    const handleJurisdictionChange = useCallback(
        (value) => {
            if (!value) {
                setStateInputError(null);
                setMunicipalityInputError(null);
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    jurisdiction: "",
                    state: "",
                    municipality: "",
                }));
                setIsStateActive(false);
                setIsMunicipalityActive(false);
                clearMunicipalities();
                if (jurisdictionInputError) {
                    setJurisdictionInputError(null);
                }
                return;
            }
            setStateInputError(null);
            setMunicipalityInputError(null);
            setFormData((prevFormData) => ({
                ...prevFormData,
                jurisdiction: value,
                state: "",
                municipality: "",
            }));
            if (jurisdictionInputError && value.trim() !== "") {
                setJurisdictionInputError(null);
            }
            switch (value) {
                case "Federal":
                    setIsStateActive(false);
                    setIsMunicipalityActive(false);
                    clearMunicipalities();
                    break;
                case "Estatal":
                    setIsStateActive(true);
                    setIsMunicipalityActive(false);
                    clearMunicipalities();
                    break;
                case "Local":
                    setIsStateActive(true);
                    setIsMunicipalityActive(false);
                    clearMunicipalities();
                    break;
                default:
                    setIsStateActive(false);
                    setIsMunicipalityActive(false);
                    clearMunicipalities();
                    break;
            }
        },
        [
            clearMunicipalities,
            jurisdictionInputError,
            setFormData,
            setIsMunicipalityActive,
            setIsStateActive,
            setJurisdictionInputError,
            setMunicipalityInputError,
            setStateInputError,
        ]
    );

    const handleStateChange = useCallback(
        async (value) => {
            if (!value) {
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    state: "",
                    municipality: "",
                }));
                if (stateInputError) {
                    setStateInputError(null);
                }
                if (municipalityInputError) {
                    setMunicipalityInputError(null);
                }
                clearMunicipalities();
                setIsMunicipalityActive(false);
                return;
            }
            setFormData((prevFormData) => ({
                ...prevFormData,
                state: value,
                municipality: "",
            }));
            if (stateInputError && value.trim() !== "") {
                setStateInputError(null);
            }
            if (formData.jurisdiction === "Local") {
                setIsMunicipalityActive(true);
                await fetchMunicipalities(value);
            } else {
                setIsMunicipalityActive(false);
                clearMunicipalities();
            }
        },
        [
            clearMunicipalities,
            fetchMunicipalities,
            formData.jurisdiction,
            municipalityInputError,
            setFormData,
            setIsMunicipalityActive,
            setMunicipalityInputError,
            setStateInputError,
            stateInputError,
        ]
    );

    const handleMunicipalityChange = useCallback(
        (value) => {
            if (!value) {
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    municipality: "",
                }));
                if (municipalityInputError) {
                    setMunicipalityInputError(null);
                }
                return;
            }
            setFormData((prevFormData) => ({
                ...prevFormData,
                municipality: value,
            }));

            if (municipalityInputError && value.trim() !== "") {
                setMunicipalityInputError(null);
            }
        },
        [municipalityInputError, setFormData, setMunicipalityInputError]
    );

    const handleSubjectChange = useCallback(
        async (value) => {
            if (!value) {
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    subject: "",
                    aspects: [],
                }));
                if (subjectInputError) {
                    setSubjectInputError(null);
                }
                clearAspects();
                setIsAspectsActive(false);
                setAspectInputError(null);
                return;
            }
            setFormData((prevFormData) => ({
                ...prevFormData,
                subject: value,
                aspects: [],
            }));
            if (subjectInputError && value.trim() !== "") {
                setSubjectInputError(null);
            }
            setAspectInputError(null);
            setIsAspectsActive(true);
            await fetchAspects(value);
        },
        [
            clearAspects,
            fetchAspects,
            setAspectInputError,
            setFormData,
            setIsAspectsActive,
            setSubjectInputError,
            subjectInputError,
        ]
    );

    const handleAspectsChange = useCallback(
        (selectedIds) => {
            setFormData((prevFormData) => ({
                ...prevFormData,
                aspects: Array.from(selectedIds),
            }));
            if (aspectInputError && selectedIds.size > 0) {
                setAspectInputError(null);
            }
        },
        [aspectInputError, setFormData, setAspectInputError]
    );
    const handleCreationRangeChange = useCallback(
        (value) => {
            if (!value) {
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    creationRange: null,
                }));
                return;
            }
            setFormData((prevFormData) => ({
                ...prevFormData,
                creationRange: value,
            }));
            if (creationRangeInputError) {
                setCreationRangeInputError(null);
            }
        },
        [creationRangeInputError, setFormData, setCreationRangeInputError]
    );



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
            const toastId = toast.loading("Eliminando fundamento legal...", {
                icon: <Spinner size="sm" />,
                progressStyle: {
                    background: "#113c53",
                },
            });
            try {
                const { success, error } = await removeReqIdentification(reqIdentificationId);
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
                        render: error,
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
    if (subjectError)
        return <Error title={subjectError.title} message={subjectError.message} />;
    if (
        aspectError &&
        !isEditModalOpen
    )
        return <Error title={aspectError.title} message={aspectError.message} />;
    if (errorStates)
        return <Error title={errorStates.title} message={errorStates.message} />;
    if (
        errorMunicipalities &&
        !isEditModalOpen
    ) {
        return (
            <Error
                title={errorMunicipalities.title}
                message={errorMunicipalities.message}
            />
        );
    }

    return (
        <div className="mt-24 mb-4 -ml-60 mr-4 lg:-ml-0 lg:mr-0 flex justify-center items-center flex-wrap">
            <TopContent
                config={{
                    isEditModalOpen: isEditModalOpen,
                    onRowsPerPageChange: onRowsPerPageChange,
                    totalReqIdentifications: reqIdentifications.length,
                    filterByName: filterByName,
                    filterByDescription: filterByDescription,
                    onFilterByName: handleFilterByName,
                    onFilterByDescription: handleFilterByDescription,
                    users: users,
                    selectedUser: selectedUser,
                    onFilterByUser: handleFilterByUser,
                    subjects: subjects,
                    selectedSubject: selectedSubject,
                    subjectLoading: subjectLoading,
                    onFilterBySubject: handleFilterBySubject,
                    aspects: aspects,
                    selectedAspects: selectedAspects,
                    aspectsLoading: aspectsLoading,
                    onFilterByAspects: handleFilterByAspects,
                    selectedJurisdiction: selectedJurisdiction,
                    onFilterByJurisdiction: handleFilterByJurisdiction,
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
                        emptyContent="No hay identificaciones disponibles"
                    >
                        {(reqIdentification) => (
                            <TableRow key={reqIdentification.id}>
                                {(columnKey) => (
                                    <TableCell>
                                        <ReqIdentificationCell
                                            reqIdentification={reqIdentification}
                                            columnKey={columnKey}
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
                        isOpen: isEditModalOpen,
                        closeModalEdit: closeEditModal,
                        formData: formData,
                        setFormData: setFormData,
                        editReqIdentification: modifyReqIdentification,
                        selectedReqIdentification: selectedReqIdentification,
                        setReqIdentifications: setReqIdentifications,
                        nameError: nameInputError,
                        setNameError: setNameInputError,
                        handleNameChange: handleNameChange,
                        users: users,
                        userError: userInputError,
                        setUserError: setUserInputError,
                        handleUserChange: handleUserChange,
                        descriptionError: descriptionInputError,
                        setDescriptionError: setDescriptionInputError,
                        handleDescriptionChange: handleDescriptionChange,
                        jurisdictionError: jurisdictionInputError,
                        setJurisdictionError: setJurisdictionInputError,
                        handleJurisdictionChange: handleJurisdictionChange,
                        states: states,
                        stateError: stateInputError,
                        setStateError: setStateInputError,
                        isStateActive: isStateActive,
                        handleStateChange: handleStateChange,
                        clearMunicipalities: clearMunicipalities,
                        municipalities: municipalities,
                        municipalityError: municipalityInputError,
                        setMunicipalityError: setMunicipalityInputError,
                        isMunicipalityActive: isMunicipalityActive,
                        loadingMunicipalities: loadingMunicipalities,
                        errorMunicipalities: errorMunicipalities,
                        handleMunicipalityChange: handleMunicipalityChange,
                        subjects: subjects,
                        subjectInputError: subjectInputError,
                        setSubjectError: setSubjectInputError,
                        handleSubjectChange: handleSubjectChange,
                        aspects: aspects,
                        aspectError: aspectInputError,
                        setAspectInputError: setAspectInputError,
                        isAspectsActive: isAspectsActive,
                        aspectsLoading: aspectsLoading,
                        errorAspects: aspectError,
                        handleAspectsChange: handleAspectsChange,
                        setIsStateActive: setIsStateActive,
                        setIsMunicipalityActive: setIsMunicipalityActive,
                        setIsAspectsActive: setIsAspectsActive,
                        handleCreationRangeChange: handleCreationRangeChange,
                        clearAspects: clearAspects,
                        fetchMunicipalities: fetchMunicipalities,
                        fetchAspects: fetchAspects,

                    }}
                />
            )}
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
                        check: check,
                    }}
                />
            )}
        </div>
    );
}
