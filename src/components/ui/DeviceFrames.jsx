// Minimal device chrome for project screenshots. Both keep the image's aspect ratio
// so nothing reflows while it loads.

export function BrowserFrame({ src, alt, url, className = '', priority = false, aspect = 'aspect-[16/10]' }) {
  return (
    <figure className={`overflow-hidden rounded-xl border border-line bg-surface shadow-[0_30px_80px_-30px_rgb(0_0_0/0.8)] ${className}`}>
      <div className="flex h-8 items-center gap-3 border-b border-line px-3 md:h-9">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2 rounded-full bg-line" />
          <span className="size-2 rounded-full bg-line" />
          <span className="size-2 rounded-full bg-line" />
        </span>
        {url && (
          <span className="mx-auto truncate rounded-md bg-page px-3 py-0.5 font-mono text-[10.5px] text-muted md:text-[11px]">
            {url}
          </span>
        )}
        <span aria-hidden="true" className="w-[42px]" />
      </div>
      <img
        src={src}
        alt={alt}
        width="1440"
        height="900"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
        className={`block w-full object-cover object-top ${aspect}`}
      />
    </figure>
  )
}

export function PhoneFrame({ src, alt = '', className = '' }) {
  return (
    <figure
      className={`overflow-hidden rounded-[18%/8.5%] border-[5px] border-[#1c1c1c] bg-black shadow-[0_24px_60px_-12px_rgb(0_0_0/0.9)] ring-1 ring-line md:border-[6px] ${className}`}
    >
      <img
        src={src}
        alt={alt}
        width="390"
        height="844"
        loading="lazy"
        decoding="async"
        draggable={false}
        className="block aspect-[390/844] w-full object-cover object-top"
      />
    </figure>
  )
}
