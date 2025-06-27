import server from "../../config/server.js";

/**
 * Updates a requirement identification with the provided data.
 * Sends a PATCH request to the backend using JSON.
 *
 * @async
 * @function updateReqIdentification
 * @param {Object} params - Parameters for updating the requirement identification.
 * @param {number} params.id - ID of the requirement identification to update.
 * @param {string} [params.reqIdentificationName] - New name of the identification (optional).
 * @param {string} [params.reqIdentificationDescription] - New description (optional).
 * @param {number} [params.newUserId] - ID of the new user to assign (optional).
 * @param {string} params.token - Authorization token.
 *
 * @returns {Promise<Object>} - The updated requirement identification.
 * @throws {Error} - If the request fails or the response status is not 200.
 */
export default async function updateReqIdentification({
  id,
  reqIdentificationName,
  reqIdentificationDescription,
  newUserId,
  token,
}) {
  try {
    const request = {
      ...(reqIdentificationName && { reqIdentificationName }),
      ...(reqIdentificationDescription && { reqIdentificationDescription }),
      ...(newUserId && { newUserId }),
    };

    const response = await server.patch(`/req-identification/${id}`, request, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error('Failed to update requirement identification');
    }

    const { reqIdentification } = response.data;
    return reqIdentification;
  } catch (error) {
    console.error('Error updating requirement identification:', error);
    throw error;
  }
}
