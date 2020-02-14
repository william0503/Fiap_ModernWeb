class NegociacaoController {
    constructor() {
        let $ = document.querySelector.bind(document)
        this._inputData = $('#data')
        this._inputQuantidade = $('#quantidade')
        this._inputValor = $('#valor')
        this._listaNegociacoes = new ListaNegociacao();
        this._negociacoesView = new NegociacoesView($("#negociacoesView"))

        this._mensagem = new Mensagem()
        this._mensagemView = new MensagemView($("#mensagemView"))

        this._negociacoesView.update(this._listaNegociacoes)
        this._mensagemView.update(this._mensagem)
    }

    adiciona(event) {
        event.preventDefault()

        this._listaNegociacoes.adiciona(this._criaNegociacao())

        console.log(this._listaNegociacoes.negociacoes)

        this._negociacoesView.update(this._listaNegociacoes)

        this._mensagem.texto = "Deu bom!"
        this._mensagemView.update(this._mensagem)

        this._limpaFormulario()
    }

    _criaNegociacao() {
        return new Negociacao(
            DateHelper.textoParaData(this._inputData.value),
            this._inputQuantidade.value,
            this._inputValor.value)
    }

    _limpaFormulario() {
        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 1.0;
        this._inputData.focus();
    }

    apaga() {        
        this._listaNegociacoes.esvazia();
        this._negociacoesView.update(this._listaNegociacoes);
        this._mensagem.texto = 'Negociações apagadas com sucesso';
        this._mensagemView.update(this._mensagem);
    }

    importaNegociacoes() {
        
        let xhr = new XMLHttpRequest();
        xhr.open('GET',
            'http://localhost:3000/negociacoes/semana');
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    JSON.parse(xhr.responseText)
                        .map(objeto => new Negociacao(new
                            Date(objeto.data), objeto.quantidade, objeto.valor))
                        .forEach(negociacao =>
                            this._listaNegociacoes.adiciona(negociacao))
                    this._mensagem.texto = 'Negociações importadas com sucesso.';
                    console.log('Obtendo as negociações do servidor.');
                    console.log(xhr.responseText);

                    this._negociacoesView.update(this._listaNegociacoes);        
                    this._mensagemView.update(this._mensagem);

                } else {
                    console.log(xhr.responseText);
                    this._mensagem.texto = 'Não foi possível obter as negociações.';
                    console.log('Não foi possível obter as negociações do servidor.');
                    console.log(xhr.responseText);
                }
            }
        }
        xhr.send();
    }

}