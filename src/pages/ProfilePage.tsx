import { useMemo, useState } from "react"
import { useOutletContext, useSearchParams } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type DashboardOutletContext = {
  lang: "fr" | "en"
  data: {
    cards: Array<{
      id: string
      brand: "visa" | "mastercard" | "amex" | "other"
      last4: string
      expMonth: string
      expYear: string
      nameOnCard: string
      isDefault?: boolean
    }>
  }
  actions: {
    addCard: (card: {
      brand: "visa" | "mastercard" | "amex" | "other"
      last4: string
      expMonth: string
      expYear: string
      nameOnCard: string
      isDefault?: boolean
    }) => void
    removeCard: (id: string) => void
    setDefaultCard: (id: string) => void
  }
}

function detectBrand(digits: string) {
  if (digits.startsWith("4")) return "visa"
  if (digits.startsWith("34") || digits.startsWith("37")) return "amex"
  const prefix2 = Number(digits.slice(0, 2))
  if (prefix2 >= 51 && prefix2 <= 55) return "mastercard"
  return "other" as const
}

function formatBrand(brand: DashboardOutletContext["data"]["cards"][number]["brand"]) {
  switch (brand) {
    case "visa":
      return "VISA"
    case "mastercard":
      return "Mastercard"
    case "amex":
      return "Amex"
    default:
      return "Card"
  }
}

