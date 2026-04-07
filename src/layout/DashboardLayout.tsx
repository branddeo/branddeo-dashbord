import { useEffect, useMemo, useRef, useState } from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import {
  BarChart3,
  BadgeCheck,
  Calendar,
  Cloud,
  X,
  Coins,
  Film,
  Home,
  Moon,
  type LucideIcon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Send,
  Sparkles,
  Settings,
  Sun,
  User,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

type NavItem = {
  to: string
  label: string
  icon: LucideIcon
}

type Lang = "fr" | "en"

type Reservation = {
  id: string
  studio: string
  studioId: string
  start: string
  end: string
  status: "confirmed" | "pending" | "cancelled"
}

type RushItem = {
  id: string
  title: string
  studio: string
  studioId: string
  date: string
  status: "ready" | "processing"
}

type PaymentCard = {
  id: string
  brand: "visa" | "mastercard" | "amex" | "other"
  last4: string
  expMonth: string
  expYear: string
  nameOnCard: string
  isDefault?: boolean
}

type CloudState = {
  enabled: boolean
  storageGb: number
  usedGb: number
  priceEurMonthly: number
  retentionDaysWithoutCloud: number
}

function useLocalStorageBoolean(key: string, initialValue: boolean) {
  const [value, setValue] = useState<boolean>(() => {
    const raw = localStorage.getItem(key)
    if (raw === "true") return true
    if (raw === "false") return false
    return initialValue
  })

  useEffect(() => {
    localStorage.setItem(key, String(value))
  }, [key, value])

  return [value, setValue] as const
}

function useLocalStorageState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const raw = localStorage.getItem(key)
    if (!raw) return initialValue
    try {
      return JSON.parse(raw) as T
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const stored = localStorage.getItem("branddeo.theme")
    if (stored === "light" || stored === "dark") return stored
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches
    return prefersDark ? "dark" : "light"
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("dark", theme === "dark")
    localStorage.setItem("branddeo.theme", theme)
  }, [theme])

  return {
    theme,
    toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
  }
}

function formatDateTime(iso: string, lang: Lang) {
  const locale = lang === "fr" ? "fr-FR" : "en-GB"
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso))
}

function formatTimeRange(startIso: string, endIso: string, lang: Lang) {
  const locale = lang === "fr" ? "fr-FR" : "en-GB"
  const fmt = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" })
  return `${fmt.format(new Date(startIso))} – ${fmt.format(new Date(endIso))}`
}

function useI18n() {
  const [lang, setLang] = useLocalStorageState<Lang>("branddeo.lang", "fr")

  const dict = useMemo(
    () => ({
      fr: {
        nav: {
          home: "Accueil",
          reservations: "Réservations",
          rushes: "Rushes",
          analytics: "Analytique",
          cloud: "Branddeo Cloud",
          subscription: "Abonnement",
          profile: "Profil",
        },
        sidebar: {
          workspace: "Espace",
          services: "Services",
          account: "Compte",
          language: "Langue",
        },
        topbar: {
          search: "Rechercher…",
          searchHint: "Ctrl K",
          credits: "Crédits",
          bookSession: "Réserver une session",
        },
        search: {
          title: "Recherche",
          description: "Rechercher une page, une réservation, un rush…",
          pages: "Pages",
          actions: "Actions",
          reservations: "Réservations",
          rushes: "Rushes",
          cloud: "Branddeo Cloud",
          empty: "Aucun résultat.",
        },
        statuses: {
          confirmed: "Confirmée",
          pending: "En attente",
          cancelled: "Annulée",
          ready: "Prêt",
          processing: "En traitement",
        },
        ai: {
          title: "Branddeo AI",
          description:
            "Posez une question sur Branddeo (réservations, rushes, cloud, facturation…).",
          placeholder: "Écrivez votre question…",
          suggestions: {
            rushes: "Où trouver mes rushes ?",
            book: "Comment réserver une session ?",
            cloud: "C’est quoi Branddeo Cloud ?",
          },
        },
      },
      en: {
        nav: {
          home: "Home",
          reservations: "Bookings",
          rushes: "Rushes",
          analytics: "Analytics",
          cloud: "Branddeo Cloud",
          subscription: "Subscription",
          profile: "Profile",
        },
        sidebar: {
          workspace: "Workspace",
          services: "Services",
          account: "Account",
          language: "Language",
        },
        topbar: {
          search: "Search…",
          searchHint: "Ctrl K",
          credits: "Credits",
          bookSession: "Book a session",
        },
        search: {
          title: "Search",
          description: "Search a page, booking, rush…",
          pages: "Pages",
          actions: "Actions",
          reservations: "Bookings",
          rushes: "Rushes",
          cloud: "Branddeo Cloud",
          empty: "No results.",
        },
        statuses: {
          confirmed: "Confirmed",
          pending: "Pending",
          cancelled: "Cancelled",
          ready: "Ready",
          processing: "Processing",
        },
        ai: {
          title: "Branddeo AI",
          description:
            "Ask about Branddeo (bookings, rushes, cloud, billing…).",
          placeholder: "Type your question…",
          suggestions: {
            rushes: "Where are my rushes?",
            book: "How do I book a session?",
            cloud: "What is Branddeo Cloud?",
          },
        },
      },
    }),
    []
  )

  const t = useMemo(() => dict[lang], [dict, lang])
  return { lang, setLang, t }
}

