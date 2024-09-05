const Joi = require("joi");

const ValidateCreateStudent = (student) => {
  const schema = Joi.object({
    firstName: Joi.string()
      .trim()
      .min(2)
      .required()
      .regex(/^[a-zA-Z À-ÿ]+$/)
      .messages({
        "string.empty": "Le prénom est requis.",
        "string.min": "Le prénom doit comporter au moins 2 caractère.",
        "string.pattern.base":
          "Le prénom ne doit contenir que des lettres et des accents.",
      }),
    lastName: Joi.string()
      .trim()
      .min(2)
      .required()
      .regex(/^[a-zA-Z À-ÿ]+$/)
      .messages({
        "string.empty": "Le nom de famille est requis.",
        "string.min": "Le nom de famille doit comporter au moins 2 caractère.",
        "string.pattern.base":
          "Le nom de famille ne doit contenir que des lettres et des accents.",
      }),
    phoneParent: Joi.string()
      .trim()
      .required()
      .regex(/^(\+212|0)([ \-]?\d){9}$/)
      .messages({
        "string.empty": "Le numéro de téléphone du parent est requis.",
        "string.pattern.base":
          "Le numéro de téléphone doit être un format valide (ex: +212 6 xxxxxxxx , ou bien : 06 xxxxxxxx ).",
      }),
    phone: Joi.string()
      .trim()
      .required()
      .regex(/^(\+212|0)([ \-]?\d){9}$/)
      .messages({
        "string.empty": "Le numéro de téléphone est requis.",
        "string.pattern.base":
          "Le numéro de téléphone doit être un format valide (ex: +212 6 xxxxxxxx , ou bien : 06 xxxxxxxx ).",
      }),
    sex: Joi.string().valid("HOMME", "FEMME").required().messages({
      "any.only": 'Le sexe doit être "HOMME" ou "FEMME".',
      "string.empty": "Le sexe est requis.",
    }),
    registrationDate: Joi.date().optional().messages({
      "date.base": "La date d'inscription doit être une date valide.",
    }),
    registredBy: Joi.number().integer().required().messages({
      "number.base":
        "L'ID de l'utilisateur inscrit doit être un nombre entier.",
      "any.required": "L'ID de l'utilisateur inscrit est requis.",
    }),
    levelId: Joi.number().integer().required().messages({
      "number.base": "L'ID du niveau doit être un nombre entier.",
      "any.required": "L'ID du niveau est requis.",
    }),
    centreId: Joi.number().integer().required().messages({
      "number.base": "L'ID du centre doit être un nombre entier.",
      "any.required": "L'ID du centre est requis.",
    }),
    subjectIds: Joi.array()
      .items(Joi.number().integer().required())
      .min(1)
      .required()
      .messages({
        "array.base": "Il doit y avoir au moins une matière sélectionnée.",
        "array.min": "Il doit y avoir au moins une matière sélectionnée.",
        "any.required": "Les matières sont requises. Il doit y avoir au moins une matière sélectionnée.",
        "number.base": "Il doit y avoir au moins une matière sélectionnée.",
      }),
  });

  const { error, value } = schema.validate(student, { abortEarly: false });

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

module.exports = { ValidateCreateStudent };
