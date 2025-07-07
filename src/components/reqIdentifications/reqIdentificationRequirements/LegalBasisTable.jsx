import PropTypes from "prop-types";
import { useState } from "react";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Tooltip,
} from "@heroui/react";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import DescriptionModal from "../../requirements/TextArea/DescriptionModal";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import menu_icon from "../../../assets/aplicaciones.png";
import link_blue_icon from "../../../assets/enlace_blue.png";
import update_icon from "../../../assets/actualizar.png";
import watch_icon from "../../../assets/ver.png";
import delete_icon from "../../../assets/eliminar.png";

/**
 * LegalBasisTable
 *
 * Renders a table of legal basis items, each expandable to show its articles with dropdown actions.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.requirement - The requirement object associated with the legal basis.
 * @param {Array} props.legalBasis - An array of legal basis objects with nested articles.
 * @param {Function} props.handleDeleteLegalBasis - Callback function to handle deletion of a legal basis.
 * @param {Function} props.openCreateArticleModal - Callback to open the create article modal. 
* @returns {JSX.Element} Rendered table of legal basis.
 */
export default function LegalBasisTable({ requirement, legalBasis, handleDeleteLegalBasis, openCreateArticleModal }) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [descriptionData, setDescriptionData] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const toggleExpand = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  const openDescriptionModal = (description, title) => {
    setDescriptionData(description);
    setModalTitle(title);
    setShowDescriptionModal(true);
  };

  const closeDescriptionModal = () => {
    setDescriptionData("");
    setModalTitle("");
    setShowDescriptionModal(false);
  };

  if (!legalBasis.length) {
    return (
      <p className="text-sm text-gray-500 px-2 py-2">
        No hay fundamentos legales disponibles.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto mb-4">
      <table className="w-full text-sm border rounded">
        <thead className="bg-gray-100 text-gray-500">
          <tr>
            <th className="px-10 py-2 text-left font-semibold">Nombre</th>
            <th className="px-3 py-2 text-center font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {legalBasis.map((item, index) => (
            <>
              <tr
                key={item.legalBasis.id}
                className="hover:bg-gray-50 cursor-pointer border-b"
                onClick={() => toggleExpand(index)}
              >
                <td className="px-3 py-2 text-gray-700 font-medium">
                  <div className="flex items-center gap-2">
                    {expandedIndex === index ? (
                      <KeyboardArrowUpIcon className="text-gray-600" />
                    ) : (
                      <KeyboardArrowDownIcon className="text-gray-600" />
                    )}
                    {item.legalBasis.legal_name}
                  </div>
                </td>
                <td className="px-3 py-2">
                  <div className="relative flex items-center justify-center gap-2">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          variant="light"
                          color="primary"
                          size="sm"
                          isIconOnly
                          aria-label="Opciones"
                        >
                          <img src={menu_icon} alt="Menu" className="w-6 h-6" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Opciones de fundamento"
                        variant="light"
                      >
                        <DropdownItem
                          aria-label="Asociar Artículo"
                          startContent={
                            <img
                              src={link_blue_icon}
                              alt="Asociar"
                              className="w-4 h-4 flex-shrink-0"
                            />
                          }
                          className="hover:bg-primary/20"
                          key="associate-article"
                          onPress={() => openCreateArticleModal(requirement.id, item.legalBasis.id)}
                        >
                          <p className="font-normal text-primary">
                            Asociar Artículo
                          </p>
                        </DropdownItem>
                        <DropdownItem
                          aria-label="Eliminar Fundamento"
                          startContent={
                            <img
                              src={delete_icon}
                              alt="Eliminar"
                              className="w-4 h-4"
                            />
                          }
                          className="hover:bg-red/20"
                          onPress={() => handleDeleteLegalBasis(requirement.id, item.legalBasis.id)}
                        >
                          <p className="font-normal text-red">
                            Eliminar Fundamento
                          </p>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </td>
              </tr>

              <tr>
                <td colSpan={2} className="p-0">
                  <Collapse
                    in={expandedIndex === index}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Box sx={{ margin: 1 }}>
                      {item.articles?.length ? (
                        <table className="w-full text-sm border mt-2">
                          <thead className="bg-gray-100 text-gray-500">
                            <tr>
                              <th className="px-3 py-2 text-left font-semibold">Nombre</th>
                              <th className="px-3 py-2 text-left font-semibold">Tipo</th>
                              <th className="px-3 py-2 text-left font-semibold">
                                Puntuación
                              </th>
                              <th className="px-3 py-2 text-center font-semibold">
                                Descripción
                              </th>
                              <th className="px-3 py-2 text-center font-semibold">
                                Acciones
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
                                  <td className="px-10 py-2">
                                    <span>{score}</span>
                                  </td>
                                  <td className="px-3 py-2 text-center">
                                    <div className="flex justify-center items-center">
                                      <Tooltip content="Ver Descripción">
                                        <Button
                                          isIconOnly
                                          aria-label="Ver Descripción"
                                          color="primary"
                                          variant="light"
                                          onPress={() =>
                                            openDescriptionModal(
                                              article.description,
                                              article.article_name
                                            )
                                          }
                                        >
                                          <img
                                            src={watch_icon}
                                            alt="Ver"
                                            className="w-5 h-5"
                                          />
                                        </Button>
                                      </Tooltip>
                                    </div>
                                  </td>
                                  <td className="px-3 py-2">
                                    <div className="relative flex items-center justify-center gap-2">
                                      <Dropdown>
                                        <DropdownTrigger>
                                          <Button
                                            variant="light"
                                            color="primary"
                                            size="sm"
                                            isIconOnly
                                            aria-label="Opciones artículo"
                                          >
                                            <img
                                              src={menu_icon}
                                              alt="Menu"
                                              className="w-6 h-6"
                                            />
                                          </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu
                                          aria-label="Opciones artículo"
                                          variant="light"
                                        >
                                          <DropdownItem
                                            startContent={
                                              <img
                                                src={update_icon}
                                                alt="Editar"
                                                className="w-4 h-4"
                                              />
                                            }
                                            key="edit-article"
                                            className="hover:bg-primary/20"
                                          >
                                            <p className="font-normal text-primary">
                                              Editar Artículo
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
                                            key="delete-article"
                                            className="hover:bg-red/20"
                                          >
                                            <p className="font-normal text-red">
                                              Eliminar Artículo
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
                      ) : (
                        <p className="text-sm text-gray-500 px-2 py-2">
                          No hay artículos disponibles.
                        </p>
                      )}
                    </Box>
                  </Collapse>
                </td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
      <DescriptionModal
        isOpen={showDescriptionModal}
        onClose={closeDescriptionModal}
        title={modalTitle}
        description={descriptionData}
      />
    </div>
  );
}

