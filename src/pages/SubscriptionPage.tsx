import { useMemo } from "react"
import { BadgeCheck, Cloud, CreditCard, Sparkles } from "lucide-react"
import { useNavigate, useOutletContext } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type DashboardOutletContext = {
  lang: "fr" | "en"
  data: {
    cloud: {
      enabled: boolean
      storageGb: number
      priceEurMonthly: number
    }
    cards: Array<unknown>
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
  const { lang, data } = useOutletContext<DashboardOutletContext>()

  const offers = useMemo(
    () => [
      {
        hours: 1,
        ttc: 120,
        ht: 100,
        popular: false,
        features:
          lang === "fr"
            ? [
                "1 heure de tournage au studio",
                "Personnalisation à l'infini de votre espace de tournage",
                "Pré-montage (vidéo pouvant être publiée)",
                "Accompagnement sur place pour une session fluide",
                "Matériel audiovisuel de pointe (Caméra Sony, Micro Shure, etc)",
                "Livraison dès la fin du tournage",
              ]
            : [
                "1 hour shooting in the studio",
                "Unlimited set customization",
                "Pre-edit (ready to publish)",
                "On-site assistance for a smooth session",
                "Pro gear (Sony camera, Shure mic, etc.)",
                "Delivery right after shooting",
              ],
      },
      {
        hours: 2,
        ttc: 228,
        ht: 190,
        popular: true,
        features:
          lang === "fr"
            ? [
                "2 heures de tournage au studio",
                "Personnalisation à l'infini de votre espace de tournage",
                "Pré-montage (vidéo pouvant être publiée)",
                "Accompagnement sur place pour une session fluide",
                "Possibilité de produire un ou plusieurs contenus selon ton organisation",
                "Matériel audiovisuel de pointe (Caméra Sony, Micro Shure, etc)",
                "Livraison dès la fin du tournage",
              ]
            : [
                "2 hours shooting in the studio",
                "Unlimited set customization",
                "Pre-edit (ready to publish)",
                "On-site assistance for a smooth session",
                "Produce one or multiple pieces depending on your workflow",
                "Pro gear (Sony camera, Shure mic, etc.)",
                "Delivery right after shooting",
              ],
      },
      {
        hours: 3,
        ttc: 324,
        ht: 270,
        popular: false,
        features:
          lang === "fr"
            ? [
                "3 heures de tournage au studio",
                "Personnalisation à l'infini de votre espace de tournage",
                "Pré-montage (vidéo pouvant être publiée)",
                "Accompagnement sur place pour une session fluide",
                "Possibilité de produire un ou plusieurs contenus selon ton organisation",
                "Matériel audiovisuel de pointe (Caméra Sony, Micro Shure, etc)",
                "Livraison dès la fin du tournage",
              ]
            : [
                "3 hours shooting in the studio",
                "Unlimited set customization",
                "Pre-edit (ready to publish)",
                "On-site assistance for a smooth session",
                "Produce one or multiple pieces depending on your workflow",
                "Pro gear (Sony camera, Shure mic, etc.)",
                "Delivery right after shooting",
              ],
      },
    ],
    [lang]
  )

  const cloudIncluded = useMemo(
    () => [
      lang === "fr" ? "100 Go de stockage" : "100 GB storage",
      lang === "fr" ? "Prévisualisation des vidéos" : "Video preview",
      lang === "fr" ? "Conservation au-delà de 7 jours" : "Retention beyond 7 days",
      lang === "fr" ? "Accès multi-appareils" : "Multi-device access",
      lang === "fr" ? "Téléchargements rapides" : "Fast downloads",
    ],
    [lang]
  )

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {lang === "fr" ? "Abonnement" : "Subscription"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {lang === "fr"
            ? "Choisissez votre durée de tournage et vos options."
            : "Choose your shooting duration and options."}
        </p>
      </div>

      <div className="space-y-4">
        <div className="text-sm font-semibold">
          {lang === "fr" ? "Tournage" : "Shooting"}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <Card
              key={offer.hours}
              className={offer.popular ? "rounded-3xl border-primary/40" : "rounded-3xl"}
            >
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-base">
                    {lang === "fr"
                      ? `Tournage ${offer.hours}h`
                      : `${offer.hours}h shooting`}
                  </CardTitle>
                  {offer.popular ? (
                    <Badge className="rounded-full" variant="secondary">
                      {lang === "fr" ? "Populaire" : "Popular"}
                    </Badge>
                  ) : null}
                </div>
                <CardDescription className="flex items-baseline gap-2">
                  <span className="text-3xl font-semibold text-foreground tabular-nums">
                    {formatMoney(offer.ttc, lang)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {lang === "fr" ? "TTC" : "VAT incl."}
                  </span>
                </CardDescription>
                <div className="text-sm text-muted-foreground tabular-nums">
                  {formatMoney(offer.ht, lang)} {lang === "fr" ? "HT" : "VAT excl."}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {offer.features.map((f) => (
                    <div key={f} className="flex items-start gap-2 text-sm">
                      <div className="mt-0.5 flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <BadgeCheck className="size-3.5" />
                      </div>
                      <div className="text-muted-foreground">{f}</div>
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full rounded-full"
                  type="button"
                  onClick={() =>
                    navigate(`/reservations/book?duration=${offer.hours * 60}`)
                  }
                >
                  <Sparkles className="size-4" />
                  {lang === "fr" ? "Réserver" : "Book"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-sm font-semibold">Branddeo Cloud</div>
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
                      {lang === "fr" ? "Cloud" : "Cloud"}
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
                    {cloudIncluded.map((item) => (
                      <div key={item} className="flex items-start gap-2 text-sm">
                        <div className="mt-0.5 flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <BadgeCheck className="size-3.5" />
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
