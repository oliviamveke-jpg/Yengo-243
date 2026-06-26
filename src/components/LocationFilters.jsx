export default function LocationFilters({
  province,
  setProvince,
  commune,
  setCommune,
  quartier,
  setQuartier
}) {
  return (
    <div className="filters-panel">

      <h3>Location</h3>

      <select
        value={province}
        onChange={e => setProvince(e.target.value)}
      >
        <option value="">Province</option>
      </select>

      <select
        value={commune}
        onChange={e => setCommune(e.target.value)}
      >
        <option value="">Commune</option>
      </select>

      <select
        value={quartier}
        onChange={e => setQuartier(e.target.value)}
      >
        <option value="">Quartier</option>
      </select>

    </div>
  )
}