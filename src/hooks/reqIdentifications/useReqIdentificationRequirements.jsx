import { useContext, useState, useCallback } from "react";
import Context from "../../context/userContext.jsx";
import addRequirementToReqIdentification from "../../services/reqIdentificationService/reqIdentificationRequirements/addRequirementToReqIdentification.js";
import getRequirementFromReqIdentification from "../../services/reqIdentificationService/reqIdentificationRequirements/getRequirementFromReqIdentification.js";
import getAllRequirementsFromReqIdentification from "../../services/reqIdentificationService/reqIdentificationRequirements/getAllRequirementsFromReqIdentification.js";
import getAllRequirementsFromReqIdentificationFile from "../../services/reqIdentificationService/reqIdentificationRequirements/getAllRequirementsFromReqIdentificationFile.js";
import getRequirementsFromReqIdentificationByName from "../../services/reqIdentificationService/reqIdentificationRequirements/getRequirementsFromReqIdentificationByName.js";
import getRequirementsFromReqIdentificationByRequirementName from "../../services/reqIdentificationService/reqIdentificationRequirements/getRequirementsFromReqIdentificationByRequirementName.js";
import getRequirementsFromReqIdentificationByLegalBasisName from "../../services/reqIdentificationService/reqIdentificationRequirements/getRequirementsFromReqIdentificationByLegalBasisName.js";
import editRequirementFromReqIdentification from "../../services/reqIdentificationService/reqIdentificationRequirements/editRequirementFromReqIdentification.js";
import deleteRequirementFromReqIdentification from "../../services/reqIdentificationService/reqIdentificationRequirements/deleteRequirementFromReqIdentification.js";
import addLegalBasisToRequirementInReqIdentification from "../../services/reqIdentificationService/reqIdentificationRequirements/addLegalBasisToRequirementInReqIdentification.js";
import deleteLegalBasisFromRequirementInReqIdentification from "../../services/reqIdentificationService/reqIdentificationRequirements/deleteLegalBasisFromRequirementInReqIdentification.js";
import ReqIdentificationRequirementsErrors from "../../errors/reqIdentifications/ReqIdentificationRequirementsErrors.js";
import addArticleToLegalBasisRequirementInReqIdentification from "../../services/reqIdentificationService/reqIdentificationRequirements/addArticleToLegalBasisRequirementInReqIdentification.js";
import editArticleFromLegalBasisRequirementInReqIdentification from "../../services/reqIdentificationService/reqIdentificationRequirements/editArticleFromLegalBasisRequirementInReqIdentification.js";
import deleteArticleFromLegalBasisRequirementInReqIdentification from "../../services/reqIdentificationService/reqIdentificationRequirements/deleteArticleFromLegalBasisRequirementInReqIdentification.js";

/**
 * Custom hook for managing requirements within a requirement identification.
 * @returns {Object} - Contains state and functions for requirement identification requirements.
 */
