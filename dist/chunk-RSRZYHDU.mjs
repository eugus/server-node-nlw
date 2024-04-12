import {
  BadRequest
} from "./chunk-BSZRRSMZ.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/route/get-attendees-badge.ts
import z from "zod";
async function getAttendeesBadge(app) {
  app.withTypeProvider().get("/attendees/:attendeeId/bagde", {
    schema: {
      summary: "Get an attendees bagde",
      tags: ["attendees"],
      params: z.object({
        attendeeId: z.coerce.number().int()
      }),
      response: {
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
  }, async (request, reply) => {
    const { attendeeId } = request.params;
    console.log(attendeeId);
    const attendee = await prisma.attendee.findUnique({
      select: {
        name: true,
        email: true,
        event: {
          select: {
            title: true
          }
        }
      },
      where: {
        id: attendeeId
      }
    });
    console.log(attendee);
    if (attendee === null) {
      throw new BadRequest("attendee not found");
    }
    const baseUrl = `${request.protocol}://${request.hostname}`;
    const checkInUrl = new URL(`/attendees/${attendeeId}/check-in`, baseUrl);
    console.log(baseUrl);
    return reply.status(200).send({
      badge: {
        name: attendee.name,
        email: attendee.email,
        eventTitle: attendee.event.title,
        checkInUrl: checkInUrl.toString()
      }
    });
  });
}

export {
  getAttendeesBadge
};
