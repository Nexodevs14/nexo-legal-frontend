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
 *
 * This component renders the top section of the Requirement Identifications view,
 * providing a comprehensive set of filters to refine the displayed data. It includes
 * filters by name, description, status, responsible user, creation date, subject,
 * aspects, jurisdiction, state, and municipalities. It also includes pagination controls.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.config - Configuration object containing all filters, state values and callbacks.
 * @param {Function} props.config.onRowsPerPageChange - Callback triggered when changing rows per page.
 * @param {number} props.config.totalReqIdentifications - Total number of requirement identifications found.
 * @param {string} props.config.filterByName - Current filter value for the name input.
 * @param {string} props.config.filterByDescription - Current filter value for the description input.
 * @param {Function} props.config.onFilterByName - Callback triggered when filtering by name.
 * @param {Function} props.config.onFilterByDescription - Callback triggered when filtering by description.
 * @param {string} props.config.selectedStatus - Currently selected status filter.
 * @param {Function} props.config.onFilterByStatus - Callback triggered when filtering by status.
 * @param {Array} props.config.users - List of users available for filtering.
 * @param {boolean} props.config.usersLoading - Indicates if users are currently loading.
 * @param {number} props.config.selectedUser - Currently selected user ID.
 * @param {Function} props.config.onFilterByUser - Callback triggered when filtering by user.
 * @param {Array} props.config.subjects - List of available subjects.
 * @param {string} props.config.selectedSubject - Currently selected subject.
 * @param {boolean} props.config.subjectLoading - Indicates if subjects are currently loading.
 * @param {Function} props.config.onFilterBySubject - Callback triggered when filtering by subject.
 * @param {Array} props.config.aspects - List of available aspects.
 * @param {Array<string>} props.config.selectedAspects - List of selected aspects.
 * @param {boolean} props.config.aspectsLoading - Indicates if aspects are currently loading.
 * @param {Function} props.config.onFilterBySubjectAndAspects - Callback triggered when filtering by subject and aspects.
 * @param {string} props.config.selectedJurisdiction - Currently selected jurisdiction.
 * @param {Function} props.config.onFilterByJurisdiction - Callback triggered when filtering by jurisdiction.
 * @param {Array<string>} props.config.states - List of available states.
 * @param {string} props.config.selectedState - Currently selected state.
 * @param {boolean} props.config.stateLoading - Indicates if states are currently loading.
 * @param {Function} props.config.onFilterByState - Callback triggered when filtering by state.
 * @param {Array<string>} props.config.municipalities - List of available municipalities.
 * @param {Array<string>} props.config.selectedMunicipalities - List of selected municipalities.
 * @param {boolean} props.config.municipalitiesLoading - Indicates if municipalities are currently loading.
 * @param {Function} props.config.onFilterByMunicipalities - Callback triggered when filtering by municipalities.
 * @param {Object} props.config.creationRange - Selected creation date range object.
 * @param {boolean} props.config.creationRangeInvalid - Whether the selected date range is invalid.
 * @param {string} [props.config.creationRangeError] - Optional error message for invalid date range.
 * @param {Function} props.config.onFilterByCreationRange - Callback triggered when selecting a date range.
 * @param {Function} props.config.onClear - Callback to clear all filters.
 *
 * @returns {JSX.Element} Rendered TopContent component.
 */
