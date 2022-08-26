/* eslint-disable no-case-declarations */
/* eslint-disable react/prop-types */
import React, { useRef, useState } from 'react';
import { ImageList, ImageListItem } from '@mui/material';

import InsertDriveFileTwoToneIcon from '@mui/icons-material/InsertDriveFileTwoTone';

import { AudioPlayer } from 'components';

import styles from './Attachments.module.scss';

export default function Attachments({ graphics, audio, files, className, ...props }) {
  const handleAttachmentType = ({ name, type, url, thumbnail }) => {
    switch (type) {
      case 'image':
        return <img className="post__attachments-image" src={url} key={name} />;
      case 'video':
        return <video className={styles.video} src={url} key={name} />;
    }
  };

  return (
    <>
      <div className={styles.attachments}>
        {Boolean(graphics.length) && (
          <ImageList sx={{ width: 564 }} cols={3}>
            {graphics.map((attachment) => {
              return (
                <ImageListItem key={attachment.name}>
                  {handleAttachmentType(attachment)}
                </ImageListItem>
              );
            })}
          </ImageList>
        )}

        {Boolean(audio.length) && (
          <div className={styles.audioContainer}>
            {audio.map((file) => (
              <AudioPlayer file={file} key={file.url} />
            ))}
          </div>
        )}

        {Boolean(files.length) && (
          <div className={styles.filesContainer}>
            {files.map((file) => (
              <div className={styles.file} key={file.url}>
                <a
                  href={file.url}
                  download
                  target="_blank"
                  className={styles.fileHead}
                  rel="noreferrer">
                  <InsertDriveFileTwoToneIcon />
                  <span>{file.name}</span>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
