import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const statusColors = {
  Working: '#71846b',
  Late: '#b18b49',
  Outside: '#a96653',
}

function createEmployeeIcon(employee, selected = false) {
  const initials = employee.name
    .split(' ')
    .map((word) => word[0])
    .join('')

  const statusColor = statusColors[employee.status] || '#71846b'

  return L.divIcon({
    className: 'employee-marker',
    html: `
      <div style="
        position: relative;
        width: ${selected ? '58px' : '50px'};
        height: ${selected ? '58px' : '50px'};
        border-radius: 18px;
        background: #292823;
        border: ${selected ? '3px' : '2px'} solid ${statusColor};
        box-shadow: ${
          selected
            ? `0 0 0 6px ${statusColor}22, 0 12px 24px rgba(71,61,45,.28)`
            : '0 8px 18px rgba(71,61,45,.24)'
        };
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fffdf8;
        font-weight: 700;
        font-size: ${selected ? '15px' : '13px'};
        letter-spacing: .02em;
        transition: all .2s ease;
      ">
        ${initials}
        <span style="
          position: absolute;
          right: -4px;
          bottom: -4px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: ${statusColor};
          border: 3px solid #fffdf8;
          box-shadow: 0 2px 7px rgba(71,61,45,.2);
        "></span>
      </div>
    `,
    iconSize: selected ? [58, 58] : [50, 50],
    iconAnchor: selected ? [29, 29] : [25, 25],
    popupAnchor: [0, selected ? -32 : -27],
  })
}

function MapView({ employees, selectedEmployeeId }) {
  const mapRef = useRef(null)
  const markerRefs = useRef({})

  useEffect(() => {
    if (mapRef.current) return

    const map = L.map('geoforce-map', {
      zoomControl: false,
      scrollWheelZoom: true,
    }).setView([17.3850, 78.4867], 13)

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    L.circle([17.3850, 78.4867], {
      radius: 200,
      color: '#7c8c78',
      fillColor: '#7c8c78',
      fillOpacity: 0.09,
      weight: 2,
      dashArray: '7 7',
    }).addTo(map)

    employees.forEach((employee) => {
      const marker = L.marker(employee.position, {
        icon: createEmployeeIcon(employee),
      }).addTo(map)

      marker.bindPopup(`
        <div style="min-width: 205px; padding: 4px 2px; font-family: Inter, system-ui, sans-serif;">
          <div style="font-weight: 700; font-size: 15px; color: #292823;">${employee.name}</div>
          <div style="margin-top: 3px; color: #777166; font-size: 12px;">${employee.role}</div>
          <div style="margin-top: 10px; padding-top: 9px; border-top: 1px solid #e8e1d6; font-size: 12px; color: #777166;">
            Status: <strong style="color: ${statusColors[employee.status] || '#71846b'};">${employee.status}</strong>
          </div>
          <div style="margin-top: 6px; color: #777166; font-size: 12px;">Check-in: ${employee.checkIn || '—'}</div>
          <div style="margin-top: 5px; color: #777166; font-size: 12px;">Overtime: ${employee.overtime || '00:00'}</div>
        </div>
      `)

      markerRefs.current[employee.id] = marker
    })

    mapRef.current = map

    setTimeout(() => map.invalidateSize(), 100)

    return () => {
      map.remove()
      mapRef.current = null
      markerRefs.current = {}
    }
  }, [employees])

  useEffect(() => {
    if (!mapRef.current || !selectedEmployeeId) return

    const employee = employees.find(
      (item) => item.id === selectedEmployeeId
    )
    const marker = markerRefs.current[selectedEmployeeId]

    if (!employee || !marker) return

    employees.forEach((item) => {
      const itemMarker = markerRefs.current[item.id]
      if (itemMarker) {
        itemMarker.setIcon(createEmployeeIcon(item, false))
      }
    })

    marker.setIcon(createEmployeeIcon(employee, true))

    mapRef.current.flyTo(employee.position, 15, {
      duration: 0.8,
      easeLinearity: 0.25,
    })

    marker.openPopup()
  }, [selectedEmployeeId, employees])

  return <div id="geoforce-map" className="h-full w-full" />
}

export default MapView
