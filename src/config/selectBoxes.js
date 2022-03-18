$(document).ready(function(){
    $('select').on('change', function(event ) {
       var prevValue = $(this).data('previous');
    $('select').not(this).find('option[value="'+prevValue+'"]').show();    
       var value = $(this).val();
      $(this).data('previous',value); $('select').not(this).find('option[value="'+value+'"]').hide();
    });
});