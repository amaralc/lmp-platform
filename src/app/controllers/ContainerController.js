/* --------------------------------- IMPORTS ---------------------------------*/
/** Importa tudo de yup como Yup (dependencia nao tem export default) */
import * as Yup from 'yup';
import Container from '../models/Container';

/* --------------------------------- CONTENT ---------------------------------*/
class ContainerController {
  /**
   * Metodo store com mesma face de um middleware no node.
   * Recebe dados do usuario e cria novo registro dentro da base de dados.
   */
  async store(req, res) {
    /** Define schema to validate req.body prior to 'store()' data */
    const schema = Yup.object().shape({
      /** Attribute 'description' is a required string */
      description: Yup.string().required(),
      /** Attribute 'number' is a required number */
      number: Yup.number().required(),
      /** Attribute 'room_id' is a required number */
      room_id: Yup.number().required(),
    });

    /** If 'req.body' do not attend to the schema requirements (is not valid) */
    if (!(await schema.isValid(req.body))) {
      /** Return error status 400 with message 'Validation has failed' */
      return res.status(400).json({ error: 'Validation has failed' });
    }

    const { description, room_id, number } = req.body;

    /**
     * Cria usuario na base de dados usando resposta asincrona e retorna apenas
     * dados uteis.
     */
    const { id, created_by, updated_by } = await Container.create({
      description,
      number,
      room_id,
      created_by: req.userId,
      updated_by: req.userId,
    });

    /** Retorna json apenas com dados uteis ao frontend */
    return res.json({
      id,
      description,
      number,
      room_id,
      created_by,
      updated_by,
    });
  }
}

/* --------------------------------- EXPORTS ---------------------------------*/
export default new ContainerController();
