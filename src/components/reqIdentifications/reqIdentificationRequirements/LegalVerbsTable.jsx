import PropTypes from "prop-types";


/**
 * Renders a table displaying a list of legal verbs and their translations.
 *
 * @component
 * @param {Object} props
 * @param {Array} props.legalVerbs - An array of legal verb objects.
 * @returns {JSX.Element} A table of legal verbs and their translations, or a message if none are available.
 */
export default function LegalVerbsTable({ legalVerbs }) {
  if (!legalVerbs.length) return <p className="text-base text-gray-500">No hay verbos legales disponibles.</p>
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border rounded-md">
        <thead className="bg-gray-100 text-gray-500 text-left">
          <tr>
            <th className=" font-semibold text-sm px-3 py-2 border-b">Nombre</th>
            <th className=" font-semibold text-sm px-3 py-2 border-b">Traducción</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {legalVerbs.map(({ legalVerb, translation }, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-4 py-2">{legalVerb.name}</td>
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
      legalVerb: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        translation: PropTypes.string,
      }).isRequired,
      translation: PropTypes.string,
    })
  ).isRequired,
};