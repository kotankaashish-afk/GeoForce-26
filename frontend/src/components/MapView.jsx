import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const employees = [
  {
    name: 'Rahul Sharma',
    role: 'Field Engineer',
    status: 'Working',
    position: [17.4485, 78.3908],
  },
  {
    name: 'Priya Reddy',
    role: 'Sales Executive',
    status: 'Working',
    position: [17.4435, 78.3955],
  },
  {
    name: 'Arjun Kumar',
    role: 'Technician',
    status: 'Late',
    position: [17.455, 78.382],
  },
  {
    name: 'Sameer Khan',
    role: 'Field Agent',
    status: 'Outside',
    position: [17.425, 78.405],
  },
]

function MapView() {
  const mapRef = useRef(null)

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
      }
    ).addTo(map)

    // Employee markers
    employees.forEach((employee) => {
      const marker = L.marker(employee.position).addTo(map)

      marker.bindPopup(`
        <strong>${employee.name}</strong>
        <br />
        ${employee.role}
        <br />
        Status: ${employee.status}
      `)
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <div
      id="geoforce-map"
      className="h-full w-full"
    />
  )
}

export default MapView