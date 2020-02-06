/* --------------------------------- IMPORTS ---------------------------------*/
import Machine from '../models/Machine';
/* --------------------------------- CONTENT ---------------------------------*/
class MachineController {
  async store(req, res) {
    const equipmentExists = await Machine.findOne({
      where: { ufsc_patrimony: req.body.ufsc_patrimony },
    });

    if (equipmentExists) {
      return res.status(400).json({ error: 'Machine already exists.' });
    }

    const equipmentExists2 = await Machine.findOne({
      where: { feesc_patrimony: req.body.feesc_patrimony },
    });

    if (equipmentExists2) {
      return res.status(400).json({ error: 'Machine already exists.' });
    }

    const equipment = await Machine.create(req.body);

    return res.json(equipment);
  }
}
/* --------------------------------- EXPORTS ---------------------------------*/
export default new MachineController();
