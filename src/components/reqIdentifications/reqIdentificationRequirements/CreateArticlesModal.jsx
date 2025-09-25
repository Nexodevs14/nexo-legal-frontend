import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Spinner,
  Autocomplete,
  AutocompleteItem,
  Alert,
  Checkbox,
  Input,
} from "@heroui/react";
import { toast } from "react-toastify";
import check from "../../../assets/check.png";
import useArticles from "../../../hooks/articles/useArticles";

/**
 * CreateReqIdentificationArticleModal component
 *
 * Modal for associating an article with a requirement identification.
 * Allows selecting an article, assigning its type (Obligatorio, General, Complementario),
 * and assigning a score with validation (must be a number between 0 and 10, max 2 decimals).
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.config - Configuration object containing state, data, and handlers.
 * @param {boolean} props.config.isOpen - Indicates whether the modal is open.
 * @param {Function} props.config.closeModalCreate - Function to close the modal.
 * @param {Object} props.config.formData - Form data including article selection and optional changes.
 * @param {string|number|null} props.config.formData.reqIdentificationId - ID of the requirement identification.
 * @param {string|number|null} props.config.formData.requirementId - ID of the base requirement.
 * @param {string|number|null} props.config.formData.legalBasisId - ID of the associated legal basis.
 * @param {string|number|null} props.config.formData.articleId - ID of the selected article (can be null if not selected yet).
 * @param {string|null} props.config.formData.articleType - Current article type (read-only. Can be null).
 * @param {string|number|null} props.config.formData.score - Current score associated with the article (read-only. Can be null).
 * @param {string|null} [props.config.formData.newArticleType] - **New type (optional)** to save if specified by the user. If empty or null, the current type is preserved.
 * @param {string|number|null} [props.config.formData.newScore] - **New score (optional)** to save if specified by the user. If empty or null, the current score is preserved.
 * @param {boolean} props.config.formData.refreshMetadata - The flag to indicate if metadata should be refreshed.
 * @param {Function} props.config.addArticle - Function to associate the selected article.
 * @param {string|null} props.config.articleInputError - Error message for the article field.
 * @param {Function} props.config.setArticleInputError - Setter for article field error.
 * @param {Function} props.config.handleArticleChange - Handler for selecting an article.
 * @param {string|null} props.config.articleTypeInputError - Error message for the article type field.
 * @param {Function} props.config.setArticleTypeInputError - Setter for article type field error.
 * @param {Function} props.config.handleArticleTypeChange - Handler for selecting article type.
 * @param {string|null} props.config.articleScoreInputError - Error message for the score field.
 * @param {Function} props.config.setArticleScoreInputError - Setter for score field error.
 * @param {Function} props.config.handleArticleScoreChange - Handler for changing the score value.
 * @param {Function} props.config.handleRefreshMetaDataChange - Handler for changing the refresh metadata checkbox.
 *
 * @returns {JSX.Element} Rendered modal component.
 */

