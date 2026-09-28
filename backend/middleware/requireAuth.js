import jwt from "jsonwebtoken";
import * as User from "../models/userModel.js";

// Verify the JWT from "Authorization: Bearer <token>" and attach req.user = { _id, role }
const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: "Authorization token required" });
    }

    const token = authorization.split(" ")[1];

    try {
        const { _id } = jwt.verify(token, process.env.SECRET);

        // Token can still be valid after the user was deleted
        const user = await User.findAuthUserById(_id);
        if (!user) {
            return res.status(401).json({ error: "Request is not authorized" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error.message);
        res.status(401).json({ error: "Request is not authorized" });
    }
};

// Use after requireAuth: requireRole("worker", "admin")
// 403 (not 401): the user is logged in but not allowed
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Forbidden: insufficient role" });
        }
        next();
    };
};

export { requireAuth, requireRole };
