// Publishable browser key; this is not a service-role credential.
const portfolioStorage = (() => {
  const origin = 'https://meaphghtpvkjylcawzhq.supabase.co';
  const bucket = 'Portfolio';
  const publicKey = 'sb_publishable_MGDqfecg7gDvnl2K1V61aw_MOK6pozY';
  const folders = { animations: 'Animation', photography: 'Photography', photo_editing: 'editings' };

  async function listFolder(prefix) {
    const entries = [];
    const limit = 100;
    for (let offset = 0; ; offset += limit) {
      const response = await fetch(`${origin}/storage/v1/object/list/${bucket}`, {
        method: 'POST',
        headers: { apikey: publicKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ prefix, limit, offset, sortBy: { column: 'name', order: 'asc' } })
      });
      if (!response.ok) throw new Error(`Supabase file listing failed (${response.status})`);
      const page = await response.json();
      if (!Array.isArray(page)) throw new Error('Invalid Supabase file listing');
      entries.push(...page);
      if (page.length < limit) return entries;
    }
  }

  function mediaItem(path, entry) {
    const extension = entry.name.split('.').pop().toLowerCase();
    const fileType = /^(mp4|mov|webm|avi|mkv|m4v)$/.test(extension) ? 'video'
      : /^(jpg|jpeg|png|gif|webp|bmp|avif|svg)$/.test(extension) ? 'image'
      : /^(mp3|wav|ogg|m4a)$/.test(extension) ? 'audio'
      : extension === 'pdf' ? 'pdf' : null;
    if (!fileType) return null;
    return {
      title: entry.name, file_name: entry.name, file_type: fileType,
      file_path: `${origin}/storage/v1/object/public/${bucket}/${path.split('/').map(encodeURIComponent).join('/')}`
    };
  }

  async function readTree(prefix) {
    const groups = await Promise.all((await listFolder(prefix)).map(async entry => {
      const path = `${prefix}/${entry.name}`;
      if (entry.id == null && entry.metadata == null) return readTree(path);
      const item = mediaItem(path, entry);
      return item ? [item] : [];
    }));
    return groups.flat();
  }

  async function load(category) {
    const expected = folders[category];
    if (!expected) throw new Error('Unknown media category');
    // Storage paths are case-sensitive; preserve the actual uploaded folder name.
    const entries = await listFolder('assets/MULTIMEDIA');
    const folder = entries.find(entry => entry.name.toLowerCase() === expected.toLowerCase());
    if (!folder) throw new Error(`Media folder unavailable: ${expected}`);
    return readTree(`assets/MULTIMEDIA/${folder.name}`);
  }
  return { load };
})();
