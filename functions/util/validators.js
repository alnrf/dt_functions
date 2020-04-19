const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(regEx)) return true;
    else return false;
}

const isEmpty = (string) => {
    if(string.trim() === '') return true;
    else return false;
}

exports.validateSignupData = (data) => {
    let errors = {};

    if(isEmpty(data.email)) {
        errors.email = 'Email não pode ser vazio'
    } else if(!isEmail(data.email)) {
        errors.email = 'Deve ser um email válido'
    }

    if(isEmpty(data.password)) errors.password = 'Senha não pode ser vazia'
    if(data.password !== data.confirmPassword) errors.confirmPassword = 'Senhas não são iguais'
    if(isEmpty(data.handle)) errors.handle = 'Não pode ser vazio'

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
};

exports.validateLoginData = (data) => {
    let errors = {};

    if(isEmpty(data.email)) errors.email = 'Não pode ser vazio';
    if(isEmpty(data.password)) errors.password = 'Não pode ser vazio';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
};