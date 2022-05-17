// references 2 additional files in the same folder
// one for reference/protected variables
// one for importJSON ...  Copyright:    (c) 2012 by Trevor Lohrbeer
// custom menu
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Zoom Stats')
      .addItem('Get Meeting Info','displayParticipants')
      .addToUi();
}
 
function zapi(mtg){
  uri="https://api.zoom.us/v2/report/meetings/"+mtg+"/participants?page_size="+PGSZ;
  
  options = {
    Method: 'get',
    headers: { 'Authorization': 'Bearer' +ZTOK},
    contentType: 'application/json',
    qs: {'page_size':PGSZ},
  };
  var response = UrlFetchApp.fetch(uri, options);
//  Logger.log(parts_url.getContentText());
  var json = response.getContentText();
  //Logger.log(json);
  return JSON.parse(json);
}

function displayParticipants(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var artist = sheet.getRange(MTGx,MTGy).getValue();
  
//  var tracks = calliTunesAPI(artist);
  var parts  = zapi(MEETING);
  
  var results = parts["participants"];
  
  var output = [];
  
  results.forEach(function(elem,i) {
    var dtJoin = elem["join_time"];
    var lJoin = new Date(dtJoin);

    var dtLeave = elem["leave_time"];
    var lLeave = new Date(dtLeave);

    var durn = elem["duration"]/60;
    var aNm = elem["name"];
    if (!isNaN(aNm)){
      aNm=+aNm-10000000000;
    }

    output.push([aNm, elem["user_email"],elem["user_id"],elem["id"],lJoin,lJoin,lLeave,durn.toFixed(0)]);
    sheet.setRowHeight(i+9,21);
    // elem.unshift(i + 1);
  });

  Logger.log(output);
  var sortedOutput = output.sort( function(a,b) {
    
    var albumA = (a[4]) ? a[4] : 'Not known';
    var albumB = (b[4]) ? b[4] : 'Not known';
    
    if (albumA < albumB) {
      return -1;
    }
    else if (albumA > albumB) {
      return 1;
    }
    // names are equal
    return 0;
  });

  // adds an index number to the array
  sortedOutput.forEach(function(elem,i) {
    elem.unshift(i + 1);
    //Logger.log(elem);
  });
  
  var len = sortedOutput.length;
  
  // clear any previous content
  sheet.getRange(9,1,len+1,9).clearContent();
  
  // paste in the values
  sheet.getRange(9,1,len,9).setValues(sortedOutput);
  
};
