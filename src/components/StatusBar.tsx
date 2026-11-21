export function StatusBar() {
  return (
    <div className="status-bar" aria-hidden="true">
      <strong>09:41</strong>
      <div className="status-icons">
        <span className="signal">▮▮▮</span>
        <span className="wifi">⌁</span>
        <span className="battery"><i /></span>
      </div>
    </div>
  )
}