function SidebarNav({
  collapsed,
  onNavigate,
  t,
}: {
  collapsed: boolean
  onNavigate?: () => void
  t: ReturnType<typeof useI18n>["t"]
}) {
  const sections = useMemo(
    () => [
      {
        label: t.sidebar.workspace,
        items: [
          { to: "/", label: t.nav.home, icon: Home },
          { to: "/reservations", label: t.nav.reservations, icon: Calendar },
          { to: "/rushes", label: t.nav.rushes, icon: Film },
        ] satisfies NavItem[],
      },
      {
        label: t.sidebar.services,
        items: [
          { to: "/cloud", label: t.nav.cloud, icon: Cloud },
          { to: "/analytics", label: t.nav.analytics, icon: BarChart3 },
        ] satisfies NavItem[],
      },
      {
        label: t.sidebar.account,
        items: [
          { to: "/abonnement", label: t.nav.subscription, icon: BadgeCheck },
          { to: "/profil", label: t.nav.profile, icon: User },
        ] satisfies NavItem[],
      },
    ],
    [t]
  )

  return (
    <nav className="flex flex-col gap-1">
      {sections.map((section) => (
        <div key={section.label} className="space-y-1">
          {!collapsed ? (
            <div className="px-3 pt-3 text-[11px] font-semibold tracking-widest text-muted-foreground">
              {section.label.toUpperCase()}
            </div>
          ) : null}
          {section.items.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    "group relative flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-semibold tracking-wide transition-colors",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive &&
                      "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm",
                    collapsed && "justify-center px-2"
                  )
                }
              >
                <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-primary opacity-0 transition-opacity group-aria-[current=page]:opacity-100" />
                <Icon className="size-4 shrink-0" />
                <span className={cn("truncate", collapsed && "hidden")}>
                  {item.label}
                </span>
              </NavLink>
            )
          })}
        </div>
      ))}
    </nav>
  )
}

function SidebarFooter({
  collapsed,
  lang,
  setLang,
  t,
}: {
  collapsed: boolean
  lang: Lang
  setLang: (lang: Lang) => void
  t: ReturnType<typeof useI18n>["t"]
}) {
  return (
    <div className="mt-auto space-y-4">
      <div className={cn("space-y-2", collapsed && "hidden")}>
        <div className="text-xs font-medium text-muted-foreground">{t.sidebar.language}</div>
        <Select value={lang} onValueChange={(v) => setLang(v === "en" ? "en" : "fr")}>
          <SelectTrigger className="h-10 w-full rounded-2xl">
            <SelectValue placeholder={lang === "fr" ? "Sélectionner" : "Select"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border border-sidebar-border bg-background px-3 py-3",
          collapsed && "justify-center px-2"
        )}
      >
        <Avatar className="size-9">
          <AvatarFallback className="bg-muted text-sm font-semibold">
            BD
          </AvatarFallback>
        </Avatar>
        <div className={cn("min-w-0", collapsed && "hidden")}>
          <div className="truncate text-sm font-semibold">Branddeo</div>
          <div className="truncate text-xs text-muted-foreground">
            branddeoagency.fr
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          className={cn("ml-auto", collapsed && "hidden")}
          asChild
        >
          <NavLink to="/profil" aria-label={lang === "fr" ? "Ouvrir le profil" : "Open profile"}>
            <Settings className="size-4" />
          </NavLink>
        </Button>
      </div>
    </div>
  )
}

