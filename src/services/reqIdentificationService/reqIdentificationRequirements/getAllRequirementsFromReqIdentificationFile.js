import server from "../../../config/server.js";

/**
 * Downloads a file containing all requirements associated with a specific requirement identification.
 *
 * @async
 * @function getAllRequirementsFromReqIdentificationFile
 * @param {Object} params - Parameters for the request.
 * @param {number|string} params.reqIdentificationId - The ID of the requirement identification.
 * @param {string} params.token - Authorization token for the request.
 * @param {string} [params.fileType='xlsx'] - Type of file to download.
 *
 * @returns {Promise<{ file: string, fileName: string, contentType: string }>} - Resolves with an object containing the file.
 * @throws {Error} If the request fails or the file cannot be downloaded.
 */
export default async function getAllRequirementsFromReqIdentificationFile({
  reqIdentificationId,
  token,
  fileType,
}) {
  try {
    const response = await server.get(
      `/req-identification/${reqIdentificationId}/requirements/download/file`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          fileType,
        },
      }
    );
    if (response.status !== 200) {
      throw new Error("Failed to download requirements file");
    }
    const { file, fileName, contentType } = response.data;
    return {
      file,
      fileName,
      contentType,
    };
  } catch (error) {
    console.error(
      "Error downloading requirements file from requirement identification:",
      error
    );
    throw error;
  }
}
