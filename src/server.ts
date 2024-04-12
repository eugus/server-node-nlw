import fastify from "fastify";

import z from "zod";
import { serializerCompiler, validatorCompiler,jsonSchemaTransform, ZodTypeProvider } from 'fastify-type-provider-zod'
import { createEvent } from "./route/create-event";
import { registerForEvent } from "./route/register-for-event";
import { getEvents } from "./route/get-events";
import { getAttendeesBadge } from "./route/get-attendees-badge";
import { checkIn } from "./route/check-in";
import { getEventsAttendees } from "./route/get-event-attendees";


import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { errorHandler } from "./erro-handler";
import fastifyCors from "@fastify/cors";
export const app = fastify()

app.register(fastifyCors, {
  origin: "*" //qualquer front-end pode consumir minha api porque está em desenvolvimento
})

app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: 'pass.in',
      description: 'Especificações da API para o back-end da aplicação pass.in construída durante o NLW Unite da Rocketseat.',
      version: '1.0.0'
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.setErrorHandler(errorHandler)

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent) // chamando a função para criar evento
app.register(registerForEvent)
app.register(getEvents)
app.register(getAttendeesBadge)
app.register(checkIn)
app.register(getEventsAttendees)

app.withTypeProvider<ZodTypeProvider>().get("/", {
  schema:{
    response:{
      200: z.string()
    }
  }
},() => {
  return "Hello Luis, api node :)"
})



app.listen({port: 3333, host: "0.0.0"}).then(() => {
  console.log("HTTP server running")
})