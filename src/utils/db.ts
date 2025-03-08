import { PrismaD1 } from '@prisma/adapter-d1'
import { PrismaClient, type User } from '@prisma/client'
import type { Bindings } from './bindings'

class Prisma {
  // private adapter: PrismaD1
  private prisma: PrismaClient

  constructor(env: Bindings) {
    const adapter = new PrismaD1(env.DB)
    this.prisma = new PrismaClient({ adapter })
  }

  get = async (discord_user_id: bigint): Promise<User> => {
    return await this.prisma.user.findUniqueOrThrow({ where: { id: discord_user_id.toLocaleString() } })
  }

  get_all = async (): Promise<User[]> => {
    return await this.prisma.user.findMany()
  }

  create = async (discord_user_id: bigint): Promise<User> => {
    return await this.prisma.user.create({ data: { id: discord_user_id.toLocaleString() } })
  }

  delete = async (discord_user_id: bigint): Promise<User> => {
    return await this.prisma.user.delete({ where: { id: discord_user_id.toLocaleString() } })
  }
}

export default Prisma
