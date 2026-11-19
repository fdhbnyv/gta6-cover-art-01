// Fixed scenes for headless screenshot capture and validation

export async function runShot(shot, query, applyShot) {
  if (shot === 'cover') {
    document.body.classList.add('shot-cover');
  } else if (shot === 'editor') {
    document.body.classList.add('shot-editor');
  }

  const presetName = query.get('preset') || 'vice-sunset';
  const layout = query.get('layout');
  const ratio = query.get('ratio');
  const title = query.get('title');
  const subtitle = query.get('subtitle');
  const photo = query.get('photo');

  await applyShot({
    presetName,
    layout,
    ratio,
    title,
    subtitle,
    photo,
  });

  // Ensure two animation frames for painting before signaling ready
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.__shotReady = true;
    });
  });
}
