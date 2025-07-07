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
} from "@heroui/react";
import { toast } from "react-toastify";
import check from "../../../assets/check.png";

/**
 * Modal component for associating a legal basis to a requirement identification.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.config - Configuration object for the modal.
 * @param {boolean} props.config.isOpen - Controls the visibility of the modal.
 * @param {Function} props.config.closeModalCreate - Function to close the modal.
 * @param {Object} props.config.formData - Current form data.
 * @param {Function} [props.config.setFormData] - Function to update form data.
 * @param {Function} props.config.addLegalBasis - Function to associate a legal basis.
 * @param {Array<Object>} props.config.legalBasis - List of available legal bases.
 * @param {string} [props.config.legalBasisInputError] - Error message for legal basis input.
 * @param {Function} props.config.setLegalBasisInputError - Function to set input error message.
 * @param {Function} props.config.handleLegalBasisChange - Handler for legal basis selection change.
 *
 * @returns {JSX.Element} The modal for associating a legal basis.
 */
const CreateReqIdentificationLegalBasisModal = ({ config }) => {
  const {
    isOpen,
    closeModalCreate,
    formData,
    addLegalBasis,
    legalBasis,
    legalBasisInputError,
    setLegalBasisInputError,
    handleLegalBasisChange,
  } = config;
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!formData.legalBasisId) {
      setLegalBasisInputError("Debes seleccionar un fundamento legal.");
      setIsLoading(false);
      return;
    } else {
      setLegalBasisInputError(null);
    }
    try {
      const { success, error } = await addLegalBasis(
        Number(formData.reqIdentificationId),
        Number(formData.requirementId),
        Number(formData.legalBasisId)
      );
      if (success) {
        toast.info("Fundamento legal asociado correctamente", {
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
      toast.error("Ocurrió un error al asociar el fundamento legal.");
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
      size="2xl"
    >
      <ModalContent>
        <>
          <ModalHeader>Asociar Fundamento Legal</ModalHeader>
          <ModalBody className="overflow-y-auto px-6">
            <form className="flex flex-col gap-4" onSubmit={handleCreate}>
              <div className="w-full">
                <Autocomplete
                  size="sm"
                  variant="bordered"
                  label="Fundamento Legal"
                  selectedKey={formData.legalBasisId}
                  onSelectionChange={handleLegalBasisChange}
                  listboxProps={{
                    emptyContent: "No se encontró el fundamento legal",
                  }}
                  defaultItems={legalBasis}
                >
                  {(legalBase) => (
                    <AutocompleteItem key={legalBase.id} value={legalBase.id}>
                      {legalBase.legal_name}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
                {legalBasisInputError && (
                  <p className="mt-2 text-sm text-red">
                    {legalBasisInputError}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                color="primary"
                disabled={isLoading}
                className="w-full rounded border mb-4 mt-2 border-primary bg-primary p-3 text-white transition hover:bg-opacity-90"
              >
                {isLoading ? (
                  <Spinner size="sm" color="white" />
                ) : (
                  "Asociar fundamento legal"
                )}
              </Button>
            </form>
          </ModalBody>
        </>
      </ModalContent>
    </Modal>
  );
};

CreateReqIdentificationLegalBasisModal.propTypes = {
  config: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    closeModalCreate: PropTypes.func.isRequired,
    formData: PropTypes.shape({
      reqIdentificationId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]).isRequired,
      requirementId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      legalBasisId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
    setFormData: PropTypes.func,
    addLegalBasis: PropTypes.func.isRequired,
    legalBasis: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        legal_name: PropTypes.string,
        abbreviation: PropTypes.string,
        classification: PropTypes.string,
        jurisdiction: PropTypes.string,
        state: PropTypes.string,
        municipality: PropTypes.string,
        last_reform: PropTypes.string,
        url: PropTypes.string,
        subject: PropTypes.shape({
          subject_name: PropTypes.string,
        }),
        aspects: PropTypes.arrayOf(
          PropTypes.shape({
            aspect_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
              .isRequired,
            aspect_name: PropTypes.string.isRequired,
          })
        ),
      }).isRequired
    ).isRequired,
    legalBasisInputError: PropTypes.string,
    setLegalBasisInputError: PropTypes.func.isRequired,
    handleLegalBasisChange: PropTypes.func.isRequired,
  }).isRequired,
};

export default CreateReqIdentificationLegalBasisModal;
