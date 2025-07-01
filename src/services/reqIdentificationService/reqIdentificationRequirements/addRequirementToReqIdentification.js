import server from '../../../config/server.js'

/**
 * Associates a requirement to a specific requirement identification.
 * Sends a POST request with the necessary data to the backend.
 *
 * @async
 * @function addRequirementToReqIdentification
 * @param {Object} params - Parameters for the association.
 * @param {number} params.reqIdentificationId - The ID of the requirement identification.
 * @param {number} params.requirementId - The ID of the base requirement to associate.
 * @param {string} params.requirementName - The name assigned to the requirement within the identification.
 * @param {number[]} [params.requirementTypeIds] - Optional array of requirement type IDs.
 * @param {{ id: number, translation: string }[]} [params.legalVerbs] - Optional array of legal verbs with translations.
 * @param {string} params.token - Authorization token for the request.
 *
 * @returns {Promise<Object>} The associated requirement as stored in the identification.
 * @throws {Error} If the request fails or the response status is not 201.
 */
export default async function addRequirementToReqIdentification({
  reqIdentificationId,
  requirementId,
  requirementName,
  requirementTypeIds,
  legalVerbs,
  token
}) {
  try {
    const response = await server.post(
      `/req-identification/${reqIdentificationId}/requirements/${requirementId}`,
      {
        requirementName,
        requirementTypeIds,
        legalVerbs
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    if (response.status !== 201) {
      throw new Error('Failed to associate requirement to requirement identification')
    }
    const { reqIdentificationRequirement } = response.data
    return reqIdentificationRequirement
  } catch (error) {
    console.error('Error associating requirement:', error)
    throw error
  }
}
