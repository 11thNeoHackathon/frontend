import signal from './assets/status-signal.svg'
import battery from './assets/status-battery.svg'

export function StatusBar() {
  return <div className="ios-status-bar" aria-hidden="true">
    <span>09:41</span>
    <span className="ios-status-icons"><img src={signal} alt="" /><img src={battery} alt="" /></span>
  </div>
}

export function HomeIndicator() {
  return <div className="ios-home-indicator" aria-hidden="true"><span /></div>
}
