const sb = window.supabase.createClient(
  "https://ratvtcqgxarnytxuhyiq.supabase.co",
  "sb_publishable_e8-2J7kgB6HmIiHE2DVV7w_3-vrhkkJ"
);
sb.auth.onAuthStateChange((event, session) => {
  if (
    (event === "SIGNED_IN" || event === "INITIAL_SESSION") &&
    session?.user?.email
  ) {
    close();

    const role =
      session.user.email.toLowerCase() ===
      "segarinfreshmarket@gmail.com"
        ? "Admin"
        : "Pembeli";

    dashboard(role);
  }
});
const initial = [
  {id:1,name:"Ikan Kakap Merah",cat:"Seafood",emoji:"🐟",price:65000,unit:"kg",desc:"Ikan segar pilihan"},
  {id:2,name:"Udang Vaname",cat:"Seafood",emoji:"🦐",price:78000,unit:"kg",desc:"Udang pilihan pemasok"},
  {id:3,name:"Cumi Segar",cat:"Seafood",emoji:"🦑",price:69000,unit:"kg",desc:"Cocok untuk aneka masakan"},
  {id:4,name:"Ikan Bandeng",cat:"Seafood",emoji:"🐠",price:38000,unit:"kg",desc:"Pilihan keluarga"},
  {id:5,name:"Bayam Hijau",cat:"Sayuran",emoji:"🥬",price:8000,unit:"ikat",desc:"Sayuran panen pilihan"},
  {id:6,name:"Wortel",cat:"Sayuran",emoji:"🥕",price:12000,unit:"kg",desc:"Segar dan renyah"},
  {id:7,name:"Brokoli",cat:"Sayuran",emoji:"🥦",price:22000,unit:"kg",desc:"Sayuran hijau pilihan"},
  {id:8,name:"Tomat Merah",cat:"Sayuran",emoji:"🍅",price:14000,unit:"kg",desc:"Matang pilihan"}];
let products = JSON.parse(localStorage.getItem("sg_products") || "null") || initial;
let cart = JSON.parse(localStorage.getItem("sg_cart") || "{}");
function save() {
  localStorage.setItem("sg_products", JSON.stringify(products));
  localStorage.setItem("sg_cart", JSON.stringify(cart));
}

