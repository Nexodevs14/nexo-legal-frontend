import venezuela from "venezuela";

/**
 * Retrieves the official list of Venezuelan states from the local
 * `venezuela` dataset.
 *
 * @function getStates
 * @returns {string[]} The list of Venezuelan states.
 */
export default function getStates() {
  try {
    return venezuela.pais.map((state) => state.estado);
  } catch (error) {
    console.error("Error retrieving Venezuelan states", error);
    throw error;
  }
}
