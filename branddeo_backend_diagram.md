# Spécification backend (proposée) — Branddeo Client Dashboard

Ce dépôt est un frontend (pas d’API/DB). Le document ci-dessous est une **spécification backend déduite** à partir des écrans et des use cases implémentés dans le code : réservations (wizard), rappel, options, cloud, rushes, facturation (UI), auth (email + Google mock).

Objectif : fournir au développeur backend un **modèle de domaine** + une **base DB (ERD)** + un **contrat d’API** cohérents avec l’UI actuelle.

## Diagramme de classes (Mermaid) — Modèle de domaine backend

```mermaid
classDiagram
direction LR

class PersistencePort {
  <<interface>>
  +read(model, id): Json
  +write(model, id, body): Json
}

class LocalStorageAdapter {
  +read(model, id): Json
  +write(model, id, body): Json
}

class ApiAdapter {
  <<optional>>
  +get(path): Json
  +post(path, body): Json
}

class Account {
  +id: UUID
  +name: string
  +createdAt: ISODateTime
}

class User {
  +id: UUID
  +accountId: UUID
  +email: string
  +firstName: string
  +lastName: string
  +role: UserRole
  +status: UserStatus
  +createdAt: ISODateTime
}

class AuthIdentity {
  +id: UUID
  +userId: UUID
  +provider: AuthProvider
  +providerUserId: string
  +email: string
  +avatarUrl?: string
  +createdAt: ISODateTime
}

class Studio {
  +id: UUID
  +accountId: UUID
  +name: string
  +addressLine1: string
  +city: string
  +postalCode: string
  +country: string
}

class Booking {
  +id: UUID
  +accountId: UUID
  +studioId: UUID
  +createdByUserId: UUID
  +startAt: ISODateTime
  +endAt: ISODateTime
  +status: BookingStatus
  +participantsCount: int
  +studioCustomization: string
  +callbackAt?: ISODateTime
  +offerId?: UUID
  +currency: string
  +totalTtcCents: int
  +createdAt: ISODateTime
}

class Offer {
  +id: UUID
  +label: string
  +hours: int
  +priceTtcCents: int
  +priceHtCents: int
  +isPopular: boolean
  +includes: string[]
}

class AddOn {
  +id: UUID
  +label: string
  +description: string
  +priceTtcCents: int
}

class BookingAddOn {
  +bookingId: UUID
  +addOnId: UUID
  +quantity: int
  +unitPriceTtcCents: int
}

class Rush {
  +id: UUID
  +accountId: UUID
  +bookingId?: UUID
  +title: string
  +capturedAt: ISODateTime
  +status: RushStatus
}

class CloudSubscription {
  +accountId: UUID
  +enabled: boolean
  +planStorageGb: int
  +priceEurMonthlyCents: int
  +retentionDaysWithoutCloud: int
  +startedAt?: ISODateTime
}

class CloudAsset {
  +id: UUID
  +rushId: UUID
  +previewUrl: string
  +downloadUrl: string
  +expiresAt?: ISODateTime
}

class PaymentMethod {
  +id: UUID
  +accountId: UUID
  +provider: PaymentProvider
  +providerRef: string
  +brand: CardBrand
  +last4: string
  +expMonth: string
  +expYear: string
  +nameOnCard: string
  +isDefault: boolean
}

LocalStorageAdapter ..|> PersistencePort
ApiAdapter ..|> PersistencePort

Account "1" o-- "1..*" User : users
User "1" o-- "0..*" AuthIdentity : identities
Account "1" o-- "1..*" Studio : studios
Account "1" o-- "0..*" Booking : bookings
Booking "1" --> "1" Studio : studio
Booking "0..*" --> "0..1" Offer : offer
Booking "1" o-- "0..*" BookingAddOn : addOns
BookingAddOn "0..*" --> "1" AddOn : addOn
Account "1" o-- "0..*" Rush : rushes
Rush "0..*" --> "0..1" Booking : booking
Account "1" o-- "1" CloudSubscription : cloud
Rush "0..1" o-- "0..1" CloudAsset : cloudAsset
Account "1" o-- "0..*" PaymentMethod : paymentMethods

class BookingStatus {
  <<enumeration>>
  confirmed
  pending
  cancelled
}

class RushStatus {
  <<enumeration>>
  ready
  processing
}

class CardBrand {
  <<enumeration>>
  visa
  mastercard
  amex
  other
}

class Lang {
  <<enumeration>>
  fr
  en
}

class Theme {
  <<enumeration>>
  light
  dark
}

class ISODateTime {
  <<datatype>>
  string
}

class UUID {
  <<datatype>>
  string
}

class UserRole {
  <<enumeration>>
  owner
  member
}

class UserStatus {
  <<enumeration>>
  active
  disabled
}

class AuthProvider {
  <<enumeration>>
  google
  email
}

class PaymentProvider {
  <<enumeration>>
  stripe
  other
}
```

## ERD (Mermaid) — Schéma DB minimal (backend-ready)

