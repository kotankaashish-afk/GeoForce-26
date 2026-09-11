import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const statusColors = {
  Working: '#10b981',
  Late: '#f59e0b',
  Outside: '#ef4444',
}

function createEmployeeIcon(employee, selected = false) {
  const initials = employee.name
    .split(' ')
    .map((word) => word[0])
    .join('')

  const statusColor = statusColors[employee.status]

  return L.divIcon({
    className: 'employee-marker',
    html: `
      <div style="
        position: relative;
        width: ${selected ? '56px' : '48px'};
        height: ${selected ? '56px' : '48px'};
        border-radius: 50%;
        background: #0f172a;
        border: ${selected ? '4px' : '3px'} solid ${statusColor};
        box-shadow: ${
          selected
            ? `0 0 0 5px ${statusColor}33, 0 6px 18px rgba(0,0,0,0.5)`
            : '0 4px 12px rgba(0,0,0,0.4)'
        };
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 700;
        font-size: ${selected ? '16px' : '14px'};
        transition: all 0.2s ease;
      ">
        ${initials}

        <span style="
          position: absolute;
          right: -2px;
          bottom: -2px;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background: ${statusColor};
          border: 2px solid #0f172a;
        "></span>
      </div>
    `,
    iconSize: selected ? [56, 56] : [48, 48],
    iconAnchor: selected
      ? [28, 28]
      : [24, 24],
    popupAnchor: [0, selected ? -30 : -25],
  })
}

function MapView({ employees, selectedEmployeeId }) {
  const mapRef = useRef(null)
  const markerRefs = useRef({})

  // Create the map and markers
  useEffect(() => {
    if (mapRef.current) return

    const map = L.map('geoforce-map').setView(
      [17.4485, 78.3908],
      13
    )

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap contributors',
      }
    ).addTo(map)

    // Company geofence
    L.circle(
      [17.4485, 78.3908],
      {
        radius: 1500,
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.08,
        weight: 2,
      }
    ).addTo(map)

    // Employee markers
    employees.forEach((employee) => {
      const marker = L.marker(
        employee.position,
        {
          icon: createEmployeeIcon(employee),
        }
      ).addTo(map)

      marker.bindPopup(`
        <div style="min-width: 200px;">
          <strong style="font-size: 15px;">
            ${employee.name}
          </strong>

          <div style="margin-top: 4px; color: #64748b;">
            ${employee.role}
          </div>

          <div style="margin-top: 8px;">
            Status:
            <strong style="color: ${statusColors[employee.status]};">
              ${employee.status}
            </strong>
          </div>

          <div style="margin-top: 6px; color: #64748b;">
            Check-in: ${employee.checkIn}
          </div>

          <div style="margin-top: 4px; color: #64748b;">
            Overtime: ${employee.overtime}
          </div>
        </div>
      `)

      markerRefs.current[employee.id] = marker
    })

    mapRef.current = map

    // Fix map sizing after the component finishes rendering
    setTimeout(() => {
      map.invalidateSize()
    }, 100)

    return () => {
      map.remove()
      mapRef.current = null
      markerRefs.current = {}
    }
  }, [employees])

  // Focus and highlight selected employee
  useEffect(() => {
    if (!mapRef.current || !selectedEmployeeId) return

    const employee = employees.find(
      (employee) => employee.id === selectedEmployeeId
    )

    const marker = markerRefs.current[selectedEmployeeId]

    if (!employee || !marker) return

    // Reset all markers
    employees.forEach((employee) => {
      const marker = markerRefs.current[employee.id]

      if (marker) {
        marker.setIcon(
          createEmployeeIcon(employee, false)
        )
      }
    })

    // Highlight selected marker
    marker.setIcon(
      createEmployeeIcon(employee, true)
    )

    // Move map to employee
    mapRef.current.flyTo(
      employee.position,
      15,
      {
        duration: 0.8,
      }
    )

    // Open employee popup
    marker.openPopup()
  }, [selectedEmployeeId, employees])

  return (
    <div
      id="geoforce-map"
      className="h-full w-full"
    />
  )
}

export default MapView