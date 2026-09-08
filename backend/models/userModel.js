//Data model
/*
{
    "full_name": "Mon",
    "phone_number": "0123456789",
    "email": "email@example.com",
    "username": "callmemon",
    "password": "1234",
    "date_of_birth": "2022-02-22"
    "role": "buyer"
    "account_verified": true,
}
*/

let userArray = [];
let nextId = 1;

const REQUIRED_FIELDS = [
    'full_name', 'phone_number', 'email', 'username', 'password', 'role'
];
const OPTIONAL_FIELDS = [
    'date_of_birth'
];
const ALLOWED_UPDATE_FIELDS = [
    'full_name', 'phone_number', 'email', 'password', 'date_of_birth', 'account_verified'
]
const SIGNUP_ROLES = ['seller', 'buyer'];

const getAll =() => {
    return userArray;
};

const addOne = (data) => {
    const missing = REQUIRED_FIELDS.filter(field => !data[field]);
    if (missing.length > 0) {
        return {error: `Missing required fields: ${missing.join(', ')}`};
    }

    //Block bad POST with role !SIGNUP_ROLES
    if (!SIGNUP_ROLES.includes(data.role)) {
        return {error: `Invalid role. Allowed ${SIGNUP_ROLES.join(', ')}`}
    }

    const newUser = {
        id: nextId++,
        full_name: data.full_name,
        email: data.email,
        username: data.username,
        password: data.password,
        phone_number: data.phone_number,
        date_of_birth: data.date_of_birth ?? null,
        role: data.role,
        account_verified: false,
    };

    userArray.push(newUser);
    return newUser;
}

const findById = (id) => {
    const user = userArray.find(user => user.id === Number(id));
    
    if (user) {
        return user
    } else {
        return false
    }
};

const updateById = (id, updatedData) => {
    const user = findById(id);

    if (!user) return false

    ALLOWED_UPDATE_FIELDS.forEach((field) => {
        if (updatedData[field]!== undefined) {
            user[field] = updatedData[field];
        }
    });

    return user;
}

const deleteById = (id) => {
    const user = findById(id);

    if (!user) return false

    userArray = userArray.filter((user) => {
        return user.id !== Number(id);
    });

    return true
}






module.exports = {
    addOne,
    getAll,
    findById,
    updateById,
    deleteById
}