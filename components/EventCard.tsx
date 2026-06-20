import Link from "next/link";
import Image from "next/image";

interface Props {
    title: string;
    image: string;
    location?: string;
    date?: string;
    time?: string;
    slug?: string;
}
const EventCard = ( {title, image, location, date, time, slug} : Props ) => {
  return (
    <Link href={`/events/${slug || ""}`} id="event-card">
        <Image src={image} alt={title} width={410} height={300} className="poster" />
        <p className="title">{title}</p>
        {location && <p>{location}</p>}
        {(date || time) && (
          <div className="datetime">
            {date && (
              <div>
                <img src="/icons/calendar.svg" alt="calendar" width={16} height={16} />
                <span>{date}</span>
              </div>
            )}
            {time && (
              <div>
                <img src="/icons/clock.svg" alt="clock" width={16} height={16} />
                <span>{time}</span>
              </div>
            )}
          </div>
        )}
    </Link>
  )
}

export default EventCard