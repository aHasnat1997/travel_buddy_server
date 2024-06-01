import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import config from '../config';

const prisma = new PrismaClient();

(async function main() {
  const hashedPassword = await bcrypt.hash(config.SUPER_ADMIN.PASS!, Number(config.BCRYPT_SALT_ROUNDS));

  await prisma.$transaction(async (tx) => {
    const user = await tx.users.upsert({
      where: { email: config.SUPER_ADMIN.EMAIL! },
      update: {},
      create: {
        name: 'Super Admin',
        email: config.SUPER_ADMIN.EMAIL!,
        password: hashedPassword,
        role: "SUPER_ADMIN"
      }
    });
    const userProfile = await tx.adminProfiles.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        age: 26,
        bio: '',
        address: '',
        profileImage: 'https://i.pinimg.com/originals/34/f2/50/34f250635ed02218356595ea6d730518.jpg'
      }
    });
    return { user, userProfile }
  });
})()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  });