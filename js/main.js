(function() {
  $("#enter").on('click', function(e) {
    e.preventDefault();
    $.ajax({
      url : 'enterUser',
      method : 'POST',
      data : $('#userForm').serialize(),
      success : function(req, res) {
        if(req.resultCode == '01') {
          $(location).attr('href',req.url + '?userName=' + req.userName);
        } else {
          alert(req.message);
        }
      }
    });
    return false;
  });
})();
