import { useState, useEffect, useCallback } from "react";
import getStates from "../../services/territoryService/getStates";
import getMunicipalitiesByState from "../../services/territoryService/getMunicipalitiesByState";
import TerritoryErrors from "../../errors/territory/TerritoryErrors";

/**
 * @typedef {Object} TerritoryState
 * @property {boolean} loading - Indicates whether the territorial request is in progress.
 * @property {Object|null} error - Contains a user-friendly error object if the operation fails.
 */

/**
 * @typedef {Object} UseTerritoryOptions
 * @property {boolean} [autoFetch=true] - If true, loads the list of states when the hook is mounted.
 */

/**
 * @typedef {Object} UseTerritoryResult
 * @property {string[]} states - List of Venezuelan states available for selection.
 * @property {boolean} loadingStates - Indicates whether the states list is loading.
 * @property {Object|null} errorStates - Error object associated with the states request, if any.
 * @property {string[]} municipalities - List of municipalities for the currently selected state.
 * @property {boolean} loadingMunicipalities - Indicates whether the municipalities list is loading.
 * @property {Object|null} errorMunicipalities - Error object associated with the municipalities request, if any.
 * @property {Function} clearMunicipalities - Clears the current municipalities list and related errors.
 * @property {Function} fetchStates - Loads the full list of Venezuelan states.
 * @property {Function} fetchMunicipalities - Loads municipalities for a given Venezuelan state.
 */

/**
 * Custom hook for managing Venezuelan territorial data.
 * Provides state and helper functions for loading states and municipalities
 * from the local `venezuela` dataset.
 *
 * @param {UseTerritoryOptions} [options={}] - Hook configuration options.
 * @returns {UseTerritoryResult} - State, loading flags, errors, and actions for territorial data.
 */
export default function useTerritory({ autoFetch = true } = {}) {
  const [states, setStates] = useState([]);
  /** @type {[TerritoryState, Function]} */
  const [stateStates, setStateStates] = useState({
    loading: true,
    error: null,
  });
  const [municipalities, setMunicipalities] = useState([]);
  /** @type {[TerritoryState, Function]} */
  const [stateMunicipalities, setStateMunicipalities] = useState({
    loading: false,
    error: null,
  });

  /**
   * Clears the current list of municipalities and resets municipality errors.
   *
   * @function clearMunicipalities
   * @returns {void}
   */
  const clearMunicipalities = useCallback(() => {
    setMunicipalities([]);
    setStateMunicipalities((prevState) => ({ ...prevState, error: null }));
  }, []);

  /**
   * Loads the complete list of Venezuelan states from the local territory dataset.
   *
   * @function fetchStates
   * @returns {void}
   */
  const fetchStates = useCallback(() => {
    setStateStates({ loading: true, error: null });
    try {
      const data = getStates();
      setStates(data);
      setStateStates({ loading: false, error: null });
    } catch {
      setStateStates({
        loading: false,
        error: TerritoryErrors.handleStateError(),
      });
    }
  }, []);

  /**
   * Loads the list of municipalities associated with a specific Venezuelan state.
   *
   * @function fetchMunicipalities
   * @param {string} state - The name of the Venezuelan state to query.
   * @returns {void}
   */
  const fetchMunicipalities = useCallback((state) => {
    setStateMunicipalities({ loading: true, error: null });
    try {
      const data = getMunicipalitiesByState(state);
      setMunicipalities(data);
      setStateMunicipalities({ loading: false, error: null });
    } catch {
      setStateMunicipalities({
        loading: false,
        error: TerritoryErrors.handleMunicipalityError(),
      });
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchStates();
    }
  }, [fetchStates, autoFetch]);

  return {
    states,
    loadingStates: stateStates.loading,
    errorStates: stateStates.error,
    municipalities,
    loadingMunicipalities: stateMunicipalities.loading,
    errorMunicipalities: stateMunicipalities.error,
    clearMunicipalities,
    fetchStates,
    fetchMunicipalities,
  };
}
