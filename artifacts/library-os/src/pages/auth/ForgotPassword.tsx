import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Send } from "lucide-react";
import AuthLayout from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const schema = z.object({ email: z.string().email("Enter a valid email") });

export default function ForgotPassword() {
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  return (
    <AuthLayout>
      <div>
        <Link href="/login" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-7 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
        </Link>
        <h2 className="text-2xl font-bold text-foreground mb-1">Forgot your password?</h2>
        <p className="text-sm text-muted-foreground mb-7">Enter your email and we'll send you a reset link.</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => {})} className="space-y-4">
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <Label className="text-sm font-medium">Email address</Label>
                <FormControl>
                  <Input {...field} type="email" placeholder="you@library.com" className="h-10" data-testid="input-email" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )} />
            <Button type="submit" className="w-full h-10 gap-2" data-testid="button-send-reset">
              <Send className="w-4 h-4" /> Send reset link
            </Button>
          </form>
        </Form>
      </div>
    </AuthLayout>
  );
}
