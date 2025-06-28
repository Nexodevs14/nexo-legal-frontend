// EditReqIdentification.jsx
import PropTypes from "prop-types";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Spinner,
  Autocomplete,
  AutocompleteItem,
  Input,
  Textarea,
} from "@heroui/react";
import { useState, useEffect } from "react";
import check from "../../assets/check.png";
import { toast } from "react-toastify";
import defaultAvatar from "../../assets/usuario.png";

/**
 * EditReqIdentification component
 *
 * This component renders a modal that allows editing an existing Requirement Identification.
 * It pre-fills the form with selected data and allows editing of the name, description,
 * and assigned user. Jurisdiction, state, municipality, subject, and aspects are shown as read-only.
 *
 * Validation is applied to required fields, and the component handles loading state and displays
 * success or error messages using React Toastify.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.config - Configuration object with data and handlers.
 * @param {Function} props.config.editReqIdentification - Function to update the requirement identification.
 * @param {boolean} props.config.isOpen - Whether the modal is open.
 * @param {Object} props.config.formData - Current values of the form fields.
 * @param {string|number} props.config.formData.id - ID of the requirement identification.
 * @param {string} props.config.formData.name - Name of the identification.
 * @param {string} props.config.formData.description - Description of the identification.
 * @param {string} [props.config.formData.jurisdiction] - Jurisdiction (read-only).
 * @param {string} [props.config.formData.state] - State (read-only).
 * @param {string} [props.config.formData.municipality] - Municipality (read-only).
 * @param {Object} [props.config.formData.subject] - Subject associated with the identification.
 * @param {string} [props.config.formData.subject.id] - Subject ID.
 * @param {string} [props.config.formData.subject.name] - Subject name.
 * @param {Array<Object>} [props.config.formData.aspects] - Array of related aspects.
 * @param {string} [props.config.formData.status] - Status of the identification.
 * @param {string} [props.config.formData.user] - Selected user ID.
 * @param {Function} props.config.setFormData - Function to update form data state.
 * @param {Function} props.config.closeModalEdit - Function to close the modal.
 * @param {Object} [props.config.selectedReqIdentification] - Requirement Identification object to edit.
 * @param {string} [props.config.nameError] - Error message for the name input.
 * @param {Function} props.config.setNameError - Setter for the name error message.
 * @param {Function} props.config.handleNameChange - Handler for name input changes.
 * @param {string} [props.config.descriptionError] - Error message for the description field.
 * @param {Function} props.config.setDescriptionError - Setter for the description error message.
 * @param {Function} props.config.handleDescriptionChange - Handler for description input changes.
 * @param {string} [props.config.userError] - Error message for the user selection.
 * @param {Function} props.config.setUserError - Setter for the user error message.
 * @param {Function} props.config.handleUserChange - Handler for user selection changes.
 * @param {Array<Object>} props.config.users - List of users available for assignment.
 * @param {boolean} props.config.usersLoading - Whether users are being fetched.
 *
 * @returns {JSX.Element} Rendered EditReqIdentification modal component.
 */
