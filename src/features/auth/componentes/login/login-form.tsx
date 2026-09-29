'use client'

import {Controller,SubmitHandler,useForm,} from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'

import { Eye, EyeOff } from "lucide-react";
import {Field,FieldError,FieldLabel,FieldGroup} from "@/shared/components/ui/field";
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import Link from 'next/link'
import useLogin from '../../hooks/use-login'
import { loginSchema } from '../../schemes/login.schema'
import { LoginFields,} from "../../types/auth";
import { useState } from "react";
export default function LoginForm() {
    const {mutate: login,isPending,error} = useLogin()

  const [show, setShow] = useState(false);
const eyeToggle = (
    <button
      type="button"
      onClick={() => setShow((s) => !s)}
      className="text-gray-400 hover:text-gray-600"
    >
      {show ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  );;
  // form
const form = useForm<LoginFields>({
  resolver: zodResolver(loginSchema),
  defaultValues: {
    username: "",
    password: "",
  },
});

const onSubmit: SubmitHandler<LoginFields> = (values) => {
  login(values);
};

return (
  <form onSubmit={form.handleSubmit(onSubmit)}>
    {/* username */}
    <FieldGroup className="mt-2.5">
      <Controller
        name="username"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            {/* Label */}
            <FieldLabel htmlFor="username">
              Username
            </FieldLabel>

            {/* input */}
            <Input
              {...field}
              id="username"
              aria-invalid={fieldState.invalid}
              placeholder="use123"
              autoComplete="username"
            />

            {/* error */}
{fieldState.invalid && fieldState.error && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />
    </FieldGroup>

    {/* password */}
    <FieldGroup className="mt-4">
      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            {/* Label */}
            <FieldLabel htmlFor="password">
              Password
            </FieldLabel>

            {/* input */}
            <Input
             type={show ? "text" : "password"}
              {...field}
              id="password"
              aria-invalid={fieldState.invalid}
              placeholder="***********"
             
         
          
          endAdornment={eyeToggle}
              autoComplete="current-password"
            />

            {/* error */}
{fieldState.invalid && fieldState.error && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />
    </FieldGroup>



    {/* forget password */}

    <Link href="/forget-password" className=" mt-2.5 text-sm text-blue-600 font-medium flex justify-end">forget password?</Link>
    {/* submit feedback */}
    {error?.message && <p className="text-sm text-red-500 font-medium mt-2.5">{error?.message}</p>}
        

{/* Submit button */}

<Button
  type="submit"
  disabled={isPending || (form.formState.isSubmitted && !form.formState.isValid)}
  className="w-full mt-10 bg-blue-600"
>
  Login
</Button>



  </form>
)
}