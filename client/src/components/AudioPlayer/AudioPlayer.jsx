/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { default as H5AudioPlayer } from 'react-h5-audio-player';
import AudioFileTwoToneIcon from '@mui/icons-material/AudioFileTwoTone';

import styles from './AudioPlayer.module.scss';
import './AudioPlayerTheme.scss';
import { Collapse } from '@mui/material';

export default function CustomAudioPlayer({ file: { url, name, type }, ...props }) {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={styles.audio}>
      <div className={styles.audioHead} onClick={handleExpandClick}>
        <AudioFileTwoToneIcon />
        <span>{name}</span>
      </div>

      <Collapse in={expanded}>
        <H5AudioPlayer className={styles.audioPlayer} src={url} />
      </Collapse>
    </div>
  );
}
