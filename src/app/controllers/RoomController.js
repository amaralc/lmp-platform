/* --------------------------------- IMPORTS ---------------------------------*/
/** Importa tudo de yup como Yup (dependencia nao tem export default) */

import * as Yup from 'yup';
import Room from '../models/Room';

/* --------------------------------- CONTENT ---------------------------------*/

class RoomController {
  /**
   * Metodo store com mesma face de um middleware no node.
   * Recebe dados da sala e cria novo registro dentro da base de dados.
   */
  async store(req, res) {
    /** Define schema to validate req.body prior to 'store()' data */
    const schema = Yup.object().shape({
      /** Attribute 'number' is a required number */
      number: Yup.number().required(),
      /** Attribute 'description' is a required number */
      description: Yup.string().required(),
      /** Attribute 'lab_id' is required a number */
      lab_id: Yup.number().required(),
    });

    /** If 'req.body' do not attend to the schema requirements (is not valid) */
    if (!(await schema.isValid(req.body))) {
      /** Return error status 400 with message 'Validation has failed' */
      return res.status(400).json({ error: 'Validation has failed' });
    }

    /** Verifica se a sala do corpo da requisicao ja existe */
    const roomExists = await Room.findOne({
      where: { number: req.body.number },
    });

    /** Se a sala ja existir, retorna erro */
    if (roomExists) {
      return res.status(400).json({ error: 'Room already exists!' });
    }
    const { number, description, lab_id } = req.body;
    /**
     * Cria sala na base de dados usando resposta asincrona e retorna apenas
     * dados uteis.
     */

    const { id, created_by, updated_by } = await Room.create({
      number,
      description,
      lab_id,
      created_by: req.userId,
      updated_by: req.userId,
    });
    /** Retorna json apenas com dados uteis ao frontend */
    return res.json({
      id,
      number,
      description,
      lab_id,
      created_by,
      updated_by,
    });
  }

  /** Metodo de alteracao dos dados da sala */
  async update(req, res) {
    /** Define schema to validate req.body prior to 'update()' method */
    const schema = Yup.object().shape({
      /** Attribute 'id' */
      id: Yup.number().required(),
      /** Attribute 'number' is a required number */
      number: Yup.number(),
      /** Attribute 'description' is a required string */
      description: Yup.string(),
      /** Attribute 'lab_id' is a number */
      lab_id: Yup.number(),
    });
    /** If 'req.body' do not attend to the schema requirements (is not valid) */
    if (!(await schema.isValid(req.body))) {
      /** Return error status 400 with message 'Validation has failed' */
      return res.status(400).json({ error: 'Validation has failed' });
    }

    const { number, description, lab_id } = req.body;

    /** Get current room information */
    const room = await Room.findByPk(req.body.id);

    /** If all requirements were met then updates room information */
    const { id, updated_by } = await room.update({
      number,
      description,
      lab_id,
      updated_by: req.userId,
    });

    /** Retorna json apenas com dados uteis ao frontend */
    return res.json({
      id,
      number,
      description,
      lab_id,
      updated_by,
    });
  }
}

/* --------------------------------- EXPORTS ---------------------------------*/
export default new RoomController();