```mermaid
erDiagram
  ACCOUNT ||--o{ USER : has
  USER ||--o{ AUTH_IDENTITY : has
  ACCOUNT ||--o{ STUDIO : has
  ACCOUNT ||--o{ BOOKING : has
  STUDIO ||--o{ BOOKING : hosts
  OFFER ||--o{ BOOKING : chosen
  BOOKING ||--o{ BOOKING_ADDON : has
  ADDON ||--o{ BOOKING_ADDON : referenced
  ACCOUNT ||--o{ RUSH : has
  BOOKING ||--o{ RUSH : produces
  ACCOUNT ||--|| CLOUD_SUBSCRIPTION : has
  RUSH ||--o| CLOUD_ASSET : stores
  ACCOUNT ||--o{ PAYMENT_METHOD : has

  ACCOUNT {
    uuid id PK
    string name
    datetime created_at
  }
  USER {
    uuid id PK
    uuid account_id FK
    string email
    string first_name
    string last_name
    string role
    string status
    datetime created_at
  }
  AUTH_IDENTITY {
    uuid id PK
    uuid user_id FK
    string provider
    string provider_user_id
    string email
    string avatar_url
    datetime created_at
  }
  STUDIO {
    uuid id PK
    uuid account_id FK
    string name
    string address_line1
    string city
    string postal_code
    string country
  }
  OFFER {
    uuid id PK
    string label
    int hours
    int price_ttc_cents
    int price_ht_cents
    boolean is_popular
  }
  BOOKING {
    uuid id PK
    uuid account_id FK
    uuid studio_id FK
    uuid created_by_user_id FK
    uuid offer_id FK
    datetime start_at
    datetime end_at
    string status
    int participants_count
    string studio_customization
    datetime callback_at
    string currency
    int total_ttc_cents
    datetime created_at
  }
  ADDON {
    uuid id PK
    string label
    string description
    int price_ttc_cents
  }
  BOOKING_ADDON {
    uuid booking_id PK, FK
    uuid addon_id PK, FK
    int quantity
    int unit_price_ttc_cents
  }
  RUSH {
    uuid id PK
    uuid account_id FK
    uuid booking_id FK
    string title
    datetime captured_at
    string status
  }
  CLOUD_SUBSCRIPTION {
    uuid account_id PK, FK
    boolean enabled
    int plan_storage_gb
    int price_eur_monthly_cents
    int retention_days_without_cloud
    datetime started_at
  }
  CLOUD_ASSET {
    uuid id PK
    uuid rush_id FK
    string preview_url
    string download_url
    datetime expires_at
  }
  PAYMENT_METHOD {
    uuid id PK
    uuid account_id FK
    string provider
    string provider_ref
    string brand
    string last4
    string exp_month
    string exp_year
    string name_on_card
    boolean is_default
  }
```

## Use cases (Mermaid) — Backend (endpoints attendus)

```mermaid
flowchart TB
  Actor((Client))

  subgraph Auth["Auth"]
    A1[POST /auth/login]
    A2[POST /auth/google]
    A3[POST /auth/register]
    A4[POST /auth/forgot-password]
    A5[POST /auth/reset-password]
    A6[POST /auth/confirm-email]
    A7[POST /auth/logout]
    A8[GET /me]
  end

  subgraph Booking["Bookings"]
    B1[GET /offers]
    B2[GET /addons]
    B3[GET /studios]
    B4[POST /bookings]
    B5[GET /bookings]
    B6[GET /bookings/:id]
    B7[PATCH /bookings/:id]
    B8[POST /bookings/:id/callback-request]
  end

  subgraph Rushes["Rushes & assets"]
    R1[GET /rushes]
    R2[GET /rushes/:id]
    R3[POST /rushes/:id/download]
    R4[POST /rushes/:id/preview]
  end

  subgraph Cloud["Cloud subscription"]
    C1[GET /cloud/subscription]
    C2[PATCH /cloud/subscription]
  end

  subgraph Billing["Billing (provider)"]
    F1[GET /billing/payment-methods]
    F2[POST /billing/payment-methods]
    F3[DELETE /billing/payment-methods/:id]
    F4[PATCH /billing/payment-methods/:id/default]
  end

  Actor --> Auth
  Actor --> Booking
  Actor --> Rushes
  Actor --> Cloud
  Actor --> Billing

  A1 --> A8
  A2 --> A8
  A3 --> A8
  A6 --> A8
  A8 --> B5
  B1 --> B4
  B2 --> B4
  B3 --> B4
  B4 --> B6
  B6 --> R1
  C2 --> R4
```

## Notes d’implémentation backend (points clés)
- Payment methods : ne jamais stocker le numéro de carte. Stocker un `provider_ref` (ex: Stripe PM id) + métadonnées (brand/last4/expiry).
- Booking “callback” : modélisé par `callback_at` (datetime) optionnel sur `booking`.
- Cloud preview : `CloudSubscription.enabled` pilote l’accès aux `CloudAsset.preview_url`.
- Rétention : `retention_days_without_cloud` (ex: 7 jours) sert à expirer les assets si cloud désactivé.
