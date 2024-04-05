import fastify from "fastify";

import z from "zod";
import { PrismaClient} from '@prisma/client';
import { generateSlug } from "./utils/generate-slug";


const prisma = new PrismaClient({
  log: ["query"],
})

const app = fastify()


app.post("/events",  async(request, reply)=>{
  const createEventSchema = z.object({
    title: z.string().min(4),
    details: z.string().nullable(),
    maximumAttendees: z.number().int().positive().nullable()

  })

  const data = createEventSchema.parse(request.body) //validação dos dados


  const slug = generateSlug(data.title)

  const eventWithSameSlug = await prisma.event.findUnique({
    where: {
      slug,
    }
  })

  if(eventWithSameSlug !== null){
    throw new Error("Another event same title already exists")
  }

   const event = await prisma.event.create({
    data:{
      title: data.title,
      details: data.details,
      maximumAttendees: data.maximumAttendees,
      slug
    }
    
  })

  return reply.status(201).send({eventId : event})
})


app.get("/", () => {
  return "Hello Luis, api node :)"
})



app.listen({port: 3333}).then(() => {
  console.log("HTTP server running")
})