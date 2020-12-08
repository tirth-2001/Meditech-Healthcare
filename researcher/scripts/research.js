var logout1 = document.querySelector('#logout1');
var logout2 = document.querySelector('#logout2');
var patientsCount = document.querySelector('#patientsCount');
var aiNum = document.querySelector('#aiDiagNum');
var imgNum = document.querySelector('#imgDtsetNum');
var doctNum = document.querySelector('#avaiDctrNum');
var disChart = document.querySelector('#disChart').getContext('2d');
var aiAcuChart = document.querySelector('#aiAcuChart').getContext('2d');
var postive_download = document.querySelector('#postive_download');
var negative_download = document.querySelector('#negative_download');
// disChart.canvas.parentNode.style.height = '320px';
// disChart.canvas.parentNode.style.width = '520px';

var totalDoctors = 0;
var totalPatients = 0;
var totalAI = 0;
var totalImg = 0;

//Logout Handling
logout1.addEventListener('click', (e) => {
  e.preventDefault();
  // alert(`Logged Out User : ${auth.currentUser.email}`);
  toastr.success('', 'User logged out successfully', {timeOut: 1400, closeButton : false, progressBar : true})
  auth.signOut().then(() => {
    window.location = 'login.html';
  });

});
logout2.addEventListener('click', (e) => {
  e.preventDefault();
  // alert(`Logged Out User : ${auth.currentUser.email}`);
  toastr.success('', 'User logged out successfully', {timeOut: 1400, closeButton : false, progressBar : true})
  auth.signOut().then(() => {
    window.location = 'login.html';
  });

});




