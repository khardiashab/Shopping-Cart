// making the title table sortable using jquery
$(function(){
  $("a.delete__pages").on("click", ()=>{
    if(!confirm("Confrim Deletion.")) return false;
  })
})

$(function(){
 if( $("textarea#ta").length ){
  ClassicEditor
    .create( document.querySelector( '#ta' ))
    .catch( error => {
        console.error( error );
    } );
 }
})