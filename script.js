const pergunta = document.querySelector('#pergunta');
const imagens = document.querySelector('#pergunta .imagens');
const audios = document.querySelector('#pergunta .audio');
const textos = document.querySelector('#pergunta .texto');
const resposta = document.querySelector('#resposta');
const btnRevelarResposta = document.querySelector('#btnRevelarResposta');
const btnProxima = document.querySelector('#btnProxima');
const templateAudio = document.querySelector('template');
const btnJogarBrasil = document.querySelector('#btnJogarBrasil');
const btnJogarMundo = document.querySelector('#btnJogarMundo');
const configuracoesBrasil = document.querySelector('.configuracoes-brasil');
const configuracoesMundo = document.querySelector('.configuracoes-mundo');
const quiz = document.querySelector('#quiz');

const possibilidadesMundo = ['bandeira', 'mapa', 'continente', 'capital', 'gentilico', 'linguas', 'formaConstitucional', 'chefeDeEstado', 'baseLegitimidadeExecutiva', 'iso2', 'iso3', 'dominio', 'ddi', 'percentualCristao', 'percentualMuculmano', 'percentualHindu', 'percentualBudista', 'percentualJudaico', 'nome'];

const possibilidadesBrasil = ['nome', 'abreviacao', 'capital', 'gentilico', 'hino', 'area', 'percentualTerritorial', 'paisComparavel', 'bandeira', 'mapa', 'brasao'];

const mapDadosMundo = new Map();
mapDadosMundo.set('nome', 'Nome');
mapDadosMundo.set('bandeira', 'Bandeira');
mapDadosMundo.set('mapa', 'Mapa');
mapDadosMundo.set('continente', 'Continente');
mapDadosMundo.set('capital', 'Capital');
mapDadosMundo.set('gentilico', 'Gentílico');
mapDadosMundo.set('linguas', 'Línguas');
mapDadosMundo.set('formaConstitucional', 'Forma constitucional');
mapDadosMundo.set('chefeDeEstado', 'Chefe de Estado');
mapDadosMundo.set('baseLegitimidadeExecutiva', 'Base de legitimidade executiva');
mapDadosMundo.set('iso2', 'ISO2');
mapDadosMundo.set('iso3', 'ISO3');
mapDadosMundo.set('dominio', 'Domínio');
mapDadosMundo.set('ddi', 'DDI');
mapDadosMundo.set('percentualCristao', '% Cristão');
mapDadosMundo.set('percentualMuculmano', '% Muçulmano');
mapDadosMundo.set('percentualHindu', '% Hindu');
mapDadosMundo.set('percentualBudista', '% Budista');
mapDadosMundo.set('percentualJudaico', '% Judaico');

const mapDadosBrasil = new Map();
mapDadosBrasil.set('nome', 'Nome');
mapDadosBrasil.set('abreviacao', 'Abreviação');
mapDadosBrasil.set('capital', 'Capital');
mapDadosBrasil.set('gentilico', 'Gentílico');
mapDadosBrasil.set('area', 'Área');
mapDadosBrasil.set('percentualTerritorial', 'Percentual territorial');
mapDadosBrasil.set('paisComparavel', 'País comparável');
mapDadosBrasil.set('bandeira', 'Bandeira');
mapDadosBrasil.set('mapa', 'Mapa');
mapDadosBrasil.set('brasao', 'Brasão');
mapDadosBrasil.set('hino', 'Hino');

let respostaDada = false;
let respostaAPergunta;
let dadosPergunta = ['bandeira', 'mapa', 'hino'], dadosResposta = ['nome'];
let limiteContinental = false;
let listaPossibilidades = possibilidadesBrasil;
let dicasDadas = [];
let mapEscolhido = mapDadosBrasil;
let dados = dadosBrasil;

const aleatorio = (min, max) => {
       return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
}
const aleatorioLista = (lista, restricao = false) => {
       posicao = aleatorio(0, lista.length - 1);
       return lista[posicao];
}

