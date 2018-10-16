<!DOCTYPE html>
<?PHP

    require( "./php/template.php");
    
    //echo html::script()->{'type="text/javascript" src="js/cadastro-de-marchands.js"'}();
    echo html::link()->{'rel="stylesheet" type="text/css" href="js/w2ui/w2ui.min.css"'}();
    echo html::script()->{'type="text/javascript" src="js/w2ui/w2ui.min.js""'}();

?>

                
<script type="text/javascript">
$(function () {
    $('#divTabela').w2grid({ 
        name: 'grid', 
        header: 'Cadastro de Marchands',
        url: './php/users.php',
        method: 'GET', // need this to avoid 412 error on Safari
        show: {
            header      : true,
            toolbar     : true,
            footer      : true,
            lineNumbers : false,
            selectColumn: false,
            expandColumn: false,
            toolbarAdd: true,
            toolbarDelete: true,
            toolbarSave: true,
            toolbarEdit: true
        },        
        columns: [                
            { field: 'vendedor',            caption: 'Vendedor',            size: '35%', sortable: true },
            { field: 'loja',                caption: 'Loja',                size: '25%', sortable: true },
            { field: 'descontomaximo',      caption: 'Desc. Máximo',        size: '10%', style: 'text-align: right' },
            { field: 'descontomaximoobras', caption: 'Desc. Máximo Obras',  size: '10%', style: 'text-align: right' },
            { field: 'comissao',            caption: '% Comissão',          size: '5%', style: 'text-align: right' },
            { field: 'gerente',             caption: 'Gerente',             size: '5%', style: 'text-align: center' },
            { field: 'pdv',                 caption: 'PDV',                 size: '5%', style: 'text-align: center' },
            { field: 'ativo',               caption: 'Ativo',               size: '5%', style: 'text-align: center' }
        ],
        onAdd: function(event) {
            var grid = this;
            var form = w2ui.form;
            console.log(event);
            event.onComplete = function () {
                var sel = grid.getSelection();
                console.log(sel);
                if (sel.length == 1) {
                    form.recid  = sel[0];
                    form.record = $.extend(true, {}, grid.get(sel[0]));
                    form.refresh();
                } else {
                    form.clear();
                }
            }
        },
        searches: [
            { type: 'int',  field: 'recid', caption: 'ID' },
            { type: 'text', field: 'vendedor', caption: 'Vendedor' },
            { type: 'text', field: 'gerente', caption: 'Gerente' },
            { type: 'text', field: 'loja', caption: 'Loja' }
        ],
        onExpand: function (event) {
            $('#'+event.box_id).html('<div style="padding: 10px; height: 100px">Expanded content</div>');
        }
    });    
});
</script>