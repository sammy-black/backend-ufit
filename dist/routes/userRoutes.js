"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routes = (0, express_1.Router)();
routes.get('/', (_res, res, _next) => {
    res.status(200).json({
        message: 'success'
    });
});
exports.default = routes;
