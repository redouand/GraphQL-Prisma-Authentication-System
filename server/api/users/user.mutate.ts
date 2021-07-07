import { validateLogin, validateSignUp } from '../../utils/middlewares'
import bcrypt from 'bcrypt'
import { sign } from 'jsonwebtoken'

const userMutattion = {
  signUp: validateSignUp(async(_parent, { email, name, password }, ctx)=>{
    const exists = await ctx.prisma.user.findUnique({
      where: { email },
      select: { email: true }
    })
    if(exists) return { __typename: "NormalErr", message: "Email already taken..." }
    const hashed = await bcrypt.hash(password, 10)
    const id = (await ctx.prisma.user.create({
      data: {
        email,
        name,
        password: hashed
      },
      select: {id: true}
    }))
    const token = await sign({ id }, 'thisisasecretcodemotherfucherr')
    return { __typename: "User", token }
  }),
  login: validateLogin(async(_parent, args, { id })=>{
    const token = await sign({ id }, 'thisisasecretcodemotherfucherr')
    return { __typename: "User", token }
  })
}
export { userMutattion as default }