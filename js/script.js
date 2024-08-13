function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) {
    return null;
  }
  if (!results[2]) {
    return '';
  }
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function initPlanner() {
  const start = getParameterByName('start_date');
  const due = getParameterByName('due_date');
  const start_date = new Date(start);
  const due_date = new Date(due);
  const remaining_time = due_date.getTime() - start_date.getTime();
  const remaining_days = remaining_time / (1000 * 3600 * 24);
  let total_duration = 0;
  const timePerStep = document.querySelectorAll('[assign_calc="field_percent_time_for_step"]');
  timePerStep.forEach(e => {
    e.style.opacity = "0%";
    e.style.fontSize = "0px";
  });
  const stepNames = document.querySelectorAll('[assign_calc="field_step_name"]');
  const stepType = document.querySelectorAll('[assign_calc="step"]');
  const stepResources = document.querySelectorAll('[assign_calc="field_resources"]');
  let percent = 0;
  for (let i = 0; i < timePerStep.length; i++) {
    let currentStepPercent = Number(timePerStep[i].innerText.match(/\d+/g)[0]);
    total_duration += currentStepPercent * 0.01 * remaining_days;
    percent += currentStepPercent;
    let currentStepDuration = Math.round(total_duration);
    let date = new Date(start.replace(/-/g, '/'));
    date.setDate(date.getDate() + currentStepDuration);
    timePerStep[i].innerText += '%';
    stepType[i].insertAdjacentHTML("afterbegin", `<div class="due_date">By ${date.toDateString()}</div>`);
    stepType[i].insertAdjacentHTML("afterbegin", `<p class="step_number">Step ${i+1}</p>`);
    let byDate = [];
    if (date.toDateString()) {
      byDate[i] = date.toDateString();
    }
    let title = [];
    if (stepNames[i]) {
      title[i] = stepNames[i].innerText;
    }
    let description = [];
    if (stepResources[i]) {
      description[i] = stepResources[i].innerText;
    }
    stepType[i].insertAdjacentHTML("beforeend", `
      <div title="Add to Calendar" class="addeventatc">
      Add to Calendar
      <span class="start">${byDate} 04:00 PM</span>
      <span class="end">${byDate} 05:00 PM</span>
      <span class="title">${title[i]}</span>
      <span class="description">${description[i]}</span>
      <span class="client">aMQHlRLgKzfYtmKnBmhx112957</span>
    </div>`)
  }
  document.querySelector('[assign_calc="body"]').parentElement.insertAdjacentHTML('beforebegin',"<p style='display: none; border: 2px solid; border-color: #d3d3d3;padding: 10px 4px 10px 4px;' id='messageText'></p> <div style='display: none' id='stepText'><b>Step Percentage</b>  <label id='switchButton' class='switch'>  <input type='checkbox' id='btnPercent'>   <span class='slider round'></span> </label></div> <br>");
  if (timePerStep.length > 0) {
    stepType[timePerStep.length - 1].insertAdjacentHTML('afterend',"<button id='btnPrint' style='margin-left: 0' title='' class='button' onclick=''>Print Schedule</button> <a id='btnContact' href='contact/assignment_planner_feedback'><button  title='' class='button' >Send Us Feedback</button></a>");
    document.getElementById('btnPrint').onclick = () => {
      let links = document.getElementsByTagName('link');
      let printWindow = window.open('', '', 'height=400,width=800');
      printWindow.document.write('<html>');
      for (let i in links) {
        if (links[i].rel == 'stylesheet') {
          printWindow.document.write(links[i].outerHTML);
        }
      }
      printWindow.document.write('<head><title></title></head><body>');
      printWindow.document.write(document.querySelector('[assign_calc="body"]').parentElement.innerHTML);
      printWindow.document.write('</body></html>');
      printWindow.document.querySelectorAll('#btnPrint, .addeventatc, #btnContact').forEach(e => e.remove());
      printWindow.document.querySelectorAll('.due_date').forEach(e => e.style= "border: 1px solid black; ");
      printWindow.document.querySelectorAll('[assign_calc="field_step_name"]').forEach(e => e.style= "min-height:4em;font-size:1.5em;font-weight:bold;border-top:2px solid black;padding:1.5em;");
      printWindow.document.close();

      printWindow.document.body.onload = () => {
        setTimeout(() => printWindow.print(), 500);
      }
    }
  }

  document.getElementById('btnPercent').onchange = () => {
    if (!document.getElementById('btnPercent').checked) {
      timePerStep.forEach(e => {
        e.style.opacity = "0%";
        e.style.fontSize = "0px";
      });
      return;
    }
    timePerStep.forEach(e => {
      e.style.opacity = "100%";
      e.style.fontSize = "14px";
    });
  }

  let hyperlinks = document.querySelector('[assign_calc="body"]').parentElement.getElementsByTagName('a');
  for (let i in hyperlinks) {
    if (hyperlinks[i].id == 'btnContact') {
      break;
    }
    hyperlinks[i].style.fontWeight = 'bold';
  }

  document.getElementById('stepText').style.display = '';
  document.getElementById('messageText').style.display = '';
  document.getElementById('messageText').innerHTML = 'Your schedule is from <b>' + start_date.getFullYear() + "-" + (parseInt(start_date.getMonth()) + 1) + "-" + (parseInt(start_date.getDate()) + 1) + '</b> to <b>' + due_date.getFullYear() + "-" + (parseInt(due_date.getMonth()) + 1) + "-" + (parseInt(due_date.getDate()) + 1) + '</b><br>You have <b>' + Math.round(total_duration) + '</b> day(s) to finish</b><br>';
}

(function ($, Drupal, drupalSettings) {
  if (getParameterByName('process') === 'planning') {
    initPlanner();
  }
})(jQuery, Drupal, drupalSettings);