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

function addTags(t){
    var inputTag = document.getElementById("tag");
    inputTag.value  = "hhh";
    if(inputTag.value.indexOf(t)!== -1){

    }else{
        if(inputTag.value == ''){
            inputTag.value  = "aaa";
        }else{
            inputTag.value +=','+t;
        }
    }
}

