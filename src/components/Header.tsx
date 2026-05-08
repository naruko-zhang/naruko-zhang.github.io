import { Link } from 'react-router'

export default function Header() {
  return (
    <header className="border-b border-border bg-[#FAF8F2] sticky top-0 z-50">
      <div className="max-w-[1100px] mx-auto px-8 h-20 flex items-center">
        <Link
          to="/"
          className="font-serif text-2xl font-bold text-foreground hover:opacity-60 transition-opacity"
        >
          张勍的数字花园
        </Link>
      </div>
    </header>
  )
}
