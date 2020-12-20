console.log("Admin JS Loaded");

var tokentable = document.querySelector('#tokentable');

db.collection(`fcm`).orderBy('timestamp','desc').onSnapshot(snap => {
  console.log(snap.size);
  snap.forEach(doc => {
    const data = doc.data();
    console.log(data.token);

    var html = `
    <tr>
        <td>${data.email}</td>
        <td id="userKey">
          ${data.token}
        </td>
        <td><button class="btn waves-effect waves-light blue" id=${data.token} onclick="sendtoken(this)">Send</button></td>
    </tr>
    `;
    tokentable.innerHTML+=html;
  })
})

// https://us-central1-pdpu-medical-website.cloudfunctions.net/FCM
// http://us-central1-pdpu-medical-website.cloudfunctions.net/FCM?token=

let sendtoken = (el) => {
  console.log("Token Clicked : "+el.id);
  const destUrl = `https://us-central1-pdpu-medical-website.cloudfunctions.net/FCM?token=${el.id}`;
  // var emailSend = document.createElement('a');
  // emailSend.setAttribute("href",destUrl);
  // document.body.appendChild(emailSend);
  // console.log("Element Created");
  // emailSend.click();
  // document.location.href = destUrl;
  fetch(destUrl).then((snap) => {

    console.log("Fetch success "+snap);

  }).catch((err) => {console.log("Error while fetching URL");});
}

  // function(response) {
  //   if (response.status === 200) {
  //     console.log('Looks like there was no problem. Status Code: ' +
  //       response.status);
  //     return;
  //       }
  //     }
  //   )
  //   .catch(function(err) {
  //     console.log('Fetch Error :-', err);
  //   });

// )};
