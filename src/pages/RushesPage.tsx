import { useMemo, useState } from "react"
import { Calendar, Download, Film, Search } from "lucide-react"
import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type DashboardOutletContext = {
  lang: "fr" | "en"
  data: {
    cloud?: {
      enabled: boolean
      retentionDaysWithoutCloud: number
    }
    rushes: Array<{
      id: string
      title: string
      studio: string
      studioId: string
      date: string
      status: "ready" | "processing"
    }>
  }
  format: {
    dateTime: (iso: string) => string
  }
}

export default function RushesPage() {
  const navigate = useNavigate()
  const { lang, data, format } = useOutletContext<DashboardOutletContext>()
  const [searchParams, setSearchParams] = useSearchParams()

  const [date, setDate] = useState<string>(searchParams.get("date") ?? "")
  const [studio, setStudio] = useState<string>(searchParams.get("studio") ?? "all")
  const [q, setQ] = useState<string>(searchParams.get("q") ?? "")

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase()
    return data.rushes.filter((r) => {
      const matchesStudio = studio === "all" ? true : r.studioId === studio
      const matchesDate = date ? r.date.slice(0, 10) === date : true
      const matchesQuery = query
        ? `${r.title} ${r.studio} ${r.status}`.toLowerCase().includes(query)
        : true
      return matchesStudio && matchesDate && matchesQuery
    })
  }, [data.rushes, date, q, studio])

  const applyFilters = () => {
    const next = new URLSearchParams()
    if (date) next.set("date", date)
    if (studio && studio !== "all") next.set("studio", studio)
    if (q.trim()) next.set("q", q.trim())
    setSearchParams(next, { replace: true })
  }

  const resetFilters = () => {
    setDate("")
    setStudio("all")
    setQ("")
    setSearchParams({}, { replace: true })
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {lang === "fr" ? "Rushes" : "Rushes"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {lang === "fr"
            ? "Exports, rushes et livrables — tout au même endroit."
            : "Exports, rushes and deliverables — in one place."}
        </p>
      </div>

      {data.cloud && !data.cloud.enabled ? (
        <Card className="rounded-3xl border-primary/30 bg-primary/5">
          <CardContent className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="text-sm font-semibold">
                {lang === "fr" ? "Conservation limitée" : "Limited retention"}
              </div>
              <div className="text-sm text-muted-foreground">
                {lang === "fr"
                  ? `Disponible ${data.cloud.retentionDaysWithoutCloud} jours. Pour conserver et prévisualiser dans le cloud, active Branddeo Cloud.`
                  : `Available for ${data.cloud.retentionDaysWithoutCloud} days. Enable Branddeo Cloud to keep and preview in the cloud.`}
              </div>
            </div>
            <Button className="rounded-full" size="sm" type="button" onClick={() => navigate("/cloud")}>
              {lang === "fr" ? "Découvrir le Cloud" : "Discover Cloud"}
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-3 md:grid-cols-[220px_220px_1fr]">
        <div className="relative">
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-9 pl-9"
            aria-label={lang === "fr" ? "Sélectionner une date" : "Pick a date"}
          />
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
            <Calendar className="size-4" />
          </div>
        </div>

        <Select value={studio} onValueChange={setStudio}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder={lang === "fr" ? "Tous les studios" : "All studios"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {lang === "fr" ? "Tous les studios" : "All studios"}
            </SelectItem>
            <SelectItem value="paris">Paris</SelectItem>
            <SelectItem value="lyon">Lyon</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={lang === "fr" ? "Rechercher un export…" : "Search a deliverable…"}
            className="h-9 pl-9"
          />
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
            <Search className="size-4" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" type="button" onClick={resetFilters} className="rounded-full">
          {lang === "fr" ? "Réinitialiser" : "Reset"}
        </Button>
        <Button size="sm" type="button" onClick={applyFilters} className="rounded-full">
          {lang === "fr" ? "Appliquer" : "Apply"}
        </Button>
      </div>

      {rows.length === 0 ? (
        <Card>
          <CardContent className="py-20">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="flex size-12 items-center justify-center rounded-3xl bg-muted">
                <Film className="size-6 text-muted-foreground" />
              </div>
              <div className="text-base font-semibold">
                {lang === "fr" ? "Aucun rush trouvé" : "No rush found"}
              </div>
              <div className="max-w-md text-sm text-muted-foreground">
                {lang === "fr"
                  ? "Essayez un autre filtre ou une autre recherche."
                  : "Try different filters or a new search."}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => (
            <Card key={r.id} className="rounded-3xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{r.title}</CardTitle>
                <div className="text-sm text-muted-foreground">{r.studio}</div>
              </CardHeader>
              <CardContent className="space-y-3 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {format.dateTime(r.date)}
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
                </div>

                <div className="grid gap-2">
                  <Badge variant="secondary" className="rounded-full">
                    {lang === "fr"
                      ? r.status === "ready"
                        ? "Prêt"
                        : "En traitement"
                      : r.status === "ready"
                        ? "Ready"
                        : "Processing"}
                  </Badge>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      className="w-full rounded-full"
                      onClick={() => navigate(`/rushes?q=${encodeURIComponent(r.title)}`)}
                    >
                      {lang === "fr" ? "Détails" : "Details"}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      type="button"
                      className="w-full rounded-full"
                      onClick={() => {
                        if (data.cloud?.enabled) {
                          navigate(
                            `/cloud?q=${encodeURIComponent(r.title)}&preview=${encodeURIComponent(r.id)}`
                          )
                        } else {
                          window.open(
                            "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                      }}
                    >
                      {data.cloud?.enabled ? (
                        lang === "fr" ? (
                          "Prévisualiser"
                        ) : (
                          "Preview"
                        )
                      ) : (
                        <>
                          <Download className="size-4" />
                          {lang === "fr" ? "Télécharger" : "Download"}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
