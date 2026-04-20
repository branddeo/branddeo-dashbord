import { useEffect, useMemo, useState } from "react"
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock3,
  LogOut,
  Users,
} from "lucide-react"
import { useNavigate, useSearchParams } from "react-router-dom"
import moment from "moment"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Lang = "fr" | "en"

type Reservation = {
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
}

function getTodayYmd() {
  const today = new Date()
  const yyyy = String(today.getFullYear())
  const mm = String(today.getMonth() + 1).padStart(2, "0")
  const dd = String(today.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

function clampDurationMinutes(value: number) {
  if (!Number.isFinite(value) || value <= 0) return 90
  return Math.min(240, Math.max(30, value))
}

function readJson<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

function readLang(): Lang {
  const stored = localStorage.getItem("branddeo.lang")
  return stored === "en" ? "en" : "fr"
}

export default function BookSessionPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [lang, setLang] = useState<Lang>(() => readLang())

  useEffect(() => {
    moment.locale(lang === "fr" ? "fr" : "en-gb")
  }, [lang])

  useEffect(() => {
    localStorage.setItem("branddeo.lang", lang)
  }, [lang])

  const durationFromQuery = Number(searchParams.get("duration") ?? "")
  const dateFromQuery = searchParams.get("date")
  const timeFromQuery = searchParams.get("time")
  const customizationFromQuery = searchParams.get("customization") ?? ""
  const reminderFromQuery = searchParams.get("reminder") ?? ""

  const initialDuration = clampDurationMinutes(durationFromQuery)
  const initialHours = ([60, 120, 180] as const).includes(initialDuration as 60 | 120 | 180)
    ? (initialDuration / 60) as 1 | 2 | 3
    : 2
  const initialReminder = reminderFromQuery ? moment(reminderFromQuery) : null

  const [step, setStep] = useState<1 | 2 | 3 | 4>(() => {
    if (dateFromQuery || timeFromQuery || customizationFromQuery || reminderFromQuery) return 4
    if (durationFromQuery) return 2
    return 1
  })

  const [peopleCount, setPeopleCount] = useState<1 | 2 | 3 | 4>(2)
  const [hours, setHours] = useState<1 | 2 | 3>(initialHours)
  const durationMinutes = hours * 60

  const [bookDate, setBookDate] = useState<string>(() => {
    if (dateFromQuery && /^\d{4}-\d{2}-\d{2}$/.test(dateFromQuery)) return dateFromQuery
    return getTodayYmd()
  })
  const [bookTime, setBookTime] = useState<string>(() => {
    if (timeFromQuery && /^\d{2}:\d{2}$/.test(timeFromQuery)) return timeFromQuery
    return "10:00"
  })

  const [studioCustomization, setStudioCustomization] = useState<string>(customizationFromQuery)
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(() =>
    Boolean(initialReminder && initialReminder.isValid())
  )
  const [reminderDate, setReminderDate] = useState<string>(() => {
    if (initialReminder && initialReminder.isValid()) return initialReminder.format("YYYY-MM-DD")
    return getTodayYmd()
  })
  const [reminderTime, setReminderTime] = useState<string>(() => {
    if (initialReminder && initialReminder.isValid()) return initialReminder.format("HH:mm")
    return "09:00"
  })

  const upsells = useMemo(
    () => [
      {
        id: "short",
        title: lang === "fr" ? "Short" : "Short",
        description:
          lang === "fr"
            ? "Formats courts adaptés à tous les réseaux (sous-titres, zooms dynamiques)"
            : "Short formats for social (subtitles, dynamic zooms)",
        ttc: 25,
      },
      {
        id: "premontage",
        title: lang === "fr" ? "Pré-montage de la session" : "Session pre-edit",
        description:
          lang === "fr"
            ? "Synchronisation audio/vidéo + changement de plans"
            : "Audio/video sync + angle switching",
        ttc: 60,
      },
    ],
    [lang]
  )
  const [selectedUpsellIds, setSelectedUpsellIds] = useState<string[]>([])

  const computedOffer = useMemo(() => {
    if (hours === 1) {
      return {
        label: "Tournage 1h" as const,
        ttc: 120,
        ht: 100,
        hours: 1 as const,
        includes: [
          "1 heure de tournage au studio",
          "Personnalisation à l'infini de votre espace de tournage",
          "Pré-montage (vidéo pouvant être publiée)",
          "Accompagnement sur place pour une session fluide",
          "Matériel audiovisuel de pointe (Caméra Sony, Micro Shure, etc)",
          "Livraison dès la fin du tournage",
        ],
      }
    }
    if (hours === 2) {
      return {
        label: "Tournage 2h" as const,
        ttc: 228,
        ht: 190,
        hours: 2 as const,
        popular: true,
        includes: [
          "2 heures de tournage au studio",
          "Personnalisation à l'infini de votre espace de tournage",
          "Pré-montage (vidéo pouvant être publiée)",
          "Accompagnement sur place pour une session fluide",
          "Possibilité de produire un ou plusieurs contenus selon ton organisation",
          "Matériel audiovisuel de pointe (Caméra Sony, Micro Shure, etc)",
          "Livraison dès la fin du tournage",
        ],
      }
    }
    if (hours === 3) {
      return {
        label: "Tournage 3h" as const,
        ttc: 324,
        ht: 270,
        hours: 3 as const,
        includes: [
          "3 heures de tournage au studio",
          "Personnalisation à l'infini de votre espace de tournage",
          "Pré-montage (vidéo pouvant être publiée)",
          "Accompagnement sur place pour une session fluide",
          "Possibilité de produire un ou plusieurs contenus selon ton organisation",
          "Matériel audiovisuel de pointe (Caméra Sony, Micro Shure, etc)",
          "Livraison dès la fin du tournage",
        ],
      }
    }
    return undefined
  }, [hours])

  const selectedUpsells = useMemo(
    () => upsells.filter((u) => selectedUpsellIds.includes(u.id)),
    [selectedUpsellIds, upsells]
  )
  const totalTtc = (computedOffer?.ttc ?? 0) + selectedUpsells.reduce((sum, u) => sum + u.ttc, 0)

  const startMoment = useMemo(() => {
    if (!bookDate || !bookTime) return null
    const value = moment(`${bookDate}T${bookTime}:00`)
    return value.isValid() ? value : null
  }, [bookDate, bookTime])
  const endMoment = useMemo(() => {
    if (!startMoment) return null
    return startMoment.clone().add(durationMinutes, "minutes")
  }, [durationMinutes, startMoment])

  const createReservation = () => {
    if (!bookDate || !bookTime) return
    if (reminderEnabled && (!reminderDate || !reminderTime)) return
    if (!studioCustomization.trim()) return

    const startLocal = new Date(`${bookDate}T${bookTime}:00`)
    const endLocal = new Date(startLocal.getTime() + durationMinutes * 60000)

    const seq = readJson<number>("branddeo.seq.reservations", 3)
    const next = seq + 1
    writeJson("branddeo.seq.reservations", next)

    const reservations = readJson<Reservation[]>("branddeo.reservations", [])
    const payload: Omit<Reservation, "id"> = {
      studio: "Studio Branddeo",
      studioId: "branddeo",
      start: startLocal.toISOString(),
      end: endLocal.toISOString(),
      status: "pending",
      studioCustomization: studioCustomization.trim() || undefined,
      reminder: reminderEnabled
        ? {
            enabled: true,
            datetime: new Date(`${reminderDate}T${reminderTime}:00`).toISOString(),
          }
        : { enabled: false },
      offer: computedOffer,
    }

    writeJson("branddeo.reservations", [{ id: `res_${next}`, ...payload }, ...reservations])
    navigate("/reservations", { replace: true })
  }

  const canContinue = useMemo(() => {
    if (step === 1) return true
    if (step === 2) return Boolean(bookDate && bookTime)
    if (step === 3) {
      if (!studioCustomization.trim()) return false
      if (reminderEnabled && (!reminderDate || !reminderTime)) return false
      return true
    }
    return true
  }, [bookDate, bookTime, reminderDate, reminderEnabled, reminderTime, step, studioCustomization])

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-[1480px] items-center gap-3 px-4 md:px-6">
          <Button
            variant="outline"
            className="rounded-full"
            type="button"
            onClick={() => navigate("/reservations")}
          >
            <ArrowLeft className="size-4" />
            {lang === "fr" ? "Retour" : "Back"}
          </Button>

          <div className="ml-1 flex items-center gap-3">
            <img
              src="/branddeo_logo.png"
              alt="Branddeo"
              className="h-7 w-auto"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Select value={lang} onValueChange={(v) => setLang(v === "en" ? "en" : "fr")}>
              <SelectTrigger className="h-9 w-[110px] rounded-full">
                <SelectValue placeholder="Lang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="rounded-full"
              type="button"
              onClick={() => window.location.assign("/auth/login")}
            >
              <LogOut className="size-4" />
              {lang === "fr" ? "Se déconnecter" : "Sign out"}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1480px] gap-8 px-4 py-8 md:px-6 lg:grid-cols-[1fr_460px] lg:gap-12">
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground">
              {lang === "fr" ? `Étape ${step}/4` : `Step ${step}/4`}
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width]"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>

          {step === 1 ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight">
                  {lang === "fr" ? "Hey, pour commencer sélectionnez…" : "To get started, select…"}
                </h1>
              </div>

              <div className="space-y-3">
                <div className="text-sm font-semibold">
                  {lang === "fr" ? "Sélectionnez le nombre de personnes" : "Select number of people"}
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {([1, 2, 3, 4] as const).map((n) => (
                    <Button
                      key={n}
                      type="button"
                      variant={peopleCount === n ? "default" : "outline"}
                      className="h-12 rounded-3xl"
                      onClick={() => setPeopleCount(n)}
                    >
                      {n}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm font-semibold">
                  {lang === "fr" ? "Sélectionnez une durée" : "Select duration"}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {([1, 2, 3] as const).map((h) => (
                    <Button
                      key={h}
                      type="button"
                      variant={hours === h ? "default" : "outline"}
                      className="h-12 rounded-3xl"
                      onClick={() => setHours(h)}
                    >
                      {h}h
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Button className="h-12 rounded-3xl px-10" type="button" onClick={() => setStep(2)}>
                  {lang === "fr" ? "Continuer" : "Continue"}
                </Button>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight">
                  {lang === "fr" ? "Sélectionnez une date et une heure" : "Select a date and time"}
                </h1>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-semibold">
                    {lang === "fr" ? "Sélectionnez une date" : "Select a date"}
                  </div>
                  <Input
                    type="date"
                    value={bookDate}
                    onChange={(e) => setBookDate(e.target.value)}
                    className="h-12 rounded-3xl"
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-semibold">
                    {lang === "fr" ? "Sélectionnez une heure" : "Select a time"}
                  </div>
                  <Input
                    type="time"
                    value={bookTime}
                    onChange={(e) => setBookTime(e.target.value)}
                    className="h-12 rounded-3xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  className="h-12 rounded-3xl px-8"
                  type="button"
                  onClick={() => setStep(1)}
                >
                  {lang === "fr" ? "Retour" : "Back"}
                </Button>
                <Button
                  className="h-12 rounded-3xl px-10"
                  type="button"
                  disabled={!canContinue}
                  onClick={() => setStep(3)}
                >
                  {lang === "fr" ? "Continuer" : "Continue"}
                </Button>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight">
                  {lang === "fr"
                    ? "Studio à personnaliser"
                    : "Customized studio"}
                </h1>
                <div className="text-sm text-muted-foreground">
                  {lang === "fr"
                    ? "Décrivez le studio que vous souhaitez pour la personnalisation."
                    : "Describe the studio you want for customization."}
                </div>
              </div>

              <div className="space-y-2">
                <Input
                  value={studioCustomization}
                  onChange={(e) => setStudioCustomization(e.target.value)}
                  className="h-12 rounded-3xl"
                  placeholder={lang === "fr" ? "Ex : Casablanca, minimal beige…" : "E.g. Casablanca, minimal beige…"}
                />
                <div className="text-xs text-muted-foreground">
                  {lang === "fr"
                    ? "Ce champ est requis pour préparer votre décor."
                    : "This field is required to prepare your set."}
                </div>
              </div>

              <div className="rounded-3xl border px-5 py-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-sm font-semibold">
                      {lang === "fr"
                        ? "Être rappelé avant le jour du tournage"
                        : "Get a reminder call before shooting"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {lang === "fr"
                        ? "Si oui, choisissez une date et une heure."
                        : "If yes, choose a date and time."}
                    </div>
                  </div>
                  <Switch checked={reminderEnabled} onCheckedChange={setReminderEnabled} />
                </div>
                {reminderEnabled ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <Input
                      type="date"
                      value={reminderDate}
                      onChange={(e) => setReminderDate(e.target.value)}
                      className="h-12 rounded-3xl"
                    />
                    <Input
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="h-12 rounded-3xl"
                    />
                  </div>
                ) : null}
              </div>

              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  className="h-12 rounded-3xl px-8"
                  type="button"
                  onClick={() => setStep(2)}
                >
                  {lang === "fr" ? "Retour" : "Back"}
                </Button>
                <Button
                  className="h-12 rounded-3xl px-10"
                  type="button"
                  disabled={!canContinue}
                  onClick={() => setStep(4)}
                >
                  {lang === "fr" ? "Continuer" : "Continue"}
                </Button>
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight">
                  {lang === "fr" ? "Voulez-vous ajouter des options ?" : "Do you want to add options?"}
                </h1>
                <div className="text-sm text-muted-foreground">
                  {lang === "fr"
                    ? "Ces options s'appliquent uniquement à cette session."
                    : "These options apply only to this session."}
                </div>
              </div>

              <div className="space-y-3">
                {upsells.map((u) => {
                  const selected = selectedUpsellIds.includes(u.id)
                  return (
                    <div key={u.id} className="rounded-3xl border px-5 py-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 space-y-1">
                          <div className="text-sm font-semibold">{u.title}</div>
                          <div className="text-sm text-muted-foreground">{u.description}</div>
                          <div className="pt-1 text-sm font-semibold tabular-nums">{u.ttc.toFixed(2)} €</div>
                        </div>
                        <Button
                          type="button"
                          className="rounded-3xl"
                          variant={selected ? "secondary" : "outline"}
                          onClick={() =>
                            setSelectedUpsellIds((prev) =>
                              prev.includes(u.id) ? prev.filter((id) => id !== u.id) : [...prev, u.id]
                            )
                          }
                        >
                          {lang === "fr"
                            ? selected
                              ? "Ajouté"
                              : "Ajouter"
                            : selected
                              ? "Added"
                              : "Add"}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  className="h-12 rounded-3xl px-8"
                  type="button"
                  onClick={() => setStep(3)}
                >
                  {lang === "fr" ? "Retour" : "Back"}
                </Button>
                <Button
                  className="h-12 rounded-3xl px-10"
                  type="button"
                  disabled={!studioCustomization.trim()}
                  onClick={createReservation}
                >
                  {lang === "fr" ? "Confirmer" : "Confirm"}
                </Button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-[36px] border bg-gradient-to-br from-primary/18 via-muted/20 to-background">
            <div className="p-5">
              <div className="rounded-[32px] border bg-background/90 p-6 backdrop-blur">
                <div className="text-center text-lg font-semibold">
                  {lang === "fr" ? "Votre réservation" : "Your booking"}
                </div>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="size-4" />
                      {lang === "fr" ? "Personnes" : "People"}
                    </div>
                    <div className="font-semibold tabular-nums">{peopleCount}</div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarIcon className="size-4" />
                      {lang === "fr" ? "Date" : "Date"}
                    </div>
                    <div className="font-semibold">
                      {startMoment ? startMoment.format(lang === "fr" ? "DD MMM. YYYY" : "MMM D, YYYY") : "—"}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock3 className="size-4" />
                      {lang === "fr" ? "Heure" : "Time"}
                    </div>
                    <div className="font-semibold tabular-nums">
                      {startMoment && endMoment
                        ? `${startMoment.format("HH:mm")} - ${endMoment.format("HH:mm")}`
                        : "—"}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="text-muted-foreground">{lang === "fr" ? "Durée" : "Duration"}</div>
                    <div className="font-semibold tabular-nums">{hours}h</div>
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div className="text-muted-foreground">{lang === "fr" ? "Studio" : "Studio"}</div>
                    <div className="max-w-[240px] text-right font-semibold">
                      {studioCustomization.trim() ? studioCustomization.trim() : "—"}
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div className="text-muted-foreground">{lang === "fr" ? "Rappel" : "Callback"}</div>
                    <div className="max-w-[240px] text-right font-semibold">
                      {reminderEnabled
                        ? moment(`${reminderDate}T${reminderTime}:00`).format(
                            lang === "fr" ? "DD/MM/YYYY [à] HH:mm" : "MMM D, YYYY [at] h:mm A"
                          )
                        : lang === "fr"
                          ? "Non"
                          : "No"}
                    </div>
                  </div>

                  <div className="mt-4 border-t pt-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-muted-foreground">{lang === "fr" ? "Offre" : "Plan"}</div>
                      <div className="font-semibold">{computedOffer?.label ?? "—"}</div>
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-3">
                      <div className="text-muted-foreground">{lang === "fr" ? "Total" : "Total"}</div>
                      <div className="font-semibold tabular-nums">{totalTtc.toFixed(2)} €</div>
                    </div>
                    {selectedUpsells.length ? (
                      <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                        {selectedUpsells.map((u) => (
                          <div key={u.id} className="flex items-center justify-between gap-3">
                            <div className="truncate">{u.title}</div>
                            <div className="tabular-nums">+{u.ttc.toFixed(2)} €</div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  {computedOffer?.popular ? (
                    <div className="mt-4 flex justify-center">
                      <Badge className="rounded-full" variant="secondary">
                        {lang === "fr" ? "Populaire" : "Popular"}
                      </Badge>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
