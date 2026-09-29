'use client'
import { Button } from "@/shared/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import Link from "next/link";

interface Props {
  email: string;
  setEmail: (val: string) => void;
  onNext: () => void;
  error?: string;
  isLoading: boolean;
}

export function EmailStep({ email, setEmail, onNext, error, isLoading }: Props) {
  return (
    <div className="bg-white">
      <h3 className="font-mono text-gray-500">Don’t worry, we will help you recover your account.</h3>
      <FieldGroup className="mt-10">
        <Field data-invalid={!!error}>
          <FieldLabel>Email</FieldLabel>
          <Input
          required
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          {error && <FieldError errors={[{ message: error }]} />}
        </Field>
      </FieldGroup>
      <Button onClick={onNext} disabled={isLoading} className="w-full mt-10">
        {isLoading ? "Sending..." : "Next"}
      </Button>
    </div>
  );
}