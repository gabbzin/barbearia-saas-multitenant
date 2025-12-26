"use client";

import { type CalendarOptions, ICalendar } from "datebook";

export default function AddEventCalendar(eventConfig: CalendarOptions) {
  const iCalendar = new ICalendar(eventConfig);

  // 1. Renderiza a string no padrão RFC 5545 (ICS)
  const icsContent = iCalendar.render();

  // 2. Cria um Blob (Binary Large Object) para o arquivo
  const blob = new Blob([icsContent], {
    type: "text/calendar;charset=utf-8",
  });

  // 3. Cria uma URL temporária para esse Blob
  const url = window.URL.createObjectURL(blob);

  // 4. Cria um link invisível e dispara o clique
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "next-booking.ics");
  document.body.appendChild(link);
  link.click();

  // 5. Limpa a memória
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
