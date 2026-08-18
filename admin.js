(() => {
  const cfg = window.WILDAINA_CONFIG || {};
  const configured = Boolean(cfg.supabaseUrl && cfg.supabaseAnonKey && window.supabase);
  const configState = document.getElementById('configState');
  const loginPanel = document.getElementById('loginPanel');
  const studio = document.getElementById('studio');
  if (!configured) {
    configState.hidden = false;
    loginPanel.hidden = true;
    return;
  }

  const client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
  const loginForm = document.getElementById('loginForm');
  const loginMessage = document.getElementById('loginMessage');
  const galleryForm = document.getElementById('galleryForm');
  const videoForm = document.getElementById('videoForm');
  const galleryMessage = document.getElementById('galleryMessage');
  const videoMessage = document.getElementById('videoMessage');
  const items = document.getElementById('items');
  const videos = document.getElementById('videos');
  const signedInAs = document.getElementById('signedInAs');

  async function isAuthorized(user) {
    if (!user) return false;
    const { data, error } = await client.from('wildaina_admins').select('user_id').eq('user_id', user.id).maybeSingle();
    return !error && Boolean(data);
  }

  async function refreshSession() {
    const { data: { session } } = await client.auth.getSession();
    const authorized = await isAuthorized(session?.user);
    if (!authorized) {
      studio.hidden = true;
      loginPanel.hidden = false;
      if (session?.user) {
        await client.auth.signOut();
        loginMessage.textContent = 'This account is not authorized for the Wildaïna content studio.';
      }
      return;
    }
    loginPanel.hidden = true;
    studio.hidden = false;
    signedInAs.textContent = `Signed in as ${session.user.email}`;
    await Promise.all([loadGallery(), loadVideos()]);
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginMessage.textContent = 'Signing in…';
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) { loginMessage.textContent = 'Sign-in failed. Check your credentials.'; return; }
    loginMessage.textContent = '';
    await refreshSession();
  });

  document.getElementById('logout').addEventListener('click', async () => {
    await client.auth.signOut();
    studio.hidden = true;
    loginPanel.hidden = false;
  });

  galleryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    galleryMessage.textContent = 'Uploading…';
    const file = document.getElementById('photo').files[0];
    const title = document.getElementById('title').value.trim();
    if (!file || !title) return;
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
    const path = `${Date.now()}-${safeName}`;
    const { error: uploadError } = await client.storage.from('wildaina-media').upload(path, file, { cacheControl: '3600', upsert: false });
    if (uploadError) { galleryMessage.textContent = uploadError.message; return; }
    const { data: publicData } = client.storage.from('wildaina-media').getPublicUrl(path);
    const { error } = await client.from('wildaina_gallery').insert({ title, image_url: publicData.publicUrl });
    if (error) { galleryMessage.textContent = error.message; return; }
    galleryForm.reset(); galleryMessage.textContent = 'Published.'; await loadGallery();
  });

  videoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    videoMessage.textContent = 'Publishing…';
    const title = document.getElementById('videoTitle').value.trim();
    const url = document.getElementById('videoUrl').value.trim();
    const category = document.getElementById('videoCategory').value;
    const { error } = await client.from('wildaina_videos').insert({ title, url, category });
    if (error) { videoMessage.textContent = error.message; return; }
    videoForm.reset(); videoMessage.textContent = 'Published.'; await loadVideos();
  });

  async function loadGallery() {
    const { data } = await client.from('wildaina_gallery').select('id,title,image_url,created_at').order('created_at', { ascending: false });
    items.innerHTML = (data || []).map(x => `<article><img src="${escapeAttr(x.image_url)}" alt=""><div><strong>${escapeHtml(x.title)}</strong><button class="delete" data-gallery-id="${x.id}">Delete</button></div></article>`).join('');
    items.querySelectorAll('[data-gallery-id]').forEach(btn => btn.addEventListener('click', () => deleteGallery(btn.dataset.galleryId)));
  }

  async function deleteGallery(id) {
    if (!confirm('Delete this gallery item?')) return;
    await client.from('wildaina_gallery').delete().eq('id', id);
    await loadGallery();
  }

  async function loadVideos() {
    const { data } = await client.from('wildaina_videos').select('id,title,url,category,created_at').order('created_at', { ascending: false });
    videos.innerHTML = (data || []).map(x => `<article><div><small>${escapeHtml(x.category)}</small><strong>${escapeHtml(x.title)}</strong><a href="${escapeAttr(x.url)}" target="_blank" rel="noreferrer">Open</a><button class="delete" data-video-id="${x.id}">Delete</button></div></article>`).join('');
    videos.querySelectorAll('[data-video-id]').forEach(btn => btn.addEventListener('click', () => deleteVideo(btn.dataset.videoId)));
  }

  async function deleteVideo(id) {
    if (!confirm('Delete this video?')) return;
    await client.from('wildaina_videos').delete().eq('id', id);
    await loadVideos();
  }

  function escapeHtml(v='') { return String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function escapeAttr(v='') { return escapeHtml(v); }

  client.auth.onAuthStateChange(() => refreshSession());
  refreshSession();
})();
