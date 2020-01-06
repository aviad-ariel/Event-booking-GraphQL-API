exports.credentialCheck = toCheck => {
    if(!toCheck){
        throw new Error('Invalid Email/Password');
    }
}

exports.authenticationCheck = isAuth => {
    if(!isAuth){
        throw new Error('Unauthenticated')
    }
}

exports.authorizationCheck = isAuth => {
    if(!isAuth){
        throw new Error('Unauthorized')
    }
}

exports.duplicateCheck = isExist => {
    if(isExist){
        throw new Error('Email already exits')
    }
}