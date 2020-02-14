/* --------------------------------- IMPORTS ---------------------------------*/
import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import Booking from '../models/Booking';
/* --------------------------------- CONTENT ---------------------------------*/
class BookingController {
  async store(req, res) {
    /** Define schema to validate req.body prior to 'store()' data */
    const schema = Yup.object().shape({
      /** Attribute 'equipment_id' is a required number */
      equipment_id: Yup.number().required(),
      /** Attribute 'date' is a required date */
      date: Yup.date().required(),
    });
    /** If 'req.body' do not attend to the schema requirements (is not valid) */
    if (!(await schema.isValid(req.body))) {
      /** Return error status 400 with message 'Validation has failed' */
      return res.status(400).json({ error: 'Validation has failed' });
    }

    const { equipment_id, date } = req.body;

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permit' });
    }

    const checkAvailability = await Booking.findOne({
      where: {
        equipment_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res.status(400).json({ error: 'Booking date are not permit' });
    }

    const booking = await Booking.create({
      user_id: req.userId,
      equipment_id,
      date,
    });

    return res.json(booking);
  }
}
/* --------------------------------- EXPORTS ---------------------------------*/

export default new BookingController();
