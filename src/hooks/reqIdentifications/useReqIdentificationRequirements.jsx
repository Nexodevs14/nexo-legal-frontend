import { useContext, useState, useCallback } from 'react'
import Context from '../../context/userContext.jsx'
import addRequirementToReqIdentification from '../../services/reqIdentificationService/reqIdentificationRequirements/addRequirementToReqIdentification.js'
import editRequirementFromReqIdentification from '../../services/reqIdentificationService/reqIdentificationRequirements/editRequirementFromReqIdentification.js'
import deleteRequirementFromReqIdentification from '../../services/reqIdentificationService/reqIdentificationRequirements/deleteRequirementFromReqIdentification.js'
import getRequirementFromReqIdentification from '../../services/reqIdentificationService/reqIdentificationRequirements/getRequirementFromReqIdentification.js'
import getAllRequirementsFromReqIdentification from '../../services/reqIdentificationService/reqIdentificationRequirements/getAllRequirementsFromReqIdentification.js'
import getRequirementsFromReqIdentificationByName from '../../services/reqIdentificationService/reqIdentificationRequirements/getRequirementsFromReqIdentificationByName.js'
import getRequirementsFromReqIdentificationByRequirementName from '../../services/reqIdentificationService/reqIdentificationRequirements/getRequirementsFromReqIdentificationByRequirementName.js'
import ReqIdentificationRequirementsErrors from '../../errors/reqIdentifications/ReqIdentificationRequirementsErrors.js'

/**
 * Custom hook for managing requirements within a requirement identification.
 * @returns {Object} - Contains state and functions for requirement identification requirements.
 */
