 document.addEventListener('DOMContentLoaded', bindSubmit);

 function buildTable(data) {
     // set up table with new elements
     var tableJson;
     var woTable = document.createElement('tr');
     var th_name = document.createElement('th');
     th_name.textContent = "name";
     var th_reps = document.createElement('th');
     th_reps.textContent = "reps";
     var th_weight = document.createElement('th');
     th_weight.textContent = "weight";
     var th_date = document.createElement('th');
     th_date.textContent = "date";
     var th_lbs = document.createElement('th');
     th_lbs.textContent = "lbs";
     woTable.appendChild(th_name);
     woTable.appendChild(th_reps);
     woTable.appendChild(th_weight);
     woTable.appendChild(th_date);
     woTable.appendChild(th_lbs);
     document.getElementById("woTable").appendChild(woTable);
     var tr = [];
     var tr_name = [];
     var tr_reps = [];
     var tr_weight = [];
     var tr_date = [];
     var tr_lbs = [];
     for (item in data) {
         console.log(data[item].name);
         tr[item] = document.createElement("tr");
         tr_name[item] = document.createElement("td");
         tr_name[item].textContent = data[item].name
         tr_reps[item] = document.createElement("td");
         tr_reps[item].textContent = data[item].reps;
         tr_weight[item] = document.createElement("td");
         tr_weight[item].textContent = data[item].weight;
         tr_date[item] = document.createElement("td");
         tr_date[item].textContent = data[item].date;
         tr_lbs[item] = document.createElement("td");
         tr_lbs[item].textContent = data[item].lbs;
         tr[item].appendChild(tr_name[item]);
         tr[item].appendChild(tr_reps[item]);
         tr[item].appendChild(tr_weight[item]);
         tr[item].appendChild(tr_date[item]);
         tr[item].appendChild(tr_lbs[item]);
         document.getElementById("woTable").appendChild(tr[item]);
     }
     console.log(data);
 }

 function getData() {
     var getRows = new XMLHttpRequest();
     getRows.open("GET", "http://52.38.65.142:3000/getdata?", true);
     console.log("did getData work?");
     getRows.addEventListener('load', function() {
         if (getRows.status >= 200 && getRows.status < 400) {
             console.log("yes");
             var jsonTbl = JSON.parse(getRows.responseText);
             console.log(jsonTbl);
             buildTable(jsonTbl);
         } else {
             console.log("fail to get data:" + getRows.status);
         }
     });
     getRows.send(null);
 }
 getData();

 function bindSubmit() {
     document.getElementById('tableSubmit').addEventListener('click', function(event) {
         var req = new XMLHttpRequest();
         var work = {
             name: null,
             reps: null,
             weight: null,
             date: null,
             lbs: null
         };
         work.name = document.getElementById('name').value;
         work.reps = document.getElementById('reps').value;
         work.weight = document.getElementById('weight').value;
         work.date = document.getElementById('date').value;
         work.lbs = document.getElementById('lbs').value;
         req.open("GET",
             "http://52.38.65.142:3000/insert?name=" + work.name + "&reps=" + work.reps +
             "&weight=" + work.weight + "&date=" + work.date + "&lbs=" + work.lbs,
             true);
         req.addEventListener('load', function() {
             if (req.status >= 200 && req.status < 400) {
                 var workObj = JSON.parse(req.responseText);
                 console.log(workObj);
                 // set up table with new elements
             } else {
                 console.log("Error in request:" + req.status);
             }
         });
         req.send(null);
         event.preventDefault();
     });
 }
