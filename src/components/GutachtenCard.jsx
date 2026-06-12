import { MASSNAHMEN_TEMPLATE, getGruppenProgress } from '../data/massnahmen'

function getFristStatus(fristStr) {
  const heute = new Date()
  const frist = new Date(fristStr.split('.').reverse().join('-'))
  const diffTage = Math.ceil((frist - heute) / (1000 * 60 * 60 * 24))
  if (diffTage < 0) return { klasse: 'frist-ueberschritten', label: `${Math.abs(diffTage)}d überfällig` }
  if (diffTage <= 21) return { klasse: 'frist-nah', label: `${diffTage}d verbleibend` }
  return { klasse: 'frist-ok', label: `${diffTage}d verbleibend` }
}

export function GutachtenCard({ gutachten, onClick }) {
  const erledigte = gutachten.erledigte || {}
  const gruppenProgress = getGruppenProgress(erledigte, MASSNAHMEN_TEMPLATE)
  const fristStatus = getFristStatus(gutachten.frist)

  const gesamtItems = MASSNAHMEN_TEMPLATE.flatMap(g => g.items).length
  const erledigteAnzahl = MASSNAHMEN_TEMPLATE.flatMap(g => g.items).filter(i => erledigte[i.id]).length
  const prozent = Math.round((erledigteAnzahl / gesamtItems) * 100)

  return (
    <button className="gutachten-card" onClick={() => onClick(gutachten)}>
      <div className="card-header">
        <h2 className="card-name">{gutachten.name}</h2>
        <span className={`frist-badge ${fristStatus.klasse}`}>{fristStatus.label}</span>
      </div>

      <div className="card-meta">
        <div className="meta-row">
          <span className="meta-label">Az.</span>
          <span className="meta-value">{gutachten.aktenzeichen}</span>
        </div>
        <div className="meta-row">
          <span className="meta-label">Richterin</span>
          <span className="meta-value">{gutachten.richterin}</span>
        </div>
        <div className="meta-row">
          <span className="meta-label">Frist</span>
          <span className="meta-value">{gutachten.frist}</span>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <span className="progress-label">Bearbeitungsstand</span>
          <span className="progress-percent">{prozent}%</span>
        </div>
        <div className="segmented-bar">
          {gruppenProgress.map((gruppe, i) => (
            <div
              key={i}
              className="bar-segment"
              title={`${gruppe.gruppe}: ${gruppe.erledigt}/${gruppe.gesamt}`}
              style={{
                flex: gruppe.gesamt,
                backgroundColor: gruppe.erledigt === gruppe.gesamt
                  ? gruppe.farbe
                  : gruppe.erledigt > 0
                    ? gruppe.farbe + '88'
                    : gruppe.farbe + '22',
              }}
            >
              {gruppe.items.map((item, j) => (
                <div
                  key={j}
                  className="bar-pip"
                  style={{
                    backgroundColor: erledigte[item.id] ? gruppe.farbe : 'transparent',
                    borderColor: gruppe.farbe + '66',
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="bar-legend">
          {gruppenProgress.map((gruppe, i) => (
            <div key={i} className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: gruppe.farbe }} />
              <span className="legend-text">{gruppe.gruppe}</span>
              <span className="legend-count">{gruppe.erledigt}/{gruppe.gesamt}</span>
            </div>
          ))}
        </div>
      </div>
    </button>
  )
}