function TopContent({ config }) {
  const {
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
    subjects,
    selectedSubject,
    subjectLoading,
    onFilterBySubject,
    aspects,
    selectedAspects,
    aspectsLoading,
    onFilterBySubjectAndAspects,
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
    creationRange,
    creationRangeInvalid,
    creationRangeError,
    onFilterByCreationRange,
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
            emptyContent: "Estatus no encontrado",
          }}
          onSelectionChange={onFilterByStatus}
        >
          <AutocompleteItem
            key="Activo"
            startContent={<div className="w-2 h-2 rounded-full bg-green" />}
          >
            Activo
          </AutocompleteItem>
          <AutocompleteItem
            key="Completado"
            startContent={<div className="w-2 h-2 rounded-full bg-blue-500" />}
          >
            Completado
          </AutocompleteItem>
          <AutocompleteItem
            key="Fallido"
            startContent={<div className="w-2 h-2 rounded-full bg-red" />}
          >
            Fallido
          </AutocompleteItem>
        </Autocomplete>
        <Autocomplete
          placeholder={!selectedUser ? "Buscar por usuario..." : ""}
          variant="faded"
          color="primary"
          defaultItems={users}
          isLoading={usersLoading}
          selectedKey={selectedUser || null}
          onSelectionChange={onFilterByUser}
          allowsEmptyCollection
          allowsCustomValue={false}
          className="w-full max-w-[280px]"
          classNames={{
            inputWrapper: "pr-1.5 pl-2 h-11",
            input: "text-sm truncate",
            clearButton: "mr-1",
            base: "w-full max-w-[280px]",
          }}
          listboxProps={{
            emptyContent: "Usuario no encontrado",
          }}
          startContent={(() => {
            const selected = users.find(
              (u) => u.id.toString() === selectedUser?.toString()
            );
            if (!selected) {
              return (
                <img
                  src={search_icon}
                  alt="Search Icon"
                  className="w-4 h-4 flex-shrink-0"
                />
              );
            }

            return (
              <div className="flex items-center gap-2">
                {selected.profile_picture &&
                selected.profile_picture.trim() !== "" ? (
                  <img
                    src={selected.profile_picture}
                    alt={selected.name || "Usuario"}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <img
                    src={defaultAvatar}
                    alt="Avatar por defecto"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                )}
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-sm font-medium text-gray-800 truncate max-w-[160px]">
                    {selected.name || "Usuario"}
                  </span>
                  <span className="text-xs text-gray-500 truncate max-w-[160px]">
                    {selected.gmail}
                  </span>
                </div>
              </div>
            );
          })()}
        >
          {users.map((user) => (
            <AutocompleteItem key={user.id} value={user.id}>
              <div className="flex items-center gap-3">
                {user.profile_picture && user.profile_picture.trim() !== "" ? (
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
                    {user.name || "Usuario"}
                  </span>
                  <span className="text-xs text-gray-500">{user.gmail}</span>
                </div>
              </div>
            </AutocompleteItem>
          ))}
        </Autocomplete>
        <I18nProvider locale="es">
          <DateRangePicker
            value={creationRange}
            showMonthAndYearPickers
            onChange={onFilterByCreationRange}
            color="primary"
            radius="sm"
            variant="faded"
            aria-label="Buscar por fecha de creación"
            label="Fecha de creación"
            isInvalid={creationRangeInvalid}
            errorMessage={creationRangeInvalid ? creationRangeError : " "}
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
              isLoading={aspectsLoading}
              selectionMode="multiple"
              selectedKeys={selectedAspects}
              listboxProps={{
                emptyContent: "Aspectos no encontrados",
              }}
              isDisabled={!selectedSubject}
              onSelectionChange={onFilterBySubjectAndAspects}
              renderValue={(selected) =>
                !selected || selected.length === 0
                  ? "Buscar por aspecto..."
                  : `${selected.length} aspecto${
                      selected.length > 1 ? "s" : ""
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
              isLoading={municipalitiesLoading}
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
                  : `${selected.length} municipio${
                      selected.length > 1 ? "s" : ""
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
            <select
              className="bg-transparent outline-none text-default-400"
              onChange={onRowsPerPageChange}
            >
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
        gmail: PropTypes.string.isRequired,
        profile_picture: PropTypes.string,
      })
    ).isRequired,
    selectedUser: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    usersLoading: PropTypes.bool.isRequired,
    onFilterByUser: PropTypes.func.isRequired,
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
    onFilterBySubjectAndAspects: PropTypes.func.isRequired,
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
    creationRange : PropTypes.shape({
      start: PropTypes.instanceOf(Date),
      end: PropTypes.instanceOf(Date),
    }),
    creationRangeInvalid: PropTypes.bool.isRequired,
    creationRangeError: PropTypes.string,
    onFilterByCreationRange: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
  }).isRequired,
};

export default TopContent;
