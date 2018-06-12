
var client;

$(function() {
    //$('.select2').select2({ minimumResultsForSearch: -1 });
    //$('.select2').css('width', '100%');
    $('#navbar-host-input').on('blur', changeServer);
    $('#navbar-port-input').on('blur', changeServer);
    changeServer();
    listActiveExpectations();
    $("#o3e a").on("click", function(){$("#o3b").text($(this).text())});
    $("#t2e a").on("click", function(){$("#t2b").text($(this).text())});
});

function changeServer() {
    client = mockServerClient(
        $('#navbar-host-input').val(),
        $('#navbar-port-input').val());
}

//function radioValue(name) {
//    return $('input:radio[name="'+name+'"]:checked').val();
//}

function filterExpectations() {
    layer.prompt(
       { title:"Filter Regex String", btn: ['OK','Cancel'] },
       function(val,index, ele) {
        layer.close(index);
        console.log("filter  " + val);
		client.retrieveActiveExpectations(val)
	      .then(dispExpectations, err);
      }
    );
}

function resetExpectations() {
	client.reset()
      .then(listActiveExpectations, err);
}



function listActiveExpectations() {
	client.retrieveActiveExpectations()
      .then(dispExpectations, err);
}


function listRecordedExpectations() {
	client.retrieveRecordedExpectations()
      .then(dispExpectations, err);
}

function err(error){
    console.log("retrieveActiveExpectations error " + JSON.stringify(error));
}

var listValues = [];

function dispExpectations(result) {
        //console.log("dispExpectations ok " + JSON.stringify(result));
        listValues = result;

        $("#ex").html("");
        $.each(result, function(index, val) {
            console.log("dispExpectation for" + JSON.stringify(val));
            
            var $tr = $('<tr>').append(
              $('<td>').text(index+1),
              $('<td>').text(fmt(val.httpRequest)),
              $('<td>').text(val.httpResponse.body),
              $('<td>').text(fmt(val.times)),
              $('<td>').html('<input type="button" value="Delete" onclick="clearExpectations('+ (index) + ');" class="btn btn-danger">')
            );
            $("#ex").append($tr);
        });
        
}

function fmt(obj) {
    var txt = "";
    if(!obj) return txt;
    $.each(obj, function(key, val) {
        if(key && val) { 
            if (txt.length > 0) {
                txt += ", ";
            }
            txt += key + ":" + val;
        }
    });
    return txt;
}


function clearExpectations(idx) {
    var exp = listValues[idx].httpRequest;
    client.clear(exp).then(function (result){
        console.log("clear " + JSON.stringify(result));
        listActiveExpectations();
      },function (error){
        console.log("clear error " + JSON.stringify(error));
        listActiveExpectations();
      });
}


function addExpectations() {

    var exp = {'httpRequest': {}, 'times': {}};
    
    if ($("#i1").val()) { exp.httpRequest.method= ($("#i1").val());}
    if ($("#i2").val()) { exp.httpRequest.path= ($("#i2").val());}
    if ($("#o1").val() == "response") { 
        exp.httpResponse = {};
        exp.httpResponse.statusCode= Number($("#o2").val());
        if (!$("#o4").val()) {exp.httpResponse.body = ($("#o6").val());}
        if ($("#o5").val()) {exp.httpResponse.reasonPhrase = ($("#o5").val());}
        if ($("#o3").val()) {exp.httpResponse.delay = { "timeUnit": $("#o3b").text().toUpperCase(), "value" : Number($("#o3").val())};}
    } else {
        alert("Currently only response supported");
        return;
    }
    if ($("#t1").val()) { 
        exp.times = {};
        exp.times.remainingTimes = Number($("#t1").val());
    } else {
        exp.times = {};
        exp.times.unlimited = true;
    }
    if ($("#t2").val()) { 
        exp.timeToLive = {};
        exp.timeToLive.timeUnit = $("#t2b").text().toUpperCase();
        exp.timeToLive.timeToLive = Number($("#t2").val());
    } else {
        exp.timeToLive = {};
        exp.timeToLive.unlimited = true;
    }
    
    client.mockAnyResponse(exp).then(function (result){
        console.log("ok " + JSON.stringify(result));
        listActiveExpectations();
      },function (error){
        console.log("error " + JSON.stringify(error));
        listActiveExpectations();
      });
}


// ======================== Page Top================

$(function() {
  var topBtn=$('#pageTop');
  topBtn.hide();
  // ◇ボタンの表示設定
  $(window).scroll(function(){
     if($(this).scrollTop()>80){
        // ---- 画面を80pxスクロールしたら、ボタンを表示する
        topBtn.fadeIn();
     }else{
        // ---- 画面が80pxより上なら、ボタンを表示しない
        topBtn.fadeOut();
     }
  });
  // ◇ボタンをクリックしたら、スクロールして上に戻る
  topBtn.click(function(){
    $('body,html').animate({
      scrollTop: 0},100);
    return false;

  });
});

