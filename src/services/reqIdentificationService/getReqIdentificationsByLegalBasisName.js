import server from "../../config/server.js";

/**
 * Retrieves requirement identifications filtered by legal basis name.
 *
 * @async
 * @function getReqIdentificationsByLegalBasisName
 * @param {Object} params - Parameters for the request.
 * @param {string} params.legalBasisName - Legal basis name to filter by (partial match allowed).
 * @param {string} params.token - Authorization token.
 *
 * @returns {Promise<Object[]>} - An array of requirement identifications.
 * @throws {Error} - If the request fails or the response status is not 200.
 */
export default async function getReqIdentificationsByLegalBasisName({
  legalBasisName,
  token,
}) {
  try {
    const response = await server.get(
      "/req-identification/search/legal-basis/name",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          legalBasisName: legalBasisName,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(
        "Failed to fetch requirement identifications by legal basis name"
      );
    }

    const { reqIdentifications } = response.data;
    return reqIdentifications;
  } catch (error) {
    console.error(
      "Error fetching requirement identifications by legal basis name:",
      error
    );
    throw error;
  }
}
