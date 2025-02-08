const { param, query, body } = require("express-validator");
const values = require("../../database/data/default-table-values");

const validateCategoryParam = () => {
  return param("category")
    .optional({ values: "falsy" })
    .trim()
    .customSanitizer((value) => decodeURIComponent(value))
    .customSanitizer((value) => value.replace(/[-_]/g, " "))
    .isAlpha("en-US", { ignore: " " })
    .withMessage("Category can only contain letters, spaces, underscore or hyphens");
};

const validatePageParam = () => {
  return param("page").isInt({ min: 1 }).toInt().withMessage("Page can only contain digits");
};

const validateSearchInput = () => {
  return [
    // string query
    query("q")
      .optional({ values: "falsy" })
      .trim()
      .customSanitizer((value) => decodeURIComponent(value))
      .isLength({ max: 80 })
      .withMessage("Search query can not be more than 80 characters")
      .customSanitizer((value) => value.replace(/[<%_>'"]/g, "")),

    // genres array
    query("g")
      .optional({ values: "falsy" })
      .trim()
      .customSanitizer((value) => decodeURIComponent(value))
      .isLength({ max: 40 })
      .customSanitizer((value) => value.replace(/_/g, " "))
      .customSanitizer((value) => value.split(",").map((genre) => genre.trim()))
      .custom((value) => {
        const isValid = value.every((genre) => values.genres.includes(genre));
        if (!isValid) {
          throw new Error("Invalid genre selected");
        }

        return true;
      })
      .withMessage("Invalid genre selected"),

    // years array
    query("y").optional({ values: "falsy" }).isInt().toInt().isLength({ max: 4 }),

    // status string
    query("s")
      .optional({ values: "falsy" })
      .trim()
      .customSanitizer((value) => decodeURIComponent(value))
      .isLength({ max: 20 })
      .isIn(values.statuses)
      .withMessage("Invalid status selected"),
  ];
};

// prettier-ignore
const validateCategoryAndTitleId = () => {
  return [
    body("categoryName")
      .trim()
      .isString()
      .withMessage("Category name must be a string")
      .isAlpha("en-US", { ignore: " -" })
      .withMessage("Category name can only contain letters, spaces, and hyphens"),

    body("titleId")
    .isInt()
    .withMessage("Title id must be an integer")
    .toInt(),
  ];
};

module.exports = { validateCategoryParam, validatePageParam, validateSearchInput, validateCategoryAndTitleId };
