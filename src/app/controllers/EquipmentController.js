/* --------------------------------- IMPORTS ---------------------------------*/
import Equipment from '../models/Equipment';
/* --------------------------------- CONTENT ---------------------------------*/
class EquipmentController {
  // Método Store: receberá dados pelo body e registrará novo equipamento no database...
  async store(req, res) {
    // ... Verifica se já existe dentro da database algum cadastro que possua o mesmo valor em ufsc_patrimony...
    const ufsc_patrimonyExists = await Equipment.findOne({
      where: { ufsc_patrimony: req.body.ufsc_patrimony },
    });

    // ... Caso exista, recusa o novo registro e retorna uma mensagem de erro informando que tal equipamento já está cadastrado...
    if (ufsc_patrimonyExists) {
      return res
        .status(400)
        .json({ error: 'UFSC Patrimony number already exists.' });
    }

    // Faz a mesma consulta para a variável feesc_patrimony...
    const feesc_patrimonyExists = await Equipment.findOne({
      where: { feesc_patrimony: req.body.feesc_patrimony },
    });

    // ... E retorna o erro caso exista.
    if (feesc_patrimonyExists) {
      return res
        .status(400)
        .json({ error: 'FEESC Patrimony number already exists.' });
    }

    // Caso o equipamento não exista na database, ele é registrado...
    const equipment = await Equipment.create(req.body);

    // ... E retorna-se os valores registrados.
    return res.json(equipment);
  }

  // Método Update: receberá os dados pelo body, verificará se tal equipamento existe e atualizará suas informações
  async update(req, res) {
    const {
      ufsc_patrimony,
      feesc_patrimony,
      old_ufsc_patrimony,
      old_feesc_patrimony,
    } = req.body;

    // Primeiro consulta para verificar existência do equipamento pelo ID...
    const equipment = await Equipment.findByPk(req.body.id);

    // ... Verifica se já existe dentro da database algum cadastro que possua o mesmo valor em ufsc_patrimony...
    if (ufsc_patrimony !== equipment.ufsc_patrimony) {
      const ufsc_patrimonyExists = await Equipment.findOne({
        where: { ufsc_patrimony },
      });
      // ... Caso exista, recusa o novo registro e retorna uma mensagem de erro informando que tal equipamento já está cadastrado...
      if (ufsc_patrimonyExists) {
        return res
          .status(400)
          .json({ error: 'UFSC Patrimony number already exists.' });
      }
    }

    // ... Verifica se já existe dentro da database algum cadastro que possua o mesmo valor em feesc_patrimony...
    if (feesc_patrimony !== equipment.feesc_patrimony) {
      const feesc_patrimonyExists = await Equipment.findOne({
        where: { feesc_patrimony },
      });

      // ... Caso exista, recusa o novo registro e retorna uma mensagem de erro informando que tal equipamento já está cadastrado...
      if (feesc_patrimonyExists) {
        return res
          .status(400)
          .json({ error: 'FEESC Patrimony number already exists.' });
      }
    }
    /*
    if (
      old_ufsc_patrimony &&
      (await equipment.ufsc_patrimony) !== (await res.body.old_ufsc_patrimony)
    ) {
      return res.status(401).json({ error: 'UFSC Patrimony does not match' });
    }

    if (
      old_feesc_patrimony &&
      !(await equipment.checkPassword(old_feesc_patrimony))
    ) {
      return res.status(401).json({ error: 'FEESC Patrimony does not match' });
    }
    */

    // Caso o equipamento exista e tenha passado pelas validações, ele é atualizado no database...
    const {
      id,
      category,
      equipment_name,
      company,
      model,
      color,
      serial_number,
      comments,
      state,
      room_id,
      image,
    } = await equipment.update(req.body);

    // E retorna os valores registrados.
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
      old_ufsc_patrimony,
      old_feesc_patrimony,
    });
  }
}
/* --------------------------------- EXPORTS ---------------------------------*/
export default new EquipmentController();
