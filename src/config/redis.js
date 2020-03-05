/* --------------------------------- EXPORTS ---------------------------------*/
/** Exporta configurações do redis */
export default {
  /** Host que o redis roda por padrão */
  host: process.env.REDIS_HOST,
  /**
   * Porta padrão do redis
   */
  port: process.env.REDIS_PORT,
};
