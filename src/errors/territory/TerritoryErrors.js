/**
 * Class for managing and mapping errors related to territorial data services.
 * Centralizes error handling and maps raw messages to user-friendly messages.
 */
class TerritoryErrors {
  static UNEXPECTED_ERROR = "UNEXPECTED_ERROR";
  static FETCH_STATES_ERROR = "FETCH_STATES_ERROR";
  static FETCH_MUNICIPALITIES_ERROR = "FETCH_MUNICIPALITIES_ERROR";

  static errorMap = {
    [TerritoryErrors.UNEXPECTED_ERROR]: {
      title: "Error territorial",
      message:
        "Ocurrio un error inesperado al obtener la informacion territorial de Venezuela.",
    },
    [TerritoryErrors.FETCH_STATES_ERROR]: {
      title: "Error obteniendo estados",
      message:
        "Hubo un error al obtener los estados de Venezuela. Por favor, comuniquese con los administradores del sistema.",
    },
    [TerritoryErrors.FETCH_MUNICIPALITIES_ERROR]: {
      title: "Error obteniendo municipios",
      message:
        "Hubo un error al obtener los municipios del estado seleccionado. Por favor, comuniquese con los administradores del sistema.",
    },
  };

  static handleStateError() {
    return TerritoryErrors.errorMap[TerritoryErrors.FETCH_STATES_ERROR];
  }

  static handleMunicipalityError() {
    return TerritoryErrors.errorMap[TerritoryErrors.FETCH_MUNICIPALITIES_ERROR];
  }

  static handleUnexpectedError() {
    return TerritoryErrors.errorMap[TerritoryErrors.UNEXPECTED_ERROR];
  }
}

export default TerritoryErrors;
