const Joi = require('joi');


const validate = function (body, schema) {
    return new Promise((resolve, reject) => {
        Joi.validate(body, schema, {
            abortEarly: false
        }, function (err, value) {

            if (err) {
                let errors = {}
                err.details.forEach(error =>{
                    const [key, value] = [error.context.key, error.message]
                    errors[key] = value
                })
                reject({ status_code: 400, message: errors });
            }
            else {
                resolve(value);
            }
        });
    });
}



module.exports = {
    validate
};
