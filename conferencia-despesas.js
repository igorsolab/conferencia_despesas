const hostname = location.hostname;
const port = location.port;
const user = getUserLogado();
var jnid = getJNID();

function getJNID(){

    let JSESSIONID = document.cookie.split('; ').find(row => row.startsWith('JSESSIONID=')).split('=')[1];
    JSESSIONID = JSESSIONID.split('.');
    JSESSIONID = JSESSIONID[0];
    return JSESSIONID;

}

// função para capturar codigo do usuario logado
function getUserLogado(){

    let userLogado = document.cookie.split('; ').find(row => row.startsWith('userIDLogado=')).split('=')[1];
    return userLogado;

}


function IniciarApp(){
    scriptHTML();
}

function scriptHTML(){

    // let pesquisaNunota = "SELECT TOP 10 NUNOTA , CODEMP, DTNEG  FROM TGFCAB";
    // let valores = getDadosSql(pesquisaNunota);
    // console.log(valores)

    let inputs = `

        <div class="container mt-3">

            <div class="row">

                <div class="col-md-6">
                    
                        
                    <div class="mb-3 row">
                        <div class="col-sm-6">
                            Buscar por loja:
                        </div>
                        <div class="col-sm-4">
                            <input class="form-control" id="search-loja" type="text" />
                        </div>
                    </div>
                    <div class="mb-3 row">
                        <div class="col-sm-6">
                            Buscar por operacao:
                        </div>
                        <div class="col-sm-4">
                            <select name="options" id="select">
                                <option value="">Todos</option>
                                <option value="1306">1306</option>
                                <option value="1307">1307</option>
                            </select>
                        </div>
                    </div>

                    <div class="mb-3 row">
                    <div class="col-sm-4">
                    </div>
                    <div class="col-sm-8">
                        <div class="form-check form-check-inline">
                                <input class="form-check-input" type="checkbox" name="confirmacao" id="inlineCheckbox1" value="confirmado">
                                <label class="form-check-label" for="inlineCheckbox1">Confirmado</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="checkbox" name="confirmacao" id="inlineCheckbox2" value="nao-confirmado">
                                <label class="form-check-label" for="inlineCheckbox2">Nao Confirmado</label>
                            </div>
                        </div>
                    </div>
                

                    <div class="mb-3 row">
                        <label class="col-sm-4 col-form-label">De:</label>
                        <div class="col-sm-6">
                            <input class="form-control" id="data_inicio" type="date" />
                        </div>
                    </div>


                    <div class="mb-3 row">
                        <label class="col-sm-4 col-form-label">Ate:</label>
                        <div class="col-sm-6">
                            <input class="form-control" id="data_final" type="date" />
                        </div>
                    </div>

                    <button type="button" id="btn_search_date" onclick="verificarCampoClicado()" class="btn btn-outline-primary">Pesquisar</button>
                
                </div>


                <div class="col-md-5">
                
                    <h2 class="d-flex justify-content-center">Visualizar notas avaliadas: </h2>
                    <div class="mt-5 d-flex justify-content-center gap-3">
                        <button type="button" id="" onclick="buscarNotasReprovadas()" style="" class="btn btn-outline-danger">Notas reprovadas</button>
                        <button type="button" id="" onclick="buscarNotasAprovadas()" style="" class="btn btn-outline-success">Notas aprovadas</button>
                    </div>                
                </div>
            </div>

        </div>

        
        `;






        let html = "<h1 style=\"text-align:center;margin-bottom:30px;\">Conferencia de despesas</h1>";
        html += inputs;
    
        const div = $("#inputs-filtro");
        div.append(html);

}

    function conexaoTabela(html){
        
        let tabela_dados = $("#tabela-dados"); 
        tabela_dados.empty();
        tabela_dados.append(html);
    }



    function inicioTabela(){



        let tabela = `
        
        <div class="container mt-3">       
        <table 
        id="tableTb" 
        class="table"
        style="overflow:hidden"
        >
            <thead>
                <tr>
                    <th data-field="ordem"></th>
                    <th data-field="loja">Loja</th>
                    <th data-field="nunota">Numero</th>
                    <th data-field="cr">Centro de resultado</th>
                    <th data-field="natureza">Natureza</th>
                    <th data-field="data">Data</th>
                    <th data-field="valor">Valor</th>
                    <th data-field="opcoes">Opcoes</th>
                </tr>
            </thead>
            <tbody>`;

            return tabela;
    }

    

    
    function fechaTabela(){
                    
        var fechandoTabela = `
        </tbody>
        </table>
        </div>`;

        $(function () {
            $('#tableTb').bootstrapTable({
                paginationVAlign:"both",
                paginationParts:['pageList'],
                pagination: true,
                pageSize: 20, //specify 5 here
});

        });
        return fechandoTabela; 
    }

    function verificarCampoClicado(){

        let dataInicio = $('#data_inicio');
        let dataFinal = $('#data_final');
        let loja = $('#search-loja');
        let operacao = $('#select');
        let confirmado = $('#inlineCheckbox1');
        let nao_confirmado = $('#inlineCheckbox2');
        let dataInicioFormatada = formatarData(dataInicio.val());
        let dataFinalFormatada = formatarData(dataFinal.val());
        console.log("Data inicio: "+dataInicio.val()+" e Data Final: "+dataFinal.val())
        var selectBusca = `
        SELECT t4.NOMEFANTASIA ,t.NUNOTA,t3.DESCRCENCUS,t2.DESCRNAT,t.VLRNOTA,t.DTNEG
        FROM TGFCAB t
        INNER JOIN TGFNAT t2 ON t2.CODNAT = t.CODNAT
        INNER JOIN TSICUS t3 ON t3.CODCENCUS = t.CODCENCUS
        INNER JOIN TSIEMP t4 ON t4.CODEMP = t.CODEMP
        LEFT JOIN AD_CONFDESPESA ac ON ac.NUNOTA = t.NUNOTA
        `;

        if(operacao.val()==""){
            selectBusca+=`WHERE t.CODTIPOPER BETWEEN 1306 and 1307
            `;
        }if(operacao.val()!=""){
            selectBusca+=`WHERE t.CODTIPOPER = ${operacao.val()}
            `;
        }if(loja.val()!=""){
            selectBusca += `AND t4.CODEMP = ${loja.val()}
            `;
        } if(dataInicio.val()!="" && dataFinal.val()!=""){
            selectBusca += `AND t.DTNEG BETWEEN ${dataInicioFormatada} and ${dataFinalFormatada}
            `;
        }
        if(confirmado.is(':checked') && nao_confirmado.is(':checked')){
            selectBusca +='';
        } else{
            if(confirmado.is(':checked')){
            selectBusca += `AND t.STATUSNOTA = 'L'
            `;
        } else if(nao_confirmado.is(':checked')){
            selectBusca += `AND t.STATUSNOTA = 'A'
            `;
        }
    }

        selectBusca+=`AND ac.NUNOTA is null
                    ORDER BY t.DTNEG`;
        var valoresBusca = getDadosSql(selectBusca);
        // var selectAvaliadas = `SELECT NUNOTA, CONFIRMADO FROM AD_CONFDESPESA 
        // order by DHCONFIRMADO asc;`;
        // var valoresAvaliados = getDadosSql(selectAvaliadas);
        var html = "";
        html+=inicioTabela();
        for(let i=0; i < valoresBusca.length; i ++) {

            html+='<tr>';
            html += `<td>${i+1}</td>`
            html += `<td>${valoresBusca[i][0]}</td>`
            html += `<td>${valoresBusca[i][1]}</td>`
            html += `<td>${valoresBusca[i][2]}</td>`
            html += `<td>${valoresBusca[i][3]}</td>`
            html += `<td>${matchData(valoresBusca[i][5])}</td>`
            html += `<td>R$ ${valoresBusca[i][4].toFixed(2)}</td>`
            html += `<td style="width:200px">${botoesAprovacao(valoresBusca[i][1])} ${botaoReprovacao(valoresBusca[i][1])} ${buttonVisualizarNota(valoresBusca[i][1])}</td>`;
            html += "</tr>";
        }

        html+=fechaTabela();
        conexaoTabela(html);


    }
    function matchData(data){
        let dataArray = data.split(" ");
        return dataArray[0].replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3") + " "+dataArray[1]; 
    }
    function formatarData(data){
        let arrayData = data.split("-");
        // console.log("Array Formata Data: "+arrayData)
        return `'${arrayData[2]}-${arrayData[1]}-${arrayData[0]} 00:00:00'`;
    }