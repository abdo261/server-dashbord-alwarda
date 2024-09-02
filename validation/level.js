const Joi = require('joi');

const SchoolStadyEnum = ['COLLEGE', 'LYCEE', 'ECOLE_PRIMAIRE'];

const ValidateCreateLevel = (level) => {
    const schema = Joi.object({
        name: Joi.string()
            .trim()
            .min(2)
            .required()
            .regex(/^[a-zA-ZÀ-ÿ][a-z0-9A-ZÀ-ÿ\s'_’.-]*$/) 
            .messages({
                'string.empty': 'Le nom est requis.',
                'string.min': 'Le nom doit comporter au moins 3 caractères.',
                'string.pattern.base': 'Le nom peut contenir uniquement des lettres, des chiffres, des espaces, des apostrophes, des tirets, et des points.'
            }),
        type: Joi.string()
            .valid(...SchoolStadyEnum)
            .required()
            .messages({
                'string.empty': 'Le type est requis.',
                'any.only': 'Le type doit être l\'un des suivants : COLLEGE, LYCEE, ECOLE_PRIMAIRE.'
            })
    });

    const { error, value } = schema.validate(level, { abortEarly: false });

    return {
        error: error ? error.details.reduce((acc, err) => {
            const field = err.context.key;
            const message = err.message;
            
            if (!acc[field]) {
                acc[field] = [];
            }
            
            acc[field].push(message);
            
            return acc;
        }, {}) : null,
        data: value 
    };
};

module.exports = { ValidateCreateLevel };
