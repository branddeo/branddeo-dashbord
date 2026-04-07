import { useMemo, useState } from "react"
import { NavLink, useNavigate, useSearchParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ConfirmEmailPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = useMemo(() => searchParams.get("email") ?? "", [searchParams])
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams])
  const [status, setStatus] = useState<"idle" | "done">("idle")

  const onConfirm = () => {
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
          Confirmer votre email
        </CardTitle>
        <div className="text-center text-sm text-muted-foreground">
          {email ? (
            <>Email : <span className="font-semibold text-foreground">{email}</span></>
          ) : (
            "Validez votre adresse email pour activer le compte."
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-3xl border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
          {token
            ? "Lien de confirmation détecté."
            : "Simulation : cliquez sur Confirmer pour terminer."}
        </div>

        <Button className="h-11 w-full rounded-3xl" type="button" onClick={onConfirm}>
          Confirmer
        </Button>

        {status === "done" ? (
          <div className="rounded-3xl border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
            Email confirmé. Redirection…
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

