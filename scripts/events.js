(function(){
    'use strict';
    
    $(document).ready(function(){
        $('input[type=radio]').bind('click', function(e){
            var t = e.target;
            alert($(t).val);
        });
    });
}());