export default function ProfilePage() {
  const { lang, data, actions } = useOutletContext<DashboardOutletContext>()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get("tab") ?? "infos"

  const [firstName, setFirstName] = useState("Fanel")
  const [lastName, setLastName] = useState("Branddeo")
  const [phone, setPhone] = useState("+33 6 00 00 00 00")
  const [company, setCompany] = useState("Branddeo")
  const [vat, setVat] = useState("FR00000000000")

  const [cardName, setCardName] = useState("Fanel Branddeo")
  const [cardNumber, setCardNumber] = useState("")
  const [expMonth, setExpMonth] = useState("")
  const [expYear, setExpYear] = useState("")
  const [cvc, setCvc] = useState("")

  const cardDisclaimer = useMemo(
    () =>
      lang === "fr"
        ? "Interface mock : aucune carte n’est envoyée au backend (pas de processing de paiement). On conserve uniquement les 4 derniers chiffres + date d’expiration (local)."
        : "Mock UI: no card data is sent to the backend (no payment processing). We only keep last 4 digits + expiry (local).",
    [lang]
  )

  const addCardFromForm = () => {
    const digits = cardNumber.replace(/\D/g, "")
    const last4 = digits.slice(-4)
    if (!last4 || expMonth.length < 1 || expYear.length < 2) return
    actions.addCard({
      brand: detectBrand(digits),
      last4,
      expMonth: expMonth.padStart(2, "0").slice(0, 2),
      expYear: expYear.slice(-2),
      nameOnCard: cardName.trim() || "Branddeo",
    })
    setCardNumber("")
    setExpMonth("")
    setExpYear("")
    setCvc("")
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {lang === "fr" ? "Profil" : "Profile"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {lang === "fr"
            ? "Gérez vos informations et votre sécurité."
            : "Manage your details and security."}
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setSearchParams({ tab: v }, { replace: true })}
        className="w-full"
      >
        <TabsList className="w-full justify-start rounded-full sm:w-auto">
          <TabsTrigger value="infos" className="rounded-full">
            {lang === "fr" ? "Informations personnelles" : "Personal info"}
          </TabsTrigger>
          <TabsTrigger value="password" className="rounded-full">
            {lang === "fr" ? "Mot de passe" : "Password"}
          </TabsTrigger>
          <TabsTrigger value="billing" className="rounded-full">
            {lang === "fr" ? "Factures" : "Invoices"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="infos" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {lang === "fr" ? "Informations personnelles" : "Personal info"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value="contact@branddeoagency.fr" disabled />
                <div className="text-xs text-muted-foreground">
                  {lang === "fr"
                    ? "L’email ne peut pas être modifié."
                    : "Email cannot be changed."}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstname">
                    {lang === "fr" ? "Prénom" : "First name"}
                  </Label>
                  <Input
                    id="firstname"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname">
                    {lang === "fr" ? "Nom" : "Last name"}
                  </Label>
                  <Input
                    id="lastname"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  {lang === "fr" ? "Téléphone" : "Phone"}
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">
                  {lang === "fr" ? "Nom de l’entreprise" : "Company name"}
                </Label>
                <Input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vat">
                  {lang === "fr" ? "Numéro de TVA" : "VAT number"}
                </Label>
                <Input id="vat" value={vat} onChange={(e) => setVat(e.target.value)} />
                <div className="text-xs text-muted-foreground">
                  {lang === "fr"
                    ? "La TVA est appliquée selon votre statut."
                    : "VAT depends on your status."}
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="rounded-full" type="button">
                  {lang === "fr" ? "Enregistrer" : "Save changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {lang === "fr" ? "Mot de passe" : "Password"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="current">
                  {lang === "fr" ? "Mot de passe actuel" : "Current password"}
                </Label>
                <Input id="current" type="password" value="********" readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new">
                  {lang === "fr" ? "Nouveau mot de passe" : "New password"}
                </Label>
                <Input id="new" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">
                  {lang === "fr" ? "Confirmer" : "Confirm"}
                </Label>
                <Input id="confirm" type="password" placeholder="••••••••" />
              </div>
              <div className="flex justify-end">
                <Button className="rounded-full" type="button">
                  {lang === "fr" ? "Mettre à jour" : "Update"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle className="text-base">
                  {lang === "fr" ? "Moyens de paiement" : "Payment methods"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-xs text-muted-foreground">{cardDisclaimer}</div>

                <div className="space-y-3 rounded-3xl border p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="cardName">
                        {lang === "fr" ? "Nom sur la carte" : "Name on card"}
                      </Label>
                      <Input
                        id="cardName"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Fanel Branddeo"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="cardNumber">
                        {lang === "fr" ? "Numéro de carte" : "Card number"}
                      </Label>
                      <Input
                        id="cardNumber"
                        inputMode="numeric"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expMonth">
                        {lang === "fr" ? "Mois" : "Month"}
                      </Label>
                      <Input
                        id="expMonth"
                        inputMode="numeric"
                        value={expMonth}
                        onChange={(e) => setExpMonth(e.target.value)}
                        placeholder="MM"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expYear">
                        {lang === "fr" ? "Année" : "Year"}
                      </Label>
                      <Input
                        id="expYear"
                        inputMode="numeric"
                        value={expYear}
                        onChange={(e) => setExpYear(e.target.value)}
                        placeholder="YY"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input
                        id="cvc"
                        inputMode="numeric"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        placeholder="123"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button className="rounded-full" type="button" onClick={addCardFromForm}>
                      {lang === "fr" ? "Ajouter" : "Add"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {data.cards.length === 0 ? (
                    <div className="rounded-3xl border p-6 text-center text-sm text-muted-foreground">
                      {lang === "fr"
                        ? "Aucune carte enregistrée."
                        : "No saved cards."}
                    </div>
                  ) : (
                    data.cards.map((c) => (
                      <div
                        key={c.id}
                        className="flex flex-col gap-3 rounded-3xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-semibold">
                              {formatBrand(c.brand)} •••• {c.last4}
                            </div>
                            {c.isDefault ? (
                              <Badge className="rounded-full" variant="secondary">
                                {lang === "fr" ? "Par défaut" : "Default"}
                              </Badge>
                            ) : null}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {c.nameOnCard} • {c.expMonth}/{c.expYear}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            className="rounded-full"
                            onClick={() => actions.setDefaultCard(c.id)}
                          >
                            {lang === "fr" ? "Définir par défaut" : "Set default"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            className="rounded-full"
                            onClick={() => actions.removeCard(c.id)}
                          >
                            {lang === "fr" ? "Supprimer" : "Remove"}
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle className="text-base">
                  {lang === "fr" ? "Factures" : "Invoices"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-3xl border py-12 text-center text-sm text-muted-foreground">
                  {lang === "fr"
                    ? "Aucune facture disponible pour le moment."
                    : "No invoices available yet."}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
