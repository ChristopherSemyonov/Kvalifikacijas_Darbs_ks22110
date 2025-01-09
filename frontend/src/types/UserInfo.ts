// UserInfo.ts
// Lietotāja informācijas definēšana, dati, kuri nepieciešami reģistrētu lietotāju darbībām
// Autors: Kristofers Semjonovs

export type UserInfo = {
  name: string
  email: string
  token: string
  isAdmin: boolean
}
