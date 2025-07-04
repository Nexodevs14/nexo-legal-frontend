import server from "../../../config/server.js";

/**
 * Edits a requirement associated with a requirement identification.
 * Sends a PATCH request with updated data to the backend.
 *
 * @async
 * @function editRequirementFromReqIdentification
 * @param {Object} params - Parameters for the update.
 * @param {number} params.reqIdentificationId - The ID of the requirement identification.
 * @param {number} params.requirementId - The ID of the requirement to edit.
 * @param {string} [params.requirementName] - The new name for the requirement (optional).
 * @param {number[]} [params.requirementTypeIds] - Optional array of requirement type IDs.
 * @param {{ id: number, translation: string }[]} [params.legalVerbs] - Optional array of legal verbs with translations.
 * @param {string} params.token - Authorization token for the request.
 *
  * @returns {Promise<void>} A promise that resolves when the requirement is successfully updated.
 * @throws {Error} If the request fails or the update is invalid.
 */
export default async function editRequirementFromReqIdentification({
  reqIdentificationId,
  requirementId,
  requirementName,
  requirementTypeIds,
  legalVerbs,
  token,
}) {
  try {
    const response = await server.patch(
      `/req-identification/${reqIdentificationId}/requirements/${requirementId}`,
      {
        requirementName,
        requirementTypeIds,
        legalVerbs,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 204) {
      throw new Error(
        "Failed to edit requirement from requirement identification"
      );
    }
  } catch (error) {
    console.error(
      "Error editing requirement from requirement identification:",
      error
    );
    throw error;
  }
}
