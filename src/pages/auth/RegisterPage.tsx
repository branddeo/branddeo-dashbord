import { useState } from "react"
import { Globe } from "lucide-react"
import { NavLink, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState<"idle" | "sent">("idle")

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("sent")
    setTimeout(() => {
      navigate("/reservations/book", { replace: true })
    }, 400)
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
        <CardTitle className="text-center text-2xl">Créer un compte</CardTitle>
        <div className="text-center text-sm text-muted-foreground">
          Activez votre compte via un email de confirmation.
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <Button
          variant="outline"
          className="h-11 w-full rounded-3xl"
          type="button"
          onClick={() => navigate("/reservations/book", { replace: true })}
        >
          <Globe className="size-4" />
          Se connecter avec Google
        </Button>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <div className="text-xs font-semibold text-muted-foreground">ou</div>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstname">Prénom</Label>
              <Input
                id="firstname"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="h-11 rounded-3xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastname">Nom</Label>
              <Input
                id="lastname"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="h-11 rounded-3xl"
                required
              />
            </div>
          </div>
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
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-3xl"
              placeholder="••••••••"
              required
            />
          </div>
          <Button className="h-11 w-full rounded-3xl" type="submit">
            Créer le compte
          </Button>
        </form>

        {status === "sent" ? (
          <div className="rounded-3xl border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
            Email de confirmation envoyé. Redirection…
          </div>
        ) : null}

        <div className="text-center text-sm text-muted-foreground">
          Déjà inscrit ?{" "}
          <NavLink
            to="/auth/login"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Se connecter
          </NavLink>
        </div>
      </CardContent>
    </Card>
  )
}
