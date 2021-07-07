import { compare } from "bcrypt";

export const guard =
  (next) =>
  (parent, args, { token }) => {
    if (!token)
      return {
        __typename: "Error",
        message: "You didn't provide a token",
        statusCode: 400,
      };
    return next(parent, args, { token });
  };

export const validateSignUp = (next) => (parent, args, ctx) => {
  const { email, password, name } = args;
  const errObj = {
    password: null,
    email: null,
    name: null,
  };
  if (!password) errObj.password = "Password field is required";
  if (!email) errObj.email = "email field is Required";
  if (!name) errObj.name = "name is required for sign up";
  if (Object.values(errObj).some((field) => field !== null))
    return {
      __typename: "ValidErr",
      error: errObj,
    };
  else return next(parent, args, ctx);
};

export const validateLogin = (next) => async (parent, args, ctx) => {
  const { email, password } = args;
  const errObj = { email: null, password: null };
  if (!email) errObj.email = "email field is required";
  if (!password) errObj.password = "password field is requierd";
  const dd = await ctx.prisma.user.findUnique({
    where: { email },
    select: { password: true, id: true },
  });
  if (!dd?.password)
    return {
      __typename: "ValidErr",
      error: { email: "no user by that email..." },
    };
  const isMatch = await compare(password, dd?.password);
  if (!isMatch) errObj.password = "password incorrect...";
  if (Object.values(errObj).some((field) => field !== null))
    return {
      __typename: "ValidErr",
      error: errObj,
    };
  ctx.id = dd?.id;
  return next(parent, args, ctx);
};
