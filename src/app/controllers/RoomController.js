/* --------------------------------- IMPORTS ---------------------------------*/
/** Importa tudo de yup como Yup (dependencia nao tem export default) */

import * as Yup from 'yup';
import Room from '../models/Room';

/* --------------------------------- CONTENT ---------------------------------*/

/* ----- CADASTRO DA SALA (POST) ----- */

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
      /** Attribute 'lab' is a required number */
      lab: Yup.number().required(),
      /** Attribute 'description' is a required string */
      description: Yup.string().required(),
      /** Attribute 'container' is a required number */
      containers: Yup.number().required(),
    });

    /** If 'req.body' do not attend to the schema requirements (is not valid) */
    if (!(await schema.isValid(req.body))) {
      /** Return error status 400 with message 'Validation has failed' */
      return res.status(400).json({ error: 'Validation has failed' });
    }

    /**
     * Cria sala na base de dados usando resposta asincrona e retorna apenas
     * dados uteis.
     */

    const { id, number, lab, description, container } = await Room.create(
      req.body
    );
    /** Retorna json apenas com dados uteis ao frontend */
    return res.json({
      id,
      number,
      lab,
      description,
      container,
    });
  }
}

/* --------------------------------- EXPORTS ---------------------------------*/
export default new RoomController();