function Sidebar({
  collapsed,
  setCollapsed,
  lang,
  setLang,
  t,
}: {
  collapsed: boolean
  setCollapsed: (next: boolean) => void
  lang: Lang
  setLang: (lang: Lang) => void
  t: ReturnType<typeof useI18n>["t"]
}) {
  return (
    <aside
      className={cn(
        "hidden h-svh flex-col overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex",
        collapsed ? "w-[72px]" : "w-[280px]"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-4",
          collapsed && "flex-col gap-2"
        )}
      >
        <NavLink
          to="/"
          end
          className={cn(
            "flex w-full items-center gap-3 rounded-3xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
            collapsed ? "justify-center" : "min-w-0 flex-1"
          )}
        >
          <div
            className={cn(
              "w-full rounded-3xl",
              collapsed && "bg-white shadow-sm ring-1 ring-black/5",
              collapsed ? "size-11" : "h-11"
            )}
          >
            <img
              src={collapsed ? "/branddeo_smal_logo.png" : "/branddeo_logo.png"}
              alt="Branddeo"
              className="block h-full w-full object-contain"
            />
          </div>
        </NavLink>

        <Button
          variant="ghost"
          size="icon-sm"
          type="button"
          className={cn(!collapsed && "ml-auto")}
          onClick={() => setCollapsed(!collapsed)}
        >
          <span className="sr-only">
            {collapsed
              ? lang === "fr"
                ? "Étendre la sidebar"
                : "Expand sidebar"
              : lang === "fr"
                ? "Réduire la sidebar"
                : "Collapse sidebar"}
          </span>
          {collapsed ? (
            <PanelLeftOpen className="size-4" />
          ) : (
            <PanelLeftClose className="size-4" />
          )}
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-4 px-3 pb-4">
        <div className="space-y-2 py-1">
          {!collapsed ? <div className="px-3 pt-1" /> : null}
          <SidebarNav collapsed={collapsed} t={t} />
        </div>
        <div className="mt-auto">
          <SidebarFooter collapsed={collapsed} lang={lang} setLang={setLang} t={t} />
        </div>
      </div>
    </aside>
  )
}

