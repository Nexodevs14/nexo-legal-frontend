import server from "../../../config/server.js";

/**
 * Deletes a legal basis from a requirement within a specific requirement identification.
 * Sends a DELETE request to the backend to perform the unlinking.
 *
 * @async
 * @function deleteLegalBasisFromRequirementInReqIdentification
 * @param {Object} params - Parameters for the deletion.
 * @param {number} params.reqIdentificationId - The ID of the requirement identification.
 * @param {number} params.requirementId - The ID of the requirement within the identification.
 * @param {number} params.legalBasisId - The ID of the legal basis to delete.
 * @param {string} params.token - Authorization token for the request.
 *
 * @returns {Promise<void>} Resolves if the deletion is successful.
 * @throws {Error} If the request fails or the response status is not 204.
 */
export default async function deleteLegalBasisFromRequirementInReqIdentification({
  reqIdentificationId,
  requirementId,
  legalBasisId,
  token,
}) {
  try {
    const response = await server.delete(
      `/req-identification/${reqIdentificationId}/requirements/${requirementId}/legal-basis/${legalBasisId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 204) {
      throw new Error(
        "Failed to delete legal basis from requirement identification"
      );
    }
  } catch (error) {
    console.error("Error deleting legal basis:", error);
    throw error;
  }
}
