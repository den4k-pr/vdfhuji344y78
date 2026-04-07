(function() {
  const USER_ID_KEY = 'ab_user_id';
  const AB_COOKIE = 'ab_variant';
  const PAGE_VIEW_KEY = 'ab_page_view_sent';
  const LEAD_KEY = 'ab_lead_sent';
  const TRACK_URL = 'https://a-b-flax.vercel.app/api/events';
  const AB_API = 'https://a-b-flax.vercel.app/api/get-ab-variant';

  // --- Cookie utils ---
  function setCookie(name, value, days) {
    const expires = days ? "; expires=" + new Date(Date.now() + days*864e5).toUTCString() : '';
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
    console.log(`%c [COOKIE SET] ${name} = ${value} (expires in ${days || 'session'} days)`, 'color:#0af;font-weight:bold');
  }

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    const val = match ? decodeURIComponent(match[2]) : null;
    console.log(`%c [COOKIE GET] ${name} = ${val}`, 'color:#0a0;font-weight:bold');
    return val;
  }

  // --- User ID ---
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).slice(2,10);
    localStorage.setItem(USER_ID_KEY, userId);
    console.log(`%c [USER ID CREATED] ${userId}`, 'color:#f90;font-weight:bold');
  } else {
    console.log(`%c [USER ID EXISTING] ${userId}`, 'color:#f90;font-weight:bold');
  }

  // --- UTM params ---
  const urlParams = new URLSearchParams(window.location.search);
  const utmFields = ['utm_source','utm_medium','utm_campaign','utm_content'];
  utmFields.forEach(f => {
    const val = urlParams.get(f);
    if (val) setCookie(f, val, 30);
  });

  const utm = {
    source: getCookie('utm_source') || '',
    medium: getCookie('utm_medium') || '',
    campaign: getCookie('utm_campaign') || '',
    content: getCookie('utm_content') || ''
  };
  console.log('%c [UTM PARAMS]', 'color:#0ff;font-weight:bold', utm);

  // --- Event tracking ---
  function sendEvent(type) {
    console.groupCollapsed(`%c [TRACKING] Event: ${type}`, 'color:#0f0;font-weight:bold');
    console.log('User ID:', userId);
    console.log('Variant:', window.ab_variant);
    console.log('UTM:', utm);
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();

    fetch(TRACK_URL, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      keepalive: true,
      body: JSON.stringify({
        website: location.hostname,
        variant: window.ab_variant,
        event: type,
        utm_source: utm.source,
        utm_medium: utm.medium,
        utm_campaign: utm.campaign,
        utm_content: utm.content,
        user_id: userId,
        timestamp: new Date().toISOString()
      })
    }).catch(e => console.error('%c [TRACKING ERROR]', 'color:red;font-weight:bold', e));
  }

  // --- Init A/B variant ---
  async function initVariant() {
    console.group('%c [A/B TEST INIT]', 'color:#ff0;font-weight:bold');
    let variant = getCookie(AB_COOKIE);

    if (!variant) console.log('%c No cookie variant, will fetch from server...', 'color:#0ff;font-weight:bold');

    try {
      const res = await fetch(`${AB_API}?user_id=${encodeURIComponent(userId)}`, {cache:'no-store'});
      const data = await res.json();
      variant = data.variant === 'A' ? 'A' : 'B';
      setCookie(AB_COOKIE, variant, 365);
      console.log(`%c [SERVER ASSIGNED VARIANT] ${variant}`, 'color:#0f0;font-weight:bold');
    } catch (e) {
      console.warn('%c [AB FETCH FAILED, fallback 50/50]', 'color:#f00;font-weight:bold', e);
      if (!variant) variant = Math.random() < 0.5 ? 'A' : 'B';
      setCookie(AB_COOKIE, variant, 365);
      console.log(`%c [FALLBACK VARIANT] ${variant}`, 'color:#f0a;font-weight:bold');
    }

    window.ab_variant = variant;

    // --- Show/hide blocks immediately ---
    const showClass = variant === 'A' ? '.a-test' : '.b-test';
    const hideClass = variant === 'A' ? '.b-test' : '.a-test';

    document.querySelectorAll(showClass).forEach(el => {
      el.style.display = 'flex';
      el.style.opacity = '1';
      console.log(`%c [SHOW ELEMENT]`, 'color:#0f0;font-weight:bold', el);
    });

    document.querySelectorAll(hideClass).forEach(el => {
      el.style.display = 'none';
      el.style.opacity = '0';
      console.log(`%c [HIDE ELEMENT]`, 'color:#f00;font-weight:bold', el);
    });

    // --- PageView ---
    if (!localStorage.getItem(PAGE_VIEW_KEY)) {
      console.log('%c Sending PageView event', 'color:#0ff;font-weight:bold');
      sendEvent('page_view');
      localStorage.setItem(PAGE_VIEW_KEY, 'true');
    } else {
      console.log('%c PageView already sent', 'color:#999;font-style:italic');
    }

    // --- Lead ---
    const isThankYou = location.href.toLowerCase().includes('thankyoupage');
    if (isThankYou && !localStorage.getItem(LEAD_KEY) &&
        (utm.source || utm.medium || utm.campaign || utm.content)) {
      console.log('%c Sending Lead event', 'color:#0ff;font-weight:bold');
      sendEvent('lead');
      localStorage.setItem(LEAD_KEY, 'true');
    } else if (isThankYou) {
      console.log('%c Lead already sent', 'color:#999;font-style:italic');
    }

    // --- Click tracking ---
    document.addEventListener('click', e => {
      const btn = e.target.closest('.button-test-AB');
      if (btn && !btn.dataset.clickSent) {
        btn.dataset.clickSent = 'true';
        console.log('%c Click detected on .button-test-AB', 'color:#f0f;font-weight:bold', btn);
        sendEvent('click');
      }
    });

    console.groupEnd();
  }

  // --- Execute ASAP ---
  initVariant();

})();
