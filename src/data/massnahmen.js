export const MASSNAHMEN_TEMPLATE = [
  {
    gruppe: "Aktenarbeit",
    farbe: "#4A7FA5",
    items: [
      { id: "aktenexzerpt", label: "Aktenexzerpt" },
      { id: "beweisfragen_uebersetzung", label: "Übersetzung Beweisfragen" },
      { id: "literaturrecherche", label: "Literaturrecherche / Methodenplan" },
    ]
  },
  {
    gruppe: "Explorationen",
    farbe: "#5B9E7A",
    items: [
      { id: "exp_mutter", label: "Exploration Mutter" },
      { id: "exp_vater", label: "Exploration Vater" },
      { id: "exp_jugendamt", label: "Exploration Jugendamt" },
      { id: "exp_vb", label: "Exploration Verfahrensbeistand" },
      { id: "exp_kind", label: "Exploration Kind (falls vorgesehen)" },
      { id: "exp_weitere", label: "Weitere Beteiligte" },
    ]
  },
  {
    gruppe: "Diagnostik & Beobachtung",
    farbe: "#8B6BAE",
    items: [
      { id: "hausbesuch_mutter", label: "Hausbesuch Mutter" },
      { id: "hausbesuch_vater", label: "Hausbesuch Vater" },
      { id: "interaktionsbeobachtung_mutter", label: "Interaktionsbeobachtung Mutter–Kind" },
      { id: "interaktionsbeobachtung_vater", label: "Interaktionsbeobachtung Vater–Kind" },
      { id: "testdiagnostik", label: "Testdiagnostik / Fragebogenverfahren" },
    ]
  },
  {
    gruppe: "Gutachtenerstellung",
    farbe: "#C8922A",
    items: [
      { id: "befunddarstellung", label: "Befunddarstellung" },
      { id: "beurteilung", label: "Psychologische Beurteilung" },
      { id: "beantwortung_bf", label: "Beantwortung der Beweisfragen" },
      { id: "korrektur", label: "Korrektur / Endredaktion" },
      { id: "abgabe", label: "Abgabe ans Gericht" },
    ]
  }
]

export function getProgress(erledigte, template) {
  const alle = template.flatMap(g => g.items)
  const gesamt = alle.length
  const erledigt = alle.filter(i => erledigte[i.id]).length
  return { erledigt, gesamt, prozent: gesamt > 0 ? Math.round((erledigt / gesamt) * 100) : 0 }
}

export function getGruppenProgress(erledigte, template) {
  return template.map(gruppe => {
    const gesamt = gruppe.items.length
    const erledigt = gruppe.items.filter(i => erledigte[i.id]).length
    return { ...gruppe, erledigt, gesamt, prozent: Math.round((erledigt / gesamt) * 100) }
  })
}
