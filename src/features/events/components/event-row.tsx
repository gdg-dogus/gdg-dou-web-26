import { Clock, MapPin } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { asset, cn } from "@/lib/utils";
import { categoryStyles } from "../category";
import type { EventView } from "../data";
import { CategoryLabel } from "./category-label";
import { EventDate } from "./event-date";

export function EventRow({ event }: { event: EventView }) {
  const style = categoryStyles[event.category];
  const time = event.endTime ? `${event.startTime}–${event.endTime}` : event.startTime;
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group relative grid grid-cols-[5rem_1fr] gap-x-5 gap-y-3 rounded-3xl py-7 transition-colors duration-300 hover:bg-muted/70 sm:-mx-5 sm:grid-cols-[6.5rem_1fr_7.5rem] sm:gap-x-8 sm:px-5"
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-7 bottom-7 -left-3 w-1 origin-top scale-y-0 rounded-full transition-transform duration-300 group-hover:scale-y-100 max-sm:hidden",
          style.fill,
        )}
      />
      <EventDate date={event.date} numberClassName={style.text} />
      <div className="min-w-0">
        <CategoryLabel category={event.category} />
        <h3 className="mt-2 font-medium text-xl leading-snug transition-colors group-hover:text-primary">
          {event.title}
        </h3>
        <p className="mt-2 line-clamp-2 max-w-prose text-muted-foreground">{event.summary}</p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-muted-foreground text-sm">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4" aria-hidden />
            {time}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4" aria-hidden />
            {event.location}
          </span>
        </div>
      </div>
      {event.image ? (
        <div className="relative hidden aspect-[4/5] overflow-hidden rounded-2xl bg-muted shadow-sm transition-transform duration-500 group-hover:rotate-3 group-hover:scale-105 group-hover:shadow-lg sm:block motion-reduce:transform-none">
          <Image src={asset(event.image)} alt="" fill sizes="7.5rem" className="object-cover" />
        </div>
      ) : null}
    </Link>
  );
}
