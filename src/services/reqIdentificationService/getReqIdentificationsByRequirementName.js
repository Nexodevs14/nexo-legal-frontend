import server from "../../config/server.js";

/**
 * Retrieves requirement identifications filtered by requirement name.
 *
 * @async
 * @function getReqIdentificationsByRequirementName
 * @param {Object} params - Parameters for the request.
 * @param {string} params.requirementName - Requirement name to filter by (partial match allowed).
 * @param {string} params.token - Authorization token.
 *
 * @returns {Promise<Object[]>} - An array of requirement identifications.
 * @throws {Error} - If the request fails or the response status is not 200.
 */
export default async function getReqIdentificationsByRequirementName({
  requirementName,
  token,
}) {
  try {
    const response = await server.get(
      "/req-identification/search/requirement/name",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          requirementName: requirementName,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(
        "Failed to fetch requirement identifications by requirement name"
      );
    }

    const { reqIdentifications } = response.data;
    return reqIdentifications;
  } catch (error) {
    console.error(
      "Error fetching requirement identifications by requirement name:",
      error
    );
    throw error;
  }
}
