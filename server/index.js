const express = require("express");
const { Client } = require("pg");
const cors = require("cors");
const app = express();
app.use(cors());
const port = 3000;

const connectionData = {
  user: "roketuser",
  host: "tarearoket.cv2quftjeoly.us-east-1.rds.amazonaws.com",
  database: "postgres",
  password: "roket2024",
  port: 5432,
};

// Endpoint para verificar la conexión
app.get("/verificar-conexion", (req, res) => {
  const client = new Client(connectionData);

  client
    .connect()
    .then(() => {
      res.send("Conexión a la base de datos establecida");
    })
    .catch((err) => {
      console.error("Error en la conexión a la base de datos:", err);
      res.status(500).send("Error en la conexión a la base de datos");
    })
    .finally(() => {
      client.end();
    });
});

app.get("/fotos", (req, res) => {
  const { arbolId } = req.query;

  if (!arbolId) {
    return res.status(400).send("El parámetro arbolId es requerido");
  }

  const client = new Client(connectionData);

  client
    .connect()
    .then(() => {
      return client.query(
        "SELECT arbol_id, url_foto FROM roket.fotos WHERE arbol_id = $1",
        [arbolId]
      );
    })
    .then((response) => {
      // Verifica si se encontraron fotos para el árbol específico
      if (response.rows.length === 0) {
        return res
          .status(404)
          .send("No se encontraron fotos para el árbol especificado");
      }

      // Devuelve la foto encontrada
      res.json(response.rows[0]);
    })
    .catch((err) => {
      console.error("Error en la consulta:", err);
      res.status(500).send("Error en la consulta a la base de datos");
    })
    .finally(() => {
      client.end();
    });
});

app.get("/ubicaciones/:arbolId", (req, res) => {
  const { arbolId } = req.params;

  if (!arbolId) {
    return res.status(400).send("El parámetro arbolId es requerido");
  }

  const client = new Client(connectionData);

  client
    .connect()
    .then(() => {
      return client.query(
        "SELECT * FROM roket.ubicaciones WHERE ubicacion_id = (SELECT ubicacion_id FROM roket.arboles WHERE arbol_id = $1)",
        [arbolId]
      );
    })
    .then((response) => {
      // Verifica si se encontraron ubicaciones para el arbolId específico
      if (response.rows.length === 0) {
        return res
          .status(404)
          .send("No se encontraron ubicaciones para el arbolId especificado");
      }

      // Devuelve la información de la ubicación encontrada
      res.json(response.rows[0]);
    })
    .catch((err) => {
      console.error("Error en la consulta:", err);
      res.status(500).send("Error en la consulta a la base de datos");
    })
    .finally(() => {
      client.end();
    });
});

app.get("/arboles", (req, res) => {
  const client = new Client(connectionData);

  client
    .connect()
    .then(() => {
      return client.query("select * from roket.arboles");
    })
    .then((response) => {
      res.json(response.rows);
    })
    .catch((err) => {
      console.error("Error en la consulta:", err);
      res.status(500).send("Error en la consulta a la base de datos");
    })
    .finally(() => {
      client.end();
    });
});

app.get("/arboles/:arbolId", (req, res) => {
  const { arbolId } = req.params;

  if (!arbolId) {
    return res.status(400).send("El parámetro arbolId es requerido");
  }

  const client = new Client(connectionData);

  client
    .connect()
    .then(() => {
      return client.query("SELECT * FROM roket.arboles WHERE arbol_id = $1", [
        arbolId,
      ]);
    })
    .then((response) => {
      // Verifica si se encontraron árboles para el arbolId específico
      if (response.rows.length === 0) {
        return res
          .status(404)
          .send("No se encontraron árboles para el arbolId especificado");
      }

      // Devuelve la información del árbol encontrado
      res.json(response.rows[0]);
    })
    .catch((err) => {
      console.error("Error en la consulta:", err);
      res.status(500).send("Error en la consulta a la base de datos");
    })
    .finally(() => {
      client.end();
    });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