const CreateReqIdentificationArticleModal = ({ config }) => {
  const {
    isOpen,
    closeModalCreate,
    formData,
    addArticle,
    articleInputError,
    setArticleInputError,
    handleArticleChange,
    articleTypeInputError,
    setArticleTypeInputError,
    handleArticleTypeChange,
    articleScoreInputError,
    setArticleScoreInputError,
    handleArticleScoreChange,
    handleRefreshMetaDataChange
  } = config;
  const { articles, loading, error, fetchArticles } = useArticles();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (formData.legalBasisId) {
        await fetchArticles(formData.legalBasisId);
      }
    };
    fetchData();
  }, [formData.legalBasisId, fetchArticles]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.articleId) {
      setArticleInputError("Debe seleccionar un artículo.");
      setIsLoading(false);
      return;
    } else {
      setArticleInputError(null);
    }

    if (
      (formData.newArticleType === null ||
        formData.newArticleType === undefined ||
        String(formData.newArticleType) === "")
    ) {
      setArticleTypeInputError("Este campo es obligatorio");
      setIsLoading(false);
      return;
    } else {
      setArticleTypeInputError(null);
    }

    if (
      formData.newScore !== null &&
      formData.newScore !== undefined &&
      String(formData.newScore) !== ""
    ) {
      const scoreString = String(formData.newScore);

      if (isNaN(scoreString)) {
        setArticleScoreInputError("Este campo debe ser un número válido.");
        setIsLoading(false);
        return;
      }
      const scoreNumber = Number(scoreString);
      if (scoreNumber <= 0) {
        setArticleScoreInputError("Este campo debe ser mayor a 0.");
        setIsLoading(false);
        return;
      }
      if (scoreNumber > 10) {
        setArticleScoreInputError("Este campo no debe ser mayor a 10.");
        setIsLoading(false);
        return;
      }
      if (!/^\d+(\.\d{1,2})?$/.test(scoreString)) {
        setArticleScoreInputError("Este campo debe tener máximo 2 decimales.");
        setIsLoading(false);
        return;
      }
      if (/^0\d/.test(scoreString)) {
        setArticleScoreInputError("El valor no debe comenzar con ceros.");
        setIsLoading(false);
        return;
      }
    } else {
      setArticleScoreInputError("Este campo es obligatorio.");
      setIsLoading(false);
      return;
    }
    setArticleScoreInputError(null);

    try {
      const { success, error } = await addArticle({
        reqIdentificationId: Number(formData.reqIdentificationId),
        requirementId: Number(formData.requirementId),
        legalBasisId: Number(formData.legalBasisId),
        articleId: Number(formData.articleId),
        articleType: formData.newArticleType,
        score: Number(formData.newScore),
        refreshMetadata: formData.refreshMetadata
      });

      if (success) {
        toast.info("El artículo ha sido asociado exitosamente", {
          icon: () => <img src={check} alt="Success Icon" />,
          progressStyle: { background: "#113c53" },
        });
        closeModalCreate();
      } else {
        toast.error(
          <div
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
    } catch (err) {
      console.error(err);
      toast.error(
        "Error al asociar el artículo. Por favor, inténtalo de nuevo más tarde."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!isLoading) {
          closeModalCreate(open);
        }
      }}
      backdrop="opaque"
      isDismissable={false}
      placement="center"
      size="2xl"
      classNames={{
        closeButton: "hover:bg-primary/20 text-primary active:bg-primary/10",
      }}
    >
      <ModalContent>
        <>
          {loading ? (
            <div
              role="status"
              className="flex items-center justify-center h-64"
            >
              <Spinner color="secondary" />
            </div>
          ) : error ? (
            <Alert
              color="warning"
              title={error.title}
              description={error.message}
              variant="faded"
              classNames={{
                base: "bg-red/10 border-red",
                title: "text-red text-md",
                description: "text-red text-sm",
                iconWrapper: "bg-red/20",
                alertIcon: "text-red",
              }}
              endContent={
                <Button
                  color="danger"
                  size="sm"
                  variant="faded"
                  className="mt-6 w-full"
                  onPress={handleReload}
                >
                  Intentar de nuevo
                </Button>
              }
            />
          ) : (
            <>
              <ModalHeader> Asociar Nuevo Artículo</ModalHeader>
              <ModalBody className="overflow-y-auto px-6">
                <form className="flex flex-col gap-4" onSubmit={handleCreate}>
                  <div className="col-span-2 relative z-0 w-full group">
                    <Autocomplete
                      size="sm"
                      variant="bordered"
                      label="Seleccionar artículo"
                      placeholder="Buscar artículo"
                      selectedKeys={formData.articleId}
                      onSelectionChange={handleArticleChange}
                      listboxProps={{
                        emptyContent: "No se encontraron artículos",
                      }}
                    >
                      {articles.map((article) => (
                        <AutocompleteItem key={article.id}>
                          {article.article_name}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                    {articleInputError && (
                      <p className="mt-2 text-sm text-red">
                        {articleInputError}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="w-full">
                      <Autocomplete
                        label="Tipo"
                        placeholder="Selecciona un tipo"
                        selectedKey={formData.newArticleType ?? ""}
                        onSelectionChange={handleArticleTypeChange}
                        size="sm"
                        variant="bordered"
                        isClearable
                        className="w-full"
                      >
                        <AutocompleteItem key="Obligatorio">
                          Obligatorio
                        </AutocompleteItem>
                        <AutocompleteItem key="Complementario">
                          Complementario
                        </AutocompleteItem>
                        <AutocompleteItem key="General">
                          General
                        </AutocompleteItem>
                      </Autocomplete>
                      {articleTypeInputError && (
                        <p className="mt-2 text-sm text-red">{articleTypeInputError}</p>
                      )}
                    </div>
                    <div className="relative w-full">
                      <Input
                        size="sm"
                        variant="bordered"
                        label="Puntuación"
                        placeholder="Ingresa una puntuación (1-10)"
                        value={formData.newScore ?? ""}
                        onChange={handleArticleScoreChange}
                      />
                      {articleScoreInputError && (
                        <p className="mt-2 text-sm text-red">{articleScoreInputError}</p>
                      )}
                    </div>
                  </div>
                  <div className="w-full flex items-start">
                    <div className="flex flex-col">
                      <Checkbox
                        size="md"
                        isSelected={formData.refreshMetadata}
                        onValueChange={handleRefreshMetaDataChange}
                      >
                        <span className="text-md text-black">
                          Actualizar Verbos Legales y Tipos de Requerimiento
                        </span>
                      </Checkbox>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    color="primary"
                    disabled={isLoading}
                    className="w-full rounded border mb-4 border-primary bg-primary p-3 text-white transition hover:bg-opacity-90"
                  >
                    {isLoading ? (
                      <Spinner size="sm" color="white" />
                    ) : (
                      "Asociar Artículo"
                    )}
                  </Button>
                </form>
              </ModalBody>
            </>
          )}
        </>
      </ModalContent>
    </Modal>
  );
};

CreateReqIdentificationArticleModal.propTypes = {
  config: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    closeModalCreate: PropTypes.func.isRequired,
    formData: PropTypes.shape({
      reqIdentificationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      requirementId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      legalBasisId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      articleId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.oneOf([null]),
      ]),
      articleType: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
      score: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.oneOf([null]),
      ]),
      newArticleType: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
      newScore: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.oneOf([null]),
      ]),
      refreshMetadata: PropTypes.bool.isRequired,
    }).isRequired,
    addArticle: PropTypes.func.isRequired,
    articleInputError: PropTypes.string,
    setArticleInputError: PropTypes.func.isRequired,
    handleArticleChange: PropTypes.func.isRequired,
    articleTypeInputError: PropTypes.string,
    setArticleTypeInputError: PropTypes.func.isRequired,
    handleArticleTypeChange: PropTypes.func.isRequired,
    articleScoreInputError: PropTypes.string,
    setArticleScoreInputError: PropTypes.func.isRequired,
    handleArticleScoreChange: PropTypes.func.isRequired,
    handleRefreshMetaDataChange: PropTypes.func.isRequired,
  }).isRequired,
};

export default CreateReqIdentificationArticleModal;