function toast(message) {
  let el = document.getElementById("sgToast");

  if (!el) {
    el = document.createElement("div");
    el.id = "sgToast";
    el.style.cssText = "position:fixed;bottom:25px;left:50%;transform:translateX(-50%);background:#222;color:white;padding:12px 20px;border-radius:10px;z-index:99999;";
    document.body.appendChild(el);
  }

  el.textContent = message;
  el.style.display = "block";

  clearTimeout(window.sgToastTimer);
  window.sgToastTimer = setTimeout(() => {
    el.style.display = "none";
  }, 2500);
}
let filter = "Semua";
const $ = s => document.querySelector(s);
const rupiah = n => "Rp" + Number(n).toLocaleString("id-ID");
function render(){let q=$("#search").value.toLowerCase();let list=products.filter(p=>(filter==="Semua"||p.cat===filter)&&p.name.toLowerCase().includes(q));$("#products").innerHTML=list.map(p=>`<article class="product"><div class="photo">${p.emoji}</div><div class="pbody"><span class="tag">${p.cat} · ${p.tag||"Fresh"}</span><h3>${esc(p.name)}</h3><div class="desc">${esc(p.desc||"Produk segar pilihan")}</div><div class="price">${rupiah(p.price)} <small>/${p.unit}</small></div><button class="add" onclick="add(${p.id})">+ Tambah ke keranjang</button></div></article>`).join("")||"<p>Produk tidak ditemukan.</p>"}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function add(id){cart[id]=(cart[id]||0)+1;save();cartCount();toast("Produk ditambahkan ke keranjang")}
function cartCount(){$("#cartCount").textContent=Object.values(cart).reduce((a,b)=>a+b,0)}
function modal(html){$("#modalContent").innerHTML=html;$("#modal").classList.remove("hidden")}
function close(){ $("#modal").classList.add("hidden")}
function showCart(){let items=Object.entries(cart).filter(x=>x[1]>0),total=items.reduce((s,[id,n])=>s+(products.find(p=>p.id==id)?.price||0)*n,0);modal(`<h2>Keranjang belanja</h2>${items.map(([id,n])=>{let p=products.find(x=>x.id==id);return p?`<div class="row"><span>${p.emoji} ${esc(p.name)}<br><small>${rupiah(p.price)} × ${n}</small></span><span><button onclick="change(${id},-1)">−</button> ${n} <button onclick="change(${id},1)">+</button></span></div>`:""}).join("")||"<p>Keranjang masih kosong.</p>"}<h3>Total produk: ${rupiah(total)}</h3><button class="add wide" onclick="checkout()">Lanjut checkout</button><p class="desc">Biaya pengiriman dikonfirmasi penjual.</p>`)}
function change(id,d){cart[id]=Math.max(0,(cart[id]||0)+d);save();cartCount();showCart()}
function checkout(){if(!Object.values(cart).some(n=>n>0)){toast("Keranjang masih kosong");return}modal(`<h2>Informasi pengiriman</h2><form id="order"><input class="field" name="name" placeholder="Nama penerima" required><input class="field" name="phone" placeholder="Nomor WhatsApp" required><textarea class="field" name="address" placeholder="Alamat lengkap" required></textarea><select class="field" name="payment"><option>Transfer bank</option><option>QRIS</option><option>COD</option></select><button class="add wide">Buat pesanan demo</button></form><p class="desc">Demo: pesanan belum dikirim ke penjual dan pembayaran belum diproses.</p>`);$("#order").onsubmit=e=>{e.preventDefault();let f=new FormData(e.target),order={id:"SGR-"+Date.now(),name:f.get("name"),phone:f.get("phone"),address:f.get("address"),payment:f.get("payment"),items:cart,total:Object.entries(cart).reduce((s,[id,n])=>s+(products.find(p=>p.id==id)?.price||0)*n,0),date:new Date().toISOString()};let orders=JSON.parse(localStorage.getItem("sg_orders")||"[]");orders.push(order);localStorage.setItem("sg_orders",JSON.stringify(orders));cart={};save();cartCount();modal(`<h2>Pesanan demo tercatat ✓</h2><p>Nomor pesanan: <b>${order.id}</b></p><p>Total: <b>${rupiah(order.total)}</b></p><p class="desc">Ini hanya tersimpan di browser perangkat ini. Belum ada transaksi nyata.</p><button class="add wide" onclick="close()">Selesai</button>`)}}
function account(){
modal(`
<h2>Akun SEGARIN</h2>

<button class="add wide" id="googleLoginBtn" type="button">
🌐 Masuk dengan Google
</button>

<p style="text-align:center">atau gunakan email</p>

<form id="authForm">
<input class="field" id="authEmail" type="email" placeholder="Email" required>
<input class="field" id="authPassword" type="password" placeholder="Password (minimal 6 karakter)" required>
<button class="add wide" type="submit">Masuk</button>
</form>

<button class="add wide" id="registerBtn" type="button">Daftar Akun Baru</button>
<p id="authStatus" class="desc"></p>
`);

$("#googleLoginBtn").onclick=async()=>{
$("#authStatus").textContent="Menghubungkan ke Google...";
const {error}=await sb.auth.signInWithOAuth({
provider:"google",
options:{redirectTo:window.location.origin}
});
if(error) $("#authStatus").textContent=error.message;
};

$("#authForm").onsubmit=async e=>{
e.preventDefault();
let email=$("#authEmail").value.trim();
let password=$("#authPassword").value;
let {data,error}=await sb.auth.signInWithPassword({email,password});
if(error){
  $("#authStatus").textContent=error.message;
  return;
}
$("#authStatus").textContent="Berhasil masuk: "+data.user.email;
};

$("#registerBtn").onclick=async()=>{
let email=$("#authEmail").value.trim();
let password=$("#authPassword").value;
if(!email||password.length<6){
$("#authStatus").textContent="Isi email dan password minimal 6 karakter.";
return;
}
let {error}=await sb.auth.signUp({email,password});
$("#authStatus").textContent=error?error.message:"Pendaftaran berhasil. Silakan cek email untuk verifikasi jika diminta.";
};
}function dashboard(role){$("#dashboard").classList.remove("hidden");$("#dashTitle").textContent="Dashboard "+role;let orders=JSON.parse(localStorage.getItem("sg_orders")||"[]");let sales=orders.reduce((s,o)=>s+o.total,0);let body=role==="Penjual"?`<h3>Tambah produk</h3><form id="newProduct"><input class="field" name="name" placeholder="Nama produk" required><select class="field" name="cat"><option>Seafood</option><option>Sayuran</option></select><input class="field" name="emoji" placeholder="Emoji produk, contoh 🐟" value="🥬"><input class="field" name="price" type="number" min="1" placeholder="Harga" required><select class="field" name="unit"><option>kg</option><option>ikat</option><option>pack</option></select><button class="add wide">Tambah produk</button></form><h3>Produk saat ini</h3>${products.map(p=>`<div class="row">${p.emoji} ${esc(p.name)} <b>${rupiah(p.price)}</b></div>`).join("")}`:role==="Admin"?`<div class="dashgrid"><div class="stat"><b>${products.length}</b>Produk</div><div class="stat"><b>${orders.length}</b>Pesanan demo</div><div class="stat"><b>${rupiah(sales)}</b>Nilai pesanan demo</div></div><h3>Daftar pesanan demo</h3>${orders.map(o=>`<div class="row"><span>${esc(o.id)} · ${esc(o.name)}</span><b>${rupiah(o.total)}</b></div>`).join("")||"Belum ada pesanan."}`:`<div class="dashgrid"><div class="stat"><b>${products.length}</b>Produk tersedia</div><div class="stat"><b>${Object.values(cart).reduce((a,b)=>a+b,0)}</b>Item keranjang</div></div><p>Silakan pilih produk di katalog dan lanjutkan checkout demo.</p>`;$("#dashContent").innerHTML=body;$("#dashboard").scrollIntoView({behavior:"smooth"});let form=$("#newProduct");if(form)form.onsubmit=e=>{e.preventDefault();let f=new FormData(form);products.push({id:Date.now(),name:f.get("name"),cat:f.get("cat"),emoji:f.get("emoji"),price:Number(f.get("price")),unit:f.get("unit"),desc:"Produk mitra SEGARIN"});save();render();dashboard("Penjual");toast("Produk ditambahkan")}}
$("#search").addEventListener("input",render);document.querySelectorAll("[data-filter]").forEach(b=>b.onclick=()=>{filter=b.dataset.filter;document.querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("active",x===b));render()});$("#cartBtn").onclick=showCart;$("#accountBtn").onclick=account;$("#sellerBtn").onclick=()=>dashboard("Penjual");$("#closeModal").onclick=close;$("#modal").onclick=e=>{if(e.target.id==="modal")close()};$("#closeDash").onclick=()=>$("#dashboard").classList.add("hidden");render();cartCount();
