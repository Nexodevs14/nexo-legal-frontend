import server from "../../../config/server.js";

/**
 * Retrieves a specific requirement associated with a requirement identification.
 * Sends a GET request to the backend.
 *
 * @async
 * @function getRequirementFromReqIdentification
 * @param {Object} params - Parameters for the request.
 * @param {number} params.reqIdentificationId - The ID of the requirement identification.
 * @param {number} params.requirementId - The ID of the requirement to retrieve.
 * @param {string} params.token - Authorization token for the request.
 *
 * @returns {Promise<Object>} The retrieved requirement object.
 * @throws {Error} If the request fails or the requirement cannot be retrieved.
 */
export default async function getRequirementFromReqIdentification({
  reqIdentificationId,
  requirementId,
  token,
}) {
  try {
    const response = await server.get(
      `/req-identification/${reqIdentificationId}/requirements/${requirementId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to retrieve the specific requirement");
    }

    const { reqIdentificationRequirement } = response.data;
    return reqIdentificationRequirement;
  } catch (error) {
    console.error(
      "Error fetching the specific requirement from requirement identification:",
      error
    );
    throw error;
  }
}
