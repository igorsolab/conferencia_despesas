function botoesAprovacao(cod){
    var botaoAprova = `<button type="button" title="Aprovar nota" onclick="buscarUsuario(${cod},'aprovado');"  class="btn btn-success">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
    </svg>
    </button>`;
    return botaoAprova;
}

    
function botaoReprovacao(cod){
    var buttonReprova = `<button type="button" title="Reprovar nota" onclick="buscarUsuario(${cod},'reprovado')" class="btn btn-danger">
    
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
    </svg>
    </button>`;
    return buttonReprova;
}

function buttonVisualizarNota(cod){


    var buttonReprova = `
    <button type="button" onclick="buscarUsuario(${cod},'visualizar')" title="Visualizar nota" class="btn btn-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-text" viewBox="0 0 16 16">
            <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/>
            <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
        </svg>
    </button>`;
    return buttonReprova;

}



function buscarUsuario(cod,acao){
    
    var selectUsuario = `
        
        SELECT t2.NOMEUSU,t2.CODUSU
        FROM tgfcab t
        inner join TSIUSU t2 
        ON t2.CODUSU  = t.CODUSU
        WHERE t.NUNOTA =  ${cod};
        `;
    
    var arrayUsuario = getDadosSql(selectUsuario);


    let nomeUsu = arrayUsuario[0][0];
    let codUsu = arrayUsuario[0][1];

    if(acao=="aprovado"){
        aprovacao(cod,codUsu);
    }else if(acao=="reprovado"){
        modal(cod, codUsu);
    }else if(acao=="visualizar"){
        visualizarNota(cod,codUsu);
    }
}





function aprovacao(cod,codUsu){
    
    let date = new Date(Date.now()).toLocaleString().replace(',',' ');
    // var dateArray = date[0].split('/');
    // let dateFormat = `${dateArray[0]}-${dateArray[1]}-${dateArray[2]}`;
    // let dateFormated = `${dateFormat}${date[1]}`;
    alert("Aprovado, nota: "+cod)


    let insertDadosTabela = () =>{
        let fields = {};

        fields.NUNOTA       = dataFormatSankhya(cod);
        fields.CONFIRMADO   = dataFormatSankhya('S');
        fields.DHCONFIRMADO = dataFormatSankhya(date);
        fields.CODUSU       = dataFormatSankhya(codUsu);
        fields.REPROVADO    = dataFormatSankhya('N');
        return saveRecord('AD_CONFDESPESA',fields);
    }
    insertDadosTabela();

}

function dataFormatSankhya(dado){
    return {
        "$" : dado
    };
}


function reprovacao(cod,codUsu,descRep){
    let insertDadosTabela = () =>{
        let fields = {};
        fields.NUNOTA       = dataFormatSankhya(cod);
        fields.CONFIRMADO   = dataFormatSankhya('N');
        fields.CODUSU       = dataFormatSankhya(codUsu);
        fields.REPROVADO    = dataFormatSankhya('S');
        fields.CODUSUREP    = dataFormatSankhya(codUsu);
        fields.DESCREP      = dataFormatSankhya(descRep);
        return saveRecord('AD_CONFDESPESA',fields);
    }
    insertDadosTabela();

}

