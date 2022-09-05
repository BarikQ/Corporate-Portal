export default function filterAttachments(attachments) {
  const files = [];
  const graphics = [];
  const audio = [];

  attachments.forEach((attachment) => {
    switch (attachment.type) {
      case 'video':
        graphics.push(attachment);
        return;
      case 'image':
        graphics.push(attachment);
        return;
      case 'audio':
        audio.push(attachment);
        return;
      case 'file':
        files.push(attachment);
        return;
    }
  });

  return { files, graphics, audio };
}
