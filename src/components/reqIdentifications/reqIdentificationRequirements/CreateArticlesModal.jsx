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
 * @param {Object} props.config.formData - Form data including article selection, type, and score.
 * @param {string} props.config.formData.reqIdentificationId - ID of the requirement identification.
 * @param {string} props.config.formData.requirementId - ID of the base requirement.
 * @param {string} props.config.formData.legalBasisId - ID of the associated legal basis.
 * @param {string|null} props.config.formData.articleId - Selected article ID.
 * @param {string|null} props.config.formData.articleType - Selected article type.
 * @param {string|number|null} props.config.formData.score - Numeric score associated with the article.
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
    if (!formData.articleType) {
      setArticleTypeInputError("Este campo es obligatorio");
      setIsLoading(false);
      return;
    } else {
      setArticleTypeInputError(null);
    }
    if (!formData.score) {
      setArticleScoreInputError("Debe ser mayor a 0.");
      setIsLoading(false);
      return;
    } else if (isNaN(formData.score)) {
      setArticleScoreInputError("Este campo debe ser un número válido.");
      setIsLoading(false);
      return;
    } else if (Number(formData.score) <= 0) {
      setArticleScoreInputError("Este campo debe ser mayor a 0.");
      setIsLoading(false);
      return;
    } else if (Number(formData.score) > 10) {
      setArticleScoreInputError("Este campo no debe ser mayor a 10.");
      setIsLoading(false);
      return;
    } else if (!/^\d+(\.\d{1,2})?$/.test(formData.score)) {
      setArticleScoreInputError("Este campo debe tener máximo 2 decimales.");
      setIsLoading(false);
      return;
    } else if (/^0\d/.test(formData.score)) {
      setArticleScoreInputError("El valor no debe comenzar con ceros.");
      setIsLoading(false);
      return;
    } else {
      setArticleScoreInputError(null);
    }
    try {
      const { success, error } = await addArticle({
        reqIdentificationId: Number(formData.reqIdentificationId),
        requirementId: Number(formData.requirementId),
        legalBasisId: Number(formData.legalBasisId),
        articleId: Number(formData.articleId),
        articleType: formData.articleType,
        score: Number(formData.score),
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
                  <div className="w-full">
                    <Autocomplete
                      size="sm"
                      variant="bordered"
                      label="Tipo"
                      selectedKey={formData.articleType || ""}
                      onSelectionChange={handleArticleTypeChange}
                      listboxProps={{
                        emptyContent: "Tipos de artículos de encontrados",
                      }}
                    >
                      <AutocompleteItem key="Obligatorio">
                        Obligatorio
                      </AutocompleteItem>
                      <AutocompleteItem key="Complementario">
                        Complementario
                      </AutocompleteItem>
                      <AutocompleteItem key="General">General</AutocompleteItem>
                    </Autocomplete>
                    {articleTypeInputError && (
                      <p className="mt-2 text-sm text-red">
                        {articleTypeInputError}
                      </p>
                    )}
                  </div>
                  <div className="relative z-0 w-full group">
                    <input
                      type="number"
                      name="number"
                      id="floating_order"
                      value={formData.score}
                      onChange={handleArticleScoreChange}
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
                      placeholder=""
                    />
                    <label
                      htmlFor="floating_number"
                      className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Puntuación
                    </label>
                    {articleScoreInputError && (
                      <p className="mt-2 text-sm text-red">
                        {articleScoreInputError}
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
      reqIdentificationId: PropTypes.string.isRequired,
      requirementId: PropTypes.string.isRequired,
      legalBasisId: PropTypes.string.isRequired,
      articleId: PropTypes.string,
      articleType: PropTypes.string,
      score: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // puede ser string inicialmente
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
  }).isRequired,
};

export default CreateReqIdentificationArticleModal;
