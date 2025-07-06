/**
 * Class for managing and mapping errors related to Requirement Identification Requirements.
 * Centralizes error handling, mapping error codes and messages to user-friendly messages.
 */
class ReqIdentificationRequirementsErrors {
  static NETWORK_ERROR = "NETWORK_ERROR";
  static UNAUTHORIZED = "UNAUTHORIZED";
  static SERVER_ERROR = "SERVER_ERROR";
  static VALIDATION_ERROR = "VALIDATION_ERROR";
  static NOT_FOUND = "NOT_FOUND";
  static MULTIPLE_NOT_FOUND = "MULTIPLE_NOT_FOUND";
  static CONFLICT = "CONFLICT";
  static UNEXPECTED_ERROR = "UNEXPECTED_ERROR";
  static REQ_IDENTIFICATION_NOT_FOUND = 'REQ_IDENTIFICATION_NOT_FOUND';
  static REQUIREMENT_NOT_FOUND = 'REQUIREMENT_NOT_FOUND';
  static REQUIREMENT_TYPES_NOT_FOUND = 'REQUIREMENT_TYPES_NOT_FOUND';
  static LEGAL_VERBS_NOT_FOUND = 'LEGAL_VERBS_NOT_FOUND';
  static REQUIREMENT_NAME_CONFLICT = 'REQUIREMENT_NAME_CONFLICT';
  static REQUIREMENT_ALREADY_LINKED = 'REQUIREMENT_ALREADY_LINKED';
  static REQUIREMENT_NOT_LINKED_IN_IDENTIFICATION = 'REQUIREMENT_NOT_LINKED_IN_IDENTIFICATION';
  static REQ_IDENTIFICATION_JOBS_CONFLICT = "REQ_IDENTIFICATION_JOBS_CONFLICT";

  /**
   * A map of error constants to user-friendly error objects.
   */
  static errorMap = {
    [ReqIdentificationRequirementsErrors.NETWORK_ERROR]: {
      title: "Error de conexión",
      message:
        "Hubo un problema de red. Verifique su conexión a internet e intente nuevamente.",
    },
    [ReqIdentificationRequirementsErrors.UNAUTHORIZED]: {
      title: "Acceso no autorizado",
      message:
        "No tiene permisos para realizar esta acción. Verifique su sesión.",
    },
    [ReqIdentificationRequirementsErrors.SERVER_ERROR]: {
      title: "Error interno del servidor",
      message:
        "Hubo un error en el servidor. Espere un momento e intente nuevamente.",
    },
    [ReqIdentificationRequirementsErrors.VALIDATION_ERROR]: {
      title: "Error de validación",
      message:
        "Revisa los datos introducidos. Uno o más campos no son válidos.",
    },
    [ReqIdentificationRequirementsErrors.NOT_FOUND]: {
        title: "Recurso no encontrado",
        message:
            "El recurso no fue encontrado. Verifique su existencia recargando la app e intente de nuevo.",
    },
    [ReqIdentificationRequirementsErrors.MULTIPLE_NOT_FOUND]: {
        title: "Recursos no encontrados",
        message:
            "Uno o más recursos no fueron encontrados. Verifique su existencia recargando la app e intente de nuevo.",
    },
    [ReqIdentificationRequirementsErrors.CONFLICT]: {
      title: "Conflicto de datos",
      message:
        "Ocurrió un conflicto con la operación. Verifique la información e intente nuevamente.",
    },
    [ReqIdentificationRequirementsErrors.UNEXPECTED_ERROR]: {
      title: "Error inesperado",
      message:
        "Ocurrió un error inesperado. Por favor, intente nuevamente más tarde.",
    },
    [ReqIdentificationRequirementsErrors.REQ_IDENTIFICATION_NOT_FOUND]: {
      title: "Identificación de requerimientos no encontrada",
      message: "La identificación de requerimientos no fue encontrada. Verifique su existencia recargando la app e intente de nuevo.",
    },
    [ReqIdentificationRequirementsErrors.REQUIREMENT_NOT_FOUND]: {
      title: "Requerimiento no encontrado",
      message: "El requerimiento no fue encontrado. Verifique su existencia recargando la app e intente de nuevo.",
    },
    [ReqIdentificationRequirementsErrors.REQUIREMENT_TYPES_NOT_FOUND]: {
      title: "Tipos de requerimiento no encontrados",
      message: "Los tipos de requerimiento no fueron encontrados. Verifique su existencia recargando la app e intente de nuevo.",
    },
    [ReqIdentificationRequirementsErrors.LEGAL_VERBS_NOT_FOUND]: {
      title: "Verbos legales no encontrados",
      message: "Los verbos legales no fueron encontrados. Verifique su existencia recargando la app e intente de nuevo.",
    },
    [ReqIdentificationRequirementsErrors.REQUIREMENT_NAME_CONFLICT]: {
      title: "Conflicto de nombre de requerimiento",
      message: "Ya existe un requerimiento con el mismo nombre. Por favor, utiliza otro.",
    },
    [ReqIdentificationRequirementsErrors.REQUIREMENT_ALREADY_LINKED]: {
      title: "Requerimiento ya vinculado",
      message: "El requerimiento ya está vinculado a esta identificación. No se puede agregar nuevamente.",
    },
    [ReqIdentificationRequirementsErrors.REQUIREMENT_NOT_LINKED_IN_IDENTIFICATION]: {
      title: "Requerimiento no vinculado en la identificación",
      message: "El requerimiento no está vinculado a la identificación actual. Verifique su existencia recargando la app e intente de nuevo.",
    },
    [ReqIdentificationRequirementsErrors.REQ_IDENTIFICATION_JOBS_CONFLICT]: {
      title: "Conflicto con trabajos pendientes",
      message:
        "Este requerimiento no puede ser eliminado porque actualmente se están identificando requerimientos. Por favor, espere a que se complete la identificación e intente nuevamente.",
    },
  };

