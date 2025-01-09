// LoadingBox.tsx
// Ielādes elementa izveide
// Autors: Kristofers Semjonovs

import Spinner from 'react-bootstrap/Spinner'

export default function LoadingBox() {
  return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  )
}
