import venezuela from "venezuela";

/**
 * Retrieves the list of municipalities for a given Venezuelan state from the
 * local `venezuela` dataset.
 *
 * @function getMunicipalitiesByState
 * @param {string} state - The name of the Venezuelan state.
 * @returns {string[]} The list of municipalities in the given state.
 */
export default function getMunicipalitiesByState(state) {
  try {
    const stateData = venezuela.estado(state, { municipios: true });

    if (!stateData) {
      throw new Error(`State not found: ${state}`);
    }

    return stateData.municipios;
  } catch (error) {
    console.error("Error retrieving municipalities for state:", state, error);
    throw error;
  }
}