const tipoPergunta = (infoPergunta) => {
	if (!infoPergunta || Array.isArray(infoPergunta))
		return 'texto';

	if (infoPergunta.search('.png') !== -1 || infoPergunta.search('.jpg') !== -1)
		return 'imagem';
	if (infoPergunta.search('.mp3') !== -1 || infoPergunta.search('.ogg') !== -1)
		return 'audio';

	return 'texto';
}

const criaImagem = (src) => {
	let imagem = document.createElement('img');
	imagem.src = src;

	return imagem;
}

const criaTexto = (texto) => {
	let elem;
	let li = document.createElement('li');
	if (texto.search(':') !== -1) {
		let tmp = texto.split(': ');
		let spanMaior = document.createElement('span');
		let spanNegrito = document.createElement('span');
		let spanInfo = document.createElement('span');
		spanNegrito.classList.add('negrito');
		spanNegrito.textContent = `${tmp[0]}: `;
		spanInfo.textContent = tmp[1];
		spanMaior.appendChild(spanNegrito);
		spanMaior.appendChild(spanInfo);
		li.appendChild(spanMaior);
	} else {
		li.textContent = texto;
	}

	return li;
}

const criaAudio = (src, local) => {
	let clone = templateAudio.content.cloneNode(true);
	local.appendChild(clone);
	local.querySelector('audio').src = src;

	return clone;
}

const trataTexto = (texto) => {
	if (Array.isArray(texto)) {
		texto = texto.join(' - ');
	}

	return texto;
}

let respostas = [], anterior = false, dadoEscolhido;
const criaPergunta = (dadosPergunta, dadosResposta) => {
	dicasDadas = [];
	respostaDada = false;
	imagens.innerHTML = ''; audios.innerHTML = ''; textos.innerHTML = ''; resposta.textContent = '';

	if (limiteContinental) {
		do {
			dadoEscolhido = aleatorioLista(dados);
		} while(dadoEscolhido.continente !== limiteContinental && dadoEscolhido.nome === anterior);
	} else {
		if (!anterior) {
			dadoEscolhido = aleatorioLista(dados);
		} else {
			do {
				dadoEscolhido = aleatorioLista(dados);
			} while(dadoEscolhido.nome === anterior);
		}
	}

	anterior = dadoEscolhido.nome;

	let infoPergunta = [];
	for (let i = 0; i < dadosPergunta.length; i++) {
		infoPergunta.push(dadoEscolhido[`${dadosPergunta[i]}`]);
	}

	let infoResposta = [];
	for (let i = 0; i < dadosResposta.length; i++) {
		infoResposta.push(dadoEscolhido[`${dadosResposta[i]}`]);
	}

	for (let i = 0; i < infoPergunta.length; i++) {
		switch(tipoPergunta(infoPergunta[i])) {
			case 'imagem':
				imagens.appendChild(criaImagem(infoPergunta[i]));
				break;
			case 'audio':
				criaAudio(infoPergunta[i], audios);
				break;
			case 'texto':
				textos.appendChild(criaTexto(`${mapEscolhido.get(dadosPergunta[i])}: ${trataTexto(infoPergunta[i])}`));
				break;
		}
	}

	respostas.push(infoResposta);

	return infoResposta;
}

btnRevelarResposta.addEventListener('click', () => {
	console.log(respostaAPergunta);
	if (!respostaDada) {
		for (let i = 0; i < respostaAPergunta.length; i++) {
			if (respostaAPergunta[i] && !Array.isArray(respostaAPergunta[i])) {
				switch(tipoPergunta(respostaAPergunta[i])) {
					case 'imagem':
						resposta.appendChild(criaImagem(respostaAPergunta[i]));
						break;
					case 'audio':
						resposta.appendChild(criaAudio(respostaAPergunta[i]));
						break;
					case 'texto':
						let p = document.createElement('p');
						p.textContent = respostaAPergunta[i]
						resposta.appendChild(p);
						break;
				}
			} else {
				let p = document.createElement('p');
				p.textContent = respostaAPergunta[i]
				resposta.appendChild(p);
			}
		}
		respostaDada = true;
	}
});

