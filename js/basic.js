function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
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
const dueDate = document.querySelectorAll("div.field--name-field-due-date");
const stepName = document.querySelectorAll("div.field--name-field-step-name");
const typeStep = document.querySelectorAll("div.paragraph--type--step");
const resources = document.querySelectorAll("div.field--name-field-resources");
let pers = 0;
for (let i = 0; i < steps.length; i++) {
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
(function ($, Drupal, drupalSettings) {
  if($('body').is('.page-node-type-assignment')){
    const messages = new Drupal.Message();
    messages.add('You have '+ Math.round(sumDuration)+' days to finish');
    if (pers !== 100) {
      messages.add('Total percentage of time must be 100%.')
    }
  }
})(jQuery, Drupal, drupalSettings);

