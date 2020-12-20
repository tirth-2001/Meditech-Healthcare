// DOM Content Initialized
var welcome = document.querySelector('#welcome');
var profileWelcome = document.querySelector('#profile-welcome');
var logout3 = document.querySelector('#logout-3');
var logout4 = document.querySelector('#logout-4');
var myProfileForm = document.querySelector('#myProfileForm');
var modal1Form = document.querySelector('#modal1Form');
var patient1Submit = document.querySelector('#patient1Submit');
var patient1Edit = document.querySelector('#patient1Edit');
var demoPatient = document.querySelector('#demoPatient');
var aiOutput = document.querySelector('#aiOutput');
var patient2Submit = document.querySelector('#patient2Submit');
var patient3Submit = document.querySelector('#patient3Submit');
var patient2Edit = document.querySelector('#patient2Edit');
var patientID = "";
var radioyes = document.querySelector('#radioYes');
var radiono = document.querySelector('#radioNo');
var multisymptoms = document.querySelector('#multisymptoms');
var aiOutputDisease = document.querySelector('#aiOutputDisease');
var predict2 = document.querySelector('#predict2');
var predict2Edit = document.querySelector('#predict2Edit');

// -------------------------

// messaging.requestPermission().then(() => {
//         console.log("Permission Granted");
//         // console.log(message.getToken());
//         return messaging.getToken();
//       }).then((token) => {
//         // sendTokenToServer(token);
//         // updateUIForPushEnabled(token);
//         console.log("Token is : "+token);
//       }).catch((err) => {
//         console.log("Error getting permission" + err.message);
//       })


//         messaging.onMessage((payload) => {
//             console.log('onMessage : '+payload);
//         })

// setup materialize components
document.addEventListener('DOMContentLoaded', function() {
  var modals = document.querySelectorAll('.modal');
  var options = {
    opacity : 0.3,
    inDuration : 30000,
    outDuration : 100,
    dismissible: false
  }
  M.Modal.init(modals,options);
});

