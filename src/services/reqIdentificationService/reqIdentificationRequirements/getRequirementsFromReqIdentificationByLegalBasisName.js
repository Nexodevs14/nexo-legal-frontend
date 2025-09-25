import server from "../../../config/server.js";

/**
 * Retrieves requirements by legal basis name within a requirement identification.
 * Sends a GET request with a query parameter to filter by legal basis name.
 *
 * @async
 * @function getRequirementsFromReqIdentificationByLegalBasisName
 * @param {Object} params - Parameters for the request.
 * @param {number} params.reqIdentificationId - The ID of the requirement identification.
 * @param {string} params.legalBasisName - The legal basis name to search for.
 * @param {string} params.token - Authorization token for the request.
 *
 * @returns {Promise<Object[]>} Array of associated requirements.
 * @throws {Error} If the request fails or data cannot be retrieved.
 */
export default async function ({
  reqIdentificationId,
  legalBasisName,
  token,
}) {
  try {
    const response = await server.get(
      `/req-identification/${reqIdentificationId}/requirements/search/legal-basis/name`,
      {
        params: { legalBasisName },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to retrieve requirements by legal basis name");
    }

    const { reqIdentificationRequirements } = response.data;
    return reqIdentificationRequirements;
  } catch (error) {
    console.error("Error fetching requirements by legal basis name:", error);
    throw error;
  }
}
