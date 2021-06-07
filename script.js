let allFilters= document.querySelectorAll(".filter div");
let grid= document.querySelector(".grid");
let addbtn= document.querySelector(".add");
let body= document.querySelector("body");
let  uid = new ShortUniqueId();
let colorClasses=["pink","blue","green","black"];
let colors={
    pink:"#d595aa",
    blue:"#5ecdde",
    green:"#91e6c7",
    black:"black",
};
let deleteState= false;
let deleteBtn= document.querySelector(".delete");
if(!localStorage.getItem("task"))
    localStorage.setItem("task", JSON.stringify([]));
deleteBtn.addEventListener("click", function(e){
    if(deleteState){
       deleteState=false;
       e.currentTarget.classList.remove("delete-state");
    }
    else{
       deleteState=true;
       e.currentTarget.classList.add("delete-state");
    }
});

for(let i=0;i<allFilters.length;i++){
allFilters[i].addEventListener("click", function(e){
    if(e.currentTarget.parentElement.classList.contains("selected-filter")){
        e.currentTarget.parentElement.classList.remove("selected-filter");
        loadTasks();
    }else{
    let color=e.currentTarget.classList[0].split("-")[0];
    e.currentTarget.parentElement.classList.add("selected-filter");
    loadTasks(color);
    }
});
}

addbtn.addEventListener("click", function(e){
    // if(modalVisible)
    //    return;
    if (deleteBtn.classList.contains("delete-state")) {
        deleteState = false;
        deleteBtn.classList.remove("delete-state");
    }
    let modal= document.createElement("div");
    modal.classList.add("modal-container");
    modal.setAttribute("click-first",true);
    modal.innerHTML=`<div class="writting-area"
    contenteditable>Enter your Task</div>
    <div class="filter-area">
        <div class="modal-filter pink"></div>
        <div class="modal-filter blue"></div>
        <div class="modal-filter green"></div>
        <div class="modal-filter black active-modal-filter"></div>
    </div>`;

    // let allModalFilters= modal.querySelectorAll(".modal-filter");
    // for(let i=0;i<allModalFilters.length;i++){
    //     allModalFilters[i].addEventListener("click", function(e){
    //         for(let j=0;j<allModalFilters.length;j++){
    //             allModalFilters[j].classList.remove("active-modal-filter");
    //         }
    //         e.currentTarget.classList.add("active-modal-filter");
    //     })
    // }

    let allModalFilters= modal.querySelectorAll(".modal-filter");
    for(let i=0;i<allModalFilters.length;i++){
        allModalFilters[i].addEventListener("click",function(e){
            for(let j=0;j<allModalFilters.length;j++){
                allModalFilters[j].classList.remove("active-modal-filter");
            }
            e.currentTarget.classList.add("active-modal-filter");
        });
        
    }

    let wa= modal.querySelector(".writting-area");
    wa.addEventListener("click", function(e){
    if(modal.getAttribute("click-first")=="true"){
        wa.innerHTML="";
        modal.setAttribute("click-first",false);
    }

});

    wa.addEventListener("keypress", function(e){
        if(e.key=="Enter"){
            let task= e.currentTarget.innerText;
            let selectedModalFilter= document.querySelector(".active-modal-filter");
            let color= selectedModalFilter.classList[1];
            let ticket= document.createElement("div");
            ticket.classList.add("ticket");
            let id=uid();
            ticket.innerHTML= `<div class="ticket-color ${color}"></div>
            <div class="ticket-id">#${id}</div>
            <div class="ticket-box" contenteditable>
            ${task}
            </div>
            </div>`;

            saveTicketInLocalStorage(id,color,task);
            let ticketWorkingArea= ticket.querySelector(".ticket-box");
            ticketWorkingArea.addEventListener("input", ticketWrittingAreaHandler);
            ticket.addEventListener("click", function(e){
                if(deleteState){
                let id = e.currentTarget
                .querySelector(".ticket-id")
                .innerText.split("#")[1];
      
              let tasksArr = JSON.parse(localStorage.getItem("task"));
      
              tasksArr = tasksArr.filter(function (el) {
                return el.id != id;
              });
      
              localStorage.setItem("task", JSON.stringify(tasksArr));
      
              
                e.currentTarget.remove();
              }
            });
 
            

            let ticketColorDiv= ticket.querySelector(".ticket-color");
            ticketColorDiv.addEventListener("click", ticketColorHandler) ;
            grid.appendChild(ticket);
           modal.remove();
        }

        
    
     
   
    
    
});
body.appendChild(modal);
modalVisible=true;
});
function saveTicketInLocalStorage(id,color,task){
    let requiredObj= {id,color,task};
    let taskArr=JSON.parse(localStorage.getItem("task"));
    taskArr.push(requiredObj);
    localStorage.setItem("task", JSON.stringify(taskArr));
}




