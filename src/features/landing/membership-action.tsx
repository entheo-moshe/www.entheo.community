type MembershipActionProps = {
  label: string
  href: string
}

export function MembershipAction({ label, href }: MembershipActionProps) {
  return (
    <a
      className="d1-membership-action"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} (opens in a new tab)`}
    >
      <span className="d1-membership-action-label">{label}</span>
      <span className="d1-membership-action-arrow" aria-hidden>
        <svg viewBox="0 0 20 20" focusable="false">
          <path d="M5.5 14.5 14.5 5.5M8 5.5h6.5V12" />
        </svg>
      </span>
    </a>
  )
}
