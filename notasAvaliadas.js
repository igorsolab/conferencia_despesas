function buscarNotasReprovadas(){
    var selectConfDespesas = `
    SELECT ac.*,t4.NOMEFANTASIA,t3.DESCRCENCUS,t2.DESCRNAT,t.VLRNOTA
    FROM TGFCAB t
    INNER JOIN TGFNAT t2 ON t2.CODNAT = t.CODNAT
    INNER JOIN TSICUS t3 ON t3.CODCENCUS = t.CODCENCUS
    INNER JOIN TSIEMP t4 ON t4.CODEMP = t.CODEMP
    INNER JOIN AD_CONFDESPESA ac ON ac.NUNOTA = t.NUNOTA
    WHERE ac.CONFIRMADO = 'N'
    ORDER BY ac.NUNOTA;
    `;
    var arraysConfDespesas = getDadosSql(selectConfDespesas);
    var row_avaliada="";
    let title = "Reprovado: ";

    for(let i = 0; i < arraysConfDespesas.length; i++){
        var nota = arraysConfDespesas[i][0];
        var confirmado = arraysConfDespesas[i][1];
        if(arraysConfDespesas[i][2]!==null){
            var arrayDatas = arraysConfDespesas[i][2].split(" ");
            var dataFormatada = arrayDatas[0].replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3")
        }
        var usuario = arraysConfDespesas[i][3];
        var reprovado = arraysConfDespesas[i][4];
        var codUsuReprovado = arraysConfDespesas[i][5];
        var descReprovado = arraysConfDespesas[i][6];
        let nomeFantasia = arraysConfDespesas[i][7];
        let descCentroCusto = arraysConfDespesas[i][8];
        let descNatureza = arraysConfDespesas[i][9];
        let valorNota = arraysConfDespesas[i][10];

        row_avaliada+= 
        `
        <tr>
            <td>
                <p><strong>Nota:</strong> ${nota} <strong>Usuario:</strong>${usuario} <strong>Codigo do usuario:</strong> ${codUsuReprovado}</p>
                <p><strong>Descricao:</strong> ${descReprovado}</p>
                <p><strong>Empresa:</strong> ${nomeFantasia} <strong>Centro de custo:</strong>${descCentroCusto}</p>
                <p><strong>Natureza: </strong> ${descNatureza}<strong> Valor: </strong>R$ ${valorNota.toFixed(2)}</p>
                
                <div class="d-flex justify-content-around">
                    <span><strong>Visualizar nota: </strong>${buttonVisualizarNota(nota)}</span>
                    <span><strong>Aprovar nota: </strong>
                        <button type="button" title="Mudar nota para aprovados" onclick="updateParaAprovar(${nota},${usuario})" class="btn btn-success">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                            </svg>
                        </button>
                    </span>
                </div>
            </td>
            </tr>
        `;
        row_avaliada+="";

        
    }
    if(row_avaliada===""){
        row_avaliada+="Ainda nao houve nenhuma avaliacao"
    }
    console.log(row_avaliada)
    var visualizaNota = modalNotasAvaliadas(row_avaliada,title,2);
    var body = $('body');
    body.append(visualizaNota);
    var visualizaAvaliacoes = new bootstrap.Modal(document.getElementById('nota-avaliada'), {
        keyboard: false
    });
    mostrarModal(visualizaAvaliacoes);

}
function removerNotaAvaliada(){
    
}


