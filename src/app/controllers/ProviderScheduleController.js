import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';
import User from '../models/User';

class ProviderScheduleController {
  async index(req, res) {
    /** Busca o usuário no banco de dados para checar se é um provider */
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    /** Checa se o usuário logado é um provider */
    if (!checkUserProvider) {
      return res.statur(401).json({ error: 'User is not a provider' });
    }

    const { date } = req.query;
    const parsedDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
      order: ['date'],
    });
    return res.json(appointments);
  }
}

export default new ProviderScheduleController();