  /**
   * A map of specific error messages to their corresponding error constants.
   * @type {Object.<string, ReqIdentificationErrors>}
   */
    static ErrorMessagesMap = {
    'Network Error': ReqIdentificationRequirementsErrors.NETWORK_ERROR,
    'Requirement identification not found': ReqIdentificationRequirementsErrors.REQ_IDENTIFICATION_NOT_FOUND,
    'Requirement not found': ReqIdentificationRequirementsErrors.REQUIREMENT_NOT_FOUND,
    'Requirement types not found for IDs': ReqIdentificationRequirementsErrors.REQUIREMENT_TYPES_NOT_FOUND,
    'Legal verbs not found for IDs': ReqIdentificationRequirementsErrors.LEGAL_VERBS_NOT_FOUND,
    'Requirement name already exists in the requirement identification': ReqIdentificationRequirementsErrors.REQUIREMENT_NAME_CONFLICT,
    'Requirement is already linked to the requirement identification': ReqIdentificationRequirementsErrors.REQUIREMENT_ALREADY_LINKED,
    'Requirement is not linked to the requirement identification': ReqIdentificationRequirementsErrors.REQUIREMENT_NOT_LINKED_IN_IDENTIFICATION,
    'Cannot delete Requirement with pending Requirement Identification jobs' : ReqIdentificationRequirementsErrors.REQ_IDENTIFICATION_JOBS_CONFLICT,
    };


  /**
   * Handles errors by mapping error codes or messages to a user-friendly error object.
   *
   * @param {Object} params - Parameters for handling the error.
   * @param {number} params.code - The HTTP status code.
   * @param {string} [params.error] - The server error message.
   * @param {string} [params.httpError] - The HTTP error message.
   * @param {Array<string|number>} [params.items] - Optional parameter indicating the related items.
   * @returns {Object} - A user-friendly error object containing a title and message.
   */
  static handleError({ code, error, httpError, items }) {
     const message = error || httpError;
      if (message && ReqIdentificationRequirementsErrors.ErrorMessagesMap[message]) {
        const key = ReqIdentificationRequirementsErrors.ErrorMessagesMap[message];
        return ReqIdentificationRequirementsErrors.errorMap[key];
      }

    switch (code) {
      case 400:
        return ReqIdentificationRequirementsErrors.errorMap[
          ReqIdentificationRequirementsErrors.VALIDATION_ERROR
        ];
      case 401:
      case 403:
        return ReqIdentificationRequirementsErrors.errorMap[
          ReqIdentificationRequirementsErrors.UNAUTHORIZED
        ];
      case 404:
        if (items?.length > 0) {
          return items.length === 1
            ? ReqIdentificationRequirementsErrors.errorMap[
                ReqIdentificationRequirementsErrors.NOT_FOUND
              ]
            : ReqIdentificationRequirementsErrors.errorMap[
                ReqIdentificationRequirementsErrors.MULTIPLE_NOT_FOUND
              ];
        }
        return ReqIdentificationRequirementsErrors.errorMap[
          ReqIdentificationRequirementsErrors.MULTIPLE_NOT_FOUND
        ];
      case 409:
        return ReqIdentificationRequirementsErrors.errorMap[
          ReqIdentificationRequirementsErrors.CONFLICT
        ];
      case 500:
        return ReqIdentificationRequirementsErrors.errorMap[
          ReqIdentificationRequirementsErrors.SERVER_ERROR
        ];
      default:
        return ReqIdentificationRequirementsErrors.errorMap[
          ReqIdentificationRequirementsErrors.UNEXPECTED_ERROR
        ];
    }
  }
}

export default ReqIdentificationRequirementsErrors;
