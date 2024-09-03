const Joi = require("joi");

const ValidateCreateSubject = (subject) => {
  const schema = Joi.object({
    name: Joi.string()
      .trim()
      .min(1)
      .required()
      .regex(/^[a-zA-ZÀ-ÿ][a-z0-9A-ZÀ-ÿ\s'_’.-]*$/)
      .messages({
        "string.empty": "Le nom est requis.",
        "string.min": "Le nom doit comporter au moins 3 caractères.",
        "string.pattern.base":
          "Le nom peut contenir uniquement des lettres, des chiffres, des espaces, des apostrophes, des tirets, et des points.",
      }),
    pricePerMonth: Joi.number().greater(0).required().messages({
      "number.base": "Le prix par mois doit être un nombre.",
      "number.greater": "Le prix par mois doit être supérieur à 0.",
      "any.required": "Le prix par mois est requis.",
    }),
    levelId: Joi.number().integer().required().messages({
      // 'number.base': 'L\'ID du niveau doit être un nombre.',
      // 'number.integer': 'L\'ID du niveau doit être un entier.',
      "any.required": "L'ID du niveau est requis.",
    }),
  });

  const { error, value } = schema.validate(subject, { abortEarly: false });

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

module.exports = { ValidateCreateSubject };
