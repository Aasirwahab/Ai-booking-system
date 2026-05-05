(function() {
  const script = document.currentScript;
  const orgSlug = script.getAttribute('data-org-slug');
  const baseUrl = script.getAttribute('data-base-url') || window.location.origin;

  if (!orgSlug) {
    console.error('Antigravity AI: Missing data-org-slug attribute');
    return;
  }

  // Create Container
  const container = document.createElement('div');
  container.id = 'antigravity-chat-container';
  container.style.position = 'fixed';
  container.style.bottom = '20px';
  container.style.right = '20px';
  container.style.zIndex = '999999';
  container.style.fontFamily = 'Inter, system-ui, sans-serif';
  document.body.appendChild(container);

  // Create Floating Button
  const button = document.createElement('button');
  button.id = 'antigravity-chat-button';
  button.style.width = '60px';
  button.style.height = '60px';
  button.style.borderRadius = '30px';
  button.style.backgroundColor = '#0f172a';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
  button.style.cursor = 'pointer';
  button.style.display = 'flex';
  button.style.alignItems = 'center';
  button.style.justifyContent = 'center';
  button.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>';
  
  button.onmouseover = () => button.style.transform = 'scale(1.1) translateY(-5px)';
  button.onmouseout = () => button.style.transform = 'scale(1) translateY(0)';
  
  container.appendChild(button);

  // Create Iframe Window
  const iframeWrapper = document.createElement('div');
  iframeWrapper.id = 'antigravity-chat-window';
  iframeWrapper.style.position = 'absolute';
  iframeWrapper.style.bottom = '80px';
  iframeWrapper.style.right = '0';
  iframeWrapper.style.width = '400px';
  iframeWrapper.style.height = '600px';
  iframeWrapper.style.maxWidth = 'calc(100vw - 40px)';
  iframeWrapper.style.maxHeight = 'calc(100vh - 120px)';
  iframeWrapper.style.backgroundColor = 'transparent';
  iframeWrapper.style.borderRadius = '24px';
  iframeWrapper.style.boxShadow = '0 20px 50px rgba(0,0,0,0.15)';
  iframeWrapper.style.overflow = 'hidden';
  iframeWrapper.style.display = 'none';
  iframeWrapper.style.opacity = '0';
  iframeWrapper.style.transform = 'translateY(20px) scale(0.95)';
  iframeWrapper.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  iframeWrapper.style.pointerEvents = 'none';

  const iframe = document.createElement('iframe');
  iframe.src = `${baseUrl}/embed/chat/${orgSlug}`;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframeWrapper.appendChild(iframe);
  
  container.appendChild(iframeWrapper);

  let isOpen = false;

  button.onclick = () => {
    isOpen = !isOpen;
    if (isOpen) {
      iframeWrapper.style.display = 'block';
      setTimeout(() => {
        iframeWrapper.style.opacity = '1';
        iframeWrapper.style.transform = 'translateY(0) scale(1)';
        iframeWrapper.style.pointerEvents = 'all';
      }, 10);
      button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
    } else {
      iframeWrapper.style.opacity = '0';
      iframeWrapper.style.transform = 'translateY(20px) scale(0.95)';
      iframeWrapper.style.pointerEvents = 'none';
      setTimeout(() => {
        iframeWrapper.style.display = 'none';
      }, 300);
      button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>';
    }
  };
})();
