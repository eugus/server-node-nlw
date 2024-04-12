import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { request } from "http";
import z from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function getAttendeesBadge(app: FastifyInstance){
  app
    .withTypeProvider<ZodTypeProvider>()
    .get("/attendees/:attendeeId/bagde",{
      schema:{
        summary: "Get an attendees bagde",
        tags: ["attendees"],
        params: z.object({
          attendeeId: z.coerce.number().int()
        }),
        response:{
          200: z.object({
            badge: z.object({
              name: z.string(),
              email: z.string(),
              eventTitle: z.string(),
              checkInUrl: z.string().url()
            })
          })

          
        }
      }
      
    }, async (request, reply) =>{
      const {attendeeId} = request.params
      console.log(attendeeId)

      const attendee =  await prisma.attendee.findUnique({
        select:{
          name: true,
          email: true,
          event:{
            select:{
              title: true,
            }
          }
        },
        where:{
          id: attendeeId,
        }
      })
      console.log(attendee)

      if(attendee === null){
        throw new BadRequest("attendee not found")
      }

      const baseUrl = `${request.protocol}://${request.hostname}`

      const checkInUrl = new URL(`/attendees/${attendeeId}/check-in`, baseUrl)
      console.log(baseUrl)
      
      return reply.status(200).send({
        badge:{
          name: attendee.name,
          email: attendee.email,
          eventTitle: attendee.event.title,
          checkInUrl: checkInUrl.toString()

      }})
    })
}