function modal(cod,codUsu) {

    var modalDesc = `
    
    <div class="modal fade" id="descRep" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Reprovando nota</h5>
                    <button type="button" class="btn-close" onclick="fechandoModalNota('descRep')" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="mb-3">
                            <label for="mensagem_reprovado" class="col-form-label">Porque voce esta reprovando esta nota?</label>
                            <textarea class="form-control" id="mensagem_reprovado"></textarea>
                        </div>
                    </form>
                </div>                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="fechandoModalNota('descRep')" data-bs-dismiss="modal">Fechar</button>
                    <button type="button" data-bs-dismiss="modal" onclick="enviaDesc(${cod},${codUsu})" class="btn btn-primary">Enviar</button>
                </div>
            </div>
        </div>
    </div>
    `;

    var body = $('body');
    body.append(modalDesc);

    var descRep = new bootstrap.Modal(document.getElementById('descRep'), {
        keyboard: false
      })
    mostrarModal(descRep);
  }

  function mostrarModal(myModal){
      setTimeout(()=>{
        myModal.show();
      },100)
  }


  function enviaDesc(cod,codUsu){
    var descricao = $('#mensagem_reprovado').val();
    reprovacao(cod,codUsu,descricao);
    fechandoModalNota('descRep');
  }


  function visualizarNota(cod,codUsu){
    var select = `
        SELECT ad.NUNOTADESP, ad.COMPROVANTE, t2.NOMEUSU, t5.NOMEFANTASIA, t4.DESCRCENCUS, t3.DESCRNAT, t.VLRNOTA, t6.HISTORICO, t.DTNEG  FROM  TGFCAB t 
        INNER JOIN AD_DESPESASCOMPROVANTES ad ON ad.NUNOTADESP = t.NUNOTA
        INNER JOIN TSIUSU t2 ON t2.CODUSU = t.CODUSU
        INNER JOIN TGFNAT t3 ON t3.CODNAT = t.CODNAT
        INNER JOIN TSICUS t4 ON t4.CODCENCUS = t.CODCENCUS
        INNER JOIN TSIEMP t5 ON t5.CODEMP = t.CODEMP 
        LEFT JOIN TGFFIN t6 ON t6.NUNOTA = t.NUNOTA 
        WHERE t.CODTIPOPER BETWEEN 1306 AND 1307
        AND t.NUNOTA = ${cod}
        ORDER BY ad.NUNOTADESP;
        `;

    var arrayDados = getDadosSql(select);
    console.log(arrayDados.length)
    // if(arrayDados.length){

    // }
    arrayDados.forEach(e => {
        
        var nota = e[0];
        var hexadecimal = e[1];
        console.log(hexadecimal)
        var base64 = hexToBase64(hexadecimal);
        var usuario = e[2];
        var loja = e[3];
        var descCentroCusto = e[4];
        var descNat = e[5];
        var valor = e[6].toFixed(2);
        var historico = e[7];
        var dataNaoFormatada = matchData(e[8]);
        let data = dataNaoFormatada
        if(historico == "" || historico == null){
            historico= "Nao ha historico"
        }

        var imprimindoNota = modalParaNota(`data:image/jpg;base64,${base64}`,nota,usuario,loja,descCentroCusto,descNat,valor,historico,data);

        console.log(base64=="" ? "": `data:image/jpg;base64,${base64}`,nota,usuario,loja,descCentroCusto,descNat,valor,historico,data)

        var body = $('body');
        body.append(imprimindoNota);
        var myModal = new bootstrap.Modal(document.getElementById('nota'), {
            keyboard: false
        });
        mostrarModal(myModal);
    });
    }


  
function hexToBase64(hexStr) {
    return btoa([...hexStr].reduce((acc, _, i) =>
      acc += !(i - 1 & 1) ? String.fromCharCode(parseInt(hexStr.substring(i - 1, i + 1), 16)) : "" 
    ,""));

  }

function modalParaNota(base64Img,nota,usuario,loja,descCentroCusto,descNat,valor,historico,data){
    var modal = `
    
    <div id="nota" class="modal" tabindex="-1">
        <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title">Exibindo nota</h5>
            <button type="button" class="btn-close" onclick="fechandoModalNota('nota')" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div>
                    <p><strong>Nota:</strong> ${nota} <strong>Usuario:</strong> ${usuario}<p>
                    <p><strong>Loja:</strong> ${loja} <strong>Data:</strong> ${data}
                    <p><strong>Centro de Resultado:</strong> ${descCentroCusto}</p>
                    <p><strong>Natureza:</strong> ${descNat} <strong>Valor:</strong> ${valor}</p>
                    <p><strong>Historico: </strong> ${historico}
                </div>
                <img src="${base64Img}" style="width:100%"/>
            </div>
            <div class="modal-footer">
            <button type="button" onclick="fechandoModalNota('nota')" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
            </div>
        </div>
        </div>
    </div>
    `;
    
    return modal;
}


function fechandoModalNota(nota){
    var nota = $(`#${nota}`);
    nota.modal('hide');
    // let bootstrapModal = new bootstrap.Modal(nota)
    // bootstrapModal.hide();
    nota.remove();
    $("body").removeClass('modal-open').find('.modal-backdrop').remove();
    $('body').css("overflow","scroll")
}