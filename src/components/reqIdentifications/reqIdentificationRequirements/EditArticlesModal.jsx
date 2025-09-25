import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";
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
  Textarea,
  Accordion,
  AccordionItem,
  Avatar,
} from "@heroui/react";
import { toast } from "react-toastify";
import check from "../../../assets/check.png";
import defaultAvatar from "../../../assets/usuario.png";
import useArticles from "../../../hooks/articles/useArticles";
import useArticleFeedbacks from "../../../hooks/articles/useArticleFeedbacks";

/**
 * Modal component for editing an associated article in the identification requirements.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.config - Configuration object for the modal.
 * @param {boolean} props.config.isOpen - Whether the modal is open.
 * @param {Function} props.config.closeModalEdit - Function to close the modal.
 * @param {Object} props.config.formData - Form data including article selection and optional changes.
 * @param {string|number|null} props.config.formData.reqIdentificationId - ID of the requirement identification.
 * @param {string|number|null} props.config.formData.requirementId - ID of the base requirement.
 * @param {string|number|null} props.config.formData.legalBasisId - ID of the associated legal basis.
 * @param {string|number|null} props.config.formData.articleId - ID of the selected article (can be null if not selected yet).
 * @param {string|null} props.config.formData.articleType - Current article type (read-only. Can be null).
 * @param {string|number|null} props.config.formData.score - Current score associated with the article (read-only. Can be null).
 * @param {string|null} [props.config.formData.newArticleType] - **New type (optional)** to save if specified by the user. If empty or null, the current type is preserved.
 * @param {string|number|null} [props.config.formData.newScore] - **New score (optional)** to save if specified by the user. If empty or null, the current score is preserved.
 * @param {string|null} [props.config.formData.feedback] - **Optional** feedback text about the change.
 * @param {boolean} props.config.formData.refreshMetadata - The flag to indicate if metadata should be refreshed.
 * @param {Function} props.config.editArticle - Function to update the article.
 * @param {Function} props.config.setArticleInputError - Setter for article input error.
 * @param {string} [props.config.articleTypeInputError] - Error message for the article type input.
 * @param {Function} props.config.setArticleTypeInputError - Setter for article type input error.
 * @param {Function} props.config.handleArticleTypeChange - Handler for article type selection change.
 * @param {string} [props.config.articleScoreInputError] - Error message for the score input.
 * @param {Function} props.config.setArticleScoreInputError - Setter for score input error.
 * @param {Function} props.config.handleArticleScoreChange - Handler for score input change.
 * @param {Function} props.config.handleRefreshMetaDataChange - Handler for changing the refresh metadata checkbox.
 * @param {string} [props.config.feedbackInputError] - Error message for the feedback input.
 * @param {Function} props.config.setFeedbackScoreInputError - Setter for feedback input error.
 * @param {Function} props.config.handleArticleFeedbackChange - Handler for feedback input change.
 * @returns {JSX.Element} The modal for editing an associated article.
 */
