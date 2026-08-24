import { logo } from '../../assets'

interface SplashProps {
  /** True once the site is ready to take over — the curtain fades away. */
  leaving: boolean
}

/**
 * The curtain: the couple's monogram alone on cream while the invitation
 * loads, then it lifts and hands the screen to the hero.
 */
export function Splash({ leaving }: SplashProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-50 grid place-items-center bg-cream transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        leaving ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <img src={logo} alt="" className="splash-mark h-28 w-auto select-none sm:h-36" />
    </div>
  )
}
