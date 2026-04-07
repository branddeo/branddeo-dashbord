import { useMemo } from "react"
import { Calendar, Film, Info, PlusCircle } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
    user: { firstName: string; lastName: string }
    credits: number
    reservations: Array<{
      id: string
      studio: string
      studioId: string
      start: string
      end: string
      status: "confirmed" | "pending" | "cancelled"
    }>
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
    timeRange: (startIso: string, endIso: string) => string
  }
  ui: { openSearch: () => void }
}

function PageTitle({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {subtitle ? (
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      ) : null}
    </div>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const { lang, data, format, ui } = useOutletContext<DashboardOutletContext>()

  const nextReservation = useMemo(() => {
    const sorted = [...data.reservations].sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    )
    return sorted.find((r) => r.status !== "cancelled") ?? sorted[0]
  }, [data.reservations])

  const greeting =
    lang === "fr"
      ? `Bonjour ${data.user.firstName}`
      : `Hello ${data.user.firstName}`

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageTitle
        title={greeting}
        subtitle={
          lang === "fr"
            ? "Aperçu de votre espace Branddeo."
            : "Branddeo workspace overview."
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">
              {lang === "fr" ? "Prochaine session" : "Next session"}
            </CardTitle>
            <CardDescription>
              {nextReservation ? (
                <span className="inline-flex items-center gap-2">
                  <span>{nextReservation.studio}</span>
                  <span className="text-muted-foreground">•</span>
                  <span>{format.dateTime(nextReservation.start)}</span>
                </span>
              ) : lang === "fr" ? (
                "Aucune session à venir."
              ) : (
                "No upcoming session."
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full rounded-full"
              size="sm"
              type="button"
              onClick={() => navigate("/reservations?intent=book")}
            >
              <Calendar className="size-4" />
              {lang === "fr" ? "Réserver une session" : "Book a session"}
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">
              {lang === "fr" ? "Votre formule" : "Your plan"}
            </CardTitle>
            <CardDescription>
              {lang === "fr"
                ? "Pilotez votre offre et vos options."
                : "Manage your plan and options."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="secondary"
              className="w-full rounded-full"
              size="sm"
              type="button"
              onClick={() => navigate("/abonnement")}
            >
              <Info className="size-4" />
              {lang === "fr" ? "Voir l’abonnement" : "View subscription"}
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">
              {lang === "fr" ? "Crédits" : "Credits"}
            </CardTitle>
            <CardDescription>
              {lang === "fr" ? "Disponibles" : "Available"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-3">
            <div className="text-3xl font-semibold tabular-nums">
              {data.credits}
            </div>
            <Button
              variant="outline"
              className="rounded-full"
              size="sm"
              type="button"
              onClick={() => navigate("/abonnement")}
            >
              <PlusCircle className="size-4" />
              {lang === "fr" ? "Acheter" : "Buy"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle>{lang === "fr" ? "Activité" : "Activity"}</CardTitle>
            <CardDescription>
              {lang === "fr"
                ? "Dernières sessions et livrables."
                : "Recent sessions and deliverables."}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            className="rounded-full"
            size="sm"
            type="button"
            onClick={ui.openSearch}
          >
            {lang === "fr" ? "Rechercher" : "Search"}
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="reservations" className="w-full">
            <TabsList className="grid w-full max-w-[360px] grid-cols-2 rounded-full">
              <TabsTrigger value="rush" className="rounded-full">
                {lang === "fr" ? "Rushes" : "Rushes"}
              </TabsTrigger>
              <TabsTrigger value="reservations" className="rounded-full">
                {lang === "fr" ? "Réservations" : "Bookings"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reservations" className="mt-4">
              <div className="rounded-2xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{lang === "fr" ? "Studio" : "Studio"}</TableHead>
                      <TableHead>{lang === "fr" ? "Date" : "Date"}</TableHead>
                      <TableHead>
                        {lang === "fr" ? "Créneau" : "Time"}
                      </TableHead>
                      <TableHead>{lang === "fr" ? "Statut" : "Status"}</TableHead>
                      <TableHead className="text-right">
                        {lang === "fr" ? "Durée" : "Duration"}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.reservations.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="py-12 text-center text-sm text-muted-foreground"
                        >
                          {lang === "fr"
                            ? "Aucune réservation disponible"
                            : "No bookings yet"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.reservations.slice(0, 3).map((r) => (
                        <TableRow key={r.id} className="cursor-pointer" onClick={() => navigate(`/reservations?q=${encodeURIComponent(r.studio)}`)}>
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
                                (new Date(r.end).getTime() -
                                  new Date(r.start).getTime()) /
                                60000
                              const h = Math.floor(minutes / 60)
                              const m = Math.round(minutes % 60)
                              return h > 0
                                ? `${h}h${m ? ` ${m}m` : ""}`
                                : `${m}m`
                            })()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="rush" className="mt-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {data.rushes.map((r) => (
                  <Card key={r.id} className="rounded-3xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{r.title}</CardTitle>
                      <CardDescription>{r.studio}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                      <Badge variant="secondary" className="rounded-full">
                        {lang === "fr"
                          ? r.status === "ready"
                            ? "Prêt"
                            : "En traitement"
                          : r.status === "ready"
                            ? "Ready"
                            : "Processing"}
                      </Badge>
                      <Button
                        variant="outline"
                        size="icon"
                        type="button"
                        onClick={() => navigate(`/rushes?q=${encodeURIComponent(r.title)}`)}
                      >
                        <Film className="size-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
