import zod from "zod";

const userSigninSchema = zod.object({
    emailOrUsername: zod.string(),
    password: zod.string()
});

const userSignupSchema = zod.object({
    name: zod.string(),
    email: zod.string().email(),
    username: zod.string().min(5).max(10),
    password: zod.string().min(8).max(16)
});;