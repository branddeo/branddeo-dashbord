import { X } from "lucide-react"
import { useMemo, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.72 1.22 9.23 3.23l6.9-6.9C35.9 2.2 30.3 0 24 0 14.6 0 6.51 5.38 2.56 13.22l8.04 6.24C12.55 13.02 17.82 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.5 24.5c0-1.64-.15-3.22-.43-4.74H24v9h12.7c-.55 2.97-2.2 5.48-4.7 7.2l7.18 5.57C43.44 37.5 46.5 31.5 46.5 24.5z"
      />
      <path
        fill="#FBBC05"
        d="M10.6 28.54a14.5 14.5 0 0 1 0-9.08l-8.04-6.24A24 24 0 0 0 0 24c0 3.88.93 7.55 2.56 10.78l8.04-6.24z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.3 0 11.6-2.08 15.47-5.67l-7.18-5.57c-2 1.35-4.56 2.14-8.29 2.14-6.18 0-11.45-3.52-13.4-8.46l-8.04 6.24C6.51 42.62 14.6 48 24 48z"
      />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  )
}

export default function AuthLayout() {
  const navigate = useNavigate()
  const [oneTapOpen, setOneTapOpen] = useState(false)
  const lang = useMemo(() => (localStorage.getItem("branddeo.lang") === "en" ? "en" : "fr"), [])
  const googleEmail = "client@branddeoagency.fr"
  const googleName = "Compte Google"

  return (
    <div className="min-h-svh bg-muted/30">
      <div className="mx-auto w-full max-w-[1480px] px-4 py-6 md:px-6">
        <div className="flex items-center justify-between gap-3">
          <img src="/branddeo_logo.png" alt="Branddeo" className="h-8 w-auto" />
          <button
            type="button"
            onClick={() => setOneTapOpen(true)}
            className="flex items-center gap-3 rounded-full border bg-background px-3 py-2 text-left shadow-xs transition-colors hover:bg-muted/30"
          >
            <GoogleMark className="size-5" />
            <div className="hidden sm:block">
              <div className="text-sm font-semibold leading-none">{googleName}</div>
              <div className="text-xs text-muted-foreground">{googleEmail}</div>
            </div>
            <div className="sm:hidden text-sm font-semibold">
              {lang === "fr" ? "Google" : "Google"}
            </div>
          </button>
        </div>
      </div>

      <div className="mx-auto flex min-h-[calc(100svh-96px)] w-full max-w-[1480px] items-center justify-center px-4 pb-10 md:px-6">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>

      <Dialog open={oneTapOpen} onOpenChange={setOneTapOpen}>
        <DialogContent className="max-w-lg rounded-4xl p-0">
          <div className="relative p-8">
            <button
              type="button"
              onClick={() => setOneTapOpen(false)}
              className="absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-full bg-muted/40 text-muted-foreground transition-colors hover:bg-muted"
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-3">
              <GoogleMark className="size-7" />
              <div className="text-sm font-semibold">
                {lang === "fr" ? "Se connecter avec Google" : "Sign in with Google"}
              </div>
            </div>

            <div className="mt-6 text-3xl font-semibold leading-tight tracking-tight">
              {lang === "fr"
                ? "Connectez-vous à Branddeo avec votre compte Google"
                : "Sign in to Branddeo with your Google Account"}
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              {lang === "fr"
                ? "Plus besoin de mémoriser vos mots de passe. Connexion simple, rapide et sécurisée."
                : "No need to remember passwords. Simple, fast and secure sign-in."}
            </div>

            <div className="mt-7">
              <Button
                className="h-12 w-full rounded-3xl text-base"
                type="button"
                onClick={() => navigate("/reservations/book", { replace: true })}
              >
                {lang === "fr" ? "Continuer" : "Continue"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
