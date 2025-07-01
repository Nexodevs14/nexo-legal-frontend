import server from "../../../config/server.js";

/**
 * Retrieves requirements by their original name within a requirement identification.
 * Sends a GET request with a query parameter to filter by original requirement name.
 *
 * @async
 * @function getRequirementsFromReqIdentificationByRequirementName
 * @param {Object} params - Parameters for the request.
 * @param {number} params.reqIdentificationId - The ID of the requirement identification.
 * @param {string} params.requirementName - The original name of the requirement to search for.
 * @param {string} params.token - Authorization token for the request.
 *
 * @returns {Promise<Object[]>} Array of associated requirements.
 * @throws {Error} If the request fails or data cannot be retrieved.
 */
export default async function getRequirementsFromReqIdentificationByRequirementName({
  reqIdentificationId,
  requirementName,
  token,
}) {
  try {
    const response = await server.get(
      `/req-identification/${reqIdentificationId}/requirements/search/requirement/name`,
      {
        params: { requirementName },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to retrieve requirements by original name");
    }

    const { reqIdentificationRequirements } = response.data;
    return reqIdentificationRequirements;
  } catch (error) {
    console.error("Error fetching requirements by original name:", error);
    throw error;
  }
}
