import { useEffect, useMemo, useState } from "react"
import { BadgeCheck, ChevronLeft, ChevronRight } from "lucide-react"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

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
      studioCustomization?: string
      reminder?: { enabled: boolean; datetime?: string }
      offer?: {
        label: string
        ttc: number
        ht: number
        hours: 1 | 2 | 3
        popular?: boolean
        includes: string[]
      }
    }>
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
  const { lang, data } = useOutletContext<DashboardOutletContext>()
  const [searchParams] = useSearchParams()
  const [calendarDate, setCalendarDate] = useState<Date>(() => new Date())
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedReservationId, setSelectedReservationId] = useState<string | null>(
    null
  )
  const [hideUpsells, setHideUpsells] = useState(false)

  const intent = searchParams.get("intent")
  const durationParam = searchParams.get("duration")

  useEffect(() => {
    moment.locale(lang === "fr" ? "fr" : "en-gb")
  }, [lang])

  useEffect(() => {
    if (intent !== "book") return
    const params = new URLSearchParams()
    if (durationParam) params.set("duration", durationParam)
    const qs = params.toString()
    navigate(`/reservations/book${qs ? `?${qs}` : ""}`, { replace: true })
  }, [durationParam, intent, navigate])

  const selectedReservation = useMemo(() => {
    if (!selectedReservationId) return null
    return data.reservations.find((r) => r.id === selectedReservationId) ?? null
  }, [data.reservations, selectedReservationId])

  const upsells = useMemo(
    () => [
      {
        id: "upsell_extra_30",
        title: lang === "fr" ? "30 min supplémentaires" : "Extra 30 min",
        priceTtc: 45,
        priceHt: 37,
      },
      {
        id: "upsell_multi_cam",
        title: lang === "fr" ? "Multi-cam (2 angles)" : "Multi-cam (2 angles)",
        priceTtc: 80,
        priceHt: 67,
      },
      {
        id: "upsell_subtitles",
        title: lang === "fr" ? "Sous-titres (FR)" : "Subtitles (EN/FR)",
        priceTtc: 60,
        priceHt: 50,
      },
    ],
    [lang]
  )

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
          <Button
            className="rounded-full"
            type="button"
            onClick={() => navigate("/reservations/book")}
          >
            {lang === "fr" ? "Réserver une session" : "Book a session"}
          </Button>
        </div>
      </div>

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
          <ScrollArea className="h-[calc(100svh-92px)] px-6 py-5">
            <div className="space-y-5">
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

                <div className="space-y-3 rounded-3xl border px-4 py-4">
                  <div className="flex items-start justify-between gap-3 text-sm">
                    <div className="text-muted-foreground">
                      {lang === "fr" ? "Studio à personnaliser" : "Customized studio"}
                    </div>
                    <div className="max-w-[250px] text-right font-semibold">
                      {selectedReservation.studioCustomization?.trim()
                        ? selectedReservation.studioCustomization.trim()
                        : "—"}
                    </div>
                  </div>
                  <div className="flex items-start justify-between gap-3 text-sm">
                    <div className="text-muted-foreground">
                      {lang === "fr" ? "Rappel" : "Callback"}
                    </div>
                    <div className="max-w-[250px] text-right font-semibold">
                      {selectedReservation.reminder?.enabled
                        ? selectedReservation.reminder.datetime
                          ? moment(selectedReservation.reminder.datetime).format(
                              lang === "fr"
                                ? "DD/MM/YYYY [à] HH:mm"
                                : "MMM D, YYYY [at] h:mm A"
                            )
                          : lang === "fr"
                            ? "Oui (à définir)"
                            : "Yes (to be set)"
                        : lang === "fr"
                          ? "Non"
                          : "No"}
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

                {!hideUpsells ? (
                  <div className="rounded-3xl border px-4 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="text-sm font-semibold">
                          {lang === "fr" ? "Options" : "Add-ons"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {lang === "fr"
                            ? "Ajoutez des options à votre session."
                            : "Add options to your session."}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        className="rounded-full"
                        onClick={() => setHideUpsells(true)}
                      >
                        {lang === "fr" ? "Masquer" : "Hide"}
                      </Button>
                    </div>

                    <div className="mt-4 space-y-2">
                      {upsells.map((u) => (
                        <div
                          key={u.id}
                          className="flex items-center justify-between gap-3 rounded-3xl border bg-muted/10 px-4 py-3"
                        >
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold">{u.title}</div>
                            <div className="truncate text-xs text-muted-foreground tabular-nums">
                              {u.priceTtc}€ TTC • {u.priceHt}€ HT
                            </div>
                          </div>
                          <Button
                            size="sm"
                            type="button"
                            className="rounded-full"
                            onClick={() => {}}
                          >
                            {lang === "fr" ? "Ajouter" : "Add"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      className="rounded-full"
                      onClick={() => setHideUpsells(false)}
                    >
                      {lang === "fr" ? "Afficher les options" : "Show add-ons"}
                    </Button>
                  </div>
                )}

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
                      if (!selectedReservation) return
                      const start = moment(selectedReservation.start)
                      const end = moment(selectedReservation.end)
                      const duration = Math.min(240, Math.max(30, end.diff(start, "minutes")))
                      const params = new URLSearchParams()
                      params.set("date", start.format("YYYY-MM-DD"))
                      params.set("time", start.format("HH:mm"))
                      params.set("duration", String(duration))
                      if (selectedReservation.studioCustomization?.trim()) {
                        params.set("customization", selectedReservation.studioCustomization.trim())
                      }
                      if (selectedReservation.reminder?.enabled && selectedReservation.reminder.datetime) {
                        params.set("reminder", selectedReservation.reminder.datetime)
                      }
                      navigate(`/reservations/book?${params.toString()}`)
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
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  )
}
