import PropTypes from "prop-types";
import {
    Input,
    Autocomplete,
    AutocompleteItem,
    Select,
    SelectItem,
    Tooltip,
    DateRangePicker,
} from "@heroui/react";
import { I18nProvider } from "@react-aria/i18n";
import search_icon from "../../assets/busqueda_blue.png";
import defaultAvatar from "../../assets/usuario.png";

/**
 * TopContent component for Requirement Identifications
 */
function TopContent({ config }) {
    const {
        isCreateModalOpen,
        isEditModalOpen,
        isFilterModalOpen,
        onRowsPerPageChange,
        totalReqIdentifications,
        filterByName,
        filterByDescription,
        onFilterByName,
        onFilterByDescription,
        selectedStatus,
        onFilterByStatus,
        users,
        usersLoading,
        selectedUser,
        onFilterByUser,
        createdAtRange,
        createdAtIsInvalid,
        createdAtError,
        onFilterByCreatedAtRange,
        subjects,
        selectedSubject,
        subjectLoading,
        onFilterBySubject,
        aspects,
        selectedAspects,
        aspectsLoading,
        onFilterByAspects,
        selectedJurisdiction,
        onFilterByJurisdiction,
        states,
        selectedState,
        stateLoading,
        onFilterByState,
        municipalities,
        selectedMunicipalities,
        municipalitiesLoading,
        onFilterByMunicipalities,
        onClear,
    } = config;

    return (
        <div className="flex flex-col gap-4 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                <Input
                    color="primary"
                    variant="faded"
                    isClearable
                    value={filterByName}
                    className="w-full"
                    placeholder="Buscar por nombre..."
                    startContent={
                        <img
                            src={search_icon}
                            alt="Search Icon"
                            className="w-4 h-4 flex-shrink-0"
                        />
                    }
                    onClear={onClear}
                    onValueChange={onFilterByName}
                />

                <Input
                    color="primary"
                    variant="faded"
                    isClearable
                    value={filterByDescription}
                    className="w-full"
                    placeholder="Buscar por descripción..."
                    startContent={
                        <img
                            src={search_icon}
                            alt="Search"
                            className="w-4 h-4 flex-shrink-0"
                        />
                    }
                    onClear={onClear}
                    onValueChange={onFilterByDescription}
                />
                <Autocomplete
                    color="primary"
                    variant="faded"
                    onClear={onClear}
                    placeholder="Buscar pos status.."
                    startContent={
                        <img
                            src={search_icon}
                            alt="Search Icon"
                            className="w-4 h-4 flex-shrink-0"
                        />
                    }
                    className="w-full"
                    selectedKey={selectedStatus}
                    listboxProps={{
                        emptyContent: "Estatus no encontrado"
                    }}
                    onSelectionChange={onFilterByStatus}
                >
                    <AutocompleteItem key="Activo" startContent={<div className="w-2 h-2 rounded-full bg-green" />} >
                        Activo
                    </AutocompleteItem>
                    <AutocompleteItem key="Completado" startContent={<div className="w-2 h-2 rounded-full bg-blue-500" />} >
                        Completado
                    </AutocompleteItem>
                    <AutocompleteItem key="Fallido" startContent={<div className="w-2 h-2 rounded-full bg-red" />} >
                        Fallido
                    </AutocompleteItem>

                </Autocomplete>

                <Autocomplete
                    color="primary"
                    variant="faded"
                    defaultItems={users}
                    isLoading={usersLoading}
                    onClear={onClear}
                    placeholder="Buscar por usuario..."
                    startContent={
                        <img
                            src={search_icon}
                            alt="Search Icon"
                            className="w-4 h-4 flex-shrink-0"
                        />
                    }
                    className="w-full"
                    selectedKey={selectedUser}
                    listboxProps={{
                        emptyContent: "Usuario no encontrado",
                    }}
                    onSelectionChange={onFilterByUser}
                >
                    {(user) => (
                        <AutocompleteItem key={user?.id} value={user?.id}>
                            <div className="flex items-center gap-3">
                                {user?.profile_picture && user.profile_picture.trim() !== "" ? (
                                    <img
                                        src={user.profile_picture}
                                        alt={user.name || "Usuario"}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <img
                                        src={defaultAvatar}
                                        alt="Avatar por defecto"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                )}

                                <div className="flex flex-col text-left">
                                    <span className="text-sm font-medium text-gray-800">
                                        {user?.name || "Usuario"}
                                    </span>
                                    <span className="text-xs text-gray-500">{user?.gmail}</span>
                                </div>
                            </div>
                        </AutocompleteItem>
                    )}
                </Autocomplete>


                <I18nProvider locale="es">
                    <DateRangePicker
                        value={createdAtRange}
                        showMonthAndYearPickers
                        onChange={onFilterByCreatedAtRange}
                        color="primary"
                        radius="sm"
                        variant="faded"
                        aria-label="Buscar por fecha de creación"
                        label="Fecha de creación"
                        isInvalid={createdAtIsInvalid}
                        errorMessage={createdAtIsInvalid ? createdAtError : " "}
                        classNames={{
                            base: "h-12 relative",
                            input: "text-xs",
                            errorMessage: "absolute mt-1 text-xs",
                        }}
                    />
                </I18nProvider>

                <Autocomplete
                    color="primary"
                    variant="faded"
                    defaultItems={subjects}
                    isLoading={subjectLoading}
                    onClear={onClear}
                    placeholder="Buscar por materia..."
                    startContent={
                        <img
                            src={search_icon}
                            alt="Search Icon"
                            className="w-4 h-4 flex-shrink-0"
                        />
                    }
                    className="w-full"
                    selectedKey={selectedSubject}
                    listboxProps={{
                        emptyContent: "Materia no encontrada",
                    }}
                    onSelectionChange={onFilterBySubject}
                >
                    {(subject) => (
                        <AutocompleteItem key={subject.id} value={subject.id}>
                            {subject.subject_name}
                        </AutocompleteItem>
                    )}
                </Autocomplete>
                <Tooltip
                    content="Debes seleccionar una materia"
                    isDisabled={!!selectedSubject}
                >
                    <div className="w-full">
                        <Select
                            color="primary"
                            items={aspects}
                            onClear={onClear}
                            variant="faded"
                            placeholder="Buscar por aspecto..."
                            startContent={
                                <img
                                    src={search_icon}
                                    alt="Search Icon"
                                    className="w-4 h-4 flex-shrink-0"
                                />
                            }
                            className="w-full"
                            isLoading={
                                aspectsLoading && !isCreateModalOpen && !isEditModalOpen && !isFilterModalOpen
                            }
                            selectionMode="multiple"
                            selectedKeys={selectedAspects}
                            listboxProps={{
                                emptyContent: "Aspectos no encontrados",
                            }}
                            isDisabled={!selectedSubject}
                            onSelectionChange={onFilterByAspects}
                            renderValue={(selected) =>
                                !selected || selected.length === 0
                                    ? "Buscar por aspecto..."
                                    : `${selected.length} aspecto${selected.length > 1 ? "s" : ""
                                    } seleccionado${selected.length > 1 ? "s" : ""}`
                            }
                        >
                            {(aspect) => (
                                <SelectItem key={aspect.id} value={aspect.id}>
                                    {aspect.aspect_name}
                                </SelectItem>
                            )}
                        </Select>
                    </div>
                </Tooltip>
                <Autocomplete
                    color="primary"
                    variant="faded"
                    onClear={onClear}
                    placeholder="Buscar por jurisdicción..."
                    startContent={
                        <img
                            src={search_icon}
                            alt="Search Icon"
                            className="w-4 h-4 flex-shrink-0"
                        />
                    }
                    className="w-full"
                    selectedKey={selectedJurisdiction}
                    listboxProps={{
                        emptyContent: "Jurisdicción no encontrada",
                    }}
                    onSelectionChange={onFilterByJurisdiction}
                >
                    <AutocompleteItem key="Federal">Federal</AutocompleteItem>
                    <AutocompleteItem key="Estatal">Estatal</AutocompleteItem>
                    <AutocompleteItem key="Local">Local</AutocompleteItem>
                </Autocomplete>
                <Autocomplete
                    color="primary"
                    variant="faded"
                    defaultItems={states.map((estado) => ({ id: estado, name: estado }))}
                    isLoading={stateLoading}
                    onClear={onClear}
                    placeholder="Buscar por estado..."
                    startContent={
                        <img
                            src={search_icon}
                            alt="Search Icon"
                            className="w-4 h-4 flex-shrink-0"
                        />
                    }
                    className="w-full"
                    selectedKey={selectedState}
                    listboxProps={{
                        emptyContent: "Estado no encontrado",
                    }}
                    onSelectionChange={onFilterByState}
                >
                    {(estado) => (
                        <AutocompleteItem key={estado.id} value={estado.id}>
                            {estado.name}
                        </AutocompleteItem>
                    )}
                </Autocomplete>
                <Tooltip
                    content="Debes seleccionar un estado"
                    isDisabled={!!selectedState}
                >
                    <div className="w-full">
                        <Select
                            color="primary"
                            items={municipalities.map((municipio) => ({
                                id: municipio,
                                name: municipio,
                            }))}
                            onClear={onClear}
                            variant="faded"
                            placeholder="Buscar por municipio..."
                            startContent={
                                <img
                                    src={search_icon}
                                    alt="Search Icon"
                                    className="w-4 h-4 flex-shrink-0"
                                />
                            }
                            className="w-full"
                            isLoading={
                                municipalitiesLoading && !isCreateModalOpen && !isEditModalOpen && !isFilterModalOpen
                            }
                            selectionMode="multiple"
                            selectedKeys={selectedMunicipalities}
                            listboxProps={{
                                emptyContent: "Municipios no encontrados",
                            }}
                            isDisabled={!selectedState}
                            onSelectionChange={onFilterByMunicipalities}
                            renderValue={(selected) =>
                                !selected || selected.length === 0
                                    ? "Buscar por municipio..."
                                    : `${selected.length} municipio${selected.length > 1 ? "s" : ""
                                    } seleccionado${selected.length > 1 ? "s" : ""}`
                            }
                        >
                            {(municipio) => (
                                <SelectItem key={municipio.id} value={municipio.id}>
                                    {municipio.name}
                                </SelectItem>
                            )}
                        </Select>
                    </div>
                </Tooltip>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <span className="text-default-400">
                    Identificaciones totales: {totalReqIdentifications}
                </span>
                <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto sm:ml-auto">
                    <label className="flex items-center text-default-400 gap-2 min-w-[150px]">
                        Filas por página:
                        <select className="bg-transparent outline-none text-default-400" onChange={onRowsPerPageChange}>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="40">40</option>
                        </select>
                    </label>
                </div>
            </div>
        </div>
    );
}

