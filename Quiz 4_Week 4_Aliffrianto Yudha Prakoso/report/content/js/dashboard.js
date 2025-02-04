/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 57.5, "KoPercent": 42.5};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.29, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Add User - 5"], "isController": false}, {"data": [0.0, 500, 1500, "Add User - 3"], "isController": false}, {"data": [0.0, 500, 1500, "Add User - 4"], "isController": false}, {"data": [0.0, 500, 1500, "Add User - 1"], "isController": false}, {"data": [0.0, 500, 1500, "Add User - 2"], "isController": false}, {"data": [0.0, 500, 1500, "Get User Profile - 5"], "isController": false}, {"data": [0.0, 500, 1500, "LogOut User - 1"], "isController": false}, {"data": [0.0, 500, 1500, "Contact_Request - 1"], "isController": true}, {"data": [0.0, 500, 1500, "Contact_Request - 2"], "isController": true}, {"data": [0.0, 500, 1500, "Contact_Request - 3"], "isController": true}, {"data": [0.5, 500, 1500, "Get Contact List - 4"], "isController": false}, {"data": [0.0, 500, 1500, "Users_Request - 3"], "isController": true}, {"data": [0.5, 500, 1500, "Get Contact List - 3"], "isController": false}, {"data": [0.0, 500, 1500, "Contact_Request - 4"], "isController": true}, {"data": [0.0, 500, 1500, "Users_Request - 4"], "isController": true}, {"data": [0.0, 500, 1500, "Contact_Request - 5"], "isController": true}, {"data": [0.0, 500, 1500, "Users_Request - 5"], "isController": true}, {"data": [0.5, 500, 1500, "Get Contact List - 5"], "isController": false}, {"data": [0.5, 500, 1500, "Get Contact List - 2"], "isController": false}, {"data": [0.0, 500, 1500, "Users_Request - 1"], "isController": true}, {"data": [0.5, 500, 1500, "Get Contact List - 1"], "isController": false}, {"data": [0.0, 500, 1500, "Users_Request - 2"], "isController": true}, {"data": [0.0, 500, 1500, "LogOut User - 4"], "isController": false}, {"data": [0.0, 500, 1500, "LogOut User - 5"], "isController": false}, {"data": [1.0, 500, 1500, "LogOut User - 2"], "isController": false}, {"data": [0.0, 500, 1500, "LogOut User - 3"], "isController": false}, {"data": [0.0, 500, 1500, "Get User Profile - 4"], "isController": false}, {"data": [0.0, 500, 1500, "Get User Profile - 3"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Profile - 2"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Profile - 1"], "isController": false}, {"data": [1.0, 500, 1500, "Add Contact - 2"], "isController": false}, {"data": [1.0, 500, 1500, "Add Contact - 3"], "isController": false}, {"data": [1.0, 500, 1500, "Add Contact - 4"], "isController": false}, {"data": [1.0, 500, 1500, "Add Contact - 5"], "isController": false}, {"data": [0.5, 500, 1500, "AUTH Request - 2"], "isController": false}, {"data": [0.5, 500, 1500, "AUTH Request - 3"], "isController": false}, {"data": [0.0, 500, 1500, "AUTH Request - 1"], "isController": false}, {"data": [1.0, 500, 1500, "Add Contact - 1"], "isController": false}, {"data": [0.0, 500, 1500, "Update User - 1"], "isController": false}, {"data": [1.0, 500, 1500, "Update User - 2"], "isController": false}, {"data": [0.0, 500, 1500, "Update User - 3"], "isController": false}, {"data": [0.0, 500, 1500, "Update User - 4"], "isController": false}, {"data": [0.0, 500, 1500, "Update User - 5"], "isController": false}, {"data": [0.0, 500, 1500, "AUTH Request - 4"], "isController": false}, {"data": [0.0, 500, 1500, "AUTH Request - 5"], "isController": false}, {"data": [0.5, 500, 1500, "Get Contact - 5"], "isController": false}, {"data": [0.0, 500, 1500, "Get Contact - 4"], "isController": false}, {"data": [0.5, 500, 1500, "Get Contact - 3"], "isController": false}, {"data": [0.5, 500, 1500, "Get Contact - 2"], "isController": false}, {"data": [0.5, 500, 1500, "Get Contact - 1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 40, 17, 42.5, 591.8, 253, 2337, 297.5, 1457.2999999999997, 2035.4999999999989, 2337.0, 6.807351940095303, 32.23071737789312, 3.826974929799183], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Add User - 5", 1, 1, 100.0, 298.0, 298, 298, 298.0, 298.0, 298.0, 298.0, 3.3557046979865772, 2.631475461409396, 2.2087353187919465], "isController": false}, {"data": ["Add User - 3", 1, 1, 100.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 289.0, 3.4602076124567476, 2.7134245242214536, 2.2775194636678204], "isController": false}, {"data": ["Add User - 4", 1, 1, 100.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 2.6492557010135136, 2.223659206081081], "isController": false}, {"data": ["Add User - 1", 1, 1, 100.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 2.9591686320754715, 2.4837853773584904], "isController": false}, {"data": ["Add User - 2", 1, 1, 100.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 2.9260436100746268, 2.4559818097014925], "isController": false}, {"data": ["Get User Profile - 5", 1, 1, 100.0, 310.0, 310, 310, 310.0, 310.0, 310.0, 310.0, 3.225806451612903, 2.4792086693548385, 1.5877016129032258], "isController": false}, {"data": ["LogOut User - 1", 1, 1, 100.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 3.0292585784313726, 2.144607843137255], "isController": false}, {"data": ["Contact_Request - 1", 1, 0, 0.0, 1682.0, 1682, 1682, 1682.0, 1682.0, 1682.0, 1682.0, 0.5945303210463733, 21.741579035374556, 1.1257756762782403], "isController": true}, {"data": ["Contact_Request - 2", 1, 0, 0.0, 1740.0, 1740, 1740, 1740.0, 1740.0, 1740.0, 1740.0, 0.5747126436781609, 20.675624102011493, 1.0882498204022988], "isController": true}, {"data": ["Contact_Request - 3", 1, 0, 0.0, 2274.0, 2274, 2274, 2274.0, 2274.0, 2274.0, 2274.0, 0.43975373790677225, 16.344323741204924, 0.832697751759015], "isController": true}, {"data": ["Get Contact List - 4", 1, 0, 0.0, 1217.0, 1217, 1217, 1217.0, 1217.0, 1217.0, 1217.0, 0.8216926869350862, 15.092986082580113, 0.43010476581758417], "isController": false}, {"data": ["Users_Request - 3", 1, 1, 100.0, 1119.0, 1119, 1119, 1119.0, 1119.0, 1119.0, 1119.0, 0.8936550491510277, 2.7682361483467384, 2.0569774910634497], "isController": true}, {"data": ["Get Contact List - 3", 1, 0, 0.0, 1010.0, 1010, 1010, 1010.0, 1010.0, 1010.0, 1010.0, 0.9900990099009901, 17.590694616336634, 0.5182549504950495], "isController": false}, {"data": ["Contact_Request - 4", 1, 1, 100.0, 1746.0, 1746, 1746, 1746.0, 1746.0, 1746.0, 1746.0, 0.5727376861397481, 11.555989583333334, 1.0845101302978235], "isController": true}, {"data": ["Users_Request - 4", 1, 1, 100.0, 1193.0, 1193, 1193, 1193.0, 1193.0, 1193.0, 1193.0, 0.8382229673093042, 2.589977996647108, 1.9293862636211232], "isController": true}, {"data": ["Contact_Request - 5", 1, 0, 0.0, 1725.0, 1725, 1725, 1725.0, 1725.0, 1725.0, 1725.0, 0.5797101449275363, 21.897078804347824, 1.0977128623188406], "isController": true}, {"data": ["Users_Request - 5", 1, 1, 100.0, 1144.0, 1144, 1144, 1144.0, 1144.0, 1144.0, 1144.0, 0.8741258741258742, 2.700912368881119, 2.0120260598776225], "isController": true}, {"data": ["Get Contact List - 5", 1, 0, 0.0, 746.0, 746, 746, 746.0, 746.0, 746.0, 746.0, 1.3404825737265416, 24.622203837131366, 0.7016588471849866], "isController": false}, {"data": ["Get Contact List - 2", 1, 0, 0.0, 758.0, 758, 758, 758.0, 758.0, 758.0, 758.0, 1.3192612137203166, 22.655476995382585, 0.6905507915567283], "isController": false}, {"data": ["Users_Request - 1", 1, 1, 100.0, 1081.0, 1081, 1081, 1081.0, 1081.0, 1081.0, 1081.0, 0.9250693802035153, 2.934204440333025, 2.175358464384829], "isController": true}, {"data": ["Get Contact List - 1", 1, 0, 0.0, 721.0, 721, 721, 721.0, 721.0, 721.0, 721.0, 1.3869625520110958, 24.64161104368932, 0.7259882108183079], "isController": false}, {"data": ["Users_Request - 2", 1, 1, 100.0, 1117.0, 1117, 1117, 1117.0, 1117.0, 1117.0, 1117.0, 0.8952551477170994, 2.787181065353626, 2.1052484333034913], "isController": true}, {"data": ["LogOut User - 4", 1, 1, 100.0, 309.0, 309, 309, 309.0, 309.0, 309.0, 309.0, 3.236245954692557, 2.487231998381877, 1.7698220064724919], "isController": false}, {"data": ["LogOut User - 5", 1, 1, 100.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 2.7448381696428568, 1.9531249999999998], "isController": false}, {"data": ["LogOut User - 2", 1, 0, 0.0, 319.0, 319, 319, 319.0, 319.0, 319.0, 319.0, 3.134796238244514, 2.017412813479624, 1.7143416927899686], "isController": false}, {"data": ["LogOut User - 3", 1, 1, 100.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 2.5618489583333335, 1.8229166666666667], "isController": false}, {"data": ["Get User Profile - 4", 1, 1, 100.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 2.5618489583333335, 1.640625], "isController": false}, {"data": ["Get User Profile - 3", 1, 1, 100.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 2.9039884868421053, 1.850328947368421], "isController": false}, {"data": ["Get User Profile - 2", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 3.241436298076923, 1.893028846153846], "isController": false}, {"data": ["Get User Profile - 1", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 3.10986508302583, 1.816190036900369], "isController": false}, {"data": ["Add Contact - 2", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 3.4886626683501687, 2.8474852693602695], "isController": false}, {"data": ["Add Contact - 3", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 3.8089541051660514, 3.12067573800738], "isController": false}, {"data": ["Add Contact - 4", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 3.754104393115942, 3.0641417572463765], "isController": false}, {"data": ["Add Contact - 5", 1, 0, 0.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 289.0, 3.4602076124567476, 3.58523464532872, 2.9263083910034604], "isController": false}, {"data": ["AUTH Request - 2", 1, 0, 0.0, 1184.0, 1184, 1184, 1184.0, 1184.0, 1184.0, 1184.0, 0.8445945945945946, 1.0425464527027029, 0.23836702913851351], "isController": false}, {"data": ["AUTH Request - 3", 1, 0, 0.0, 1484.0, 1484, 1484, 1484.0, 1484.0, 1484.0, 1484.0, 0.6738544474393532, 0.8317890835579514, 0.19017962432614555], "isController": false}, {"data": ["AUTH Request - 1", 1, 0, 0.0, 1798.0, 1798, 1798, 1798.0, 1798.0, 1798.0, 1798.0, 0.5561735261401557, 0.6865266963292547, 0.15696694243604004], "isController": false}, {"data": ["Add Contact - 1", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 3.6474436837455833, 2.9883502650176683], "isController": false}, {"data": ["Update User - 1", 1, 1, 100.0, 290.0, 290, 290, 290.0, 290.0, 290.0, 290.0, 3.4482758620689653, 2.663658405172414, 2.2561961206896552], "isController": false}, {"data": ["Update User - 2", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 3.1213831018518516, 2.423321759259259], "isController": false}, {"data": ["Update User - 3", 1, 1, 100.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 2.925988399621212, 2.289743134469697], "isController": false}, {"data": ["Update User - 4", 1, 1, 100.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 2.668592664930556, 2.0989312065972223], "isController": false}, {"data": ["Update User - 5", 1, 1, 100.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 3.002166748046875, 2.361297607421875], "isController": false}, {"data": ["AUTH Request - 4", 1, 0, 0.0, 2337.0, 2337, 2337, 2337.0, 2337.0, 2337.0, 2337.0, 0.4278990158322636, 0.5265163671373555, 0.12076446833547282], "isController": false}, {"data": ["AUTH Request - 5", 1, 0, 0.0, 2048.0, 2048, 2048, 2048.0, 2048.0, 2048.0, 2048.0, 0.48828125, 0.6008148193359375, 0.13780593872070312], "isController": false}, {"data": ["Get Contact - 5", 1, 0, 0.0, 690.0, 690, 690, 690.0, 690.0, 690.0, 690.0, 1.4492753623188406, 26.620527626811597, 0.7600203804347827], "isController": false}, {"data": ["Get Contact - 4", 1, 1, 100.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 3.0532052865612647, 2.072782855731225], "isController": false}, {"data": ["Get Contact - 3", 1, 0, 0.0, 993.0, 993, 993, 993.0, 993.0, 993.0, 993.0, 1.0070493454179255, 18.497647595669687, 0.5281108383685801], "isController": false}, {"data": ["Get Contact - 2", 1, 0, 0.0, 685.0, 685, 685, 685.0, 685.0, 685.0, 685.0, 1.4598540145985401, 25.936644616788318, 0.7655679744525546], "isController": false}, {"data": ["Get Contact - 1", 1, 0, 0.0, 678.0, 678, 678, 678.0, 678.0, 678.0, 678.0, 1.4749262536873156, 26.210188514011797, 0.7734720685840707], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 5, 29.41176470588235, 12.5], "isController": false}, {"data": ["401/Unauthorized", 12, 70.58823529411765, 30.0], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 40, 17, "401/Unauthorized", 12, "400/Bad Request", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Add User - 5", 1, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Add User - 3", 1, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Add User - 4", 1, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Add User - 1", 1, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Add User - 2", 1, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get User Profile - 5", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LogOut User - 1", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["LogOut User - 4", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LogOut User - 5", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["LogOut User - 3", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get User Profile - 4", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get User Profile - 3", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Update User - 1", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Update User - 3", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Update User - 4", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Update User - 5", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get Contact - 4", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
