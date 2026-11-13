(() => {
'use strict';
const sizes = {large:{name:'대과',count:'11–14과',price:65000},medium:{name:'중과',count:'15–18과',price:55000},small:{name:'소과',count:'19–24과',price:40000}};
const varieties = ['혼합','부사','엔부','시나노골드','이지플','감홍'];
const key = 'applepunch-order-v1';
const money = value => new Intl.NumberFormat('ko-KR').format(value) + '원';
const clamp = value => Math.min(99, Math.max(1, Math.floor(Number(value) || 1)));
let order = [];
try {
 const stored = JSON.parse(localStorage.getItem(key) || '[]');
 if (Array.isArray(stored)) order = stored.filter(item => item && Object.hasOwn(sizes,item.size) && varieties.includes(item.variety)).map(item => ({size:item.size,variety:item.variety,quantity:clamp(item.quantity)}));
} catch {}
const unitPrice = item => sizes[item.size].price + (item.variety === '감홍' ? 10000 : 0);
const header = document.querySelector('.site-header');
function updateHeader() { header.classList.toggle('scrolled',window.scrollY > 35 || document.querySelector('.mobile-nav:not([hidden])') !== null); }
window.addEventListener('scroll',updateHeader,{passive:true});
updateHeader();
const menuButton=document.querySelector('.menu-button');
const mobileNav=document.querySelector('.mobile-nav');
function closeMenu() {mobileNav.hidden=true;menuButton.setAttribute('aria-expanded','false');updateHeader();}
menuButton.addEventListener('click',()=>{mobileNav.hidden=!mobileNav.hidden;menuButton.setAttribute('aria-expanded',String(!mobileNav.hidden));updateHeader();});
mobileNav.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
window.matchMedia('(min-width:701px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
const toast=document.querySelector('.toast');
let toastTimer;
function notify(message) {clearTimeout(toastTimer);toast.textContent=message;toast.classList.add('visible');toastTimer=setTimeout(()=>toast.classList.remove('visible'),3000);}
const dialog=document.querySelector('.cart-dialog');
function saveOrder() {try{localStorage.setItem(key,JSON.stringify(order));}catch{}renderCart();}
function renderCart() {
 const count=order.reduce((sum,item)=>sum+item.quantity,0);
 document.querySelectorAll('[data-cart-count]').forEach(el=>{el.textContent='['+count+']';});
 document.querySelector('[data-cart-total]').textContent=money(order.reduce((sum,item)=>sum+unitPrice(item)*item.quantity,0));
 const container=document.querySelector('[data-cart-items]');
 container.innerHTML=order.length ? order.map((item,index)=>`<article class="cart-item"><div class="apple-sprite ${item.size}" aria-hidden="true"></div><div class="cart-item-copy"><div class="cart-item-title"><span>${sizes[item.size].name} 한 상자</span><button type="button" class="remove-item" data-remove="${index}" aria-label="${sizes[item.size].name} ${item.variety} 삭제">삭제</button></div><p>5kg · ${item.variety === '혼합' ? '혼합 구성' : item.variety}</p><div class="cart-item-controls"><div class="quantity-control"><button type="button" data-cart-change="-1" data-index="${index}" aria-label="${sizes[item.size].name} 수량 줄이기" ${item.quantity===1?'disabled':''}>−</button><span aria-label="상자 수" style="min-width:30px;text-align:center;font-size:13px">${item.quantity}</span><button type="button" data-cart-change="1" data-index="${index}" aria-label="${sizes[item.size].name} 수량 늘리기" ${item.quantity===99?'disabled':''}>+</button></div><strong>${money(unitPrice(item)*item.quantity)}</strong></div></div></article>`).join('') : '<div class="empty-cart">아직 고른 사과가 없어요.<br><a href="index.html#products" data-browse>사과 고르러 가기 ↗</a></div>';
 document.querySelector('[data-copy-order]').disabled=order.length===0;
}
document.querySelectorAll('[data-open-cart]').forEach(button=>button.addEventListener('click',()=>{closeMenu();renderCart();dialog.showModal();}));
document.querySelector('[data-close-cart]').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right)dialog.close();}});
dialog.addEventListener('click',event=>{
 const remove=event.target.closest('[data-remove]');
 const change=event.target.closest('[data-cart-change]');
 if(remove){const position=Number(remove.dataset.remove);order.splice(position,1);saveOrder();const next=dialog.querySelector('[data-remove]')||dialog.querySelector('[data-close-cart]');next.focus();}
 if(change){const position=Number(change.dataset.index);const amount=Number(change.dataset.cartChange);if(order[position]){order[position].quantity=clamp(order[position].quantity+amount);saveOrder();const replacement=dialog.querySelector('[data-index="'+position+'"][data-cart-change="'+amount+'"]');if(replacement&&!replacement.disabled)replacement.focus();else dialog.querySelector('[data-close-cart]').focus();}}
 if(event.target.closest('[data-browse]'))dialog.close();
});
document.querySelector('[data-copy-order]').addEventListener('click',async()=>{
 const total=order.reduce((sum,item)=>sum+unitPrice(item)*item.quantity,0);
 const summary='펀치볼 사과나라 주문 문의\n'+order.map(item=>sizes[item.size].name+' 5kg / '+item.variety+' / '+item.quantity+'상자 / '+money(unitPrice(item)*item.quantity)).join('\n')+'\n상품 합계: '+money(total)+'\n주문 구성과 발송일 확인 부탁드립니다.';
 try {await navigator.clipboard.writeText(summary);notify('선택한 구성을 복사했어요.');}catch{notify('복사를 사용할 수 없어요. 목록을 보고 전화로 문의해 주세요.');}
});
window.addEventListener('storage',event=>{if(event.key===key)window.location.reload();});
const form=document.querySelector('#product-form');
if(form){
 const requested=new URLSearchParams(location.search).get('size');
 if(Object.hasOwn(sizes,requested))form.querySelector('input[value="'+requested+'"]').checked=true;
 const quantity=form.querySelector('#quantity');
 function currentItem(){return {size:form.querySelector('[name="size"]:checked').value,variety:form.querySelector('#variety').value,quantity:clamp(quantity.value)};}
 function updateSelection(){
  const item=currentItem();
  document.querySelector('[data-product-price]').textContent=money(unitPrice(item));
  document.querySelector('[data-selection-total]').textContent=money(unitPrice(item)*item.quantity);
  document.querySelector('[data-detail-sprite]').className='apple-sprite '+item.size;
  const minus=form.querySelector('[data-quantity="-1"]');const plus=form.querySelector('[data-quantity="1"]');
  minus.disabled=item.quantity===1;plus.disabled=item.quantity===99;
 }
 form.addEventListener('change',()=>{quantity.value=clamp(quantity.value);updateSelection();});
 quantity.addEventListener('input',updateSelection);
 form.querySelectorAll('[data-quantity]').forEach(button=>button.addEventListener('click',()=>{quantity.value=clamp(Number(quantity.value)+Number(button.dataset.quantity));updateSelection();}));
 form.addEventListener('submit',event=>{
  event.preventDefault();quantity.value=clamp(quantity.value);
  const item=currentItem();const existing=order.find(entry=>entry.size===item.size&&entry.variety===item.variety);
  if(existing)existing.quantity=clamp(existing.quantity+item.quantity);else order.push(item);
  saveOrder();dialog.showModal();
 });
 updateSelection();
}
renderCart();