function buscarNotasAprovadas(){
    var selectConfDespesas = `
    SELECT ac.*,t4.NOMEFANTASIA,t3.DESCRCENCUS,t2.DESCRNAT,t.VLRNOTA
    FROM TGFCAB t
    INNER JOIN TGFNAT t2 ON t2.CODNAT = t.CODNAT
    INNER JOIN TSICUS t3 ON t3.CODCENCUS = t.CODCENCUS
    INNER JOIN TSIEMP t4 ON t4.CODEMP = t.CODEMP
    INNER JOIN AD_CONFDESPESA ac ON ac.NUNOTA = t.NUNOTA
    WHERE ac.CONFIRMADO = 'S'
    ORDER BY ac.NUNOTA desc;
    `;
    var arraysConfDespesas = getDadosSql(selectConfDespesas);
    var row_avaliada="";
    row_avaliada+='';
    let title = "Aprovado: ";
    for(let i = 0; i < arraysConfDespesas.length; i++){
        var nota = arraysConfDespesas[i][0];
        var confirmado = arraysConfDespesas[i][1];
        if(arraysConfDespesas[i][2]!==null){
            var arrayDatas = arraysConfDespesas[i][2].split(" ");
            var dataFormatada = arrayDatas[0].replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3")
        }
        var usuario = arraysConfDespesas[i][3];
        let nomeFantasia = arraysConfDespesas[i][7];
        let descCentroCusto = arraysConfDespesas[i][8];
        let descNatureza = arraysConfDespesas[i][9];
        let valorNota = arraysConfDespesas[i][10];
        
            row_avaliada+= `

                <tr>
                    <td>
                        <p><strong>Nota:</strong> ${nota} <strong>Data e hora:</strong>${dataFormatada} ${arrayDatas[1]} <strong>Usuario:</strong> ${usuario}</p>
                        <p><strong>Empresa:</strong> ${nomeFantasia} <strong>Centro de custo: </strong>${descCentroCusto} </p>
                        <p><strong>Natureza:</strong> ${descNatureza}<strong> Valor:</strong> R$ ${valorNota.toFixed(2)}</p>
                    </td>
                </tr>
            ` ;
        }
    if(row_avaliada===""){
        row_avaliada+="Ainda nao houve nenhuma avaliacao"
    }
    var visualizaNota = modalNotasAvaliadas(row_avaliada,title,3);
    var body = $('body');
    body.append(visualizaNota);
    var visualizaAvaliacoes = new bootstrap.Modal(document.getElementById('nota-avaliada'), {
        keyboard: false
    });
    mostrarModal(visualizaAvaliacoes);

    }

function modalNotasAvaliadas(notas,title,size){
    var modal = `
        
        <div id="nota-avaliada" class="modal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                    <h5 class="modal-title">Exibindo avaliacoes</h5>
                    <button type="button" class="btn-close" onclick="fechandoModalNota('nota-avaliada')" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <table 
                            id="tableNotasAvaliadas" 
                                class="table"
                                style="overflow:hidden"
                                data-pagination="true"
                                data-page-size="${size}">
                                <thead>
                                    <tr>
                                        <th style="text-align:center" data-field="title">${title}</th>
                                    </tr>
                                </thead>
                            <tbody>
                                ${notas}
                            </tbody>
                        </table>
                    </div>
                    <div class="modal-footer">
                    <button type="button" onclick="fechandoModalNota('nota-avaliada')" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    $(function () {
        $('#tableNotasAvaliadas').bootstrapTable({
            paginationVAlign:"both",
            paginationParts:['pageList'],
        });
    });
    return modal;
}

function updateParaAprovar(cod,codUsu){
    
    let date = new Date(Date.now()).toLocaleString().replace(',', ' ');
    // var dateArray = date[0].split('/');
    // let dateFormat = `${dateArray[0]}/${dateArray[1]}/${dateArray[2]}`;
    // let dateFormated = `${dateFormat}`;
    alert(date)

    let updateDados = () =>{
        let fields = {};
        fields.NUNOTA       = dataFormatSankhya(cod);
        fields.CONFIRMADO   = dataFormatSankhya('S');
        fields.DHCONFIRMADO = dataFormatSankhya(date);
        fields.CODUSU       = dataFormatSankhya(codUsu);
        fields.REPROVADO    = dataFormatSankhya('N');
        return saveRecord('AD_CONFDESPESA',fields,fields.NUNOTA);
    }
    updateDados();
    setTimeout(function(){
        location.reload(true)

    },1000)

}
