import jwt from "jsonwebtoken";
import * as User from "../models/userModel.js";
// imports all as User

// JWT payload only holds _id; role is re-read from DB in requireAuth
const generateToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// Same shape for signup + login so the frontend can store it as-is in localStorage "user"
const authResponse = (user) => ({
    _id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    token: generateToken(user._id)
});

// POST /api/users/signup
const signupUser = async (req, res) => {
    const user = await User.signup(req.body);

    if (user.error) {
        return res.status(400).json({ error: user.error });
    }
    res.status(201).json(authResponse(user));
};

// POST /api/users/login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.login(email, password);

    if (user.error) {
        return res.status(400).json({ error: user.error });
    }
    res.status(200).json(authResponse(user));
};

// GET /api/users/me (behind requireAuth)
const getMe = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
};

// Clients may only touch their own account; admin may touch any
const isSelfOrAdmin = (req, userId) => {
    return req.user.role === "admin" || req.user._id.toString() === userId;
};

const getAllUser = async (req, res) => {
    const getAllResponse = await User.getAll()
    res.json(getAllResponse);
};

const findUserById = async (req, res) => {
    const userId = req.params.userId;
    if (!isSelfOrAdmin(req, userId)) {
        return res.status(403).json({ error: "Forbidden" });
    }

    const user = await User.findById(userId);

    if (!user) res.status(404).json({ error: "User not found" });
    else res.json(user);
};

const updateUserById = async (req, res) => {
    const userId = req.params.userId;
    if (!isSelfOrAdmin(req, userId)) {
        return res.status(403).json({ error: "Forbidden" });
    }

    const user = await User.findById(userId);
    const updatedData = req.body;

    if (!user) return res.status(404).json({ error: "User not found" });

    const updatedUser = await User.updateById(userId, updatedData);
    if (updatedUser.error) {
        return res.status(400).json({ error: updatedUser.error });
    }
    res.json(updatedUser);
}

const deleteUserById = async (req, res) => {
    const userId = req.params.userId;
    if (!isSelfOrAdmin(req, userId)) {
        return res.status(403).json({ error: "Forbidden" });
    }

    const user = await User.findById(userId);

    if (!user) res.status(404).json({ error: "User not found" })

    else {
        const isDeleted = await User.deleteById(userId);
        if (isDeleted) res.status(200).json({ message: "Delete user successfully" })
        else res.status(500).json({ error: "Delete failed" });
    }
}

export {
  signupUser,
  loginUser,
  getMe,
  getAllUser,
  findUserById,
  updateUserById,
  deleteUserById
};
