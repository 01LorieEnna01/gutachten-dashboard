import { useState } from 'react'
import { MASSNAHMEN_TEMPLATE } from '../data/massnahmen'
import { supabase } from '../supabaseClient'

export function GutachtenDetail({ gutachten, onBack, onUpdate }) {
  const [erledigte, setErledigte] = useState(gutachten.erledigte || {})
  const [saving, setSaving] = useState(false)
  const [notiz, setNotiz] = useState(gutachten.notiz || '')
  const [notizSaving, setNotizSaving] = useState(false)

  async function toggleItem(itemId) {
    const neu = { ...erledigte, [itemId]: !erledigte[itemId] }
    setErledigte(neu)
    setSaving(true)
    try {
      await supabase
        .from('gutachten')
        .update({ erledigte: neu })
        .eq('id', gutachten.id)
      onUpdate({ ...gutachten, erledigte: neu })
    } catch (err) {
      console.error(err)
    }
    setSaving(false)
  }

  async function saveNotiz() {
    setNotizSaving(true)
    try {
      await supabase
        .from('gutachten')
        .update({ notiz })
        .eq('id', gutachten.id)
      onUpdate({ ...gutachten, notiz })
    } catch (err) {
      console.error(err)
    }
    setNotizSaving(false)
  }

  const gesamtItems = MASSNAHMEN_TEMPLATE.flatMap(g => g.items).length
  const erledigteAnzahl = MASSNAHMEN_TEMPLATE.flatMap(g => g.items).filter(i => erledigte[i.id]).length

  return (
    <div className="detail-view">
      <div className="detail-topbar">
        <button className="back-btn" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Übersicht
        </button>
        <div className="detail-status">
          {saving && <span className="saving-indicator">Speichern…</span>}
          <span className="detail-progress-text">{erledigteAnzahl} / {gesamtItems} Maßnahmen</span>
        </div>
      </div>

      <div className="detail-header">
        <div>
          <h1 className="detail-name">{gutachten.name}</h1>
          <div className="detail-meta">
            <span>{gutachten.aktenzeichen}</span>
            <span className="meta-divider">·</span>
            <span>Richterin {gutachten.richterin}</span>
            <span className="meta-divider">·</span>
            <span>Frist {gutachten.frist}</span>
          </div>
        </div>
      </div>

      <div className="massnahmen-grid">
        {MASSNAHMEN_TEMPLATE.map((gruppe, gi) => (
          <div key={gi} className="gruppe-card">
            <div className="gruppe-header" style={{ borderColor: gruppe.farbe }}>
              <span className="gruppe-dot" style={{ backgroundColor: gruppe.farbe }} />
              <h3 className="gruppe-titel">{gruppe.gruppe}</h3>
              <span className="gruppe-count" style={{ color: gruppe.farbe }}>
                {gruppe.items.filter(i => erledigte[i.id]).length}/{gruppe.items.length}
              </span>
            </div>
            <ul className="item-list">
              {gruppe.items.map((item, ii) => {
                const done = !!erledigte[item.id]
                return (
                  <li key={ii} className="item-row">
                    <button
                      className={`item-btn ${done ? 'item-done' : ''}`}
                      onClick={() => toggleItem(item.id)}
                    >
                      <span
                        className="item-checkbox"
                        style={{
                          backgroundColor: done ? gruppe.farbe : 'transparent',
                          borderColor: done ? gruppe.farbe : '#CBD5E1',
                        }}
                      >
                        {done && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5L4.5 7.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        )}
                      </span>
                      <span className="item-label">{item.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="notiz-section">
        <h3 className="notiz-titel">Fallnotizen</h3>
        <textarea
          className="notiz-textarea"
          value={notiz}
          onChange={e => setNotiz(e.target.value)}
          placeholder="Besonderheiten, offene Fragen, nächste Schritte…"
          rows={4}
        />
        <button
          className="notiz-save-btn"
          onClick={saveNotiz}
          disabled={notizSaving}
        >
          {notizSaving ? 'Gespeichert' : 'Notiz speichern'}
        </button>
      </div>
    </div>
  )
}
