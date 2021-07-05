const ref = firebase.firestore();
const auth = firebase.auth();
var to;
var colle = document.querySelector(".request-list");
colle.innerHTML="";
var cbody = document.querySelector(".chat__body");
cbody.innerHTML="";
const admin = require('firebase-admin');
admin.initializeApp();

const auth = admin.auth();
ref.collection('/AllMessages/').get().then((snap)=>{
    console.log(snap.docs);
    var curuser="";
    auth.onAuthStateChanged((user)=>{
        if(user){
            //console.log(user.email);
            curuser=user.email;
            //console.log(curuser);
            if(curuser!="admin@gmail.com"){
                colle.innerHTML+=`<li>
                <span class="text">admin@gmail.com</span>
                <div>
                  <!-- Modal Trigger -->
                  <span class="votes"></span>
                   <a id="admin@gmail.com" class="waves-effect waves-light btn modal-trigger" href="#modal1" onclick="checkMessage(this);">send a messages</a>
                </div>
              </li>`;
            }
            else{
                snap.docs.forEach((doc)=>{
                    if(doc.id!="admin@gmail.com"){
                    var html = `<li>
                    <span class="text">${doc.id}</span>
                    <div>
                      <!-- Modal Trigger -->
                      <span class="votes"></span>
                       <a id="${doc.id}" class="waves-effect waves-light btn modal-trigger" href="#modal1" onclick="checkMessage(this);">send a messages</a>
                    </div>
                    </li>`;
                    //console.log(html);
                    colle.innerHTML += html;
                    }
                });
            }
        }
    });
    
});





function checkMessage(val){
    to = val.id;
    auth.onAuthStateChanged((user)=>{
        if(user){
        var from = user.email;
        if(from=="admin@gmail.com"){
                ref.doc(`/AllMessages/admin@gmail.com`).onSnapshot((snap)=>{
                cbody.innerHTML="";
                var msgs = snap.data().arr;
                msgs.forEach((msg)=>{
                    console.log(from);
                    if(msg.to==to){
                    if(msg.isReceived){
                        var htm = `
                        <p class="chat__message">
                        <span class="chat__name">You</span>
                            ${msg.message}
                        <span class="chat__timestamp">
                                ${String(msg.time)}
                        </span>
                        </p>`;
                        cbody.innerHTML+=htm;

                    }
                    else{
                        var htm = `
                        <p class="chat__receiver chat__message">
                        <span class="chat__name">You</span>
                            ${msg.message}
                        <span class="chat__timestamp">
                                ${String(msg.time)}
                        </span>
                        </p>`;
                        cbody.innerHTML+=htm;
                    }
                    }
                });  
                });
        }
        else{
            
              
                ref.doc(`/AllMessages/admin@gmail.com`).onSnapshot((snap)=>{
                cbody.innerHTML="";
                
                    var msgs = snap.data().arr;
                    console.log(msgs);
                    var temp = [];
                    msgs.forEach((msg)=>{
                    if(msg.to==from){
                        console.log(msgs.to);
                        if(!msg.isReceived){
                            var htm = `
                            <p class="chat__message">
                            <span class="chat__name">You</span>
                                ${msg.message}
                            <span class="chat__timestamp">
                                    ${String(msg.time)}
                            </span>
                            </p>`;
                            cbody.innerHTML+=htm;

                        }
                        else{
                            var htm = `
                            <p class="chat__receiver chat__message">
                            <span class="chat__name">You</span>
                                ${msg.message}
                            <span class="chat__timestamp">
                                    ${String(msg.time)}
                            </span>
                            </p>`;
                            cbody.innerHTML+=htm;
                        }
                    }
                    });
                
            });
        }
        }
    });

}
document.getElementById("sendmsg").addEventListener("click", function(event){
    event.preventDefault();
    var msg = document.getElementById('msg').value;
    document.getElementById('msg').value = "";
        auth.onAuthStateChanged((user)=>{
            if(user.email=="admin@gmail.com"){
                ref.doc(`/AllMessages/admin@gmail.com`).get().then((snap)=>{
                    var msgs = snap.data().arr;
                    var dicAdmin = {
                        message:msg,
                        isReceived:false,
                        time:firebase.firestore.Timestamp.now().toDate(),
                        to:to
                    }
                    msgs.push(dicAdmin);
                    var Message = {
                        arr:msgs
                    }
                    ref.doc(`/AllMessages/admin@gmail.com/`).set(Message).then(()=>{console.log("dine");})
                    
                
                });
            }
            else{
      
                    var Message1 = {
                        arr : [
                        {
                            message:"hello from the admin",
                            isReceived:true,
                            time:firebase.firestore.Timestamp.now().toDate()
                        }
                        ]
                        ,
                        email:user.email
                    };
                    ref.collection(`AllMessages`).doc(user.email).add(Message1).then(()=>{console.log("received");})
                        .catch((error)=>{
                            console.log(error);
                    });
                ref.doc(`/AllMessages/admin@gmail.com`).get().then((snap)=>{
                    var msgs = snap.data().arr;
                    var dicAdmin = {
                        message:msg,
                        isReceived:true,
                        time:firebase.firestore.Timestamp.now().toDate(),
                        to:`${user.email}`
                    }
                    msgs.push(dicAdmin);
                    var Message = {
                        arr:msgs
                    }
                    ref.doc(`/AllMessages/admin@gmail.com/`).set(Message).then(()=>{console.log("dine");})
                });

            }
                
            
        });
});