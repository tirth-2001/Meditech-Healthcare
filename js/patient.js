var patientsList = document.querySelector('#patientsList');
var patientReport = document.querySelector('#patientReport');
var totalP = document.querySelector('#anaNumVals');
var totalAI = document.querySelector('#anaNumVals1');
var ctx = document.getElementById('myChart').getContext('2d');
ctx.canvas.parentNode.style.height = '620px';
ctx.canvas.parentNode.style.width = '620px';

// patientsList.innerHTML += 'Hello';

let emailReport = (el) => {
  var userID = auth.currentUser.uid;
  console.log("Email report Clicked : "+ el.id + "Doctor Id : "+userID);
  var pID = el.id;
  var dest = "tirthgpatel.27@gmail.com";
  var destUrl = `https://us-central1-pdpu-medical-website.cloudfunctions.net/sendMail?dest=${dest}&dID=${userID}&pID=${pID}`;
  // emailSend.setAttribute("href",destUrl);
  // document.body.appendChild(emailSend);
  // emailSend.click();
  // document.location.href = destUrl;
  fetch(destUrl).then(
  function(response) {
    if (response.status === 200) {
      console.log('Looks like there was no problem. Status Code: ' +
        response.status);
        toastr.success('', 'Email Report Sent', {timeOut: 1400, closeButton : false, progressBar : true})

      return;
        }
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :', err);
      toastr.error('', 'Couldn\'t Sent Email', {timeOut: 1400, closeButton : false, progressBar : true})

    });


};

auth.onAuthStateChanged(user2 => {
  if (user2) {
    console.log(user2.email);


    db.collection(`doctors/${user2.uid}/patients`).onSnapshot(snap => {
      console.log("Total PATIENTS : "+snap.size);
      totalP.innerHTML = snap.size;
    })

    db.collection(`doctors/${user2.uid}/patients`).where("diseasedata","!=","").onSnapshot(snap => {
      console.log("Total AI PATIENTS : "+snap.size);
      totalAI.innerHTML = snap.size;
    })

    db.collection(`doctors/${user2.uid}/patients`).orderBy("timestamp","desc").limit(5).onSnapshot(snap => {
        // console.log("Logged In User (patient.js) : " + user2.email + ' ' +snap.data().name);
        var count = 1;

        snap.forEach((doc) => {

          const data = doc.data();
          var dName = (data.diseasedata != "") ? data.diseasedata : data.symptomdisease;
          console.log(count+ '-> '+data.fname+ ' ' +data.patientID+ ' ' +dName);
          var html = `<div class="row_data">
                <div class="d_t_name_full">
                    <span class="d_t_index">${count}.</span>
                    <span class="d_t_name">${data.fname} ${data.lname}</span>
                </div>
                <div class="d_t_dies">${dName}</div>
            </div>`;
            patientsList.innerHTML += html;
          count = count +1;
        });



      })

    db.collection(`doctors/${user2.uid}/patients`).orderBy("timestamp","desc").onSnapshot(snap => {
        // console.log("Logged In User (patient.js) : " + user2.email + ' ' +snap.data().name);
        var count = 1;

        console.log("Total Patients : "+snap.size);
        snap.forEach((doc) => {

          const data = doc.data();
          var dName = (data.diseasedata != "") ? data.diseasedata : data.symptomdisease;
          // console.log(count+ '-> '+data.fname+ ' ' +data.patientID+ ' ' +data.diseasedata);
          var html = `  <div class="bt_row">
                <div class="temp_row">
                    <div class="bt_icon">
                        <i class="material-icons">account_circle</i>
                    </div>
                    <div class="bt_info">
                        <span>${count}. </span>
                        <span>${data.fname}</span>
                        <span>${data.lname} &rarr;</span>
                        <span><b>${dName}</b></span>
                    </div>
                </div>
                <button class="btn blue waves-effect" id=${data.patientID} onclick="emailReport(this)">Email Report</button>
            </div>`;
            patientReport.innerHTML += html;
            count+=1;
        });



    })


    var covidpostive = 10;
    var covidnormal = 3;
    var malaria = 5;
    var dengue = 2;
    var jaundice = 7;
    var typhoid = 4;

    db.collection(`doctors/${user2.uid}/patients`).where("diseasedata","==","COVID POSITIVE").onSnapshot((snap) => {
      // var pData = snap.data();
      console.log("COVID Positive : "+snap.size);
      covidpostive = snap.size;
    })

    var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Covid', 'Malaria', 'Dengue', 'Jaundice', 'Typhoid'],
            datasets: [{
                label: 'hello',
                data: [covidpostive, malaria, dengue, jaundice, typhoid],
                backgroundColor: [
                    // 'rgba(255, 99, 132, 0.2)',
                    // 'rgba(54, 162, 235, 0.2)',
                    // 'rgba(255, 206, 86, 0.2)',
                    // 'rgba(75, 192, 192, 0.2)',
                    // 'rgba(153, 102, 255, 0.2)',
                    // 'rgba(255, 159, 64, 0.2)'
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            // scales: {
            //     yAxes: [{
            //         ticks: {
            //             beginAtZero: true
            //         }
            //     }]
            // }
        }
    });



  }
  else{
    window.location = 'login.html';
  }

})
