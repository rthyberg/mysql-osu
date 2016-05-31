 document.addEventListener('DOMContentLoaded', bindSubmit);

 function deleteTable() {
     // set up table with new elements
     var myNode = document.getElementById("woTable");
     while (myNode.firstChild) {
         myNode.removeChild(myNode.firstChild);
     }
 }

 function getData() {
     var getRows = new XMLHttpRequest();
     getRows.open("GET", "http://52.38.65.142:3000/getdata?", true);
     getRows.addEventListener('load', function() {
         if (getRows.status >= 200 && getRows.status < 400) {
             console.log("yes");
             var jsonTbl = JSON.parse(getRows.responseText);
             deleteTable();
             buildTable(jsonTbl);
         } else {
             console.log("fail to get data:" + getRows.status);
         }
     });
     getRows.send(null);
 }
 getData();

 function buildTable(data) {
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
     var tr_but = [];
     var tr_ed = [];
     for (item in data) {
         // create row
         tr[item] = document.createElement("tr");
         tr[item].id = "row" + data[item].id;
         // show data
         tr_name[item] = document.createElement("td");
         tr_name[item].textContent = data[item].name;
         tr_name[item].id = "name" + data[item].id;
         tr_reps[item] = document.createElement("td");
         tr_reps[item].textContent = data[item].reps;
         tr_reps[item].id = "reps" + data[item].id;
         tr_weight[item] = document.createElement("td");
         tr_weight[item].textContent = data[item].weight;
         tr_weight[item].id = "weight" + data[item].id;
         tr_date[item] = document.createElement("td");
         tr_date[item].textContent = data[item].date;
         tr_date[item].id = "date" + data[item].id;
         tr_lbs[item] = document.createElement("td");
         tr_lbs[item].textContent = data[item].lbs;
         tr_lbs[item].id = "lbs" + data[item].id;
         // create delete button
         tr_but[item] = document.createElement("td");
         tr_but[item].delete = document.createElement("button");
         tr_but[item].delete.textContent = "Delete";
         tr_but[item].delete.id = "delete" + data[item].id;
         tr_but[item].delete.setAttribute("type", "hidden");
         tr_but[item].delete.setAttribute("name", "deleteButton");
         tr_but[item].delete.setAttribute("value", data[item].id);
         tr_but[item].appendChild(tr_but[item].delete);
         // create edit button
         tr_ed[item] = document.createElement("td");
         tr_ed[item].edit = document.createElement("button");
         tr_ed[item].edit.textContent = "Edit";
         tr_ed[item].edit.id = "edit" + item;
         tr_ed[item].edit.setAttribute("type", "hidden");
         tr_ed[item].edit.setAttribute("name", "editButton");
         tr_ed[item].edit.setAttribute("value", data[item].id);
         tr_ed[item].appendChild(tr_ed[item].edit);
         // add to table row
         tr[item].appendChild(tr_name[item]);
         tr[item].appendChild(tr_reps[item]);
         tr[item].appendChild(tr_weight[item]);
         tr[item].appendChild(tr_date[item]);
         tr[item].appendChild(tr_lbs[item]);
         tr[item].appendChild(tr_but[item]);
         tr[item].appendChild(tr_ed[item]);
         // add to table
         document.getElementById("woTable").appendChild(tr[item]);
         document.getElementById(tr_but[item].delete.id).addEventListener('click',
             function(event) {
                 //console.log(event.target.value);
                 var delReq = new XMLHttpRequest();
                 delReq.open("GET", "http://52.38.65.142:3000/delete?row_id=" + event.target.value, true);
                 delReq.addEventListener('load', function() {
                     if (delReq.status >= 200 && delReq.status < 400) {
                         getData();
                     } else {
                         console.log("failed to delete data:" + delReq.status);
                     }
                 });
                 delReq.send(null);
                 event.preventDefault();
             });
         document.getElementById(tr_ed[item].edit.id).addEventListener('click',
             function(event) {
                 var inputs = [];
                 var items = ["name", "reps", "weight", "date", "lbs"];
                 var tbl_row = [];
                 for (name in items) {
                     tbl_row[name] = document.createElement("td");
                     inputs[name] = document.createElement("input");
                     inputs[name].id = items[name] + event.target.value;
                     //console.log(inputs[name].id);
                     inputs[name].setAttribute("type", "text");
                     inputs[name].setAttribute("name", items[name]);
                     inputs[name].setAttribute("value", document.getElementById(items[name] + event.target.value).innerText);
                     tbl_row[name].appendChild(inputs[name]);
                 }
                 var row = document.getElementById("row" + event.target.value);
                 while (row.firstChild) {
                     row.removeChild(row.firstChild);
                 }
                 for (name in items) {
                     row.appendChild(tbl_row[name]);
                 }
                 var button = document.createElement("button")
                 button.setAttribute("type", "hidden");
                 button.setAttribute("name", "editSubmit");
                 button.setAttribute("value", event.target.value);
                 button.textContent = "save";
                 row.appendChild(button);
                 button.addEventListener("click",
                     function(event) {
                         var edReq = new XMLHttpRequest()
                         var upname = document.getElementById("name"+event.target.value).value;
                         var upreps = document.getElementById("reps"+event.target.value).value;
                         var upweight = document.getElementById("weight"+event.target.value).value;
                         var update = document.getElementById("date"+event.target.value).value;
                         var uplbs = document.getElementById("lbs"+event.target.value).value;
                         edReq.open("GET", "http://52.38.65.142:3000/simple-update?row_id=" + event.target.value
                                   +"&name="+upname+"&reps="+upreps+"&weight="+upweight+"&date="+update+"&lbs="+uplbs, true);
                         edReq.addEventListener('load', function() {
                                 if(edReq.status >= 200 && edReq.status < 400) {
                                    getData();
                                 } else {
                                         console.log("error in updating table data: " +edReq.status);
                                 }
                         });
                         edReq.send(null);
                         event.preventDefault();
                     });
             });
     }
 }

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
                 getData();
                 // set up table with new elements
             } else {
                 console.log("Error in request:" + req.status);
             }
         });
         req.send(null);
         event.preventDefault();
     });
 }
