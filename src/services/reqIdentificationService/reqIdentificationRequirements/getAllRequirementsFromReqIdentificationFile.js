import server from "../../../config/server.js";

/**
 * Downloads an Excel file containing all requirements associated with a specific requirement identification.
 * Sends a GET request to the backend with responseType 'blob'.
 *
 * @async
 * @function getAllRequirementsFromReqIdentificationFile
 * @param {Object} params - Parameters for the request.
 * @param {number|string} params.reqIdentificationId - The ID of the requirement identification.
 * @param {string} params.token - Authorization token for the request.
 *
 * @returns {Promise<{ blob: Blob, fileName: string }>} The downloaded Excel file as a Blob and its file name.
 * @throws {Error} If the request fails or the file cannot be downloaded.
 */
export default async function getAllRequirementsFromReqIdentificationFile({
  reqIdentificationId,
  token,
}) {
  try {
    const response = await server.get(
      `/req-identification/${reqIdentificationId}/requirements/download`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to download requirements file");
    }

    const contentDisposition = response.headers["content-disposition"];
    const fileNameMatch = contentDisposition?.match(/filename="(.+)"/);
    const fileName = fileNameMatch ? decodeURIComponent(fileNameMatch[1]) : "requerimientos.xlsx";

    return {
      blob: response.data,
      fileName,
    };
  } catch (error) {
    console.error(
      "Error downloading requirements file from requirement identification:",
      error
    );
    throw error;
  }
}