const EditReqIdentification = ({ config }) => {
  const {
    editReqIdentification,
    isOpen,
    closeModalEdit,
    formData,
    setFormData,
    selectedReqIdentification,
    nameError,
    setNameError,
    handleNameChange,
    descriptionError,
    setDescriptionError,
    handleDescriptionChange,
    userError,
    handleUserChange,
    users,
    usersLoading,
  } = config;

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedReqIdentification) {
      setFormData({
        id: selectedReqIdentification.id,
        name: selectedReqIdentification.name,
        description: selectedReqIdentification.description,
        jurisdiction: selectedReqIdentification.jurisdiction,
        state: selectedReqIdentification.state,
        municipality: selectedReqIdentification.municipality,
        subject: {
          id: selectedReqIdentification.subject?.subject_id?.toString(),
          name: selectedReqIdentification.subject?.subject_name,
        },
        aspects:
          selectedReqIdentification.aspects?.map((a) => ({
            id: a.aspect_id.toString(),
            name: a.aspect_name,
          })) || [],
        status: selectedReqIdentification.status,
        user: selectedReqIdentification.user?.id?.toString(),
      });
    }
  }, [selectedReqIdentification, editReqIdentification, setFormData]);

  const handleEdit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.name.trim()) {
      setNameError("Este campo es obligatorio");
      setIsLoading(false);
      return;
    } else {
      setNameError(null);
    }

    if (!formData.description.trim()) {
      setDescriptionError("Este campo es obligatorio.");
      setIsLoading(false);
      return;
    } else {
      setDescriptionError(null);
    }

    try {
      const reqIdentificationData = {
        id: formData.id,
        reqIdentificationName: formData.name,
        reqIdentificationDescription: formData.description,
        newUserId: Number(formData.user),
      };

      const { success, error } = await editReqIdentification(
        reqIdentificationData
      );
      if (success) {
        toast.info(
          "La identificación de requerimiento ha sido actualizada correctamente",
          {
            icon: () => <img src={check} alt="Success Icon" />,
            progressStyle: {
              background: "#113c53",
            },
          }
        );
        closeModalEdit();
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
        "Algo mal sucedió al actualizar la identificación de requerimiento. Intente de nuevo"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={closeModalEdit}
      backdrop="opaque"
      placement="center"
      isDismissable={false}
      isKeyboardDismissDisabled={false}
      classNames={{
        closeButton: "hover:bg-primary/20 text-primary active:bg-primary/10",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Editar Identificación de Requerimiento
        </ModalHeader>
        <ModalBody>
          <form
            onSubmit={handleEdit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="col-span-2 relative z-0 w-full group">
              <input
                type="text"
                name="nombre"
                id="floating_nombre"
                value={formData.name}
                onChange={handleNameChange}
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
                placeholder=""
              />
              <label
                htmlFor="floating_nombre"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Nombre
              </label>
              {nameError && (
                <p className="mt-2 text-sm text-red">{nameError}</p>
              )}
            </div>
            <div className="col-span-2 w-full">
              <Textarea
                disableAnimation
                disableAutosize
                id="floating_description"
                value={formData.description}
                onChange={handleDescriptionChange}
                classNames={{
                  base: "max-w",
                  input:
                    "resize-y min-h-[80px] py-1 px-2 w-full text-xs text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-primary peer",
                }}
                label="Descripción de la identificación de requerimientos"
                placeholder=""
                variant="bordered"
              />
              {descriptionError && (
                <p className="mt-2 text-sm text-red">{descriptionError}</p>
              )}
            </div>
            <div className="col-span-2 w-full relative">
              <Autocomplete
                label="
                "
                placeholder={!formData.user ? "Buscar usuario..." : ""}
                variant="faded"
                defaultItems={users}
                isLoading={usersLoading}
                selectedKey={formData.user || null}
                onSelectionChange={handleUserChange}
                allowsEmptyCollection
                allowsCustomValue={false}
                className="w-full"
                listboxProps={{
                  emptyContent: "Usuario no encontrado",
                }}
                startContent={(() => {
                  const selected = users.find(
                    (u) => u.id.toString() === formData.user
                  );
                  if (!selected) return null;
                  return (
                    <div className="flex items-center gap-2">
                      {selected.profile_picture && selected.profile_picture.trim() !== "" ? (
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
                        <span className="text-sm font-medium text-gray-800 truncate whitespace-nowrap max-w-[180px]">
                          {selected.name || "Usuario"}
                        </span>
                        <span className="text-xs text-gray-500 truncate whitespace-nowrap max-w-[180px]">
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
                        <span className="text-xs text-gray-500">
                          {user.gmail}
                        </span>
                      </div>
                    </div>
                  </AutocompleteItem>
                ))}
              </Autocomplete>
              {formData.user && (
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, user: "" }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                ></button>
              )}

              {userError && (
                <p className="mt-2 text-sm text-red">{userError}</p>
              )}
            </div>
            <Input
              isReadOnly
              label="Jurisdicción"
              value={formData.jurisdiction}
              variant="bordered"
              className="w-full"
            />
            {formData.state && (
              <Input
                isReadOnly
                label="Estado"
                value={formData.state}
                variant="bordered"
                className="w-full"
              />
            )}
            {formData.municipality && (
              <Input
                isReadOnly
                label="Municipio"
                value={formData.municipality}
                variant="bordered"
                className="w-full"
              />
            )}
            <Input
              isReadOnly
              label="Materia"
              value={formData.subject.name}
              variant="bordered"
              className="w-full"
            />
            <div className="col-span-2">
              <Textarea
                isReadOnly
                label="Aspectos"
                value={formData.aspects.map((a) => a.name).join(", ")}
                variant="bordered"
                className="w-full"
              />
            </div>
            <div className="col-span-2 w-full mt-2">
              <Button
                type="submit"
                color="primary"
                disabled={isLoading}
                className="w-full rounded border mb-4 border-primary bg-primary p-3 text-white transition hover:bg-opacity-90"
              >
                {isLoading ? (
                  <Spinner size="sm" color="white" />
                ) : (
                  "Editar Identificación de Requerimiento"
                )}
              </Button>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

EditReqIdentification.propTypes = {
  config: PropTypes.shape({
    editReqIdentification: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    formData: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      jurisdiction: PropTypes.string,
      state: PropTypes.string,
      municipality: PropTypes.string,
      subject: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
      }),
      aspects: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          name: PropTypes.string,
        })
      ),
      status: PropTypes.string,
      user: PropTypes.string,
    }).isRequired,
    setFormData: PropTypes.func.isRequired,
    closeModalEdit: PropTypes.func.isRequired,
    selectedReqIdentification: PropTypes.object,
    nameError: PropTypes.string,
    setNameError: PropTypes.func,
    handleNameChange: PropTypes.func,
    descriptionError: PropTypes.string,
    setDescriptionError: PropTypes.func,
    handleDescriptionChange: PropTypes.func,
    userError: PropTypes.string,
    setUserError: PropTypes.func,
    handleUserChange: PropTypes.func,
    users: PropTypes.array,
    usersLoading: PropTypes.bool,
  }).isRequired,
};

export default EditReqIdentification;
