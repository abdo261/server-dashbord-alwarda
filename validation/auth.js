const Joi = require('joi')

const validateEmailAndPassword = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.empty": "L'email est requis.",
      "string.email": "L'email doit être une adresse email valide.",
    }),
    password: Joi.string()
      .min(8)

      .required()
      .messages({
        "string.empty": "Le mot de passe est requis.",
        "string.min": "Le mot de passe doit comporter au moins 8 caractères.",
        "string.max": "Le mot de passe ne peut pas dépasser 30 caractères.",
      }),
  });

  const { error, value } = schema.validate(data, { abortEarly: false });

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

module.exports = {validateEmailAndPassword}
