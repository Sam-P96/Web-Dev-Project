const User = require("../models/userModel")

const getAllUser = (req, res) => {
    res.json(User.getAll());
};

const createNewUser = (req, res) => {
    const data = req.body
    
    const newUser = User.addOne(data)

    if (newUser.error) {
        res.status(400).json({message: newUser.error });
    } else {
        res.status(201).json(newUser);
    }
};

const findUserById = (req, res) => {
    const userId = req.params.userId;
    const user = User.findById(userId);

    if (!user) res.status(404).json({message: "User not found"});
    else res.json(user); 
};

const updateUserById = (req, res) => {
    const userId = req.params.userId;
    const user = User.findById(userId);
    const updatedData = req.body;

    if(!user) res.status(404).json({message: "User not found"});
    
    else {
        const updatedUser = User.updateById(userId, updatedData);
        res.json(updatedUser);
    }
}

const deleteUserById = (req, res) => {
    const userId = req.params.userId;
    const user = User.findById(userId);

    if (!user) res.status(404).json({message: "User not found "})
    
    else {
        const isDeleted = User.deleteById(userId);
        if (isDeleted) res.status(204).json({message: "Delete user successfully"})
    }
}

module.exports = {
    getAllUser,
    createNewUser,
    findUserById,
    updateUserById,
    deleteUserById
}