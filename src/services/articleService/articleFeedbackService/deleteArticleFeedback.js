import server from "../../../config/server.js";

/**
 * Deletes a feedback record by its ID.
 * Sends a DELETE request to the backend with the feedback ID and an authorization token.
 *
 * @async
 * @function deleteArticleFeedbackById
 * @param {Object} params - Parameters for deleting feedback.
 * @param {number|string} params.id - The ID of the feedback to delete.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<boolean>} Returns `true` if the feedback was deleted successfully.
 * @throws {Error} If the response status is not 204 or if there is an error with the request.
 */
export default async function deleteArticleFeedback({ id, token }) {
  try {
    const response = await server.delete(`/article-feedback/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 204) {
      throw new Error("Failed to delete article feedback");
    }

    return true;
  } catch (error) {
    console.error("Error deleting article feedback:", error);
    throw error;
  }
}
