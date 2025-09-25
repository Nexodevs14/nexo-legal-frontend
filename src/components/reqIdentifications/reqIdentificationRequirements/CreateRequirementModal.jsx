import PropTypes from "prop-types";
import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Spinner,
  Autocomplete,
  AutocompleteItem,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { toast } from "react-toastify";
import check from "../../../assets/check.png";

/**
 * CreateReqIdentificationRequirementModal component
 *
 * Modal for associating an existing requirement with a requirement identification.
 * Allows defining a custom name, selecting the base requirement, and choosing requirement types.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.config - Configuration object containing state, data, and handlers.
 * @param {boolean} props.config.isOpen - Indicates whether the modal is open.
 * @param {Function} props.config.closeModalCreate - Function to close the modal.
 * @param {Object} props.config.formData - Form data including name, requirement, and types.
 * @param {Function} props.config.addRequirement - Function to associate the selected requirement.
 * @param {string|null} props.config.requirementNameInputError - Error message for the name field.
 * @param {Function} props.config.setRequirementNameInputError - Setter for name field error.
 * @param {Function} props.config.handleRequirementNameChange - Handler for name input change.
 * @param {string|null} props.config.requirementInputError - Error message for the requirement field.
 * @param {Function} props.config.setRequirementInputError - Setter for requirement field error.
 * @param {Function} props.config.handleRequirementChange - Handler for selecting a requirement.
 * @param {Function} props.config.handleRequirementTypesChange - Handler for selecting requirement types.
 * @param {Object} props.config.legalVerbsInputErrors - Object containing errors for legal verb translations.
 * @param {Function} props.config.setLegalVerbsInputErrors - Setter for legal verb
 * @param {Array<Object>} props.config.requirements - List of available base requirements.
 * @param {Array<Object>} props.config.requirementTypes - List of available requirement types.
 * @param {Function} props.config.handleRemoveLegalVerb - Handler to remove a legal verb from the form.
 *
 *
 * @returns {JSX.Element} Rendered modal component.
 */

