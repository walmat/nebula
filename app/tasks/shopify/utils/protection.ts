export default ($: CheerioStatic) => {
  const hiddenForm = $('[id*="fs_"]');

  if (!hiddenForm.length) {
    return null;
  }

  const prot = [];
  $($(hiddenForm).html()).each((_, el) => {
    const hash = $(el).attr('name') || '';

    if (/field_start|field_end/i.test(hash)) {
      return;
    }

    if (hash) {
      prot.push({ name: hash, value: '' });
    }
  });

  const fsCount = $('[id*="-count"]');
  if (fsCount.length) {
    const hash = $(fsCount).attr('name');
    const value = $(fsCount).attr('value') || '';
    const count = prot.length;
    prot.push({ name: hash, value: count });
    prot.push({ name: hash, value });
  }

  return prot;
};
