(function(){
  "use strict";
  var rp=function(n){return "Rp"+n.toLocaleString("id-ID")};
  var $=function(id){return document.getElementById(id)};

  /* 1. Hitung mundur */
  var target=new Date("2026-11-28T09:00:00+07:00").getTime();
  function tick(){
    var d=target-Date.now();
    if(d<=0){["d","h","m","s"].forEach(function(k){$("cd-"+k).textContent="00"});$("cd-note").textContent="Acara sedang berlangsung atau sudah selesai.";return;}
    var v={d:Math.floor(d/864e5),h:Math.floor(d%864e5/36e5),m:Math.floor(d%36e5/6e4),s:Math.floor(d%6e4/1e3)};
    for(var k in v){$("cd-"+k).textContent=String(v[k]).padStart(2,"0")}
  }
  tick();setInterval(tick,1000);

  /* 2. Tab jadwal */
  var jadwal={
    1:[["09:00","Pembukaan & seduh bersama","Panggung utama"],["11:00","Cicip 10 kopi Temanggung","Lapak petani"],["13:30","Kelas V60 untuk pemula","Ruang kelas A"],["16:00","Diskusi: harga adil untuk petani","Panggung utama"]],
    2:[["09:00","Senam pagi & kopi tubruk","Halaman utama"],["10:30","Kelas cold brew","Ruang kelas A"],["13:00","Kompetisi barista amatir","Panggung utama"],["16:30","Pengumuman juara & penutupan","Panggung utama"]]
  };
  var panel=$("panel"),tabs=document.querySelectorAll("[role=tab]");
  function show(day){
    panel.innerHTML="";
    jadwal[day].forEach(function(r){
      var li=document.createElement("li");
      li.innerHTML="<time>"+r[0]+"</time><div><strong>"+r[1]+"</strong><small>"+r[2]+"</small></div>";
      panel.appendChild(li);
    });
    tabs.forEach(function(t){
      var on=t.dataset.day==day;
      t.setAttribute("aria-selected",on);t.tabIndex=on?0:-1;
      if(on)panel.setAttribute("aria-labelledby",t.id);
    });
  }
  tabs.forEach(function(t,i){
    t.addEventListener("click",function(){show(t.dataset.day)});
    t.addEventListener("keydown",function(e){
      if(e.key==="ArrowRight"||e.key==="ArrowLeft"){var n=tabs[(i+1)%2];n.focus();show(n.dataset.day)}
    });
  });
  show(1);

  /* 3. Kalkulator tiket + validasi form */
  var qty=$("qty"),promo=$("promo");
  function hitung(){
    var r=document.querySelector("input[name=jenis]:checked");
    var harga=+r.value,n=parseInt(qty.value,10);
    var valid=n>=1&&n<=10;
    if(!valid)n=0;
    var sub=harga*n,pakaiPromo=promo.value.trim().toUpperCase()==="KOPI10";
    var disc=pakaiPromo?Math.round(sub*.1):0;
    $("s-jenis").textContent=r.dataset.nama;
    $("s-qty").textContent=n;
    $("s-sub").textContent=rp(sub);
    $("s-disc").textContent=disc?"−"+rp(disc):"–";
    $("s-total").textContent=rp(sub-disc);
    $("e-promo").textContent=promo.value&&!pakaiPromo?"Kode tidak dikenali.":(pakaiPromo?"Kode berlaku: diskon 10%.":"");
    return valid;
  }
  function setErr(input,errId,msg){
    $(errId).textContent=msg;
    input.setAttribute("aria-invalid",msg?"true":"false");
    return !msg;
  }
  document.querySelectorAll("input[name=jenis]").forEach(function(i){i.addEventListener("change",hitung)});
  qty.addEventListener("input",function(){
    var n=parseInt(qty.value,10);
    setErr(qty,"e-qty",n>=1&&n<=10?"":"Isi jumlah tiket antara 1 dan 10.");
    hitung();
  });
  promo.addEventListener("input",hitung);

  $("form").addEventListener("submit",function(e){
    e.preventDefault();
    var nama=$("nama"),email=$("email");
    var a=setErr(qty,"e-qty",hitung()?"":"Isi jumlah tiket antara 1 dan 10.");
    var b=setErr(nama,"e-nama",nama.value.trim().length>=3?"":"Tulis nama lengkap, minimal 3 huruf.");
    var c=setErr(email,"e-email",/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)?"":"Tulis email yang valid, contoh: nama@email.com.");
    var ok=$("ok");
    if(a&&b&&c){
      ok.hidden=false;
      ok.textContent="Terima kasih, "+nama.value.trim()+". Konfirmasi dikirim ke "+email.value.trim()+".";
    }else{
      ok.hidden=true;
      var first=document.querySelector("[aria-invalid=true]");if(first)first.focus();
    }
  });
  hitung();
})();