const CreateReqIdentificationRequirementModal = ({ config }) => {
  const {
    isOpen,
    closeModalCreate,
    formData,
    addRequirement,
    requirementNameInputError,
    setRequirementNameInputError,
    handleRequirementNameChange,
    requirementInputError,
    setRequirementInputError,
    handleRequirementChange,
    handleRequirementTypesChange,
    legalVerbsInputErrors,
    setLegalVerbsInputErrors,
    handleLegalVerbTranslationChange,
    requirements,
    requirementTypes,
    handleRemoveLegalVerb,
  } = config;
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!formData.requirementName.trim()) {
      setRequirementNameInputError("Este campo es obligatorio.");
      setIsLoading(false);
      return;
    } else {
      setRequirementNameInputError(null);
    }
    if (!formData.requirement) {
      setRequirementInputError("Debes seleccionar un requerimiento.");
      setIsLoading(false);
      return;
    } else {
      setRequirementInputError(null);
    }

    const newLegalVerbsInputErrors = {};
    formData.legalVerbs.forEach((verb) => {
      if (verb.translation.trim() === "") {
        newLegalVerbsInputErrors[verb.id] =
          "Este campo es obligatorio. Si no aplica, Por favor, elimína este campo.";
      } else {
        if (legalVerbsInputErrors?.[verb.id]) {
          delete newLegalVerbsInputErrors[verb.id];
        }
      }
    });

    if (Object.keys(newLegalVerbsInputErrors).length > 0) {
      setLegalVerbsInputErrors(newLegalVerbsInputErrors);
      setIsLoading(false);
      return;
    }
    try {
      const requirementData = {
        reqIdentificationId: Number(formData.reqIdentificationId),
        requirementId: Number(formData.requirement),
        requirementName: formData.requirementName,
        requirementTypeIds: formData.requirementTypeIds.map(Number),
        legalVerbs: formData.legalVerbs
          .filter((verb) => verb.translation.trim() !== "")
          .map((verb) => ({
            id: Number(verb.id),
            translation: verb.translation,
          })),
      };
      const { success, error } = await addRequirement(requirementData);
      if (success) {
        toast.info("El requerimiento ha sido asociado correctamente", {
          icon: () => <img src={check} alt="Success Icon" />,
          progressStyle: { background: "#113c53" },
        });
        closeModalCreate();
      } else {
        toast.error(
          <div
            className="toast-scroll-red"
            style={{
              maxHeight: 200,
              overflowY: "auto",
              whiteSpace: "pre-wrap",
            }}
          >
            {error}
          </div>
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "Hubo un error al asociar el requerimiento. Intente de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModalCreate}
      isDismissable={false}
      placement="center"
      size="4xl"
      classNames={{
        closeButton: "hover:bg-primary/20 text-primary active:bg-primary/10",
      }}
    >
      <ModalContent>
        <>
          <ModalHeader className="flex items-center gap-2">
            Asociar nuevo requerimiento
          </ModalHeader>
          <ModalBody className="overflow-y-auto max-h-[50vh] px-6">
            <form className="flex flex-col gap-6" onSubmit={handleCreate}>
              <div className="col-span-2 relative z-0 w-full group">
                <input
                  type="text"
                  name="nombre"
                  id="floating_nombre"
                  value={formData.requirementName}
                  onChange={handleRequirementNameChange}
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
                  placeholder=""
                />
                <label
                  htmlFor="floating_nombre"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Nombre
                </label>
                {requirementNameInputError && (
                  <p className="mt-2 text-sm text-red">
                    {requirementNameInputError}
                  </p>
                )}
              </div>

              <div className="w-full">
                <Autocomplete
                  size="sm"
                  variant="bordered"
                  label="Requerimiento"
                  selectedKey={formData.requirement}
                  onSelectionChange={handleRequirementChange}
                  listboxProps={{
                    emptyContent: "No se encontró el requerimiento",
                  }}
                  defaultItems={requirements}
                >
                  {(requirement) => (
                    <AutocompleteItem
                      key={requirement.id}
                      value={requirement.id}
                    >
                      {requirement.requirement_name}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
                {requirementInputError && (
                  <p className="mt-2 text-sm text-red">
                    {requirementInputError}
                  </p>
                )}
              </div>

              <div className="w-full">
                <Select
                  size="sm"
                  variant="bordered"
                  label="Tipos de requerimiento"
                  selectionMode="multiple"
                  selectedKeys={formData.requirementTypeIds}
                  onSelectionChange={handleRequirementTypesChange}
                  items={requirementTypes}
                  listboxProps={{
                    emptyContent: "No se encontraron tipos de requerimiento",
                  }}
                >
                  {(type) => (
                    <SelectItem key={type.id} value={type.name}>
                      {type.name}
                    </SelectItem>
                  )}
                </Select>
              </div>
              {formData.legalVerbs.map((verb) => (
                <div key={verb.id} className="relative col-span-2 w-full group">
                  <Textarea
                    value={verb.translation}
                    onChange={(e) =>
                      handleLegalVerbTranslationChange(verb.id, e.target.value)
                    }
                    label={
                      <>
                        Traducción del Verbo Legal: <strong>{verb.name}</strong>
                      </>
                    }
                    placeholder="Escribir traducción"
                    variant="bordered"
                    minRows={2}
                    maxRows={4}
                    classNames={{
                      input:
                        "resize-y min-h-[80px] py-1 px-2 w-full text-xs text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-primary peer",
                    }}
                  />

                  {legalVerbsInputErrors?.[verb.id] && (
                    <p className="mt-1 text-xs text-red">
                      {legalVerbsInputErrors[verb.id]}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveLegalVerb(verb.id)}
                    className="absolute right-1 top-1 text-gray-400 hover:text-red text-lg"
                    title="Eliminar este verbo"
                  >
                    &times;
                  </button>
                </div>
              ))}
              <div className="sticky bottom-2  z-10 bg-whit px-0">
                <Button
                  type="submit"
                  color="primary"
                  disabled={isLoading}
                  className="w-full rounded border mb-0 border-primary bg-primary p-3 text-white transition hover:bg-opacity-90"
                >
                  {isLoading ? (
                    <Spinner size="sm" color="white" />
                  ) : (
                    "Asociar requerimiento"
                  )}
                </Button>
              </div>
            </form>
          </ModalBody>
        </>
      </ModalContent>
    </Modal>
  );
};

CreateReqIdentificationRequirementModal.propTypes = {
  config: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    closeModalCreate: PropTypes.func.isRequired,
    formData: PropTypes.shape({
      reqIdentificationId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]).isRequired,
      requirement: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      requirementName: PropTypes.string,
      requirementTypeIds: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      ),
      legalVerbs: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
          name: PropTypes.string,
          description: PropTypes.string,
          translation: PropTypes.string,
        })
      ),
    }).isRequired,
    addRequirement: PropTypes.func.isRequired,
    requirementNameInputError: PropTypes.string,
    setRequirementNameInputError: PropTypes.func.isRequired,
    handleRequirementNameChange: PropTypes.func.isRequired,
    requirementInputError: PropTypes.string,
    setRequirementInputError: PropTypes.func.isRequired,
    handleRequirementChange: PropTypes.func.isRequired,
    handleRequirementTypesChange: PropTypes.func.isRequired,
    legalVerbsInputErrors: PropTypes.string,
    setLegalVerbsInputErrors: PropTypes.func.isRequired,
    handleLegalVerbTranslationChange: PropTypes.func.isRequired,
    requirements: PropTypes.array,
    requirementTypes: PropTypes.array,
    handleRemoveLegalVerb: PropTypes.func.isRequired,
  }).isRequired,
};

export default CreateReqIdentificationRequirementModal;
