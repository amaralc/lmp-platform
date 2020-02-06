/* --------------------------------- IMPORTS ---------------------------------*/
import Equipment from '../models/Equipment';
/* --------------------------------- CONTENT ---------------------------------*/
class EquipmentController {
  async store(req, res) {
    const equipmentExists = await Equipment.findOne({
      where: { ufsc_patrimony: req.body.ufsc_patrimony },
    });

    if (equipmentExists) {
      return res.status(400).json({ error: 'Equipment already exists.' });
    }

    const equipmentExists2 = await Equipment.findOne({
      where: { feesc_patrimony: req.body.feesc_patrimony },
    });

    if (equipmentExists2) {
      return res.status(400).json({ error: 'Equipment already exists.' });
    }

    const equipment = await Equipment.create(req.body);

    return res.json(equipment);
  }
}
/* --------------------------------- EXPORTS ---------------------------------*/
export default new EquipmentController();
