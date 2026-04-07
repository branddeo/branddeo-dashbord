import { useMemo, useState } from "react"
import { NavLink, useNavigate, useSearchParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams])
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [status, setStatus] = useState<"idle" | "done">("idle")

  const canSubmit = token && password.length >= 8 && password === confirm

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setStatus("done")
    setTimeout(() => {
      navigate("/auth/login", { replace: true })
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
          Réinitialiser le mot de passe
        </CardTitle>
        <div className="text-center text-sm text-muted-foreground">
          Choisissez un nouveau mot de passe.
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {!token ? (
          <div className="rounded-3xl border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
            Lien invalide ou expiré.
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="password">Nouveau mot de passe</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-3xl"
              placeholder="Au moins 8 caractères"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirmer</Label>
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="h-11 rounded-3xl"
              placeholder="••••••••"
              required
            />
          </div>
          <Button className="h-11 w-full rounded-3xl" type="submit" disabled={!canSubmit}>
            Mettre à jour
          </Button>
        </form>

        {status === "done" ? (
          <div className="rounded-3xl border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
            Mot de passe mis à jour. Redirection…
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

