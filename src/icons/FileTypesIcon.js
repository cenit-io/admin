import React from 'react';
import SvgIcon from "@material-ui/core/SvgIcon";

export default function FileTypesIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M17.69,18.84H2.09a2.05,2.05,0,0,1-2-2V3a2,2,0,0,1,2.05-2H8.24a2,2,0,0,1,2,1.69l.25,1.47a.08.08,0,0,0,.08.07h7.1a2.05,2.05,0,0,1,2,2.05V16.8A2,2,0,0,1,17.69,18.84ZM2.09,2.43A.55.55,0,0,0,1.54,3V16.8a.55.55,0,0,0,.55.54h15.6a.54.54,0,0,0,.54-.54V6.21a.55.55,0,0,0-.54-.55h-7.1A1.58,1.58,0,0,1,9,4.34L8.78,2.88a.55.55,0,0,0-.54-.45Z"/>
      <path d="M21.91,23.07H4.2a.75.75,0,1,1,0-1.5H21.91a.55.55,0,0,0,.55-.55V8.32a.75.75,0,0,1,1.5,0V21A2.05,2.05,0,0,1,21.91,23.07Z"/>
    </SvgIcon>
  );
}