export default function useReqIdentificationRequirements() {
  const { jwt } = useContext(Context);
  const [reqIdentificationRequirements, setReqIdentificationRequirements] =
    useState([]);
  const [state, setState] = useState({
    loading: true,
    error: null,
  });

  /**
   * Adds a requirement to a specific requirement identification.
   *
   * @async
   * @function addRequirement
   * @param {Object} params - Data to associate the requirement.
   * @param {number} params.reqIdentificationId - The ID of the requirement identification.
   * @param {number} params.requirementId - The ID of the requirement to associate.
   * @param {string} params.requirementName - Custom name of the requirement in the identification.
   * @param {number[]} [params.requirementTypeIds] - Optional array of requirement type IDs.
   * @param {{ id: number, translation: string }[]} [params.legalVerbs] - Optional array of legal verbs with translations.
   * @returns {Promise<{ success: true } | { success: false, error: string }>}
   */
  const addRequirement = useCallback(
    async ({
      reqIdentificationId,
      requirementId,
      requirementName,
      requirementTypeIds,
      legalVerbs,
    }) => {
      try {
        const reqIdentificationRequirement =
          await addRequirementToReqIdentification({
            reqIdentificationId,
            requirementId,
            requirementName,
            requirementTypeIds,
            legalVerbs,
            token: jwt,
          });
        setReqIdentificationRequirements((prev) => [
          reqIdentificationRequirement,
          ...prev,
        ]);
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = ReqIdentificationRequirementsErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [reqIdentificationId],
        });
        return { success: false, error: handledError.message };
      }
    },
    [jwt]
  );

  /**
   * Fetches a specific requirement by its ID from a requirement identification.
   * @async
   * @function fetchRequirement
   * @param {number} reqIdentificationId - The ID of the requirement identification.
   * @param {number} requirementId - The ID of the requirement to fetch.
   * @returns {Promise<{ success: true, data: Object } | { success: false, error: Object }>}
   */
  const fetchRequirement = useCallback(
    async (reqIdentificationId, requirementId) => {
      try {
        const reqIdentificationRequirement =
          await getRequirementFromReqIdentification({
            reqIdentificationId,
            requirementId,
            token: jwt,
          });
        return { success: true, data: reqIdentificationRequirement };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;

        const handledError = ReqIdentificationRequirementsErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [reqIdentificationId],
        });
        return {
          success: false,
          error: handledError,
        };
      }
    },
    [jwt]
  );

  /**
   * Fetches all requirements associated with a given requirement identification.
   *
   * @async
   * @function fetchAllRequirementsFromReqIdentification
   * @param {number} reqIdentificationId - The ID of the requirement identification.
   * @returns {Promise<void>}
   */
  const fetchRequirements = useCallback(
    async (reqIdentificationId) => {
      setState({ loading: true, error: null });
      try {
        const reqIdentificationRequirements =
          await getAllRequirementsFromReqIdentification({
            reqIdentificationId,
            token: jwt,
          });
        setReqIdentificationRequirements(reqIdentificationRequirements);
        setState({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;

        const handledError = ReqIdentificationRequirementsErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [reqIdentificationId],
        });

        setState({
          loading: false,
          error: handledError,
        });
      }
    },
    [jwt]
  );

  /**
   * Downloads a file containing all requirements from a specific requirement identification.
   * @async
   * @function downloadRequirementsFile
   * @param {number} reqIdentificationId -  The ID of the requirement identification.
   * @param {string} [fileType] - The type of file to download
   * @returns {Promise<{ success: true, file: string, fileName: string, contentType: string } | { success: false, error: string }>}
   */
  const fetchRequirementsFile = useCallback(
    async (reqIdentificationId, fileType) => {
      try {
        const { file, fileName, contentType } =
          await getAllRequirementsFromReqIdentificationFile({
            reqIdentificationId,
            fileType,
            token: jwt,
          });
        return { success: true, file, fileName, contentType };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;

        const handledError = ReqIdentificationRequirementsErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [reqIdentificationId],
        });

        return { success: false, error: handledError.message };
      }
    },
    [jwt]
  );

  /**
   * Fetches requirements from a requirement identification filtered by requirement name.
   *
   * @async
   * @function fetchRequirementsByName
   * @param {number} reqIdentificationId - The ID of the requirement identification.
   * @param {string} requirementName - The name of the requirement to filter by.
   * @returns {Promise<void>}
   */
  const fetchRequirementsByName = useCallback(
    async (reqIdentificationId, requirementName) => {
      setState({ loading: true, error: null });
      try {
        const reqIdentificationRequirements =
          await getRequirementsFromReqIdentificationByName({
            reqIdentificationId,
            requirementName,
            token: jwt,
          });
        setReqIdentificationRequirements(reqIdentificationRequirements);
        setState({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = ReqIdentificationRequirementsErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [reqIdentificationId],
        });
        setState({
          loading: false,
          error: handledError,
        });
      }
    },
    [jwt]
  );

  /**
   * Fetches requirements from a requirement identification filtered by original requirement name.
   *
   * @async
   * @function fetchRequirementsByRequirementName
   * @param {number} reqIdentificationId - The ID of the requirement identification.
   * @param {string} requirementName - The original name of the requirement to filter by.
   * @returns {Promise<void>}
   */
  const fetchRequirementsByRequirementName = useCallback(
    async (reqIdentificationId, requirementName) => {
      setState({ loading: true, error: null });
      try {
        const reqIdentificationRequirements =
          await getRequirementsFromReqIdentificationByRequirementName({
            reqIdentificationId,
            requirementName,
            token: jwt,
          });

        setReqIdentificationRequirements(reqIdentificationRequirements);
        setState({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;

        const handledError = ReqIdentificationRequirementsErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [reqIdentificationId],
        });
        setState({
          loading: false,
          error: handledError,
        });
      }
    },
    [jwt]
  );

  /**
   * Fetches requirements from a requirement identification filtered by legal basis name.
   *
   * @async
   * @function fetchRequirementsByLegalBasisName
   * @param {number} reqIdentificationId - The ID of the requirement identification.
   * @param {string} legalBasisName - The legal basis name to filter by.
   * @returns {Promise<void>}
   */
  const fetchRequirementsByLegalBasisName = useCallback(
    async (reqIdentificationId, legalBasisName) => {
      setState({ loading: true, error: null });
      try {
        const reqIdentificationRequirements =
          await getRequirementsFromReqIdentificationByLegalBasisName({
            reqIdentificationId,
            legalBasisName,
            token: jwt,
          });
        setReqIdentificationRequirements(reqIdentificationRequirements);
        setState({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;

        const handledError = ReqIdentificationRequirementsErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [reqIdentificationId],
        });
        setState({
          loading: false,
          error: handledError,
        });
      }
    },
    [jwt]
  );

  /**
   * Edits a requirement associated with a specific requirement identification.
   *
   * @async
   * @function editRequirement
   * @param {Object} params - Data to update the requirement.
   * @param {number} params.reqIdentificationId - The ID of the requirement identification.
   * @param {number} params.requirementId - The ID of the requirement to edit.
   * @param {string} [params.requirementName] - New custom name (optional).
   * @param {number[]} [params.requirementTypeIds] - Optional updated requirement type IDs.
   * @param {{ id: number, translation: string }[]} [params.legalVerbs] - Optional updated legal verbs.
   * @returns {Promise<{ success: true } | { success: false, error: string }>}
   */
  const editRequirement = useCallback(
    async ({
      reqIdentificationId,
      requirementId,
      requirementName,
      requirementTypeIds,
      legalVerbs,
    }) => {
      try {
        const reqIdentificationRequirement =
          await editRequirementFromReqIdentification({
            reqIdentificationId,
            requirementId,
            requirementName,
            requirementTypeIds,
            legalVerbs,
            token: jwt,
          });
        setReqIdentificationRequirements((prev) =>
          prev.map((req) =>
            req.requirement.id === requirementId
              ? reqIdentificationRequirement
              : req
          )
        );
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;

        const handledError = ReqIdentificationRequirementsErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [reqIdentificationId],
        });
        return { success: false, error: handledError.message };
      }
    },
    [jwt]
  );

  /**
   * Deletes a requirement from a specific requirement identification.
   *
   * @async
   * @function deleteRequirement
   * @param {Object} params - Parameters for the deletion process.
   * @param {number} params.reqIdentificationId - The ID of the requirement identification.
   * @param {number} params.requirementId - The ID of the requirement to remove.
   * @returns {Promise<{ success: true } | { success: false, error: string }>}
   */
  const deleteRequirement = useCallback(
    async (reqIdentificationId, requirementId) => {
      try {
        await deleteRequirementFromReqIdentification({
          reqIdentificationId,
          requirementId,
          token: jwt,
        });
        setReqIdentificationRequirements((prev) =>
          prev.filter((req) => req.requirement.id !== requirementId)
        );
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;

        const handledError = ReqIdentificationRequirementsErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [reqIdentificationId],
        });
        return { success: false, error: handledError.message };
      }
    },
    [jwt]
  );

  /**
   * Adds a legal basis to a specific requirement in a requirement identification.
   *
   * @async
   * @function addLegalBasis
   * @param {Object} params - Parameters for the association.
   * @param {number} params.reqIdentificationId - The ID of the requirement identification.
   * @param {number} params.requirementId - The ID of the requirement.
   * @param {number} params.legalBasisId - The ID of the legal basis to associate.
   * @returns {Promise<{ success: true } | { success: false, error: string }>}
   */
  const addLegalBasis = useCallback(
    async (reqIdentificationId, requirementId, legalBasisId) => {
      try {
        const reqIdentificationRequirement =
          await addLegalBasisToRequirementInReqIdentification({
            reqIdentificationId,
            requirementId,
            legalBasisId,
            token: jwt,
          });

        setReqIdentificationRequirements((prev) =>
          prev.map((req) =>
            req.requirement.id === requirementId
              ? reqIdentificationRequirement
              : req
          )
        );
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;

        const handledError = ReqIdentificationRequirementsErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [reqIdentificationId],
        });

        return { success: false, error: handledError.message };
      }
    },
    [jwt]
  );

  /**
   * Deletes a legal basis from a specific requirement in a requirement identification.
   *
   * @async
   * @function deleteLegalBasis
   * @param {Object} params - Parameters for the deletion.
   * @param {number} params.reqIdentificationId - The ID of the requirement identification.
   * @param {number} params.requirementId - The ID of the requirement.
   * @param {number} params.legalBasisId - The ID of the legal basis to remove.
   * @returns {Promise<{ success: true } | { success: false, error: string }>}
   */
  const deleteLegalBasis = useCallback(
    async (reqIdentificationId, requirementId, legalBasisId) => {
      try {
        await deleteLegalBasisFromRequirementInReqIdentification({
          reqIdentificationId,
          requirementId,
          legalBasisId,
          token: jwt,
        });
        setReqIdentificationRequirements((prev) =>
          prev.map((req) =>
            req.requirement.id === requirementId
              ? {
                  ...req,
                  legalBasis: req.legalBasis.filter(
                    (lb) => lb.legalBasis.id !== legalBasisId
                  ),
                }
              : req
          )
        );
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;

        const handledError = ReqIdentificationRequirementsErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [reqIdentificationId],
        });

        return { success: false, error: handledError.message };
      }
    },
    [jwt]
  );

  /**
   * Associates a legal basis article to a requirement within a specific requirement identification.
   * @async
   * @function addArticle
   * @param {Object} params - Parameters for the association.
   * @param {number} params.reqIdentificationId - The ID of the requirement identification.
   * @param {number} params.requirementId - The ID of the requirement within the identification.
   * @param {number} params.legalBasisId - The ID of the legal basis
   * @param {number} params.articleId - The ID of the article to associate.
   * @param {string} params.articleType - The type of the article.
   * @param {number} params.score - The score associated with the article.
   * @returns {Promise<{ success: true } | { success: false, error: string }>}
   */
  const addArticle = useCallback(
    async ({
      reqIdentificationId,
      requirementId,
      legalBasisId,
      articleId,
      articleType,
      score,
    }) => {
      try {
        const reqIdentificationRequirement =
          await addArticleToLegalBasisRequirementInReqIdentification({
            reqIdentificationId,
            requirementId,
            legalBasisId,
            articleId,
            articleType,
            score,
            token: jwt,
          });
        setReqIdentificationRequirements((prev) =>
          prev.map((req) =>
            req.requirement.id === requirementId
              ? reqIdentificationRequirement
              : req
          )
        );
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;

        const handledError = ReqIdentificationRequirementsErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [reqIdentificationId],
        });
        return { success: false, error: handledError.message };
      }
    },
    [jwt]
  );

  /**
   * Edits a legal basis article associated with a requirement within a specific requirement identification.
   * @async
   * @function editArticle
   * @param {Object} params - Parameters for the association.
   * @param {number} params.reqIdentificationId - The ID of the requirement identification.
   * @param {number} params.requirementId - The ID of the requirement within the identification.
   * @param {number} params.legalBasisId - The ID of the legal basis.
   * @param {number} params.articleId - The ID of the article to associate.
   * @param {string} params.articleType - The type of the article.
   * @param {number} params.score - The score associated with the article.
   * @returns {Promise<{ success: true } | { success: false, error: string }>}
   * */
  const editArticle = useCallback(
    async ({
      reqIdentificationId,
      requirementId,
      legalBasisId,
      articleId,
      articleType,
      score,
    }) => {
      try {
        const reqIdentificationRequirement =
          await editArticleFromLegalBasisRequirementInReqIdentification({
            reqIdentificationId,
            requirementId,
            legalBasisId,
            articleId,
            articleType,
            score,
            token: jwt,
          });
        setReqIdentificationRequirements((prev) =>
          prev.map((req) =>
            req.requirement.id === requirementId
              ? reqIdentificationRequirement
              : req
          )
        );
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;

        const handledError = ReqIdentificationRequirementsErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [reqIdentificationId],
        });
        return { success: false, error: handledError.message };
      }
    },
    [jwt]
  );

  /**
   * Deletes a legal basis article associated with a requirement within a specific requirement identification.
   * @async
   * @function deleteArticle
   * @param {number} reqIdentificationId - The ID of the requirement identification.
   * @param {number} requirementId - The ID of the requirement within the identification.
   * @param {number} legalBasisId - The ID of the legal basis.
   * @param {number} articleId - The ID of the article to remove.
   * @returns {Promise<{ success: true } | { success: false, error: string }>}
   */
  const deleteArticle = useCallback(
    async (reqIdentificationId, requirementId, legalBasisId, articleId) => {
      try {
        const reqIdentificationRequirement =
          await deleteArticleFromLegalBasisRequirementInReqIdentification({
            reqIdentificationId,
            requirementId,
            legalBasisId,
            articleId,
            token: jwt,
          });
        setReqIdentificationRequirements((prev) =>
          prev.map((req) =>
            req.requirement.id === requirementId
              ? reqIdentificationRequirement
              : req
          )
        );
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;

        const handledError = ReqIdentificationRequirementsErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [reqIdentificationId],
        });
        return { success: false, error: handledError.message };
      }
    },
    [jwt]
  );

  return {
    reqIdentificationRequirements,
    loading: state.loading,
    error: state.error,
    addRequirement,
    fetchRequirement,
    fetchRequirements,
    fetchRequirementsFile,
    fetchRequirementsByName,
    fetchRequirementsByRequirementName,
    fetchRequirementsByLegalBasisName,
    editRequirement,
    deleteRequirement,
    addLegalBasis,
    deleteLegalBasis,
    addArticle,
    editArticle,
    deleteArticle,
  };
}
