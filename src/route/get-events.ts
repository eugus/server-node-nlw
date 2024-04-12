import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { request } from "http";
import {z} from "zod";
import { prisma } from "../lib/prisma";
import { title } from "process";
import { BadRequest } from "./_errors/bad-request";

export async function getEvents(app:FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get("/events/:eventId", {
    schema:{
      summary: "Get an event",
      tags: ["events"],
      params: z.object({
        eventId: z.string().uuid()
      }),
      response:{
        200: z.object(
          {
            event: z.object({
              id: z.string().uuid(),
              title: z.string(),
              details: z.string().nullable(),
              slug: z.string(),
              maximumAttendess: z.number().int().nullable(),
              attendeesAmount: z.number().int()
            })
          },
        )
      }
    }
  }, async (request, reply) =>{

    const {eventId} = request.params
    console.log(eventId)

    const event = await prisma.event.findUnique({
      select:{
        id: true,
        details: true,
        title: true,
        slug: true,
        maximumAttendees: true,
        _count:{
          select:{
            attendees: true
          }
        }
      },
      where:{
        id: eventId,

      }
    })

    if(event === null){
      throw new BadRequest("Event not found or not exists")
    }

    return reply.status(200).send({
      event:{
        id: event.id,
        title: event.title,
        slug: event.slug,
        maximumAttendess: event.maximumAttendees,
        details: event.details,
        attendeesAmount: event._count.attendees
    }})
  })
  
}