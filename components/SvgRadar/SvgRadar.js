import { Component } from 'preact';
import './SvgRadar.css';
import GameStore from '../../stores/GameStore';
import SettingsStore from '../../stores/SettingsStore';
import WayPoints from '../../components/WayPoints/WayPoints';
import Airport from '../../components/Airport/Airport';
import BackgroundSvg from '../../components/BackgroundSvg/BackgroundSvg';
import RadarTraffic from '../RadarTraffic/RadarTraffic';
import config from '../../lib/config';
import { getStyle } from '../../lib/svg';

class SvgRadar extends Component {
  constructor(props) {
    super();
    this.state = {
    };
  }

  componentWillMount() {
    GameStore.on('change', this.reRender);
    SettingsStore.on('change', this.reRender);
  }

  componentWillUnmount() {
    GameStore.removeListener('change', this.reRender);
    SettingsStore.removeListener('change', this.reRender);
  }

  reRender = () => {
    this.setState({});
  }

  setRef = el => GameStore.setSvgEl(el);

  render() {
    const airplanes = GameStore.traffic.map((airplane, i) => 
      <RadarTraffic stateEmitter={GameStore} key={i} index={i} airplane={airplane} cmd={this.props.cmd} />);

    const innerWidth = typeof window !== 'undefined' ? window.innerWidth : 800;
    const innerHeight = typeof window !== 'undefined' ? window.innerHeight : 600;

    const height = innerHeight;
    const width = this.props.timelapse ? innerWidth : innerWidth - 250;

    const transformScale = `translate(${config.width / 2} ${config.height / 2}) scale(${GameStore.zoom}) translate(-${config.width / 2} -${config.height / 2})`;

    return (
      <svg ref={this.setRef} onWheel={this.props.onZoom} xmlns="http://www.w3.org/2000/svg" className="atc-view-svg" width={width} height={height}
        onClick={this.props.onClick} viewBox="0 0 1280 720" style={`background: #194850; overflow: visible; font-size: ${SettingsStore.radarFontsize}px;`}>
        <style>{getStyle(SettingsStore.ilsPathColor, SettingsStore.sepVialationCircleColor)}</style>
        <g transform={transformScale}>
          <BackgroundSvg name={GameStore.id} />
        </g>
        <WayPoints />
        <Airport />
        {airplanes}
        <rect width="100%" height="100%" fill="none" stroke="#fff" stroke-dasharray="20, 20" transform={transformScale} />
      </svg>
    );
  }
}

export default SvgRadar;
