import {
  registerForEvent
} from "./chunk-55WIM2OD.mjs";
import {
  errorHandler
} from "./chunk-DJN5NIW5.mjs";
import {
  checkIn
} from "./chunk-B27HBDOZ.mjs";
import {
  createEvent
} from "./chunk-OSG6ZWZ3.mjs";
import "./chunk-KDMJHR3Z.mjs";
import {
  getAttendeesBadge
} from "./chunk-RSRZYHDU.mjs";
import {
  getEventsAttendees
} from "./chunk-3YRD3KJH.mjs";
import {
  getEvents
} from "./chunk-JENEONVI.mjs";
import "./chunk-BSZRRSMZ.mjs";
import "./chunk-JV6GRE7Y.mjs";

// src/server.ts
import fastify from "fastify";
import z from "zod";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";
var app = fastify();
app.register(fastifyCors, {
  origin: "*"
  //qualquer front-end pode consumir minha api porque está em desenvolvimento
});
app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "pass.in",
      description: "Especifica\xE7\xF5es da API para o back-end da aplica\xE7\xE3o pass.in constru\xEDda durante o NLW Unite da Rocketseat.",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
});
app.register(fastifySwaggerUi, {
  routePrefix: "/docs"
});
app.setErrorHandler(errorHandler);
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(createEvent);
app.register(registerForEvent);
app.register(getEvents);
app.register(getAttendeesBadge);
app.register(checkIn);
app.register(getEventsAttendees);
app.withTypeProvider().get("/", {
  schema: {
    response: {
      200: z.string()
    }
  }
}, () => {
  return "Hello Luis, api node :)";
});
app.listen({ port: 3333, host: "0.0.0" }).then(() => {
  console.log("HTTP server running");
});
export {
  app
};
