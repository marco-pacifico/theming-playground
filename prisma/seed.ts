import { PrismaClient } from '@prisma/client'
import { env } from 'node:process';
const bcrypt = require('bcrypt');

const prisma = new PrismaClient()

async function main() {

 const hashedPassword = await bcrypt.hash(env.ADMIN_PW, 10);
  const user = await prisma.user.create({
    data: {
      name: 'Marco',
      email: env.ADMIN_EMAIL as string,
      password: hashedPassword,
      themes: {
        create: {
          name: "Test Theme",
          brandColor: "#FF0000",
          neutralColor: "Mauve",
          radiusMode: "full",
          headingFont: "Roobert",
        },
      },
    },
  })
  console.log(user)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })