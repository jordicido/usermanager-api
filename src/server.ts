import express from "express";

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

const users: User[] = [
  {
    id: 1,
    name: "Ana García",
    email: "ana@email.com",
    role: "USER",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Carlos Pérez",
    email: "carlos@email.com",
    role: "ADMIN",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "Laura Martínez",
    email: "laura@email.com",
    role: "USER",
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

app.use(express.json());

// Ruta base de la API
app.get("/", (req, res) => {
  res.json({
    message: "UserManager API"
  });
});

// Ruta para ver el estado de la API
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "UserManager API funcionando",
    timestamp: new Date().toISOString()
  });
});

// Rutas HTTP básicas de la API
app.get("/api/users", (req, res) => {
  res.status(200).json({
    message: "Listado de usuarios",
    total: users.length,
    data: users
  });
});

app.get("/api/users/active", (req, res) => {
  const activeUsers = users.filter((user) => user.isActive);

  res.status(200).json({
    message: "Listado de usuarios activos",
    total: activeUsers.length,
    data: activeUsers
  });
});

app.get("/api/users/:id", (req, res) => {
  const idParam = req.params.id;
  const id = Number(idParam);

  if (Number.isNaN(id)) {
    return res.status(400).json({
      error: "El ID debe ser un número",
      received: idParam
    });
  }

  const user = users.find((user) => user.id === id);

  if (!user) {
    return res.status(404).json({
      error: "Usuario no encontrado",
      id
    });
  }

  return res.status(200).json({
    message: "Usuario encontrado",
    data: user
  });
});

app.post("/api/users", (req, res) => {
  const userData = req.body;

  console.log("Body recibido en POST /api/users:", userData);

  res.status(201).json({
    message: "Usuario recibido para crear",
    data: userData
  });
});

app.patch("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  res.status(200).json({
    message: "Usuario recibido para actualizar",
    id: id,
    changes: changes
  });
});

app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;

  res.status(200).json({
    message: "Usuario recibido para eliminar o desactivar",
    id: id
  });
});

// Rutas de pruebas de params, head y body
app.post("/api/debug/body", (req, res) => {
  res.status(200).json({
    message: "Body recibido correctamente",
    body: req.body
  });
});

app.get("/api/debug/params/:id", (req, res) => {
  res.status(200).json({
    message: "Params recibidos correctamente",
    params: req.params
  });
});

app.get("/api/debug/query", (req, res) => {
  res.status(200).json({
    message: "Query params recibidos correctamente",
    query: req.query
  });
});

app.get("/api/debug/headers", (req, res) => {
  res.status(200).json({
    message: "Headers recibidos correctamente",
    headers: req.headers
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
    changes
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
    body: req.body
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
