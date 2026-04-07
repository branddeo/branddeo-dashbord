import { useMemo, useState } from "react"
import { Calendar, CalendarDays, List, Search } from "lucide-react"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type DashboardOutletContext = {
  lang: "fr" | "en"
  data: {
    reservations: Array<{
      id: string
      studio: string
      studioId: string
      start: string
      end: string
      status: "confirmed" | "pending" | "cancelled"
    }>
  }
  format: {
    dateTime: (iso: string) => string
    timeRange: (startIso: string, endIso: string) => string
  }
}

export default function ReservationsPage() {
  const navigate = useNavigate()
  const { lang, data, format } = useOutletContext<DashboardOutletContext>()
  const [searchParams, setSearchParams] = useSearchParams()

  const [date, setDate] = useState<string>(searchParams.get("date") ?? "")
  const [studio, setStudio] = useState<string>(searchParams.get("studio") ?? "all")
  const [q, setQ] = useState<string>(searchParams.get("q") ?? "")
  const [view, setView] = useState<"list" | "calendar">(
    searchParams.get("view") === "calendar" ? "calendar" : "list"
  )

  const intent = searchParams.get("intent")

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase()
    return data.reservations.filter((r) => {
      const matchesStudio = studio === "all" ? true : r.studioId === studio
      const matchesDate = date ? r.start.slice(0, 10) === date : true
      const matchesQuery = query
        ? `${r.studio} ${r.status} ${r.start}`.toLowerCase().includes(query)
        : true
      return matchesStudio && matchesDate && matchesQuery
    })
  }, [data.reservations, date, q, studio])

  const applyFilters = () => {
    const next = new URLSearchParams()
    if (date) next.set("date", date)
    if (studio && studio !== "all") next.set("studio", studio)
    if (q.trim()) next.set("q", q.trim())
    if (view === "calendar") next.set("view", "calendar")
    setSearchParams(next, { replace: true })
  }

  const resetFilters = () => {
    setDate("")
    setStudio("all")
    setQ("")
    setView("list")
    setSearchParams({}, { replace: true })
  }

  const toggleView = () => {
    const nextView = view === "list" ? "calendar" : "list"
    setView(nextView)
    const next = new URLSearchParams(searchParams)
    if (nextView === "calendar") next.set("view", "calendar")
    else next.delete("view")
    setSearchParams(next, { replace: true })
  }

  const calendarDays = useMemo(() => {
    const byDay = new Map<string, typeof rows>()
    for (const r of rows) {
      const key = r.start.slice(0, 10)
      const list = byDay.get(key) ?? []
      list.push(r)
      byDay.set(key, list)
    }
    return Array.from(byDay.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([day, list]) => ({
        day,
        items: list.sort(
          (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
        ),
      }))
  }, [rows])

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {lang === "fr" ? "Réservations" : "Bookings"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {lang === "fr"
            ? "Gérez vos sessions et votre historique."
            : "Manage your sessions and history."}
        </p>
      </div>

      {intent === "book" ? (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="text-sm font-semibold">
                {lang === "fr" ? "Nouvelle session" : "New session"}
              </div>
              <div className="text-sm text-muted-foreground">
                {lang === "fr"
                  ? "Choisissez une date et un studio, puis validez."
                  : "Pick a date and a studio, then confirm."}
              </div>
            </div>
            <Button
              className="rounded-full"
              size="sm"
              type="button"
              onClick={() => navigate("/abonnement")}
            >
              {lang === "fr" ? "Voir les crédits" : "View credits"}
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
          <CardTitle className="text-base">{lang === "fr" ? "Filtres" : "Filters"}</CardTitle>
          <Button
            variant="outline"
            size="sm"
            type="button"
            className="rounded-full"
            onClick={toggleView}
          >
            {view === "list" ? (
              <>
                <CalendarDays className="size-4" />
                {lang === "fr" ? "Calendrier" : "Calendar"}
              </>
            ) : (
              <>
                <List className="size-4" />
                {lang === "fr" ? "Liste" : "List"}
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
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
                <SelectValue
                  placeholder={lang === "fr" ? "Tous les studios" : "All studios"}
                />
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
                placeholder={
                  lang === "fr"
                    ? "Rechercher une réservation…"
                    : "Search a booking…"
                }
                className="h-9 pl-9"
              />
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                <Search className="size-4" />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={resetFilters}>
              {lang === "fr" ? "Réinitialiser" : "Reset"}
            </Button>
            <Button size="sm" type="button" onClick={applyFilters}>
              {lang === "fr" ? "Appliquer" : "Apply"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-2xl border bg-background">
        {view === "calendar" ? (
          <div className="p-4">
            {calendarDays.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                {lang === "fr" ? "Aucun résultat." : "No results."}
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {calendarDays.map(({ day, items }) => (
                  <div key={day} className="rounded-3xl border p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Calendar className="size-4 text-primary" />
                      {day.split("-").reverse().join("/")}
                    </div>
                    <div className="mt-3 space-y-2">
                      {items.map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          className="flex w-full items-center justify-between gap-3 rounded-3xl border bg-background px-4 py-3 text-left text-sm transition-colors hover:bg-muted/40"
                        >
                          <div className="min-w-0">
                            <div className="truncate font-semibold">{r.studio}</div>
                            <div className="truncate text-xs text-muted-foreground">
                              {format.timeRange(r.start, r.end)}
                            </div>
                          </div>
                          <Badge variant="secondary" className="rounded-full">
                            {lang === "fr"
                              ? r.status === "confirmed"
                                ? "Confirmée"
                                : r.status === "pending"
                                  ? "En attente"
                                  : "Annulée"
                              : r.status === "confirmed"
                                ? "Confirmed"
                                : r.status === "pending"
                                  ? "Pending"
                                  : "Cancelled"}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{lang === "fr" ? "Studio" : "Studio"}</TableHead>
                <TableHead>{lang === "fr" ? "Date" : "Date"}</TableHead>
                <TableHead>{lang === "fr" ? "Créneau" : "Time"}</TableHead>
                <TableHead>{lang === "fr" ? "Statut" : "Status"}</TableHead>
                <TableHead className="text-right">
                  {lang === "fr" ? "Durée" : "Duration"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-12 text-center text-sm text-muted-foreground"
                  >
                    {lang === "fr" ? "Aucun résultat." : "No results."}
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r) => (
                  <TableRow key={r.id} className="cursor-pointer">
                    <TableCell className="font-medium">{r.studio}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format.dateTime(r.start)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format.timeRange(r.start, r.end)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="rounded-full">
                        {lang === "fr"
                          ? r.status === "confirmed"
                            ? "Confirmée"
                            : r.status === "pending"
                              ? "En attente"
                              : "Annulée"
                          : r.status === "confirmed"
                            ? "Confirmed"
                            : r.status === "pending"
                              ? "Pending"
                              : "Cancelled"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {(() => {
                        const minutes =
                          (new Date(r.end).getTime() - new Date(r.start).getTime()) /
                          60000
                        const h = Math.floor(minutes / 60)
                        const m = Math.round(minutes % 60)
                        return h > 0 ? `${h}h${m ? ` ${m}m` : ""}` : `${m}m`
                      })()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
