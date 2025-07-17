// Este arquivo serve como ponto de entrada para o Webpack
// Importa os arquivos JavaScript e CSS principais do projeto

// Importar estilos CSS
import './css/styles.css';

// Importar os scripts principais
import './js/auth.js';
import './js/dashboard.js';

// Log para indicar que o Webpack está funcionando
console.log('Webpack carregado e funcionando! Live-reload ativado.');

// Adicionar suporte para hot module replacement
if (module.hot) {
  module.hot.accept();
} 