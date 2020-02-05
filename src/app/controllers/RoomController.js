/* --------------------------------- IMPORTS ---------------------------------*/
import Room from '../models/Room';

/* --------------------------------- CONTENT ---------------------------------*/
class RoomController {
  /**
   * Metodo store com mesma face de um middleware no node.
   * Recebe dados da sala e cria novo registro dentro da base de dados.
   */
  async store(req, res) {
    /** Verifica se sala do corpo da requisicao ja existe */
    const roomExists = await Room.findOne({
      where: { number: req.body.number },
    });

    /** Se sala ja existir, retorna erro */
    if (roomExists) {
      return res.json({ error: 'Room already exists!' });
    }

    /**
     * Cria sala na base de dados usando resposta asincrona e retorna apenas
     * dados uteis.
     */
    const { id, number, lab, description } = await Room.create(req.body);

    /** Retorna json apenas com dados uteis ao frontend */
    return res.json({
      id,
      number,
      lab,
      description,
    });
  }
}

/* --------------------------------- EXPORTS ---------------------------------*/
export default new RoomController();
