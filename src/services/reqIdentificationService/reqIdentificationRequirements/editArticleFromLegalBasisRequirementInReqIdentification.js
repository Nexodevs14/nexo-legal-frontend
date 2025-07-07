import server from "../../../config/server.js";

/**
 * Edits a legal basis article associated with a requirement within a specific requirement identification.
 * Sends a PATCH request to the backend to perform the edit.
 *
 * @async
 * @function editArticleFromLegalBasisRequirementInReqIdentification
 * @param {Object} params - Parameters for the association.
 * @param {number} params.reqIdentificationId - The ID of the requirement identification.
 * @param {number} params.requirementId - The ID of the requirement within the identification.
 * @param {number} params.legalBasisId - The ID of the legal basis.
 * @param {number} params.articleId - The ID of the article to associate.
 * @param {string} params.articleType - The type of the article.
 * @param {number} params.score - The score associated with the article.
 * @param {string} params.token - Authorization token for the request.
 *
 * @returns {Promise<Object>} The updated requirement object from the response.
 * @throws {Error} If the request fails or the response status is not 200.
 */
export default async function editArticleFromLegalBasisRequirementInReqIdentification({
  reqIdentificationId,
  requirementId,
  legalBasisId,
  articleId,
  articleType,
  score,
  token,
}) {
  try {
    const response = await server.patch(
      `/req-identification/${reqIdentificationId}/requirements/${requirementId}/legal-basis/${legalBasisId}/articles/${articleId}`,
      { articleType, score },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status !== 200) {
      throw new Error("Failed to edit article from legal basis requirement");
    }

    const { reqIdentificationRequirement } = response.data;
    return reqIdentificationRequirement;
  } catch (error) {
    console.error(
      "Error editing article from legal basis requirement:",
      error
    );
    throw error;
  }
}