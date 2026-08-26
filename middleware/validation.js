// ==========================================
// Validation Middleware
// ==========================================

const Joi = require('joi');

/**
 * Joi validation schemas
 */
const schemas = {
    inventory: Joi.object({
        crop: Joi.string()
            .min(2)
            .max(50)
            .required()
            .messages({
                'string.empty': 'Crop name is required',
                'string.min': 'Crop name must be at least 2 characters',
                'string.max': 'Crop name cannot exceed 50 characters'
            }),

        price: Joi.number()
            .min(0.01)
            .max(10000)
            .required()
            .messages({
                'number.min': 'Price must be greater than 0',
                'number.max': 'Price cannot exceed 10,000'
            }),

        quantity: Joi.number()
            .integer()
            .min(1)
            .max(100000)
            .required()
            .messages({
                'number.min': 'Quantity must be at least 1',
                'number.max': 'Quantity cannot exceed 100,000'
            })
    }),

    user: Joi.object({
        username: Joi.string()
            .min(3)
            .max(30)
            .required()
            .messages({
                'string.empty': 'Username is required',
                'string.min': 'Username must be at least 3 characters',
                'string.max': 'Username cannot exceed 30 characters'
            }),

        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Please enter a valid email address'
            }),

        location: Joi.string()
            .min(2)
            .max(100)
            .required()
            .messages({
                'string.empty': 'Location is required',
                'string.min': 'Location must be at least 2 characters',
                'string.max': 'Location cannot exceed 100 characters'
            }),

        password: Joi.string()
            .min(6)
            .required()
            .messages({
                'string.min': 'Password must be at least 6 characters'
            })
    })
};

/**
 * Validate inventory data
 */
const validateInventory = (req, res, next) => {
    const { error } = schemas.inventory.validate(req.body);

    if (error) {
        req.flash('error', error.message);
        const redirectpath1 = res.locals.redirect || '/listings/farmers';
        return res.redirect(redirectpath1);
    }

    next();
};

/**
 * Validate user data
 */
const validateUser = (req, res, next) => {
    const { error } = schemas.user.validate(req.body);

    if (error) {
        req.flash('error', error.message);
        const redirectpath1 = res.locals.redirect || '/';
        return res.redirect(redirectpath1);
    }

    next();
};

module.exports = {
    validateInventory,
    validateUser,
    schemas
};