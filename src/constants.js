// Catégories autorisées, alignées sur l'enum du backend Node.
export const CATEGORIES = [
  { value: 'cours', label: 'Cours' },
  { value: 'atelier', label: 'Atelier' },
  { value: 'conference', label: 'Conférence' },
  { value: 'networking', label: 'Networking' },
]

// Libellé lisible à partir de la valeur stockée.
export function categoryLabel(value) {
  return CATEGORIES.find((c) => c.value === value)?.label || value
}

// Formatte une date ISO en date française lisible.
export function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