// Keep native scrolling; only move the editorial imagery and headline within their sections.
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const hero=document.querySelector('.hero');
const statement=document.querySelector('.statement');
let scrollFrame=0;
function renderScroll(){
 scrollFrame=0;
 if(reducedMotion.matches||innerWidth<=700){if(hero)hero.style.removeProperty('--hero-shift');if(statement)statement.style.removeProperty('--statement-travel');return;}
 if(hero){const rect=hero.getBoundingClientRect();hero.style.setProperty('--hero-shift',Math.min(60,Math.max(0,-rect.top*.07))+'px');}
 if(statement){const rect=statement.getBoundingClientRect();const progress=Math.min(1,Math.max(0,(innerHeight-rect.top)/(rect.height+innerHeight)));statement.style.setProperty('--statement-travel',String(Math.max(0,80-progress*140)));}
}
function scheduleScroll(){if(!scrollFrame)scrollFrame=requestAnimationFrame(renderScroll);}
window.addEventListener('scroll',scheduleScroll,{passive:true});
window.addEventListener('resize',scheduleScroll);
reducedMotion.addEventListener('change',scheduleScroll);
renderScroll();

const cultivarInfo=[
 {name:'부사',description:'후지라고도 부르는 대표적인 사과예요. 풍부한 과즙과 달콤한 맛으로 사랑받는 품종입니다.'},
 {name:'엔부',description:'껍질뿐 아니라 과육에도 분홍빛에서 붉은빛이 도는 사과예요. 단맛과 산미가 함께 어우러집니다.'},
 {name:'시나노골드',description:'노란 껍질이 특징인 사과예요. 과즙이 풍부하고 단맛과 산미의 균형이 좋은 품종입니다.'},
 {name:'이지플',description:'홍로와 감홍을 교배해 만든 국내 육성 품종이에요. 달콤하면서도 진한 맛이 특징입니다.'}
];
const guide=document.querySelector('.variety-guide');
if(guide){
 const tooltip=guide.querySelector('.variety-tooltip');
 const buttons=Array.from(guide.querySelectorAll('[data-variety]'));
 let active=null,pinned=false,closeTimer=0,keyboardNavigation=false;
 function hideGuide(){clearTimeout(closeTimer);tooltip.hidden=true;buttons.forEach(button=>{button.setAttribute('aria-expanded','false');button.removeAttribute('aria-describedby');});active=null;pinned=false;}
 function showGuide(button,pin=false){
  clearTimeout(closeTimer);
  const info=cultivarInfo[Number(button.dataset.variety)];
  buttons.forEach(item=>{item.setAttribute('aria-expanded',String(item===button));item.removeAttribute('aria-describedby');});
  button.setAttribute('aria-describedby','variety-tooltip');
  tooltip.querySelector('[data-variety-title]').textContent=info.name;
  tooltip.querySelector('[data-variety-description]').textContent=info.description;
  tooltip.hidden=false;active=button;pinned=pin;
 }
 document.addEventListener('keydown',event=>{if(event.key==='Tab')keyboardNavigation=true;if(event.key==='Escape')hideGuide();});
 document.addEventListener('pointerdown',event=>{keyboardNavigation=false;if(!guide.contains(event.target))hideGuide();});
 buttons.forEach(button=>{
  button.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')showGuide(button);});
  button.addEventListener('focus',()=>{if(keyboardNavigation)showGuide(button);});
  button.addEventListener('click',()=>{if(active===button&&pinned)hideGuide();else showGuide(button,true);});
 });
 guide.addEventListener('pointerenter',()=>clearTimeout(closeTimer));
 guide.addEventListener('pointerleave',()=>{if(!pinned)closeTimer=setTimeout(hideGuide,180);});
 guide.addEventListener('focusout',event=>{if(!guide.contains(event.relatedTarget))hideGuide();});
}

})();
