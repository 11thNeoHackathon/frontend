import status from '../assets/hifi/status.svg'
import battery from '../assets/hifi/battery.svg'

export function StatusBar() {
  return <div className="status-bar" aria-hidden="true"><strong>09:41</strong><div className="status-icons"><img src={status} alt="" /><img src={battery} alt="" /></div></div>
}