export default function useReqIdentificationRequirements() {
    const { jwt } = useContext(Context)
    const [reqIdentificationRequirements, setReqIdentificationRequirements] = useState([])
    const [state, setState] = useState({
        loading: false,
        error: null,
    })
    /**
     * Adds a requirement to a specific requirement identification.
     *
     * @async
     * @function addRequirement
     * @param {Object} params - Data to associate the requirement.
     * @param {number} params.reqIdentificationId - The ID of the requirement identification.
     * @param {number} params.requirementId - The ID of the requirement to associate.
     * @param {string} params.requirementName - Custom name of the requirement in the identification.
     * @param {number[]} [params.requirementTypeIds] - Optional array of requirement type IDs.
     * @param {{ id: number, translation: string }[]} [params.legalVerbs] - Optional array of legal verbs with translations.
     * @returns {Promise<{ success: true, reqIdentificationRequirement: Object } | { success: false, error: string }>}
     */
    const addRequirement = useCallback(
        async ({
            reqIdentificationId,
            requirementId,
            requirementName,
            requirementTypeIds,
            legalVerbs,
        }) => {
            try {
                const reqIdentificationRequirement = await addRequirementToReqIdentification({
                    reqIdentificationId,
                    requirementId,
                    requirementName,
                    requirementTypeIds,
                    legalVerbs,
                    token: jwt,
                });
                return { success: true, reqIdentificationRequirement };
            } catch (error) {
                const errorCode = error.response?.status;
                const serverMessage = error.response?.data?.message;
                const clientMessage = error.message;
                const handledError = ReqIdentificationRequirementsErrors.handleError({
                    code: errorCode,
                    error: serverMessage,
                    httpError: clientMessage,
                });
                return { success: false, error: handledError.message };
            }
        },
        [jwt]
    );

    /**
     * Edits a requirement associated with a specific requirement identification.
     *
     * @async
     * @function editRequirementFromReqIdentification
     * @param {Object} params - Data to update the requirement.
     * @param {number} params.reqIdentificationId - The ID of the requirement identification.
     * @param {number} params.requirementId - The ID of the requirement to edit.
     * @param {string} [params.requirementName] - New custom name (optional).
     * @param {number[]} [params.requirementTypeIds] - Optional updated requirement type IDs.
     * @param {{ id: number, translation: string }[]} [params.legalVerbs] - Optional updated legal verbs.
     * @returns {Promise<{ success: true } | { success: false, error: string }>}
     */
    const editRequirement = useCallback(
        async ({
            reqIdentificationId,
            requirementId,
            requirementName,
            requirementTypeIds,
            legalVerbs,
        }) => {
            try {
                const reqIdentificationRequirement = await editRequirementFromReqIdentification({
                    reqIdentificationId,
                    requirementId,
                    requirementName,
                    requirementTypeIds,
                    legalVerbs,
                    token: jwt,
                });
                setReqIdentificationRequirements((prev) =>
                    prev.map((item) =>
                        item.requirementId === requirementId ? reqIdentificationRequirement : item
                    )
                );
                return { success: true };
            } catch (error) {
                const errorCode = error.response?.status;
                const serverMessage = error.response?.data?.message;
                const clientMessage = error.message;

                const handledError = ReqIdentificationRequirementsErrors.handleError({
                    code: errorCode,
                    error: serverMessage,
                    httpError: clientMessage,
                    items: [requirementId],
                });
                return { success: false, error: handledError.message };
            }
        },
        [jwt, setReqIdentificationRequirements]
    );

    /**
     * Deletes a requirement from a specific requirement identification.
     *
     * @async
     * @function deleteRequirement
     * @param {Object} params - Parameters for the deletion process.
     * @param {number} params.reqIdentificationId - The ID of the requirement identification.
     * @param {number} params.requirementId - The ID of the requirement to remove.
     * @returns {Promise<{ success: true } | { success: false, error: string }>}
     */
    const deleteRequirement = useCallback(
        async ({ reqIdentificationId, requirementId }) => {
            try {
                await deleteRequirementFromReqIdentification({
                    reqIdentificationId,
                    requirementId,
                    token: jwt,
                });
                setReqIdentificationRequirements((prev) =>
                    prev.filter((item) => item.requirementId !== requirementId)
                );
                return { success: true };
            } catch (error) {
                const errorCode = error.response?.status;
                const serverMessage = error.response?.data?.message;
                const clientMessage = error.message;

                const handledError = ReqIdentificationRequirementsErrors.handleError({
                    code: errorCode,
                    error: serverMessage,
                    httpError: clientMessage,
                    items: [requirementId],
                });
                return { success: false, error: handledError.message };
            }
        },
        [jwt, setReqIdentificationRequirements]
    );

    /**
     * Fetches a specific requirement by its ID from a requirement identification.
     * @async
     * @function fetchRequirementFromReqIdentification
     * @param {Object} params - Parameters to identify the requirement.
     * @param {number} params.reqIdentificationId - The ID of the requirement identification.
     * @param {number} params.requirementId - The ID of the requirement to fetch.
     * @returns {Promise<{success: boolean, data?: Object, error?: Object}>}
     */
    const fetchRequirementFromReqIdentification = useCallback(
        async ({ reqIdentificationId, requirementId }) => {
            try {
                const requirement = await getRequirementFromReqIdentification({
                    reqIdentificationId,
                    requirementId,
                    token: jwt
                })
                return { success: true, data: requirement }
            } catch (error) {
                const errorCode = error.response?.status
                const serverMessage = error.response?.data?.message
                const clientMessage = error.message

                const handledError = ReqIdentificationRequirementsErrors.handleError({
                    code: errorCode,
                    error: serverMessage,
                    httpError: clientMessage,
                    items: [reqIdentificationId, requirementId]
                })
                return {
                    success: false,
                    error: handledError
                }
            }
        },
        [jwt]
    )

    /**
     * Fetches all requirements associated with a given requirement identification.
     *
     * @async
     * @function getAllRequirements
     * @param {number} reqIdentificationId - The ID of the requirement identification.
     * @returns {Promise<{ success: true } | { success: false, error: string }>}
     */
    const fetchAllRequirements = useCallback(
        async (reqIdentificationId) => {
            setState((prev) => ({ ...prev, loading: true }));
            try {
                const requirements = await getAllRequirementsFromReqIdentification({
                    reqIdentificationId,
                    token: jwt,
                });

                setReqIdentificationRequirements(requirements);
                setState({ loading: false, error: null });

                return { success: true };
            } catch (error) {
                const errorCode = error.response?.status;
                const serverMessage = error.response?.data?.message;
                const clientMessage = error.message;

                const handledError = ReqIdentificationRequirementsErrors.handleError({
                    code: errorCode,
                    error: serverMessage,
                    httpError: clientMessage,
                    items: [reqIdentificationId],
                });

                setState({ loading: false, error: handledError.message });
                return { success: false, error: handledError.message };
            }
        },
        [jwt]
    );

    /**
    * Fetches requirements from a requirement identification filtered by requirement name.
    *
    * @async
    * @function fetchRequirementsByName
    * @param {Object} params - Parameters for the request.
    * @param {number} params.reqIdentificationId - The ID of the requirement identification.
    * @param {string} params.requirementName - The name of the requirement to filter by.
    * @returns {Promise<{ success: true } | { success: false, error: string }>}
    */
    const fetchRequirementsByName = useCallback(
        async ({ reqIdentificationId, requirementName }) => {
            setState((prev) => ({ ...prev, loading: true }));
            try {
                const filteredRequirements = await getRequirementsFromReqIdentificationByName({
                    reqIdentificationId,
                    requirementName,
                    token: jwt,
                });
                setReqIdentificationRequirements(filteredRequirements);
                setState({ loading: false, error: null });
                return { success: true };
            } catch (error) {
                const errorCode = error.response?.status;
                const serverMessage = error.response?.data?.message;
                const clientMessage = error.message;
                const handledError = ReqIdentificationRequirementsErrors.handleError({
                    code: errorCode,
                    error: serverMessage,
                    httpError: clientMessage,
                    items: [reqIdentificationId, requirementName],
                });
                setState({ loading: false, error: handledError.message });
                return { success: false, error: handledError.message };
            }
        },
        [jwt]
    );

    /**
     * Fetches requirements from a requirement identification filtered by original requirement name.
     *
     * @async
     * @function getRequirementsByRequirementName
     * @param {Object} params - Parameters for the request.
     * @param {number} params.reqIdentificationId - The ID of the requirement identification.
     * @param {string} params.requirementName - The original name of the requirement to filter by.
     * @returns {Promise<{ success: true } | { success: false, error: string }>}
     */
    const fetchRequirementsByRequirementName = useCallback(
        async ({ reqIdentificationId, requirementName }) => {
            setState((prev) => ({ ...prev, loading: true }));
            try {
                const filteredRequirements = await getRequirementsFromReqIdentificationByRequirementName({
                    reqIdentificationId,
                    requirementName,
                    token: jwt,
                });

                setReqIdentificationRequirements(filteredRequirements);
                setState({ loading: false, error: null });
                return { success: true };
            } catch (error) {
                const errorCode = error.response?.status;
                const serverMessage = error.response?.data?.message;
                const clientMessage = error.message;

                const handledError = ReqIdentificationRequirementsErrors.handleError({
                    code: errorCode,
                    error: serverMessage,
                    httpError: clientMessage,
                    items: [reqIdentificationId, requirementName],
                });
                setState({ loading: false, error: handledError.message });
                return { success: false, error: handledError.message };
            }
        },
        [jwt]
    );
    return {
        reqIdentificationRequirements,
        loading: state.loading,
        error: state.error,
        setReqIdentificationRequirements,
        addRequirement,
        editRequirement,
        deleteRequirement,
        fetchRequirementFromReqIdentification,
        fetchAllRequirements,
        fetchRequirementsByName,
        fetchRequirementsByRequirementName,
    }
}