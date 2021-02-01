  //返回顶部控件以及进度条控件
  $("#returnTop").hide();
  $(window).scroll(function(){
    var top = $(document).scrollTop();
    $("#Progress").css("width",(top/($(document).height()-1000)*1920)+"");
    if(top > 1){
      $("#returnTop").fadeIn();
    }
    else{
      $("#returnTop").fadeOut();
    }
  });
  //单击返回顶部按钮事件
  function ret(){
    $("html,body").animate({scrollTop:0},800);
  }

  //时间计时器
  var str = "今天是" + getDatetimeStr() + " 祝你能有美好的一天^-^";
  $(".foot-time .datetime").html(str);
  setInterval(function(){
    var str = "今天是" + getDatetimeStr() + " 祝你能有美好的一天^-^";
    $(".foot-time .datetime").html(str);
  },1000);
  function getDatetimeStr(){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    if(minutes < 10){
      minutes = "0" + minutes;
    }
    var second = date.getSeconds();
    if(second < 10){
      second = "0" + second;
    }
    var Time = year+"年"+month+"月"+day+"日"+hour+"时"+minutes+"分"+second+'秒';
    return Time;
  }