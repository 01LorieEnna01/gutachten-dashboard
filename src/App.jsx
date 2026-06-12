import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { GutachtenCard } from './components/GutachtenCard'
import { GutachtenDetail } from './components/GutachtenDetail'
import { AddGutachtenModal } from './components/AddGutachtenModal'
import './App.css'

export default function App() {
  const [gutachtenListe, setGutachtenListe] = useState([])
  const [loading, setLoading] = useState(true)
  const [aktiv, setAktiv] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => { laden() }, [])

  async function laden() {
    setLoading(true)
    const { data, error } = await supabase
      .from('gutachten')
      .select('*')
      .order('created_at', { ascending: true })
    if (!error && data) setGutachtenListe(data)
    setLoading(false)
  }

  async function gutachtenHinzufuegen(form) {
    const { data, error } = await supabase
      .from('gutachten')
      .insert([form])
      .select()
    if (!error && data) setGutachtenListe(l => [...l, ...data])
    setShowModal(false)
  }

  function gutachtenAktualisieren(aktualisiert) {
    setGutachtenListe(l => l.map(g => g.id === aktualisiert.id ? aktualisiert : g))
    if (aktiv?.id === aktualisiert.id) setAktiv(aktualisiert)
  }

  async function gutachtenLoeschen(id) {
    if (!confirm('Dieses Gutachten wirklich löschen?')) return
    await supabase.from('gutachten').delete().eq('id', id)
    setGutachtenListe(l => l.filter(g => g.id !== id))
    setAktiv(null)
  }

  if (aktiv) {
    return (
      <GutachtenDetail
        gutachten={aktiv}
        onBack={() => setAktiv(null)}
        onUpdate={gutachtenAktualisieren}
        onDelete={() => gutachtenLoeschen(aktiv.id)}
      />
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-left">
            <div className="header-logo">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="2" y="4" width="16" height="20" rx="2" stroke="#C8922A" strokeWidth="1.5"/>
                <path d="M7 9h6M7 13h8M7 17h5" stroke="#C8922A" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="21" cy="21" r="5" fill="#1E2B3C" stroke="#4A7FA5" strokeWidth="1.5"/>
                <path d="M21 18v3l1.5 1.5" stroke="#4A7FA5" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h1 className="header-title">Gutachten-Dashboard</h1>
              <p className="header-subtitle">Familienrechtliche Sachverständigengutachten</p>
            </div>
          </div>
          <button className="neu-btn" onClick={() => setShowModal(true)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Neues Gutachten
          </button>
        </div>
      </header>

      <main className="app-main">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Lade Gutachten&hellip;</p>
          </div>
        ) : gutachtenListe.length === 0 ? (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="8" y="6" width="28" height="36" rx="3" stroke="#4A7FA5" strokeWidth="2"/>
              <path d="M15 16h18M15 22h14M15 28h10" stroke="#4A7FA5" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h2>Noch keine Gutachten angelegt</h2>
            <p>Legen Sie das erste Gutachten an, um den Bearbeitungsstand zu verfolgen.</p>
            <button className="neu-btn" onClick={() => setShowModal(true)}>Erstes Gutachten anlegen</button>
          </div>
        ) : (
          <>
            <div className="liste-stats">
              <span>{gutachtenListe.length} aktive Gutachten</span>
              <span className="stats-divider">·</span>
              <span>
                {gutachtenListe.filter(g => {
                  const frist = new Date(g.frist.split('.').reverse().join('-'))
                  return Math.ceil((frist - new Date()) / (1000 * 60 * 60 * 24)) <= 21
                }).length} Fristen in den nächsten 21 Tagen
              </span>
            </div>
            <div className="gutachten-grid">
              {gutachtenListe.map(g => (
                <GutachtenCard key={g.id} gutachten={g} onClick={setAktiv} />
              ))}
            </div>
          </>
        )}
      </main>

      {showModal && (
        <AddGutachtenModal onSave={gutachtenHinzufuegen} onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}
