import { useMemo, useState } from "react"
import { Check, Cloud, Coins, CreditCard } from "lucide-react"
import { useNavigate, useOutletContext } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"

type DashboardOutletContext = {
  lang: "fr" | "en"
  data: {
    credits: number
    cloud: {
      enabled: boolean
      storageGb: number
      priceEurMonthly: number
    }
    cards: Array<unknown>
  }
  actions: {
    addCredits: (amount: number) => void
  }
}

function formatMoney(amount: number, lang: "fr" | "en") {
  return new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-GB", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export default function SubscriptionPage() {
  const navigate = useNavigate()
  const { lang, data, actions } = useOutletContext<DashboardOutletContext>()
  const [creditPack, setCreditPack] = useState(500)

  const included = useMemo(
    () => [
      "Accès aux ressources Branddeo",
      "Livraison 48h ouvré",
      "Support prioritaire",
      "Rétroplanning et suivi",
      "Réduction sur vos prochains projets",
    ],
    []
  )

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {lang === "fr" ? "Abonnement" : "Subscription"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {lang === "fr"
            ? "Crédits, Branddeo Cloud et moyens de paiement."
            : "Credits, Branddeo Cloud and payment methods."}
        </p>
      </div>

      <div className="space-y-4">
        <div className="text-sm font-semibold">
          {lang === "fr" ? "Crédits" : "Credits"}
        </div>
        <Card>
          <CardContent className="space-y-5 py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <div className="text-sm font-semibold">
                  {lang === "fr" ? "Solde de crédits" : "Credit balance"}
                </div>
                <div className="text-4xl font-semibold tabular-nums">
                  {data.credits}
                </div>
                <div className="text-sm text-muted-foreground">
                  {lang === "fr"
                    ? "Les crédits ne sont pas mensuels : ils restent sur votre compte."
                    : "Credits are not monthly: they stay on your account."}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                type="button"
                className="rounded-full"
                onClick={() => navigate("/profil?tab=billing")}
              >
                <CreditCard className="size-4" />
                {lang === "fr" ? "Moyens de paiement" : "Payment methods"}
              </Button>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="font-semibold">
                  {lang === "fr" ? "Acheter des crédits" : "Buy credits"}
                </div>
                <div className="text-muted-foreground tabular-nums">
                  {creditPack} {lang === "fr" ? "crédits" : "credits"}
                </div>
              </div>
              <Slider
                min={100}
                max={2000}
                step={100}
                value={[creditPack]}
                onValueChange={(v) => setCreditPack(v[0] ?? 500)}
              />
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-muted-foreground">
                  {lang === "fr"
                    ? "Montant indicatif (mock) : interface UX, pas de traitement de paiement côté backend."
                    : "Indicative amount (mock): UX only, no payment processing on the backend."}
                </div>
                <Button
                  className="rounded-full"
                  size="sm"
                  type="button"
                  onClick={() => actions.addCredits(creditPack)}
                >
                  <Coins className="size-4" />
                  {lang === "fr" ? "Ajouter au solde" : "Add to balance"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="text-sm font-semibold">
          "Branddeo Cloud"
        </div>
        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>
                {lang === "fr" ? "Sauvegarde & prévisualisation" : "Backup & preview"}
              </CardTitle>
              <CardDescription>
                {lang === "fr"
                  ? "Conservez vos rushes au-delà de 7 jours et prévisualisez directement sur le cloud."
                  : "Keep rushes beyond 7 days and preview them directly from the cloud."}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              type="button"
              className="rounded-full"
              onClick={() => navigate("/cloud")}
            >
              {lang === "fr" ? "Ouvrir" : "Open"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-5">
            <Card className="border-muted">
              <CardContent className="space-y-5 py-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-semibold">
                      {lang === "fr" ? "Cloud (mock)" : "Cloud (mock)"}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-4xl font-semibold tabular-nums">
                        {formatMoney(data.cloud.priceEurMonthly, lang)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {lang === "fr" ? "/ mois" : "/ month"}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {data.cloud.storageGb} {lang === "fr" ? "Go" : "GB"}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="text-sm font-semibold">
                    {lang === "fr" ? "Inclus" : "Included"}
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {included.map((item) => (
                      <div key={item} className="flex items-start gap-2 text-sm">
                        <div className="mt-0.5 flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Check className="size-3.5" />
                        </div>
                        <div className="text-muted-foreground">{item}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full rounded-full"
                  type="button"
                  onClick={() => navigate("/cloud")}
                >
                  <Cloud className="size-4" />
                  {data.cloud.enabled
                    ? lang === "fr"
                      ? "Gérer Branddeo Cloud"
                      : "Manage Branddeo Cloud"
                    : lang === "fr"
                      ? "Découvrir Branddeo Cloud"
                      : "Discover Branddeo Cloud"}
                </Button>
              </CardContent>
            </Card>

            <div className="text-center text-xs text-muted-foreground">
              {lang === "fr" ? "Besoin de plus ?" : "Need more?"}{" "}
              <a
                href="https://branddeoagency.fr"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {lang === "fr" ? "Contactez Branddeo" : "Contact Branddeo"}
              </a>
              .
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="text-sm font-semibold">
          {lang === "fr" ? "Facturation" : "Billing"}
        </div>
        <Card>
          <CardContent className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-muted">
                <CreditCard className="size-5 text-muted-foreground" />
              </div>
              <div>
                <div className="text-sm font-semibold">
                  {lang === "fr" ? "Paiement et factures" : "Payments & invoices"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {lang === "fr"
                    ? "Mettez à jour votre mode de paiement et consultez vos factures."
                    : "Update your payment method and review invoices."}
                </div>
              </div>
            </div>
            <Button
              className="rounded-full"
              size="sm"
              type="button"
              onClick={() => navigate("/profil?tab=billing")}
            >
              {lang === "fr" ? "Gérer la facturation" : "Manage billing"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