btnProxima.addEventListener('click', () => {
	if (respostaDada)
		respostaAPergunta = criaPergunta(dadosPergunta, dadosResposta);
});

const elementoNaLista = (x, lista) => {
	for (let i = 0; i < lista.length; i++) {
		if (lista[i] === x)
			return true;
	}

	return false;
}

btnDica.addEventListener('click', () => {
	let possibilidadeEscolhida;

	if (dicasDadas.length < (listaPossibilidades.length - dadosResposta.length - dadosPergunta.length)) {
		do {
			possibilidadeEscolhida = aleatorioLista(listaPossibilidades);
		} while(elementoNaLista(possibilidadeEscolhida, dicasDadas) || elementoNaLista(possibilidadeEscolhida, dadosResposta) || elementoNaLista(possibilidadeEscolhida, dadosPergunta));

		dicasDadas.push(possibilidadeEscolhida);

		if (listaPossibilidades.length > dadosPergunta.length + 1) {
			switch(tipoPergunta(dadoEscolhido[`${possibilidadeEscolhida}`])) {
				case 'imagem':
					imagens.appendChild(criaImagem(dadoEscolhido[`${possibilidadeEscolhida}`]));
					break;
				case 'audio':
					criaAudio(dadoEscolhido[`${possibilidadeEscolhida}`], audios);
					break;
				case 'texto':
					textos.appendChild(criaTexto(`${mapEscolhido.get(possibilidadeEscolhida)}: ${trataTexto(dadoEscolhido[`${possibilidadeEscolhida}`])}`));
					break;
			}
		}
	} else {
		// alert('Limite de dicas');
	}
	
});

btnJogarBrasil.addEventListener('click', () => {
	let configPerguntas = [... configuracoesBrasil.querySelectorAll('.config-pergunta')];
	let configRespostas = [... configuracoesBrasil.querySelectorAll('.config-resposta')];

	dadosPergunta = [];
	dadosResposta = [];

	for (let i = 0; i < configPerguntas.length; i++) {
		if (configPerguntas[i].checked) {
			dadosPergunta.push(configPerguntas[i].value);
		}
	}
	for (let i = 0; i < configRespostas.length; i++) {
		if (configRespostas[i].checked) {
			dadosResposta.push(configRespostas[i].value);
		}
	}

	listaPossibilidades = possibilidadesBrasil;
	mapEscolhido = mapDadosBrasil;
	dados = dadosBrasil;

	configuracoesBrasil.style.display = 'none';
	configuracoesMundo.style.display = 'none';
	quiz.style.display = 'block';
	respostaAPergunta = criaPergunta(dadosPergunta, dadosResposta);
});

btnJogarMundo.addEventListener('click', () => {
	let configPerguntas = [... configuracoesMundo.querySelectorAll('.config-pergunta')];
	let configRespostas = [... configuracoesMundo.querySelectorAll('.config-resposta')];

	dadosPergunta = [];
	dadosResposta = [];

	for (let i = 0; i < configPerguntas.length; i++) {
		if (configPerguntas[i].checked) {
			dadosPergunta.push(configPerguntas[i].value);
		}
	}
	for (let i = 0; i < configRespostas.length; i++) {
		if (configRespostas[i].checked) {
			dadosResposta.push(configRespostas[i].value);
		}
	}

	listaPossibilidades = possibilidadesMundo;
	mapEscolhido = mapDadosMundo;
	dados = dadosMundo;

	configuracoesBrasil.style.display = 'none';
	configuracoesMundo.style.display = 'none';
	quiz.style.display = 'block';
	respostaAPergunta = criaPergunta(dadosPergunta, dadosResposta);
});