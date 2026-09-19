const menu = document.querySelector('.menu');
const nav = document.querySelector('#nav');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
}));
document.querySelector('#year').textContent = new Date().getFullYear();
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const chatStyles = document.createElement('link');
chatStyles.rel = 'stylesheet'; chatStyles.href = 'chat.css'; document.head.appendChild(chatStyles);
const chatEnhancedStyles = document.createElement('link');
chatEnhancedStyles.rel = 'stylesheet'; chatEnhancedStyles.href = 'chat-enhanced.css'; document.head.appendChild(chatEnhancedStyles);
const qualityStyles = document.createElement('link');
qualityStyles.rel = 'stylesheet'; qualityStyles.href = 'quality.css'; document.head.appendChild(qualityStyles);
const legalStyles = document.createElement('link');
legalStyles.rel = 'stylesheet'; legalStyles.href = 'legal.css'; document.head.appendChild(legalStyles);
const assistant = document.createElement('aside');
assistant.className = 'vq-chat';
assistant.innerHTML = `<button class="vq-chat-toggle" type="button" aria-expanded="false" aria-controls="vq-chat-panel" aria-label="Open Vortiqora assistant"><span class="vq-chat-icon">✦</span><span class="vq-chat-label">Ask Vortiqora</span></button><section id="vq-chat-panel" class="vq-chat-panel" aria-label="Vortiqora website assistant" hidden><header><div><strong>Vortiqora Assistant</strong><small><i></i> Automated website guide</small></div><button class="vq-chat-close" type="button" aria-label="Close chat">×</button></header><div class="vq-chat-messages" aria-live="polite"><div class="vq-message bot">Hello. Ask me about our products, services, partnerships, pricing or current development stage. You can write naturally.</div></div><div class="vq-quick" aria-label="Common questions"><button data-answer="product">Core product</button><button data-answer="services">Services</button><button data-answer="pricing">Pricing</button><button data-answer="whatsapp">WhatsApp</button></div><form class="vq-chat-form"><label class="sr-only" for="vq-question">Your question</label><input id="vq-question" name="question" placeholder="How can we help?" autocomplete="off"><button type="submit" aria-label="Send question">↑</button></form><p class="vq-chat-disclaimer">Automated guide · Continue with the team for specific advice</p></section>`;
document.body.appendChild(assistant);
const toggle = assistant.querySelector('.vq-chat-toggle');
const panel = assistant.querySelector('.vq-chat-panel');
const closeChat = assistant.querySelector('.vq-chat-close');
const messages = assistant.querySelector('.vq-chat-messages');
const form = assistant.querySelector('.vq-chat-form');
const input = assistant.querySelector('#vq-question');
const answers = {
  product: `Our core product direction is trusted identity for physical assets, starting with electronics: verification, secure ownership transfer and a durable Asset Passport. It is currently in development. <a href="products.html">Explore the product →</a>`,
  services: `We design practical business systems, trusted asset-identity products and focused technology for organisations and communities. The right starting point is a specific operational problem, not a vague request for “an app.” <a href="work.html">See our work →</a>`,
  partner: `We want to hear from electronics dealers, repair shops, refurbishers, marketplaces, insurers, financiers and organisations close to a real trust problem. <a href="contact.html">Start a partnership conversation →</a>`,
  pricing: `Pricing depends on the problem, scope and stage. Vortiqora ID does not yet have public pricing because it is still in development. For a scoped technology project, share what you need and the team can discuss fit and budget.`,
  status: `Vortiqora ID is in discovery and development. We are validating workflows and the strongest first use case before making launch claims.`,
  careers: `Vortiqora is not advertising full-time roles at the moment. Genuine openings will only be published when the role and budget exist. <a href="careers.html">Visit Careers →</a>`,
  location: `Vortiqora Technologies is based in Kiambu County, Kenya, and is building with long-term relevance across African markets.`,
  contact: `You can email <a href="mailto:vortiqoratech@gmail.com">vortiqoratech@gmail.com</a> or continue on WhatsApp.`,
  greeting: `Hello 👋 How can I help? You can ask about our products, services, partnerships, pricing, location or development stage.`,
  thanks: `You’re welcome. If you need an answer from the team, I can help you continue on WhatsApp.`
};
function whatsappOptions(question = '') {
  const context = question ? ` My question is: ${question}` : ' I would like to learn more about Vortiqora Technologies.';
  const message = encodeURIComponent(`Hello Vortiqora Technologies.${context}`);
  return `<div class="whatsapp-options"><a href="https://wa.me/254117499067?text=${message}" target="_blank" rel="noopener">WhatsApp 0117 499 067 ↗</a><a href="https://wa.me/254116096909?text=${message}" target="_blank" rel="noopener">WhatsApp 0116 096 909 ↗</a></div>`;
}
function setChat(open) { panel.hidden = !open; toggle.setAttribute('aria-expanded', String(open)); if (open) input.focus(); }
function addMessage(content, who) { const item = document.createElement('div'); item.className = `vq-message ${who}`; item.innerHTML = content; messages.appendChild(item); messages.scrollTop = messages.scrollHeight; }
toggle.addEventListener('click', () => setChat(panel.hidden)); closeChat.addEventListener('click', () => setChat(false));
assistant.querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click', () => {
  const key = button.dataset.answer; addMessage(button.textContent, 'user');
  addMessage(key === 'whatsapp' ? `Choose a number to continue with the team:${whatsappOptions()}` : answers[key], 'bot');
}));
form.addEventListener('submit', event => {
  event.preventDefault(); const question = input.value.trim(); if (!question) return;
  addMessage(question.replace(/[<>]/g, ''), 'user'); input.value = '';
  const lower = question.toLowerCase(); let reply;
  if (/whats\s?app|wa\.me|chat with|speak to|talk to|human|person|agent|call me|phone|number/.test(lower)) reply = `Absolutely. Choose either Vortiqora number and your question will be included:${whatsappOptions(question)}`;
  else if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(lower)) reply = answers.greeting;
  else if (/thank|thanks|asante/.test(lower)) reply = answers.thanks;
  else if (/price|pricing|cost|charge|budget|how much|quotation|quote/.test(lower)) reply = `${answers.pricing}${whatsappOptions(question)}`;
  else if (/product|asset|verify|verification|passport|ownership|stolen|electronics|phone/.test(lower)) reply = answers.product;
  else if (/service|system|software|website|app|platform|build|develop/.test(lower)) reply = answers.services;
  else if (/partner|dealer|business|invest|collaborat|marketplace|insur|financ|repair|refurbish/.test(lower)) reply = answers.partner;
  else if (/available|launch|ready|status|stage|when/.test(lower)) reply = answers.status;
  else if (/job|career|intern|attachment|vacancy|work for|hiring/.test(lower)) reply = answers.careers;
  else if (/location|where|based|office|nairobi|kenya|kiambu/.test(lower)) reply = answers.location;
  else if (/email|contact|reach/.test(lower)) reply = `${answers.contact}${whatsappOptions(question)}`;
  else { const mail = `mailto:vortiqoratech@gmail.com?subject=${encodeURIComponent('Website enquiry')}&body=${encodeURIComponent(question)}`; reply = `I may not have the exact answer, and I don’t want to guess. Continue with the Vortiqora team on WhatsApp or <a href="${mail}">send this question by email →</a>${whatsappOptions(question)}`; }
  window.setTimeout(() => addMessage(reply, 'bot'), 320);
});
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !panel.hidden) setChat(false); });

const contactForm = document.querySelector('.contact-form');
if (contactForm) contactForm.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const name = String(data.get('name') || '').trim();
  const email = String(data.get('email') || '').trim();
  const message = String(data.get('message') || '').trim();
  if (!name || !email || !message || !contactForm.reportValidity()) return;
  const subject = encodeURIComponent(`Vortiqora website enquiry from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nWhat I want to solve:\n${message}`);
  window.location.href = `mailto:vortiqoratech@gmail.com?subject=${subject}&body=${body}`;
});
