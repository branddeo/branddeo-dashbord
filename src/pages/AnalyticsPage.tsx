import { useMemo } from "react"
import { useOutletContext } from "react-router-dom"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type DashboardOutletContext = {
  lang: "fr" | "en"
  data: {
    reservations: Array<{ id: string; status: string }>
    rushes: Array<{ id: string; status: string }>
    cloud?: { enabled: boolean }
  }
}

export default function AnalyticsPage() {
  const { lang, data } = useOutletContext<DashboardOutletContext>()

  const stats = useMemo(() => {
    const totalReservations = data.reservations.length
    const confirmed = data.reservations.filter((r) => r.status === "confirmed").length
    const totalRushes = data.rushes.length
    const ready = data.rushes.filter((r) => r.status === "ready").length
    return { totalReservations, confirmed, totalRushes, ready }
  }, [data.reservations, data.rushes])

  const activity = useMemo(() => {
    const labels = lang === "fr"
      ? ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
      : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const sessions = [2, 1, 3, 0, 2, 4, 1]
    const exports = [1, 0, 2, 1, 1, 3, 2]
    const max = Math.max(...sessions, ...exports, 1)
    return { labels, sessions, exports, max }
  }, [lang])

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {lang === "fr" ? "Analytique" : "Analytics"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {lang === "fr"
            ? "Vue d’ensemble de votre activité."
            : "Overview of your activity."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              {lang === "fr" ? "Réservations" : "Bookings"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold tabular-nums">
            {stats.totalReservations}
          </CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              {lang === "fr" ? "Confirmées" : "Confirmed"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold tabular-nums">
            {stats.confirmed}
          </CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              {lang === "fr" ? "Rushes prêts" : "Ready rushes"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold tabular-nums">
            {stats.ready} / {stats.totalRushes}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-3xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">
              {lang === "fr" ? "Activité" : "Activity"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-3">
              {activity.labels.map((label, idx) => {
                const s = activity.sessions[idx] ?? 0
                const e = activity.exports[idx] ?? 0
                const sPct = Math.round((s / activity.max) * 100)
                const ePct = Math.round((e / activity.max) * 100)
                return (
                  <div key={label} className="flex flex-col items-center gap-2">
                    <div className="flex h-24 w-full items-end justify-center gap-1 rounded-2xl bg-muted/30 p-2">
                      <div
                        className="w-2 rounded-full bg-primary/70"
                        style={{ height: `${Math.max(6, sPct)}%` }}
                        aria-label="Sessions"
                      />
                      <div
                        className="w-2 rounded-full bg-foreground/25"
                        style={{ height: `${Math.max(6, ePct)}%` }}
                        aria-label="Exports"
                      />
                    </div>
                    <div className="text-[11px] font-semibold text-muted-foreground">
                      {label}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="inline-block size-2 rounded-full bg-primary/70" />
                {lang === "fr" ? "Sessions" : "Sessions"}
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block size-2 rounded-full bg-foreground/25" />
                {lang === "fr" ? "Exports" : "Exports"}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-base">
              {lang === "fr" ? "Cloud" : "Cloud"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-semibold tabular-nums">
              {data.cloud?.enabled ? "ON" : "OFF"}
            </div>
            <div className="text-sm text-muted-foreground">
              {data.cloud?.enabled
                ? lang === "fr"
                  ? "Branddeo Cloud est actif."
                  : "Branddeo Cloud is enabled."
                : lang === "fr"
                  ? "Branddeo Cloud est inactif."
                  : "Branddeo Cloud is disabled."}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
