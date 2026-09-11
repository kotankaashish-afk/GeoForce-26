import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const statusColors = { Working: '#7c8c78', Late: '#c39a5c', Outside: '#b87861' }

function createEmployeeIcon(employee, selected = false) {
  const initials = employee.name.split(' ').map((word) => word[0]).join('').slice(0, 2)
  const statusColor = statusColors[employee.status] || '#8b8479'
  const size = selected ? 58 : 48
  return L.divIcon({
    className: 'employee-marker',
    html: `<div style="position:relative;width:${size}px;height:${size}px;border-radius:18px;background:#fffdf8;border:3px solid ${statusColor};box-shadow:${selected ? `0 0 0 6px ${statusColor}33,0 10px 24px rgba(53,45,35,.24)` : '0 7px 18px rgba(53,45,35,.20)'};display:flex;align-items:center;justify-content:center;color:#393732;font-weight:800;font-size:${selected ? 16 : 13}px;transition:all .25s ease;">${initials}<span style="position:absolute;right:-4px;bottom:-4px;width:13px;height:13px;border-radius:50%;background:${statusColor};border:3px solid #fffdf8;"></span></div>`,
    iconSize: [size, size], iconAnchor: [size / 2, size / 2], popupAnchor: [0, -size / 2 + 2],
  })
}

function MapView({ employees, selectedEmployeeId }) {
  const mapRef = useRef(null)
  const markerRefs = useRef({})

  useEffect(() => {
    if (mapRef.current) return
    const map = L.map('geoforce-map', { zoomControl: false }).setView([17.3850, 78.4867], 13)
    L.control.zoom({ position: 'bottomright' }).addTo(map)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(map)
    L.circle([17.3850, 78.4867], { radius: 200, color: '#7c8c78', fillColor: '#7c8c78', fillOpacity: 0.10, weight: 2, dashArray: '6 7' }).addTo(map)

    employees.forEach((employee) => {
      if (!employee.position || employee.position.length !== 2) return
      const marker = L.marker(employee.position, { icon: createEmployeeIcon(employee) }).addTo(map)
      marker.bindPopup(`<div style="min-width:190px"><strong style="font-size:15px">${employee.name}</strong><div style="margin-top:4px;color:#80786d">${employee.role}</div><div style="margin-top:10px;font-weight:600;color:${statusColors[employee.status] || '#8b8479'}">${employee.status}</div><div style="margin-top:6px;color:#80786d">Check-in: ${employee.checkIn || '--'}</div><div style="margin-top:4px;color:#80786d">Overtime: ${employee.overtime || '00:00'}</div></div>`)
      markerRefs.current[employee.id] = marker
    })
    mapRef.current = map
    setTimeout(() => map.invalidateSize(), 100)
    return () => { map.remove(); mapRef.current = null; markerRefs.current = {} }
  }, [employees])

  useEffect(() => {
    if (!mapRef.current || !selectedEmployeeId) return
    const employee = employees.find((item) => item.id === selectedEmployeeId)
    const marker = markerRefs.current[selectedEmployeeId]
    if (!employee || !marker) return
    employees.forEach((item) => { const itemMarker = markerRefs.current[item.id]; if (itemMarker) itemMarker.setIcon(createEmployeeIcon(item, false)) })
    marker.setIcon(createEmployeeIcon(employee, true))
    mapRef.current.flyTo(employee.position, 15, { duration: 0.8 })
    marker.openPopup()
  }, [selectedEmployeeId, employees])

  return <div id="geoforce-map" className="h-full w-full" />
}

export default MapView
