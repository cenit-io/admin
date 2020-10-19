import React from 'react';
import SvgIcon from "@material-ui/core/SvgIcon";

export default function SharedCollectionIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M12,12.75a.74.74,0,0,1-.53-.22.75.75,0,0,1,0-1.06L22.25.69a.75.75,0,1,1,1.06,1.06L12.53,12.53A.74.74,0,0,1,12,12.75Z"/>
      <path d="M23.25,9a.76.76,0,0,1-.75-.75V2.35a.85.85,0,0,0-.85-.85H15.73a.75.75,0,0,1,0-1.5h5.92A2.35,2.35,0,0,1,24,2.35V8.27A.75.75,0,0,1,23.25,9Z"/>
      <path d="M21.65,24H2.35A2.35,2.35,0,0,1,0,21.65V2.35A2.35,2.35,0,0,1,2.35,0H9.29a.75.75,0,0,1,0,1.5H2.35a.85.85,0,0,0-.85.85v19.3a.85.85,0,0,0,.85.85h19.3a.85.85,0,0,0,.85-.85V14.71a.75.75,0,0,1,1.5,0v6.94A2.35,2.35,0,0,1,21.65,24Z"/>
    </SvgIcon>
  );
}