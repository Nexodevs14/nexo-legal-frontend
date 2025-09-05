/**
 * Class for managing and mapping errors related to Article Feedback.
 * Centralizes error handling, mapping error codes and messages to user-friendly messages.
 */
class ArticleFeedbackErrors {
    static NETWORK_ERROR = "NETWORK_ERROR";
    static UNAUTHORIZED = "UNAUTHORIZED";
    static SERVER_ERROR = "SERVER_ERROR";
    static VALIDATION_ERROR = "VALIDATION_ERROR";
    static REQ_IDENTIFICATION_NOT_FOUND = "REQ_IDENTIFICATION_NOT_FOUND";
    static REQUIREMENT_NOT_FOUND = "REQUIREMENT_NOT_FOUND";
    static LEGAL_BASIS_NOT_FOUND = "LEGAL_BASIS_NOT_FOUND";
    static ARTICLE_NOT_FOUND = "ARTICLE_NOT_FOUND";
    static FEEDBACK_NOT_FOUND = "FEEDBACK_NOT_FOUND";
    static NOT_FOUND = "NOT_FOUND";
    static UNEXPECTED_ERROR = "UNEXPECTED_ERROR";

    /**
     * Map of error constants to user-friendly error objects.
     */
    static errorMap = {
        [ArticleFeedbackErrors.NETWORK_ERROR]: {
            title: "Error de conexión",
            message:
                "Hubo un problema de red. Verifique su conexión a internet e intente nuevamente.",
        },
        [ArticleFeedbackErrors.UNAUTHORIZED]: {
            title: "Acceso no autorizado",
            message: "No tiene permisos para realizar esta acción. Verifique su sesión.",
        },
        [ArticleFeedbackErrors.SERVER_ERROR]: {
            title: "Error interno del servidor",
            message: "Hubo un error en el servidor. Intente nuevamente más tarde.",
        },
        [ArticleFeedbackErrors.VALIDATION_ERROR]: {
            title: "Error de validación",
            message: "Uno o más campos no son válidos. Revise los datos ingresados.",
        },
        [ArticleFeedbackErrors.REQ_IDENTIFICATION_NOT_FOUND]: {
            title: "Identificación de requerimientos no encontrada",
            message:
                "La identificación de requerimientos especificada no fue encontrada. Verifique su existencia recargando la app e intente de nuevo.",
        },
        [ArticleFeedbackErrors.REQUIREMENT_NOT_FOUND]: {
            title: "Requerimiento no encontrado",
            message: "El requerimiento no fue encontrado. Verifique su existencia recargando la app e intente de nuevo.",
        },
        [ArticleFeedbackErrors.LEGAL_BASIS_NOT_FOUND]: {
            title: "Fundamento legal no encontrado",
            message: "El fundamento legal especificado no fue encontrado. Verifique su existencia recargando la app e intente de nuevo.",
        },
        [ArticleFeedbackErrors.ARTICLE_NOT_FOUND]: {
            title: "Artículo no encontrado",
            message: "El artículo especificado no fue encontrado. Verifique su existencia recargando la app e intente de nuevo.",
        },
        [ArticleFeedbackErrors.FEEDBACK_NOT_FOUND]: {
            title: "Feedback no encontrado",
            message: "El registro de feedback no fue encontrado. Verifique su existencia recargando la app e intente de nuevo.",
        },
        [ArticleFeedbackErrors.NOT_FOUND]: {
            title: "Elemento no encontrado",
            message:
                "El recurso solicitado no fue encontrado. Verifique los datos e intente nuevamente.",
        },
        [ArticleFeedbackErrors.UNEXPECTED_ERROR]: {
            title: "Error inesperado",
            message: "Ocurrió un error inesperado. Intente nuevamente más tarde.",
        },
    };

    /**
     * Map backend messages to standardized error constants.
     */
    static ErrorMessagesMap = {
        "Network Error": ArticleFeedbackErrors.NETWORK_ERROR,
        "Validation failed": ArticleFeedbackErrors.VALIDATION_ERROR,
        "Unauthorized": ArticleFeedbackErrors.UNAUTHORIZED,
        "Requirement Identification not found": ArticleFeedbackErrors.REQ_IDENTIFICATION_NOT_FOUND,
        "Requirement not found": ArticleFeedbackErrors.REQUIREMENT_NOT_FOUND,
        "LegalBasis not found": ArticleFeedbackErrors.LEGAL_BASIS_NOT_FOUND,
        "Article not found": ArticleFeedbackErrors.ARTICLE_NOT_FOUND,
        "Article Feedback not found": ArticleFeedbackErrors.FEEDBACK_NOT_FOUND,
    };

    /**
     * Handles errors by mapping HTTP codes or backend messages.
     *
     * @param {Object} params
     * @param {number} params.code - HTTP status code
     * @param {string} [params.error] - Error message from server
     * @param {string} [params.httpError] - Error from HTTP client
     * @returns {Object} User-friendly error object
     */
    static handleError({ code, error, httpError }) {
        const message = error || httpError;

        if (message && ArticleFeedbackErrors.ErrorMessagesMap[message]) {
            const key = ArticleFeedbackErrors.ErrorMessagesMap[message];
            return ArticleFeedbackErrors.errorMap[key];
        }

        switch (code) {
            case 400:
                return ArticleFeedbackErrors.errorMap[
                    ArticleFeedbackErrors.VALIDATION_ERROR
                ];
            case 401:
            case 403:
                return ArticleFeedbackErrors.errorMap[
                    ArticleFeedbackErrors.UNAUTHORIZED
                ];
            case 404:
                return ArticleFeedbackErrors.errorMap[ArticleFeedbackErrors.NOT_FOUND];
            case 500:
                return ArticleFeedbackErrors.errorMap[
                    ArticleFeedbackErrors.SERVER_ERROR
                ];
            default:
                return ArticleFeedbackErrors.errorMap[
                    ArticleFeedbackErrors.UNEXPECTED_ERROR
                ];
        }
    }
}

export default ArticleFeedbackErrors;
