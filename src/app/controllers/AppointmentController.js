/* --------------------------------- IMPORTS ---------------------------------*/
import * as Yup from 'yup';
import User from '../models/User';
import Appointment from '../models/Appointment';

/* --------------------------------- CONTENT ---------------------------------*/
/**
 * Metodo store com mesma face de um middleware no node.
 * Recebe dados provider_id e date e cria novo registro de agendamento dentro da base de dados.
 */
class AppointmentController {
  async store(req, res) {
    /** Define schema to validate req.body prior to 'store()' data */
    const schema = Yup.object().shape({
      /** Attribute 'provider_id' is a required number */
      provider_id: Yup.number().required(),
      /** Attribute 'date' is a required date with a valid date format */
      date: Yup.date().required(),
    });

    /** If 'req.body' do not attend to the schema requirements (is not valid) */
    if (!(await schema.isValid(req.body))) {
      /** Return error status 400 with message 'Validation fails' */
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { provider_id, date } = req.body;

    /**
     * Check if 'provider_id' is a provider
     */

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    /** Se 'isProvider' retornar false, será retornado um erro. */
    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }

    /** Cria agendamento na base de dados usando resposta asincrona e retorna a confirmação dos dados. */

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    return res.json(appointment);
  }
}
/* --------------------------------- EXPORTS ---------------------------------*/
export default new AppointmentController();
