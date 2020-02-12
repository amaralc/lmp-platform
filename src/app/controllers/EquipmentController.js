/* --------------------------------- IMPORTS ---------------------------------*/
/** Importa tudo de yup como Yup (dependencia nao tem export default) */
import * as Yup from 'yup';
import Equipment from '../models/Equipment';

/* --------------------------------- CONTENT ---------------------------------*/
class EquipmentController {
  /**
   * Metodo store com mesma face de um middleware no node.
   * Recebe dados do usuario e cria novo registro dentro da base de dados.
   */
  async store(req, res) {
    /** Define schema to validate req.body prior to 'store()' data */
    const schema = Yup.object().shape({
      /** Attribute 'category' is a required string */
      category: Yup.string().required(),
      /** Attribute 'equipment_name' is a required string */
      equipment_name: Yup.string().required(),
      /** Attribute 'company' is a required string */
      company: Yup.string().required(),
      /** Attribute 'model' is a required string */
      model: Yup.string().required(),
      /** Attribute 'ufsc_patrimony' is a required number */
      ufsc_patrimony: Yup.number().required(),
      /** Attribute 'feesc_patrimony' is a required number */
      feesc_patrimony: Yup.number().required(),
      /** Attribute 'color' is a required string */
      color: Yup.string().required(),
      /** Attribute 'serial_number' is a required string */
      serial_number: Yup.string().required(),
      /** Attribute 'comments' is a required string */
      comments: Yup.string().required(),
      /** Attribute 'state' is a required string */
      state: Yup.string().required(),
      /** Attribute 'image' is a required number */
      image: Yup.string().required(),
    });

    /** If 'req.body' do not attend to the schema requirements (is not valid) */
    if (!(await schema.isValid(req.body))) {
      /** Return error status 400 with message 'Validation has failed' */
      return res.status(400).json({ error: 'Validation has failed' });
    }

    /** Verifica se o valor de ufsc_patrimony do corpo da requisicao ja existe */
    const ufsc_patrimonyExists = await Equipment.findOne({
      where: { ufsc_patrimony: req.body.ufsc_patrimony },
    });
    /** Se valor de ufsc_patrimony ja existir, retorna erro */
    if (ufsc_patrimonyExists) {
      return res
        .status(400)
        .json({ error: 'UFSC Patrimony number already exists.' });
    }

    /** Verifica se o valor de feesc_patrimony do corpo da requisicao ja existe */
    const feesc_patrimonyExists = await Equipment.findOne({
      where: { feesc_patrimony: req.body.feesc_patrimony },
    });
    /** Se valor de feesc_patrimony ja existir, retorna erro */
    if (feesc_patrimonyExists) {
      return res
        .status(400)
        .json({ error: 'FEESC Patrimony number already exists.' });
    }
    /**
     * Cria usuario na base de dados usando resposta asincrona e retorna apenas
     * dados uteis.
     */
    const {
      id,
      category,
      equipment_name,
      company,
      model,
      ufsc_patrimony,
      feesc_patrimony,
      color,
      serial_number,
      comments,
      state,
      image,
    } = await Equipment.create(req.body);

    /** Retorna json apenas com dados uteis ao frontend */
    return res.json({
      id,
      category,
      equipment_name,
      company,
      ufsc_patrimony,
      feesc_patrimony,
      model,
      color,
      serial_number,
      comments,
      state,
      image,
    });
  }

  /** Metodo de alteracao dos dados do usuario */
  async update(req, res) {
    /** Define schema to validate req.body prior to 'store()' data */
    const schema = Yup.object().shape({
      /** Attribute 'id' */
      id: Yup.number().required(),
      /** Attribute 'category' is a required string */
      category: Yup.string(),
      /** Attribute 'equipment_name' is a required string */
      equipment_name: Yup.string(),
      /** Attribute 'company' is a required string */
      company: Yup.string(),
      /** Attribute 'model' is a required string */
      model: Yup.string(),
      /** Attribute 'ufsc_patrimony' is a required number */
      ufsc_patrimony: Yup.number(),
      /** Attribute 'feesc_patrimony' is a required number */
      feesc_patrimony: Yup.number(),
      /** Attribute 'color' is a required string */
      color: Yup.string(),
      /** Attribute 'serial_number' is a required string */
      serial_number: Yup.string(),
      /** Attribute 'comments' is a required string */
      comments: Yup.string(),
      /** Attribute 'state' is a required string */
      state: Yup.string(),
      /** Attribute 'image' is a required number */
      image: Yup.string(),
    });
    /** If 'req.body' do not attend to the schema requirements (is not valid) */
    if (!(await schema.isValid(req.body))) {
      /** Return error status 400 with message 'Validation has failed' */
      return res.status(400).json({ error: 'Validation has failed' });
    }

    const equipment = await Equipment.findByPk(req.body.id);

    /** If all requirements were met then updates user informaiton */
    const {
      id,
      category,
      equipment_name,
      company,
      model,
      ufsc_patrimony,
      feesc_patrimony,
      color,
      serial_number,
      comments,
      state,
      room_id,
      image,
    } = await equipment.update(req.body);

    /** Retorna json apenas com dados uteis ao frontend */
    return res.json({
      id,
      category,
      equipment_name,
      company,
      model,
      ufsc_patrimony,
      feesc_patrimony,
      color,
      serial_number,
      comments,
      state,
      room_id,
      image,
    });
  }
}

/* --------------------------------- EXPORTS ---------------------------------*/
export default new EquipmentController();
