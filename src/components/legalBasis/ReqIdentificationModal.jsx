import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  Spinner,
  Textarea,
  Button,
  Radio,
  RadioGroup,
  Alert,
  Autocomplete,
  AutocompleteItem,
  Chip,
} from "@heroui/react";
import { toast } from "react-toastify";
import check from "../../assets/check.png";
import Progress from "./reqIdentificationProgress/Progress";
import { useNavigate } from "react-router-dom";
import useReqIdentifications from "../../hooks/reqIdentifications/useReqIdentifications";
import useRequirements from "../../hooks/requirement/useRequirements";

/**
 * ReqIdentificationModal.jsx
 *
 * Modal for creating a Requirement Identification based on selected Legal Basis records.
 * @param {Object} props - Component properties.
 * @param {boolean} props.isOpen - Controls whether the modal is open.
 * @param {Function} props.closeModal - Function to close the modal.
 * @param {Object} props.selectLegalBasis - Selected legal basis records for the identification.
 *
 * @returns {JSX.Element} Rendered ReqIdentificationModal component.
 */

const ReqIdentificationModal = ({ isOpen, closeModal, selectLegalBasis }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    intelligenceLevel: "",
  });

  const [formValues, setFormValues] = useState({
    legalBasisId: null,
    jurisdiction: "",
    state: "",
    municipality: "",
    subject: "",
    aspects: [],
  });

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    intelligenceLevel: "",
  });

  const { addReqIdentification } = useReqIdentifications();
  const [isLoading, setIsLoading] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [reqIdentificationId, setReqIdentificationId] = useState(null);

  const {
    requirements,
    loading: requirementsLoading,
    error: requirementsError,
    fetchRequirementsBySubjectAndAspects,
  } = useRequirements({ autoFetch: false });

  const [selectedRequirements, setSelectedRequirements] = useState([]);
  const [requirementInputError, setRequirementInputError] = useState("");
  const [jobId, setJobId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen || !selectLegalBasis) {
      if (isOpen) toast.error("Debe seleccionar un fundamento legal.");
      return;
    }

    setFormValues({
      legalBasisId: selectLegalBasis.id,
      jurisdiction: selectLegalBasis.jurisdiction || "",
      state: selectLegalBasis.state || "",
      municipality: selectLegalBasis.municipality || "",
      subject: selectLegalBasis.subject?.subject_name || "",
      aspects: (selectLegalBasis.aspects || []).map((a) => a.aspect_name),
    });

    if (
      selectLegalBasis.subject?.subject_id &&
      selectLegalBasis.aspects?.length > 0
    ) {
      const aspectsIds = selectLegalBasis.aspects.map((a) => a.aspect_id);
      fetchRequirementsBySubjectAndAspects(
        selectLegalBasis.subject.subject_id,
        aspectsIds
      );
    }
  }, [isOpen, selectLegalBasis, fetchRequirementsBySubjectAndAspects]);

  useEffect(() => {
    if (isOpen && requirements.length > 0) {
      setSelectedRequirements(
        requirements.map((requirement) => String(requirement.id))
      );
    }
  }, [isOpen, requirements]);

  const handleSelectRequirement = (key) => {
    if (key && !selectedRequirements.includes(key)) {
      setSelectedRequirements((prev) => [...prev, key]);
    }
    setRequirementInputError("");
  };

  const handleRemoveRequirement = (id) => {
    setSelectedRequirements((prev) => prev.filter((reqId) => reqId !== id));
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const onClose = () => {
    setJobId(null);
    setShowProgress(false);
    setReqIdentificationId(null);
    closeModal();
  };

  const onComplete = () => {
    setJobId(null);
    setShowProgress(false);
    closeModal();
    navigate(`/req_identifications/${reqIdentificationId}/requirements`);
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    if (!form.name.trim()) {
      setErrors({
        name: "Este campo es obligatorio.",
        description: "",
        intelligenceLevel: "",
      });
      setIsLoading(false);
      return;
    }

    if (!form.description.trim()) {
      setErrors({
        name: "",
        description: "Este campo es obligatorio.",
        intelligenceLevel: "",
      });
      setIsLoading(false);
      return;
    }

    if (selectedRequirements.length === 0) {
      setRequirementInputError("Debe seleccionar al menos un requerimiento.");
      setIsLoading(false);
      return;
    }

    if (!form.intelligenceLevel.trim()) {
      setErrors({
        name: "",
        description: "",
        intelligenceLevel: "Debe seleccionar un nivel de inteligencia.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { success, error, reqIdentificationId, jobId } =
        await addReqIdentification({
          reqIdentificationName: form.name,
          reqIdentificationDescription: form.description,
          legalBasisId: formValues.legalBasisId,
          requirementIds: selectedRequirements.map(Number),
          intelligenceLevel: form.intelligenceLevel,
        });

      if (success) {
        toast.info(
          "La identificación de requerimientos ha comenzado correctamente.",
          {
            icon: () => <img src={check} alt="Success Icon" />,
            progressStyle: { background: "#113c53" },
          }
        );

        if (!jobId) {
          onClose();
        } else {
          setJobId(jobId);
          setShowProgress(true);
          setReqIdentificationId(reqIdentificationId);
        }
      } else {
        toast.error(error || "Ocurrió un error al iniciar la identificación.");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        "Algo mal sucedió al comenzar la identificación. Intente de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReload = () => window.location.reload();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={showProgress ? "lg" : "4xl"}
      backdrop="opaque"
      placement="center"
      isDismissable={false}
      isKeyboardDismissDisabled={false}
      classNames={{
        closeButton: "hover:bg-primary/20 text-primary active:bg-primary/10",
      }}
    >
      <ModalContent>
        {showProgress ? (
          <Progress
            jobId={jobId}
            onComplete={onComplete}
            onClose={onClose}
            labelTop="Cuando se complete la identificación, podrás ver los resultados."
            labelButton="Ver resultados"
          />
        ) : requirementsLoading ? (
          <div className="flex items-center justify-center h-64">
            <Spinner color="secondary" />
          </div>
        ) : requirementsError ? (
          <Alert
            color="danger"
            title="Error al cargar requerimientos"
            description={
              requirementsError.message || "Intenta de nuevo más tarde."
            }
            endContent={
              <Button
                color="danger"
                size="sm"
                variant="faded"
                onPress={handleReload}
              >
                Reintentar
              </Button>
            }
          />
        ) : (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Identificación de Requerimientos
            </ModalHeader>

            <ModalBody className="max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
                <div className="col-span-2 relative z-0 w-full group">
                  <input
                    type="text"
                    id="floating_name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
                    placeholder=""
                  />
                  <label
                    htmlFor="floating_name"
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Nombre
                  </label>
                  {errors.name && (
                    <p className="mt-2 text-sm text-red">{errors.name}</p>
                  )}
                </div>

                <div className="col-span-2 w-full">
                  <Textarea
                    id="floating_description"
                    value={form.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    label="Descripción de la identificación de requerimientos"
                    variant="bordered"
                  />
                  {errors.description && (
                    <p className="mt-2 text-sm text-red">
                      {errors.description}
                    </p>
                  )}
                </div>

                <Input
                  isReadOnly
                  label="Jurisdicción"
                  value={formValues.jurisdiction}
                  variant="bordered"
                />
                {formValues.state && (
                  <Input
                    isReadOnly
                    label="Estado"
                    value={formValues.state}
                    variant="bordered"
                  />
                )}
                {formValues.municipality && (
                  <Input
                    isReadOnly
                    label="Municipio"
                    value={formValues.municipality}
                    variant="bordered"
                  />
                )}
                <Input
                  isReadOnly
                  label="Materia"
                  value={formValues.subject}
                  variant="bordered"
                />

                <div className="col-span-2">
                  <Textarea
                    isReadOnly
                    label="Aspectos"
                    value={formValues.aspects.join(", ")}
                    variant="bordered"
                  />
                </div>

                <div className="col-span-2 flex flex-col gap-2">
                  <Autocomplete
                    label="Buscar requerimientos"
                    placeholder="Escribe para buscar..."
                    variant="bordered"
                    allowsCustomValue={false}
                    onSelectionChange={handleSelectRequirement}
                    listboxProps={{
                      emptyContent: "No se encontraron requerimientos.",
                    }}
                  >
                    {requirements.map((req) => (
                      <AutocompleteItem key={String(req.id)}>
                        {req.requirement_name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedRequirements.map((id) => {
                      const req = requirements.find((r) => String(r.id) === id);
                      return (
                        <Chip
                          key={id}
                          onClose={() => handleRemoveRequirement(id)}
                          variant="bordered"
                          color="primary"
                        >
                          {req?.requirement_name}
                        </Chip>
                      );
                    })}
                  </div>
                  {requirementInputError && (
                    <p className="mt-1 text-sm text-red">
                      {requirementInputError}
                    </p>
                  )}
                </div>

                <div className="col-span-2 w-full mt-2 mb-4 flex flex-col items-start">
                  <RadioGroup
                    size="md"
                    orientation="horizontal"
                    label="Nivel de Inteligencia:"
                    value={form.intelligenceLevel}
                    onValueChange={(value) =>
                      handleChange("intelligenceLevel", value)
                    }
                  >
                    <Radio
                      value="Low"
                      description="Inteligencia baja: más rápida, pero menos precisa."
                    >
                      Bajo
                    </Radio>
                    <Radio
                      value="High"
                      description="Inteligencia alta: más lenta, pero más precisa."
                    >
                      Alto
                    </Radio>
                  </RadioGroup>
                  {errors.intelligenceLevel && (
                    <p className="mt-1 text-sm text-red">
                      {errors.intelligenceLevel}
                    </p>
                  )}
                </div>
              </div>

              <div className="w-full mt-2">
                <Button
                  type="submit"
                  color="primary"
                  onPress={handleSubmit}
                  className="w-full rounded border mb-4 border-primary bg-primary p-3 text-white transition hover:bg-opacity-90"
                >
                  {isLoading ? (
                    <Spinner size="sm" color="white" />
                  ) : (
                    "Comenzar Identificación de Requerimientos"
                  )}
                </Button>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

ReqIdentificationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  selectLegalBasis: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    legal_name: PropTypes.string,
    abbreviation: PropTypes.string,
    classification: PropTypes.string,
    jurisdiction: PropTypes.string,
    state: PropTypes.string,
    municipality: PropTypes.string,
    last_reform: PropTypes.string,
    url: PropTypes.string,
    subject: PropTypes.shape({
      subject_id: PropTypes.number,
      subject_name: PropTypes.string,
    }),
    aspects: PropTypes.arrayOf(
      PropTypes.shape({
        aspect_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        aspect_name: PropTypes.string.isRequired,
      })
    ),
  }),
};

export default ReqIdentificationModal;
