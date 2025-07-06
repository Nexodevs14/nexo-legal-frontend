import PropTypes from "prop-types";
import { useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import update_icon from "../../../assets/actualizar.png";
import delete_icon from "../../../assets/eliminar.png";

/**
 * Renders a table of legal basis items, each expandable to show its articles.
 *
 * @component
 * @param {Object} props
 * @param {Array} props.legalBasis - An array of legal basis objects with nested articles.
 * @returns {JSX.Element} Rendered legal basis table with collapsible article sections.
 */
export default function LegalBasisTable({ legalBasis }) {
  const [showArticles, setShowArticles] = useState(null);

  const toggleExpand = (index) => {
    setShowArticles((prevIndex) => (prevIndex === index ? null : index));
  };

  if (!legalBasis.length) {
    return (
      <p className="text-base text-gray-500">
        No hay fundamentos legales disponibles.
      </p>
    );
  }

  return (
    <div className="w-full space-y-4">
      {legalBasis.map((item, index) => (
        <div
          key={item.legalBasis.id}
          className="border rounded-md shadow-sm bg-white"
        >
          <div
            className="flex items-center justify-between px-4 py-3 bg-gray-100 cursor-pointer hover:bg-gray-200"
            onClick={() => toggleExpand(index)}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-semibold text-gray-700">
                {item.legalBasis.legal_name}
              </span>
              <Button isIconOnly size="sm" variant="light" color="danger">
                ❌
              </Button>
            </div>
          </div>

          <Collapse in={showArticles === index} timeout="auto" unmountOnExit>
            <Box sx={{ padding: 2 }}>
              {item.articles?.length ? (
                <div className="overflow-x-auto space-y-2">
                  <p className="text-sm font-medium text-gray-600">
                    Artículos:
                  </p>
                  <table className="min-w-full text-sm border rounded">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="px-3 py-2 border-b text-left font-semibold">
                          Nombre
                        </th>
                        <th className="px-3 py-2 border-b text-left font-semibold">
                          Tipo
                        </th>
                        <th className="px-3 py-2 border-b text-left font-semibold">
                          Puntuación
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {item.articles.map(
                        ({ article, articleType, score }, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-3 py-2">
                              {article.article_name}
                            </td>
                            <td className="px-3 py-2">{articleType}</td>
                            <td className="px-3 py-2">
                              <div className="flex justify-between items-center">
                                <span>{score}</span>
                                <Dropdown>
                                  <DropdownTrigger>
                                    <Button
                                      isIconOnly
                                      size="sm"
                                      variant="light"
                                      color="primary"
                                    >
                                      <KeyboardArrowDownIcon fontSize="small" />
                                    </Button>
                                  </DropdownTrigger>
                                  <DropdownMenu aria-label="Opciones de artículo">
                                    <DropdownItem
                                      startContent={
                                        <img
                                          src={update_icon}
                                          alt="Editar"
                                          className="w-4 h-4"
                                        />
                                      }
                                    >
                                      <p className="font-normal text-primary">
                                        Editar artículo
                                      </p>
                                    </DropdownItem>
                                    <DropdownItem
                                      startContent={
                                        <img
                                          src={delete_icon}
                                          alt="Eliminar"
                                          className="w-4 h-4"
                                        />
                                      }
                                    >
                                      <p className="font-normal text-red">
                                        Eliminar artículo
                                      </p>
                                    </DropdownItem>
                                  </DropdownMenu>
                                </Dropdown>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>

                  <div className="flex justify-end mt-2">
                    <Button color="primary" variant="solid" size="sm">
                      Asociar nuevo artículo
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500">
                    No hay artículos disponibles.
                  </p>
                  <div className="flex justify-end mt-2">
                    <Button color="primary" variant="solid" size="sm">
                      Asociar nuevo artículo
                    </Button>
                  </div>
                </>
              )}
            </Box>
          </Collapse>
        </div>
      ))}
    </div>
  );
}

LegalBasisTable.propTypes = {
  legalBasis: PropTypes.arrayOf(
    PropTypes.shape({
      legalBasis: PropTypes.shape({
        id: PropTypes.number.isRequired,
        legal_name: PropTypes.string,
        abbreviation: PropTypes.string,
        classification: PropTypes.string,
        jurisdiction: PropTypes.string,
        state: PropTypes.string,
        municipality: PropTypes.string,
        subject: PropTypes.shape({
          subject_id: PropTypes.number,
          subject_name: PropTypes.string,
          abbreviation: PropTypes.string,
          order_index: PropTypes.number,
        }),
        aspects: PropTypes.arrayOf(
          PropTypes.shape({
            aspect_id: PropTypes.number.isRequired,
            aspect_name: PropTypes.string.isRequired,
            abbreviation: PropTypes.string,
            order_index: PropTypes.number,
          })
        ),
      }).isRequired,
      articles: PropTypes.arrayOf(
        PropTypes.shape({
          article: PropTypes.shape({
            id: PropTypes.number.isRequired,
            article_name: PropTypes.string.isRequired,
            article_order: PropTypes.number,
            description: PropTypes.string,
            plain_description: PropTypes.string,
            legal_basis_id: PropTypes.number,
          }).isRequired,
          articleType: PropTypes.string,
          score: PropTypes.number,
        })
      ),
    })
  ).isRequired,
};
