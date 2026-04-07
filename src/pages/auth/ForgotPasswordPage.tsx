import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "sent">("idle")

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("sent")
    setTimeout(() => {
      navigate("/auth/reset-password?token=demo-token", { replace: true })
    }, 500)
  }

  return (
    <Card className="rounded-4xl">
      <CardHeader className="space-y-2">
        <div className="flex justify-center">
          <img
            src="/branddeo_logo.png"
            alt="Branddeo"
            className="h-10 w-auto object-contain"
          />
        </div>
        <CardTitle className="text-center text-2xl">
          Mot de passe oublié
        </CardTitle>
        <div className="text-center text-sm text-muted-foreground">
          Recevez un lien pour réinitialiser votre mot de passe.
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-3xl"
              placeholder="contact@branddeoagency.fr"
              required
            />
          </div>
          <Button className="h-11 w-full rounded-3xl" type="submit">
            Envoyer le lien
          </Button>
        </form>

        {status === "sent" ? (
          <div className="rounded-3xl border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
            Lien envoyé (mock). Redirection…
          </div>
        ) : null}

        <div className="text-center text-sm text-muted-foreground">
          <NavLink
            to="/auth/login"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Retour à la connexion
          </NavLink>
        </div>
      </CardContent>
    </Card>
  )
}

