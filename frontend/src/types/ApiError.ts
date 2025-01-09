// ApiError.ts
// Kļūdas no backend definēšana
// Autors: Kristofers Semjonovs

export declare type ApiError = {
  message: string
  response: {
    data: {
      message: string
    }
  }
}
