(() => {
'use strict';
const sizes = {large:{name:'대과',count:'11–14과',price:65000},medium:{name:'중과',count:'15–18과',price:55000},small:{name:'소과',count:'19–24과',price:40000}};
const varieties = ['혼합','부사','엔부','시나노골드','이지플','감홍'];

const cultivarInfo=[{"name":"부사","slug":"fuji","file":"fuji.webp","sweet":4,"acid":2,"tag":"달콤한 대표 사과","credit":"산의선물","source":"https://www.mountaingift.co.kr/varieties/","description":"후지라고도 부르는 대표적인 사과예요. 풍부한 과즙과 달콤한 맛으로 사랑받는 품종입니다."},{"name":"엔부","slug":"enbu","file":"enbu-orchard.jpg","sweet":4,"acid":3,"tag":"속에도 붉은빛","credit":"평농","source":"https://www.pyeongnong.co.kr/product/subpage/apple","description":"껍질뿐 아니라 과육에도 분홍빛에서 붉은빛이 도는 사과예요. 단맛과 산미가 함께 어우러집니다."},{"name":"시나노골드","slug":"shinano","file":"shinano-gold.jpg","sweet":3,"acid":4,"tag":"산뜻한 새콤달콤","credit":"나가노현 과수시험장","source":"https://www.pref.nagano.lg.jp/kajushiken/jisseki/joho/ringo.html","description":"노란 껍질이 특징인 사과예요. 과즙이 풍부하고 단맛과 산미의 균형이 좋은 품종입니다."},{"name":"이지플","slug":"easyple","file":"easyple.jpg","sweet":5,"acid":2,"tag":"달콤하고 진한 맛","credit":"국립원예특작과학원","source":"https://nihhs.go.kr/usr/nihhs/news_Card_view.do?idx=38440","description":"홍로와 감홍을 교배해 만든 국내 육성 품종이에요. 달콤하면서도 진한 맛이 특징입니다."},{"name":"감홍","slug":"gamhong","file":"gamhong.webp","sweet":5,"acid":2,"tag":"진한 단맛","credit":"산의선물","source":"https://www.mountaingift.co.kr/varieties/","description":"국내에서 육성한 사과 품종으로 진한 단맛과 씹는 맛이 특징이에요. 한 상자 가격에 10,000원이 추가됩니다."},{"name":"혼합","slug":"mixed","file":"../real-apple-box.webp","sweet":null,"acid":null,"tag":"좋아하는 품종을 함께","credit":"펀치볼 사과나라","source":null,"description":"빨간 사과와 노란 사과를 함께 담는 구성이에요. 준비 가능한 품종은 주문할 때 확인해 주세요."}];
const cultivarByName=Object.fromEntries(cultivarInfo.map(info=>[info.name,info]));
function cultivarPhoto(info, className=''){
 return '<span class="cultivar-photo photo-'+info.slug+' '+className+'"><img src="assets/cultivars/'+info.file+'" alt="'+(info.name==='혼합'?'혼합 사과 실제 포장':info.name+' 품종 참고 사진')+'" width="150" height="100" loading="lazy"></span>';
}
function tasteDots(label,value){
 return '<span class="taste-row" aria-label="'+label+' 경향 '+value+'/5"><span>'+label+'</span><span class="taste-dots" aria-hidden="true">'+Array.from({length:5},(_,index)=>'<i class="'+(index<value?'filled':'')+'"></i>').join('')+'</span></span>';
}
function tasteGuide(info){return info.sweet?'<div class="taste-ratings">'+tasteDots('당도',info.sweet)+tasteDots('산미',info.acid)+'</div>':'<p class="mixed-taste">선택한 품종에 따라 맛이 달라져요.</p>';}

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
 const previousScrollTop=container.scrollTop;
 container.innerHTML=order.length ? order.map((item,index)=>`<article class="cart-item">${cultivarPhoto(cultivarByName[item.variety])}<div class="cart-item-copy"><div class="cart-item-title"><span>${sizes[item.size].name} 한 상자</span><button type="button" class="remove-item" data-remove="${index}" aria-label="${sizes[item.size].name} ${item.variety} 삭제">삭제</button></div><p>5kg · ${item.variety === '혼합' ? '혼합 구성' : item.variety}</p><div class="cart-item-controls"><div class="quantity-control"><button type="button" data-cart-change="-1" data-index="${index}" aria-label="${sizes[item.size].name} 수량 줄이기" ${item.quantity===1?'disabled':''}>−</button><span aria-label="상자 수" style="min-width:30px;text-align:center;font-size:13px">${item.quantity}</span><button type="button" data-cart-change="1" data-index="${index}" aria-label="${sizes[item.size].name} 수량 늘리기" ${item.quantity===99?'disabled':''}>+</button></div><strong>${money(unitPrice(item)*item.quantity)}</strong></div></div></article>`).join('') : '<div class="empty-cart">아직 고른 사과가 없어요.<br><a href="index.html#products" data-browse>사과 고르러 가기 ↗</a></div>';
 container.scrollTop=previousScrollTop;
 document.querySelector('[data-copy-order]').disabled=order.length===0;
}
document.querySelectorAll('[data-open-cart]').forEach(button=>button.addEventListener('click',()=>{closeMenu();renderCart();dialog.showModal();}));
document.querySelector('[data-close-cart]').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right)dialog.close();}});
dialog.addEventListener('click',event=>{
 const remove=event.target.closest('[data-remove]');
 const change=event.target.closest('[data-cart-change]');
 if(remove){const position=Number(remove.dataset.remove);order.splice(position,1);saveOrder();const next=dialog.querySelector('[data-remove="'+Math.min(position,order.length-1)+'"]')||dialog.querySelector('[data-close-cart]');next.focus({preventScroll:true});}
 if(change){const position=Number(change.dataset.index);const amount=Number(change.dataset.cartChange);if(order[position]){order[position].quantity=clamp(order[position].quantity+amount);saveOrder();const replacement=dialog.querySelector('[data-index="'+position+'"][data-cart-change="'+amount+'"]');if(replacement&&!replacement.disabled)replacement.focus({preventScroll:true});else dialog.querySelector('[data-close-cart]').focus({preventScroll:true});}}
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
 function currentItem(){return {size:form.querySelector('[name="size"]:checked').value,variety:form.querySelector('[name="variety"]:checked').value,quantity:clamp(quantity.value)};}
 function updateSelection(){
  const item=currentItem();
  document.querySelector('[data-product-price]').textContent=money(unitPrice(item));
  document.querySelector('[data-selection-total]').textContent=money(unitPrice(item)*item.quantity);
  document.querySelector('[data-detail-sprite]').className='apple-sprite '+item.size;
  document.querySelector('[data-thumbnail-sprite]').className='apple-sprite '+item.size;
  const cultivar=cultivarByName[item.variety];
  const stage=document.querySelector('.gallery-stage');
  stage.dataset.variety=item.variety==='혼합'?'mixed':'single';
  if(stage.dataset.gallery==='apples')document.querySelector('[data-gallery-caption]').textContent=item.variety==='혼합'?'혼합 구성 연출 이미지 · 실제 구성은 주문 시 확인해 주세요.':'상품 연출 이미지 · 구성은 선택 옵션에 따라 달라집니다.';

  document.querySelector('[data-selected-cultivar]').innerHTML=cultivarPhoto(cultivar)+'<div><strong>'+cultivar.name+(cultivar.name==='혼합'?' 구성':'')+'</strong><p>'+cultivar.description+'</p>'+tasteGuide(cultivar)+(cultivar.sweet?'<small class="taste-selection-note">품종의 일반적인 맛의 경향이며 실측값은 아니에요.</small>':'')+'</div>';
  document.querySelector('[data-mobile-total]').textContent=money(unitPrice(item)*item.quantity);

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
 if(statement)statement.style.removeProperty('--statement-travel');
}
function scheduleScroll(){if(!scrollFrame)scrollFrame=requestAnimationFrame(renderScroll);}
window.addEventListener('scroll',scheduleScroll,{passive:true});
window.addEventListener('resize',scheduleScroll);
reducedMotion.addEventListener('change',scheduleScroll);
renderScroll();


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
  tooltip.querySelector('[data-variety-photo]').innerHTML=cultivarPhoto(info);
  tooltip.querySelector('[data-variety-taste]').innerHTML=tasteGuide(info);
  tooltip.querySelector('[data-variety-credit]').textContent='품종 참고 사진 · '+info.credit+' / 일반적인 맛의 경향·실측값 아님';

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


if(form){
 const gallery=document.querySelector('.gallery-stage');
 const galleryImage=document.querySelector('[data-gallery-image]');
 const galleryCaption=document.querySelector('[data-gallery-caption]');
 const galleryChoices=Array.from(document.querySelectorAll('[data-gallery-choice]'));
 const views={
  apples:{caption:'상품 연출 이미지 · 구성은 선택 옵션에 따라 달라집니다.'},
  packing:{src:'assets/real-apple-box.webp',alt:'펀치볼 사과나라 실제 혼합 사과 포장',caption:'실제 포장 사진 · 크기와 품종에 따라 구성이 달라집니다.'},
  table:{src:'assets/apple-table-hero.png',alt:'식탁 위 사과 연출 사진',caption:'식탁 연출 이미지'}
 };
 galleryChoices.forEach(button=>button.addEventListener('click',()=>{
  const choice=button.dataset.galleryChoice;
  gallery.dataset.gallery=choice;
  galleryChoices.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  galleryImage.hidden=choice==='apples';
  if(choice!=='apples'){galleryImage.src=views[choice].src;galleryImage.alt=views[choice].alt;}
  galleryCaption.textContent=choice==='apples'&&form.querySelector('[name="variety"]:checked').value==='혼합'?'혼합 구성 연출 이미지 · 실제 구성은 주문 시 확인해 주세요.':views[choice].caption;
 }));
 const tabs=Array.from(document.querySelectorAll('[role="tab"]'));
 function selectTab(tab){
  tabs.forEach(item=>{const selected=item===tab;item.setAttribute('aria-selected',String(selected));item.tabIndex=selected?0:-1;document.getElementById(item.getAttribute('aria-controls')).hidden=!selected;});
 }
 tabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>selectTab(tab));
  tab.addEventListener('keydown',event=>{
   let next;
   if(event.key==='ArrowRight')next=(index+1)%tabs.length;
   if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;
   if(event.key==='Home')next=0;
   if(event.key==='End')next=tabs.length-1;
   if(next!==undefined){event.preventDefault();selectTab(tabs[next]);tabs[next].focus();}
  });
 });
 const mobileBar=document.querySelector('.mobile-order-bar');
 const addButton=form.querySelector('.add-button');
 document.querySelector('[data-mobile-add]').addEventListener('click',()=>form.requestSubmit());
 function updateMobileBar(){
  const formBox=form.getBoundingClientRect();
  const buttonBox=addButton.getBoundingClientRect();
  const viewportHeight=window.visualViewport?.height||innerHeight;
  const editingQuantity=document.activeElement===form.querySelector('#quantity');
  // The dock only helps before the form's own button comes into view.
  // It does not follow the visitor into the guide, packing section or footer.
  mobileBar.hidden=innerWidth>700||formBox.top>=viewportHeight-110||buttonBox.top<viewportHeight||dialog.open||editingQuantity;
 }
 new IntersectionObserver(updateMobileBar,{threshold:[0,1]}).observe(addButton);
 const barObserver=new MutationObserver(updateMobileBar);
 barObserver.observe(dialog,{attributes:true,attributeFilter:['open']});
 window.addEventListener('scroll',updateMobileBar,{passive:true});
 window.addEventListener('resize',updateMobileBar);
 form.addEventListener('focusin',updateMobileBar);
 form.addEventListener('focusout',()=>requestAnimationFrame(updateMobileBar));
 new ResizeObserver(updateMobileBar).observe(form);
 window.visualViewport?.addEventListener('resize',updateMobileBar);

 updateMobileBar();
}

})();
