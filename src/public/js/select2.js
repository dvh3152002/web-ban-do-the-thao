$(function(){
    $(".tag_select2_choose").select2({
        tags:true,
        tokenSeparators:[',']
    })
    $(".select2_init").select2({
        placeholder:"Chọn danh mục",
        allowClear:true
    });
    $(".select2_role").select2({
        placeholder:"Chọn vai trò",
        allowClear:true
    })
})