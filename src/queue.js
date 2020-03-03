/* --------------------------------- IMPORTS ---------------------------------*/
import Queue from './lib/Queue';

/* --------------------------------- CONTENT ---------------------------------*/
/**
 * Permite com que as filas sejam processadas separadas da aplicação
 * É possível que um terminal rode a aplicação e um segundo terminal
 * rode as filas (utilizando o comando: yarn queue)
 */
Queue.processQueue();
