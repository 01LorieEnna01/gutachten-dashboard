import { useState } from 'react'

export function AddGutachtenModal({ onSave, onClose }) {
  const [form, setForm] = useState({
    name: '',
    aktenzeichen: '',
    richterin: '',
    frist: '',
  })

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit() {
    if (!form.name || !form.aktenzeichen || !form.frist) return
    onSave({ ...form, erledigte: {}, notiz: '' })
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Neues Gutachten</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <label className="form-label">
            Name / Familie
            <input
              className="form-input"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="z.B. Boujida"
              autoFocus
            />
          </label>

          <label className="form-label">
            Aktenzeichen
            <input
              className="form-input"
              name="aktenzeichen"
              value={form.aktenzeichen}
              onChange={handleChange}
              placeholder="z.B. 44 F 173/24"
            />
          </label>

          <label className="form-label">
            Richterin / Richter
            <input
              className="form-input"
              name="richterin"
              value={form.richterin}
              onChange={handleChange}
              placeholder="z.B. Runte"
            />
          </label>

          <label className="form-label">
            Frist (TT.MM.JJJJ)
            <input
              className="form-input"
              name="frist"
              value={form.frist}
              onChange={handleChange}
              placeholder="z.B. 30.06.2026"
            />
          </label>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Abbrechen</button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={!form.name || !form.aktenzeichen || !form.frist}
          >
            Gutachten anlegen
          </button>
        </div>
      </div>
    </div>
  )
}
