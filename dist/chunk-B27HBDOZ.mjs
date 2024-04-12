import {
  BadRequest
} from "./chunk-BSZRRSMZ.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/route/check-in.ts
import z from "zod";
async function checkIn(app) {
  app.withTypeProvider().get("/attendees/:attendeeId/check-in", {
    schema: {
      summary: "Check in attendees",
      tags: ["check-in"],
      params: z.object({
        attendeeId: z.coerce.number().int()
      }),
      response: {
        201: z.object({
          attendeeId: z.number().int()
        })
      }
    }
  }, async (request, reply) => {
    const { attendeeId } = request.params;
    console.log(attendeeId);
    const attendeeCheckIn = await prisma.checkIn.findUnique({
      where: {
        attendeeId
      }
    });
    if (attendeeCheckIn !== null) {
      throw new BadRequest("Attendee already in checked in!");
    }
    await prisma.checkIn.create({
      data: {
        attendeeId
      }
    });
    return reply.status(201).send({ attendeeId });
  });
}

export {
  checkIn
};