auth.onAuthStateChanged(user1 => {
  if(user1){
    console.log("Logged In User (research.js) : "+user1.uid);
    if((user1.uid === "VOncW4JSoVQSUdsnGvjsqaB4l4b2") || (user1.uid === "6ogWdjU22NeXgDlxen7ENDwlmvE2")){


    //White slide
    db.collection(`doctors`).onSnapshot(snap => {
      window.totalDoctors = 0;

      // console.log("Total doctors : "+snap.size);
      window.totalDoctors = snap.size;
      animateValue(doctNum, 0, window.totalDoctors, 2500);
      doctNum.innerHTML = window.totalDoctors;
        snap.forEach((doc) => {

          const data = doc.data();
          // console.log(data.name);
          db.collection(`doctors/${doc.id}/patients`).onSnapshot(query => {
            // window.totalPatients = 0;
            // window.totalAI = 0;
            // window.totalImg = 0;
          if (query.size > 0) {
            // console.log('subcollection exists');
            window.totalPatients+=query.size;
            // console.log(`Patients for ${data.name} : ${query.size}`);

            query.forEach((sub) => {
              const qdata = sub.data();
              if(qdata.imagedata != null){
                // console.log("imagedata exists");
                window.totalImg++;
                // console.log("Total images : "+window.totalImg);
                imgNum.innerHTML = window.totalImg;
                animateValue(imgNum, 0, window.totalImg, 2000);

              }

              if(qdata.diseasedata === "COVID POSITIVE" || qdata.diseasedata === "COVID NORMAL"){
                // console.log(qdata.fname+' - '+qdata.diseasedata);
                window.totalAI++;
                aiNum.innerHTML = window.totalAI;
                animateValue(aiNum, 0, window.totalAI, 1000);

              }
            })

          }
          // console.log("Total patients : "+window.totalPatients);
          patientsCount.innerHTML = window.totalPatients;
          animateValue(patientsCount, 0, window.totalPatients, 3000);

        });
        })
        // console.log("Total doctors : "+window.totalDoctors);

    })


    //Blue slide
    var covidpostive = 0;
    var pneumonia = 0;
    var malaria = 0;
    var dengue = 0;
    var jaundice = 0;
    var typhoid = 0;
    var tuberculosis = 0;
    var chicken_pox = 0;
    var diabetes = 0;

    db.collection(`doctors`).onSnapshot((snap) => {
      snap.forEach((doc) => {
        db.collection(`doctors/${doc.id}/patients`).onSnapshot((query) => {
          if(query.size>0){
            query.forEach((sub) => {
              const pdata = sub.data();
              // console.log(pdata.diseasedata);
              // console.log(pdata.symptomdisease);
              if(pdata.diseasedata === "COVID POSITIVE"){
                covidpostive++;
              }
              if(pdata.symptomdisease === "DIABETES"){
                diabetes++;
              }
              if(pdata.symptomdisease === "TYPHOID"){
                typhoid++;
              }
              if(pdata.symptomdisease === "JAUNDICE"){
                jaundice++;
              }
              if(pdata.symptomdisease === "MALARIA"){
                malaria++;
              }
              if(pdata.symptomdisease === "DENGUE"){
                dengue++;
              }
              if(pdata.symptomdisease === "CHICKEN_POX"){
                chicken_pox++;
              }
              if(pdata.symptomdisease === "PNEUMONIA"){
                pneumonia++;
              }
              if(pdata.symptomdisease === "TUBERCULOSIS"){
                tuberculosis++;
              }
              // console.log(`covid : ${covidpostive},diabetes : ${diabetes}`);


            })
          }
        })
      })
    })

    // console.log(covidpostive);
    setTimeout(() => {
      var myChart = new Chart(disChart, {
          type: 'bar',
          data: {
              labels: ["Covid","Diabetes", "Dengue", "Jaundice", "Typhoid", "Tuberculosis", "Pneumonia", "Malaria", "Chicken_Pox"],
              datasets: [{
                  label: 'Disease Data',
                  data: [covidpostive, diabetes, dengue, jaundice, typhoid, tuberculosis, pneumonia, malaria, chicken_pox],
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


    }, 2000);

    //Orange slide
    var accurate = 0;
    var inaccurate = 0;

    db.collection(`doctors`).onSnapshot((snap) => {
      snap.forEach((doc) => {
        db.collection(`doctors/${doc.id}/patients`).onSnapshot((query) => {
          if(query.size>0){
            query.forEach((sub) => {
              const pdata = sub.data();
              // console.log(pdata.diseasedata);
              // console.log(pdata.symptomdisease);
              if(pdata.predictiondata === true){
                accurate++;
              }
              if(pdata.predictiondata === false){
                inaccurate++;
              }

              // console.log(`covid : ${covidpostive},diabetes : ${diabetes}`);


            })
          }
        })
      })
    })

    // console.log(covidpostive);
    setTimeout(() => {
      var myChart = new Chart(aiAcuChart, {
          type: 'doughnut',
          data: {
              labels: ["True Prediction","Not Accurate Prediction"],
              datasets: [{
                  label: 'hello',
                  data: [accurate, inaccurate],
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


    }, 2000);

    //Purple slide
    negative_download.addEventListener('click', (el) => {
      el.preventDefault();
      const rows = [
        ["COVID Negative Image Dataset"]
      ];
      db.collection(`doctors`).onSnapshot((snap) => {
        snap.forEach((doc) => {
          db.collection(`doctors/${doc.id}/patients`).onSnapshot((query) => {
            if(query.size>0){
              query.forEach((sub) => {
                const gdata = sub.data();
                // console.log(pdata.diseasedata);
                // console.log(pdata.symptomdisease);
                if((gdata.diseasedata === "COVID NORMAL" && gdata.predictiondata === true) || (gdata.diseasedata === "COVID POSITIVE" && gdata.predictiondata === false)){
                  rows.push(`[${gdata.imagedata}]`);
                }
                // console.log("Rows Lenght : "+rows.length);
                // console.log(typeof rows);
              })
            }
            // let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
            // var encodedUri = encodeURI(csvContent);
            // var link = document.createElement("a");
            // console.log("link created");
            // // link.style.display = 'none';
            // link.setAttribute("href", encodedUri);
            // link.setAttribute("download", "covid_negative.csv");
            // document.body.appendChild(link); // Required for FF
            //
            // link.click();
          })
        })
      })

      // alert("inside function");
      let downloadCSV = (imgdata) => {
        // alert("inside downloadCSV");
        // console.log(imgdata);
        var result = Object.entries(imgdata);
        // console.log(result[5][1]);
        // var imglinks = [["Covid Negative Image Dataset"]];
        // for (var i = 0; i < result.length; i++) {
        //   imglinks.push(result[i][1]);
        // }
        // console.log(imglinks);
        let csvContent = "data:text/csv;charset=utf-8," + result.map(e => e.join(",")).join("\n");
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        // console.log("link created");
        // link.style.display = 'none';
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "covid_negative.csv");
        document.body.appendChild(link); // Required for FF

        link.click();
      };


      setTimeout(function () {
        downloadCSV(rows);
      }, 1000);

    })

    postive_download.addEventListener('click', (el) => {
      el.preventDefault();
      const rows1 = [
        ["COVID Positive Image Dataset"]
      ];
      db.collection(`doctors`).onSnapshot((snap) => {
        snap.forEach((doc) => {
          db.collection(`doctors/${doc.id}/patients`).onSnapshot((query) => {
            if(query.size>0){
              query.forEach((sub) => {
                const idata = sub.data();
                // console.log(pdata.diseasedata);
                // console.log(pdata.symptomdisease);
                if((idata.diseasedata === "COVID POSITIVE" && idata.predictiondata === true) || (idata.diseasedata === "COVID NORMAL" && idata.predictiondata === false)){
                  rows1.push(`[${idata.imagedata}]`);
                }
                // console.log("Rows Lenght : "+rows.length);
                // console.log(typeof rows);
              })
            }
            // let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
            // var encodedUri = encodeURI(csvContent);
            // var link = document.createElement("a");
            // console.log("link created");
            // // link.style.display = 'none';
            // link.setAttribute("href", encodedUri);
            // link.setAttribute("download", "covid_negative.csv");
            // document.body.appendChild(link); // Required for FF
            //
            // link.click();
          })
        })
      })

      // alert("inside function");
      let downloadCSVPositive = (imgdata1) => {
        // alert("inside downloadCSVPositive");
        // console.log(imgdata);
        var result1 = Object.entries(imgdata1);
        // console.log(result[5][1]);
        // var imglinks = [["Covid Negative Image Dataset"]];
        // for (var i = 0; i < result.length; i++) {
        //   imglinks.push(result[i][1]);
        // }
        // console.log(imglinks);
        let csvContent = "data:text/csv;charset=utf-8," + result1.map(e => e.join(",")).join("\n");
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        // console.log("link created");
        // link.style.display = 'none';
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "covid_positive.csv");
        document.body.appendChild(link); // Required for FF

        link.click();
      };


      setTimeout(function () {
        downloadCSVPositive(rows1);
      }, 1000);

    })



    }

    else{
      alert("You are authorized to view this page!");
      auth.signOut().then(() => {
        window.location="login.html";
      });
    }
  }


  else{
    window.location="login.html";
  }

})
