import PropTypes from "prop-types"

/**
 * Renders a table displaying a list of requirement types with their names and descriptions.
 *
 * @component
 * @param {Object} props
  * @param {Array} props.requirementTypes - An array of requirement type objects.
 * @returns {JSX.Element} The rendered table of requirement types, or a message if none are available.
 */
export default function RequirementTypesTable({ requirementTypes }) {
  if (!requirementTypes.length) return <p className="text-base text-gray-500">No hay tipos de requerimiento disponibles.</p>
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border rounded-md">
        <thead className="bg-gray-100 text-gray-500 text-left">
          <tr>
            <th className=" font-semibold text-sm px-3 py-2 border-b">Nombre</th>
          </tr>
        </thead>
        <tbody>
          {requirementTypes.map((type, idx) => (
            <tr key={idx} className="border-t">
              <td className="px-3 py-2">{type.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

RequirementTypesTable.propTypes = {
  requirementTypes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      classification: PropTypes.string
    })
  ).isRequired
}
