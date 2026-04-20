import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState<"idle" | "success">("idle")

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("success")
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
        <CardTitle className="text-center text-2xl">
          Connexion
        </CardTitle>
        <div className="text-center text-sm text-muted-foreground">
          Accédez à votre espace Branddeo.
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
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="password">Mot de passe</Label>
              <NavLink
                to="/auth/forgot-password"
                className="text-xs font-semibold text-primary underline-offset-4 hover:underline"
              >
                Mot de passe oublié ?
              </NavLink>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-3xl"
              placeholder="••••••••"
              required
            />
          </div>
          <Button className="h-11 w-full rounded-3xl" type="submit">
            Se connecter
          </Button>
        </form>

        {status === "success" ? (
          <div className="rounded-3xl border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
            Connexion réussie. Redirection…
          </div>
        ) : null}

        <div className="text-center text-sm text-muted-foreground">
          Pas de compte ?{" "}
          <NavLink
            to="/auth/register"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Créer un compte
          </NavLink>
        </div>
      </CardContent>
    </Card>
  )
}
