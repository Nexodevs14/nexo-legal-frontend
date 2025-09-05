import server from "../../../config/server.js";

/**
 * Retrieves all feedbacks for a specific article within a requirement identification, requirement, and legal basis.
 * Sends a GET request to the backend to fetch feedbacks for the given article.
 *
 * @async
 * @function getArticleFeedbacksByArticle
 * @param {Object} params - Parameters for retrieving feedbacks.
 * @param {number} params.reqIdentificationId - The ID of the requirement identification.
 * @param {number} params.requirementId - The ID of the requirement.
 * @param {number} params.legalBasisId - The ID of the legal basis.
 * @param {number} params.articleId - The ID of the article.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} The list of feedbacks associated with the article.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function getArticleFeedbacksByArticle({
  reqIdentificationId,
  requirementId,
  legalBasisId,
  articleId,
  token,
}) {
  try {
    const response = await server.get(
      `/article-feedbacks/${reqIdentificationId}/${requirementId}/${legalBasisId}/${articleId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to retrieve article feedbacks");
    }

    const { feedbacks } = response.data;
    return feedbacks;
  } catch (error) {
    console.error("Error retrieving article feedbacks:", error);
    throw error;
  }
}
