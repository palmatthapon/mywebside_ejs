function getDate(n) {
    var d = new Date(n);
    document.write((d.getMonth()+1)+'/'+d.getDate()+'/'+d.getFullYear()+' at '+(d.getHours() > 12 ? d.getHours() - 12 : d.getHours())+':'+d.getMinutes()+' '+(d.getHours() >= 12 ? "PM" : "AM"));
}

