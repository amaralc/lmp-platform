/* --------------------------------- IMPORTS ---------------------------------*/
/** Importa ferramenta bee-queue de trabalhos em segundo plano */
import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

/* --------------------------------- CONTENT ---------------------------------*/
/** Cria variável 'jobs' semelhante à variável 'models' do load de models */
const jobs = [CancellationMail];

class Queue {
  constructor() {
    this.queues = {};
    this.init();
  }

  /** Método que inicializa as filas */
  init() {
    /**
     * Acessa propriedades de cada job de forma rápida utilizando
     * desestruturação
     */
    jobs.forEach(({ key, handle }) => {
      /** Seta a chave como key */
      this.queues[key] = {
        /** Armazena fila que tem conexão com redis */
        bee: new Bee(key, {
          /** Faz conexão com o redis */
          redis: redisConfig,
        }),
        /**
         * Armazena o método handle que irá processar o job e realizará
         * as tarefas
         */
        handle,
      };
    });
  }

  /**
   * Método que adiciona novos trabalhos a fila
   * Recebe queue como primeiro parâmetro, indicando para qual fila irá o job
   * Recebe os dados do job como segundo parâmetro
   */
  add(queue, job) {
    /** Adiciona o novo trabalho na fila em background */
    return this.queues[queue].bee.createJob(job).save();
  }

  /** Método que processa as filas */
  processQueue() {
    /** Percorre cada um dos jobs */
    jobs.forEach(job => {
      /** Busca o bee e o handle da fila relacionada ao job */
      const { bee, handle } = this.queues[job.key];
      /** Ouve evento 'failed e retorna handleFailure ou processa normalmente */
      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  /** Método que age em caso de erros */
  handleFailure(job, err) {
    /** Em caso de erro retorna log do nome da fila e o erro */
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}
/* --------------------------------- EXPORTS ---------------------------------*/
export default new Queue();
