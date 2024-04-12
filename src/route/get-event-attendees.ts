import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { request } from "http";
import {z} from "zod";
import { prisma } from "../lib/prisma";
import { title } from "process";

export async function getEventsAttendees(app:FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get("/events/:eventId/attendees", {
    schema:{
      summary: "Get event attendees",
      tags: ["events"],
      params: z.object({
        eventId: z.string().uuid()
      }),
      querystring: z.object({
        query: z.string().nullish(), //nullish -> tanto undefid como null
        pageIndex: z.string().nullish().default("0").transform(Number)
      }),
      response:{
        200: z.object({
          attendees: z.array(
            z.object({
              id: z.number(),
              name: z.string(),
              email: z.string().email(),
              createdAt: z.date(),
              checkInAt: z.date().nullable()


            
            })
          )
        })
      },
        
    }
  }, async (request, reply) =>{

    const {eventId} = request.params
    const { pageIndex, query } = request.query 

    const attendees =  await prisma.attendee.findMany({
      select:{
        id: true,
        name: true,
        email: true,
        createdAt: true,
        checkIn:{
          select:{
            createdAt: true,
          }
        }

      },
      where: query? {
        eventId,
        name:{
          contains: query
        }
      }: {
        eventId,
      },
      take:10,
      skip: pageIndex * 10,
      orderBy:{
        createdAt: "desc",
      }
    })

    return reply.status(200).send({
      attendees: attendees.map(attendees =>{
        return{
          id: attendees.id,
          name: attendees.name,
          email: attendees.email,
          createdAt: attendees.createdAt,
          checkInAt: attendees.checkIn?.createdAt ?? null
        }
      })})
    
  })

  
}