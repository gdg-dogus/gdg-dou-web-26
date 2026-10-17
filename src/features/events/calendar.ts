import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/routing";
import { localize } from "@/lib/localized";
import { type EventItem, eventStart } from "./data";

/**
 * "Takvime ekle" linkleri. İkisi de build sırasında üretilir, JavaScript gerektirmez:
 * Google Takvim için hazır doldurulmuş form linki, Apple/Outlook için .ics dosyası (data: URI).
 */

const HOUR = 60 * 60 * 1000;

/** Bitiş saati yoksa etkinlik bir saat sürmüş sayılır. */
function range(e: EventItem) {
  const start = eventStart(e);
  const end = e.endTime ? new Date(`${e.date}T${e.endTime}:00+03:00`) : new Date(+start + HOUR);
  return { start, end };
}

/** 2026-10-15T10:00:00.000Z → 20261015T100000Z */
function utcStamp(d: Date) {
  return d
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

function eventUrl(e: EventItem, locale: Locale) {
  return `${siteConfig.url}/${locale}/events/${e.slug}/`;
}

export function googleCalendarUrl(e: EventItem, locale: Locale) {
  const { start, end } = range(e);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: localize(e.title, locale),
    dates: `${utcStamp(start)}/${utcStamp(end)}`,
    details: `${localize(e.summary, locale)}\n\n${eventUrl(e, locale)}`,
    location: localize(e.location, locale),
    ctz: "Europe/Istanbul",
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

/** iCalendar metin alanlarında \ , ; ve satır sonu kaçışlanır. */
function escapeText(value: string) {
  return value.replace(/[\\,;]/g, (c) => `\\${c}`).replace(/\r?\n/g, "\\n");
}

/** Satırlar 75 bayttan uzun olmamalı; devam satırı boşlukla başlar. Türkçe karakterler için 60 karakter. */
function fold(line: string) {
  const parts = line.match(/.{1,60}/gu) ?? [line];
  return parts.join("\r\n ");
}

export function icsDataUri(e: EventItem, locale: Locale) {
  const { start, end } = range(e);
  const url = eventUrl(e, locale);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//GDG on Campus DOU//Events//TR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${e.slug}@${new URL(siteConfig.url).hostname}`,
    `DTSTAMP:${utcStamp(start)}`,
    `DTSTART:${utcStamp(start)}`,
    `DTEND:${utcStamp(end)}`,
    `SUMMARY:${escapeText(localize(e.title, locale))}`,
    `DESCRIPTION:${escapeText(`${localize(e.summary, locale)}\n\n${url}`)}`,
    `LOCATION:${escapeText(localize(e.location, locale))}`,
    `URL:${url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  const ics = `${lines.map(fold).join("\r\n")}\r\n`;
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}
