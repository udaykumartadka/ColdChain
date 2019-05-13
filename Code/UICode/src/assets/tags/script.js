
var timer;
var keyboard = false;
var myInput;
$(document).ready(function(){

  $('#demo1').tagEditor({
    initialTags: [],
    delimiter: ', ', /* space and comma */
    placeholder: 'Enter tags ...',
    removeDuplicates : false
});

  $("#box").keypress(function (e) {

    if(timer) {clearTimeout(timer)};
    if(e.which ===  13 && keyboard){
      process();
    } else if (e.which === 32 && keyboard) {
      process();
    }else if (!keyboard) {
      timer = setTimeout(process, 30);
    }
  })

    $('a.toggler').click(function(){
         $(this).toggleClass('on');
         keyboard = !keyboard;
         console.log(keyboard);
     });

     var process = function(){
       console.log($("#box").val())
       $('#demo1').tagEditor('addTag', $("#box").val());
       $("#box").focus().select()
       $("#box").val("")
     }

});
