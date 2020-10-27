import React from 'react';

import {Switch} from 'react-native';

import SingleLineInputContainer from './SingleLineInputContainer';

export default function SwitchInput({label, value, onChange, tooltip, disablePadding, topBorder}) {
  return (
    <SingleLineInputContainer
      label={label}
      tooltip={tooltip}
      disablePadding={disablePadding}
      topBorder={topBorder}>
      <Switch value={value} onValueChange={onChange} />
    </SingleLineInputContainer>
  );
}