LegalBasisTable.propTypes = {
  requirement: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    requirement_number: PropTypes.string,
    requirement_name: PropTypes.string,
    requirement_condition: PropTypes.string,
    evidence: PropTypes.string,
    periodicity: PropTypes.string,
    subject: PropTypes.shape({
      subject_name: PropTypes.string,
    }),
    aspects: PropTypes.arrayOf(
      PropTypes.shape({
        aspect_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        aspect_name: PropTypes.string.isRequired,
      })
    ),
    acceptance_criteria: PropTypes.string,
    mandatory_description: PropTypes.string,
    complementary_description: PropTypes.string,
    mandatory_sentences: PropTypes.string,
    complementary_sentences: PropTypes.string,
    mandatory_keywords: PropTypes.string,
    complementary_keywords: PropTypes.string,
  }).isRequired,
  legalBasis: PropTypes.arrayOf(
    PropTypes.shape({
      legalBasis: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        legal_name: PropTypes.string,
        abbreviation: PropTypes.string,
        classification: PropTypes.string,
        jurisdiction: PropTypes.string,
        state: PropTypes.string,
        municipality: PropTypes.string,
        last_reform: PropTypes.string,
        url: PropTypes.string,
        subject: PropTypes.shape({
          subject_name: PropTypes.string,
        }),
        aspects: PropTypes.arrayOf(
          PropTypes.shape({
            aspect_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
              .isRequired,
            aspect_name: PropTypes.string.isRequired,
          })
        ),
      }).isRequired,
      articles: PropTypes.arrayOf(
        PropTypes.shape({
          article: PropTypes.shape({
            id: PropTypes.number.isRequired,
            article_name: PropTypes.string.isRequired,
          }).isRequired,
          articleType: PropTypes.string,
          score: PropTypes.number,
        })
      ),
    })
  ).isRequired,
  handleDeleteLegalBasis: PropTypes.func.isRequired,
  openCreateArticleModal: PropTypes.func.isRequired
};