//editPatient function
patient1Edit.style.display = 'none';
patient2Edit.style.display = 'none';
predict2Edit.style.display = 'none';
function editPatient(el) {
  console.log("Edit Clicked : "+el.id);

  patient1Edit.style.display = 'block';
  patient1Submit.style.display = 'none';
  patient2Edit.style.display = 'block';
  patient2Submit.style.display = 'none';
  predict2Edit.style.display = 'block';
  predict2.style.display = 'none';
  // console.log(+auth.currentUser.email);
  var userID = auth.currentUser.uid;
  var kkk = document.querySelector('#icon_prefix');
  kkk.focus();
  db.doc(`doctors/${userID}/patients/${el.id}`).get().then((snap) => {
    var pData = snap.data();
    console.log(pData);

    // el.preventDefault();
    //alert("Patient Form Sumitted");
    //put existing user info
    modal1Form['icon_prefix'].value = pData.fname;
    modal1Form['icon_prefix2'].value = pData.lname;

    modal1Form['icon_telephone12'].value = pData.mobile;
    modal1Form['icon_email12'].value = pData.email;
    modal1Form['icon_city12'].value = pData.city;
    modal1Form['icon_state12'].value = pData.state;
    modal1Form['icon_country12'].value = pData.country;

    modal1Form['icon_telephone'].value = pData.mobile;
    modal1Form['icon_email'].value = pData.email;
    modal1Form['icon_city6'].value = pData.city;
    modal1Form['icon_state6'].value = pData.state;
    modal1Form['icon_country6'].value = pData.country;

    let DiseaseName = pData.diseasedata;
    if(DiseaseName === "COVID POSITIVE"){
      aiOutput.innerHTML = DiseaseName.fontcolor("red");
    }
    else if (DiseaseName === "no_data") {
      aiOutput.innerHTML = "No Records Found";
    }
    else{
      aiOutput.innerHTML = DiseaseName;
    }

    let RadioCheck = pData.predictiondata;
    if(RadioCheck === true){
      radioyes.checked = true;
    }
    else{
      radiono.checked = true;
    }

    //Get PatientEdit Details
    patient1Edit.addEventListener('click',(e) => {
      //get user info
      var fname0 = modal1Form['icon_prefix'].value;
      var lname0 = modal1Form['icon_prefix2'].value;

      var mobile0 = modal1Form['icon_telephone12'].value;
      var email0 = modal1Form['icon_email12'].value;
      var city0 = modal1Form['icon_city12'].value;
      var state0 = modal1Form['icon_state12'].value;
      var country0 = modal1Form['icon_country12'].value;

      var mobile1 = modal1Form['icon_telephone'].value;
      var email1 = modal1Form['icon_email'].value;
      var city1 = modal1Form['icon_city6'].value;
      var state1 = modal1Form['icon_state6'].value;
      var country1 = modal1Form['icon_country6'].value;



      var data = {
        fname : fname0,
        lname : lname0,
        mobile : (screen.width >= 992) ? mobile1 : mobile0,
        email : (screen.width >= 992) ? email1 : email0,
        city : (screen.width >= 992) ? city1 : city0,
        state : (screen.width >= 992) ? state1 : state0,
        country : (screen.width >= 992) ? country1 : country0,
        timestamp: firebase.firestore.Timestamp.now(),
        date: firebase.firestore.Timestamp.now().toDate().toDateString()
      }
      console.log(data);



      db.doc(`doctors/${userID}/patients/${el.id}`).set(data,{merge : true}).then(() => {

        // alert("Patient Details Updated!!");
        // toastr.success('', 'Patient Details Updated!', {timeOut: 1400, closeButton : false, progressBar : true})

      });

      openNextModal();
    })

    //Predict function

    var fileSelect0 = document.getElementById("xray0");
    var fileSelect1 = document.getElementById("xray1");
    var predict0 = document.getElementById("predict0");
    var predict1 = document.getElementById("predict1");
    var model = undefined;

    // the link to your model provided by Teachable Machine export panel
    const metadataURL = "https://teachablemachine.withgoogle.com/models/6EhuIE6SE/metadata.json";

    function getJSON(url) {
        var resp ;
        var xmlHttp ;

        resp  = '' ;
        xmlHttp = new XMLHttpRequest();

        if(xmlHttp != null)
        {
            xmlHttp.open( "GET", url, false );
            xmlHttp.send( null );
            resp = xmlHttp.responseText;
        }

        return resp ;
    }

    var metalabels;
    metalabels = getJSON(metadataURL);
    metalabels = JSON.parse(metalabels);
    metalabels = metalabels.labels;
    // console.log(metalabels);
    // const rawJson = JSON.parse(metadataURL);
    // const metalabels = rawJson[labels];
    // console.log(metalabels);
    //Load the modal
    async function initialize() {
      model = await tf.loadLayersModel('https://teachablemachine.withgoogle.com/models/6EhuIE6SE/model.json');
    }
    initialize();

    const imagePreview = document.createElement('img');
    // imagePreview.src = 'https://thewebmate.in/logo';
    // console.log(imagePreview.src.length);

    imagePreview.style.display = 'none';
    // Add event listeners
    if (screen.width > 992){
      var diseaseSelect = document.querySelector('#diseaseSelect');
      diseaseSelect.value = "COVID-19";
      var diseasedata = diseaseSelect.value;
      var imagedata = "";
      var predictiondata = true;


      // console.log(diseaseSelect.value);

      fileSelect1.addEventListener("change", (e) => {
        if(diseaseSelect.value != "COVID-19"){
          alert("IMP : Please Select Disease to Predict");
        }
        else{
          // console.log("window.patientID : " + window.patientID);
          var files = e.target.files;
          console.log(files[0].name);
          // console.log(typeof files);
          var reader = new FileReader();
          // console.log(reader);
          reader.readAsDataURL(files[0]);
          reader.onloadend = () => {
            imagePreview.src = URL.createObjectURL(files[0]);
            // imagePreview.style.display = 'block';
            // console.log(imagePreview.src);
            }

            var xrayImage = fileSelect0.files[0];
            var imageName = files[0].name;
            var storageRef = stor.ref('x-ray/'+imageName);
           //upload image to selected storage reference

            var uploadTask = storageRef.put(xrayImage);
            // console.log("Storage ref called");
            uploadTask.on('state_changed',function (snapshot) {
               //observe state change events such as progress , pause ,resume
               //get task progress by including the number of bytes uploaded and total
               //number of bytes
               var progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
               console.log("upload is " + progress +"% done");
             },function (error) {
               //handle error here
               console.log(error.message);
             },function () {
              //handle successful uploads on complete

               uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                   //get your upload image url here...
                   console.log(downloadURL);
                   var data = {
                     imagedata : downloadURL
                   }
                   db.collection(`doctors/${userID}/patients`).doc(el.id).set(data, {merge : true}).then((snap) => {
                     // console.log(snap);
                     console.log("imagedata added ");

                   });
               });
             }
            );
           // console.log(downloadurl);

        }

      });

      predict1.addEventListener('click', predictFunction1,false);

    }
    if(screen.width < 992) {
      var diseaseSelect = document.querySelector('#diseaseSelect');
      diseaseSelect.value = "COVID-19";
      var diseasedata = diseaseSelect.value;
      var imagedata = "";
      var predictiondata = true;


      // console.log(diseaseSelect.value);

      fileSelect0.addEventListener("change", (e) => {
        if(diseaseSelect.value != "COVID-19"){
          alert("IMP : Please Select Disease to Predict");
        }
        else{
          // console.log("window.patientID : " + window.patientID);
          var files = e.target.files;
          console.log(files[0].name);
          // console.log(typeof files);
          var reader = new FileReader();
          // console.log(reader);
          reader.readAsDataURL(files[0]);
          reader.onloadend = () => {
            imagePreview.src = URL.createObjectURL(files[0]);
            // imagePreview.style.display = 'block';
            // console.log(imagePreview.src);
            }

            var xrayImage = fileSelect0.files[0];
            var imageName = files[0].name;
            var storageRef = stor.ref('x-ray/'+imageName);
           //upload image to selected storage reference

            var uploadTask = storageRef.put(xrayImage);
            // console.log("Storage ref called");
           uploadTask.on('state_changed',function (snapshot) {
               //observe state change events such as progress , pause ,resume
               //get task progress by including the number of bytes uploaded and total
               //number of bytes
               var progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
               console.log("upload is " + progress +"% done");
           },function (error) {
               //handle error here
               console.log(error.message);
           },function () {
              //handle successful uploads on complete

               uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                   //get your upload image url here...
                   console.log(downloadURL);
                   var data = {
                     imagedata : downloadURL
                   }
                   db.collection(`doctors/${userID}/patients`).doc(el.id).set(data, {merge : true}).then((snap) => {
                     // console.log(snap);
                     console.log("imagedata added ");

                   });
                   // window.downloadurl = downloadURL;
               });
           });
           // console.log(downloadurl);

        }

      });

      predict0.addEventListener('click', predictFunction1,false);

    }


    async function predictFunction1() {
      alert("predictFunction1 called");
      // action for the submit button
      if (imagePreview.src.length === 0) {
        // window.alert("Please select an image to predict.");
        toastr.error('', 'Select an image to predict', {timeOut: 1400, closeButton : false, progressBar : true})
        // return;
      }

      console.log("Image Preview : "+imagePreview);
      let tensorImg = tf.browser.fromPixels(imagePreview).resizeNearestNeighbor([224, 224]).toFloat().expandDims();
      prediction = await model.predict(tensorImg).data();
      mask_labels = metalabels;
      // console.log("Meta Labels : "+mask_labels+ typeof mask_labels);
      console.log(prediction);
      //console.log(prediction[1]);
      //console.log(labels.labels);
      console.log(mask_labels);

      if (prediction[0] > prediction[1]) {
          var autooutput = mask_labels[0].toUpperCase();
          aiOutput.innerHTML = autooutput.fontcolor("red");
          var data = {
            diseasedata : "COVID POSITIVE"
          }
          db.collection(`doctors/${userID}/patients`).doc(el.id).set(data,{merge : true}).then((snap) => {
            console.log("diseasedata updated");

          });
          // predResult.innerHTML = "Detected Label : " + mask_labels[0];
          // alert("Detected Label : " + mask_labels[0]);
          toastr.success('', 'Disease Prediction : COVID POSITIVE', {timeOut: 1400, closeButton : false, progressBar : true})

      }
      else if (prediction[0] < prediction[1]) {
          aiOutput.textContent = mask_labels[1].toUpperCase();
          var data = {
            diseasedata : "COVID NORMAL"
          }
          db.collection(`doctors/${userID}/patients`).doc(el.id).set(data,{merge : true}).then((snap) => {
            console.log("diseasedata updated");

          });
          // predResult.innerHTML = "Detected Label : " + mask_labels[1];
          // alert("Detected Label : " + mask_labels[1]);
          toastr.success('', 'Disease Prediction : COVID NORMAL', {timeOut: 1400, closeButton : false, progressBar : true})

      }
      else {
          // predResult.innerHTML = "This is Something else";
          alert("This is something else")
      }
      // show(predResult)

    }

    patient2Edit.addEventListener('click', (e) => {
      e.preventDefault();
      // alert("patient2Submit Clicked");


      var data = {
        predictiondata : (radioyes.checked) ? true : false
      }
      db.collection(`doctors/${userID}/patients`).doc(el.id).set(data,{merge : true}).then((snap) => {
        console.log("predictiondata updated");

      });

  });

    //Modal 3 Edit
    var txt = pData.symptomdisease;
    aiOutputDisease.innerHTML = `<u>${txt}</u>`;

    predict2Edit.addEventListener('click', (e) => {
      e.preventDefault();

      var selectedsymptom = $('#multisymptoms').formSelect('getSelectedValues');
      selectedsymptom = Object.values(selectedsymptom);

      console.log("selected symptoms : "+selectedsymptom);

      //Symptoms Prediction Logic
      //index of  the disease id integers are tge symptom id based on the index of l1 symptoms

  		var Diabetes = [4, 7, 8, 12];   // Disease ID 0
  		var Dengue = [1, 6, 9, 11];   // Disease ID 1
  		var Jaundice = [0, 4, 5, 13];   // Disease ID 2
  		var Typhoid = [0, 1, 2, 5];   // Disease ID 3
  		var Tuberculosis = [1, 4, 11, 12];   // Disease ID 4
  		var Pneumonia = [1, 3, 4, 5];   // Disease ID 5
  		var Malaria = [1, 5, 10, 11];   // Disease ID 6
  		var Chicken_pox = [4, 5, 7, 9];   // Disease ID 7

  		var match = [-1, -1];

  		var disease = ["Diabetes", "Dengue", "Jaundice", "Typhoid", "Tuberculosis", "Pneumonia", "Malaria", "Chicken_Pox"];

  		var l1 = ["abdominal_pain", "chills", "constipation", "cough", "fatigue", "high_fever", "joint_pain", "lethargy", "restlessness", "skin_rash", "sweating", "vomiting", "weight_loss", "yellowish_skin"];

      var a = selectedsymptom;
  		// var a = ["chills", "high_fever", "sweating", "vomiting"];
  		a.sort();
  		var i;
  		var aid = [-1, -1, -1, -1];
  		for (i = 0; i < a.length; i++) {
  			var temp = l1.indexOf(a[i]);
  			aid[i] = temp;
  		}
  		//aid = [1, 6, 9, 11]

  		var x;
  		var y;

  		// If Diabetes

  		var count = 0;
  		for (x = 0; x < aid.length; x++) {
  			for (y = 0; y < Diabetes.length; y++) {
  				if (aid[x] == Diabetes[y]) {
  					count = count + 1;
  				}
  			}
  		}
  		if (count > match[0]) {
  			match[0] = count;
  			match[1] = 0;   //Diabetes ID is 0
  		}
  		count = 0;


  		// If Dengue

  		for (x = 0; x < aid.length; x++) {
  			for (y = 0; y < Dengue.length; y++) {
  				if (aid[x] == Dengue[y]) {
  					count = count + 1;
  				}
  			}
  		}
  		if (count > match[0]) {
  			match[0] = count;
  			match[1] = 1;  //Dengue ID is 1
  		}
  		count = 0;


  		// If Jaundice

  		for (x = 0; x < aid.length; x++) {
  			for (y = 0; y < Jaundice.length; y++) {
  				if (aid[x] == Jaundice[y]) {
  					count = count + 1;
  				}
  			}
  		}
  		if (count > match[0]) {
  			match[0] = count;
  			match[1] = 2;  //Jaundice Id is 2
  		}
  		count = 0;


  		// If Typhoid

  		var count = 0;
  		for (x = 0; x < aid.length; x++) {
  			for (y = 0; y < Typhoid.length; y++) {
  				if (aid[x] == Typhoid[y]) {
  					count = count + 1;
  				}
  			}
  		}
  		if (count > match[0]) {
  			match[0] = count;
  			match[1] = 3;          // Typhoid ID is 3
  		}
  		count = 0;



  		// If Tuberculosis

  		var count = 0;
  		for (x = 0; x < aid.length; x++) {
  			for (y = 0; y < Tuberculosis.length; y++) {
  				if (aid[x] == Tuberculosis[y]) {
  					count = count + 1;
  				}
  			}
  		}
  		if (count > match[0]) {
  			match[0] = count;
  			match[1] = 4;            // Tuberculosis ID is 4
  		}
  		count = 0;


  		// If Pneumonia

  		var count = 0;
  		for (x = 0; x < aid.length; x++) {
  			for (y = 0; y < Pneumonia.length; y++) {
  				if (aid[x] == Pneumonia[y]) {
  					count = count + 1;
  				}
  			}
  		}
  		if (count > match[0]) {
  			match[0] = count;
  			match[1] = 5;     // Pneumonia ID is 5
  		}
  		count = 0;



  		// If Malaria

  		var count = 0;
  		for (x = 0; x < aid.length; x++) {
  			for (y = 0; y < Malaria.length; y++) {
  				if (aid[x] == Malaria[y]) {
  					count = count + 1;
  				}
  			}
  		}
  		if (count > match[0]) {
  			match[0] = count;
  			match[1] = 6;   // Malaria ID is 6
  		}
  		count = 0;

  		// If Chicken_pox

  		var count = 0;
  		for (x = 0; x < aid.length; x++) {
  			for (y = 0; y < Chicken_pox.length; y++) {
  				if (aid[x] == Chicken_pox[y]) {
  					count = count + 1;
  				}
  			}
  		}
  		if (count > match[0]) {
  			match[0] = count;
  			match[1] = 7;  // Chicken_Pox ID is 7
  		}
  		count = 0;


  		// Now The Match has the value of the highesh matched no of symptoms and the Disease ID of the

  		// Now based on the disease ID we will give out this output match[1] is the disease id


  		var index = match[1];
  		//print(disease[index])

  		var text = "";
  		text += text + disease[index];
      aiOutputDisease.innerHTML = `<u>${text}</u>`;

      text = text.toUpperCase();
      console.log("Predicted Disease : "+text);


      var data = {
        symptomdisease : text
      }
      // console.log(data);

      db.doc(`doctors/${userID}/patients/${el.id}`).set(data,{merge : true}).then(() => {

        console.log("symptomdisease added");

      });

    })

})
}
// -------------------------

