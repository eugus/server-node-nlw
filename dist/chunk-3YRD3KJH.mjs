import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/route/get-event-attendees.ts
import { z } from "zod";
async function getEventsAttendees(app) {
  app.withTypeProvider().get("/events/:eventId/attendees", {
    schema: {
      summary: "Get event attendees",
      tags: ["events"],
      params: z.object({
        eventId: z.string().uuid()
      }),
      querystring: z.object({
        query: z.string().nullish(),
        //nullish -> tanto undefid como null
        pageIndex: z.string().nullish().default("0").transform(Number)
      }),
      response: {
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
      }
    }
  }, async (request, reply) => {
    const { eventId } = request.params;
    const { pageIndex, query } = request.query;
    const attendees = await prisma.attendee.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        checkIn: {
          select: {
            createdAt: true
          }
        }
      },
      where: query ? {
        eventId,
        name: {
          contains: query
        }
      } : {
        eventId
      },
      take: 10,
      skip: pageIndex * 10,
      orderBy: {
        createdAt: "desc"
      }
    });
    return reply.status(200).send({
      attendees: attendees.map((attendees2) => {
        return {
          id: attendees2.id,
          name: attendees2.name,
          email: attendees2.email,
          createdAt: attendees2.createdAt,
          checkInAt: attendees2.checkIn?.createdAt ?? null
        };
      })
    });
  });
}

export {
  getEventsAttendees
};
