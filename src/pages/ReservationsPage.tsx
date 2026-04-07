import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom"
import {
  Calendar as BigCalendar,
  momentLocalizer,
  type NavigateAction,
  type ToolbarProps,
} from "react-big-calendar"
import moment from "moment"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

type DashboardOutletContext = {
  lang: "fr" | "en"
  data: {
    reservations: Array<{
      id: string
      studio: string
      start: string
      end: string
      status: "confirmed" | "pending" | "cancelled"
      offer?: {
        label: "Tournage 1h" | "Tournage 2h" | "Tournage 3h"
        ttc: number
        ht: number
        hours: 1 | 2 | 3
        popular?: boolean
        includes: string[]
      }
    }>
  }
  actions: {
    addReservation: (payload: {
      studio: string
      studioId: string
      start: string
      end: string
      status: "confirmed" | "pending" | "cancelled"
    }) => void
  }
}

type CalendarEvent = {
  title: string
  start: Date
  end: Date
  resource: {
    id: string
    status: "confirmed" | "pending" | "cancelled"
    studio: string
  }
}

const localizer = momentLocalizer(moment)

function getTodayYmd() {
  const today = new Date()
  const yyyy = String(today.getFullYear())
  const mm = String(today.getMonth() + 1).padStart(2, "0")
  const dd = String(today.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

function CalendarToolbar({
  label,
  onNavigate,
  lang,
}: ToolbarProps<CalendarEvent, CalendarEvent["resource"]> & { lang: "fr" | "en" }) {
  const nav = (action: NavigateAction) => onNavigate(action)
  return (
    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          type="button"
          className="rounded-full"
          onClick={() => nav("PREV")}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          type="button"
          className="rounded-full"
          onClick={() => nav("NEXT")}
        >
          <ChevronRight className="size-4" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          type="button"
          className="rounded-full"
          onClick={() => nav("TODAY")}
        >
          {lang === "fr" ? "Aujourd’hui" : "Today"}
        </Button>
      </div>

      <div className="text-lg font-semibold tracking-tight">{label}</div>
    </div>
  )
}

export default function ReservationsPage() {
  const navigate = useNavigate()
  const { lang, data, actions } = useOutletContext<DashboardOutletContext>()
  const [searchParams] = useSearchParams()
  const [calendarDate, setCalendarDate] = useState<Date>(() => new Date())
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedReservationId, setSelectedReservationId] = useState<string | null>(
    null
  )

  const intent = searchParams.get("intent")
  const durationFromQuery = Number(searchParams.get("duration") ?? "")
  const initialDuration =
    Number.isFinite(durationFromQuery) && durationFromQuery > 0
      ? Math.min(240, Math.max(30, durationFromQuery))
      : 90
  const [bookOpen, setBookOpen] = useState(intent === "book")
  const [bookDate, setBookDate] = useState<string>(() => getTodayYmd())
  const [bookTime, setBookTime] = useState<string>("10:00")
  const [durationMinutes, setDurationMinutes] = useState<number>(initialDuration)

  useEffect(() => {
    moment.locale(lang === "fr" ? "fr" : "en-gb")
  }, [lang])

  const selectedReservation = useMemo(() => {
    if (!selectedReservationId) return null
    return data.reservations.find((r) => r.id === selectedReservationId) ?? null
  }, [data.reservations, selectedReservationId])

  const defaultIncludes = useMemo(
    () =>
      lang === "fr"
        ? [
            "Personnalisation à l'infini de votre espace de tournage",
            "Pré-montage (vidéo pouvant être publiée)",
            "Accompagnement sur place pour une session fluide",
            "Matériel audiovisuel de pointe (Caméra Sony, Micro Shure, etc)",
            "Livraison dès la fin du tournage",
          ]
        : [
            "Unlimited set customization",
            "Pre-edit (ready to publish)",
            "On-site assistance for a smooth session",
            "Pro gear (Sony camera, Shure mic, etc.)",
            "Delivery right after shooting",
          ],
    [lang]
  )

  const events = useMemo<CalendarEvent[]>(
    () =>
      data.reservations.map((r) => ({
        title: (() => {
          const start = new Date(r.start)
          const end = new Date(r.end)
          const time = `${moment(start).format(lang === "fr" ? "HH:mm" : "h:mm A")}–${moment(end).format(
            lang === "fr" ? "HH:mm" : "h:mm A"
          )}`
          const status =
            lang === "fr"
              ? r.status === "confirmed"
                ? "Confirmée"
                : r.status === "pending"
                  ? "En attente"
                  : "Annulée"
              : r.status === "confirmed"
                ? "Confirmed"
                : r.status === "pending"
                  ? "Pending"
                  : "Cancelled"
          return `${time} · ${status}`
        })(),
        start: new Date(r.start),
        end: new Date(r.end),
        resource: { id: r.id, status: r.status, studio: r.studio },
      })),
    [data.reservations, lang]
  )

  const createReservation = () => {
    if (!bookDate || !bookTime) return
    const startLocal = new Date(`${bookDate}T${bookTime}:00`)
    const endLocal = new Date(startLocal.getTime() + durationMinutes * 60000)
    actions.addReservation({
      studio: "Studio Branddeo",
      studioId: "branddeo",
      start: startLocal.toISOString(),
      end: endLocal.toISOString(),
      status: "pending",
    })
    setBookOpen(false)
    navigate("/reservations", { replace: true })
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="space-y-1">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
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
          <Sheet open={bookOpen} onOpenChange={setBookOpen}>
            <SheetTrigger asChild>
              <Button className="rounded-full" type="button">
                {lang === "fr" ? "Réserver une session" : "Book a session"}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[420px] p-0">
              <SheetHeader className="border-b px-6 py-5">
                <SheetTitle>
                  {lang === "fr" ? "Nouvelle session" : "New session"}
                </SheetTitle>
              </SheetHeader>
              <div className="px-6 py-5 space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-semibold">
                    {lang === "fr" ? "Date" : "Date"}
                  </div>
                  <Input
                    type="date"
                    value={bookDate}
                    onChange={(e) => setBookDate(e.target.value)}
                    className="h-10 rounded-3xl"
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-semibold">
                    {lang === "fr" ? "Heure" : "Time"}
                  </div>
                  <Input
                    type="time"
                    value={bookTime}
                    onChange={(e) => setBookTime(e.target.value)}
                    className="h-10 rounded-3xl"
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-semibold">
                    {lang === "fr" ? "Durée (minutes)" : "Duration (minutes)"}
                  </div>
                  <Input
                    inputMode="numeric"
                    value={String(durationMinutes)}
                    onChange={(e) =>
                      setDurationMinutes(
                        Math.max(30, Math.min(240, Number(e.target.value || 90)))
                      )
                    }
                    className="h-10 rounded-3xl"
                  />
                  <div className="text-xs text-muted-foreground">
                    {lang === "fr"
                      ? "Studio : Studio Branddeo"
                      : "Studio: Branddeo Studio"}
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="rounded-full"
                    type="button"
                    onClick={() => setBookOpen(false)}
                  >
                    {lang === "fr" ? "Annuler" : "Cancel"}
                  </Button>
                  <Button className="rounded-full" type="button" onClick={createReservation}>
                    {lang === "fr" ? "Créer" : "Create"}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
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
                  ? "Choisissez une date et une heure, puis validez."
                  : "Pick a date and a time, then confirm."}
              </div>
            </div>
            <Button
              className="rounded-full"
              size="sm"
              type="button"
              onClick={() => setBookOpen(true)}
            >
              {lang === "fr" ? "Ouvrir le formulaire" : "Open form"}
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <Card className="rounded-3xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            {lang === "fr" ? "Calendrier" : "Calendar"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[780px] rounded-3xl border bg-background p-3">
            <BigCalendar
              className="rbc-calendar"
              localizer={localizer}
              culture={lang === "fr" ? "fr" : "en-gb"}
              events={events}
              startAccessor="start"
              endAccessor="end"
              date={calendarDate}
              onNavigate={(nextDate) => setCalendarDate(nextDate)}
              views={["month"]}
              defaultView="month"
              messages={{
                today: lang === "fr" ? "Aujourd’hui" : "Today",
                previous: lang === "fr" ? "Précédent" : "Previous",
                next: lang === "fr" ? "Suivant" : "Next",
                month: lang === "fr" ? "Mois" : "Month",
                noEventsInRange: lang === "fr" ? "Aucune session" : "No sessions",
                showMore: (total) =>
                  lang === "fr" ? `+${total} de plus` : `+${total} more`,
              }}
              components={{
                toolbar: (props) => <CalendarToolbar {...props} lang={lang} />,
              }}
              eventPropGetter={(event) => {
                if (event.resource.status === "cancelled") {
                  return { style: { background: "rgba(0,0,0,0.12)" } }
                }
                if (event.resource.status === "pending") {
                  return { style: { background: "rgba(255,96,92,0.75)" } }
                }
                return {}
              }}
              onSelectEvent={(event) => {
                setSelectedReservationId(event.resource.id)
                setDetailsOpen(true)
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
        <SheetContent side="right" className="w-[420px] p-0">
          <SheetHeader className="border-b px-6 py-5">
            <SheetTitle>
              {lang === "fr" ? "Détails de la session" : "Session details"}
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-5 px-6 py-5">
            {selectedReservation ? (
              <>
                <div className="space-y-1">
                  <div className="text-sm font-semibold">
                    {selectedReservation.studio}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {lang === "fr" ? "Studio unique" : "Single studio"}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-3xl border bg-muted/10 px-4 py-3">
                  <div className="text-sm font-semibold">
                    {lang === "fr" ? "Statut" : "Status"}
                  </div>
                  <Badge variant="secondary" className="rounded-full">
                    {lang === "fr"
                      ? selectedReservation.status === "confirmed"
                        ? "Confirmée"
                        : selectedReservation.status === "pending"
                          ? "En attente"
                          : "Annulée"
                      : selectedReservation.status === "confirmed"
                        ? "Confirmed"
                        : selectedReservation.status === "pending"
                          ? "Pending"
                          : "Cancelled"}
                  </Badge>
                </div>

                <div className="space-y-3 rounded-3xl border px-4 py-4">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <div className="text-muted-foreground">
                      {lang === "fr" ? "Date" : "Date"}
                    </div>
                    <div className="font-semibold">
                      {moment(selectedReservation.start).format(
                        lang === "fr" ? "DD/MM/YYYY" : "MMM D, YYYY"
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <div className="text-muted-foreground">
                      {lang === "fr" ? "Heure" : "Time"}
                    </div>
                    <div className="font-semibold tabular-nums">
                      {moment(selectedReservation.start).format(
                        lang === "fr" ? "HH:mm" : "h:mm A"
                      )}{" "}
                      –{" "}
                      {moment(selectedReservation.end).format(
                        lang === "fr" ? "HH:mm" : "h:mm A"
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <div className="text-muted-foreground">
                      {lang === "fr" ? "Durée" : "Duration"}
                    </div>
                    <div className="font-semibold tabular-nums">
                      {(() => {
                        const minutes =
                          (new Date(selectedReservation.end).getTime() -
                            new Date(selectedReservation.start).getTime()) /
                          60000
                        const h = Math.floor(minutes / 60)
                        const m = Math.round(minutes % 60)
                        if (lang === "fr") return h > 0 ? `${h}h${m ? ` ${m}m` : ""}` : `${m}m`
                        return h > 0 ? `${h}h ${m ? `${m}m` : ""}`.trim() : `${m}m`
                      })()}
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-sm font-semibold">
                        {lang === "fr" ? "Offre" : "Plan"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {selectedReservation.offer?.label ??
                          (lang === "fr" ? "Tournage (à définir)" : "Shooting (to be set)")}
                      </div>
                    </div>
                    {selectedReservation.offer?.popular ? (
                      <Badge className="rounded-full" variant="secondary">
                        {lang === "fr" ? "Populaire" : "Popular"}
                      </Badge>
                    ) : null}
                  </div>

                  <div className="mt-4 grid gap-3 rounded-3xl bg-muted/10 p-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="text-sm font-semibold">
                        {lang === "fr" ? "Tarif" : "Pricing"}
                      </div>
                      <div className="text-sm text-muted-foreground tabular-nums">
                        {selectedReservation.offer
                          ? `${selectedReservation.offer.ttc}€ TTC • ${selectedReservation.offer.ht}€ HT`
                          : "—"}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-semibold">
                        {lang === "fr" ? "Inclus" : "Included"}
                      </div>
                      <div className="space-y-2">
                        {(selectedReservation.offer?.includes ?? defaultIncludes).map((item) => (
                          <div key={item} className="flex items-start gap-2 text-sm">
                            <div className="mt-0.5 flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <BadgeCheck className="size-3.5" />
                            </div>
                            <div className="text-muted-foreground">{item}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    className="rounded-full"
                    type="button"
                    onClick={() => setDetailsOpen(false)}
                  >
                    {lang === "fr" ? "Fermer" : "Close"}
                  </Button>
                  <Button
                    className="rounded-full"
                    type="button"
                    onClick={() => {
                      setDetailsOpen(false)
                      setBookOpen(true)
                    }}
                  >
                    {lang === "fr" ? "Reprogrammer" : "Reschedule"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="rounded-3xl border py-10 text-center text-sm text-muted-foreground">
                {lang === "fr" ? "Aucune donnée." : "No data."}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
