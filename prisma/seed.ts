import { prisma } from "../src/lib/prisma"

async function seed() {

  await prisma.event.create({
    data:{
      id: "c6717e12-3a7e-4756-aaeb-d079c3cd1a1a",
      title: "Unite NLW",
      slug: "unite-nlw",
      details: "Evento Rocketseat",
      maximumAttendees: 120
    }
  })
  
}

seed().then(() =>{
  console.log("DataBase seeded")
  prisma.$disconnect()
})