const EditReqIdentificationArticleModal = ({ config }) => {
  const {
    isOpen,
    closeModalEdit,
    formData,
    editArticle,
    setArticleInputError,
    articleTypeInputError,
    setArticleTypeInputError,
    handleArticleTypeChange,
    articleScoreInputError,
    setArticleScoreInputError,
    handleArticleScoreChange,
    handleRefreshMetaDataChange,
    feedbackInputError,
    setFeedbackScoreInputError,
    handleArticleFeedbackChange,
  } = config;
  const { articles, loading: articlesLoading, error: articlesError, fetchArticles } = useArticles();
  const { feedbacks, loading: feedbacksLoading, error: feedbacksError, fetchFeedbacks, removeFeedback } = useArticleFeedbacks();
  const [isLoading, setIsLoading] = useState(false);
  const loading = articlesLoading || feedbacksLoading;
  const error = articlesError || feedbacksError;
  const { reqIdentificationId, requirementId, legalBasisId, articleId } = formData;

  useEffect(() => {
    if (isOpen && legalBasisId) {
      fetchArticles(legalBasisId);
    }
  }, [isOpen, legalBasisId, fetchArticles]);

  useEffect(() => {
    if (isOpen && reqIdentificationId && requirementId && legalBasisId && articleId) {
      fetchFeedbacks(reqIdentificationId, requirementId, legalBasisId, articleId);
    }
  }, [isOpen, reqIdentificationId, requirementId, legalBasisId, articleId, fetchFeedbacks]);


  const handleArticleFeedbackDelete = useCallback(
    async (id) => {
      const toastId = toast.loading("Eliminando feedback...", {
        icon: <Spinner size="sm" />,
        progressStyle: {
          background: "#113c53",
        },
      });
      try {
        const { success, error } = await removeFeedback(id);
        if (success) {
          toast.update(toastId, {
            render: "Feedback eliminado con éxito",
            type: "info",
            icon: <img src={check} alt="Success Icon" />,
            progressStyle: {
              background: "#113c53",
            },
            isLoading: false,
            autoClose: 3000,
          });
        } else {
          toast.update(toastId, {
            render: (
              <div
                style={{
                  maxHeight: 200,
                  overflowY: "auto",
                  whiteSpace: "pre-wrap",
                }}
              >
                {error}
              </div>
            ),
            className: "toast-scroll-red",
            type: "error",
            icon: null,
            progressStyle: {},
            isLoading: false,
            autoClose: 5000,
          });
        }
      } catch (error) {
        console.error(error);
        toast.update(toastId, {
          render:
            "Algo mal sucedió al eliminar el feedback. Intente de nuevo.",
          type: "error",
          icon: null,
          progressStyle: {},
          isLoading: false,
          autoClose: 5000,
        });
      }
    },
    [removeFeedback]
  );

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const hasNewType =
      formData.newArticleType !== null &&
      formData.newArticleType !== undefined &&
      String(formData.newArticleType).trim() !== "";

    const hasNewScore =
      formData.newScore !== null &&
      formData.newScore !== undefined &&
      String(formData.newScore).trim() !== "";

    if (hasNewType && !hasNewScore) {
      setArticleScoreInputError("Si se selecciona un nuevo tipo de requerimiento, debe ingresar una nueva puntuación.");
      setIsLoading(false);
      return;
    }
    if (hasNewScore && !hasNewType) {
      setArticleTypeInputError("Si cambia la puntuación, debe seleccionar un nuevo tipo de requerimiento.");
      setIsLoading(false);
      return;
    }

    if (hasNewScore) {
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
    }

    if (hasNewType || hasNewScore) {
      if (!formData.feedback || formData.feedback.trim() === "") {
        setFeedbackScoreInputError(
          "El feedback es obligatorio si se modifica el tipo o la puntuación."
        );
        setIsLoading(false);
        return;
      }
    } else {
      if (formData.feedback && formData.feedback.trim() !== "") {
        setFeedbackScoreInputError(
          "No puede ingresar feedback si no hay cambios en tipo o puntuación."
        );
        setIsLoading(false);
        return;
      }
    }
    setArticleInputError(null);
    setArticleTypeInputError(null);
    setArticleScoreInputError(null);
    setFeedbackScoreInputError(null);

    try {
      const { success, error } = await editArticle({
        reqIdentificationId: Number(formData.reqIdentificationId),
        requirementId: Number(formData.requirementId),
        legalBasisId: Number(formData.legalBasisId),
        articleId: Number(formData.articleId),
        articleType: hasNewType ? formData.newArticleType : null,
        score: hasNewScore ? Number(formData.newScore) : null,
        feedback: formData.feedback ? formData.feedback.trim() : null,
        refreshMetadata: formData.refreshMetadata,
      });

      if (success) {
        toast.info("El artículo asociado ha sido actualizado exitosamente", {
          icon: () => <img src={check} alt="Success Icon" />,
          progressStyle: { background: "#113c53" },
        });
        closeModalEdit();
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
        "Error al actualizar el artículo asociado. Por favor, inténtalo de nuevo más tarde."
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
          closeModalEdit(open);
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
                  className="mt-20 w-full"
                  onPress={handleReload}
                >
                  Intentar de nuevo
                </Button>
              }
            />
          ) : (
            <>
              <ModalHeader>Editar Artículo Asociado</ModalHeader>
              <ModalBody className="overflow-y-auto px-6">
                <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
                  <div className="w-full">
                    <Input
                      size="sm"
                      variant="bordered"
                      label="Artículo"
                      isReadOnly
                      value={
                        articles.find(
                          (a) => a.id === Number(formData.articleId)
                        )?.article_name ||
                        "Articulo no encontrado. Recargue la app e intente nuevamente."
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      size="sm"
                      variant="bordered"
                      label="Tipo actual"
                      isReadOnly
                      value={formData.articleType ?? ""}
                    />

                    <Input
                      size="sm"
                      variant="bordered"
                      label="Puntuación actual"
                      isReadOnly
                      value={String(formData.score ?? "")}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="w-full">
                      <Autocomplete
                        label="Nuevo Tipo"
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
                        label="Nueva Puntuación"
                        placeholder="Ingresa una puntuación (1-10)"
                        value={formData.newScore ?? ""}
                        onChange={handleArticleScoreChange}
                      />
                      {articleScoreInputError && (
                        <p className="mt-2 text-sm text-red">{articleScoreInputError}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-span-2 w-full">
                    <Textarea
                      disableAnimation
                      disableAutosize
                      id="floating_feedback"
                      value={formData.feedback ?? ""}
                      onChange={(e) => handleArticleFeedbackChange(e.target.value)}
                      classNames={{
                        base: "max-w",
                        input:
                          "resize-y min-h-[80px] py-1 px-2 w-full text-xs text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-primary peer",
                      }}
                      label="Feedback de la edición"
                      placeholder="Describe brevemente el motivo del cambio"
                      variant="bordered"
                    />
                    {feedbackInputError && (
                      <p className="mt-2 text-sm text-red">{feedbackInputError}</p>
                    )}
                  </div>
                  {feedbacks && feedbacks.length > 0 && (
                    <Accordion variant="bordered" selectionMode="multiple" className="my-4">
                      {feedbacks.map((feedback) => (
                        <AccordionItem
                          key={feedback.id}
                          aria-label={feedback.user?.name || "Usuario"}
                          startContent={
                            <Avatar
                              isBordered
                              radius="lg"
                              src={feedback.user?.profile_picture || defaultAvatar}
                              name={feedback.user?.name || "Usuario"}
                            />
                          }
                          subtitle={feedback.changed_at || "Fecha no disponible"}
                          title={feedback.user?.name || "Usuario desconocido"}
                        >
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {feedback.feedback || "Sin feedback registrado."}
                          </p>
                          <div className="mt-2 text-xs text-gray-500">
                            <span className="font-semibold">Tipo anterior:</span>{" "}
                            {feedback.old_article_type || "N/A"} ({feedback.old_score || "N/A"}) →{" "}
                            <span className="font-semibold">Nuevo:</span>{" "}
                            {feedback.new_article_type || "N/A"} ({feedback.new_score || "N/A"})
                          </div>
                          <div className="mt-3 flex justify-start">
                            <button
                              type="button"
                              onClick={() => handleArticleFeedbackDelete(feedback.id)}
                              className="text-red text-sm underline-offset-2 hover:underline"
                            >
                              Eliminar Feedback
                            </button>
                          </div>
                        </AccordionItem>

                      ))}
                    </Accordion>
                  )}

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
                    className="w-full rounded border mb-4 mt-2 border-primary bg-primary p-3 text-white transition hover:bg-opacity-90"
                  >
                    {isLoading ? (
                      <Spinner size="sm" color="white" />
                    ) : (
                      "Actualizar Artículo"
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

EditReqIdentificationArticleModal.propTypes = {
  config: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    closeModalEdit: PropTypes.func.isRequired,
    formData: PropTypes.shape({
      reqIdentificationId: PropTypes.number.isRequired,
      requirementId: PropTypes.number.isRequired,
      legalBasisId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
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
      feedback: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
      refreshMetadata: PropTypes.bool.isRequired,
    }).isRequired,
    editArticle: PropTypes.func.isRequired,
    setArticleInputError: PropTypes.func.isRequired,
    articleTypeInputError: PropTypes.string,
    setArticleTypeInputError: PropTypes.func.isRequired,
    handleArticleTypeChange: PropTypes.func.isRequired,
    articleScoreInputError: PropTypes.string,
    setArticleScoreInputError: PropTypes.func.isRequired,
    handleArticleScoreChange: PropTypes.func.isRequired,
    handleRefreshMetaDataChange: PropTypes.func.isRequired,
    feedbackInputError: PropTypes.string,
    setFeedbackScoreInputError: PropTypes.func.isRequired,
    handleArticleFeedbackChange: PropTypes.func.isRequired
  }).isRequired,
};

export default EditReqIdentificationArticleModal;
