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
import useReqIdentifications from "../../hooks/reqIdentifications/useReqIdentifications";


const EditReqIdentification = ({ config }) => {
    const {
        isOpen,
        closeModalEdit,
        selectedReqIdentification,
        nameError,
        setNameError,
        descriptionError,
        setDescriptionError,
        users,
        userError,
        setUserError,
        usersLoading,
        setReqIdentifications,
    } = config;

    const [formData, setFormData] = useState({
        id: "",
        name: "",
        description: "",
        jurisdiction: "",
        state: "",
        municipality: "",
        subject: { id: "", name: "" },
        aspects: [],
        status: "",
        user: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const { editReqIdentification } = useReqIdentifications();


    useEffect(() => {
        if (selectedReqIdentification) {
            setFormData({
                id: selectedReqIdentification.id,
                name: selectedReqIdentification.name || "",
                description: selectedReqIdentification.description || "",
                jurisdiction: selectedReqIdentification.jurisdiction || "",
                state: selectedReqIdentification.state || "",
                municipality: selectedReqIdentification.municipality || "",
                subject: {
                    id: selectedReqIdentification.subject?.subject_id?.toString() || "",
                    name: selectedReqIdentification.subject?.subject_name || "",
                },
                aspects:
                    selectedReqIdentification.aspects?.map((a) => ({
                        id: a.aspect_id.toString(),
                        name: a.aspect_name,
                    })) || [],
                status: selectedReqIdentification.status || "Activo",
                user: selectedReqIdentification.user?.id?.toString() || "",
            });
        }
    }, [selectedReqIdentification,
        editReqIdentification
    ]);

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

  if (!formData.user) {
    setUserError("El usuario responsable es obligatorio");
    setIsLoading(false);
    return;
  } else {
    setUserError(null);
  }

  try {
    const reqIdentificationData = {
      id: formData.id,
      reqIdentificationName: formData.name,
      reqIdentificationDescription: formData.description,
      newUserId: formData.user,
    };

    const { success, error } = await editReqIdentification(reqIdentificationData);

    if (success) {
      // Conservar valores previos si no fueron modificados
      const updated = {
        ...selectedReqIdentification, // ← valores anteriores
        id: formData.id,
        name: formData.name,
        description: formData.description,
        user: formData.user,
        updatedAt: new Date().toISOString(), // ← se actualiza al guardar
      };

      setReqIdentifications((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );

      toast.info("Identificación actualizada con éxito", {
        icon: () => <img src={check} alt="Success Icon" />,
        progressStyle: {
          background: "#113c53",
        },
      });
      closeModalEdit();
    } else {
      toast.error(error || "No se pudo actualizar");
    }
  } catch (error) {
    console.error(error);
    toast.error("Error inesperado al actualizar.");
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
                        {/* Nombre */}
                        <div className="col-span-2 relative z-0 w-full group">
                            <input
                                type="text"
                                name="nombre"
                                id="floating_nombre"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

                        {/* Descripción */}
                        <div className="col-span-2 w-full">
                            <Textarea
                                disableAnimation
                                disableAutosize
                                id="floating_description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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

                        {/* Usuario */}
                        <div className="col-span-2 w-full relative">
                            <Autocomplete
                                placeholder={!formData.user ? "Buscar usuario..." : ""}
                                variant="faded"
                                color="primary"
                                defaultItems={users}
                                isLoading={usersLoading}
                                selectedKey={formData.user || null}
                                onSelectionChange={(selectedKey) =>
                                    setFormData((prev) => ({ ...prev, user: selectedKey || "" }))
                                }
                                allowsEmptyCollection
                                allowsCustomValue={false}
                                className="w-full"
                                listboxProps={{
                                    emptyContent: "Usuario no encontrado",
                                }}
                                startContent={
                                    (() => {
                                        const selected = users.find((u) => u.id.toString() === formData.user);
                                        if (!selected) return null;
                                        return (
                                            <div className="flex items-center gap-3">
                                                {selected.profile_picture ? (
                                                    <img
                                                        src={selected.profile_picture}
                                                        alt={selected.name || "Usuario"}
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-white">
                                                        {selected.name?.charAt(0)?.toUpperCase() || "?"}
                                                    </div>
                                                )}
                                                <div className="flex flex-col text-left">
                                                    <span className="text-sm font-medium text-gray-800">
                                                        {selected.name || "Usuario"}
                                                    </span>
                                                    <span className="text-xs text-gray-500">{selected.gmail}</span>
                                                </div>
                                            </div>
                                        );
                                    })()
                                }

                            >
                                {users.map((user) => (
                                    <AutocompleteItem key={user.id} value={user.id}>
                                        <div className="flex items-center gap-3">
                                            {user.profile_picture ? (
                                                <img
                                                    src={user.profile_picture}
                                                    alt={user.name || "Usuario"}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-white">
                                                    {user.name?.charAt(0)?.toUpperCase() || "?"}
                                                </div>
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

                            {/* ✅ Botón ✖ dentro del input */}
                            {formData.user && (
                                <button
                                    type="button"
                                    onClick={() => setFormData((prev) => ({ ...prev, user: "" }))}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                                >

                                </button>
                            )}

                            {userError && <p className="mt-2 text-sm text-red">{userError}</p>}
                        </div>


                        {/* Jurisdicción */}
                        <Input
                            isReadOnly
                            label="Jurisdicción"
                            value={formData.jurisdiction}
                            variant="bordered"
                            className="w-full"
                        />

                        {/* Estado */}
                        <Input
                            isReadOnly
                            label="Estado"
                            value={formData.state || ""}
                            variant="bordered"
                            className="w-full"
                        />

                        {/* Municipio */}
                        <Input
                            isReadOnly
                            label="Municipio"
                            value={formData.municipality || ""}
                            variant="bordered"
                            className="w-full"
                        />

                        {/* Materia */}
                        <Input
                            isReadOnly
                            label="Materia"
                            value={formData.subject.name}
                            variant="bordered"
                            className="w-full"
                        />

                        {/* Aspectos */}
                        <div className="col-span-2">
                            <Textarea
                                isReadOnly
                                label="Aspectos"
                                value={formData.aspects.map((a) => a.name).join(", ")}
                                variant="bordered"
                                className="w-full"
                            />
                        </div>

                        {/* Botón */}
                        <div className="col-span-2 w-full mt-2">
                            <Button
                                type="submit"
                                color="primary"
                                disabled={isLoading}
                                className="w-full rounded border mb-4 border-primary bg-primary p-3 text-white transition hover:bg-opacity-90"
                            >
                                {isLoading ? <Spinner size="sm" color="white" /> : "Editar Fundamento"}
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
        isOpen: PropTypes.bool.isRequired,
        closeModalEdit: PropTypes.func.isRequired,
        selectedReqIdentification: PropTypes.object,
        editReqIdentification: PropTypes.func.isRequired,
        nameError: PropTypes.string,
        setNameError: PropTypes.func,
        handleNameChange: PropTypes.func,
        descriptionError: PropTypes.string,
        setDescriptionError: PropTypes.func,
        handleDescriptionChange: PropTypes.func,
        users: PropTypes.array,
        userError: PropTypes.string,
        setUserError: PropTypes.func,
        handleUserChange: PropTypes.func,
        usersLoading: PropTypes.bool,
        setReqIdentifications: PropTypes.func
    }).isRequired,
};

export default EditReqIdentification;
