import PropTypes from "prop-types";


/**
 * Renders a table of legal verbs.
 *
 * @component
 * @param {Object[]} legalVerbs - Array of legal verb objects.
 * @param {string} legalVerbs[].verb - The verb itself (e.g., "Inspeccionar").
 * @param {string} legalVerbs[].translation - The translated version of the verb.
 * @param {string} [legalVerbs[].type] - Optional classification (e.g., "Acción", "Verificación").
 * @returns {JSX.Element|null} A styled table displaying legal verbs or null if empty.
 */
export default function LegalVerbsTable({ legalVerbs = [] }) {
  if (!legalVerbs.length) return <p className="text-base text-gray-500">No hay verbos legales disponibles.</p>
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border rounded-md">
        <thead className="bg-gray-100 text-gray-500 text-left">
          <tr>
            <th className=" font-semibold text-sm px-3 py-2 border-b">Nombre</th>
            <th className=" font-semibold text-sm px-3 py-2 border-b">Descripción</th>
            <th className=" font-semibold text-sm px-3 py-2 border-b">Traducción</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {legalVerbs.map(({ legalVerb, translation }, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-4 py-2">{legalVerb?.name}</td>
              <td className="px-4 py-2">{legalVerb?.description}</td>
              <td className="px-4 py-2">{translation}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}



LegalVerbsTable.propTypes = {
  legalVerbs: PropTypes.arrayOf(
    PropTypes.shape({
      verb: PropTypes.string.isRequired,
      translation: PropTypes.string.isRequired,
      type: PropTypes.string,
    })
  ).isRequired,
};
