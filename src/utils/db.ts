import { PrismaD1 } from '@prisma/adapter-d1'
import { PrismaClient, type User } from '@prisma/client'
import { HTTPException } from 'hono/http-exception'
import type { Bindings } from './bindings'

class Prisma {
  // private adapter: PrismaD1
  private prisma: PrismaClient

  constructor(env: Bindings) {
    const adapter = new PrismaD1(env.DB)
    this.prisma = new PrismaClient({ adapter })
  }

  get = async (discord_user_id: bigint): Promise<User> => {
    try {
      return await this.prisma.user.findUniqueOrThrow({ where: { id: discord_user_id.toString() } })
    } catch (e) {
      throw new HTTPException(404, { message: 'Not found' })
    }
  }

  get_all = async (): Promise<User[]> => {
    return await this.prisma.user.findMany()
  }

  create = async (discord_user_id: bigint): Promise<User> => {
    try {
      return await this.prisma.user.create({ data: { id: discord_user_id.toString() } })
    } catch (e) {
      throw new HTTPException(409, { message: 'Conflict' })
    }
  }

  delete = async (discord_user_id: bigint): Promise<User> => {
    return await this.prisma.user.delete({ where: { id: discord_user_id.toString() } })
  }
}

export default Prisma
