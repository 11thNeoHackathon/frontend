interface PageHeaderProps {
  title: string
  onBack: () => void
}

export function PageHeader({ title, onBack }: PageHeaderProps) {
  return (
    <header className="page-header">
      <button className="icon-button back-button" type="button" onClick={onBack} aria-label="뒤로 가기">
        <span className="chevron chevron-left" aria-hidden="true" />
      </button>
      <strong>{title}</strong>
      <span className="header-spacer" />
    </header>
  )
}
