import { useContext, useState, useCallback } from "react";
import Context from "../../context/userContext.jsx";
import getArticleFeedbacksByArticle from "../../services/articleService/articleFeedbackService/getArticleFeedbacksByArticle.js";
import deleteArticleFeedback from "../../services/articleService/articleFeedbackService/deleteArticleFeedback.js";
import ArticleFeedbackErrors from "../../errors/articles/articleFeedbackErrors.js";

/**
 * Custom hook for managing article feedbacks.
 * Provides functions to fetch and delete feedbacks with error handling and loading states.
 *
 * @returns {Object} - Contains feedbacks list, loading state, error state, and functions for feedback operations.
 */
export default function useArticleFeedbacks() {
  const { jwt } = useContext(Context);
  const [feedbacks, setFeedbacks] = useState([]);
  const [stateFeedbacks, setStateFeedbacks] = useState({
    loading: false,
    error: null,
  });


  /**
   * Fetches all feedbacks for a specific article.
   *
   * @async
   * @function fetchFeedbacks
   * @param {number} reqIdentificationId - The requirement identification ID.
   * @param {number} requirementId - The requirement ID.
   * @param {number} legalBasisId - The legal basis ID.
   * @param {number} articleId - The article ID.
   * @returns {Promise<void>}
   */
  const fetchFeedbacks = useCallback(
    async (reqIdentificationId, requirementId, legalBasisId, articleId) => {
      setStateFeedbacks({ loading: true, error: null });
      try {
        const feedbacks = await getArticleFeedbacksByArticle({
          reqIdentificationId,
          requirementId,
          legalBasisId,
          articleId,
          token: jwt,
        });
        setFeedbacks(feedbacks);
        setStateFeedbacks({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = ArticleFeedbackErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        setStateFeedbacks({ loading: false, error: handledError });
      }
    },
    [jwt]
  );

  /**
   * Deletes a feedback by ID.
   *
   * @async
   * @function removeFeedback
   * @param {number} id - The ID of the feedback to delete.
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const removeFeedback = useCallback(
    async (id) => {
      const prevFeedbacks = [...feedbacks];
      setFeedbacks((prevFeedbacks) =>
        prevFeedbacks.filter((feedback) => feedback.id !== id)
      );

      try {
        await deleteArticleFeedback({ id, token: jwt });
        return { success: true };
      } catch (error) {
        setFeedbacks(prevFeedbacks);
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = ArticleFeedbackErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [id],
        });
        return { success: false, error: handledError.message };
      }
    },
    [jwt, feedbacks]
  );


  return {
    feedbacks,
    loading: stateFeedbacks.loading,
    error: stateFeedbacks.error,
    fetchFeedbacks,
    removeFeedback,
  };
}