TopContent.propTypes = {
    config: PropTypes.shape({
        isCreateModalOpen: PropTypes.bool.isRequired,
        isEditModalOpen: PropTypes.bool.isRequired,
        isFilterModalOpen: PropTypes.bool.isRequired,
        onRowsPerPageChange: PropTypes.func.isRequired,
        totalReqIdentifications: PropTypes.number.isRequired,
        filterByName: PropTypes.string.isRequired,
        filterByDescription: PropTypes.string.isRequired,
        onFilterByName: PropTypes.func.isRequired,
        onFilterByDescription: PropTypes.func.isRequired,
        selectedStatus: PropTypes.string.isRequired,
        onFilterByStatus: PropTypes.func.isRequired,
        users: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                name: PropTypes.string.isRequired,
            })
        ).isRequired,
        selectedUser: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        usersLoading: PropTypes.bool.isRequired,
        onFilterByUser: PropTypes.func.isRequired,
        createdAtRange: PropTypes.object.isRequired,
        createdAtIsInvalid: PropTypes.bool.isRequired,
        createdAtError: PropTypes.string,
        onFilterByCreatedAtRange: PropTypes.func.isRequired,
        subjects: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                subject_name: PropTypes.string,
            })
        ).isRequired,
        selectedSubject: PropTypes.string,
        subjectLoading: PropTypes.bool.isRequired,
        onFilterBySubject: PropTypes.func.isRequired,
        aspects: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                aspect_name: PropTypes.string,
            })
        ).isRequired,
        selectedAspects: PropTypes.arrayOf(PropTypes.string),
        aspectsLoading: PropTypes.bool.isRequired,
        onFilterByAspects: PropTypes.func.isRequired,
        selectedJurisdiction: PropTypes.string,
        onFilterByJurisdiction: PropTypes.func.isRequired,
        states: PropTypes.arrayOf(PropTypes.string).isRequired,
        selectedState: PropTypes.string,
        stateLoading: PropTypes.bool.isRequired,
        onFilterByState: PropTypes.func.isRequired,
        municipalities: PropTypes.arrayOf(PropTypes.string).isRequired,
        selectedMunicipalities: PropTypes.array,
        municipalitiesLoading: PropTypes.bool.isRequired,
        onFilterByMunicipalities: PropTypes.func.isRequired,
        onClear: PropTypes.func.isRequired,
    }).isRequired,
};

export default TopContent;
