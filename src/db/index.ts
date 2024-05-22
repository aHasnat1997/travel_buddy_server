import { PrismaClient } from "@prisma/client"

/**
 * Instance of Prisma Client.
 * @example const tableData = await prisma.tableName.findMany()
 */
const prisma = new PrismaClient();

export default prisma;