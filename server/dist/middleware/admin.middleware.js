"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminCheck = void 0;
const adminCheck = (req, res, next) => {
    var _a;
    const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
    if (role === "admin") {
        next();
    }
    else {
        res.status(403).json({ message: "You are not authorized" });
        return;
    }
};
exports.adminCheck = adminCheck;
