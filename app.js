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
})();
