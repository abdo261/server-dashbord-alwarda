const Joi = require('joi');

const ValidateCreateCentre = (centre) => {
    const schema = Joi.object({
        name: Joi.string()
            .trim()
            .min(3)  
            .required()
            .regex(/^[a-zA-ZÀ-ÿ][a-z0-9A-ZÀ-ÿ\s'_’-]*$/)  
            .messages({
                'string.empty': 'Le nom est requis.',
                'string.min': 'Le nom doit comporter au moins 1 caractère.', 
                'string.pattern.base': 'Le nom doit commencer par une lettre et ne peut contenir que des lettres, des accents, des espaces, des apostrophes, des tirets, et des underscores.'
            }),
        location: Joi.string()
            .trim()
            .min(3)  
            .required()
            .regex(/^[a-zA-ZÀ-ÿ][a-z0-9A-ZÀ-ÿ\s'_’.-]*$/)
            .messages({
                'string.empty': 'L\'emplacement est requis.',
                'string.min': 'L\'emplacement doit comporter au moins 1 caractère.',
                'string.pattern.base': 'L\'emplacement doit commencer par une lettre et ne peut contenir que des lettres, des accents, des espaces, des apostrophes, des tirets, et des underscores.'
            }),
        color: Joi.string()
            .trim()
            .required()
            .regex(/^#([0-9A-Fa-f]{3}){1,2}$|^rgba?\(\s*(\d{1,3}\s*,\s*){2}\d{1,3}\s*(,\s*(0|1|0?\.\d+))?\)$/) 
            .messages({
                'string.empty': 'La couleur est requise.',
                'string.pattern.base': 'La couleur doit être un code hexadécimal valide (par exemple, #FFF ou #FFFFFF) ou une valeur rgba (par exemple, rgba(255, 255, 255, 1)).'
            })
    });

    const { error, value } = schema.validate(centre, { abortEarly: false });

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

module.exports = { ValidateCreateCentre };
