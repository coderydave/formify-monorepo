import swaggerJsDoc from "swagger-jsdoc";

// Swagger alapkonfiguráció
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User API",
      version: "1.0.0",
      description: "API for managing users",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Az útvonalak helye
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export default swaggerDocs;
