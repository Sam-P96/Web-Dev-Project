import * as User from "../models/userModel.js";
// imports all as User

const getAllUser = async (req, res) => {
    const getAllResponse = await User.getAll()
    res.json(getAllResponse);
};

const createNewUser = async (req, res) => {
    const data = req.body
    
    const newUser = await User.addOne(data)

    if (newUser.error) {
        res.status(400).json({message: newUser.error });
    } else {
        res.status(201).json(newUser);
    }
};

const findUserById = async (req, res) => {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) res.status(404).json({message: "User not found"});
    else res.json(user); 
};

const updateUserById = async (req, res) => {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    const updatedData = req.body;

    if(!user) res.status(404).json({message: "User not found"});
    
    else {
        const  updatedUser = await User.updateById(userId, updatedData);
        res.json(updatedUser);
    }
}

const deleteUserById = async (req, res) => {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) res.status(404).json({message: "User not found "})
    
    else {
        const isDeleted = await User.deleteById(userId);
        if (isDeleted) res.status(200).json({message: "Delete user successfully"})
        else res.status(500).json({message: "Delete failed"}); 
    }
}

export {
  getAllUser,
  createNewUser,
  findUserById,
  updateUserById,
  deleteUserById
};