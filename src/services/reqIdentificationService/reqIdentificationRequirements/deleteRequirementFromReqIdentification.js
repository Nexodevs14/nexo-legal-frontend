import server from "../../../config/server.js";

/**
 * Deletes a requirement from a specific requirement identification.
 * Sends a DELETE request to the backend.
 *
 * @async
 * @function deleteRequirementFromReqIdentification
 * @param {Object} params - Parameters for the request.
 * @param {number} params.reqIdentificationId - The ID of the requirement identification.
 * @param {number} params.requirementId - The ID of the requirement to delete.
 * @param {string} params.token - Authorization token for the request.
 *
  * @returns {Promise<void>} A promise that resolves when the requirement is successfully deleted.
 * @throws {Error} If the request fails or deletion is not permitted.
 */
export default async function deleteRequirementFromReqIdentification({
  reqIdentificationId,
  requirementId,
  token,
}) {
  try {
    const response = await server.delete(
      `/req-identification/${reqIdentificationId}/requirements/${requirementId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status !== 204) {
      throw new Error(
        "Failed to delete requirement from requirement identification"
      );
    }
  } catch (error) {
    console.error(
      "Error deleting requirement from requirement identification:",
      error
    );
    throw error;
  }
}
