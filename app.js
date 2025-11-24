const DATA_URL = './assets/data/diseases.json';

// Load dữ liệu bệnh
async function loadData(){
if(window.__DISEASES) return window.__DISEASES;
try{
const res = await fetch(DATA_URL);
const json = await res.json();
window.__DISEASES = json;
return json;
}catch(err){
console.error('Failed to load data', err);
return [];
}
}

// Escape HTML
function escapeHtml(s){
return String(s).replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>');
}

// Hiển thị danh sách bệnh với nút "Xem chi tiết"
function renderList(list){
const resultsEl = document.getElementById('results');
const detailContent = document.getElementById('detailContent');
const statsEl = document.getElementById('quickInfo');

resultsEl.innerHTML = '';
if(list.length===0){
resultsEl.innerHTML = '<div class="meta">Không có kết quả</div>';
return;
}

list.forEach((d,i)=>{
const it = document.createElement('div');
it.className='item';
it.style.display = 'flex';
it.style.alignItems = 'center';
it.style.justifyContent = 'space-between';
it.style.animation = `slideIn .32s ease ${i*45}ms forwards`;
it.innerHTML = `       <div style="display:flex;align-items:center;gap:8px;flex:1;cursor:pointer">         <img class="thumb" src="${d.img}" alt="" style="width:50px;height:50px;object-fit:cover;border-radius:6px">         <div style="flex:1">           <strong>${d.name}</strong>           <div class="meta">${d.group} • Triệu chứng: ${d.symptoms.slice(0,3).join(', ')}</div>         </div>       </div>       <button style="margin-left:8px;padding:4px 8px;cursor:pointer" onclick="goToDetail(${d.id})">Xem chi tiết →</button>
    `;

```
// Click vào phần chính vẫn show tóm tắt bên phải
it.querySelector('div').addEventListener('click', ()=> showDetail(d, detailContent, statsEl));
resultsEl.appendChild(it);
```

});
}

// Hiển thị tóm tắt chi tiết bên phải
function showDetail(d, detailContent, statsEl){
if(!detailContent) detailContent = document.getElementById('detailContent');
if(!statsEl) statsEl = document.getElementById('quickInfo');

detailContent.style.opacity = 0;
setTimeout(()=>{
detailContent.innerHTML = `       <div><strong style="font-size:18px">${escapeHtml(d.name)}</strong></div>       <div class="meta">Nhóm: ${escapeHtml(d.group)}</div>       <div class="section"><strong>Mô tả:</strong><div>${escapeHtml(d.description)}</div></div>       <div class="section"><strong>Triệu chứng:</strong><div>${d.symptoms.map(s=>`<span class="symptom">${escapeHtml(s)}</span>`).join('')}</div></div>       <div class="section"><strong>Cách phòng ngừa:</strong><ul>${d.prevention.map(p=>`<li>${escapeHtml(p)}</li>`).join('')}</ul></div>       <div class="section"><strong>Hình minh họa:</strong><img src="${d.img}" style="width:100%;border-radius:10px;margin-top:8px" alt="Ảnh minh họa"></div>       <div class="section videoWrap"><strong>Video phòng ngừa:</strong><br>         <iframe src="${d.video}" allowfullscreen></iframe>       </div>
    `;
detailContent.style.animation = 'fadeDetail .32s ease';
detailContent.style.opacity = 1;
}, 80);

statsEl.textContent = `${d.name} — Nhóm: ${d.group} — Triệu chứng chính: ${d.symptoms.slice(0,3).join(', ')}`;
}

// Chuyển trang sang disease.html
window.goToDetail = function(id){
location.href = `disease.html?id=${id}`;
}

// Expose helpers
window.app = {
loadData,
escapeHtml,
renderList,
showDetail,
goToDetail
};
