import { useMemo, useState } from "react"
import { Download, Film, Lock, Play } from "lucide-react"
import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

type DashboardOutletContext = {
  lang: "fr" | "en"
  data: {
    cloud: {
      enabled: boolean
      storageGb: number
      usedGb: number
      priceEurMonthly: number
      retentionDaysWithoutCloud: number
    }
    rushes: Array<{
      id: string
      title: string
      studio: string
      date: string
      status: "ready" | "processing"
    }>
  }
  actions: {
    setCloudEnabled: (enabled: boolean) => void
  }
  format: { dateTime: (iso: string) => string }
}

function formatEuro(amount: number, lang: "fr" | "en") {
  return new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-GB", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export default function CloudPage() {
  const navigate = useNavigate()
  const { lang, data, actions, format } = useOutletContext<DashboardOutletContext>()
  const [searchParams] = useSearchParams()
  const initialQ = searchParams.get("q") ?? ""
  const initialPreview = searchParams.get("preview")
  const [q, setQ] = useState(initialQ)
  const [previewId, setPreviewId] = useState<string | null>(initialPreview)

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return data.rushes
    return data.rushes.filter((r) =>
      `${r.title} ${r.studio}`.toLowerCase().includes(query)
    )
  }, [data.rushes, q])

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Branddeo Cloud</h1>
        <p className="text-sm text-muted-foreground">
          {lang === "fr"
            ? "Sauvegarde et prévisualisation des rushes."
            : "Backup and preview for rushes."}
        </p>
      </div>

      <Card className="rounded-3xl">
        <CardContent className="space-y-5 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="text-sm font-semibold">
                {lang === "fr" ? "Activer Branddeo Cloud" : "Enable Branddeo Cloud"}
              </div>
              <div className="text-sm text-muted-foreground">
                {lang === "fr"
                  ? `${formatEuro(data.cloud.priceEurMonthly, lang)} / mois • ${data.cloud.storageGb} Go`
                  : `${formatEuro(data.cloud.priceEurMonthly, lang)} / month • ${data.cloud.storageGb} GB`}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm font-medium text-muted-foreground">
                {data.cloud.enabled
                  ? lang === "fr"
                    ? "Actif"
                    : "On"
                  : lang === "fr"
                    ? "Inactif"
                    : "Off"}
              </div>
              <Switch
                checked={data.cloud.enabled}
                onCheckedChange={(v) => actions.setCloudEnabled(Boolean(v))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {!data.cloud.enabled ? (
        <Card className="rounded-3xl border-primary/30 bg-primary/5">
          <CardContent className="space-y-2 py-6 text-sm">
            <div className="font-semibold">
              {lang === "fr" ? "Avertissement" : "Warning"}
            </div>
            <div className="text-muted-foreground">
              {lang === "fr"
                ? `Sans Branddeo Cloud, les rushes restent disponibles ${data.cloud.retentionDaysWithoutCloud} jours. Pour conserver et prévisualiser sur le cloud, active Branddeo Cloud.`
                : `Without Branddeo Cloud, rushes are available for ${data.cloud.retentionDaysWithoutCloud} days. Enable Branddeo Cloud to keep and preview them in the cloud.`}
            </div>
            <div className="pt-2">
              <Button className="rounded-full" size="sm" type="button" onClick={() => actions.setCloudEnabled(true)}>
                {lang === "fr" ? "Activer Cloud" : "Enable Cloud"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card className="rounded-3xl">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">
            {lang === "fr" ? "Bibliothèque Cloud" : "Cloud library"}
          </CardTitle>
          <div className="w-full sm:w-[360px]">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={lang === "fr" ? "Rechercher une vidéo…" : "Search a video…"}
              className="h-10 rounded-3xl"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => {
              const isLocked = !data.cloud.enabled
              const isPreviewing = previewId === r.id
              return (
                <Card key={r.id} className="rounded-3xl">
                  <CardContent className="space-y-3 py-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{r.title}</div>
                        <div className="truncate text-xs text-muted-foreground">
                          {r.studio} • {format.dateTime(r.date)}
                        </div>
                      </div>
                      <Badge variant="secondary" className="rounded-full">
                        {lang === "fr"
                          ? r.status === "ready"
                            ? "Prêt"
                            : "En traitement"
                          : r.status === "ready"
                            ? "Ready"
                            : "Processing"}
                      </Badge>
                    </div>

                    <div className="rounded-3xl border bg-muted/20 p-3">
                      {isLocked ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Lock className="size-4" />
                          {lang === "fr"
                            ? "Prévisualisation disponible avec Branddeo Cloud."
                            : "Preview available with Branddeo Cloud."}
                        </div>
                      ) : isPreviewing ? (
                        <div className="space-y-2">
                          <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black/90">
                            <video className="h-full w-full object-cover" controls autoPlay muted>
                              <source
                                src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
                                type="video/mp4"
                              />
                            </video>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            className="w-full rounded-full"
                            onClick={() => setPreviewId(null)}
                          >
                            {lang === "fr" ? "Fermer" : "Close"}
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          className="w-full rounded-full"
                          onClick={() => setPreviewId(r.id)}
                        >
                          <Play className="size-4" />
                          {lang === "fr" ? "Prévisualiser" : "Preview"}
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        type="button"
                        className="flex-1 rounded-full"
                        onClick={() => navigate(`/rushes?q=${encodeURIComponent(r.title)}`)}
                      >
                        <Film className="size-4" />
                        {lang === "fr" ? "Voir dans Rushes" : "Open in Rushes"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        className="rounded-full"
                        onClick={() =>
                          window.open(
                            "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                      >
                        <Download className="size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
