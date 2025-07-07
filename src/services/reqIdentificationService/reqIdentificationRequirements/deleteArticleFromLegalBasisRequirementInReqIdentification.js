import server from "../../../config/server.js";

/**
 * Deletes a legal basis article associated with a requirement within a specific requirement identification.
 * Sends a DELETE request to the backend to perform the deletion.
 *
 * @async
 * @function deleteArticleFromLegalBasisRequirementInReqIdentification
 * @param {Object} params - Parameters for the deletion.
 * @param {number} params.reqIdentificationId - The ID of the requirement identification.
 * @param {number} params.requirementId - The ID of the requirement within the identification
 * @param {number} params.legalBasisId - The ID of the legal basis.
 * @param {number} params.articleId - The ID of the article to delete.
 * @param {string} params.token - Authorization token for the request.
 * @throws {Error} If the request fails or the response status is not 200.
 */
export default async function deleteArticleFromLegalBasisRequirementInReqIdentification({
  reqIdentificationId,
  requirementId,
  legalBasisId,
  articleId,
  token,
}) {
  try {
    const response = await server.delete(
      `/req-identification/${reqIdentificationId}/requirements/${requirementId}/legal-basis/${legalBasisId}/articles/${articleId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status !== 204) {
      throw new Error("Failed to delete article from legal basis requirement");
    }
  } catch (error) {
    console.error(
      "Error deleting article from legal basis requirement:",
      error
    );
    throw error;
  }
}
