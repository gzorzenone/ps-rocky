const fs = require('fs');
const _ = require('lodash');

function lerArquivo(endArq) {
	return JSON.parse(fs.readFileSync(endArq));
}

function corrigirNomes(produtos) {
	let qtdeProdutos = Object.keys(produtos).length;

	for(let i = 0; i < qtdeProdutos; i++) {
		produtos[i]["name"] = produtos[i]["name"].replace(/æ/gi, "a");
		produtos[i]["name"] = produtos[i]["name"].replace(/¢/gi, "c");
		produtos[i]["name"] = produtos[i]["name"].replace(/ø/gi, "o");
		produtos[i]["name"] = produtos[i]["name"].replace(/ß/gi, "b");	
	}
	
	return produtos;
}

function corrigirPrecos(produtos) {
	let qtdeProdutos = Object.keys(produtos).length;

	for(let i = 0; i < qtdeProdutos; i++) {
		produtos[i]["price"] = Number(produtos[i]["price"]);
	}

	return produtos;
}

function corrigirQuantidades(produtos) {
	let qtdeProdutos = Object.keys(produtos).length;

	for(let i = 0; i < qtdeProdutos; i++) {
		if(!(produtos[i].hasOwnProperty("quantity"))) {
			produtos[i]["quantity"] = 0;
		}
	}

	return produtos;
}

function exportarArquivo(endArq) {
	let prodOriginal, prodNomesCor, prodPrecCor, prodQtdesCor;

	prodOriginal = lerArquivo(endArq);
	prodNomesCor = corrigirNomes(prodOriginal);
	prodPrecCor = corrigirPrecos(prodNomesCor);
	prodQtdesCor = corrigirQuantidades(prodPrecCor);

	fs.writeFileSync('saida.json', JSON.stringify(prodQtdesCor, null, 2));
}

function imprimirListaProdutos(nomeArq) {
	let produtos = lerArquivo(nomeArq);
	let qtdeProdutos = Object.keys(produtos).length;

	produtos.sort(function(a, b) {
		let categoryA = a.category.toUpperCase();
		let categoryB = b.category.toUpperCase();

		if(categoryA < categoryB) {
			return -1;
		}
		else if(categoryA > categoryB) {
			return 1;
		}
		else {
			return a.id - b.id;
		}
	});

	for(let i = 0; i < qtdeProdutos; i++) {
		console.log(produtos[i]["name"]);
	}
}

function calcularValorEstoque(nomeArq) {
	let produtos = lerArquivo(nomeArq);
	let prodCat = _.groupBy(produtos, "category");
	let qtdeCategorias = Object.keys(prodCat).length;
	let categorias = Object.keys(prodCat);

	for(let cat = 0; cat < qtdeCategorias; cat++) {
		let qtdeProdutos = prodCat[categorias[cat]].length;
		let valTotCat = 0;
		for(let prod = 0; prod < qtdeProdutos; prod++) {
			valTotCat += prodCat[categorias[cat]][prod]["quantity"] * prodCat[categorias[cat]][prod]["price"];
		}
		console.log(categorias[cat] + ": R$" + valTotCat.toFixed(2));
	}
}

exportarArquivo('broken-database.json');

console.log("Lista de produtos:\n");
imprimirListaProdutos('saida.json');
console.log("\nValor total de cada categoria:\n");
calcularValorEstoque('saida.json');