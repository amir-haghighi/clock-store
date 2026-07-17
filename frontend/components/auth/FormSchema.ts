import z from "zod";
const baseSchema = z.object({
    name: z.string("required"),
    email: z.email(),
})
const passwordSchema = z.object({
    password: z.string("required").min(8, "password must contain at least 8 characters").refine((password) => {

        return /^(?=.*[!@#$%^&*])(?=.*[A-Z]).*$/.test(password)
    }, "Password must contain at least 1 special character and 1 uppercase letter"),
    passwordConfirm: z.string("Does not match the password !")

}).superRefine(
    (data, ctx) => {
        if (data.passwordConfirm !== data.password) {
            ctx.addIssue(
                {
                    code: "custom",
                    path: ["passwordConfirm"],
                    message: "The confirm password dose not match the password"
                }
            )
        }
    }

)

export const formSchema = baseSchema.and(passwordSchema)