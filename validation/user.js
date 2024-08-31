const Joi = require("joi");

const ValidateCreateUser = (user) => {
  const schema = Joi.object({
    firstName: Joi.string()
      .trim()
      .min(3)
      .required()
      .regex(/^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ\s'-]*$/)
      .messages({
        "string.empty": "Le prénom est requis.",
        "string.min": "Le prénom doit comporter au moins 3 caractère.",
        "string.pattern.base":
          "Le prénom doit commencer par une lettre et ne peut contenir que des lettres, des accents, des espaces, des apostrophes et des tirets.",
      }),
    lastName: Joi.string()
      .trim()
      .min(3)
      .required()
      .regex(/^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ\s'-]*$/)
      .messages({
        "string.empty": "Le nom est requis.",
        "string.min": "Le nom doit comporter au moins 3 caractère.",
        "string.pattern.base":
          "Le nom doit commencer par une lettre et ne peut contenir que des lettres, des accents, des espaces, des apostrophes et des tirets.",
      }),
    email: Joi.string().trim().email().required().messages({
      "string.empty": "L'email est requis.",
      "string.email": "L'email doit être une adresse email valide.",
    }),
    password: Joi.string()
      .trim()
      .min(8)
      .required()
      // .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
      .messages({
        "string.empty": "Le mot de passe est requis.",
        "string.min": "Le mot de passe doit comporter au moins 8 caractères.",
        // 'string.pattern.base': 'Le mot de passe doit contenir au moins une lettre et un chiffre.'
      }),
    phone: Joi.string()
      .trim()
      .required()
      .regex(/^(\+212|0)([ \-]?\d){9}$/)
      .messages({
        "string.empty": "Le numéro de téléphone est requis.",
        "string.pattern.base":
          "Le numéro de téléphone doit être un numéro valide au Maroc, commençant par 0 suivi de 9 chiffres ou par +212 suivi de 9 chiffres.",
      }),
    centreId: Joi.number().required().integer().positive().messages({
      "number.base": "Le centre est requis.",
      "number.integer": "L'ID du centre doit être un entier.",
      "number.positive": "L'ID du centre doit être un nombre positif.",
    }),
  });

  const { error, value } = schema.validate(user, { abortEarly: false });

  return {
    error: error
      ? error.details.reduce((acc, err) => {
          const field = err.context.key;
          const message = err.message;

          if (!acc[field]) {
            acc[field] = [];
          }

          acc[field].push(message);

          return acc;
        }, {})
      : null,
    data: value,
  };
};
const ValidateUpdateUser = (user) => {
  const schema = Joi.object({
    firstName: Joi.string()
      .trim()
      .min(3)
      .required()
      .regex(/^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ\s'-]*$/)
      .messages({
        "string.empty": "Le prénom est requis.",
        "string.min": "Le prénom doit comporter au moins 3 caractère.",
        "string.pattern.base":
          "Le prénom doit commencer par une lettre et ne peut contenir que des lettres, des accents, des espaces, des apostrophes et des tirets.",
      }),
    lastName: Joi.string()
      .trim()
      .min(3)
      .required()
      .regex(/^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ\s'-]*$/)
      .messages({
        "string.empty": "Le nom est requis.",
        "string.min": "Le nom doit comporter au moins 3 caractère.",
        "string.pattern.base":
          "Le nom doit commencer par une lettre et ne peut contenir que des lettres, des accents, des espaces, des apostrophes et des tirets.",
      }),
    email: Joi.string().trim().email().required().messages({
      "string.empty": "L'email est requis.",
      "string.email": "L'email doit être une adresse email valide.",
    }),
    password: Joi.string()
    .trim()
    .min(8)
    .optional()
    .messages({
      "string.min": "Le mot de passe doit comporter au moins 8 caractères.",
    }),
    phone: Joi.string()
      .trim()
      .required()
      .regex(/^(\+212|0)([ \-]?\d){9}$/)
      .messages({
        "string.empty": "Le numéro de téléphone est requis.",
        "string.pattern.base":
          "Le numéro de téléphone doit être un numéro valide au Maroc, commençant par 0 suivi de 9 chiffres ou par +212 suivi de 9 chiffres.",
      }),
      centreId: Joi.number()
      .optional()
      .integer()
      .positive()
      .messages({
        "number.integer": "L'ID du centre doit être un entier.",
        "number.positive": "L'ID du centre doit être un nombre positif.",
      }),
  });

  const { error, value } = schema.validate(user, { abortEarly: false });

  return {
    error: error
      ? error.details.reduce((acc, err) => {
          const field = err.context.key;
          const message = err.message;

          if (!acc[field]) {
            acc[field] = [];
          }

          acc[field].push(message);

          return acc;
        }, {})
      : null,
    data: value,
  };
};

module.exports = { ValidateCreateUser, ValidateUpdateUser };
