
(function(){
  var overlay=document.getElementById('whatsNew');
  var closeBtn=document.getElementById('wnClose');
  if(!overlay)return;
  function show(){overlay.classList.add('show')}
  function hide(){overlay.classList.remove('show')}
  closeBtn.addEventListener('click',hide);
  overlay.addEventListener('click',function(e){if(e.target===overlay)hide()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')hide()});
  // Pop up shortly after entry
  window.addEventListener('load',function(){setTimeout(show,600)});
  // Fallback if load already fired
  if(document.readyState==='complete')setTimeout(show,600);
})();
