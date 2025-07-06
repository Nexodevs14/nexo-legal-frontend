import server from "../../../config/server.js";

/**
 * Associates a legal basis to a requirement within a specific requirement identification.
 * Sends a POST request to the backend to perform the association.
 *
 * @async
 * @function addLegalBasisToRequirementInReqIdentification
 * @param {Object} params - Parameters for the association.
 * @param {number} params.reqIdentificationId - The ID of the requirement identification.
 * @param {number} params.requirementId - The ID of the requirement within the identification.
 * @param {number} params.legalBasisId - The ID of the legal basis to associate.
 * @param {string} params.token - Authorization token for the request.
 *
 * @returns {Promise<Object>} The updated requirement object from the response.
 * @throws {Error} If the request fails or the response status is not 201.
 */
export default async function addLegalBasisToRequirementInReqIdentification({
  reqIdentificationId,
  requirementId,
  legalBasisId,
  token,
}) {
  try {
    const response = await server.post(
      `/req-identification/${reqIdentificationId}/requirements/${requirementId}/legal-basis/${legalBasisId}`,
      {}, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 201) {
      throw new Error("Failed to associate legal basis to requirement");
    }

    const { reqIdentificationRequirement } = response.data;
    return reqIdentificationRequirement;
  } catch (error) {
    console.error("Error associating legal basis:", error);
    throw error;
  }
}
