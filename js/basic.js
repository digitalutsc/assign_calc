
function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const start = getParameterByName('start_date');
const due = getParameterByName('due_date');
var date1 = new Date(start);
var date2 = new Date(due);
const diff = date2.getTime() - date1.getTime();
const duration = diff / (1000 * 3600 * 24);
let sumDuration = 0;
const para = document.querySelectorAll("div.field__items > div.field__item");
const steps = document.querySelectorAll("div.field--name-field-percent-time-for-step");
//Setting percentages to not appear by default
percent=document.querySelectorAll(".field--name-field-percent-time-for-step");
percent.forEach(e => e.style.opacity="0%");
percent.forEach(e => e.style.fontSize="0px");
const dueDate = document.querySelectorAll("div.field--name-field-due-date");
const stepName = document.querySelectorAll("div.field--name-field-step-name");
const typeStep = document.querySelectorAll("div.paragraph--type--step");
const resources = document.querySelectorAll("div.field--name-field-resources");
let pers = 0;
let count=-1;
for (let i = 0; i < steps.length; i++) {
  count++;
  let partDuration = Number(steps[i].querySelector("div.field__item").innerText.match(/\d+/g)[0]) * 0.01 * duration
  pers = Number(steps[i].querySelector("div.field__item").innerText) + pers
  sumDuration = sumDuration + partDuration
  let stepDur = Math.round(sumDuration)
  var date = new Date(start.replace(/-/g, '/'));
  date.setDate(date.getDate() + (stepDur));
  typeStep[i].insertAdjacentHTML("afterbegin", `<div class="due_date">By ${date.toDateString()}</div>`);
  typeStep[i].insertAdjacentHTML("afterbegin", `<p class="step_number">Step ${i+1}</p>`);
  let byDate = []
  if(date.toDateString()){
    byDate[i] = date.toDateString()
    console.log(byDate[i])
  }
  let title = []
  if(stepName[i]){
    title[i] = stepName[i].innerText
  }
  let description = []
  if(resources[i]){
    description[i] = resources[i].innerText
  }
  typeStep[i].insertAdjacentHTML("beforeend", `
    <div title="Add to Calendar" class="addeventatc">
    Add to Calendar
    <span class="start">${byDate}  04:00 PM</span>
    <span class="end">${byDate} 05:00 PM</span>
    <span class="title">${title[i]}</span>
    <span class="description">${description[i]}</span>
    <span class="client">aMQHlRLgKzfYtmKnBmhx112957</span>
  </div>`)
}

//Adding print and contact buttons
document.getElementById('block-dsu-content').insertAdjacentHTML('beforebegin',"<p style='display: none; border: 2px solid; border-color: #d3d3d3;padding: 10px 4px 10px 4px;' id='messageText'></p> <div style='display: none' id='stepText'><b>Step Percentage</b>  <label id='switchButton' class='switch'>  <input type='checkbox' id='btnPercent'>   <span class='slider round'></span> </label></div> <br>");
if (count!=-1){
typeStep[count].insertAdjacentHTML('afterend',"<button id='btnPrint' style='margin-left: 0' title='' class='button' onclick=''>Print Schedule</button> <a id='btnContact' href='contact/assignment_planner_feedback'><button  title='' class='button' >Contact Us</button></a>");
}

//Toggling view of percentages
document.getElementById('btnPercent').onchange=function(){
  //steps=document.querySelectorAll(".field--name-field-percent-time-for-step");
  if (!document.getElementById('btnPercent').checked){
    percent.forEach(e => e.style.opacity="0%");
    percent.forEach(e => e.style.fontSize="0px");
  }
  else{
    percent.forEach(e => e.style.opacity="100%");
    percent.forEach(e => e.style.fontSize="14px");
  }
}

//Onclick handles creation and formatting of new window, and then calls to print once the window loads<link rel="stylesheet" media="all" href="/drupal/sites/default/files/css/css_sLUfGdGnfcQ6cCkPp5wDJzcsBPn8fKmoo_949hKEH0k.css"><link rel="stylesheet" media="screen" href="/drupal/sites/default/files/css/css_u4V41heglsayYslETOtLFTnSh16kC9YPM15eokMNuN0.css"><link rel="stylesheet" media="all" href="/drupal/sites/default/files/css/css_baXCUkBDahZTRQIK_wBsOgAzoYW6-qhtHUFKSdAZ8_E.css"><link rel="stylesheet" media="all" href="/drupal/sites/default/files/css/css_jedXRUJ7t2_HeVoq1wqQ4JtoaEWrvUmwKB-jeh3pFS8.css">
document.getElementById("btnPrint").onclick=function () {
  links =document.getElementsByTagName('link')
  var printWindow = window.open('', '', 'height=400,width=800');
  printWindow.document.write('<html>    ');

  //copying all stylesheets to new window, for CSS formatting
  for(link in links){
    if (links[link].rel=="stylesheet"){
      printWindow.document.write(links[link].outerHTML);
    }
  }
  printWindow.document.write('<head><title></title></head><body >');
  printWindow.document.write(document.getElementById('block-dsu-content').innerHTML);
  printWindow.document.write('</body></html>');
  printWindow.document.querySelectorAll('#btnPrint, .addeventatc, #btnContact').forEach(e => e.remove());
  printWindow.document.querySelectorAll('.due_date').forEach(e => e.style= "border: 1px solid black; ");
  
  printWindow.document.querySelectorAll('.field.field--name-field-step-name.field--type-string.field--label-hidden.field__item').forEach(e => e.style= "min-height:4em;font-size:1.5em;font-weight:bold;border-top:2px solid black;padding:1.5em;");
  
  printWindow.document.close();

  printWindow.onload=function(){printWindow.print();};

};
(function ($, Drupal, drupalSettings) {
  if($('body').is('.page-node-type-assignment')){
    const messages = new Drupal.Message();
   // messages.add('You have '+ Math.round(sumDuration)+' day(s) to finish');
   document.getElementById('stepText').style.display="";
    document.getElementById('messageText').style.display="";
    document.getElementById('messageText').innerHTML='Your schedule is from <b>'+date1.getFullYear()+"-"+(parseInt(date1.getMonth())+1)+"-"+(parseInt(date1.getDate())+1)+'</b> to <b>'+date2.getFullYear()+"-"+(parseInt(date2.getMonth())+1)+"-"+(parseInt(date2.getDate())+1)+'</b><br>You have <b>'+ Math.round(sumDuration)+'</b> day(s) to finish</b><br>';
    if (pers !== 100) {
      messages.add('Total percentage of time must be 100%.')
    }
  }
  else{
    document.getElementById('stepText').style.display="none";
    document.getElementById('messageText').style.display="none";
  }
})(jQuery, Drupal, drupalSettings);

