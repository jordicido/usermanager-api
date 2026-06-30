"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 3000;
const users = [
    {
        id: 1,
        name: "Ana García",
        email: "ana@email.com",
        role: "USER",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 2,
        name: "Carlos Pérez",
        email: "carlos@email.com",
        role: "ADMIN",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 3,
        name: "Laura Martínez",
        email: "laura@email.com",
        role: "USER",
        isActive: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];
function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}
function isBoolean(value) {
    return typeof value === "boolean";
}
app.use(express_1.default.json());
// Ruta base de la API
app.get("/", (req, res) => {
    res.json({
        message: "UserManager API",
    });
});
// Ruta para ver el estado de la API
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "UserManager API funcionando",
        timestamp: new Date().toISOString(),
    });
});
// Rutas HTTP básicas de la API
app.get("/api/users", (req, res) => {
    res.status(200).json({
        message: "Listado de usuarios",
        total: users.length,
        data: users,
    });
});
app.get("/api/users/active", (req, res) => {
    const activeUsers = users.filter((user) => user.isActive);
    res.status(200).json({
        message: "Listado de usuarios activos",
        total: activeUsers.length,
        data: activeUsers,
    });
});
app.get("/api/users/:id", (req, res) => {
    const idParam = req.params.id;
    const id = Number(idParam);
    if (Number.isNaN(id)) {
        return res.status(400).json({
            error: "El ID debe ser un número",
            received: idParam,
        });
    }
    const user = users.find((user) => user.id === id);
    if (!user) {
        return res.status(404).json({
            error: "Usuario no encontrado",
            id,
        });
    }
    return res.status(200).json({
        message: "Usuario encontrado",
        data: user,
    });
});
app.post("/api/users", (req, res) => {
    const { name, email, password } = req.body;
    if (!isNonEmptyString(name)) {
        return res.status(400).json({
            error: "El nombre debe ser un texto no vacío",
        });
    }
    if (!isNonEmptyString(email)) {
        return res.status(400).json({
            error: "El email debe ser un texto no vacío",
        });
    }
    if (!isNonEmptyString(password)) {
        return res.status(400).json({
            error: "La contraseña debe ser un texto no vacío",
        });
    }
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    if (cleanPassword.length < 6) {
        return res.status(400).json({
            error: "La contraseña debe tener al menos 6 caracteres",
        });
    }
    if (!cleanEmail.includes("@")) {
        return res.status(400).json({
            error: "El email no tiene un formato válido",
        });
    }
    const existingUser = users.find((user) => user.email === cleanEmail);
    if (existingUser) {
        return res.status(409).json({
            error: "El email ya está registrado",
        });
    }
    const newId = users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1;
    const newUser = {
        id: newId,
        name: cleanName,
        email: cleanEmail,
        role: "USER",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    users.push(newUser);
    return res.status(201).json({
        message: "Usuario creado correctamente",
        data: newUser,
    });
});
app.patch("/api/users/:id", (req, res) => {
    const idParam = req.params.id;
    const id = Number(idParam);
    if (Number.isNaN(id)) {
        return res.status(400).json({
            error: "El ID debe ser un número",
            received: idParam,
        });
    }
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
        return res.status(404).json({
            error: "Usuario no encontrado",
            id,
        });
    }
    const { name, email, isActive } = req.body;
    const hasChanges = name !== undefined || email !== undefined || isActive !== undefined;
    if (!hasChanges) {
        return res.status(400).json({
            error: "Debes enviar al menos un campo para actualizar",
        });
    }
    let cleanName;
    if (name !== undefined) {
        if (!isNonEmptyString(name)) {
            return res.status(400).json({
                error: "El nombre debe ser un texto no vacío",
            });
        }
        cleanName = name.trim();
    }
    let cleanEmail;
    if (email !== undefined) {
        if (!isNonEmptyString(email)) {
            return res.status(400).json({
                error: "El email debe ser un texto no vacío",
            });
        }
        cleanEmail = email.trim().toLowerCase();
        if (!cleanEmail.includes("@")) {
            return res.status(400).json({
                error: "El email no tiene un formato válido",
            });
        }
        const emailAlreadyExists = users.some((user) => user.email === cleanEmail && user.id !== id);
        if (emailAlreadyExists) {
            return res.status(409).json({
                error: "El email ya está registrado",
            });
        }
    }
    if (isActive !== undefined && !isBoolean(isActive)) {
        return res.status(400).json({
            error: "isActive debe ser true o false",
        });
    }
    const currentUser = users[userIndex];
    const updatedUser = {
        ...currentUser,
        name: cleanName ?? currentUser.name,
        email: cleanEmail ?? currentUser.email,
        isActive: isActive ?? currentUser.isActive,
        updatedAt: new Date().toISOString(),
    };
    users[userIndex] = updatedUser;
    return res.status(200).json({
        message: "Usuario actualizado correctamente",
        data: updatedUser,
    });
});
app.delete("/api/users/:id", (req, res) => {
    const idParam = req.params.id;
    const id = Number(idParam);
    if (Number.isNaN(id)) {
        return res.status(400).json({
            error: "El ID debe ser un número",
            received: idParam,
        });
    }
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
        return res.status(404).json({
            error: "Usuario no encontrado",
            id,
        });
    }
    const currentUser = users[userIndex];
    const updatedUser = {
        ...currentUser,
        isActive: false,
        updatedAt: new Date().toISOString(),
    };
    users[userIndex] = updatedUser;
    return res.status(200).json({
        message: "Usuario desactivado correctamente",
        data: updatedUser,
    });
});
// Rutas de pruebas de params, head y body
app.post("/api/debug/body", (req, res) => {
    res.status(200).json({
        message: "Body recibido correctamente",
        body: req.body,
    });
});
app.get("/api/debug/params/:id", (req, res) => {
    res.status(200).json({
        message: "Params recibidos correctamente",
        params: req.params,
    });
});
app.get("/api/debug/query", (req, res) => {
    res.status(200).json({
        message: "Query params recibidos correctamente",
        query: req.query,
    });
});
app.get("/api/debug/headers", (req, res) => {
    res.status(200).json({
        message: "Headers recibidos correctamente",
        headers: req.headers,
    });
});
app.patch("/api/debug/users/:id", (req, res) => {
    const { id } = req.params;
    const { notify } = req.query;
    const authorization = req.headers.authorization;
    const changes = req.body;
    res.status(200).json({
        message: "Datos combinados recibidos",
        id,
        notify,
        authorization,
        changes,
    });
});
app.post("/api/debug/request", (req, res) => {
    res.status(200).json({
        message: "Información completa de la petición",
        method: req.method,
        path: req.path,
        params: req.params,
        query: req.query,
        headers: req.headers,
        body: req.body,
    });
});
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
