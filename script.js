// التنقل بين الصفحات
function showPage(id) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

// 🎡 العجلة
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let angle = 0;
let spinning = false;

function getNamesWheel() {
    return document.getElementById("namesWheel").value
        .split("\n").filter(n => n.trim() !== "");
}

function draw(names) {
    let size = canvas.width / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let slice = 2 * Math.PI / names.length;

    names.forEach((name,i)=>{
        ctx.beginPath();
        ctx.moveTo(size,size);
        ctx.arc(size,size,size, angle + i*slice, angle + (i+1)*slice);
        ctx.fillStyle = i%2 ? "#00f7ff":"#a100ff";
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.fillText(name,size + Math.cos(angle + i*slice)*100, size + Math.sin(angle + i*slice)*100);
    });
}

function spin(){
    if(spinning) return;
    let names = getNamesWheel();
    if(names.length===0) return alert("حط أسماء");
    spinning=true;
    let velocity=Math.random()*0.3+0.3;
    function animate(){
        angle+=velocity;
        velocity*=0.97;
        draw(names);
        if(velocity>0.002) requestAnimationFrame(animate);
        else{
            spinning=false;
            let index=Math.floor(names.length - ((angle % (2*Math.PI))/(2*Math.PI))*names.length) % names.length;
            showResult(names[index]);
        }
    }
    animate();
}

function showResult(name){
    document.getElementById("result").innerText="🎉 الفائز: "+name;
    let audio=new Audio("https://www.soundjay.com/buttons/sounds/button-3.mp3");
    audio.play();
}

// 👥 الفرق مع ألوان + animation
function makeTeams(){
    let names=document.getElementById("namesTeams").value.split("\n").filter(n=>n.trim()!=="");
    let numTeams=Number(document.getElementById("numTeams").value);
    let perTeam=Number(document.getElementById("playersPerTeam").value);

    if(names.length===0) return alert("حط أسماء!");
    if(!numTeams || !perTeam) return alert("كمل المعلومات!");

    names.sort(()=>Math.random()-0.5);
    let teams=[], index=0;

    for(let i=0;i<numTeams;i++){
        teams[i]=[];
        for(let j=0;j<perTeam;j++){
            if(index<names.length) teams[i].push(names[index++]);
        }
    }

    let colors=["#00f7ff","#a100ff","#ff00c8","#00ffcc","#ffcc00","#ff4d4d"];
    let html="";
    teams.forEach((team,i)=>{
        let color=colors[i%colors.length];
        html+=`<div class="teamCard" style="background:${color}20;border:2px solid ${color};color:${color}">
                  <h3>👥 فريق ${i+1}</h3>
                  <p>${team.join("<br>")}</p>
               </div>`;
    });
    document.getElementById("teamsResult").innerHTML=html;
    document.querySelectorAll(".teamCard").forEach((card,i)=>{
        setTimeout(()=>{card.style.opacity=1; card.style.transform="translateY(0)";}, i*300);
    });
}

// 💾 حفظ المجموعات
function saveGroup(){
    let name=prompt("اسم المجموعة:");
    if(!name) return;
    let data=document.getElementById("namesTeams").value;
    localStorage.setItem("grp_"+name,data);
    updateGroups();
}
function loadGroup(){
    let key=document.getElementById("savedGroups").value;
    if(!key) return;
    document.getElementById("namesTeams").value=localStorage.getItem(key);
}
function deleteGroup(){
    let key=document.getElementById("savedGroups").value;
    if(!key) return;
    localStorage.removeItem(key);
    updateGroups();
}
function updateGroups(){
    let select=document.getElementById("savedGroups");
    select.innerHTML="";
    for(let key in localStorage){
        if(key.startsWith("grp_")){
            let opt=document.createElement("option");
            opt.value=key;
            opt.text=key.replace("grp_","");
            select.appendChild(opt);
        }
    }
}
updateGroups();