function MobileSidebar({
  open,
  onOpenChange,
  lang,
  setLang,
  t,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  lang: Lang
  setLang: (lang: Lang) => void
  t: ReturnType<typeof useI18n>["t"]
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="size-11 rounded-3xl bg-white shadow-sm ring-1 ring-black/5 md:hidden"
          aria-label="Ouvrir le menu"
        >
          <img
            src="/branddeo_smal_logo.png"
            alt="Branddeo"
            className="h-full w-full object-contain"
          />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[320px] p-0">
        <SheetHeader className="border-b border-sidebar-border px-4 py-4">
          <SheetTitle className="flex items-center gap-3 text-base">
            <div className="min-w-0">
              <div className="inline-flex rounded-2xl bg-white px-2.5 py-2">
                <img
                  src="/branddeo_logo.png"
                  alt="Branddeo"
                  className="h-9 w-auto object-contain"
                />
              </div>
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="flex h-full flex-col bg-sidebar px-3 py-4 text-sidebar-foreground">
          <SidebarNav
            collapsed={false}
            onNavigate={() => onOpenChange(false)}
            t={t}
          />
          <div className="mt-auto pt-4">
            <div className="space-y-3 rounded-2xl border border-sidebar-border bg-background px-3 py-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Branddeo</div>
                <div className="text-xs text-muted-foreground">
                  branddeoagency.fr
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">
                  {t.sidebar.language}
                </div>
                <Select
                  value={lang}
                  onValueChange={(v) => setLang(v === "en" ? "en" : "fr")}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder={lang === "fr" ? "Sélectionner" : "Select"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default function DashboardLayout() {
  const navigate = useNavigate()
  const cardIdRef = useRef(0)
  const [reservationSeq, setReservationSeq] = useLocalStorageState<number>(
    "branddeo.seq.reservations",
    3
  )
  const [collapsed, setCollapsed] = useLocalStorageBoolean(
    "branddeo.sidebar.collapsed",
    false
  )
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggle } = useTheme()
  const { lang, setLang, t } = useI18n()
  const [searchOpen, setSearchOpen] = useState(false)
  const [credits, setCredits] = useLocalStorageState<number>(
    "branddeo.credits",
    0
  )
  const [cloud, setCloud] = useLocalStorageState<CloudState>("branddeo.cloud", {
    enabled: false,
    storageGb: 100,
    usedGb: 12,
    priceEurMonthly: 5,
    retentionDaysWithoutCloud: 7,
  })
  const [cards, setCards] = useLocalStorageState<PaymentCard[]>(
    "branddeo.cards",
    []
  )
  const [reservations, setReservations] = useLocalStorageState<Reservation[]>(
    "branddeo.reservations",
    [
      {
        id: "res_01",
        studio: "Studio Branddeo",
        studioId: "branddeo",
        start: "2026-04-10T10:00:00.000Z",
        end: "2026-04-10T11:30:00.000Z",
        status: "confirmed",
      },
      {
        id: "res_02",
        studio: "Studio Branddeo",
        studioId: "branddeo",
        start: "2026-04-14T14:00:00.000Z",
        end: "2026-04-14T15:00:00.000Z",
        status: "pending",
      },
      {
        id: "res_03",
        studio: "Studio Branddeo",
        studioId: "branddeo",
        start: "2026-04-22T09:00:00.000Z",
        end: "2026-04-22T10:00:00.000Z",
        status: "cancelled",
      },
    ]
  )
  const [rushes, setRushes] = useLocalStorageState<RushItem[]>("branddeo.rushes", [
    {
      id: "rush_01",
      title: "Session Branddeo — Rush 01",
      studio: "Studio Branddeo",
      studioId: "branddeo",
      date: "2026-04-10T13:30:00.000Z",
      status: "ready",
    },
    {
      id: "rush_02",
      title: "Podcast — Master audio",
      studio: "Studio Branddeo",
      studioId: "branddeo",
      date: "2026-04-12T17:05:00.000Z",
      status: "processing",
    },
    {
      id: "rush_03",
      title: "Interview — Rush brut",
      studio: "Studio Branddeo",
      studioId: "branddeo",
      date: "2026-04-14T09:15:00.000Z",
      status: "ready",
    },
  ])

  const addCredits = (amount: number) => {
    setCredits((prev) => Math.max(0, prev + amount))
  }

  const setCloudEnabled = (enabled: boolean) => {
    setCloud((prev) => ({ ...prev, enabled }))
  }

  const addCard = (card: Omit<PaymentCard, "id">) => {
    setCards((prev) => {
      cardIdRef.current += 1
      const id = `card_${cardIdRef.current}`
      const next = [{ id, ...card }, ...prev]
      if (next.length === 1) next[0] = { ...next[0], isDefault: true }
      return next
    })
  }

  const removeCard = (id: string) => {
    setCards((prev) => {
      const next = prev.filter((c) => c.id !== id)
      if (next.length > 0 && !next.some((c) => c.isDefault)) {
        next[0] = { ...next[0], isDefault: true }
      }
      return next
    })
  }

  const setDefaultCard = (id: string) => {
    setCards((prev) => prev.map((c) => ({ ...c, isDefault: c.id === id })))
  }

  const addReservation = (payload: Omit<Reservation, "id">) => {
    setReservationSeq((prev) => {
      const next = prev + 1
      setReservations((list) => [{ id: `res_${next}`, ...payload }, ...list])
      return next
    })
  }

  const data = {
    user: { firstName: "Alex", lastName: "Branddeo" },
    credits,
    cloud,
    cards,
    reservations,
    rushes,
  }

  const actions = {
    addCredits,
    setCloudEnabled,
    addCard,
    removeCard,
    setDefaultCard,
    addReservation,
    setRushes,
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const go = (to: string) => {
    navigate(to)
    setSearchOpen(false)
  }

  return (
    <div className="min-h-svh bg-muted/30">
      <div className="mx-auto flex min-h-svh max-w-[1480px]">
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          lang={lang}
          setLang={setLang}
          t={t}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-3 px-4 py-3 md:px-6">
              <div className="flex items-center gap-2 md:hidden">
                <MobileSidebar
                  open={mobileOpen}
                  onOpenChange={setMobileOpen}
                  lang={lang}
                  setLang={setLang}
                  t={t}
                />
              </div>

              <div className="hidden flex-1 items-center gap-3 md:flex">
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="group flex h-10 w-full max-w-[560px] items-center gap-3 rounded-3xl border bg-background px-3 text-left text-sm text-muted-foreground shadow-xs transition-colors hover:bg-muted/40"
                >
                  <Search className="size-4" />
                  <span className="flex-1">{t.topbar.search}</span>
                  <span className="rounded-2xl bg-muted px-2 py-1 text-xs font-semibold tracking-wide text-foreground/70">
                    {t.topbar.searchHint}
                  </span>
                </button>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="rounded-full"
                  onClick={toggle}
                >
                  <span className="sr-only">
                    {theme === "dark" ? "Activer le mode clair" : "Activer le mode sombre"}
                  </span>
                  {theme === "dark" ? (
                    <Sun className="size-4" />
                  ) : (
                    <Moon className="size-4" />
                  )}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  className="rounded-full"
                  onClick={() => navigate("/abonnement")}
                >
                  <Coins className="size-4" />
                  <span className="tabular-nums">{credits}</span>
                </Button>
                <Button
                  size="sm"
                  type="button"
                  className="rounded-full"
                  onClick={() => navigate("/reservations?intent=book")}
                >
                  {t.topbar.bookSession}
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 md:px-6">
            <Outlet
              context={{
                lang,
                t,
                data: {
                  ...data,
                },
                actions,
                format: {
                  dateTime: (iso: string) => formatDateTime(iso, lang),
                  timeRange: (startIso: string, endIso: string) =>
                    formatTimeRange(startIso, endIso, lang),
                },
                ui: {
                  openSearch: () => setSearchOpen(true),
                },
              }}
            />
          </main>
        </div>
      </div>

      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen} title={t.search.title} description={t.search.description}>
        <Command>
          <CommandInput placeholder={t.search.description} />
          <CommandList>
            <CommandEmpty>{t.search.empty}</CommandEmpty>
            <CommandGroup heading={t.search.pages}>
              <CommandItem value={`home ${t.nav.home}`} onSelect={() => go("/")}>
                <Home className="size-4" />
                {t.nav.home}
                <CommandShortcut>G</CommandShortcut>
              </CommandItem>
              <CommandItem
                value={`reservations ${t.nav.reservations}`}
                onSelect={() => go("/reservations")}
              >
                <Calendar className="size-4" />
                {t.nav.reservations}
              </CommandItem>
              <CommandItem value={`rushes ${t.nav.rushes}`} onSelect={() => go("/rushes")}>
                <Film className="size-4" />
                {t.nav.rushes}
              </CommandItem>
              <CommandItem value={`analytics ${t.nav.analytics}`} onSelect={() => go("/analytics")}>
                <BarChart3 className="size-4" />
                {t.nav.analytics}
              </CommandItem>
              <CommandItem value={`cloud ${t.nav.cloud}`} onSelect={() => go("/cloud")}>
                <Cloud className="size-4" />
                {t.nav.cloud}
              </CommandItem>
              <CommandItem
                value={`subscription ${t.nav.subscription}`}
                onSelect={() => go("/abonnement")}
              >
                <BadgeCheck className="size-4" />
                {t.nav.subscription}
              </CommandItem>
              <CommandItem value={`profile ${t.nav.profile}`} onSelect={() => go("/profil")}>
                <User className="size-4" />
                {t.nav.profile}
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading={t.search.actions}>
              <CommandItem
                value={`action ${t.topbar.bookSession}`}
                onSelect={() => go("/reservations?intent=book")}
              >
                <Calendar className="size-4" />
                {t.topbar.bookSession}
              </CommandItem>
              <CommandItem
                value={`action ${lang === "fr" ? "Gérer la facturation" : "Manage billing"}`}
                onSelect={() => go("/profil?tab=billing")}
              >
                <Settings className="size-4" />
                {lang === "fr" ? "Gérer la facturation" : "Manage billing"}
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading={t.search.reservations}>
              {data.reservations.slice(0, 3).map((r) => (
                <CommandItem
                  key={r.id}
                  value={`res-${r.id}`}
                  onSelect={() => go(`/reservations?q=${encodeURIComponent(r.studio)}`)}
                >
                  <Calendar className="size-4" />
                  <div className="flex min-w-0 flex-col">
                    <div className="truncate">{r.studio}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {formatDateTime(r.start, lang)}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading={t.search.rushes}>
              {data.rushes.slice(0, 3).map((r) => (
                <CommandItem
                  key={r.id}
                  value={`rush-${r.id}`}
                  onSelect={() => go(`/rushes?q=${encodeURIComponent(r.title)}`)}
                >
                  <Film className="size-4" />
                  <div className="flex min-w-0 flex-col">
                    <div className="truncate">{r.title}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {r.studio}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>

      <BranddeoAi
        lang={lang}
        t={t}
        cloud={cloud}
        onGo={(to) => go(to)}
      />
    </div>
  )
}

function BranddeoAi({
  lang,
  t,
  cloud,
  onGo,
}: {
  lang: Lang
  t: ReturnType<typeof useI18n>["t"]
  cloud: CloudState
  onGo: (to: string) => void
}) {
  const [open, setOpen] = useState(false)
  const messageIdRef = useRef(0)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<
    Array<{ id: string; role: "user" | "assistant"; content: string }>
  >(() => [
    {
      id: "m_welcome",
      role: "assistant",
      content:
        lang === "fr"
          ? "Je suis Branddeo AI. Je peux t’aider à trouver tes rushes, réserver une session, ou comprendre Branddeo Cloud."
          : "I’m Branddeo AI. I can help you find your rushes, book a session, or understand Branddeo Cloud.",
    },
  ])

  const answer = (questionRaw: string) => {
    const q = questionRaw.trim().toLowerCase()
    if (!q) return ""

    const mentionsRush = q.includes("rush") || q.includes("export") || q.includes("video")
    const mentionsBook =
      q.includes("réserver") ||
      q.includes("reservation") ||
      q.includes("booking") ||
      q.includes("session")
    const mentionsCloud = q.includes("cloud") || q.includes("stock") || q.includes("sauveg")
    const mentionsCard = q.includes("carte") || q.includes("card") || q.includes("paiement")
    const mentionsCredits = q.includes("crédit") || q.includes("credit")
    const mentionsAnalytics = q.includes("stats") || q.includes("analyt") || q.includes("analytics")

    if (mentionsRush && !cloud.enabled) {
      return lang === "fr"
        ? `Tes rushes sont dans “Rushes”. Sans Branddeo Cloud, ils restent disponibles ${cloud.retentionDaysWithoutCloud} jours. Pour tout conserver et prévisualiser dans le cloud, active Branddeo Cloud.`
        : `Your rushes are in “Rushes”. Without Branddeo Cloud, they stay available for ${cloud.retentionDaysWithoutCloud} days. To keep everything and preview in the cloud, enable Branddeo Cloud.`
    }

    if (mentionsRush && cloud.enabled) {
      return lang === "fr"
        ? "Va dans “Branddeo Cloud” pour prévisualiser et gérer tes vidéos (cloud). Tu peux aussi aller dans “Rushes” pour les retrouver rapidement."
        : "Go to “Branddeo Cloud” to preview and manage your videos in the cloud. You can also use “Rushes” to find them quickly."
    }

    if (mentionsBook) {
      return lang === "fr"
        ? "Pour réserver : ouvre “Réservations” puis clique “Réserver une session”. Tu peux filtrer par date/studio et valider."
        : "To book: open “Bookings”, then click “Book a session”. You can filter by date/studio and confirm."
    }

    if (mentionsCloud) {
      return lang === "fr"
        ? `Branddeo Cloud sauvegarde tes rushes et te permet la prévisualisation en ligne. Offre mock : ${cloud.priceEurMonthly}€ / mois pour ${cloud.storageGb}Go.`
        : `Branddeo Cloud saves your rushes and enables online preview. Mock plan: €${cloud.priceEurMonthly}/month for ${cloud.storageGb}GB.`
    }

    if (mentionsCredits) {
      return lang === "fr"
        ? "Les crédits ne sont pas mensuels : tu peux en acheter et ils restent dans ton compte. Va dans “Abonnement” pour gérer les crédits."
        : "Credits are not monthly: you can buy them and they stay on your account. Go to “Subscription” to manage credits."
    }

    if (mentionsCard) {
      return lang === "fr"
        ? "Tu peux ajouter une carte dans Profil → Factures. On ne stocke pas de carte côté backend : c’est une interface mock pour l’UX."
        : "You can add a card in Profile → Invoices. We’re not storing cards on the backend: it’s a mock UI for UX."
    }

    if (mentionsAnalytics) {
      return lang === "fr"
        ? "Va dans “Analytique” pour voir l’activité, les exports et l’utilisation."
        : "Go to “Analytics” to see activity, exports and usage."
    }

    return lang === "fr"
      ? "Je peux aider sur : réserver une session, retrouver les rushes, Branddeo Cloud, crédits, facturation. Dis-moi ce que tu cherches."
      : "I can help with: booking a session, finding rushes, Branddeo Cloud, credits, billing. Tell me what you need."
  }

  const sendMessage = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    messageIdRef.current += 1
    const userId = `m_u_${messageIdRef.current}`
    messageIdRef.current += 1
    const assistantId = `m_a_${messageIdRef.current}`
    const response = answer(trimmed)

    setMessages((prev) => [
      ...prev,
      { id: userId, role: "user", content: trimmed },
      { id: assistantId, role: "assistant", content: response },
    ])
    setInput("")
  }

  const suggestions = [
    t.ai.suggestions.rushes,
    t.ai.suggestions.book,
    t.ai.suggestions.cloud,
  ]

  return (
    <>
      <div className="fixed right-4 bottom-4 z-40">
        {open ? (
          <div className="w-[360px] overflow-hidden rounded-4xl border bg-background shadow-xl">
            <div className="flex items-start justify-between gap-3 border-b px-4 py-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="size-4 text-primary" />
                  {t.ai.title}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {t.ai.description}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                type="button"
                className="rounded-full"
                onClick={() => setOpen(false)}
              >
                <span className="sr-only">{lang === "fr" ? "Fermer" : "Close"}</span>
                <X className="size-4" />
              </Button>
            </div>

            <div className="px-4 pt-3">
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <Button
                    key={s}
                    variant="secondary"
                    size="sm"
                    type="button"
                    className="rounded-full"
                    onClick={() => sendMessage(s)}
                  >
                    {s}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  className="rounded-full"
                  onClick={() => onGo("/cloud")}
                >
                  {lang === "fr" ? "Cloud" : "Cloud"}
                </Button>
              </div>
            </div>

            <div className="px-4 py-4">
              <ScrollArea className="h-[260px] rounded-3xl border bg-muted/10 p-3">
                <div className="space-y-3">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={cn(
                        "max-w-[90%] rounded-3xl px-4 py-3 text-sm leading-relaxed",
                        m.role === "assistant"
                          ? "bg-muted text-foreground"
                          : "ml-auto bg-primary text-primary-foreground"
                      )}
                    >
                      {m.content}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="border-t px-4 py-4">
              <form
                className="flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  sendMessage(input)
                }}
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t.ai.placeholder}
                  className="h-11 rounded-3xl"
                />
                <Button
                  type="submit"
                  className="h-11 rounded-3xl"
                  disabled={!input.trim()}
                >
                  <Send className="size-4" />
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20"
          >
            <Sparkles className="size-4" />
            Branddeo AI
          </button>
        )}
      </div>
    </>
  )
}
