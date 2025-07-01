import server from '../../config/server.js'

/**
 * Retrieves all requirements associated with a specific requirement identification.
 * Sends a GET request to the backend.
 *
 * @async
 * @function getAllRequirementsFromReqIdentification
 * @param {Object} params - Parameters for the request.
 * @param {number} params.reqIdentificationId - The ID of the requirement identification.
 * @param {string} params.token - Authorization token for the request.
 *
 * @returns {Promise<Object[]>} Array of associated requirements.
 * @throws {Error} If the request fails or the data cannot be retrieved.
 */
export default async function getAllRequirementsFromReqIdentification({
  reqIdentificationId,
  token
}) {
  try {
    const response = await server.get(
      `/req-identification/${reqIdentificationId}/requirements`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (response.status !== 200) {
      throw new Error('Failed to retrieve requirements from requirement identification')
    }

    const { reqIdentificationRequirements } = response.data
    return reqIdentificationRequirements
  } catch (error) {
    console.error('Error fetching all requirements from requirement identification:', error)
    throw error
  }
}
