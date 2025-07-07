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
 * EditReqIdentificationArticleModal component
 *
 * Modal for editing an existing article associated with a requirement identification.
 * Allows updating the selected article, its type (Obligatorio, General, Complementario),
 * and its score (number between 0 and 10 with up to 2 decimal places).
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.config - Configuration object containing state, data, and handlers.
 * @param {boolean} props.config.isOpen - Indicates whether the modal is open.
 * @param {Function} props.config.closeModalEdit - Function to close the modal.
 * @param {Object} props.config.formData - Form data including article selection, type, and score.
 * @param {number} props.config.formData.reqIdentificationArticleId - ID of the article association being edited.
 * @param {string|null} props.config.formData.articleId - ID of the selected article.
 * @param {string|null} props.config.formData.articleType - Selected article type.
 * @param {string|number|null} props.config.formData.score - Score value assigned to the article.
 * @param {string} [props.config.formData.legalBasisId] - Legal basis ID used to fetch available articles.
 * @param {Function} props.config.updateArticle - Function to update the article association.
 * @param {string|null} props.config.articleInputError - Error message for the article field.
 * @param {Function} props.config.setArticleInputError - Setter for the article field error.
 * @param {Function} props.config.handleArticleChange - Handler for selecting an article.
 * @param {string|null} props.config.articleTypeInputError - Error message for the article type field.
 * @param {Function} props.config.setArticleTypeInputError - Setter for the article type field error.
 * @param {Function} props.config.handleArticleTypeChange - Handler for selecting article type.
 * @param {string|null} props.config.articleScoreInputError - Error message for the score field.
 * @param {Function} props.config.setArticleScoreInputError - Setter for the score field error.
 * @param {Function} props.config.handleArticleScoreChange - Handler for changing the score value.
 *
 * @returns {JSX.Element} Rendered modal component.
 */


const EditReqIdentificationArticleModal = ({ config }) => {
    const {
        isOpen,
        closeModalEdit,
        formData,
        editArticle,
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
    const {
        articles,
        loading,
        error,
        fetchArticles
    } = useArticles();

    const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (formData.legalBasisId) {
      fetchArticles(formData.legalBasisId);
    }
  }, [isOpen, formData.legalBasisId, fetchArticles]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.articleId || formData.articleId.trim() === "") {
      setArticleInputError("Este campo es obligatorio.");
      setIsLoading(false);
      return;
    } else {
      setArticleInputError(null);
    }

    if (!formData.articleType) {
      setArticleTypeInputError("Este campo es obligatorio.");
      setIsLoading(false);
      return;
    } else {
      setArticleTypeInputError(null);
    }

    if (!formData.score) {
      setArticleScoreInputError("Este campo es obligatorio.");
      setIsLoading(false);
      return;
    } else if (isNaN(formData.score)) {
      setArticleScoreInputError("Debe ser un número válido.");
      setIsLoading(false);
      return;
    } else if (Number(formData.score) <= 0) {
      setArticleScoreInputError("Debe ser mayor a 0.");
      setIsLoading(false);
      return;
    } else if (Number(formData.score) > 10) {
      setArticleScoreInputError("No debe ser mayor a 10.");
      setIsLoading(false);
      return;
    } else if (!/^\d+(\.\d{1,2})?$/.test(formData.score)) {
      setArticleScoreInputError("Máximo 2 decimales permitidos.");
      setIsLoading(false);
      return;
    } else {
      setArticleScoreInputError(null);
    }

    try {
      const { success, error } = await editArticle({
        reqIdentificationArticleId: Number(formData.reqIdentificationArticleId),
        articleId: Number(formData.articleId),
        articleType: formData.articleType,
        score: Number(formData.score),
      });

      if (success) {
        toast.info("Artículo actualizado correctamente", {
          icon: () => <img src={check} alt="Success Icon" />,
          progressStyle: { background: "#113c53" },
        });
        closeModalEdit();
      } else {
        toast.error(
          <div style={{ maxHeight: 200, overflowY: "auto", whiteSpace: "pre-wrap" }}>
            {error}
          </div>
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar el artículo.");
    } finally {
      setIsLoading(false);
    }
  };

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={closeModalEdit}
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
                        <div role="status" className="flex items-center justify-center h-64">
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
                        />
                    ) : (
                        <>
                            <ModalHeader>Editar Artículo Asociado</ModalHeader>
                            <ModalBody className="overflow-y-auto px-6">
                                <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
                                    <div className="w-full">
                                        <Autocomplete
                                            size="sm"
                                            variant="bordered"
                                            label="Seleccionar artículo"
                                            placeholder="Buscar artículo"
                                            selectedKey={formData.articleId || ""}
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
                                            <p className="mt-2 text-sm text-red">{articleInputError}</p>
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
                                                emptyContent: "Tipos de artículos no encontrados",
                                            }}
                                        >
                                            <AutocompleteItem key="Obligatorio">Obligatorio</AutocompleteItem>
                                            <AutocompleteItem key="General">General</AutocompleteItem>
                                            <AutocompleteItem key="Complementario">Complementario</AutocompleteItem>
                                        </Autocomplete>
                                        {articleTypeInputError && (
                                            <p className="mt-2 text-sm text-red">{articleTypeInputError}</p>
                                        )}
                                    </div>
                                    <div className="relative z-0 w-full group">
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            max="10"
                                            name="score"
                                            id="floating_score"
                                            value={formData.score ?? ""}
                                            onChange={handleArticleScoreChange}
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
                                            placeholder=""
                                        />
                                        <label
                                            htmlFor="floating_score"
                                            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                            Puntuación
                                        </label>
                                        {articleScoreInputError && (
                                            <p className="mt-2 text-sm text-red">{articleScoreInputError}</p>
                                        )}
                                    </div>
                                    <Button
                                        type="submit"
                                        color="primary"
                                        disabled={isLoading}
                                        className="w-full rounded border mb-4 mt-2 border-primary bg-primary p-3 text-white transition hover:bg-opacity-90"
                                    >
                                        {isLoading ? <Spinner size="sm" color="white" /> : "Actualizar Artículo"}
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

EditReqIdentificationArticleModal.propTypes = {
  config: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    closeModalEdit: PropTypes.func.isRequired,
    formData: PropTypes.shape({
      reqIdentificationArticleId: PropTypes.number.isRequired,
      articleId: PropTypes.string,
      articleType: PropTypes.string,
      score: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      legalBasisId: PropTypes.string,
    }).isRequired,
    editArticle: PropTypes.func.isRequired,
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


export default EditReqIdentificationArticleModal;
