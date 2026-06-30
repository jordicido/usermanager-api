import express, { Request, Response, NextFunction } from "express";


const app = express();
const PORT = 3000;

type User = {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

class AppError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode: number = 500, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

const users: User[] = [
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

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidBasicEmail(value: string): boolean {
  return value.includes("@") && value.includes(".");
}

function isEmailTaken(email: string, userIdToIgnore?: number): boolean {
  const normalizedEmail = normalizeEmail(email);

  return users.some(
    (user) => user.email === normalizedEmail && user.id !== userIdToIgnore
  );
}

app.use(express.json());

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
app.get("/api/users", (req, res, next) => {
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

app.get("/api/users/:id", (req, res, next) => {
  const idParam = req.params.id;
  const id = Number(idParam);

  if (Number.isNaN(id)) {
    return next(
      new AppError("El ID debe ser un número", 400, {
        received: idParam
      })
    );
  }

  const user = users.find((user) => user.id === id);

  if (!user) {
    return next(
      new AppError("Usuario no encontrado", 404, {
        id
      })
    );
  }

  return res.status(200).json({
    message: "Usuario encontrado",
    data: user,
  });
});

app.post("/api/users", (req, res, next) => {
  const { name, email, password } = req.body;

  if (!isNonEmptyString(name)) {
    return next(new AppError("El nombre debe ser un texto no vacío", 400));
  }

  if (!isNonEmptyString(email)) {
    return next(new AppError("El email debe ser un texto no vacío", 400));
  }

  if (!isNonEmptyString(password)) {
    return next(new AppError("La contraseña debe ser un texto no vacío", 400));
  }

  const cleanName = name.trim();
  const cleanEmail = normalizeEmail(email);
  const cleanPassword = password.trim();

  if (cleanPassword.length < 6) {
    return next(
      new AppError("La contraseña debe tener al menos 6 caracteres", 400)
    );
  }

  if (!isValidBasicEmail(cleanEmail)) {
    return next(new AppError("El email no tiene un formato válido", 400));
  }

  if (isEmailTaken(cleanEmail)) {
    return next(new AppError("El email ya está registrado", 409));
  }

  const newId =
    users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1;

  const newUser: User = {
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

app.patch("/api/users/:id", (req, res, next) => {
  const idParam = req.params.id;
  const id = Number(idParam);

  if (Number.isNaN(id)) {
    return next(
      new AppError("El ID debe ser un número", 400, {
        received: idParam,
      })
    );
  }

  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return next(
      new AppError("Usuario no encontrado", 404, {
        id,
      })
    );
  }

  const { name, email, isActive } = req.body;

  const hasChanges =
    name !== undefined || email !== undefined || isActive !== undefined;

  if (!hasChanges) {
    return next(
      new AppError("Debes enviar al menos un campo para actualizar", 400)
    );
  }

  let cleanName: string | undefined;

  if (name !== undefined) {
    if (!isNonEmptyString(name)) {
      return next(new AppError("El nombre debe ser un texto no vacío", 400));
    }

    cleanName = name.trim();
  }
  let cleanEmail: string | undefined;

  if (email !== undefined) {
    if (!isNonEmptyString(email)) {
      return next(new AppError("El email debe ser un texto no vacío", 400));
    }

    cleanEmail = normalizeEmail(email);

    if (!isValidBasicEmail(cleanEmail)) {
      return next(new AppError("El email no tiene un formato válido", 400));
    }

    if (isEmailTaken(cleanEmail, id)) {
      return next(new AppError("El email ya está registrado", 409));
    }
  }

  if (isActive !== undefined && !isBoolean(isActive)) {
    return next(new AppError("isActive debe ser true o false", 400));
  }
  const currentUser = users[userIndex];

  const updatedUser: User = {
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

app.delete("/api/users/:id", (req, res, next) => {
  const idParam = req.params.id;
  const id = Number(idParam);

  if (Number.isNaN(id)) {
    return next(
      new AppError("El ID debe ser un número", 400, {
        received: idParam,
      })
    );
  }

  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return next(
      new AppError("Usuario no encontrado", 404, {
        id,
      })
    );
  }

  const currentUser = users[userIndex];

  const updatedUser: User = {
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

function notFoundMiddleware(req: Request, res: Response, next: NextFunction) {
  next(
    new AppError("Ruta no encontrada", 404, {
      method: req.method,
      path: req.originalUrl
    })
  );
}

function errorMiddleware(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    error: err.message || "Error interno del servidor",
    statusCode,
    details: err.details,
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
}

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
