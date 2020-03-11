/* --------------------------------- IMPORTS ---------------------------------*/
/** Importa tudo de yup como Yup (dependencia nao tem export default) */

import * as Yup from 'yup';
import Tool from '../models/Tool';

/* --------------------------------- CONTENT ---------------------------------*/

/* ----- CADASTRO DA FERRAMENTA (POST) ----- */

class ToolController {
  /**
   * Metodo store com mesma face de um middleware no node.
   * Recebe dados do Ferramenta e cria novo registro dentro da base de dados.
   */
  async store(req, res) {
    /** Define schema to validate req.body prior to 'store()' data */
    const schema = Yup.object().shape({
      /** Attribute 'tool' is a required string */
      tool_name: Yup.string().required(),
      /** Attribute 'fit_type' is a required string */
      fit_type: Yup.string().required(),
      /** Attribute 'milling_cutter_type' is a required string */
      milling_cutter_type: Yup.string().required(),
      /** Attribute 'external_diameter' is a required number */
      external_diameter: Yup.number().required(),
      /** Attribute 'thickness' is a required number */
      thickness: Yup.number().required(),
      /** Attribute 'internal_diameter' is a required number */
      internal_diameter: Yup.number().required(),
      /** Attribute 'container_id' is a required number */
      container_id: Yup.number().required(),
    });
    /** If 'req.body' do not attend to the schema requirements (is not valid) */
    if (!(await schema.isValid(req.body))) {
      /** Return error status 400 with message 'Validation has failed' */
      return res.status(400).json({ error: 'Validation has failed' });
    }

    const {
      tool_name,
      fit_type,
      milling_cutter_type,
      external_diameter,
      thickness,
      internal_diameter,
      container_id,
    } = req.body;

    /**
     * Cria Ferramenta na base de dados usando resposta asincrona e retorna apenas
     * dados uteis.
     */
    const { id, created_by, updated_by } = await Tool.create({
      tool_name,
      fit_type,
      milling_cutter_type,
      external_diameter,
      thickness,
      internal_diameter,
      container_id,
      created_by: req.userId,
      updated_by: req.userId,
    });
    /** Retorna json apenas com dados uteis ao frontend */
    return res.json({
      id,
      tool_name,
      fit_type,
      milling_cutter_type,
      external_diameter,
      thickness,
      internal_diameter,
      container_id,
      created_by,
      updated_by,
    });
  }

  /** Metodo de alteracao dos dados da ferramenta */
  async update(req, res) {
    /** Define schema to validate req.body prior to 'update()' method */
    const schema = Yup.object().shape({
      /** Attribute 'id' */
      id: Yup.number().required(),
      /** Attribute 'tool_name' is a string */
      tool_name: Yup.string(),
      /** Attribute 'fit_type' is a string */
      fit_type: Yup.string(),
      /** Attribute 'milling_cutter_type' is a string */
      milling_cutter_type: Yup.string(),
      /** Attribute 'new_external_diameter' is a number */
      external_diameter: Yup.number(),
      /** Attribute 'new_thickness' is a number */
      thickness: Yup.number(),
      /** Attribute 'new_internal_diameter' is a number */
      internal_diameter: Yup.number(),
    });
    /** If 'req.body' do not attend to the schema requirements (is not valid) */
    if (!(await schema.isValid(req.body))) {
      /** Return error status 400 with message 'Validation has failed' */
      return res.status(400).json({ error: 'Validation has failed' });
    }

    const {
      tool_name,
      fit_type,
      milling_cutter_type,
      external_diameter,
      thickness,
      internal_diameter,
      container_id,
    } = req.body;

    /** Get current tool information */
    const tool = await Tool.findByPk(req.body.id);

    /** If all requirements were met then updates tool information */
    const { id, updated_by } = await tool.update({
      tool_name,
      fit_type,
      milling_cutter_type,
      external_diameter,
      thickness,
      internal_diameter,
      container_id,
      updated_by: req.userId,
    });

    /** Retorna json apenas com dados uteis ao frontend */
    return res.json({
      id,
      tool_name,
      fit_type,
      milling_cutter_type,
      external_diameter,
      thickness,
      internal_diameter,
      container_id,
      updated_by,
    });
  }
}

/* --------------------------------- EXPORTS ---------------------------------*/
export default new ToolController();
