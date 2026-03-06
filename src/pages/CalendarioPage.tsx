import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventClickArg } from '@fullcalendar/core'
import { useCompiti } from '@/hooks/useCompiti'
import { getSpazioNome } from '@/lib/spazi'
import { getAssegnatoLabel } from '@/lib/utenti'
import './CalendarioPage.css'

export function CalendarioPage() {
  const navigate = useNavigate()
  const { compiti, loading } = useCompiti(null)

  const events = useMemo(() => {
    return compiti.map((c) => {
      const startDate = c.data_inizio.slice(0, 10)
      const lastDay = (c.data_fine || c.data_inizio).slice(0, 10)
      const endDate = new Date(lastDay)
      endDate.setDate(endDate.getDate() + 1)
      const endDateStr = endDate.toISOString().slice(0, 10)
      return {
        id: c.id,
        title: `${getSpazioNome(c.spazio_id)}: ${c.titolo}`,
        start: startDate,
        end: endDateStr,
        allDay: true,
        extendedProps: {
          spazioId: c.spazio_id,
          compitoId: c.id,
          eseguito: c.eseguito,
          assegnato: getAssegnatoLabel(c.assegnato_a),
          eseguitoDa: getAssegnatoLabel(c.eseguito_da),
        },
        backgroundColor: c.eseguito ? '#4caf50' : '#ff9800',
        borderColor: c.eseguito ? '#388e3c' : '#f57c00',
      }
    })
  }, [compiti])

  const handleEventClick = (arg: EventClickArg) => {
    const spazioId = arg.event.extendedProps.spazioId as string
    arg.jsEvent.preventDefault()
    navigate(`/spazi/${spazioId}`)
  }

  if (loading) return <p>Caricamento calendario…</p>

  return (
    <div className="calendario-page">
      <h1>Calendario</h1>
      <p className="calendario-intro">
        Clicca su un evento per andare allo spazio e modificare il compito. Verde = fatto, arancione = da fare.
      </p>
      <div className="calendario-wrapper">
        <FullCalendar
          plugins={[dayGridPlugin, listPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,listWeek',
          }}
          events={events}
          eventClick={handleEventClick}
          locale="it"
          firstDay={1}
          height="auto"
          contentHeight={500}
        />
      </div>
    </div>
  )
}