function ticketColorHandler(e){
    let id=e.currentTarget.parentElement.querySelector(".ticket-id").innerText.split("#")[1];
    let taskArr=JSON.parse(localStorage.getItem("task"));
    let reqIndex=-1;
    for(let i=0;i<taskArr.length;i++){
        if(taskArr[i].id==id){
           reqIndex=i;
           break
        }
    }
    let currColor= e.currentTarget.classList[1];
    let index= colorClasses.indexOf(currColor);
    index++;
    index%=4;
    e.currentTarget.classList.remove(currColor);
    e.currentTarget.classList.add(colorClasses[index]);
    taskArr[reqIndex].color= colorClasses[index];
    localStorage.setItem("task", JSON.stringify(taskArr));

}

function ticketWrittingAreaHandler(e){
        let id=e.currentTarget.parentElement.querySelector(".ticket-id").innerText.split("#")[1];
        let taskArr=JSON.parse(localStorage.getItem("task"));
        let reqIndex=-1;
        for(let i=0;i<taskArr.length;i++){
            if(taskArr[i].id==id){
               reqIndex=i;
               break
            }
        }
        taskArr[reqIndex].task=e.currentTarget.innerText;
        localStorage.setItem("task", JSON.stringify(taskArr));

}
function loadTasks(passedColor) {
     let alltickets= document.querySelectorAll(".ticket");
     for(let i=0;i<alltickets.length;i++){alltickets[i].remove();}
    let tasksArr = JSON.parse(localStorage.getItem("task"));
    for(let i=0;i<tasksArr.length;i++){
        let id= tasksArr[i].id;
        let color= tasksArr[i].color;
        let taskValue= tasksArr[i].task;
    if(passedColor){
        if(passedColor != color)
           continue;
    }
    

        let ticket= document.createElement("div");
            ticket.classList.add("ticket");
            ticket.innerHTML= `<div class="ticket-color ${color}"></div>
            <div class="ticket-id">#${id}</div>
            <div class="ticket-box" contenteditable>
            ${taskValue}
            </div>
            </div>`;
        
        let ticketWorkingArea= ticket.querySelector(".ticket-box");
        ticketWorkingArea.addEventListener("input", ticketWrittingAreaHandler);
        let ticketColorDiv= ticket.querySelector(".ticket-color");
        ticketColorDiv.addEventListener("click", ticketColorHandler) ;
        ticket.addEventListener("click", function(e){
            if(deleteState){
            let id = e.currentTarget
            .querySelector(".ticket-id")
            .innerText.split("#")[1];
  
          let tasksArr = JSON.parse(localStorage.getItem("task"));
  
          tasksArr = tasksArr.filter(function (el) {
            return el.id != id;
          });
  
          localStorage.setItem("task", JSON.stringify(tasksArr));
  
          
            e.currentTarget.remove();
        }
        });
        grid.appendChild(ticket);
    }
}

loadTasks();



