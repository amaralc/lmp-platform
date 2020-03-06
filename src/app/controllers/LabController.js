/* --------------------------------- IMPORTS ---------------------------------*/
/** Importa tudo de yup como Yup (dependencia nao tem export default) */
import * as Yup from 'yup';
import Lab from '../models/Lab';

/* --------------------------------- CONTENT ---------------------------------*/
class LabController {
  /**
   * Metodo store com mesma face de um middleware no node.
   * Recebe dados do usuario e cria novo registro dentro da base de dados.
   */
  async store(req, res) {
    /** Define schema to validate req.body prior to 'store()' data */

    const schema = Yup.object().shape({
      /** Attribute 'name' is a required string */
      name: Yup.string().required(),
      /** Attribute 'initials' is a required string */
      initials: Yup.string().required(),
      /** Attribute 'responsible_id' is a required number */
      responsible_id: Yup.number().required(),
      /** Attribute 'physical_adress' is a string */
      physical_adress: Yup.string(),
      /** Attribute 'website_adress' is a url string */
      website_adress: Yup.string().url(),
      /** Attribute 'email_adress' is an email string */
      email_adress: Yup.string().email(),
      /** Attribute 'phone_number' is a number with minimum 11 digits */
      phone_number: Yup.string().min(11),
    });

    /** If 'req.body' do not attend to the schema requirements (is not valid) */
    if (!(await schema.isValid(req.body))) {
      /** Return error status 400 with message 'Validation has failed' */
      return res.status(400).json({ error: 'Validation has failed' });
    }

    /** Pega informações do corpo da requisição */
    const {
      name,
      initials,
      responsible_id,
      physical_adress,
      website_adress,
      email_adress,
      phone_number,
    } = req.body;

    /**
     * Cria Lab na base de dados usando resposta asincrona e retorna apenas
     * dados uteis.
     */
    const lab = await Lab.create({
      name,
      initials,
      responsible_id,
      physical_adress,
      website_adress,
      email_adress,
      phone_number,
      created_by: req.userId,
      updated_by: req.userId,
    });

    /** Retorna json apenas com dados uteis ao frontend */
    return res.json(lab);
  }

  /** Metodo de alteracao dos dados do Lab */
  async update(req, res) {
    /** Define schema to validate req.body prior to 'store()' data */
    const schema = Yup.object().shape({
      /** Attribute 'id' is a required number */
      id: Yup.number().required(),
      /** Attribute 'name' is a string */
      name: Yup.string(),
      /** Attribute 'initials' is a required string */
      initials: Yup.string(),
      /** Attribute 'responsible_id' is a required number */
      responsible_id: Yup.number(),
      /** Attribute 'physical_adress' is a string */
      physical_adress: Yup.string(),
      /** Attribute 'website_adress' is a url string */
      website_adress: Yup.string().url(),
      /** Attribute 'email_adress' is an email string */
      email_adress: Yup.string().email(),
      /** Attribute 'phone_number' is a number with minimum 11 digits */
      phone_number: Yup.number().min(11),
    });

    /** If 'req.body' do not attend to the schema requirements (is not valid) */
    if (!(await schema.isValid(req.body))) {
      /** Return error status 400 with message 'Validation has failed' */
      return res.status(400).json({ error: 'Validation has failed' });
    }

    /** Get current Lab information */
    const lab = await Lab.findByPk(req.body.id);

    /** Pega informações do corpo da requisição */
    const {
      name,
      initials,
      responsible_id,
      physical_adress,
      website_adress,
      email_adress,
      phone_number,
    } = req.body;

    /** If all requirements were met then updates user informaiton */
    const updated_lab = await lab.update({
      name,
      initials,
      responsible_id,
      physical_adress,
      website_adress,
      email_adress,
      phone_number,
      updated_by: req.userId,
    });

    /** Retorna json apenas com dados uteis ao frontend */
    return res.json(updated_lab);
  }
}

/* --------------------------------- EXPORTS ---------------------------------*/
export default new LabController();
