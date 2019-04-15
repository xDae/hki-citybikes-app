import React from 'react';
import { Text } from 'react-native';

import { MapView, Svg } from 'expo';

import isNaN from 'lodash/isNaN';

const getStationStatus = (freeBikes, totalBikes) => {
  const bikesRatio = freeBikes / totalBikes;

  switch (true) {
    case isNaN(bikesRatio) || bikesRatio === 0:
      return '#C0392B';
    case bikesRatio < 0.15:
      return '#F39C12';
    case bikesRatio < 0.3:
      return '#F1C40F';
    case bikesRatio < 0.5:
      return '#16A085';
    case bikesRatio < 0.75:
      return '#27AE60';
    case bikesRatio >= 0.75:
      return '#2ECC71';
    default:
      return '#ccc';
  }
};

const BikeMarker = props => (
  <MapView.Marker centerOffset={{ x: 0, y: -20 }} {...props}>
    <Svg width={37} height={45}>
      <Svg.G fill="none" fillRule="evenodd">
        <Svg.G transform="translate(0 7)" fillRule="nonzero">
          <Svg.Path
            d="M15 37.777C25 28.115 30 20.523 30 15c0-8.284-6.716-15-15-15C6.716 0 0 6.716 0 15c0 5.523 5 13.115 15 22.777z"
            fill="#003"
          />
          <Svg.Circle fill="#FAFAF7" cx={15} cy={15} r={12} />
          <Svg.Path
            d="M20.25 13.148c-.342 0-.674.046-.99.133l-.965-2.512.349-.36a.376.376 0 0 0-.004-.526l-.75-.75a.376.376 0 0 0-.265-.11H15.75a.375.375 0 0 0 0 .75h1.72l.379.379-.26.266a.376.376 0 0 0-.082.393l.001.003.345.897-5.103.637v-.7h1.125a.375.375 0 0 0 0-.75h-2.25a.375.375 0 1 0 0 .75H12v1.024l-.524.898a3.728 3.728 0 0 0-1.726-.422A3.754 3.754 0 0 0 6 16.898a3.754 3.754 0 0 0 3.75 3.75 3.757 3.757 0 0 0 3.675-3h.514a1.126 1.126 0 1 0 1.95-1.063l2.402-3.737.27.703a3.754 3.754 0 0 0-2.061 3.347 3.754 3.754 0 0 0 3.75 3.75 3.754 3.754 0 0 0 3.75-3.75 3.754 3.754 0 0 0-3.75-3.75zm-10.5 6.75c-1.654 0-3-1.346-3-3a3.003 3.003 0 0 1 4.348-2.68l-1.672 2.866a.375.375 0 0 0 .324.564h2.905a3.005 3.005 0 0 1-2.905 2.25zm.653-3l1.318-2.26c.63.55 1.029 1.36 1.029 2.26h-2.347zm3.536 0H13.5a3.744 3.744 0 0 0-1.396-2.917l.271-.464 1.767 3.03a1.138 1.138 0 0 0-.203.35zm1.061.75a.376.376 0 1 1 0-.751.376.376 0 0 1 0 .751zm.258-1.47a1.144 1.144 0 0 0-.468-.01l-1.805-3.093 4.64-.58-2.367 3.683zm4.992 3.72c-1.654 0-3-1.346-3-3 0-1.141.641-2.136 1.582-2.643l1.068 2.778a.377.377 0 0 0 .485.215.376.376 0 0 0 .216-.484l-1.07-2.779a3.003 3.003 0 0 1 3.719 2.912c0 1.655-1.346 3.001-3 3.001z"
            fill="#000"
          />
        </Svg.G>
        <Svg.G transform="translate(19 2)">
          <Svg.Circle
            stroke="#FFF"
            strokeWidth={2}
            fill={getStationStatus(props.freeBikes, props.freeBikes + props.emptySlots)}
            fillRule="nonzero"
            cx={8}
            cy={8}
            r={9}
          />
          <Svg.Text fontFamily="Helvetica" fontSize={10} fill="#FFF">
            <Svg.TSpan x={8} y={12} textAnchor="middle">
              {props.freeBikes}
            </Svg.TSpan>
          </Svg.Text>
        </Svg.G>
      </Svg.G>
    </Svg>
  </MapView.Marker>
);

export default BikeMarker;
