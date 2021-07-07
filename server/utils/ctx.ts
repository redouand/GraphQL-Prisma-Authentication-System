import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const contextCreator = ({ req })=>{
  return {
    token: req.headers?.token,
    prisma
  }
}

export default contextCreator