//Logout Handling
logout3.addEventListener('click', (e) => {
  e.preventDefault();
  // alert(`Logged Out User : ${auth.currentUser.email}`);
  toastr.success('', 'User logged out successfully', {timeOut: 1400, closeButton : false, progressBar : true})
  auth.signOut().then(() => {
    window.location = 'login.html';
  });

});
logout4.addEventListener('click', (e) => {
  e.preventDefault();
  // alert(`Logged Out User : ${auth.currentUser.email}`);
  toastr.success('', 'User logged out successfully', {timeOut: 1400, closeButton : false, progressBar : true})
  auth.signOut().then(() => {
    window.location = 'login.html';
  });

});


// -------------------------

// console.log("user.js loaded");
auth.onAuthStateChanged(user1 => {
  if (user1) {
    console.log("Logged In user (user.js)" + user1.email);
    console.log("Logged In user (user.js)" + user1.uid);


    messaging.requestPermission().then(() => {
        console.log("Permission Granted");
        // console.log(message.getToken());
        return messaging.getToken({
            vapidKey: "BKEJoaeHf4tYKMz1NFB6sMJslO4x3cUBRfa5NJyrTmnjlyKPOmrxZecyGki17AR9jVj8X9OJ1Y-uKZp_rftoTw8"
        });
    }).then((token) => {
        // sendTokenToServer(token);
        // updateUIForPushEnabled(token);
        console.log("Token is : " + token);
        const data = {
          email : user1.email,
          token : token,
          timestamp: firebase.firestore.Timestamp.now()
        }
        console.log(data);
        db.collection("fcm").doc().set(data,{merge : true}).then(() => {
          console.log("Token Added");
        });
        // db.doc(`fcm/${user1.email}`).set(data,{merge : true}).then(() => {
        //
        //   // alert("Patient Details Updated!!");
        //   toastr.success('', 'Token Detials Added!', {timeOut: 1400, closeButton : false, progressBar : true})
        //
        // });
    }).catch((err) => {
        console.log("Error getting permission" + err.message);
    })


    messaging.onMessage((payload) => {
        console.log('onMessage script tag : ' + payload);
    })

    //Greeting Message
    db.doc(`doctors/${user1.uid}`).onSnapshot(snap => {
        //console.log("Logged In User (user.js) : " + user.email + ' ' +snap.data().name);

        welcome.textContent = 'Dr. ' + snap.data().name;
        profileWelcome.textContent = 'Dr. ' + snap.data().name+'\'s Profile';

        //Profile Form Details
        // get user info
        myProfileForm['icon_prefixMyProf'].value = snap.data().name;
        myProfileForm['icon_telephone12MyProf'].value = snap.data().mobile;
        myProfileForm['icon_email12MyProf'].value = snap.data().email;
        myProfileForm['icon_city12MyProf'].value = snap.data().speciality;
        myProfileForm['icon_state12MyProf'].value = snap.data().hospital;

        myProfileForm['icon_telephoneMyProf'].value = snap.data().mobile;
        myProfileForm['icon_emailMyProf'].value = snap.data().email;
        myProfileForm['icon_city6MyProf'].value = snap.data().speciality;
        myProfileForm['icon_state6MyProf'].value = snap.data().hospital;

        myProfileForm['textarea26'].value = snap.data().bio;
    });

    // console.log("-- Calling Patients Collection ---");

    db.collection(`doctors/${user1.uid}/patients`).orderBy('timestamp','desc').onSnapshot(snap => {
      // console.log('----- Patient Data ----');
      //console.log(snap);
      snap.forEach(doc => {
        const data = doc.data();
        // console.log(data);
        var dName = (data.diseasedata === "no_data") ? data.symptomdisease : data.diseasedata;
        console.log(data.fname+ ' ' +data.patientID+ ' ' +dName);
        //console.log(doc);

        // console.log(`Patient Data : ${data.fname}`);
        var html = `
        <div class="card ptCard z-depth-2">
            <div class="mainHeader blue lighten-5">
                <span class="ptCardHeader">
                    ${data.fname} ${data.lname}
                </span>
                <span class="ptCardSubHeader">
                    ${data.city}
                </span>
            </div>
            <div class="ptCardDisease">
                <span class="ptCardCateg">Disease : </span>
                <span class="diseaseName">${dName}</span>
            </div>
            <div class="ptCardCheckUp">
                <span class="ptCardCateg">Last Check-up : </span>
                <span class="checkupDate">${data.date}</span>
            </div>
            <a class="waves-effect waves-light btn-small ptCardEdit modal-trigger" id=${data.patientID} onclick="editPatient(this)" data-target="patientForm">Edit</a>
        </div>
        `;
        if(data.predictiondata === true || data.predictiondata === false){
          demoPatient.innerHTML += html;
        }




      });

    })


    //Profile Form Details
    myProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // alert("Profile Form Sumitted");
      //
      // get user info
      var name0 = myProfileForm['icon_prefixMyProf'].value;
      var mobile0 = myProfileForm['icon_telephone12MyProf'].value;
      var email0 = myProfileForm['icon_email12MyProf'].value;
      var speciality0 = myProfileForm['icon_city12MyProf'].value;
      var hospital0 = myProfileForm['icon_state12MyProf'].value;

      var mobile1 = myProfileForm['icon_telephoneMyProf'].value;
      var email1 = myProfileForm['icon_emailMyProf'].value;
      var speciality1 = myProfileForm['icon_city6MyProf'].value;
      var hospital1 = myProfileForm['icon_state6MyProf'].value;

      var bio0 = myProfileForm['textarea26'].value;


      var data = {
        name : name0,
        mobile : (screen.width >= 992) ? mobile1 : mobile0,
        email : user1.email,
        speciality : (screen.width >= 992) ? speciality1 : speciality0,
        hospital : (screen.width >= 992) ? hospital1 : hospital0,
        bio : bio0
      }
      console.log(data);
      console.log("Logged In User (after submission) : "+user1.email);
      db.collection('doctors').doc(user1.uid).set(data,{ merge: true }).then(() => {
        // alert("Profile Details Updated!");
          toastr.success('', 'Profile Details Updated', {timeOut: 1400, closeButton : false, progressBar : true})

        const modal = document.querySelector('#myProfileModal');
        M.Modal.getInstance(modal).close();
      });

    });

    //Patient Basic Form Details
    patient1Submit.addEventListener('click', (e) => {
      // patient1Edit.style.display = 'none';
      e.preventDefault();
      //alert("Patient Form Sumitted");

      //get user info
      var fname0 = modal1Form['icon_prefix'].value;
      var lname0 = modal1Form['icon_prefix2'].value;

      var mobile0 = modal1Form['icon_telephone12'].value;
      var email0 = modal1Form['icon_email12'].value;
      var city0 = modal1Form['icon_city12'].value;
      var state0 = modal1Form['icon_state12'].value;
      var country0 = modal1Form['icon_country12'].value;

      var mobile1 = modal1Form['icon_telephone'].value;
      var email1 = modal1Form['icon_email'].value;
      var city1 = modal1Form['icon_city6'].value;
      var state1 = modal1Form['icon_state6'].value;
      var country1 = modal1Form['icon_country6'].value;



      var data = {
        fname : fname0,
        lname : lname0,
        mobile : (screen.width >= 992) ? mobile1 : mobile0,
        email : (screen.width >= 992) ? email1 : email0,
        city : (screen.width >= 992) ? city1 : city0,
        state : (screen.width >= 992) ? state1 : state0,
        country : (screen.width >= 992) ? country1 : country0,
        timestamp: firebase.firestore.Timestamp.now(),
        date: firebase.firestore.Timestamp.now().toDate().toDateString()
      }
      console.log(data);



      db.collection(`doctors/${user1.uid}/patients`).add(data).then((snap) => {
        console.log(snap.id);
        patientID = snap.id;
        //console.log(data.fname);
        // alert("New Patient Added!!");
        toastr.success('', 'New Patient Added', {timeOut: 1400, closeButton : false, progressBar : true})
        db.collection(`doctors/${user1.uid}/patients`).doc(patientID).set({
          patientID : patientID,
          diseasedata : "no_data"
        },{merge : true}).then(() => {console.log("patientID Entered "+patientID);});

      });

      openNextModal();
      // console.log("Logged In User (after submission) : "+user1.email);
      // db.collection('doctors').doc(user1.uid).set(data,{ merge: true }).then(() => {
      //   alert("Profile Details Updated!");
      // });

    });

    //Predict function

    var fileSelect0 = document.getElementById("xray0");
    var fileSelect1 = document.getElementById("xray1");
    var predict0 = document.getElementById("predict0");
    var predict1 = document.getElementById("predict1");
    var model = undefined;

    // the link to your model provided by Teachable Machine export panel
    const metadataURL = "https://teachablemachine.withgoogle.com/models/6EhuIE6SE/metadata.json";

    function getJSON(url) {
        var resp ;
        var xmlHttp ;

        resp  = '' ;
        xmlHttp = new XMLHttpRequest();

        if(xmlHttp != null)
        {
            xmlHttp.open( "GET", url, false );
            xmlHttp.send( null );
            resp = xmlHttp.responseText;
        }

        return resp ;
    }

    var metalabels;
    metalabels = getJSON(metadataURL);
    metalabels = JSON.parse(metalabels);
    metalabels = metalabels.labels;
    // console.log(metalabels);
    // const rawJson = JSON.parse(metadataURL);
    // const metalabels = rawJson[labels];
    // console.log(metalabels);
    //Load the modal
    async function initialize() {
      model = await tf.loadLayersModel('https://teachablemachine.withgoogle.com/models/6EhuIE6SE/model.json');
    }
    initialize();

    const imagePreview = document.createElement('img');
    // imagePreview.src = 'https://thewebmate.in/logo';
    // console.log(imagePreview.src.length);

    imagePreview.style.display = 'none';
    // Add event listeners
    if (screen.width > 992){
      var diseaseSelect = document.querySelector('#diseaseSelect');
      diseaseSelect.value = "COVID-19";
      var diseasedata = diseaseSelect.value;
      var imagedata = "";
      var predictiondata = true;


      // console.log(diseaseSelect.value);

      fileSelect1.addEventListener("change", (e) => {
        if(diseaseSelect.value != "COVID-19"){
          alert("IMP : Please Select Disease to Predict");
        }
        else{
          // console.log("window.patientID : " + window.patientID);
          var files = e.target.files;
          console.log(files[0].name);
          // console.log(typeof files);
          var reader = new FileReader();
          // console.log(reader);
          reader.readAsDataURL(files[0]);
          reader.onloadend = () => {
            imagePreview.src = URL.createObjectURL(files[0]);
            // imagePreview.style.display = 'block';
            // console.log(imagePreview.src);
            }

            var xrayImage = fileSelect0.files[0];
            var imageName = files[0].name;
            var storageRef = stor.ref('x-ray/'+imageName);
           //upload image to selected storage reference

            var uploadTask = storageRef.put(xrayImage);
            console.log("Storage ref called");
           uploadTask.on('state_changed',function (snapshot) {
               //observe state change events such as progress , pause ,resume
               //get task progress by including the number of bytes uploaded and total
               //number of bytes
               var progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
               console.log("upload is " + progress +" done");
           },function (error) {
               //handle error here
               console.log(error.message);
               toastr.error('', 'Error Uploading Image', {timeOut: 1400, closeButton : false, progressBar : true})
           },function () {
              //handle successful uploads on complete

               uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                   //get your upload image url here...
                   console.log(downloadURL);
                   var data = {
                     imagedata : downloadURL
                   }
                   db.collection(`doctors/${user1.uid}/patients`).doc(window.patientID).set(data, {merge : true}).then((snap) => {
                     // console.log(snap);
                     console.log("imagedata added ");

                   });
                   // window.downloadurl = downloadURL;
               });
           });
           // console.log(downloadurl);



        }

      });

      predict1.addEventListener('click', predictFunction0,false);

    }
    if(screen.width < 992) {
      var diseaseSelect = document.querySelector('#diseaseSelect');
      diseaseSelect.value = "COVID-19";
      var diseasedata = diseaseSelect.value;
      var imagedata = "";
      var predictiondata = true;


      // console.log(diseaseSelect.value);

      fileSelect0.addEventListener("change", (e) => {
        if(diseaseSelect.value != "COVID-19"){
          // alert("IMP : Please Select Disease to Predict");
          toastr.error('', 'Select Disease to Predict', {timeOut: 1400, closeButton : false, progressBar : true})
        }
        else{
          // console.log("window.patientID : " + window.patientID);
          var files = e.target.files;
          console.log(files[0].name);
          // console.log(typeof files);
          var reader = new FileReader();
          // console.log(reader);
          reader.readAsDataURL(files[0]);
          reader.onloadend = () => {
            imagePreview.src = URL.createObjectURL(files[0]);
            // imagePreview.style.display = 'block';
            // console.log(imagePreview.src);
            }

            var xrayImage = fileSelect0.files[0];
            var imageName = files[0].name;
            var storageRef = stor.ref('x-ray/'+imageName);
           //upload image to selected storage reference

            var uploadTask = storageRef.put(xrayImage);
            console.log("Storage ref called");
           uploadTask.on('state_changed',function (snapshot) {
               //observe state change events such as progress , pause ,resume
               //get task progress by including the number of bytes uploaded and total
               //number of bytes
               var progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
               console.log("upload is " + progress +" done");
           },function (error) {
               //handle error here
               console.log(error.message);
               toastr.error('', 'Select Disease to Predict', {timeOut: 1400, closeButton : false, progressBar : true})
           },function () {
              //handle successful uploads on complete

               uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                   //get your upload image url here...
                   console.log(downloadURL);
                   var data = {
                     imagedata : downloadURL
                   }
                   db.collection(`doctors/${user1.uid}/patients`).doc(window.patientID).set(data, {merge : true}).then((snap) => {
                     // console.log(snap);
                     console.log("imagedata added ");

                   });
                   // window.downloadurl = downloadURL;
               });
           });
           // console.log(downloadurl);

        }

      });

      predict0.addEventListener('click', predictFunction0,false);

    }


    async function predictFunction0() {
      // alert("predictFunction0 called");
      // action for the submit button
      if (imagePreview.src.length === 0) {
        // window.alert("Please select an image to predict.");
        toastr.error('', 'Select Image to Predict', {timeOut: 1400, closeButton : false, progressBar : true})
        // return;
      }

      console.log("Image Preview : "+imagePreview);
      let tensorImg = tf.browser.fromPixels(imagePreview).resizeNearestNeighbor([224, 224]).toFloat().expandDims();
      prediction = await model.predict(tensorImg).data();
      mask_labels = metalabels;
      // console.log("Meta Labels : "+mask_labels+ typeof mask_labels);
      console.log(prediction);
      //console.log(prediction[1]);
      //console.log(labels.labels);
      console.log(mask_labels);

      if (prediction[0] > prediction[1]) {
          var autooutput = mask_labels[0].toUpperCase();
          aiOutput.innerHTML = autooutput.fontcolor("red");
          var data = {
            diseasedata : "COVID POSITIVE"
          }
          db.collection(`doctors/${user1.uid}/patients`).doc(window.patientID).set(data,{merge : true}).then((snap) => {
            console.log("diseasedata added");

          });
          // predResult.innerHTML = "Detected Label : " + mask_labels[0];
          // alert("Detected Label : " + mask_labels[0]);
          toastr.error('', 'Disease Prediction : COVID POSITIVE', {timeOut: 1400, closeButton : false, progressBar : true})

      } else if (prediction[0] < prediction[1]) {
          aiOutput.textContent = mask_labels[1].toUpperCase();
          var data = {
            diseasedata : "COVID NORMAL"
          }
          db.collection(`doctors/${user1.uid}/patients`).doc(window.patientID).set(data,{merge : true}).then((snap) => {
            console.log("diseasedata added");

          });
          // predResult.innerHTML = "Detected Label : " + mask_labels[1];
          // alert("Detected Label : " + mask_labels[1]);
          toastr.success('', 'Disease Prediction : COVID NORMAL', {timeOut: 1400, closeButton : false, progressBar : true})

      } else {
          // predResult.innerHTML = "This is Something else";
          alert("This is something else")
      }
      // show(predResult)

    }

    patient2Submit.addEventListener('click', (e) => {
      e.preventDefault();
      // alert("patient2Submit Clicked");


      var data = {
        predictiondata : (radioyes.checked) ? true : false
      }
      db.collection(`doctors/${user1.uid}/patients`).doc(window.patientID).set(data,{merge : true}).then((snap) => {
        console.log("predictiondata added");

      });


    })

    predict2.addEventListener('click',(e)=>{
      e.preventDefault();
      // alert("predict2 clicked");

      var selectedsymptom = $('#multisymptoms').formSelect('getSelectedValues');
      selectedsymptom = Object.values(selectedsymptom);

      console.log("selected symptoms : "+selectedsymptom);

      //Symptoms Prediction Logic
      //index of  the disease id integers are tge symptom id based on the index of l1 symptoms

  		var Diabetes = [4, 7, 8, 12];   // Disease ID 0
  		var Dengue = [1, 6, 9, 11];   // Disease ID 1
  		var Jaundice = [0, 4, 5, 13];   // Disease ID 2
  		var Typhoid = [0, 1, 2, 5];   // Disease ID 3
  		var Tuberculosis = [1, 4, 11, 12];   // Disease ID 4
  		var Pneumonia = [1, 3, 4, 5];   // Disease ID 5
  		var Malaria = [1, 5, 10, 11];   // Disease ID 6
  		var Chicken_pox = [4, 5, 7, 9];   // Disease ID 7

  		var match = [-1, -1];

  		var disease = ["Diabetes", "Dengue", "Jaundice", "Typhoid", "Tuberculosis", "Pneumonia", "Malaria", "Chicken_Pox"];

  		var l1 = ["abdominal_pain", "chills", "constipation", "cough", "fatigue", "high_fever", "joint_pain", "lethargy", "restlessness", "skin_rash", "sweating", "vomiting", "weight_loss", "yellowish_skin"];

      var a = selectedsymptom;
  		// var a = ["chills", "high_fever", "sweating", "vomiting"];
  		a.sort();
  		var i;
  		var aid = [-1, -1, -1, -1];
  		for (i = 0; i < a.length; i++) {
  			var temp = l1.indexOf(a[i]);
  			aid[i] = temp;
  		}
  		//aid = [1, 6, 9, 11]

  		var x;
  		var y;

  		// If Diabetes

  		var count = 0;
  		for (x = 0; x < aid.length; x++) {
  			for (y = 0; y < Diabetes.length; y++) {
  				if (aid[x] == Diabetes[y]) {
  					count = count + 1;
  				}
  			}
  		}
  		if (count > match[0]) {
  			match[0] = count;
  			match[1] = 0;   //Diabetes ID is 0
  		}
  		count = 0;


  		// If Dengue

  		for (x = 0; x < aid.length; x++) {
  			for (y = 0; y < Dengue.length; y++) {
  				if (aid[x] == Dengue[y]) {
  					count = count + 1;
  				}
  			}
  		}
  		if (count > match[0]) {
  			match[0] = count;
  			match[1] = 1;  //Dengue ID is 1
  		}
  		count = 0;


  		// If Jaundice

  		for (x = 0; x < aid.length; x++) {
  			for (y = 0; y < Jaundice.length; y++) {
  				if (aid[x] == Jaundice[y]) {
  					count = count + 1;
  				}
  			}
  		}
  		if (count > match[0]) {
  			match[0] = count;
  			match[1] = 2;  //Jaundice Id is 2
  		}
  		count = 0;


  		// If Typhoid

  		var count = 0;
  		for (x = 0; x < aid.length; x++) {
  			for (y = 0; y < Typhoid.length; y++) {
  				if (aid[x] == Typhoid[y]) {
  					count = count + 1;
  				}
  			}
  		}
  		if (count > match[0]) {
  			match[0] = count;
  			match[1] = 3;          // Typhoid ID is 3
  		}
  		count = 0;



  		// If Tuberculosis

  		var count = 0;
  		for (x = 0; x < aid.length; x++) {
  			for (y = 0; y < Tuberculosis.length; y++) {
  				if (aid[x] == Tuberculosis[y]) {
  					count = count + 1;
  				}
  			}
  		}
  		if (count > match[0]) {
  			match[0] = count;
  			match[1] = 4;            // Tuberculosis ID is 4
  		}
  		count = 0;


  		// If Pneumonia

  		var count = 0;
  		for (x = 0; x < aid.length; x++) {
  			for (y = 0; y < Pneumonia.length; y++) {
  				if (aid[x] == Pneumonia[y]) {
  					count = count + 1;
  				}
  			}
  		}
  		if (count > match[0]) {
  			match[0] = count;
  			match[1] = 5;     // Pneumonia ID is 5
  		}
  		count = 0;



  		// If Malaria

  		var count = 0;
  		for (x = 0; x < aid.length; x++) {
  			for (y = 0; y < Malaria.length; y++) {
  				if (aid[x] == Malaria[y]) {
  					count = count + 1;
  				}
  			}
  		}
  		if (count > match[0]) {
  			match[0] = count;
  			match[1] = 6;   // Malaria ID is 6
  		}
  		count = 0;

  		// If Chicken_pox

  		var count = 0;
  		for (x = 0; x < aid.length; x++) {
  			for (y = 0; y < Chicken_pox.length; y++) {
  				if (aid[x] == Chicken_pox[y]) {
  					count = count + 1;
  				}
  			}
  		}
  		if (count > match[0]) {
  			match[0] = count;
  			match[1] = 7;  // Chicken_Pox ID is 7
  		}
  		count = 0;


  		// Now The Match has the value of the highesh matched no of symptoms and the Disease ID of the

  		// Now based on the disease ID we will give out this output match[1] is the disease id


  		var index = match[1];
  		//print(disease[index])

  		var text = "";
  		text += text + disease[index];
      aiOutputDisease.innerHTML = `<u>${text}</u>`;

      text = text.toUpperCase();
      console.log("Predicted Disease : "+text);


      var data = {
        symptomdisease : text
      }
      console.log(data);
      db.collection(`doctors/${user1.uid}/patients`).doc(window.patientID).set(data,{merge : true}).then((snap) => {
        console.log("symptomdisease added");

      });


    })



    // patient3Submit.addEventListener('click', (e) => {
    //   // alert("patient3Submit clicked");
    //   db.collection(`doctors/${user1.uid}/patients`).doc(window.patientID).get().then((snap) => {
    //     console.log(snap.data());
    //
    //
    //   });
    //
    // })









  }

  else{
    window.location = 'login.html';
  }

});
