import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/route/register-for-event.ts
import { z } from "zod";
async function registerForEvent(app) {
  app.withTypeProvider().post("/events/:eventId/attendees", {
    schema: {
      summary: "Register an attendees",
      tags: ["attendees"],
      body: z.object({
        name: z.string().min(4),
        email: z.string().email()
      }),
      params: z.object({
        eventId: z.string().uuid()
      }),
      response: {
        201: z.object({
          attendeeId: z.number().optional(),
          message: z.string().optional()
        })
      }
    }
  }, async (request, reply) => {
    const { eventId } = request.params;
    const { name, email } = request.body;
    const attendeeFromEmail = await prisma.attendee.findUnique({
      where: {
        eventId_email: {
          email,
          eventId
        }
      }
    });
    if (attendeeFromEmail !== null) {
      return reply.status(409).send({
        message: "Participante j\xE1 cadastrado em um evento"
      });
    }
    const [event, amountOfAttendeesForEvent] = await Promise.all([
      prisma.event.findUnique({
        where: {
          id: eventId
        }
      }),
      prisma.attendee.count({
        where: {
          eventId
        }
      })
    ]);
    if (event?.maximumAttendees && amountOfAttendeesForEvent >= event.maximumAttendees) {
      return reply.status(409).send({
        message: "O n\xFAmero m\xE1ximo de participantes do evento foi atingido"
      });
    }
    const attendee = await prisma.attendee.create({
      data: {
        name,
        email,
        eventId
      }
    });
    return reply.status(201).send({ attendeeId: attendee.id });
  });
}

export {
  registerForEvent
};
