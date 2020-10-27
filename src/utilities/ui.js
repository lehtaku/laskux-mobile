import React from 'react';

import EntypoIcon from '../components/Icons/EntypoIcon';
import AntDesignIcon from '../components/Icons/AntDesignIcon';

export const getAttachmentIcon = (mimeType) => {
  if (mimeType.includes('image')) {
    return <EntypoIcon name="image" />;
  }
  return <AntDesignIcon name="file1" />;
};
