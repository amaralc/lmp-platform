/* --------------------------------- IMPORTS ---------------------------------*/
import Tool from '../models/Tool';

/* --------------------------------- CONTENT ---------------------------------*/
class ToolController {
  /**
   * Metodo store com mesma face de um middleware no node.
   * Recebe dados da Ferramenta e cria novo registro dentro da base de dados.
   */

  async store(req, res) {
    /**
     * Cria ferramenta na base de dados usando resposta asincrona e retorna apenas
     * dados uteis.
     */
    const {
      id,
      tool,
      fit_type,
      milling_cutter_type,
      external_type,
      thickness,
      internal_type,
    } = await Tool.create(req.body);
    /** Retorna json apenas com dados uteis ao frontend */
    return res.json({
      id,
      tool,
      fit_type,
      milling_cutter_type,
      external_type,
      thickness,
      internal_type,
    });
  }
}

/* --------------------------------- EXPORTS ---------------------------------*/

export default new ToolController();
