const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const STORAGE_KEY = "lvaraerp_demo_v1";
const initialData = {
 clients:[
  {id:"CL-1028",name:"Aditya Pratama",email:"aditya.p@example.com",service:"Konseling Personal",status:"Aktif"},
  {id:"CL-1029",name:"Nadia Putri",email:"nadia.p@example.com",service:"Konseling Personal",status:"Aktif"},
  {id:"CL-1030",name:"Rizky Ramadhan",email:"rizky.r@example.com",service:"Konseling Pasangan",status:"Aktif"},
  {id:"CL-1031",name:"Salsabila Aulia",email:"salsa.a@example.com",service:"Konseling Online",status:"Nonaktif"},
  {id:"CL-1032",name:"Dimas Saputra",email:"dimas.s@example.com",service:"Konseling Personal",status:"Aktif"},
  {id:"CL-1033",name:"Putri Maharani",email:"putri.m@example.com",service:"Konseling Karier",status:"Aktif"}
 ],
 appointments:[
  {id:"SC-2041",client:"Aditya Pratama",therapist:"dr. Maya Putri, M.Psi.",date:"2026-10-14",time:"10:00",type:"Online",status:"Terjadwal"},
  {id:"SC-2042",client:"Nadia Putri",therapist:"Dina Larasati, M.Psi.",date:"2026-10-14",time:"10:30",type:"Online",status:"Selesai"},
  {id:"SC-2043",client:"Rizky Ramadhan",therapist:"dr. Maya Putri, M.Psi.",date:"2026-10-14",time:"11:00",type:"Pasangan",status:"Menunggu"},
  {id:"SC-2044",client:"Salsabila Aulia",therapist:"Fajar Wicaksono, M.Psi.",date:"2026-10-14",time:"13:00",type:"Online",status:"Terjadwal"},
  {id:"SC-2045",client:"Dimas Saputra",therapist:"Dina Larasati, M.Psi.",date:"2026-10-15",time:"09:00",type:"Online",status:"Terjadwal"},
  {id:"SC-2046",client:"Putri Maharani",therapist:"Fajar Wicaksono, M.Psi.",date:"2026-10-15",time:"14:00",type:"Karier",status:"Menunggu"}
 ],
 therapists:[
  {name:"dr. Maya Putri, M.Psi.",specialty:"Psikolog Klinis",initials:"MP",status:"Tersedia",sessions:18,rating:"4,9"},
  {name:"Dina Larasati, M.Psi.",specialty:"Psikolog Dewasa",initials:"DL",status:"Sedang sesi",sessions:22,rating:"4,8"},
  {name:"Fajar Wicaksono, M.Psi.",specialty:"Psikolog Karier",initials:"FW",status:"Tersedia",sessions:15,rating:"4,9"},
  {name:"Intan Permata, M.Psi.",specialty:"Psikolog Keluarga",initials:"IP",status:"Tidak tersedia",sessions:12,rating:"4,7"},
  {name:"Rani Kusuma, M.Psi.",specialty:"Psikolog Remaja",initials:"RK",status:"Tersedia",sessions:19,rating:"4,8"},
  {name:"Arif Setiawan, M.Psi.",specialty:"Psikolog Klinis",initials:"AS",status:"Sedang sesi",sessions:17,rating:"4,8"}
 ],
 services:[
  {name:"Konseling Personal",description:"Sesi individual bersama psikolog profesional.",price:249000,duration:"60 menit",symbol:"♡",sessions:428},
  {name:"Konseling Pasangan",description:"Ruang aman untuk komunikasi dan relasi yang sehat.",price:399000,duration:"75 menit",symbol:"♧",sessions:126},
  {name:"Konseling Karier",description:"Dukungan untuk tantangan karier dan pengembangan diri.",price:299000,duration:"60 menit",symbol:"↗",sessions:184},
  {name:"Konseling Online",description:"Sesi fleksibel dari lokasi pilihan klien.",price:199000,duration:"45 menit",symbol:"⌁",sessions:546}
 ],
 resources:[
  {name:"Lisensi platform video",description:"Akun konferensi untuk sesi online",qty:"24 akun",status:"Terkelola",symbol:"⌁"},
  {name:"Ruang konseling",description:"Ruang konsultasi untuk sesi tatap muka",qty:"4 ruang",status:"Tersedia",symbol:"⌂"},
  {name:"Perangkat kerja",description:"Laptop dan perangkat operasional",qty:"18 unit",status:"Terkelola",symbol:"▣"},
  {name:"Materi edukasi",description:"Materi pendukung dan lembar kerja",qty:"32 item",status:"Tersedia",symbol:"▤"}
 ],
 transactions:[
  {id:"TRX-8301",client:"Aditya Pratama",service:"Konseling Personal",date:"14 Okt 2026",amount:249000,status:"Berhasil"},
  {id:"TRX-8302",client:"Nadia Putri",service:"Konseling Personal",date:"14 Okt 2026",amount:249000,status:"Berhasil"},
  {id:"TRX-8303",client:"Rizky Ramadhan",service:"Konseling Pasangan",date:"13 Okt 2026",amount:399000,status:"Menunggu"},
  {id:"TRX-8304",client:"Putri Maharani",service:"Konseling Karier",date:"13 Okt 2026",amount:299000,status:"Berhasil"},
  {id:"TRX-8305",client:"Dimas Saputra",service:"Konseling Online",date:"12 Okt 2026",amount:199000,status:"Berhasil"}
 ]
};
let data;
try { data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || structuredClone(initialData); } catch { data = structuredClone(initialData); }
let modalConfig = null;
let toastTimer;
const money = n => "Rp " + Number(n).toLocaleString("id-ID");
const statusClass = s => ({Terjadwal:"pill-blue",Selesai:"pill-green",Menunggu:"pill-orange",Aktif:"pill-green",Nonaktif:"pill-orange",Berhasil:"pill-green",Tersedia:"pill-green","Sedang sesi":"pill-blue","Tidak tersedia":"pill-orange"}[s] || "pill-purple");
function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
function toast(title="Berhasil", message="Data berhasil diperbarui.") {
 const el=$("#toast"); el.querySelector("strong").textContent=title; el.querySelector("p").textContent=message; el.classList.add("show");
 clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove("show"),2800);
}
function statusPill(status){return `<span class="pill ${statusClass(status)}">${status}</span>`}
function renderClients(){
 const q=($("#clientSearch")?.value||"").toLowerCase(), f=$("#clientFilter")?.value||"all";
 const list=data.clients.filter(c=>(f==="all"||c.status===f)&&[c.id,c.name,c.email,c.service].some(v=>v.toLowerCase().includes(q)));
 $("#clientRows").innerHTML=list.map(c=>`<tr><td><strong>${c.id}</strong></td><td><div class="activity-title"><span class="activity-symbol purple-bg">${escapeHtml(c.name.split(" ").map(x=>x[0]).slice(0,2).join(""))}</span><strong>${escapeHtml(c.name)}</strong></div></td><td>${escapeHtml(c.email)}</td><td>${escapeHtml(c.service)}</td><td>${statusPill(c.status)}</td><td><div class="row-actions"><button class="action-btn" data-edit-client="${c.id}">Edit</button><button class="action-btn" data-delete-client="${c.id}">Hapus</button></div></td></tr>`).join("");
 $("#clientEmpty").classList.toggle("hidden",list.length>0);
 $("#clientCount").textContent=data.clients.length; $("#activeClientCount").textContent=data.clients.filter(c=>c.status==="Aktif").length;
}
function renderAppointments(){
 const q=($("#appointmentSearch")?.value||"").toLowerCase(), f=$("#appointmentFilter")?.value||"all";
 const list=data.appointments.filter(a=>(f==="all"||a.status===f)&&[a.id,a.client,a.therapist,a.type].some(v=>v.toLowerCase().includes(q)));
 $("#appointmentRows").innerHTML=list.map(a=>`<tr><td><div class="activity-title"><span class="activity-symbol purple-bg">♙</span><div><strong>${escapeHtml(a.client)}</strong><div style="font-size:9px;color:var(--muted);margin-top:4px">${a.id}</div></div></div></td><td>${escapeHtml(a.therapist)}</td><td><strong>${formatDate(a.date)}</strong><div style="font-size:9px;color:var(--muted);margin-top:4px">${a.time} WIB</div></td><td>${escapeHtml(a.type)}</td><td>${statusPill(a.status)}</td><td><div class="row-actions"><button class="action-btn" data-edit-appt="${a.id}">Edit</button><button class="action-btn" data-delete-appt="${a.id}">Hapus</button></div></td></tr>`).join("");
 $("#appointmentEmpty").classList.toggle("hidden",list.length>0);
}
function renderTherapists(){
 $("#therapistGrid").innerHTML=data.therapists.map((t,i)=>`<article class="therapist-card"><div class="therapist-top"><div class="therapist-avatar">${escapeHtml(t.initials)}</div><div><h3>${escapeHtml(t.name)}</h3><p>${escapeHtml(t.specialty)}</p></div></div>${statusPill(t.status)}<div class="therapist-meta"><span>◷ ${t.sessions} sesi periode ini</span><strong>★ ${t.rating}</strong></div></article>`).join("");
}
function renderServices(){
 $("#serviceGrid").innerHTML=data.services.map(s=>`<article class="service-card"><div class="service-symbol">${escapeHtml(s.symbol)}</div><h3>${escapeHtml(s.name)}</h3><p>${escapeHtml(s.description)}</p><div class="service-price">${money(s.price)}</div><p>Durasi sesi: ${escapeHtml(s.duration)}</p><div class="service-foot"><span>${s.sessions} sesi tercatat</span><span class="pill pill-green">Aktif</span></div></article>`).join("");
}
function renderFinance(){
 $("#financeRows").innerHTML=data.transactions.map(t=>`<tr><td><strong>${t.id}</strong></td><td>${escapeHtml(t.client)}</td><td>${escapeHtml(t.service)}</td><td>${escapeHtml(t.date)}</td><td><strong>${money(t.amount)}</strong></td><td>${statusPill(t.status)}</td></tr>`).join("");
}
function renderResources(){
 $("#resourceGrid").innerHTML=data.resources.map(r=>`<article class="resource-card"><div class="resource-symbol">${escapeHtml(r.symbol)}</div><div class="resource-content"><h3>${escapeHtml(r.name)}</h3><p>${escapeHtml(r.description)}</p><div class="resource-qty">${escapeHtml(r.qty)}</div><span class="resource-status">● ${escapeHtml(r.status)}</span></div></article>`).join("");
}
function renderAll(){renderClients();renderAppointments();renderTherapists();renderServices();renderFinance();renderResources();save();}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function formatDate(date){const d=new Date(date+"T00:00:00");return d.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"});}
function goTo(page){
 $$(".page").forEach(p=>p.classList.toggle("active",p.id===`page-${page}`));
 $$(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.page===page));
 const active=$(`.nav-item[data-page="${page}"]`); $("#breadcrumbPage").textContent=active?active.textContent.trim():"Dashboard";
 $("#sidebar").classList.remove("open"); window.scrollTo({top:0,behavior:"smooth"});
}
$$(".nav-item").forEach(b=>b.addEventListener("click",()=>goTo(b.dataset.page)));
$$("[data-goto]").forEach(b=>b.addEventListener("click",()=>goTo(b.dataset.goto)));
$("#mobileMenu").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
$("#themeToggle").addEventListener("click",()=>{document.body.classList.toggle("dark");localStorage.setItem("lvaraerp_dark",document.body.classList.contains("dark")?"1":"0");});
if(localStorage.getItem("lvaraerp_dark")==="1")document.body.classList.add("dark");
const now=new Date();$("#todayDate").textContent=now.toLocaleDateString("id-ID",{weekday:"short",day:"numeric",month:"short",year:"numeric"});
$("#periodSelect").addEventListener("change",e=>{if(e.target.value==="week"){$("#sessionsValue").textContent="312";$("#revenueValue").textContent="Rp 42,8 jt"}else if(e.target.value==="year"){$("#sessionsValue").textContent="12.640";$("#revenueValue").textContent="Rp 1,82 M"}else{$("#sessionsValue").textContent="1.284";$("#revenueValue").textContent="Rp 186,4 jt"}});
$("#clientSearch").addEventListener("input",renderClients);$("#clientFilter").addEventListener("change",renderClients);
$("#appointmentSearch").addEventListener("input",renderAppointments);$("#appointmentFilter").addEventListener("change",renderAppointments);
function field(name,label,type="text",opts={}){return {name,label,type,...opts};}
function openModal({title,eyebrow="FORMULIR",fields,submit,values={}}){
 modalConfig={submit,values};$("#modalTitle").textContent=title;$("#modalEyebrow").textContent=eyebrow;
 $("#modalFields").innerHTML=fields.map(f=>`<div class="field ${f.full?"full":""}"><label for="f-${f.name}">${f.label}</label>${f.type==="select"?`<select id="f-${f.name}" name="${f.name}" ${f.required===false?"":"required"}>${f.options.map(o=>`<option value="${escapeHtml(o.value)}" ${String(values[f.name]??f.value??"")===String(o.value)?"selected":""}>${escapeHtml(o.label)}</option>`).join("")}</select>`:f.type==="textarea"?`<textarea id="f-${f.name}" name="${f.name}" rows="3" ${f.required===false?"":"required"}>${escapeHtml(values[f.name]??f.value??"")}</textarea>`:`<input id="f-${f.name}" name="${f.name}" type="${f.type}" value="${escapeHtml(values[f.name]??f.value??"")}" ${f.required===false?"":"required"} ${f.min!==undefined?`min="${f.min}"`:""} />`}</div>`).join("");
 $("#modalBackdrop").classList.remove("hidden");
}
function closeModal(){$("#modalBackdrop").classList.add("hidden");modalConfig=null;}
$("#closeModal").addEventListener("click",closeModal);$("#cancelModal").addEventListener("click",closeModal);
$("#modalBackdrop").addEventListener("click",e=>{if(e.target.id==="modalBackdrop")closeModal()});
$("#modalForm").addEventListener("submit",e=>{e.preventDefault();if(!modalConfig)return;const form=Object.fromEntries(new FormData(e.currentTarget).entries());modalConfig.submit(form);closeModal();renderAll();toast("Berhasil","Data telah disimpan.");});
function nextId(prefix,items){let max=0;items.forEach(x=>{const m=String(x.id||"").match(/(\d+)$/);if(m)max=Math.max(max,Number(m[1]));});return prefix+(max+1);}
function clientFields(v={}){return [field("name","Nama lengkap","text",{full:true}),field("email","Email","email"),field("service","Layanan","select",{options:data.services.map(s=>({value:s.name,label:s.name}))}),field("status","Status","select",{options:["Aktif","Nonaktif"].map(x=>({value:x,label:x}))})];}
$("#addClient").addEventListener("click",()=>openModal({title:"Tambah klien",fields:clientFields(),submit:v=>data.clients.push({id:nextId("CL-",data.clients),...v})}));
$("#clientRows").addEventListener("click",e=>{
 const edit=e.target.closest("[data-edit-client]")?.dataset.editClient, del=e.target.closest("[data-delete-client]")?.dataset.deleteClient;
 if(edit){const c=data.clients.find(x=>x.id===edit);openModal({title:"Edit data klien",values:c,fields:clientFields(c),submit:v=>Object.assign(c,v)});}
 if(del&&confirm("Hapus data klien "+del+"?")){data.clients=data.clients.filter(c=>c.id!==del);renderAll();toast("Data dihapus","Klien berhasil dihapus.");}
});
function apptFields(){return [field("client","Nama klien","select",{options:data.clients.map(c=>({value:c.name,label:c.name})),full:true}),field("therapist","Psikolog","select",{options:data.therapists.map(t=>({value:t.name,label:t.name})),full:true}),field("date","Tanggal","date",{value:"2026-10-14"}),field("time","Waktu","time",{value:"10:00"}),field("type","Jenis sesi","select",{options:["Online","Tatap muka","Pasangan","Karier"].map(x=>({value:x,label:x}))}),field("status","Status","select",{options:["Terjadwal","Menunggu","Selesai"].map(x=>({value:x,label:x}))})];}
function addAppt(){openModal({title:"Buat jadwal konseling",fields:apptFields(),submit:v=>data.appointments.push({id:nextId("SC-",data.appointments),...v})});}
$("#addAppointment").addEventListener("click",addAppt);$("#quickAdd").addEventListener("click",()=>{goTo("appointments");addAppt()});
$("#appointmentRows").addEventListener("click",e=>{
 const edit=e.target.closest("[data-edit-appt]")?.dataset.editAppt, del=e.target.closest("[data-delete-appt]")?.dataset.deleteAppt;
 if(edit){const a=data.appointments.find(x=>x.id===edit);openModal({title:"Edit jadwal konseling",values:a,fields:apptFields(),submit:v=>Object.assign(a,v)});}
 if(del&&confirm("Hapus jadwal "+del+"?")){data.appointments=data.appointments.filter(a=>a.id!==del);renderAll();toast("Jadwal dihapus","Jadwal konseling berhasil dihapus.");}
});
$("#addTherapist").addEventListener("click",()=>openModal({title:"Tambah psikolog",fields:[field("name","Nama psikolog","text",{full:true}),field("specialty","Spesialisasi","text",{full:true}),field("status","Status","select",{options:["Tersedia","Sedang sesi","Tidak tersedia"].map(x=>({value:x,label:x}))}),field("rating","Rating (contoh)","text",{value:"4,8"})],submit:v=>data.therapists.push({...v,initials:v.name.split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase(),sessions:0})}));
$("#addService").addEventListener("click",()=>openModal({title:"Tambah layanan",fields:[field("name","Nama layanan","text",{full:true}),field("description","Deskripsi","textarea",{full:true}),field("price","Tarif (Rp)","number",{min:0}),field("duration","Durasi","text"),field("symbol","Ikon sederhana","text",{value:"♡"})],submit:v=>data.services.push({...v,price:Number(v.price),sessions:0})}));
$("#addResource").addEventListener("click",()=>openModal({title:"Tambah sumber daya",fields:[field("name","Nama item","text",{full:true}),field("description","Deskripsi","text",{full:true}),field("qty","Jumlah","text"),field("status","Status","select",{options:["Tersedia","Terkelola","Perlu diperiksa"].map(x=>({value:x,label:x}))}),field("symbol","Ikon sederhana","text",{value:"▤"})],submit:v=>data.resources.push(v)}));
function downloadCSV(filename,rows){const csv=rows.map(r=>r.map(v=>`"${String(v??"").replace(/"/g,'""')}"`).join(",")).join("\r\n");const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8;"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);toast("Ekspor dimulai","File CSV sedang diunduh.");}
$("#exportFinance").addEventListener("click",()=>downloadCSV("lvaraerp-transaksi.csv",[["ID Transaksi","Klien","Layanan","Tanggal","Nominal","Status"],...data.transactions.map(t=>[t.id,t.client,t.service,t.date,t.amount,t.status])]));
$("#exportReport").addEventListener("click",()=>downloadCSV("lvaraerp-laporan.csv",[["Indikator","Hasil","Target","Keterangan"],["Sesi konseling","1284","1400","Dalam progres"],["Klien aktif",data.clients.filter(c=>c.status==="Aktif").length,"800","Data lokal demo"],["Pendapatan","186400000","225000000","Ilustrasi"],["Tingkat penyelesaian","92%","90%","Ilustrasi"]]));
$("#helpBtn").addEventListener("click",()=>toast("Pusat bantuan","Untuk demo ini, hubungi admin operasional internal."));
$("#notifBtn").addEventListener("click",()=>toast("Notifikasi","Ada 8 sesi yang perlu ditinjau hari ini."));
renderAll();