import server from '../../../config/server.js'

/**
 * Retrieves requirements from a requirement identification by name.
 * Sends a GET request with a query parameter.
 *
 * @async
 * @function getRequirementsFromReqIdentificationByName
 * @param {Object} params - Parameters for the request.
 * @param {number} params.reqIdentificationId - The ID of the requirement identification.
 * @param {string} params.requirementName - The name of the requirement to search for.
 * @param {string} params.token - Authorization token for the request.
 *
 * @returns {Promise<Object[]>} Array of matched requirements.
 * @throws {Error} If the request fails or no requirements are found.
 */
export default async function getRequirementsFromReqIdentificationByName({
  reqIdentificationId,
  requirementName,
  token
}) {
  try {
    const response = await server.get(
      `/req-identification/${reqIdentificationId}/requirements/search/name`,
      {
        params: { requirementName },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (response.status !== 200) {
      throw new Error('Failed to retrieve requirements by name')
    }

    const { reqIdentificationRequirements } = response.data
    return reqIdentificationRequirements
  } catch (error) {
    console.error('Error searching requirements by name:', error)
    throw error
  }
}
