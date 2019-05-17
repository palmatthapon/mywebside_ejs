function dropdownclicked(e)
{
    if (document.getElementById('status').value == '1') {
        document.getElementById('status').className = 'form-control btn-success';
    }else{
        document.getElementById('status').className = 'form-control btn-danger';
    }
}