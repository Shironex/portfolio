'use client'

const Footer = () => {
  return (
    <div className="justify-center border-t border-neutral-100 p-4 text-center text-xs text-neutral-500">
      <span className="font-semibold">{new Date().getFullYear()} </span>
      &#8212; Built by Shironex
    </div>
  )
}

export default Footer
