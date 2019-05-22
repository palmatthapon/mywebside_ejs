function clicked(e)
{
    if(!confirm('Are you sure?'))e.preventDefault();
}

function clickTag(t){
    var inputTag = document.getElementById("tag");
    if(inputTag.value.indexOf(t)!== -1){

    }else{
        if(inputTag.value == ''){
            inputTag.value  = t;
        }else{
            inputTag.value +=','+t;
        }
    }
    
}